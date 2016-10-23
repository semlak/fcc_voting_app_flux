/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from 'react';
import ReactPropTypes from 'react/lib/ReactPropTypes';
// import UserActionCreators from '../actions/UserActionCreators';
import UserItem from './UserItem';
import {Row, Col, Grid} from 'react-bootstrap';

var UserList = React.createClass({

	propTypes: {
		allUsers: ReactPropTypes.object.isRequired
	},

	render: function() {
		var allUsers = this.props.allUsers;
		var userNodes = [];
		// var users = allUsers.map(user => (<li><UserItem key={user.id} user={user}/></li>));


		for (var key in allUsers) {
			userNodes.push(
				<Col key={key} xs={12} sm={6} md={3} className=''>
					<UserItem  user={allUsers[key]} />
				</Col>
				);
		}

		// If there are no uses, push a div onto the empty userNodes with text "No users."
		if (userNodes.length == 0) {
			userNodes.push(
				<Col key={1} xs={12} sm={12} md={12} className=''>
					<div>No users.</div>
				</Col>
			);
		}

		return (
			<div>
				<div id="user-list" className='poll-container-header'>
					<h2 className='display-inline'>Listing of all Users:</h2>
				</div>
				<br />
				<Grid>
					<Row className='user-list poll-list'>
						{userNodes}
					</Row>
				</Grid>
			</div>

		);
	}

});

module.exports = UserList;
