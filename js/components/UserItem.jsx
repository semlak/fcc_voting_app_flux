/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

 // This is called UserItem rather than just 'User', because it is specifically to represent a User on a list of Users.

import React from 'react';
var ReactPropTypes = React.PropTypes;
// import UserActionCreators from '../actions/UserActionCreators';
// import NavLink from './NavLink'
var Router = require('react-router');

// import UserTextInput from './UserTextInput';


var UserItem = React.createClass({

  propTypes: {
   user: ReactPropTypes.object.isRequired
  },


  handleUserSelect: function(e) {
    console.log("running handleUserSelect.")
    Router.browserHistory.push('/users/' + this.props.user.username);
  },
  /**
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
      // <div className='user-item well poll' key={user.id}>
      //       <NavLink to={'/users/' + user.username}>{user.username}</NavLink>
      // </div>

      <div className='poll well' onClick={this.handleUserSelect}>
          {"User: " + user.username}
      </div>
    );
  }
});

module.exports = UserItem;
