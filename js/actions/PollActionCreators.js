/*
PollActionCreators
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import PollConstants from '../constants/PollConstants';
import PollWebAPIUtils from '../utils/PollWebAPIUtils';

var PollActionCreators = {

	/**
	 * @param  {object} poll, containing an author, owner, question, and answer_options[].
					The owner is the user_id. The author could be the user's fullname, username, or any other text they choose.
	 */
	create: function(/*object*/ poll) {
		// console.log("in PollActionCreators.create, poll is ", poll);
		// AppDispatcher.dispatch({
		//   actionType: PollConstants.POLL_CREATE,
		//   id: poll.id || poll._id,
		//   owner: poll.owner,
		//   author: poll.author,
		//   question: poll.question,
		//   answer_options: poll.answer_options,
		//   votes: []
		// });
		var data = {
			id: poll.id || poll._id,
			owner: poll.owner,
			author: poll.author,
			question: poll.question,
			answer_options: poll.answer_options,
			votes: []
		};
		var cb = null;
		// console.log("PollWebAPIUtils:", PollWebAPIUtils);
		PollWebAPIUtils.createPoll(data, cb);
	},

	/**
	 * @param  {string} id The ID of the Poll item
	 * @param  {object} pollUpdates:  object containing possible updates (pollname, password, and/or fullname, role)
	 */
	update: function(id, /*object*/ pollUpdates) {
		AppDispatcher.dispatch({
			actionType: PollConstants.POLL_UPDATE,
			id: id,
			pollUpdates: pollUpdates
		});
	},


	addAnswerOption: function(id, newAnswerOption) {
	//this is sort of like an UPDATE for a poll using REST api. However, we are only sending new answer option.
	//It is sort of like a create request for an answerOption object, which doesn't actually exist on its own in the app model
		var data = {
			poll_id: id,
			new_answer_option: newAnswerOption
		};
		var cb = null;
		PollWebAPIUtils.addAnswerOption(data, cb);

	},

	getAllFromServer: function() {
		// console.log('in PollActionCreators, getallFromServer. Dispatching POLL_GET_ALL_FROM_SERVER')
		// AppDispatcher.dispatch({
		//   actionType: PollConstants.POLL_GET_ALL_FROM_SERVER
		// });
		var cb = null;
		PollWebAPIUtils.getAllPolls(cb);
	},
	/**
	 * Toggle whether a single Poll is complete
	 * @param  {object} poll
	 */
	// toggleComplete: function(poll) {
	//   var id = poll.id;
	//   var actionType = poll.complete ?
	//       PollConstants.POLL_UNDO_COMPLETE :
	//       PollConstants.POLL_COMPLETE;

	//   AppDispatcher.dispatch({
	//     actionType: actionType,
	//     id: id
	//   });
	// },

	/**
	 * Mark all Polls as complete
	 */
	// toggleCompleteAll: function() {
	//   AppDispatcher.dispatch({
	//     actionType: PollConstants.POLL_TOGGLE_COMPLETE_ALL
	//   });
	// },

	/**
	 * @param  {string} id
	 */
	destroy: function(id) {
		//note: this will also destroy any votes associated with the poll (handled by server logic)
		// console.log("in destroy function of PollActionCreators");
		var cb = null;
		PollWebAPIUtils.destroy(id, cb);

		// AppDispatcher.dispatch({
		//   actionType: PollConstants.POLL_DESTROY,
		//   id: id
		// });
	},


	/**
	 * Delete all the completed Polls
	 */
	// destroyCompleted: function() {
	//   AppDispatcher.dispatch({
	//     actionType: PollConstants.POLL_DESTROY_COMPLETED
	//   });
	// }

};

module.exports = PollActionCreators;
