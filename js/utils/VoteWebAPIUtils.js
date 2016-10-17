/*
VoteWebAPIUtils.js
handles communication with server regarding vote.
The actual ajax calls (xhr) occur here.
*/


import VoteServerActionCreators from '../actions/VoteServerActionCreators';
import VoteConstants from '../constants/VoteConstants';
// import PollWebAPIUtils from '../utils/PollWebAPIUtils';
import PollActionCreators from '../actions/PollActionCreators';



module.exports = {

  getAllVotes: function() {
    // simulate retrieving data from a database
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/votes');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.onload = function() {
        if (xhr.status === 200) {
            // console.log('Hello! xhr.responseText is' + xhr.responseText);
            // console.log('xhr is ', xhr)
            // var data =
            var rawVotes = JSON.parse(xhr.responseText).votes
            // console.log('received raw votedata from server. firing VoteServerActionCreators.receiveAll')
            // console.log('raw votes are ', rawVotes)
            VoteServerActionCreators.receiveAll(rawVotes);
        }
        else {
            console.log('Request for all votes failed.  Returned status of ' + xhr.status);
        }
    }.bind(this);
    xhr.send();

  },

  create: function(data, cb) {
    // var data = {
    //   id, poll_index, answer_option_text, poll_id, owner
    // }
    var xhr = new XMLHttpRequest();
    // xhr.open('POST', VoteConstants.VOTE_URL);
    xhr.open('POST', '/votes');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status === 200) {
          var responseJSON = JSON.parse(xhr.responseText);
          // console.log('Submitted Vote creation request via ajax xhr! xhr.responseText is', responseJSON);
          if (responseJSON.votes == null || responseJSON.votes.length == 0) {
            VoteServerActionCreators.createVoteFailed(data.poll_id, responseJSON.message || "Vote failed.");
            //ideally, launch modal with responseJSON.message as text.
          }
          // should receive new array of votes for this poll
          // would like to update poll with this array. For now, just request all polls.
          // PollWebAPIUtils.getAllPolls();
          PollActionCreators.getAllFromServer();

        }
        else {
          VoteServerActionCreators.createVoteFailed(data.poll_id, "Vote failed.");
          // console.log('Registration xrh request failed.  Returned status is ' + xhr.status);
          // console.log("full xhr content is:", xhr);
        }
    }.bind(this);

    xhr.send(JSON.stringify(data));
  }


};
