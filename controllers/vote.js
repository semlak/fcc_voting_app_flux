// Controller file for Vote object

var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Poll = require('../models/poll');
var Vote = require('../models/vote')

var app = require('./index')
var isLoggedIn = app.isLoggedIn



/* GET all votes. */
// It is important to not send sensitive data to the client.
// We send all votes to client, but because these contain votes of other users, we do not send the entire vote object back.
// We do send most of it, though. We send the owner name, vote question and answers, numbe of votes for each answer, but not who voted for which answer.
// We do send data indicating whether or not the client has voted for the particular vote.

// this does not require an authenticated user.
router.get('/votes/', function(req, res, next) {
	// res.render('index', { user: req.user, title: 'Express' });
	Vote.find().sort({'_id': -1}).exec(function(err, votes) {
		if (err) {
			res.json(err);
		}
		else {
			// var isAjaxRequest = req.xhr;
			var isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers["x-requested-with"] == 'XMLHttpRequest';

			if (isAjaxRequest) {
				res.json(votes);
			}
			else {
				// render()
				// console.log("votes:", votes)
				res.render('votes', { user: req.user, title: 'Vote Listing', votes: votes })
			}
			// need more logic here
			// var data = [ {id: 1, author: "Joe", question: "Xena is cute AND cudddly!"}, {id: 2, author: "Xena", question: "So true. And Hungry!"}];
			// res.json(data)
		}
	});
});


// submit a vote (a response to a poll).
router.post('/votes', function(req, res, next) {
	// console.log("received post request for a vote");
	console.log("request body is ", req.body )
	var vote = new Vote();
	// need to change this to look up user
	vote.owner = req.user || null;
	vote.poll = req.body.poll_id;
	vote.answer_option = req.body.index;
	vote.ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;;
	var vote_text = req.body.answer_option_text;
	// vote.question = req.body.question || '';
	// vote.answer_options = req.body['answer_options\[\]'] || [];
	// for (var key in req.body) {
	// 	// console.log("key is ", key, "val is ", req.body[key])
	// }

	//check to see if user has already voted
	var props = {poll: vote.poll}
	if (vote.owner) {
		props.owner = vote.owner
	}
	else {
		props.ip_address = vote.ip_address
	}

	Vote.find(props, function(err, votes) {
		if (err) {
			res.json(err)
		}
		else if (votes.length > 0 && (req.user == null || req.user.role != 'admin')) {
			res.json({message: 'You have already voted once for this poll.', votes: null})
		}
		else {
			vote.save(function(err) {
				if (err) {
					res.json(err)
				}
				// add vote to poll's votes array
				Poll.findById(vote.poll, function(err, poll) {
					if (err) {
						res.json(err);
					}
					else if (poll == null) {
						res.json({message: 'No poll found corresponding to your vote.'})
					}
					else {
						// console.log('poll is', poll)
						poll.votes.push(vote);
						poll.save(function(err) {
							if (err) {
								res.json(err)
							}
							else {
								// good. poll object is updated. Now return all votes associated with that poll
								Vote.find({poll: vote.poll}, function(err, votes) {
									if (err) {
										res.json(err);
									}
									else {
										// need more logic here
										// console.log("responding with votes", votes)
										res.json({message: 'Vote was successful', votes: votes});
									}
								});
							}
						})
					}
				});
			})
		}
	})
});


	var deleteVotes = function() {
		Vote.find(function(err, votes) {
			if (err) {
				console.log (err);
			}
			else {
				votes.forEach(function(vote) {
					Poll.find({votes: vote._id}, function (err, polls) {
						if (err) {
							console.log(err);
						}
						else {
							polls.forEach(function(poll) {
								poll.votes = poll.votes.filter(poll_vote => poll_vote != vote._id )
								poll.save(function(err) {
									if (err) {
										console.log(err)
									}
								});
							});
						}
					});
					Vote.remove({_id: vote._id }, function(err) {
						if (err) {
							console.log( err)
						}
						else {
							console.log("deleted Vote with id ", vote._id)
						}
					});
				});
			}
		});
	};

	// deleteVotes()

	var deleteOrphanVotes = function() {
		// shouldn't be used except during testing, and only after deleting a poll that erroneously neglected to delete corresponding vote.
		// the poll.remove function has been updated to automatically remove corresponding votes.
		Vote.find(function(err, votes) {
			if (err) {
				console.log (err);
			}
			else {
				votes.forEach(function(vote) {
					Poll.find({votes: vote._id}, function (err, polls) {
						if (err) {
							console.log(err);
						}
						else if (polls.length == 0) {
							// no polls to delete. Just delete vote.
							Vote.remove({_id: vote._id }, function(err) {
								if (err) {
									console.log( err)
								}
								else {
									console.log("deleted Vote with id ", vote._id)
								}
							});
						}
					});
				});
			}
		});
	};

	// deleteOrphanVotes()


router.get('/votes/delete', function(req, res, next) {
	// just for testing. Wanted to make it easy to delete vote database.
	deleteVotes();
	res.json({})

});



// router.get('/votes/new', isLoggedIn, function(req, res, next) {
router.get('/votes/new', function(req, res, next) {
	res.render('create_vote', { user: req.user, title: 'Create New Vote'})

})
module.exports = router;
