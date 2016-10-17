import React from 'react'
import NavLink from './NavLink'
import ChangePasswordForm from './ChangePasswordForm'
// import {Button, Form, Col, FormGroup, ControlLabel} from 'react-bootstrap'
import {Button, Grid, Row, Col, Form, FormGroup, FormControl, Checkbox, ControlLabel, HelpBlock} from 'react-bootstrap'

var Router = require('react-router');
import UserStore from '../stores/UserStore';
import UserActionCreators from '../actions/UserActionCreators';

export default React.createClass({
	getInitialState: function() {
		var username = this.props.params.username;
		var user = UserStore.getUserByUsername(username) || {};
		return {
			user: user,
			currentUser: this.getCurrentUser(),
			//the following are only used if updating the user.
			username: user.username || '',
			fullname: user.fullname || '',
			role: user.role || '',
			message_obj: null
		}
		//'user' is the user being displayed in this item. currentUser is the authenticated user (if authenticated, {} otherwise).
	},

	backToUserList: function() {
		Router.browserHistory.push('/users');

	},

	getCurrentUser: function() {
		return UserStore.getAuthenticatedUser();
	},


  componentDidMount: function() {
    UserStore.addAuthenticationChangeListener(this._onAuthenticationChange);
    UserStore.addChangeListener(this._onUserChange);
  },

  componentWillUnmount: function() {
    UserStore.removeAuthenticationChangeListener(this._onAuthenticationChange);
    UserStore.removeChangeListener(this._onUserChange);
  },

  updateUser: function(e) {
		console.log("in updateUser of <FullUser/>, target.name: ", e.target.name);
		var key = e.target.name.toString();
		var data = {};
		data[key] = this.state[key];
		console.log("data is ", data);
		UserActionCreators.update(this.state.user.id, data);
		// this.setState(data)

  },

	handleFieldChange: function(e) {
		console.log(e.target.name, e.target.value)
		var key = e.target.name.toString();
		var newParam = {}
		newParam[key] = e.target.value
		newParam.message_obj = null;
		this.setState(newParam)
	},

	render: function() {
		var user = this.state.user;

		if (user == null || user.username == null) {
			return (
				<div>Currently loading data</div>
			)
		}

		var uneditableUser = function() {
			return (
	      <div id='userapp'  className=''>
					<h2>User details</h2>
					<div className='poll well'>
						<p>Username: <span>{user.username}</span></p>
						<p>Fullname: <span>{user.fullname}</span></p>
						<p>Role: <span>{user.role}</span></p>
						<p><NavLink to={'/Users/' + user.username + '/polls'}>Polls of {user.fullname || user.username}</NavLink></p>
						<br/>
						<Button type='button' bsStyle='default' onClick={this.backToUserList}>Back to User List</Button>
					</div>
				</div>
			);
		}.bind(this);

		var editableUser = function() {
			var message_obj = this.state.message_obj;
			var validationState = message_obj == null ? null : (message_obj.error ? "error" : "success");
			var validationMessage = message_obj == null ? "" : message_obj.message_text;
			return (
	      <div id='userapp'  className=''>
					<h2>User details</h2>
					<div className='poll well'>
					  <Form horizontal>
					  	<FormGroup validationState={validationState}>
						    <FormGroup controlId="formHorizontalUsername">
						      <Col componentClass={ControlLabel} sm={2}>
						        Username:
						      </Col>
						      <Col sm={8}>
						        <FormControl type="text" name="username" value={this.state.username} onChange={this.handleFieldChange}/>
						      </Col>
						      <Col sm={2}>
						      	<Button name="username" onClick={this.updateUser}>Update</Button>
						      </Col>
						    </FormGroup>

						    <FormGroup controlId="formHorizontalFullname">
						      <Col componentClass={ControlLabel} sm={2}>
						        Fullname:
						      </Col>
						      <Col sm={8}>
						        <FormControl type="text" name="fullname" value={this.state.fullname} onChange={this.handleFieldChange}/>
						      </Col>
						      <Col sm={2}>
						      	<Button name="fullname" onClick={this.updateUser}>Update</Button>
						      </Col>
						    </FormGroup>
						    <FormGroup controlId="formHorizontalRole">
						      <Col componentClass={ControlLabel} sm={2}>
						        Role:
						      </Col>
						      <Col sm={8}>
						        <FormControl componentClass="select" name="role" value={this.state.role || ''} onChange={this.handleFieldChange}>
							        <option value=""></option>
							        <option value="user">user</option>
							        <option value="admin">admin</option>
						      	</FormControl>
						      </Col>
						      <Col sm={2}>
						      	<Button name="role" onClick={this.updateUser}>Update</Button>
						      </Col>
						    </FormGroup>
					    	<Col smOffset={2} sm={10}>
									{validationState == null ? null : <HelpBlock>{validationMessage}</HelpBlock> }
								</Col>
						  </FormGroup>
					  </Form>
						<Button type='button' bsStyle='default' onClick={this.backToUserList}>Back to User List</Button>
					</div>
				</div>
			);
		}.bind(this);


		if (this.state.currentUser.role == 'admin' || this.state.currentUser.username == user.username) {
			return editableUser();
		}
		else {
			return uneditableUser();
		}


	},


	_onUserChange: function(message_obj) {
		console.log("in _onUserChange of <FullUser />")
		var user = UserStore.getUserByUsername(this.props.params.username) || {};
		if (this.state.user.username != null && message_obj != null ) {
			//this is likely just after the user attempted to update user info on the screen.
			this.setState({message_obj: message_obj});
		}
		else if (user.username != null && this.state.user.username == null) {
			console.log("in 'if' branch of _onUserChange in <FullUser />")
			//this is likely just after page load. UserStore _users was initially empty but now loaded, and username in url now valid
			this.setState(this.getInitialState())
		}
		else if (message_obj == null && this.state.user.username != null && this.state.username != this.state.user.username) {
			console.log("in 'else if' branch of _onUserChange in <FullUser />")
			//this is likely just after updating the username. This page URL will no longer correctly load the user (because it is keyed by username).
			Router.browserHistory.push('/users/' + this.state.username);
		}
		else {
			console.log("in 'else' branch of _onUserChange in <FullUser />")
			this.setState(this.getInitialState())
		}

	},

	_onAuthenticationChange: function(message_obj) {
		console.log("in _onAuthenticationChange of <FullUser />")
		console.log("message_obj:", message_obj, ", message_obj == null", message_obj == null);
		this.setState({currentUser: this.getCurrentUser()});
	}
})