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
 * the UserStore and passes the new data to its children.
 */

var React = require('react');
var UserList = require('./UserList');
var UserStore = require('../stores/UserStore');

/**
 * Retrieve the current USER data from the UserStore
 */
function getUserState() {
  return {
    allUsers: UserStore.getAll()
    // areAllComplete: UserStore.areAllComplete()
  };
}

export default React.createClass({

  getInitialState: function() {
    return getUserState();
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
            // {this.state.allUsers != {} ? <UserList allUsers={this.state.allUsers} />: <p>No users currently registered</p>}

  render: function() {
    // console.log("Rendering <UserListContainer />");
    return (
        <section id='userapp'  className=''>
          <h2>User Listing</h2>
             <UserList allUsers={this.state.allUsers} />
        </section>
    );
  },

  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onChange: function(message) {
    // console.log("received _onChange event in <UserListContainer/>")
    // if (message != null) {
    //   console.log("Message:", message)
    // }
    this.setState(getUserState());
  }

});
