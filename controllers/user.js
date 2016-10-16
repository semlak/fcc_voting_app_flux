var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var app = require('./index')
var isLoggedIn = app.isLoggedIn
var path = require('path')



	/* Note:
			There is a one-to-one correspondence between an user and account (well, between an authorized user and an account).
			The server application model does not have a user object, just an account.
			Each account holds the information for that 'user'.
			Accounts only exist for an authorized user. Anonymous users do not have accounts.

			When the server is providing a list of 'users', it is actually providing a list of accounts,
			with some information (password hashes, salts) filtered out.
	*/

var reqUserInfo = function(account) {
	if (account == undefined || account == null || account.username == null) {
		return null
	}
	else {
		return {
			username: account.username,
			fullname: account.fullname,
			role: account.role,
			id: account._id
		}
	}
}


/* GET users listing. */
// router.get('/', isLoggedIn, function(req, res, next) {
router.get('/users/', function(req, res, next) {

	// console.log('received request for user listing in user controller')
	// console.log('dirname')
	// console.log(__dirname)
	// console.log('file is ', path.join(__dirname, '..', 'public', 'index.html'))
	// console.log('request is ', req.headers)
	var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';
	// console.log('xhr is ', req.xhr,', other is ', req.headers.accept.indexOf('json') > -1, ', isAjaxRequest', isAjaxRequest)
	console.log('\nisAjaxRequest:', isAjaxRequest)
	Account.find(function(err, accounts) {
		if (err) {
			res.json(err)
		}
		else {
			// usernames=accounts.map(account => account.username)

			//return list of users to client. Need to scrub account listing
			// var users = accounts.map(function(account) {
			// 	return {
			// 		username: account.username,
			// 		fullname: account.fullname,
			// 		role: account.role,
			// 		id: account._id
			// 	}
			// })

			if (isAjaxRequest) {

				res.json({error: false, users: accounts, message: 'Successfully retrieved users.', user: reqUserInfo(req.user)})
			}

			else {
				// app.use(express.static(path.join(__dirname, 'public')))
				// res.sendFile(path.join(__dirname, '..' ,'public', 'index.html'))
				 // res.render('index', {user: reqUserInfo(req.user), usernames: usernames, userToRender: false, title: 'Express' })
				 res.render('index', {title: 'Express' })
			}
		}
	});

	// Account.find(function(err, accounts) {
	// 	usernames=accounts.map(account => account.username)
	// 	res.render('user', {user: reqUserInfo(req.user), usernames: usernames, userToRender: false, title: 'Express' })
	// });
  // res.send('respond with a resource');
});

// router.get('/:username', isLoggedIn, function(req, res, next) {
// router.get('/users/:username', function(req, res, next) {
// 	// console.log("is logged in", isLoggedIn)
// 	// This is the user profile that any registered user will be able to view.
// 	// Ideally provide more actions is the client is viewing their own user profile

// 		var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';
// 		if (isAjaxRequest) {
// 			Account.findOne({username: req.params.username}, function(err, userToRender) {
// 				if (err) {
// 					console.log("error when searching by username", err);
// 					// res.redirect('/',  { error : err.message })
// 					res.json(err);
// 				}
// 				else {
// 					// if (userToRender.length != 1) {
// 					// 	console.log("this isn't supposed to happen")
// 					// }
// 					console.log("rendering user", userToRender);
// 					// app.use(express.static(path.join(__dirname, 'public')))
// 					res.json({userToRender: userToRender, user: reqUserInfo(req.user)})

// 					// res.render('user', {user: reqUserInfo(req.user), userToRender: userToRender, usernames: false, title: 'Express' });
// 					// res.render('index', {title: 'Express' });
// 				}
// 			});
// 		}
// 		else {
// 			res.render('index', {title: 'Express' });
// 				// res.sendFile(path.join(__dirname ,'public', 'index.html'))

// 		}

// });


var updatePassword = function(username, password, cb) {
	Account.findByUsername(username, function(err, account) {
		if (err) {
			cb(err)
		}
		else {
			account.setPassword(password, function(err1, account1) {
				if (err1) {
					cb (err1)
				}
				else {
					account1.save(function(err2) {
						if (err2) {
							cb(err2)
						}
						else {
							console.log('Account saved with new password.')
						}
					})
				}
			})
		}
	})
}


//note, this currently will create an error if we try to update the user password and another property (both will try to have the server respond).
var updateUser = function(user_id, attributes, cb) {
	Account.findById(user_id, function(err, account) {
		if (err) cb(err)
		else {
			if (attributes.password) {
				account.setPassword(attributes.password, function(err1, account1) {
					if (err1) {
						cb (err1)
					}
					else {
						account1.save(function(err2) {
							if (err2) {
								cb(err2)
							}
							else {
								cb(null, {message: 'Account saved with new password.', user: reqUserInfo(account1)})
							}
						})
					}
				})
			}
			else {
				Object.keys(attributes).forEach(function(attrib) {
					if (attributes[attrib]) {
						if (attrib != 'password' && attrib != 'current_password') {
							account[attrib] = attributes[attrib]
						}
					}
				})
				account.save(function(err2) {
					if (err2) {
						cb(err2)
					}
					else {
						cb(null, {message: 'Account saved.', user: account})
					}
				})
			}
		}
	})
}



//update property of specific user. Can only be done by admin or by the specific user.
//note, this currently will create an error if we try to update the user password and another property (both will try to have the server respond).
router.post('/users/:user_id', function(req, res, next) {

// router.post(':username', function(req, res, next) {
	var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';

	console.log("trying to update user account. req.body is ", req.body)
	if (!req.isAuthenticated()) {
		console.log("in 'if' branch of user UPDATE request")
		var message = "User update can only be performed by authenticated user.";
		console.log(message);
		res.json({message: message });
	}
	else if (req.user._id != req.params.user_id && req.user.role != 'admin') {
		console.log("in 'else if 0' branch of user UPDATE request")
		var message = 'User update can only be performed by the same user or by an admin user.';
		console.log(message);
		res.json({message: message });
	}
	else if (req.body.new_role == 'admin' && req.user.role != 'admin') {
		console.log("in 'else if 1' branch of user UPDATE request")
		var message = "User role update can only be changed to 'admin' by a current admin";
		console.log(message);
		res.json({message: message });
	}
	else if (req.body.new_role != null && req.body.new_role != 'admin' && req.body.new_role != 'user') {
		console.log("in 'else if 2' branch of user UPDATE request")
		message = "User role can only be 'admin' or 'user.'";
		console.log(message);
		res.json({message: message });
	}
	else {
		console.log("in else branch of user UPDATE request")
		var cb = function(response) {

			res.json (response)
		}
		var updates = {}
		updates.user_to_update = req.params.user_id || null; //this should not be null, otherwise this route would not trigger.
		updates.role = req.body.new_role || null;
		updates.fullname = req.body.new_fullname || null;
		// updates.email = req.body.new_email|| null;
		updates.password = req.body.new_password|| null;
		updates.username = req.body.new_username|| null;
		updates.current_password = req.body.current_password || null;

		// email should be validated
		// if (updates.password) {
		// 	updatePassword('semlak', 'semlak', function(blah1, blah2) {
		// 		res.json({blah1, blah2})
		// 	});
		// }
		// else if ()
		console.log('updates are', updates)
		var cb = function(err, output) {
			if (err) {
				res.json(err)
			}
			else {
				res.json(output)
			}
		}
		if (updates.user_to_update) {
			updateUser(updates.user_to_update, updates, cb)
		}

		// changePassword('se', 'blah', function(blah) { console.log(blah)}  )
		// res.json({})
		// console.log('account is ', Account)
	}
});

// router.get('/login', function(req, res) {
// 	res.render('login', {user:reqUserInfo(req.user) });
// });

// router.post('/login', passport.authenticate('local'), function(req, res) {
// 	res.redirect('/');
// });




module.exports = router;
