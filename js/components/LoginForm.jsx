import React from 'react'
import UserStore from '../stores/UserStore';
import UserActionCreators from '../actions/UserActionCreators';
import {Button, Grid, Row, Col, Form, FormGroup, FormControl, Checkbox, ControlLabel, HelpBlock} from 'react-bootstrap'
import ReactPropTypes from 'react/lib/ReactPropTypes';


export default React.createClass({
	getInitialState: function() {
		return {
				username: '',
				password: '',
				message_obj: null
		};
	},

  componentDidMount: function() {
    UserStore.addAuthenticationChangeListener(this._onAuthenticationChange);
  },

  componentWillUnmount: function() {
    UserStore.removeAuthenticationChangeListener(this._onAuthenticationChange);
  },

	handleLogin: function() {
		UserActionCreators.login(this.state.username, this.state.password)
	},

	handleFieldChange: function(e) {
		// console.log(e.target.name, e.target.value)
		var key = e.target.name.toString();
		var newParam = {}
		newParam[key] = e.target.value
		newParam['message_obj'] = null;
		this.setState(newParam)
	},
	render: function() {
		// console.log("rendering LoginForm")
		var message_obj = this.state.message_obj;
		var validationState = message_obj == null ? null : (message_obj.error ? "error" : "success");
		var validationMessage = message_obj == null ? "" : message_obj.message_text;
		return (
			<div className="sign_in_form" onClick={this.handleClick} >
				<div className="modal-body" onClick={this.handleClick} >
				  <Form horizontal>
				  	<FormGroup validationState={validationState}>
					    <FormGroup controlId="formHorizontalUsername">
					      <Col smOffset={0} sm={2} componentClass={ControlLabel}>
					        Username:
					      </Col>
					      <Col sm={10}>
					        <FormControl type="text" name="username" value={this.state.username} onChange={this.handleFieldChange} placeholder='Enter Username' />
					      </Col>
					    </FormGroup>
					    <FormGroup controlId="formHorizontalPassword">
					      <Col smOffset={0} sm={2} componentClass={ControlLabel}>
					        Password:
					      </Col>
					      <Col sm={10}>
					        <FormControl type="password" name="password" value={this.state.password} onChange={this.handleFieldChange} placeholder='Enter Password'/>
					      </Col>
					    </FormGroup>
				    	<Col smOffset={2} sm={10}>
								{validationState == null ? <HelpBlock>{"Log in with your username and password."}</HelpBlock> : <HelpBlock>{validationMessage}</HelpBlock> }
							</Col>
					  </FormGroup>
				  </Form>
				</div>
				<div className="modal-footer">
					<Button bsStyle="primary" onClick={this.handleLogin}>Sign In</Button>
					<Button bsStyle='default' onClick={this.props.onCancel}>Cancel </Button>
				</div>
			</div>
		);
	},

  _onAuthenticationChange: function(message_obj) {
    // this.setState(getUserState());
    if (message_obj != null && message_obj.error) {
    	this.setState({message_obj: message_obj});
    }
  }
})