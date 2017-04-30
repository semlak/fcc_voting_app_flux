'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
// var app = require('./index');
// var path = require('path');



	/* Note:
			There is a one-to-one correspondence between an authorized user and account.
			The server application model does not have a user object, just an account.
			Each account holds the information for that 'user'.
			Accounts only exist for an authorized user. Anonymous users do not have accounts.

			When the server is providing a list of 'users', it is actually providing a list of accounts,
			with some information (password hashes, salts) filtered out.

			The client-side app refers to them as users, not accounts.

			This controller only expects to handles AJAX requests. All responses are via json.
			I do have some old routes commented out that include non-json responses (I initially created this app as a non-single-page-app)

			THIS APPLICATION MIGHT SEND SENSTIVE USER DATA TO CLIENT. This should be cleaned up before production use. The main examples are in the polls controller.


	*/

var reqUserInfo = function(account) {
	if (account == undefined || account == null || account.username == null) {
		return null;
	}
	else {
		return {
			username: account.username,
			fullname: account.fullname,
			role: account.role,
			id: account._id
		};
	}
};


/* GET users listing. */
// router.get('/users/', function(req, res, next) {
router.get('/users/', function(req, res) {

	// console.log('received request for user listing in user controller');
	Account.find(function(err, accounts) {
		if (err) {
			res.json(err);
		}
		else {
			var users = accounts.map(user => reqUserInfo(user));
			res.json({error: false, users: users, message: 'Successfully retrieved users.', authorizedUser: reqUserInfo(req.user)});
		}
	});

});



//I need to learn more about how this works. Not sure if I understand it.
router.post('/users/login', function(req, res, next) {
	console.log('received POST request to \'/api/users/login\'');
	// passport.authenticate('local', function(err, user, info) {
	passport.authenticate('local', function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(400).json({error: true, message: 'Invalid username or password.' });
		}

		//manualy establish session
		req.login(user, function(err) {
			if (err) {
				return next(err);
			}
			else {
				return res.json({error: false, message: 'Login successful.', authorizedUser: reqUserInfo(req.user)});
			}
		});
	})(req, res, next);
});

router.post('/users/register', function(req, res, next) {
	console.log('Received request to register an account (a POST request to \'/api/users/register\')');
	// if this is the first account created for the application, it should be an admin user. Otherwise, it will be standard user.
	var role;
	Account.find(function(err, accounts) {
		if (err) {
			res.json(err);
		}
		else {
			if (accounts.length == 0) {
				role = 'admin';
			}
			else {
				role = 'user';
			}
			// Account.register(new Account({ username : req.body.username, fullname: req.body.fullname, email: req.body.email, role: role }), req.body.password, function(err, account) {
			Account.register(new Account({
				username : req.body.username,
				fullname: req.body.fullname,
				email: req.body.email,
				role: role
			}), req.body.password, function(err) {
				if (err) {
					if (err.name === 'UserExistsError') {
						// The client app should catch this type of error and not even submit request. However. server should handle too.
						return res.status(400).json({error: true, message: err.message});
					}
					else {
						// some other error.
						res.json(err);
					}
				}
				else {
					passport.authenticate('local') (req, res, function () {
						req.session.save(function (err) {
							if (err) {
								return next(err);
							}
							else {
								res.json({error: false, message: 'Successfully registered.', authorizedUser: reqUserInfo(req.user)});
							}
						});
					});
				}
			});
		}
	});
});


// router.get('/users/logout', function(req, res, next) {
router.get('/users/logout', function(req, res) {
	console.log('Received get request to \'/api/users/logout\'. Logging off user');
	req.logout();
	res.json({error: false, message: 'User logged off successfully.', authorizedUser: null});
});



//update property of specific user. Can only be done by admin or by the specific user.
//note, this currently will create an error if we try to update the user password and another property (both will try to have the server respond).
// router.post('/users/:user_id', function(req, res, next) {
router.post('/users/:user_id', function(req, res) {
	console.log('trying to update user account. req.body is ', req.body);

	//this is a long string if if/else statements that I would like to get rid off or simplify.
	if (!req.isAuthenticated()) {
		// console.log('in 'if' branch of user UPDATE request');
		let message = 'User update can only be performed by authenticated user.';
		console.log(message);
		res.json({message: message });
	}
	else if (req.user._id != req.params.user_id && req.user.role != 'admin') {
		// console.log('in 'else if 0' branch of user UPDATE request');
		let message = 'User update can only be performed by the same user or by an admin user.';
		console.log(message);
		res.json({message: message });
	}
	else if (req.body.new_role == 'admin' && req.user.role != 'admin') {
		// console.log('in 'else if 1' branch of user UPDATE request');
		let message = 'User role update can only be changed to \'admin\' by a current admin';
		console.log(message);
		res.json({message: message });
	}
	else if (req.body.new_role != null && req.body.new_role != 'admin' && req.body.new_role != 'user') {
		// console.log('in 'else if 2' branch of user UPDATE request');
		let message = 'User role can only be \'admin\' or \'user.\'';
		console.log(message);
		res.json({message: message });
	}
	else {
		// console.log('in else branch of user UPDATE request');
		let updates = {};
		updates.user_to_update = req.params.user_id || null; //this should not be null, otherwise this route would not trigger.
		updates.role = req.body.new_role || null;
		updates.fullname = req.body.new_fullname || null;
		// updates.email = req.body.new_email|| null;
		updates.password = req.body.new_password|| null;
		updates.username = req.body.new_username|| null;
		updates.current_password = req.body.current_password || null;


		console.log('updates are', updates);
		let cb = function(err, response) {
			if (err) {
				res.json(err);
			}
			else {
				res.json(response);
			}
		};
		if (updates.user_to_update) {
			updateUser(updates.user_to_update, updates, cb);
		}
	}
});




// var updatePassword = function(username, password, cb) {
// var updatePassword = function(username, password, cb) {
// 	Account.findByUsername(username, function(err, account) {
// 		if (err) {
// 			cb(err);
// 		}
// 		else {
// 			account.setPassword(password, function(err1, account1) {
// 				if (err1) {
// 					cb (err1);
// 				}
// 				else {
// 					account1.save(function(err2) {
// 						if (err2) {
// 							cb(err2);
// 						}
// 						else {
// 							console.log('Account saved with new password.');
// 						}
// 					});
// 				}
// 			});
// 		}
// 	});
// }


//note, this currently will create an error if we try to update the user password and another property (both will try to have the server respond).
//The app does not currently send more than one property to update at a time, but I should fix this.
var updateUser = function(user_id, attributes, cb) {
	Account.findById(user_id, function(err, account) {
		if (err) { cb(err); }
		else {
			if (attributes.password) {
				account.setPassword(attributes.password, function(err1, account1) {
					if (err1) {
						cb (err1);
					}
					else {
						account1.save(function(err2) {
							if (err2) {
								cb(err2);
							}
							else {
								cb(null, {message: 'Account saved with new password.', user: reqUserInfo(account1)});
							}
						});
					}
				});
			}
			else {
				Object.keys(attributes).forEach(function(attrib) {
					if (attributes[attrib]) {
						if (attrib != 'password' && attrib != 'current_password') {
							account[attrib] = attributes[attrib];
						}
					}
				});
				account.save(function(err2) {
					if (err2) {
						cb(err2);
					}
					else {
						cb(null, {message: 'Account saved.', user: reqUserInfo(account)});
					}
				});
			}
		}
	});
};







module.exports = router;
