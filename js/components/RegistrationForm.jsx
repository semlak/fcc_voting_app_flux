import React from 'react'
import {Button} from 'react-bootstrap'

export default React.createClass({
	getInitialState: function() {
		return {
				username: '',
				password: '',
				fullname: '',
				role: '',
				error_message: ''
		};
	},
	componentWillReceiveProps: function(nextProps) {
		// console.log("in 'componentWillReceiveProps' of RegisterForm, nextProps is ", nextProps)
	},
	componentDidMount: function() {
		// $('#register_box').on('show.bs.modal', function (e) {
		// 	this.setState(this.getInitialState())
		// 	$('#register_message').empty()
		// 	$('#sign_in_message').empty()
		//   // if (!data) return e.preventDefault() // stops modal from being shown
		// }.bind(this))
	},
	prepareRegisterRequest: function() {
		var data = {
			username: this.state.username,
			password: this.state.password,
			fullname: this.state.fullname || this.state.username,
			role: this.state.role
		}
		// $.ajax({
		// 	type: 'POST',
		// 	url: '/register',
		// 	data: data,
		// 	success: function(result) {
		// 		if (!result) {
		// 			// $("#usermenu-list").append('<li>Invalid Username or password</li>');
		// 			console.log("unable to register")

		// 		}
		// 		else {
		// 			console.log("result is ", result)
		// 			if (result.user) {
		// 				this.props.updateAppState({user: result.user})
		// 				$("#register_box").modal('hide')
		// 			}
		// 			else if (result.message) {
		// 				this.setState({error_message: result.message})
		// 				// $('#register_message').append("<div class='alert alert-danger fade in'>" + this.state.modal_error_message + "<button type='button' class='close pull-right' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>")
		// 			}
		// 		}
		// 	}.bind(this),
		// 	error: function(xhr, status, err) {
		// 		// this.setState({data: newPoll});
		// 		console.error("error when trying to register", this.props.poll_url, xhr, status, err.toString());
		// 	}.bind(this)
		// })
	},
	handleFieldChange: function(e) {
		// console.log(e.target.name, e.target.value)
		var key = e.target.name.toString();
		var newParam = {}
		newParam[key] = e.target.value
		// newParam[e.target.name] = e.target.value
		// console.log('newParam is ', newParam)
		// var blah = {param: ''}
		this.setState(newParam)
	},
	render: function() {
		console.log("rendering RegistrationForm")
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
					<div className='form-group'>
						<input className='form-control' type='text' name='role' onChange={this.handleFieldChange} value={this.state.role} placeholder='Role (not required, can leave blank)' />
					</div>
				</div>
				<div className="modal-footer">
					<Button type='button' bsStyle='primary' onClick={this.prepareRegisterRequest}>Register</Button>
					<Button type='button' bsStyle='default'  onClick={this.props.onCancel} >Cancel</Button>
				</div>
			</div>
		);
	}


})