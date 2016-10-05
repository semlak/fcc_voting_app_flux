/**
  VoteServerActionCreator. When creating, getting, or destroying votes, this handles actions after receiving information from server
 */

var VoteDispatcher = require('../dispatcher/VoteDispatcher');
var VoteConstants = require('../constants/VoteConstants');

module.exports = {

  receiveAll: function(rawVotes) {
    console.log('in VoteServerActionCreators, received the receiveAll signal. dispatching the RECEIVE_RAW_VOTES signal, rawVotes are ', rawVotes)
    VoteDispatcher.dispatch({
      actionType: VoteConstants.VOTE_RECEIVE_RAW_VOTES,
      rawVotes: rawVotes
    });
  },

  receiveCreatedVote: function(createdVote) {
    VoteDispatcher.dispatch({
      actionType: VoteConstants.VOTE_RECEIVE_RAW_CREATED_VOTE,
      rawVote: createdVote
    });
  }

};
