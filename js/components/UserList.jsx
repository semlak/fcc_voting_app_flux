/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from 'react';
var ReactPropTypes = React.PropTypes;
import UserActionCreators from '../actions/UserActionCreators';
import UserItem from './UserItem';
import {Row, Col, Grid} from 'react-bootstrap'

var UserList = React.createClass({

  propTypes: {
    allUsers: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // console.log("rendering <UserList />")
    // if (Object.keys(this.props.allUsers).length < 1) {
    //   return null;
    // }

    var allUsers = this.props.allUsers;
    var userNodes = []
    // var users = allUsers.map(user => (<li><UserItem key={user.id} user={user}/></li>));

    for (var key in allUsers) {
      userNodes.push(
        <Col key={key} xs={12} sm={6} md={3} className=''>
          <UserItem  user={allUsers[key]} />
        </Col>
        // <li key={key}><UserItem user={allUsers[key]} /></li>
        );
    }

    // This function should return null when there are no users to list.
    if (userNodes.length == 0) {
      userNodes.push(
        <Col key={1} xs={12} sm={12} md={12} className=''>
          <div>No users.</div>
        </Col>
      )
    }

    // for (var key in allPolls) {
    //   // console.log("poll:", allPolls[key]);
    //   pollNodes.push(
    //     <Col key={key} xs={12} sm={6} md={6} className=''>
    //       <PollItem  poll={allPolls[key]} />
    //     </Col>
    //     );
    // }

    return (
      // <div id="user-list">
      //   <ul id="user-list">{users}</ul>
      // </div>

      <div>
        <div id="user-list" className='pollBoxHeader'>
          <h2 className='displayInline'>Listing of all Users:</h2>
        </div>
        <br />
        <Grid>
          <Row className='userList pollList'>
            {userNodes}
          </Row>
        </Grid>
      </div>

    );
  }

});

module.exports = UserList;
