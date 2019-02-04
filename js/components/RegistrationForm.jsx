'use strict';

import React from 'react';
// import {Button, Grid, Row, Col, Form, FormGroup, FormControl, Checkbox, ControlLabel, HelpBlock} from 'react-bootstrap';
import {Button, Col, Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
import UserStore from '../stores/UserStore';
import UserActionCreators from '../actions/UserActionCreators';
// import ReactPropTypes from 'react/lib/ReactPropTypes';


export default React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      password_confirm: '',
      fullname: '',
      message_obj: null
    };
  },
  // componentWillReceiveProps: function(nextProps) {
  //   // console.log('in 'componentWillReceiveProps' of RegisterForm, nextProps is ', nextProps);
  // },

  prepareRegisterRequest: function() {
    if (this.state.password_confirm != this.state.password) {
      this.setState({message_obj: {error: true, message_text: 'Password and Password Confirmation must match.'}});
    }
    else if (this.state.password.length < 1) {
      this.setState({message_obj: {error: true, message_text: 'Password must have at least 1 character.'}});
    }
    else if (this.state.username.length < 1) {
      this.setState({message_obj: {error: true, message_text: 'Username must have at least 1 character.'}});
    }
    else if (UserStore.getUserByUsername(this.state.username) != null) {
      this.setState({message_obj: {error: true, message_text: 'Username is already taken.'}});
    }
    else {
      var data = {
        username: this.state.username,
        password: this.state.password,
        fullname: this.state.fullname || this.state.username
      };
      UserActionCreators.create(data);
    }
  },

  handleFieldChange: function(e) {
    // console.log(e.target.name, e.target.value);
    var key = e.target.name.toString();
    var newState = {};
    newState[key] = e.target.value;
    newState.message_obj = null;
    this.setState(newState);
  },

  componentDidMount: function() {
    UserStore.addCreateListener(this._onUserCreate);
  },

  componentWillUnmount: function() {
    UserStore.removeCreateListener(this._onUserCreate);
  },

  render: function() {
    // console.log('rendering RegistrationForm');
    var message_obj = this.state.message_obj;
    var validationState = message_obj == null ? null : (message_obj.error ? 'error' : 'success');
    var validationMessage = message_obj == null ? '' : message_obj.message_text;
    return (
      <div className='registration-form'>
        <div className='modal-body'>
          <Form horizontal>
            <FormGroup validationState={validationState}>
              <FormGroup controlId='RegistrationFormHorizontalUsername'>
                <Col smOffset={0} sm={2} componentClass={ControlLabel}>
                  Username:
                </Col>
                <Col sm={10}>
                  <FormControl type='text' autoComplete='off' name='username' value={this.state.username} onChange={this.handleFieldChange} placeholder='Enter Username' />
                </Col>
              </FormGroup>
              <FormGroup controlId='RegistrationFormHorizontalFullname'>
                <Col smOffset={0} sm={2} componentClass={ControlLabel}>
                  Fullname:
                </Col>
                <Col sm={10}>
                  <FormControl type='text' autoComplete='off' name='fullname' value={this.state.fullname} onChange={this.handleFieldChange} placeholder='Enter Fullname (optional)' />
                </Col>
              </FormGroup>
              <FormGroup controlId='formHorizontalPassword'>
                <Col smOffset={0} sm={2} componentClass={ControlLabel}>
                  Password:
                </Col>
                <Col sm={10}>
                  <FormControl type='password' autoComplete='off' name='password' value={this.state.password} onChange={this.handleFieldChange} placeholder='Enter Password'/>
                </Col>
              </FormGroup>
              <FormGroup controlId='formHorizontalPasswordConfirm'>
                <Col smOffset={0} sm={2} componentClass={ControlLabel}>
                  Confirm:
                </Col>
                <Col sm={10}>
                  <FormControl type='password' autoComplete='off' name='password_confirm' value={this.state.password_confirm} onChange={this.handleFieldChange} placeholder='Confirm Password'/>
                </Col>
              </FormGroup>
              <Col smOffset={2} sm={10}>
                {validationState == null ? <HelpBlock>{'Create a new username with fullname (optional) and password.'}</HelpBlock> : <HelpBlock>{validationMessage}</HelpBlock> }
              </Col>
            </FormGroup>
          </Form>
        </div>
        <div className='modal-footer'>
          <Button type='button' bsStyle='primary' onClick={this.prepareRegisterRequest}>Register</Button>
          <Button type='button' bsStyle='default'  onClick={this.props.onCancel} >Cancel</Button>
        </div>
      </div>
    );
  },


  _onUserCreate: function(message_obj) {
    // console.log('received _onUserCreate event in <RegistrationForm />');
    if (message_obj != null && message_obj.error) {
      this.setState({message_obj: message_obj});
    }
    else {
      let newState = UserStore.getState();
      if (newState.error) {
        this.setState({message_obj: {error: true, message_text: newState.errorMessage}});
      }
      else if (newState.authenticatedUser.id != null) {
        this.setState({
          message_obj: {error: false, message_text: newState.successMessage},
          username: '', password: '', password_confirm: '', fullname: ''
        });
      }
    }
  }
});
