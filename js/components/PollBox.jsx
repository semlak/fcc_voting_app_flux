/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the PollStore and passes the new data to its children.
 */

var React = require('react');
var PollList = require('./PollList');
var PollStore = require('../stores/PollStore');
var UserStore = require('../stores/UserStore');


function filterPollsByOwner(polls, owner_username) {
  var owner = UserStore.getUserByUsername(owner_username)
  var owner = UserStore.getUserByUsername(owner_username)
  var owner_id = typeof owner == 'object' ? owner.id : ''
  var filteredPolls = {}
  Object.keys(polls).forEach(function(poll_id) {
    if (polls[poll_id].owner.toString() == owner_id.toString()) {
      filteredPolls[poll_id] = polls[poll_id]
    }
  })
  return filteredPolls;
}

/**
 * Retrieve the current POLL data from the PollStore
 */
function getPollState() {
  return {
    allPolls: PollStore.getAll()
    // areAllComplete: PollStore.areAllComplete()
  };
}

export default React.createClass({

  getInitialState: function() {
    return getPollState();
  },

  componentDidMount: function() {
    PollStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    PollStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    // console.log("rendering Pollbox, props are", this.props, ', allPolls are', this.state.allPolls)
    var pollsToRender;
    if (this.props.params && this.props.params.userPollsToRender && this.props.params.userPollsToRender != null) {
      pollsToRender = filterPollsByOwner(this.state.allPolls, this.props.params.userPollsToRender)
    }
    else {
      pollsToRender = this.state.allPolls
    }
    // console.log("polls to render are ", pollsToRender)
    return (
        <div id='pollapp'  className='pollBox'>
          <PollList allPolls={pollsToRender} />
        </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the PollStore
   */
  _onChange: function() {
    // console.log("received CHANGE signal for poll in PollBox. Updating state with allPolls.")
    this.setState(getPollState());
  }

});
