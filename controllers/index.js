var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

// var Poll = require('../models/poll');
// var Vote = require('../models/vote');

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


router.get('/register', function(req, res) {
	console.log("Received get request for register page ('/register'). Rendering.")
	res.render('register', {title: 'Register' });
});

router.post('/register', function(req, res, next) {
	var isAjaxRequest = req.xhr;
	// console.log("trying to register account. req.body is ", req.body)
	console.log("Received request to register an account");
	// if this is the first account created for the application, it should be an admin user. Otherwise, it will be standard user.
	var role;
	Account.find(function(err, accounts) {
		if (err) {
			res.json(err)
		}
		else if (accounts.length == 0) {
			role = 'admin'
		}
		else {
			role = 'user'
		}
		Account.register(new Account({ username : req.body.username, fullname: req.body.fullname, email: req.body.email, role: role }), req.body.password, function(err, account) {
			if (err) {
				if (isAjaxRequest) {
					res.json(err)
				}
				else {
					return res.render('register', { error : err.message });
				}
			}
			else {
				passport.authenticate('local') (req, res, function () {
					req.session.save(function (err) {
						if (err) {
							return next(err)
						}
						else {
							if (isAjaxRequest) {
								// polls.forEach(item => console.log('item is ', item))
								res.json({error: false, message: 'Successfully registered.', user: reqUserInfo(req.user)});
							}
							else {
								// res.json(poll)
								// res.render('polls', {user: reqUserInfo(req.user), title: 'Poll Listing', poll: JSON.stringify(poll)})
								// res.set('Content-Type', 'application/javascript');
								res.redirect('/');
								// res.render('testPage', { myVar : ... });
							}
						}
					});
				});
			}
		});

	})

});

router.post('/login', passport.authenticate('local'), function(req, res) {
	var isAjaxRequest = req.xhr;
	// res.

	res.redirect('/');
});


router.post('/login-ajax', function(req, res, next) {
	var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';

	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			if (isAjaxRequest) {
				return res.status(403).json( {
					message: "no user found"
				});
			}
			else {
				// should do something to display an error here. But I'm not really using this path (login request almost always via ajax)
				return res.redirect('/')
			}
		}

		//manualy establish session
		req.login(user, function(err) {
			if (err) {
				return next(err);
			}
			else if (isAjaxRequest) {
				return res.json({ message: 'user authenticated', username: user.username, user: reqUserInfo(req.user)});
			}
			else {
				res.redirect('/')
			}
		});
	})(req, res, next);
});



router.get('/logout', function(req, res, next) {
	var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';
	console.log('Received get request to /logout. Logging off user');
	console.log('isAjaxRequest is', isAjaxRequest)

	req.logout();

	if (isAjaxRequest) {
		res.json({error: false, message: 'User logged off.', user: null})
	}
	else {
		// req.logout();
		res.redirect('/');
	}
});

router.get('/ping', function(req, res) {
	res.status(200).send("pong!");
});

/* GET home page. */
router.get('*', function(req, res, next) {
	console.log("Received get request for homepage ('/') in index.js. Rendering homepage")
	res.render('index.pug', { user: reqUserInfo(req.user), title: 'Home' });
});


module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}



module.exports.isLoggedIn = isLoggedIn
