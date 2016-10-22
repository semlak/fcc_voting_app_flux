

// Controller file for Vote object

var express = require('express');
var router = express.Router();
// var Account = require('../models/account');
var Poll = require('../models/poll');
var Vote = require('../models/vote');

// var app = require('./index');

	/* Note:
			This controller only expects to handles AJAX requests. All responses are via json.
			Voting does not require the user to be authorized (anonyous users can vote).

			I do have some old routes commented out that include non-json responses (I initially created this app as a non-single-page-app

			THIS APPLICATION MIGHT SEND SENSTIVE USER DATA TO CLIENT. This should be cleaned up before production use. Votes contain IP addresses and USER ids.
	*/

var cleanseVote = function (vote) {
	/*
		A vote object has an _id, owner, poll (a poll_id), answer_option , and ip_address.
			-answer_option is an index referring to position in answer_options array of poll
		Only the vote's answer_option and poll need to be sent to the client.
	*/
	return {
		answer_option: vote.answer_option,
		poll: vote.poll
	};

}

var cleansePoll = function (poll) {
	return {
		id: poll._id,
		_id: poll._id,
		author: poll.author,
		owner: poll.owner,
		question: poll.question,
		answer_options: poll.answer_options,
		votes: poll.votes.map(vote => cleanseVote(vote))
	};
}

// this does not require an authenticated user.
// router.get('/votes/', function(req, res, next) {
router.get('/votes/', function(req, res) {
	Vote.find().sort({'_id': -1}).exec(function(err, votes) {
		if (err) {
			res.json(err);
		}
		else {
			var cleansedVotes = votes.map(vote => cleanseVote(vote));
			res.json(votes);
		}
	});
});


// submit a vote (a response to a poll).
// router.post('/votes', function(req, res, next) {
router.post('/votes', function(req, res) {
	// console.log('received post request for a vote');
	console.log('request body is ', req.body );
	var vote = new Vote();
	// need to change this to look up user
	vote.owner = req.user || null;
	vote.poll = req.body.poll_id;
	vote.answer_option = req.body.index;
	vote.ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	// var vote_text = req.body.answer_option_text;
	// vote.question = req.body.question || '';
	// vote.answer_options = req.body['answer_options\[\]'] || [];
	// for (var key in req.body) {
	// 	// console.log('key is ', key, 'val is ', req.body[key]);
	// }

	//check to see if user has already voted
	var props = {poll: vote.poll};
	if (vote.owner) {
		props.owner = vote.owner;
	}
	else {
		props.ip_address = vote.ip_address;
	}

	Vote.find(props, function(err, votes) {
		if (err) {
			res.json(err);
		}
		else if (votes.length > 0 && (req.user == null || req.user.role != 'admin')) {
			res.json({message: 'You have already voted once for this poll.', poll: null, votes: null});
		}
		else {
			vote.save(function(err) {
				if (err) {
					res.json(err);
				}
				// add vote to poll's votes array
				Poll.findById(vote.poll).populate('votes').exec(function(err, poll) {
					if (err) {
						res.json(err);
					}
					else if (poll == null) {
						res.json({message: 'No poll found corresponding to your vote.', poll: null, votes: null});
					}
					else {
						// console.log('poll is', poll);
						poll.votes.push(vote);
						poll.save(function(err) {
							if (err) {
								res.json(err);
							}
							else {
								var updatedPoll = cleansePoll(poll);
								// console.log('updatedPoll:', updatedPoll)
								res.json({message: 'Vote was successful', poll: updatedPoll, votes: updatedPoll.votes});
							}
						});
					}
				});
			});
		}
	});
});



// var deleteVotes = function() {
// 	Vote.find(function(err, votes) {
// 		if (err) {
// 			console.log (err);
// 		}
// 		else {
// 			votes.forEach(function(vote) {
// 				Poll.find({votes: vote._id}, function (err, polls) {
// 					if (err) {
// 						console.log(err);
// 					}
// 					else {
// 						polls.forEach(function(poll) {
// 							poll.votes = poll.votes.filter(poll_vote => poll_vote != vote._id );
// 							poll.save(function(err) {
// 								if (err) {
// 									console.log(err);
// 								}
// 							});
// 						});
// 					}
// 				});
// 				Vote.remove({_id: vote._id }, function(err) {
// 					if (err) {
// 						console.log( err);
// 					}
// 					else {
// 						console.log('deleted Vote with id ', vote._id);
// 					}
// 				});
// 			});
// 		}
// 	});
// };

// router.get('/votes/delete', function(req, res, next) {
// 	// just for testing. Wanted to make it easy to delete vote database. Any user could just visit this route and all votes for all polls would be deleted.
// 	deleteVotes();
// 	res.json({});

// });



// router.get('/votes/new', function(req, res, next) {
// 	res.render('create_vote', { user: req.user, title: 'Create New Vote'});
// });

module.exports = router;
