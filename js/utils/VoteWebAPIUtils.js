'use strict';

/*
./js/utils/VoteWebAPIUtils.js

handles communication with server regarding vote.
The actual ajax calls (axios) occur here.
*/
import axios from 'axios';


// import VoteServerActionCreators from '../actions/VoteServerActionCreators';
// import VoteConstants from '../constants/VoteConstants';
// import PollWebAPIUtils from '../utils/PollWebAPIUtils';
import PollServerActionCreators from '../actions/PollServerActionCreators';
// import PollActionCreators from '../actions/PollActionCreators';
import PollStore from '../stores/PollStore';
import ModalActionCreators from '../actions/ModalActionCreators';


var votesURL = PollStore.getVotesURL();



module.exports = {

  create: function(data) {
    // var data = {
    //   id, poll_index, answer_option_text, poll_id, owner
    // }
    axios.post(votesURL, data)
      .then(response => {
        if (response.status === 200) {
          // console.log('Submitted Vote creation request via ajax xhr! xhr.responseText is', response.data);
          if (!response || !response.data || !response.data.votes || response.data.votes.length === 0) {
            // VoteServerActionCreators.createVoteFailed(data.poll_id, response.data.message || 'Vote failed.');
            ModalActionCreators.open('dialog', ((response.data && response.data.message) || 'Vote failed.'));
            //ideally, launch modal with response.data.message as text.
          }
          else {
            // should receive updated poll
            // console.log('created vote. Updating poll. poll is:', response.data.poll);
            PollServerActionCreators.receiveUpdatedPoll(response.data.poll);
          }
        }
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          ModalActionCreators.open('dialog', err.resopnse.data);
        }
        else {
          ModalActionCreators.open('dialog', 'Vote failed');
        }
      });
  },
};
