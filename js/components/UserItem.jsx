'use strict';

/**
components/UserItem.jsx

 This is called UserItem rather than just 'User', because it is specifically to represent a User on a list of Users.
**/

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
			<div className='poll well poll-label' onClick={this.handleUserSelect}>
					{'Username: ' + user.username}
			</div>
		);
	}
});

module.exports = UserItem;
