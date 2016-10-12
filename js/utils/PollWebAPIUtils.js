/*
PollWebAPIUtils.js
*/

var PollServerActionCreators = require('../actions/PollServerActionCreators');
var PollActionCreators = require('../actions/PollActionCreators');
// var PollActionCreators = require('../actions/PollActionCreators');

var PollStore = require('../stores/PollStore');
var pollsURL = PollStore.getPollsURL();

// !!! Please Note !!!
// We are using localStorage as an example, but in a real-world scenario, this
// would involve XMLHttpRequest, or perhaps a newer client-server protocol.
// The function signatures below might be similar to what you would build, but
// the contents of the functions are just trying to simulate client-server
// communication and server-side processing.

module.exports = {

  getAllPolls: function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', pollsURL);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.onload = function() {
        if (xhr.status === 200) {
            var rawPolls = JSON.parse(xhr.responseText).polls
            // console.log('received raw polldata from server. firing PollServerActionCreators.receiveAll')
            // console.log('raw polls are ', rawPolls)
            PollServerActionCreators.receiveAll(rawPolls);
        }
        else {
            console.log('Request for all polls failed.  Returned status of ' + xhr.status);
        }
    }.bind(this);
    xhr.send();

  },

  createPoll: function(data, cb) {
    // console.log("in PollWebAPIUtils.createPoll, data is ", data);

    //data contains poll.author, poll.owner, question, answer_options[], id (temporary)
    var xhr = new XMLHttpRequest();
    // xhr.open('POST', VoteConstants.VOTE_URL);
    xhr.open('POST', pollsURL);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status === 200) {
          var responseJSON = JSON.parse(xhr.responseText);
          // console.log('Submitted Poll creation request via ajax xhr! xhr.responseText:', responseJSON);
          if (responseJSON.message != null ) {
            //ideally, launch modal with responseJSON.message as text.
          }
          else {
            // should receive object with polls array (polls) as well as new_poll_id for the new_poll, and user
            // We want to update the polls in the PollStore and then direct the browser to view that poll as a FullPoll
            var rawPolls = responseJSON.polls;
            var new_poll_id = responseJSON.new_poll_id;
            PollServerActionCreators.receiveCreatedPoll(rawPolls, new_poll_id);
          }

        }
        else {
          // console.log('Registration xrh request failed.  Returned status is ' + xhr.status);
        }
    }.bind(this);

    xhr.send(JSON.stringify(data));
  },

  addAnswerOption: function(data, cb) {
    //data contains id (poll_id) and newAnswerOption
    var xhr = new XMLHttpRequest();
    // xhr.open('POST', VoteConstants.VOTE_URL);
    xhr.open('POST', pollsURL+ '/new_answer_option');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status === 200) {
          var responseJSON = JSON.parse(xhr.responseText);
          // console.log('Submitted Poll answer_option creation request via ajax xhr! xhr.responseText is:', responseJSON);
          if (responseJSON.message != null) {
            //ideally, launch modal with responseJSON.message as text.
          }
          else {
            //this used to just receive the poll's updated answer_options array, but now I have it receive all raw polls.
            var rawPolls = responseJSON.polls;
            PollServerActionCreators.receiveAll(rawPolls);
          }
        }
        else {
          // console.log('Registration xrh request failed.  Returned status is ' + xhr.status);
        }
    }.bind(this);

    xhr.send(JSON.stringify(data));
  },

  destroy: function(id, cb) {
    var poll_id = id;
    // console.log("attempting to delete poll with id", poll_id)
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', pollsURL + "/" + poll_id);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status === 200) {
          var responseJSON = JSON.parse(xhr.responseText);
          // console.log('Submitted Poll DELETE request via ajax xhr! xhr.responseText is:', responseJSON);
          if (responseJSON.message != null) {
            //ideally, launch modal with responseJSON.message as text.
            PollServerActionCreators.handleDeletedPollFail(poll_id);
          }
          else {
            // if succesful, response will be simply an object with the user
            //
            // console.log("PollActionCreators:", PollActionCreators);
            // console.log("PollServerActionCreators:", PollServerActionCreators);
            // PollActionCreators.getAllFromServer();
            // PollActionCreators.addAnswerOption(data.poll_id, (data.newAnswerOption + "_1"));
            // PollActionCreators.getAllFromServer();
            PollServerActionCreators.handleDeletedPoll(poll_id);

          }
          // PollWebAPIUtils.getAllPolls();
        }
        else {
          PollServerActionCreators.handleDeletedPollFail(poll_id);
          // console.log('Registration xrh request failed.  Full xhr object:', xhr);
          //message is xhr.statusText
        }
    }.bind(this);

    xhr.send();
  }

};
