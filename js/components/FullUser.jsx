'use strict';


/*
components/FullUser.jsx
*/

import React from 'react';
import NavLink from './NavLink';
// import ChangePasswordForm from './ChangePasswordForm';
// import {Button, Form, Col, FormGroup, ControlLabel} from 'react-bootstrap';
// import {Button, Grid, Row, Col, Form, FormGroup, FormControl,  ControlLabel, HelpBlock} from 'react-bootstrap';
import {Button, Col, Form, FormGroup, FormControl,  ControlLabel, HelpBlock} from 'react-bootstrap';

import {browserHistory} from 'react-router';
import UserStore from '../stores/UserStore';
import UserActionCreators from '../actions/UserActionCreators';
// import ReactPropTypes from 'react/lib/ReactPropTypes';


export default React.createClass({
  getInitialState: function() {
    // console.log('in 'getInitialState' of <FullUser />');
    var userStoreState = UserStore.getState();
    var username = this.props.params.username;
    var user = UserStore.getUserByUsername(username) || {};
    return {
      user: user,
      showUserAsEditable: (userStoreState.authenticatedUser.role == 'admin'),
      //the following are only used if updating the user.
      username: user.username || '',
      fullname: user.fullname || '',
      role: user.role || '',
      message_obj: null,
      new_password: '',
      userStoreState: userStoreState
    };
    //'user' is the user being displayed in this item. currentUser is the authenticated user (if authenticated, {} otherwise).
  },

  backToUserList: function() {
    browserHistory.push('/users');

  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onUserChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onUserChange);
  },

  updateUser: function(e) {
    console.log('in updateUser of <FullUser/>, target.name: ', e.target.name);
    var key = e.target.name.toString();
    var data = {};
    data[key] = this.state[key];
    // console.log('data is ', data);
    UserActionCreators.update(this.state.user.id, data);
    // this.setState(data);

  },

  handleFieldChange: function(e) {
    // console.log(e.target.name, e.target.value);
    var key = e.target.name.toString();
    var newParam = {};
    newParam[key] = e.target.value;
    newParam.message_obj = null;
    this.setState(newParam);
  },

  componentWillReceiveProps: function(nextProps) {
    // I needed to add this to detect when the client is viewing one user's profile and navigates directly to another user's profile
    // (for example: they are viewing somebody else's profile, and they click on the 'My Profile' option in the NavBar).
    // The reason is that this view manages its own state, and so the props are not used in the render function, only in the getInitialState() and _onUserChange().
    // Without handling situation here, the view will not update. This is an issue I would like to eliminate by having a parent container handle.

    // console.log('in 'componentWillReceiveProps' of <FullUser />. nextProps:', nextProps);
    if (nextProps.params != null && this.state.user != null && nextProps.params.username != this.state.user.username) {
      var userStoreState = UserStore.getState();
      var username = nextProps.params.username;
      var user = UserStore.getUserByUsername(username) || {};
      var currentUser = userStoreState.authenticatedUser;
      this.setState ({
        user: user,
        showUserAsEditable: (currentUser.role == 'admin'),
        //the following are only used if updating the user.
        username: user.username || '',
        fullname: user.fullname || '',
        role: user.role || '',
        new_password: '',
        message_obj: null
      });
      // this.setState(this.getInitialState());
    }
  },

  openEditUserForm: function() {
    if (this.state.user.username == this.state.userStoreState.authenticatedUser.username || this.state.userStoreState.authenticatedUser.role == 'admin') {
      this.setState({showUserAsEditable: true});
    }
  },

  render: function() {
    // console.log('in 'render' of <FullUser />');
    var user = this.state.user;

    if (user == null || user.username == null) {
      return (
        <div>Currently loading data</div>
      );
    }

    var uneditableUser = function() {
      return (
        <div id='userapp'  className=''>
          <h2>User details</h2>
          <div className='poll well'>
            <Form horizontal>
              <FormGroup>
                <FormGroup controlId='formHorizontalUsername'>
                  <Col componentClass={ControlLabel} sm={2}>
                    Username:
                  </Col>
                  <Col sm={8}>
                    {this.state.username}
                  </Col>
                </FormGroup>

                <FormGroup controlId='formHorizontalFullname'>
                  <Col componentClass={ControlLabel} sm={2}>
                    Fullname:
                  </Col>
                  <Col sm={8}>
                    {this.state.fullname}
                  </Col>
                </FormGroup>
                <FormGroup controlId='formHorizontalRole'>
                  <Col componentClass={ControlLabel} sm={2}>
                    Role:
                  </Col>
                  <Col sm={8}>
                    {this.state.role || 'Not current set'}
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={6}>
                    { this.state.userStoreState.authenticatedUser.username == user.username ? <Button type='button' bsStyle='primary' onClick={this.openEditUserForm}>Edit User Details</Button> : null}
                  </Col>
                </FormGroup>
              </FormGroup>
            </Form>
            <p><NavLink to={'/Users/' + user.username + '/polls'}>Polls of {user.fullname || user.username}</NavLink></p>
          </div>
        </div>
      );
    }.bind(this);

    var editableUser = function() {
      var message_obj = this.state.message_obj;
      var validationState = message_obj == null ? null : (message_obj.error ? 'error' : 'success');
      var validationMessage = message_obj == null ? '' : message_obj.message_text;
      return (
        <div id='userapp'  className=''>
          <h2>User details</h2>
          <div className='poll well'>
            <Form horizontal>
              <FormGroup validationState={validationState}>
                <FormGroup controlId='formHorizontalUsername'>
                  <Col componentClass={ControlLabel} sm={2}>
                    Username:
                  </Col>
                  <Col sm={8}>
                    <FormControl type='text' name='username' value={this.state.username} onChange={this.handleFieldChange}/>
                  </Col>
                  <Col sm={2}>
                    <Button name='username' onClick={this.updateUser}>Update</Button>
                  </Col>
                </FormGroup>

                <FormGroup controlId='formHorizontalFullname'>
                  <Col componentClass={ControlLabel} sm={2}>
                    Fullname:
                  </Col>
                  <Col sm={8}>
                    <FormControl type='text' name='fullname' value={this.state.fullname} onChange={this.handleFieldChange}/>
                  </Col>
                  <Col sm={2}>
                    <Button name='fullname' onClick={this.updateUser}>Update</Button>
                  </Col>
                </FormGroup>
                <FormGroup controlId='formHorizontalRole'>
                  <Col componentClass={ControlLabel} sm={2}>
                    Role:
                  </Col>
                  <Col sm={8}>
                    <FormControl componentClass='select' name='role' value={this.state.role || ''} onChange={this.handleFieldChange}>
                      <option value=''></option>
                      <option value='user'>user</option>
                      <option value='admin'>admin</option>
                    </FormControl>
                  </Col>
                  <Col sm={2}>
                    <Button name='role' onClick={this.updateUser}>Update</Button>
                  </Col>
                </FormGroup>
                { user && user.username !== this.state.userStoreState.authenticatedUser.username && this.state.userStoreState.authenticatedUser.role === 'admin' ?
                  <FormGroup controlId='formHorizontalPassword'>
                    <Col componentClass={ControlLabel} sm={2}>
                      Password:
                    </Col>
                    <Col sm={8}>
                      <FormControl type='password' name='new_password' value={this.state.new_password} onChange={this.handleFieldChange}/>
                    </Col>
                    <Col sm={2}>
                      <Button name='new_password' onClick={this.updateUser}>Update</Button>
                    </Col>
                  </FormGroup> : ''
                }
                <Col smOffset={2} sm={10}>
                  {validationState == null ? null : <HelpBlock>{validationMessage}</HelpBlock> }
                </Col>
              </FormGroup>
            </Form>
            <p><NavLink to={'/Users/' + user.username + '/polls'}>Polls of {user.fullname || user.username}</NavLink></p>
            <br/>
            <Button type='button' bsStyle='default' onClick={this.backToUserList}>Back to User List</Button>
          </div>
        </div>
      );
    }.bind(this);


    if (this.state.userStoreState.authenticatedUser.role == 'admin' || this.state.showUserAsEditable == true) {
      return editableUser();
    }
    else {
      return uneditableUser();
    }


  },


  _onUserChange: function(message_obj) {
    // console.log('in _onUserChange of <FullUser />')
    var user = UserStore.getUserByUsername(this.props.params.username) || {};
    if (this.state.user.username != null && message_obj != null ) {
      //this is likely just after the user attempted to update user info on the screen.
      this.setState({
        message_obj: message_obj,
        userStoreState: UserStore.getState()
      });
    }
    else if (user.username != null && this.state.user.username == null) {
      // console.log('in 'if' branch of _onUserChange in <FullUser />');
      //this is likely just after page load. UserStore _users was initially empty but now loaded, and user profile can be pulled if username in url is valid
      this.setState(this.getInitialState());
    }
    else if (message_obj == null && this.state.user.username != null && this.state.username != this.state.user.username) {
      // console.log('in 'else if' branch of _onUserChange in <FullUser />');
      //this is likely just after updating the username. This page URL will no longer correctly load the user (because it is keyed by username).
      browserHistory.push('/users/' + this.state.username);
    }
    else {
      // console.log('in 'else' branch of _onUserChange in <FullUser />');
      this.setState(this.getInitialState());
    }

  }
});
