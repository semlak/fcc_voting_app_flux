'use strict';

/*
 * PollStore
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import PollConstants from '../constants/PollConstants';
import VoteConstants from '../constants/VoteConstants';
import assign from 'object-assign';
import PollUtils from '../utils/PollUtils';

var CHANGE_EVENT = 'change';
var CREATED_EVENT = 'create';
var DESTROY_EVENT = 'destroy';
var VOTE_CREATED_EVENT = 'vote_create';

// var _polls = {};
var _polls = {};
var _pollsURL = '/api/polls';
var _votesURL = '/api/votes';


function addPolls(rawPolls) {
  // console.log('in PollStore., addPolls.  adding raw polls to _polls, rawPolls are', rawPolls);
  rawPolls.forEach(function(poll) {
    if (!_polls[poll.id]) {
      _polls[poll.id] = PollUtils.convertRawPoll(poll);
    }
  });
  // console.log('in pollStore. _polls are now ', _polls);
}

function addPoll(rawPoll) {
  // assumes poll has already been verified as not in _polls
  var poll = PollUtils.convertRawPoll(rawPoll);
  _polls[poll.id] = poll;
  return true;
}


function deleteLocalPoll(id) {
  delete _polls[id];
  return true;
}

function updatePoll(rawPoll) {
  // console.log('in updatePoll of PollStore helper functions, rawPoll is ', rawPoll);
  var poll = PollUtils.convertRawPoll(rawPoll);
  var currentPoll = _polls[poll.id];
  // the only update allowed for polls are a additional answer options (existing ones don't change) and votes
  if (poll.answer_options.length != currentPoll.answer_options.length || poll.votes.length != currentPoll.votes.length) {
    _polls[poll.id].answer_options = poll.answer_options;
    _polls[poll.id].votes = poll.votes;
    return true;
  }
  else {
    return false;
  }
}


function updatePollSet(rawPolls) {
  // returns true if updates were needed, false if no change
  var updatesNeeded = false;
  if (Object.keys(_polls).length == 0 ) {
    addPolls(rawPolls);
    return true;
  }
  // otherwise, we want to delete poll from _polls who is no longer on the list (cached poll no longer exists), add poll to _polls who was not on list, and update existing poll info

  // to check if poll from _poll is no longer on list (cache, bascially), it is most efficient to create a hash of the new poll list and compare
  var new_poll_set = {};
  rawPolls.forEach(poll => new_poll_set[poll.id] = poll);
  // console.log('new_poll_set is', new_poll_set);
  for (var id in _polls) {
    if (!new_poll_set[id]) {
      updatesNeeded = deleteLocalPoll(id);
      // this function only returns true
    }
  }

  // check if poll already exists. If not, add, if so, veryify data is up to date
  rawPolls.forEach(function(rawPoll) {
    let updateMade = false;
    if (!_polls[rawPoll.id]) {
      updateMade = addPoll(rawPoll);
    }
    else {
      updateMade = updatePoll(rawPoll);
    }
    if (updateMade) { updatesNeeded = true ;}
  });
  // console.log('after checking for updated polls, updatesNeeded is ', updatesNeeded);
  return updatesNeeded;
}

/**
 * Create poll
 * @param  {object} poll, containing an author, owner, question, and answer_options[].
        The owner is the user_id. The author could be the user's fullname, username, or any other text they choose.
 */
function create(poll) {
  // Using the current timestamp + random number in place of a real id.

  // this logic needs to be enforced by backend as well
  if (poll.author == '' || poll.owner == null || poll.question == '') {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    poll.id = id;

  }
  else {
    // console.log('error creating poll. Either pollname or password was blank');
  }
}

// /**
//  * Update a POLL item.
//    * @param  {string} id The ID of the Poll item
//    * @param  {object} update object containing possible updates (pollname, password, and/or fullname, role)
//  */
// function update(id, pollUpdates) {
//   // _polls[id] = assign({}, _polls[id], pollUpdates);
//   // console.log('poll is ', _polls[id], ', pollUpdates is ', pollUpdates)

//   // this logic should be handled by backend.
//   for (var key in pollUpdates) {
//     if (key == 'pollname') {
//       // delete _pollsByPollname[_polls[id]['pollname']
//       _pollsByPollname[_polls[id].pollname] = null
//       _polls[id][key] = pollUpdates[key]
//       _pollsByPollname[_polls[id]['pollname']] = _polls[id]
//     }
//     else {
//       _polls[id][key] = pollUpdates[key]
//     }
//   }
// }

/**
 * Update all of the POLL items with the same object.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
// function updateAll(updates) {
//   for (var id in _polls) {
//     update(id, updates);
//   }
// }

/**
 * Delete a POLL item.
 * @param  {string} id
 */
function destroy(id) {
  delete _polls[id];
}

/**
 * Delete all POLL items.
 */
// function destroyAll() {
//   for (var id in _polls) {
//     destroy(id);
//   }
// }

var PollStore = assign({}, EventEmitter.prototype, {


  /**
   * Get the entire collection of POLLs.
   * @return {object}
   */
  getAll: function() {
    // var polls = this.getAllPollsFromServer;
    // _polls = polls;
    return _polls;
  },

  getPollById: function(id) {
    var poll = _polls[id];
    return poll;
  },



  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitCreated: function(new_poll_id) {
    this.emit(CREATED_EVENT, new_poll_id);
  },

  emitDestroy: function(poll_id, success) {
    this.emit(DESTROY_EVENT, poll_id, success);
  },

  emitVoteCreated: function(poll_id, success, message) {
    this.emit(VOTE_CREATED_EVENT, poll_id, success, message);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  addCreatedListener: function(callback) {
    this.on(CREATED_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeCreatedListener: function(callback) {
    this.removeListener(CREATED_EVENT, callback);
  },


  addDestroyListener: function(callback) {
    this.on(DESTROY_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeDestroyListener: function(callback) {
    this.removeListener(DESTROY_EVENT, callback);
  },

  addVoteCreatedListener: function(callback) {
    this.on(VOTE_CREATED_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeVoteCreatedListener: function(callback) {
    this.removeListener(VOTE_CREATED_EVENT, callback);
  },



  getPollsURL: function() {
    return _pollsURL;
  },


  getVotesURL: function() {
    return _votesURL;
  }

});

// Register callback to handle all updates
PollStore.dispatchToken = AppDispatcher.register(function(action) {
  var updatesMade = false;

  switch(action.actionType) {
  //this case is currently not used. POLL_RECEIVE_RAW_CREATED_POLL is used instead (called by PollServerActionCreators).
  case PollConstants.POLL_CREATE:
    var poll = action.poll;
    for (var key in poll) {
      poll[key] = poll[key].trim();
    }
    if (poll.author == '' || poll.question == '') {
      // console.log('error creating poll');
    }
    else {
      create(poll);
      PollStore.emitChange();
    }
    break;


  case PollConstants.POLL_UPDATE:
  // An update to the poll. The application does not currently support changing the author name or question for an existing poll, so this primarily is
  // for when a new answer_option or vote is created for the poll.

  //would like to use this to handle new answer_option or vote that is added to existing poll. Currently, I just receive all rawpolls.
    // console.log('in POLL_UPDATE case. action is ', action);
    var updatedPoll = action.updatedPoll;
    // console.log('pollUpdates is ', pollUpdates)
    updatePoll(updatedPoll);
    // console.log('poll, after update:', _polls[action.updatedPoll.id]);
    PollStore.emitChange();
    break;

  case PollConstants.POLL_DESTROY:
    // console.log('in PollStore, received POLL_DESTROY dispatch signal');
    destroy(action.id);
    PollStore.emitChange();
    //action.id is the id of poll that is destroyed.
    PollStore.emitDestroy(action.id, true);
    break;

  case PollConstants.POLL_DESTROY_FAIL:
    // console.log('in PollStore, received POLL_DESTROY_FAIL dispatch signal');
    PollStore.emitDestroy(action.id, false);
    break;

  case PollConstants.POLL_RECEIVE_RAW_POLLS:
    // console.log('\n\nIn PollStore, dispatch receiving. received 'RECEIVE_RAW_POLLS' action signal, rawPolls are', action.rawPolls);
    updatesMade = updatePollSet(action.rawPolls);
    // AppDispatcher.waitFor([ThreadStore.dispatchToken]);
    // _markAllInThreadRead(ThreadStore.getCurrentID());

    // ideally, would only fire this if there is a change to the polls
    // also, the addpoll function only adds poll if they are not already in _polls. It does not update their data if it has changed.
    // add, it does not remove polls from _polls that are no longer registered.
    if (updatesMade) {
      PollStore.emitChange();
    }
    break;

  case PollConstants.POLL_RECEIVE_RAW_CREATED_POLL:
    // console.log('\n\nIn PollStore, dispatch receiving. received 'POLL_RECEIVE_RAW_CREATED_POLL' action signal, rawPolls are', action.rawPolls)
    updatesMade = addPoll(action.rawPoll);
    // AppDispatcher.waitFor([ThreadStore.dispatchToken]);
    // _markAllInThreadRead(ThreadStore.getCurrentID());

    // ideally, would only fire this if there is a change to the polls
    // also, the addpoll function only adds poll if they are not already in _polls. It does not update their data if it has changed.
    // add, it does not remove polls from _polls that are no longer registered.
    if (updatesMade) {
      // console.log('emitting CREATED_EVENT signal from POLL_RECEIVE_RAW_CREATED_POLL case')
      PollStore.emitCreated(action.rawPoll.id);
      // console.log('emitting CHANGE_EVENT signal from POLL_RECEIVE_RAW_CREATED_POLL case')
      PollStore.emitChange();
    }

    break;

  case VoteConstants.VOTE_CREATE_FAIL:
    // console.log('\n\nIn PollStore, dispatch receiving. received 'VOTE_CREATE_FAIL' action signal')
    PollStore.emitVoteCreated(action.poll_id, false, action.message);
    break;

  default:
    // no op
  }
});

module.exports = PollStore;
