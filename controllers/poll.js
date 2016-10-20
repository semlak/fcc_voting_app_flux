// Controller file for Poll object

var express = require('express');
var router = express.Router();
// var Account = require('../models/account');
var Poll = require('../models/poll');
// var Vote = require('../models/vote');

// var app = require('./index');

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



/*
	This controller only expects to handles AJAX requests. All responses are via json.
	I do have some old routes commented out that include non-json responses (I initially created this app as a non-single-page-app)

	All responses to ajax requests to /polls (except when there is a database err, in which case the response is just the err object)
		include the requesting user's data (an object or null), message (string), and an error status (boolean, true if error occurred) .
	The user data for the request is implicitly provided by Passport.js in the request (same for all requests), but included explicitly after
		being cleaned to avoid sending password hashes. I would like to find way to have passport or express do this implicitly.

	THIS APPLICATION CURRENTLY SENDS SOME SENSTIVE USER DATA TO CLIENT. This should be cleaned up before production use. The main examples I can think of
		are get requests that retrieve all or some polls. They include the polls votes, which include the voter's id and IP address. There could be other issues.


*/





/*
	GET all polls, via a GET request to /polls/
	This does not require an authenticated user.

	Issues:
		Sensitive data:
		It is important to not send sensitive data to the client. THIS APPLICATION CURRENTLY SENDS SOME SENSTIVE USER DATA TO CLIENT.
		We send all polls to client. The polls contain all votes, and each vote includes its owner (voter) id and their IP address,
			which together seems to be potentially senstive information for that user). This would need to be fixed for production use.
		I would like to adjust to just include the vote counts for each answer option and a boolean for each poll as to whether the client
			has already voted for the particular poll. Right now, if the user attempts to vote for a particular poll, the server determines
			if the user has already voted. It would be nice for the client to proactively tell the user. (a user can only vote for each poll once).
	*/

// router.get('/polls/', function(req, res, next) {
router.get('/polls/', function(req, res) {
	console.log('Received GET request for all polls listing.');
	Poll.find().sort({'_id': -1}).populate('votes').exec(function(err, polls) {
		if (err) {
			res.json(err);
		}
		else {
			var message = polls.length < 0 ? 'No polls found.' : 'Polls retrieved succesfully.';
			res.json({error: (polls.length < 0), polls: polls, message: message, user: reqUserInfo(req.user)});
		}
	});
});


// get a single poll, retried by its poll id, via a GET request to /polls/:poll_id
// Not necessary due to single page app functionality. Could be added back if I ever implement server-side rendering.
// router.get('/polls/:poll_id', function(req, res, next) {
// 	console.log('Received GET request for single poll listing.')
// 	var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers['x-requested-with'] == 'XMLHttpRequest';
// 	if (isAjaxRequest) {
// 		// console.log('poll_id is ', poll_id)
// 		var poll_id = req.params.poll_id
// 		Poll.findById(poll_id).populate('votes').exec(function(err, poll) {
// 			if (err) {
// 				res.json(err)
// 			}
// 			else {
// 				var message = polls.length < 0 ? 'No poll found with id of '' + poll_id + ''.' : 'Poll retrieved succesfully.';
// 				res.json({error: (polls.length < 0), poll: poll, message: message, initialSinglePollId: poll_id, user: reqUserInfo(req.user)});
// 			}
// 		});
// 	}
// 	else {
// 		//res.sendFile(path.join(__dirname, '..' ,'public', 'index.html'))
// 		res.render('index', { user: reqUserInfo(req.user), title: 'Single Poll'})
// 	}
// })





/*
	This requests to create a poll. The poll data is provided as a 'POST' request to /polls/.
	The poll data will be found in the req.body as:
		req.body.author
		req.body.question
		req.body.answer_options
		req.body.owner

	Note: user needs to be authenticated.
	All responses (except for the general database error) include the user object and a message (string).
		If the poll is succesfully created, the response also includes a refreshed array of all polls, and the new poll's id (new_poll_id)
		I would like to update this so that the response only sends the new poll, which the client would add to the list.

	Issues (for this reqeust and several requests below):
		I'm wondering if there is a way for the user to add a req.user parameter to the request to fake a real user. Would like to check.
		I would like to modify so that poll creation/update/delete automatically checks for authentication. Right now I have to explicitly do it, but I'm
			thinking passport and mongoose might offer a way of building this concept into a model/schema's functionality.
		I should make sure to cleanse the data strings provided by the user; shouldn't trust user.
*/

// router.post('/polls/', function(req, res, next) {
router.post('/polls/', function(req, res) {
	// console.log('received post request');
	// console.log('request body is ', req.body, 'user is ', req.user )
	var poll = new Poll();
	poll.author = req.body.author;
	poll.question = req.body.question;
	poll.answer_options = req.body['answer_options\[\]'] || req.body.answer_options || [];
	poll.owner = req.user._id;

	// for (var key in req.body) {
	// 	console.log('key is ', key, 'val is ', req.body[key])
	// }

	if (!req.isAuthenticated()) {
		res.json({error: true, message: 'User must be authenticated in order to create poll answer_option'});
	}
	else if (poll.author == null || poll.question == null || poll.owner == null) {
		res.json({error: true, message: 'Poll Author or Question cannot be null', user: reqUserInfo(req.user)});
	}
	else {
		// other logic
		poll.save(function(err) {
			if (err) {
				res.json(err);
			}
			Poll.find(function(err, polls) {
				if (err) {
					res.json(err);
				}
				else {
					// need more logic here
					// send back all polls, but also include id of new poll.
					var data = {error: false, polls: polls, new_poll_id: poll._id, message: 'Poll created successfully.', user: reqUserInfo(req.user)};
					res.json(data);
				}
			});
		});
	}
});






/*
	This requests to create a new answer option for an existing poll. The data is provided as a 'post' request to '/polls/new_answer_option'.
	The data is expected to be found in the req.body as:
		req.body.poll_id
		req.body.new_answer_option
		req.body.user_name

	The new_answer_option will be appended to the existing poll's answer_options array.
	The user_name above is not really used, but I had thought it would be necessary. I rely on Passport to provide the requesting user's info in the request)

	Note: The user needs to be authenticated; however, the user does not have to be the owner/creator of the poll.
	All responses are via json and (except for the general database error) include the user (object) and a message (string).
		If the new answer_option is succesfully created (appended to the existing poll's answer_option array),
			the response also includes a refreshed array of all polls.
		I would like to update this so that the response only sends the updated poll as a poll object. (which would include the updated answer_options array)

	Issues:
		I should make sure to cleanse the new_answer_option string provided (and all data); shouldn't trust user.
		I would like to change this to a PUT request to /polls/:poll_id/new_answer_option or maybe a PUT or POST request /polls/:poll_id.
			Not sure, but I would like poll_id to be in the URL rather than the request body; seems more inline with typical REST app.
*/


// router.post('/polls/:poll_id/new_answer_option', function(req, res, next) {
router.post('/polls/:poll_id/new_answer_option', function(req, res) {
	// console.log('received post request');
	// console.log('request body is ', req.body )
	// var poll_id = req.body.poll_id
	var poll_id = req.params.poll_id;
	// var user_name = req.body.user_name;
	var new_answer_option = req.body.new_answer_option;

	if (!req.isAuthenticated()) {
		res.json({error: true, message: 'User must be authenticated in order to create poll answer_option', user: null});
	}
	else if (new_answer_option == '' || new_answer_option == null) {
		res.json({error: true, message: 'New answer option cannot be blank/null.', user: reqUserInfo(req.user)});
	}
	else {
		Poll.findById(poll_id, function(err, poll) {
			if (err) {
				res.json(err);
			}
			else if (poll == null) {
				res.json({error: true, message: 'Poll with id \'' + poll_id + '\' unable to be found', user: reqUserInfo(req.user)});
			}
			else {
				var answer_options = poll.answer_options;
				answer_options.push(new_answer_option);
				poll.answer_options = answer_options;
				poll.save(function(err) {
					if (err) {
						res.json(err);
					}
					else {
						var message = 'Successfully updated poll ' + poll_id.toString() + ' with new_answer_option \'' + new_answer_option.toString() + '\'.';
						console.log(message);
						// console.log('Successfully updated poll ', poll_id, ' with new_answer_option', new_answer_option, ', all answer options are ', poll.answer_options)
						// res.json({poll_id: poll._id, answer_options: poll.answer_options});
						Poll.find(function(err, polls) {
							if (err) {
								res.json(err);
							}
							else {
								var data = {error: false, polls: polls, message: message, user: reqUserInfo(req.user)};
								res.json(data);
							}
						});
					}
				});
			}
		});
	}
});




/*
	This requests to delete a poll.
	Note: user needs to be authenticated, and user needs to be the user who created the poll (or an 'admin' account).
	The user data is implicitly provided by Passport in the request (same for all requests)
	Also, the associated votes are automatically deleted with the poll (this is part of the Poll modal/schema).
	If request is done via ajax, all responses (except for the general database error) include the user object and a message (string).

	Issues:
		I'm wondering if there is a way for the user to add a req.user parameter to the request to fake a real user.
		I would like to modify so that poll deletion automatically checks for authentication. Right now I have to explicitly do it, but I'm
			thinking passport might offer a way of building this concept into a model/schema's functionality.
*/

// router.delete('/polls/:poll_id',  function(req, res, next) {
router.delete('/polls/:poll_id',  function(req, res) {
	console.log('Received request to delete poll! poll_id is ', req.params.poll_id);
	var poll_id = req.params.poll_id;
	Poll.findById(poll_id, function(err, poll) {
		if (err) {
			console.log(err);
			res.status(404).json(err);
		}
		else if (poll == null) {
			console.log('On poll delete request, unable to find poll with id ' + poll_id);
			res.status(404).json({error: true, message: 'poll with id ' + poll_id + ' was not found.', user: reqUserInfo(req.user)});
		}
		else if (req.user && (String(poll.owner) == String(req.user._id) || req.user.role === 'admin')) {
			// delete poll
			Poll.remove({_id: poll_id}, function(err) {
				if (err) {
					console.log(err);
					res.status(403).json(err);
				}
				else {
					var message = 'poll with id ' + poll_id + ' deleted successfully, user was ' + req.user.username;
					console.log(message);
					res.status(200).json({error: false, message: message, user: reqUserInfo(req.user)});
				}
			});
		}
		else {
			console.log('Unknown error while attempting to delete poll with id ' + poll_id);
			res.status(403).json({error: true, message: 'a poll can only be deleted by its owner', user: reqUserInfo(req.user)});
		}
	});
});





/*
	deleteAllPolls(): Deletes all polls.
	Note, the Poll schema is defined such that all associated votes will be automatically deleted before removing the poll,
	meaning that explicitly deleting the votes separately is not necessary.
*/
// var deleteAllPolls = function() {
// 	Poll.find(function(err, polls) {
// 		if (err) {
// 			console.log (err);
// 		}
// 		else {
// 			polls.forEach(function(poll) {
// 				Poll.remove({
// 					_id: poll._id
// 				}, function(err) {
// 					if (err) {
// 						console.log( err);
// 					}
// 					else {
// 						console.log('deleted Poll with id ', poll._id);
// 					}

// 				});
// 			});
// 		}
// 	});
// };


/*
	JUST FOR TESTING.
	The following path (/polls/delete), if enabled,  should only be enabled during development or testing.
	I wanted to make it easy to delete poll database. All it takes is a get request to that URL.
	This makes it incredibly easy for anyone to delete all polls! YOU ARE WARNED.
*/

// router.get('/polls/delete', function(req, res, next) {
// 	//However, only
// 	deletePolls();
// 	res.json({})

// });



// //This gets the new poll form. This is not actually used with the single page app.
// router.get('/polls/new', function(req, res, next) {
// 	res.render('create_poll', { user: reqUserInfo(req.user), title: 'Create New Poll'})

// })



module.exports = router;
