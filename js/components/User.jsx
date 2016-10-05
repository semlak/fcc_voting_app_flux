import React from 'react'
import NavLink from './NavLink'
import {Button} from 'react-bootstrap'

var Router = require('react-router');

var UserStore = require('../stores/UserStore');

export default React.createClass({
	backToUserList: function() {
		Router.browserHistory.push('/users');

	},

	render: function() {
		var username = this.props.params.userName;
		var user = UserStore.getUserByUsername(username);
		return (
      <section id='userapp'  className=''>
				<h2>User details</h2>
				<div className='poll well'>
					<p>Username: <span>{username}</span></p>
					<p>Fullname: <span>{user.fullname}</span></p>
					<p>Role: <span>{user.role}</span></p>
					<br/>
					<NavLink to={'/Users/' + username + '/polls'}>Polls of {user.fullname || user.username}</NavLink>
					<br/>
					<Button type='button' bsStyle='default' onClick={this.backToUserList}>Back to User List</Button>
				</div>
			</section>
		)
	}
})