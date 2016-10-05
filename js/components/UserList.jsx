/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserActionCreators = require('../actions/UserActionCreators');
var UserItem = require('./UserItem');

var UserList = React.createClass({

  propTypes: {
    allUsers: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are users.
    if (Object.keys(this.props.allUsers).length < 1) {
      return null;
    }

    // if (this.props.allUsers.length < 1) {
    //   return null;
    // }

    var allUsers = this.props.allUsers;
    var users = []
    // var users = allUsers.map(user => (<li><UserItem key={user.id} user={user}/></li>));

    for (var key in allUsers) {
      users.push(<li key={key}><UserItem user={allUsers[key]} /></li>);
    }

    return (
      <div id="user-list">
        <ul id="user-list">{users}</ul>
      </div>
    );
  },

  /**
   * Event handler to mark all USERs as complete
   */
  _onToggleCompleteAll: function() {
    UserActionCreators.toggleCompleteAll();
  }

});

module.exports = UserList;
