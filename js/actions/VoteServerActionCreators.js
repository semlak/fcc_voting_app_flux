/**
  VoteServerActionCreator. When creating, getting, or destroying votes, this handles actions after receiving information from server
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var VoteConstants = require('../constants/VoteConstants');

module.exports = {

  receiveAll: function(rawVotes) {
    // console.log('in VoteServerActionCreators, received the receiveAll signal. dispatching the RECEIVE_RAW_VOTES signal, rawVotes are ', rawVotes)
    AppDispatcher.dispatch({
      actionType: VoteConstants.VOTE_RECEIVE_RAW_VOTES,
      rawVotes: rawVotes
    });
  },

  receiveCreatedVote: function(createdVote) {
    AppDispatcher.dispatch({
      actionType: VoteConstants.VOTE_RECEIVE_RAW_CREATED_VOTE,
      rawVote: createdVote
    });
  },

  createVoteFailed: function(poll_id, message) {
    AppDispatcher.dispatch({
      actionType: VoteConstants.VOTE_CREATE_FAIL,
      poll_id: poll_id,
      message: message
    });
  }

};
