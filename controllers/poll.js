// Controller file for Poll object

var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Poll = require('../models/poll');
var Vote = require('../models/vote')

var app = require('./index')
var isLoggedIn = app.isLoggedIn

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


/* GET all polls. */
// It is important to not send sensitive data to the client.
// We send all polls to client, but because these contain votes of other users, we do not send the entire poll object back.
// We do send most of it, though. We send the owner name, poll question and answers, numbe of votes for each answer, but not who voted for which answer.
// We do send data indicating whether or not the client has voted for the particular poll.

// this does not require an authenticated user.
router.get('/polls/', function(req, res, next) {
	// res.render('index', { user: reqUserInfo(req.user), title: 'Express' });
	console.log("Received GET request for poll listing. )")
	var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';
	console.log('isAjaxRequest is', isAjaxRequest);
	if (isAjaxRequest) {
		Poll.find().sort({'_id': -1}).populate('votes').exec(function(err, polls) {
			if (err) {
				res.json(err);
			}
			else {
				res.json({polls: polls, user: reqUserInfo(req.user)});
			}
		});
	}
	else {
		//res.sendFile(path.join(__dirname, '..' ,'public', 'index.html'))
		res.render('index', { user: reqUserInfo(req.user), title: 'Create New Poll'})
	}
});


// get poll, a single poll by its poll id
router.get('/polls/:poll_id', function(req, res, next) {
	var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';
	if (isAjaxRequest) {
		console.log("poll_id is ", poll_id)
		var poll_id = req.params.poll_id
		Poll.findById(poll_id).populate('votes').exec(function(err, poll) {
			if (err) {
				res.json(err)
			}
			else {
				res.json({poll: poll, user: reqUserInfo(req.user), initialSinglePollId: poll_id});
			}
		});
	}
	else {
		//res.sendFile(path.join(__dirname, '..' ,'public', 'index.html'))
		res.render('index', { user: reqUserInfo(req.user), title: 'Single Poll'})
	}
})


// get a listing of all polls related to a specific user
// the client does not have to be an authorized user for this
router.get('/polls/user_polls/:user_id', function(req, res, next) {
	var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';
	if (isAjaxRequest) {
		var user_id = req.params.user_id
		console.log("getting polls for specific user. user_id is ", user_id)
		Poll.find({owner: user_id}).sort({'_id': -1}).populate('votes').exec(function(err, polls) {
			if (err) {
				res.json(err);
			}
			else {
				res.json({polls, user: reqUserInfo(req.user)});
			}
		});
	}
	else {
		res.render('index', { user: reqUserInfo(req.user), title: 'User Poll Listing'})
	}
});




router.post('/polls/new_answer_option', function(req, res, next) {
	console.log("received post request");
	console.log("request body is ", req.body )
	var poll_id = req.body.poll_id
	var user_name = req.body.user_name
	var new_answer_option = req.body.new_answer_option
	// should verify username, possible string cleansing of new_answer_option, shouldn't trust user

	if (!req.isAuthenticated()) {
		res.json({message: "User must be authenticated in order to create poll answer_option"})
	}
	else if (new_answer_option == '' || new_answer_option == null) {
		res.json({message: "New answer option cannot be blank/null."})
	}
	else {
		Poll.findById(poll_id, function(err, poll) {
			if (err) {
				res.json(err)
			}
			else if (poll == null) {
				res.json({message: "Poll with id '" + poll_id + "' unable to be found"})
			}
			else {
				var answer_options = poll.answer_options
				answer_options.push(new_answer_option)
				poll.answer_options = answer_options
				poll.save(function(err) {
					if (err) {
						res.json(err)
					}
					else {
						console.log("successfully updated poll ", poll_id, " with new_answer_option", new_answer_option, ", all answer options are ", poll.answer_options)
						// res.json({poll_id: poll._id, answer_options: poll.answer_options})
						Poll.find(function(err, polls) {
							if (err) {
								res.json(err);
							}
							else {
								// need more logic here
								// send back all polls, but also include id of new poll.
								var data = {polls: polls, user: reqUserInfo(req.user)}
								res.json(data);
							}
						});
					}
				});
			}
		});
	}
});


//a poll creation request
router.post('/polls/', function(req, res, next) {
	console.log("received post request");
	console.log("request body is ", req.body, "user is ", req.user )
	var poll = new Poll();
	// Anonymous user was only allowed to create poll in testing
	// poll.author = req.body.author || 'Anonymous User';
	// poll.question = req.body.question || '';
	poll.author = req.body.author
	poll.question = req.body.question;
	poll.answer_options = req.body['answer_options\[\]'] || req.body.answer_options || [];
	poll.owner = req.user._id
	console.log("poll object:", poll)

	// for (var key in req.body) {
	// 	console.log("key is ", key, "val is ", req.body[key])
	// }

	if (!req.isAuthenticated()) {
		res.json({message: "User must be authenticated in order to create poll answer_option"})
	}
	else if (poll.author == null || poll.question == null || poll.owner == null) {
		res.json({message: "Poll Author or Question cannot be null"})
	}
	else {
		// other logic
		poll.save(function(err) {
			if (err) {
				res.json(err)
			}
			Poll.find(function(err, polls) {
				if (err) {
					res.json(err);
				}
				else {
					// need more logic here
					// send back all polls, but also include id of new poll.
					var data = {polls: polls, new_poll_id: poll._id, user: reqUserInfo(req.user)}
					res.json(data);
				}
			});
		})
	}
});


// request to delete a poll. Note: user needs to be authorized, and user needs to be the user who created the poll.
// I'm wondering if there is a way for the user to add a req.user parameter to the request to fake a real user.
router.delete('/polls/:poll_id',  function(req, res, next) {
	console.log("Received request to delete poll! poll_id is ", req.params.poll_id)
	var poll_id = req.params.poll_id
	Poll.findById(poll_id, function(err, poll) {
		if (err) {
			console.log(err)
			res.status(404).json(err)
		}
		else if (poll == null) {
			console.log("On poll delete request, unable to find poll with id " + poll_id)
			res.status(404).json({message: 'poll with id ' + poll_id + ' was not found.'})
		}
		else if (req.user && (String(poll.owner) == String(req.user._id) || req.user.role === 'admin')) {
			// delete poll
			Poll.remove({_id: poll_id}, function(err) {
				if (err) {
					console.log(err)
					res.status(403).json(err);
				}
				else {
					console.log('poll with id ' + poll_id + ' deleted successfully, user was ' + req.user.username)
					res.status(200).json({user: reqUserInfo(req.user)});
				}
			})
		}
		else {
			console.log("Unknown error while attempting to delete poll with id " + poll_id)
			res.status(403).json({message: 'a poll can only be deleted by its owner'})
		}
	})
});





var deletePolls = function() {
	Poll.find(function(err, polls) {
		if (err) {
			console.log (err);
		}
		else {
			polls.forEach(function(poll) {
				Poll.remove({
					_id: poll._id
				}, function(err) {
					if (err) {
						console.log( err)
					}
					else {
						console.log("deleted Poll with id ", poll._id)
					}

				});
			});
		}
	});
};



// var associateAllPollsWithOwner = function() {
// 	Poll.find(function(err, polls) {
// 		polls.forEach(function(poll) {
// 			if (poll.author == 'kalchas') {
// 				poll.owner = '57819a49c88457d7573db01d'
// 			}
// 			else if (poll.author == 'semlak') {
// 				poll.owner = '5780188f8f01f379200982cd'

// 			}
// 			else if (poll.author == 'xena') {
// 				poll.owner = '578bf3505597e4436443da92'
// 			}
// 			poll.save(function(err) {
// 				if (err) console.log(err)
// 				console.log("saved poll", poll)
// 			})
// 		});
// 	})
// }




var deleteAnonomousPolls = function() {
	Poll.find({author: 'Anonomous User'}, function(err, polls) {
		polls.forEach(function(poll) {
			Vote.find({poll: poll._id}, function(err, votes) {
				if (err) {
					console.log("error when trying to find votes associated with poll to delete.", err)
				}
				else {
					Vote.find({poll: poll._id}, function(err, votes) {
						if (err) {
							console.log("error when trying to find votes associated with poll to delete.", err)
						}
						else {
							votes.forEach(function(vote) {
								Vote.remove({_id: vote._id}, function(err) {
									if (err) {
										console.log(err)
									}
									else {
										console.log("deleted vote with id", vote._id, " associated with poll with id ", poll._id)
									}
								})
							})
						}
					})
					Poll.remove({
						_id: poll._id
					}, function(err) {
						if (err) {
							console.log( err)
						}
						else {
							console.log("deleted Poll with id ", poll._id)
							// res.json(200, {message: 'poll ' + poll._id + ' deleted successfully', user: reqUserInfo(req.user)})
						}

					});
				}
			})
		});
	})
}


// deleteAnonomousPolls()


// associateAllPollsWithOwner()

var blah = function() {
	Poll.find(function(err, polls) {
		if (err) console.log(err)
		polls.forEach(function(poll) {
			Vote.find({'poll': poll._id}, function(err, votes) {
				// console.log("votes is ", votes)
				poll.votes = []
				votes.forEach(vote => poll.votes.push(vote))
				poll.save(function(err) {
					if (err) console.log(err)
					console.log("saved poll", poll)
				})
			})
		})
	})
}


router.get('/polls/delete', function(req, res, next) {
	// just for testing. Wanted to make it easy to delete poll database.
	deletePolls();
	res.json({})

});



// router.get('/new', isLoggedIn, function(req, res, next) {
router.get('/polls/new', function(req, res, next) {
	res.render('create_poll', { user: reqUserInfo(req.user), title: 'Create New Poll'})

})
module.exports = router;
