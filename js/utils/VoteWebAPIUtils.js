/*
VoteWebAPIUtils.js
handles communication with server regarding vote.
The actual ajax calls (xhr) occur here.
*/


// import VoteServerActionCreators from '../actions/VoteServerActionCreators';
// import VoteConstants from '../constants/VoteConstants';
// import PollWebAPIUtils from '../utils/PollWebAPIUtils';
import PollServerActionCreators from '../actions/PollServerActionCreators';
// import PollActionCreators from '../actions/PollActionCreators';
import PollStore from '../stores/PollStore';
import ModalActionCreators from '../actions/ModalActionCreators';


var votesURL = PollStore.getVotesURL();



module.exports = {

	// getAllVotes: function() {
	// 	// This would probably only be used by an adminstrator, but I currently don\'t even have any instances of it being used.
	// 	// When the application retrieves polls from the server, their votes are automatically included in the poll object, so there is no need for separate vote retrieval
	// 	var xhr = new XMLHttpRequest();
	// 	xhr.open('GET', votesURL);
	// 	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	// 	xhr.onload = function() {
	// 		if (xhr.status === 200) {
	// 			// console.log('Hello! xhr.responseText is' + xhr.responseText);
	// 			// console.log('xhr is ', xhr)
	// 			// var data =
	// 			var rawVotes = JSON.parse(xhr.responseText).votes;
	// 			// console.log('received raw votedata from server. firing VoteServerActionCreators.receiveAll')
	// 			// console.log('raw votes are ', rawVotes)
	// 			VoteServerActionCreators.receiveAll(rawVotes);
	// 		}
	// 		else {
	// 			console.log('Request for all votes failed.  Returned status of ' + xhr.status);
	// 		}
	// 	}.bind(this);
	// 	xhr.send();

	// },

  // create: function(data, cb) {
	create: function(data) {
		// var data = {
		//   id, poll_index, answer_option_text, poll_id, owner
		// }
		var xhr = new XMLHttpRequest();
		xhr.open('POST', votesURL);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

		xhr.onload = function() {
			if (xhr.status === 200) {
				var responseJSON = JSON.parse(xhr.responseText);
				// console.log('Submitted Vote creation request via ajax xhr! xhr.responseText is', responseJSON);
				if (responseJSON.votes == null || responseJSON.votes.length == 0) {
					// VoteServerActionCreators.createVoteFailed(data.poll_id, responseJSON.message || 'Vote failed.');
					ModalActionCreators.open('dialog', (responseJSON.message || 'Vote failed.'));
					//ideally, launch modal with responseJSON.message as text.
				}
				else {
					// should receive updated poll
					// console.log('created vote. Updating poll. poll is:', responseJSON.poll);
					PollServerActionCreators.receiveUpdatedPoll(responseJSON.poll);
				}
			}
			else {
				// VoteServerActionCreators.createVoteFailed(data.poll_id, 'Vote failed.');
				ModalActionCreators.open('dialog', 'Vote failed');

				// console.log('Registration xrh request failed.  Returned status is ' + xhr.status);
				// console.log('full xhr content is:', xhr);
			}
		}.bind(this);

		xhr.send(JSON.stringify(data));
	}
};
