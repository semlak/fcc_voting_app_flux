'use strict';

/*
./js/utils/PollWebAPIUtils.js
*/

import axios from 'axios';

import PollServerActionCreators from '../actions/PollServerActionCreators';
import PollStore from '../stores/PollStore';
import ModalActionCreators from '../actions/ModalActionCreators';

var pollsURL = PollStore.getPollsURL();

module.exports = {
  getAllPolls: function() {
    axios.get(pollsURL)
      .then(res => {
        if (res.status === 200) {
          PollServerActionCreators.receiveAll(res.data.polls);
        }
        else {
          console.error('Request for all polls failed.  Returned status of ' + res.status);
        }
      })
      .catch(err => console.error('Request for all polls failed. err:', err));
  },

  // createPoll: function(data, cb) {
  createPoll: function(data) {
    axios.post(pollsURL, data)
      .then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            console.error('Error occurred sumbiting a poll. response is', res);
          }
          else {
            PollServerActionCreators.receiveCreatedPoll(res.data.poll);
          }
        }
      })
      .catch(err => console.error('Error occurred submitting a poll. response is', err));
  },

  addAnswerOption: function(data) {
    axios.post(pollsURL + '/' + data.poll_id + '/new_answer_option', data)
      .then(res => {
        console.log('axios response', res);
        if (res.data.error) {
          ModalActionCreators.open('dialog', res.data.message || 'Failed to add new answer option to poll.');
        }
        else {
          //this used to just receive the poll\'s updated answer_options array, but now I have it receive all raw polls.
          //I would like to switch it back to just receiving the updated poll, or maybe the the updated poll's answer options.
          // var rawPolls = responseJSON.polls;
          // PollServerActionCreators.receiveAll(rawPolls);
          var rawPoll = res.data.poll;
          PollServerActionCreators.receiveUpdatedPoll(rawPoll);
        }
      })
      .catch(() => ModalActionCreators.open('dialog', 'Failed to add new answer option to poll.'));

  },
  // addAnswerOption: function(data, cb) {
  destroy: function(id) {
    var poll_id = id;
    // console.log('attempting to delete poll with id', poll_id)
    axios.delete(pollsURL + '/' + poll_id)
      .then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            console.error('Error occurred deleting a poll. response is', res.data);
            //ideally, launch modal with responseJSON.message as text. The below action at least notifies that the delete request fails.
            PollServerActionCreators.handleDeletedPollFail(poll_id);
          }
          else {
            // if succesful, response will be simply an object with the user
            //
            // console.log('PollActionCreators:', PollActionCreators);
            // console.log('PollServerActionCreators:', PollServerActionCreators);
            // PollActionCreators.getAllFromServer();
            // PollActionCreators.addAnswerOption(data.poll_id, (data.newAnswerOption + '_1'));
            // PollActionCreators.getAllFromServer();
            PollServerActionCreators.handleDeletedPoll(poll_id);

          }
          // PollWebAPIUtils.getAllPolls();
        }
      })
      .catch(() => PollServerActionCreators.handleDeletedPollFail(poll_id));
  },
  // destroy: function(id, cb) {
};
