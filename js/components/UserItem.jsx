/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

 // This is called UserItem rather than just 'User', because it is specifically to represent a User on a list of Users.

var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserActionCreators = require('../actions/UserActionCreators');
import NavLink from './NavLink'

// var UserTextInput = require('./UserTextInput');


var UserItem = React.createClass({

  propTypes: {
   user: ReactPropTypes.object.isRequired
  },


  /**
   * @return {object}
   */
  render: function() {
    var user = this.props.user;



    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return (
      <div className='user-item' key={user.id}>
            <NavLink to={'/users/' + user.username}>{user.username}</NavLink>
      </div>
    );
  }
});

module.exports = UserItem;
