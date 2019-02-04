'use strict';

/*
components/ChangePasswordForm.jsx

Needs username (string) passed as a prop
*/


import React from 'react';
// import NavLink from './NavLink';
import {Modal, Button, Grid,  Col, Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
// import {browserHistory} from 'react-router';
// import UserStore from '../stores/UserStore';
// import UserActionCreators from '../actions/UserActionCreators';
// import ReactPropTypes from 'react/lib/ReactPropTypes';

export default React.createClass({
  getInitialState: function() {
    return {
      current_password: '',
      new_password: '',
      new_password_confirm: '',
      message_obj: null
    };
  },

  changePassword: function() {
  // changePassword: function(e) {
    // console.log('attempting to change password.');
    if (this.props.userStoreState.authenticatedUser.role != 'admin' && this.state.current_password == '') {
      this.setState({message_obj: {error: true, message_text: 'You must type your current password in the \'Current Password\' Field'} });
    }
    else if (this.state.new_password != this.state.new_password_confirm) {
      this.setState({message_obj: {error: true, message_text: 'Your new password and password confirmation do not match'}});
    }
    else if (this.state.new_password == null || this.state.new_password.length < 8) {
      this.setState({message_obj: {error: true, message_text: 'Your new password must be at least 8 characters long.'}});
    }
    else {
      //right now, I don't know how to check that current password is accurate. I'm thinking I will send current and new password to server
      //The server will authenticate the userToChange, then reauthenticate with current password, and then change password if authenticated.
      var data = { current_password: this.state.current_password, new_password: this.state.new_password};
      this.props.handlePasswordChange(this.props.userToChange.id, data);
    }
  },

  handleFieldChange: function(e) {
    // console.log(e.target.name, e.target.value)
    var key = e.target.name.toString();
    var newParam = {};
    newParam[key] = e.target.value;
    newParam.message_obj = null;
    this.setState(newParam);
  },

  render: function() {
    var userToChange = this.props.userToChange;
    console.log('in render function for ChangePaswwordForm. userToChange:', userToChange);
    if (userToChange == null || userToChange.username == null) {
      return (
        <div>Currently loading data</div>
      );
    }

    var message_obj = this.state.message_obj;
    var validationState = message_obj == null ? null : (message_obj.error ? 'error' : 'success');
    var validationMessage = message_obj == null ? '' : message_obj.message_text;
    // console.log('message_obj: ', message_obj, ', validationState: ', validationState, ', validationMessage: ', validationMessage);

    var currentPasswordFormGroup = (
      <FormGroup controlId='formHorizontalPassword'>
        <Col smOffset={0} sm={3} componentClass={ControlLabel}>
          Current Password:
        </Col>
        <Col sm={8}>
          <FormControl type='password' name='current_password' value={this.state.current_password} placeholder='Type your current password.' onChange={this.handleFieldChange}/>
        </Col>
      </FormGroup>
    );

    var newPasswordFormGroup = (
      <FormGroup controlId='formHorizontalPasswordNew'>
        <Col smOffset={0} sm={3} componentClass={ControlLabel}>
          New Password:
        </Col>
        <Col sm={8}>
          <FormControl type='password' name='new_password' value={this.state.new_password} placeholder='Type your new password.' onChange={this.handleFieldChange}/>
        </Col>
      </FormGroup>
    );

    var newPasswordConfirmFormGroup = (
      <FormGroup controlId='formHorizontalPasswordConfirm'>
        <Col smOffset={0} sm={3} componentClass={ControlLabel}>
          Password Confirm:
        </Col>
        <Col sm={8}>
          <FormControl type='password' name='new_password_confirm' value={this.state.new_password_confirm} placeholder='Retype your new password.' onChange={this.handleFieldChange}/>
        </Col>
      </FormGroup>
    );

    var passwordForm = (
      <Grid fluid={true}>
        <Form horizontal>
          <FormGroup validationState={validationState}>
            {this.props.userStoreState.authenticatedUser.role != 'admin' || this.props.userStoreState.authenticatedUser.id == userToChange.id ? currentPasswordFormGroup : '' }
            {newPasswordFormGroup}
            {newPasswordConfirmFormGroup}
            <FormGroup controlId='formHorizontalPasswordValidationMessage'>
              <Col smOffset={3} sm={8}>
                {validationState == null ? null : <HelpBlock>{validationMessage}</HelpBlock> }
              </Col>
            </FormGroup>
          </FormGroup>
          <Modal.Footer>
            <FormGroup controlId='formHorizontalButtons'>
              <Col smOffset={3} sm={3}>
                <Button bsStyle='primary' onClick={this.changePassword}>Change Password</Button>
              </Col>
              <Col sm={3}>
                {this.props.onCancel != null ? <Button onClick={this.props.onCancel}>Cancel</Button> : ''}
              </Col>
            </FormGroup>
          </Modal.Footer>
        </Form>
      </Grid>
    );

    return (
      <div id='password-change' className=''>
        {passwordForm}
      </div>
    );
  }

  // _onUserChange: function(message_obj) {
  //   // console.log('in _onUserChange of <ChangePasswordForm />');
  //   // console.log('message:', message_obj, ', message_obj == null', message_obj == null);
  //   // var userToChange = UserStore.getUserByUsername(this.props.username) || {};
  //   var currentUser = this.props.userStoreState.authenticatedUser();

  //   if (message_obj != null) {
  //     var newState = {};
  //     newState.message_obj = message_obj;
  //     if (message_obj.error == false) {
  //       newState.current_password = newState.new_password = newState.new_password_confirm = '';
  //     }
  //     this.setState(newState);
  //   }
  //   else if (currentUser.username != null && this.state.currentUser.username == null) {
  //     // console.log('in 'if' branch of _onUserChange in <ChangePasswordForm />');
  //     //this is likely just after page load. UserStore _users was initially empty but now loaded, and username in url is still invalid
  //     this.setState(this.getInitialState());
  //   }
  //   // else if (message_obj == null && this.state.userToChange.username != null && this.state.username != this.state.userToChange.username) {
  //   //   console.log('in 'else if' branch of _onUserChange in <ChangePasswordForm />');
  //   //   //this is likely just after updating the username. This page URL will no longer correctly load the user (because it is keyed by username).
  //   //   // browserHistory.push('/users/' + this.state.username);
  //   // }
  //   else {
  //     // console.log('in 'else' branch of _onUserChange in <ChangePasswordForm />');
  //     this.setState(this.getInitialState());
  //   }
  // }
});
