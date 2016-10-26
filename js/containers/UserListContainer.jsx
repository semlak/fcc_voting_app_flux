'use strict';

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the UserStore and passes the new data to its children.
 */

import React from 'react';
import UserList from '../components/UserList';
import UserStore from '../stores/UserStore';

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
		UserStore.addChangeListener(this._onUserChange);
	},

	componentWillUnmount: function() {
		UserStore.removeChangeListener(this._onUserChange);
	},

	/**
	 * @return {object}
	 */
						// {this.state.allUsers != {} ? <UserList allUsers={this.state.allUsers} />: <p>No users currently registered</p>}

	render: function() {
		// console.log("Rendering <UserListContainer />");
		return (
				<div id='userapp'  className='user-list-container'>
					<UserList allUsers={this.state.allUsers} />
				</div>
		);
	},

	/**
	 * Event handler for 'change' events coming from the UserStore
	 */
  // _onUserChange: function(message) {
	_onUserChange: function() {
		// console.log("received _onUserChange event in <UserListContainer/>")
		// if (message != null) {
		//   console.log("Message:", message)
		// }
		this.setState(getUserState());
	}

});
