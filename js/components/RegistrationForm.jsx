import React from 'react';
import {Button} from 'react-bootstrap';
var UserStore = require('../stores/UserStore');
var UserActionCreators = require('../actions/UserActionCreators');

export default React.createClass({
	getInitialState: function() {
		return {
				username: '',
				password: '',
				fullname: '',
				error_message: ''
		};
	},
	componentWillReceiveProps: function(nextProps) {
		// console.log("in 'componentWillReceiveProps' of RegisterForm, nextProps is ", nextProps)
	},

	prepareRegisterRequest: function() {
		var data = {
			username: this.state.username,
			password: this.state.password,
			fullname: this.state.fullname || this.state.username
		}
		UserActionCreators.create(data);
	},

	handleFieldChange: function(e) {
		// console.log(e.target.name, e.target.value)
		var key = e.target.name.toString();
		var newState = {};
		newState[key] = e.target.value;
		newState.error_message = '';
		this.setState(newState);
	},

  componentDidMount: function() {
    UserStore.addCreateListener(this._onUserCreate);
  },

  componentWillUnmount: function() {
    UserStore.removeCreateListener(this._onUserCreate);
  },

	render: function() {
		// console.log("rendering RegistrationForm")
		return (
			<div className="registration_form">
				<div className="modal-body">
					<div id='register_message' className={(this.state.error_message == '' ? ' hidden' : 'alert alert-danger')}>{this.state.error_message || 'Hey'}
						<button type='button' className='close pull-right' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span>
						</button>
					</div>

					<div className='form-group'>
						<input className='form-control' autoComplete='off' type='text' name='username' onChange={this.handleFieldChange} value={this.state.username} placeholder='Enter Username' />
					</div>
					<div className='form-group'>
						<input className='form-control' autoComplete='off' type='password' name='password' onChange={this.handleFieldChange} value={this.state.password} placeholder='Password' />
					</div>
					<div className='form-group'>
						<input className='form-control' type='text' name='fullname' onChange={this.handleFieldChange} value={this.state.fullname} placeholder='Enter full name (not required, can leave blank)' />
					</div>
				</div>
				<div className="modal-footer">
					<Button type='button' bsStyle='primary' onClick={this.prepareRegisterRequest}>Register</Button>
					<Button type='button' bsStyle='default'  onClick={this.props.onCancel} >Cancel</Button>
				</div>
			</div>
		);
	},


  _onUserCreate: function(message) {
    console.log("received _onUserCreate event in <RegistrationForm />")
    if (message != null) {
      console.log("Message:", message)
	    this.setState({error_message: message});
    }
  }



})