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

				res.json({error: false, users: accounts, message: 'Success', user: reqUserInfo(req.user)})
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
router.get('/users/:username', function(req, res, next) {
	// console.log("is logged in", isLoggedIn)
	// This is the user profile that any registered user will be able to view.
	// Ideally provide more actions is the client is viewing their own user profile

		var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';
		if (isAjaxRequest) {
			Account.findOne({username: req.params.username}, function(err, userToRender) {
				if (err) {
					console.log("error when searching by username", err);
					res.redirect('/',  { error : err.message })
				}
				else {
					// if (userToRender.length != 1) {
					// 	console.log("this isn't supposed to happen")
					// }
					console.log("rendering user", userToRender);
					// app.use(express.static(path.join(__dirname, 'public')))
					res.json({userToRender: userToRender, user: reqUserInfo(req.user)})

					// res.render('user', {user: reqUserInfo(req.user), userToRender: userToRender, usernames: false, title: 'Express' });
					// res.render('index', {title: 'Express' });
				}
			});
		}
		else {
			res.render('index', {title: 'Express' });
				// res.sendFile(path.join(__dirname ,'public', 'index.html'))

		}

});


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

var updateUser = function(username, attributes, cb) {
	Account.findByUsername(username, function(err, account) {
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
								cb(null, {message: 'Account saved with new password.'})
							}
						})
					}
				})
			}
			else {
				Object.keys(attributes).forEach(function(attrib) {
					if (attributes[attrib]) {
						if (attrib != 'password') {
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

// updatePassword('semlak', 'semlak', function(blah1, blah2) {console.log(blah1)})

//****testing ///
			var changePassword = function(username, password, cb) {
				Account.findByUsername(username, password, cb)


			}

			cb = function(err, account, blah1, blah2) {
				console.log("err", err, ", account", account, ", blah1", blah1, ", blah2", blah2)
				cb1 = function(err, account) {
					console.log('err', err, 'account', account)
					account.save(function(err) {
						if (err) console.log(err)
						else {
							console.log('Account saved.')
						}
					})
				}
				account.setPassword('blah', cb1)
				// account.role = 'admin'
				// account.save(function(err) {
				// 	if (err) console.log(err)
				// 	else {
				// 		console.log('account saved')
				// 	}
				// })
			// 			poll.save(function(err) {
			// 				if (err) console.log(err)
			// 				console.log("saved poll", poll)
			// 			})
			}


			// changePassword('semlak', 'blah', cb);
			// changePassword('semlak', 'blah', function(err, account) {
			// 	console.log(account)
			// 	account.setPassword('hey')
			// })
/////*****//////


//update property of specific user. Can only be done by admin or by the specific user.
router.post('/users/:username', isLoggedIn, function(req, res, next) {

// router.post(':username', function(req, res, next) {
	var isAjaxRequest = req.xhr;
	console.log("trying to update user account. req.body is ", req.body)

	if (req.user.username != req.params.username && req.user.role != 'admin') {
		res.json({message: 'User update can only be performed by the same user or by an admin user.'})
	}
	else if (req.body.new_role == 'admin' && req.user.role != 'admin') {
			console.log("User role update can only be changed to 'admin' by a current admin")
			res.json({message: "User role update can only be changed to 'admin' by a current admin."})
	}
	else {
		var cb = function(blah) {

			res.json (blah)
		}
		var updates = {}
		updates.user_to_update = req.params.username || null
		updates.role = req.body.new_role || null
		updates.fullname = req.body.new_fullname || null
		updates.email = req.body.new_email|| null
		updates.password = req.body.new_password|| null
		updates.username = req.body.new_username|| null

		if (updates.role) {
			if (updates.role == 'admin' && req.user.role != 'admin') {
				console.log("User role update can only be changed to 'admin' by a current admin.")
				updates.role = null
			}
			else if (updates.role != 'admin' && updates.role != 'user') {
				console.log("User role can only be 'admin' or 'user.'")
				updates.role = null
			}
		}
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

	// Account.register(new Account({ username : req.body.username, fullname: req.body.fullname, email: req.body.email }), req.body.password, function(err, account) {
	// 	if (err) {
	// 		if (isAjaxRequest) {
	// 			res.json(err)
	// 		}
	// 		else {
	// 			return res.render('register', { error : err.message });
	// 		}
	// 	}
	// 	else {
	// 		passport.authenticate('local') (req, res, function () {
	// 			req.session.save(function (err) {
	// 				if (err) {
	// 					return next(err)
	// 				}
	// 				else {
	// 					if (isAjaxRequest) {
	// 						// polls.forEach(item => console.log('item is ', item))
	// 						res.json({user: reqUserInfo(req.user)});
	// 					}
	// 					else {
	// 						// res.json(poll)
	// 						// res.render('polls', {user: reqUserInfo(req.user), title: 'Poll Listing', poll: JSON.stringify(poll)})
	// 						// res.set('Content-Type', 'application/javascript');
	// 						res.redirect('/');
	// 						// res.render('testPage', { myVar : ... });
	// 					}
	// 				}
	// 			});
	// 		});
	// 	}
	// });
});

// router.get('/login', function(req, res) {
// 	res.render('login', {user:reqUserInfo(req.user) });
// });

// router.post('/login', passport.authenticate('local'), function(req, res) {
// 	res.redirect('/');
// });




module.exports = router;
