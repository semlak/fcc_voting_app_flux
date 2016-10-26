'use strict';

/**

	./js/utils/VoteUtils.js
	I adapted a TodoUtils file from Facebook's react example repository to make this VoteUtils file

*/

module.exports = {

	convertRawVote: function(rawVote) {
		return {
			id: rawVote.id || rawVote._id,
			owner: rawVote.owner,
			author: rawVote.author,
			question: rawVote.question,
			answer_options: rawVote.answer_options,
			votes: rawVote.votes
		};
	},

	getCreatedVoteData: function(owner, author, question, answer_options) {
		var timestamp = Date.now();
		return {
			id: 'u_' + timestamp,
			author: author,
			question: question,
			answer_options: answer_options,
			votes: []
		};
	}

};
