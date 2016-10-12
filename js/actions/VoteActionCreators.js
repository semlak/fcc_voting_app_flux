/*

 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var VoteConstants = require('../constants/VoteConstants');
var VoteWebAPIUtils = require('../utils/VoteWebAPIUtils');

var VoteActionCreators = {

  /**
   * @param  {object} vote: containing a temporary id, an index, answer_option_text, and poll_id.
    The index is the index of the answer_option in the poll answer_options array.
    The owner for the vote is applied by the server.
   */


  create: function(/*object*/ vote) {
    // AppDispatcher.dispatch({
    //   actionType: VoteConstants.VOTE_CREATE,
    //   id: vote.id || vote._id || null,
    //   index: index,
    //   answer_option_text: vote.answer_option_text,
    //   poll_id: poll_id,
    //   owner: vote.owner || null
    // });
    console.log("fired create action from VoteActionCreators")
    var data = {
      id: vote.id || vote._id || null,
      index: vote.index,
      answer_option_text: vote.answer_option_text,
      poll_id: vote.poll_id,
      owner: vote.owner || null
    }
    var cb = null;
    console.log("VoteWebAPIUtils:", VoteWebAPIUtils);
    VoteWebAPIUtils.create(data, cb)
    // UserWebAPIUtils.login(username, password);

  },


  //the update, getAllFromServer, and destroy are only used by administrator.
  /**
   * @param  {string} id The ID of the Vote item
   * @param  {object} voteUpdates:  object containing possible updates (votename, password, and/or fullname, role)
   */
  update: function(id, /*object*/ voteUpdates) {
    AppDispatcher.dispatch({
      actionType: VoteConstants.VOTE_UPDATE,
      id: id,
      voteUpdates: voteUpdates
    });
  },

  getAllFromServer: function() {
    // console.log('in VoteActionCreators, getallFromServer. Dispatching VOTE_GET_ALL_FROM_SERVER')
    AppDispatcher.dispatch({
      actionType: VoteConstants.VOTE_GET_ALL_FROM_SERVER
    });
  },


  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: VoteConstants.VOTE_DESTROY,
      id: id
    });
  },

};

module.exports = VoteActionCreators;
