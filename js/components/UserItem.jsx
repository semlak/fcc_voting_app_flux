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
import ReactPropTypes from 'react/lib/ReactPropTypes';
import {browserHistory} from 'react-router';


var UserItem = React.createClass({

	propTypes: {
		user: ReactPropTypes.object.isRequired
	},


	// handleUserSelect: function(e) {
	handleUserSelect: function() {
		// console.log('running handleUserSelect.');
		browserHistory.push('/users/' + this.props.user.username);
	},


	render: function() {
		var user = this.props.user;
		return (
			<div className='poll well' onClick={this.handleUserSelect}>
					{'User: ' + user.username}
			</div>
		);
	}
});

module.exports = UserItem;
