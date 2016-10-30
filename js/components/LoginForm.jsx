'use strict';

import React from 'react';
import UserStore from '../stores/UserStore';
// import UserActionCreators from '../actions/UserActionCreators';
// import {Button, Grid, Row, Col, Form, FormGroup, FormControl, Checkbox, ControlLabel, HelpBlock} from 'react-bootstrap';
import {Button,  Col, Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
// import ReactPropTypes from 'react/lib/ReactPropTypes';


export default React.createClass({
	getInitialState: function() {
		return {
			username: '',
			password: '',
			message_obj: null
		};
	},

	componentDidMount: function() {
		UserStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		UserStore.removeChangeListener(this._onChange);
	},

	handleLogin: function() {
		let username = this.state.username;
		let password = this.state.password;
		if (username == null || username.length < 1 ) {
			this.setState({message_obj: { error: true, message_text: 'Username must be at least one character long.'}});
		}
		else if (password == null || password.length < 1) {
			this.setState({message_obj: { error: true, message_text: 'Password must be at least one character long.'}});
		}
		else {
			this.props.handleLogin(username, password);
		}
	},

	handleFieldChange: function(e) {
		var key = e.target.name.toString();
		var newParam = {};
		newParam[key] = e.target.value;
		newParam['message_obj'] = null;
		this.setState(newParam);
	},

	onKeyPress: function(e) {
		if (e.key === 'Enter') {
			this.handleLogin();
		}
	},

	render: function() {
		// console.log('rendering LoginForm');
		var message_obj = this.state.message_obj;
		var validationState = message_obj == null ? null : (message_obj.error ? 'error' : 'success');
		var validationMessage = message_obj == null ? '' : message_obj.message_text;
		return (
			<div className='sign-in-form' onKeyPress={this.onKeyPress}>
				<div className='modal-body'>
					<Form horizontal>
						<FormGroup validationState={validationState} id='top-form-group' >
							<FormGroup controlId='formHorizontalUsername'>
								<Col smOffset={0} sm={2} componentClass={ControlLabel}>
									Username:
								</Col>
								<Col sm={10}>
									<FormControl type='text' name='username' value={this.state.username} onChange={this.handleFieldChange} placeholder='Enter Username' />
								</Col>
							</FormGroup>
							<FormGroup controlId='formHorizontalPassword'>
								<Col smOffset={0} sm={2} componentClass={ControlLabel}>
									Password:
								</Col>
								<Col sm={10}>
									<FormControl type='password' name='password' value={this.state.password} onChange={this.handleFieldChange} placeholder='Enter Password' />
								</Col>
							</FormGroup>
							<Col smOffset={2} sm={10}>
								<HelpBlock>{validationState == null ? 'Log in with your username and password.' : validationMessage}</HelpBlock>
							</Col>
						</FormGroup>
					</Form>
				</div>
				<div className='modal-footer'>
					<Button bsStyle='primary' id='login-button' onClick={this.handleLogin}>Sign In</Button>
					<Button bsStyle='default' id='cancel-button' onClick={this.props.onCancel}>Cancel</Button>
				</div>
			</div>
		);
	},


	_onChange: function() {
		// console.log('in _onChange for UserStore in LoginForm.');
		let newState = UserStore.getState();
		// console.log('newState: ', newState);
		if (newState.error) {
			this.setState({message_obj: {error: true, message_text: newState.errorMessage}});
		}
		else if (newState.authenticatedUser.id != null) {
			this.setState({message_obj: {error: false, message_text: newState.successMessage}, username: '', password: ''});
		}

	},


});