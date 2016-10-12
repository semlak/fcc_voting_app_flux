import React from 'react'
var UserStore = require('../stores/UserStore');
var UserActionCreators = require('../actions/UserActionCreators');
import {Button} from 'react-bootstrap'

export default React.createClass({
	getInitialState: function() {
		return {
				username: '',
				password: '',
				error_message: ''
		};
	},


  // getInitialState: function() {
  //   UserStore.getAllUsersFromServer()
  //   return getUserState();
  // },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

	// handleClick: function(e) {
	// 	console.log("\n\n\n\n\nclicked element of LoginForm. e is ", e, '\n\ne.nativeEvent is ', e.nativeEvent)
	// 	e.stopPropagation()
	// 	e.nativeEvent.stopImmediatePropagation()
	// },
	// componentWillReceiveProps: function(nextProps) {
	// 	// console.log("in 'componentWillReceiveProps' of LoginForm, nextProps is ", nextProps)
	// },
	handleLogin: function() {
		UserActionCreators.login(this.state.username.trim(), this.state.password.trim())
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
		// console.log("rendering LoginForm")
		return (
			<div className="sign_in_form" onClick={this.handleClick} >
				<div className="modal-body" onClick={this.handleClick} >
					<div id='sign_in_message' className={(this.state.error_message == '' ? ' hidden' : 'alert alert-danger')}>{this.state.error_message || 'Hey'}
						<button type='button' className='close pull-right' data-hide='alert' aria-label='Close'><span aria-hidden='true'>&times;</span>
						</button>
					</div>

					<div className='form-group' >
						<input className='form-control' type='text' name='username' onChange={this.handleFieldChange} value={this.state.username} placeholder='Enter Username' onClick={this.handleClick} />
					</div>
					<div className='form-group'>
						<input className='form-control' type='password' name='password' onChange={this.handleFieldChange} value={this.state.password} placeholder='Enter Password' />
					</div>
				</div>
				<div className="modal-footer">
					<Button bsStyle="primary" onClick={this.handleLogin}>Sign In </Button>
					<Button bsStyle='default' onClick={this.props.onCancel}>Cancel </Button>
				</div>
			</div>
		);
	},

  _onChange: function() {
    // this.setState(getUserState());
  }
})