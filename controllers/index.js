var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var path = require('path')

// var Poll = require('../models/poll');
// var Vote = require('../models/vote');


	/* Note:
			This controller only expects to handles AJAX requests. All responses are via json.

			If there are no user accounts set up, the first account created is automatically an 'admin' account (this is the 'role' of the account schema).
			Additional accounts are always created as 'user' accounts (an admin can change thier role).
			***I need to add code to make sure that the application does not allow deletion of an admin account if it is the only admin account.

			I do have some old routes commented out that include non-json responses (I initially created this app as a non-single-page-app)
			THIS APPLICATION MIGHT SEND SENSTIVE USER DATA TO CLIENT. This should be cleaned up before production use.
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


// router.get('/register', function(req, res) {
// 	console.log("Received get request for register page ('/register'). Rendering.")
// 	res.render('register', {title: 'Register' });
// });


// router.post('/login', passport.authenticate('local'), function(req, res) {
// 	res.redirect('/');
// });


/* GET home page. The globbering is because react-router handles most routes as a single-page-app on the client side*/
router.get('/*', function(req, res, next) {
	console.log("Received get request for homepage ('/') in index.js. Rendering homepage")
   res.sendFile(path.join(__dirname, '../public', 'index.html'))
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

// module.exports.isLoggedIn = isLoggedIn
