'use strict';


/**
ModalContainer.jsx
 */

/**
 * This component operates as a 'Controller-View'.  It listens for changes in
 * the ModalStore and passes the new data to its children.
 */

import React from 'react';
// import {browserHistory} from 'react-router';

import {Button, Modal, Tab, Tabs} from 'react-bootstrap';

import ModalStore from '../stores/ModalStore';
import ModalActionCreators from '../actions/ModalActionCreators';
import UserActionCreators from '../actions/UserActionCreators';
import PollActionCreators from '../actions/PollActionCreators';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

import UserStore from '../stores/UserStore';

// import ReactPropTypes from 'react/lib/ReactPropTypes';




export default React.createClass({

  getInitialState: function() {
    var new_answer_option = '';

    return {
      // currentUser: currentUser,
      new_answer_option: new_answer_option,
      userStoreState: UserStore.getState(),
      modalStoreState: ModalStore.getState()
    };
  },


  componentDidMount: function() {
    UserStore.addChangeListener(this._onUserChange);
    ModalStore.addChangeListener(this._onModalChange);
  },

  componentWillUnmount: function() {
    // PollStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onUserChange);
    // PollStore.removeChangeListener(this._onPollChange);
    // PollStore.removeDestroyListener(this._onPollDestroy);
    // PollStore.removeVoteCreatedListener(this._onVoteCreate);
    ModalStore.removeChangeListener(this._onModalChange);
  },

  handleLogin: function(username, password) {
    UserActionCreators.login(username, password);
  },

  handleRegistration: function(username, fullname, password, password_confirm) {
    UserActionCreators.register(username, fullname, password, password_confirm);
  },

  deletePollRequest: function() {
    console.log('in deletePollRequest of FullPoll');
    // var poll_id = this.props.params != null ? this.props.params.poll_id : null;
    var poll_id = this.props.poll_id;
    console.log('poll_id is ', poll_id);
    console.log('props: ', this.props);
    if (poll_id != null) {
      PollActionCreators.destroy(poll_id);
    }
  },

  closeModal: function() {
    //closes all any modal (it closes all of them)
    ModalActionCreators.close();
  },



  copyPollURLToClipboard: function() {
  // copyPollURLToClipboard: function(e) {
    copyToClipboard(document.getElementById('poll-URL'));
    this.closeModal();
  },

  handlePasswordChange: function(user_id, data) {
    UserActionCreators.update(user_id, data);
  },

  renderChangePasswordModal:function() {
    let showModal = this.state.modalStoreState.modalToShow == 'changepassword';
    let userToChange = this.state.userStoreState.authenticatedUser;
    console.log('for renderChangePasswordModal, showModal is', showModal, ' userToChange is:', userToChange);
    //passing the same
    return (
      <Modal show={showModal} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChangePasswordForm
            userToChange={userToChange}
            userStoreState={this.state.userStoreState}
            handlePasswordChange={this.handlePasswordChange}
            onCancel={this.closeModal}
          />
        </Modal.Body>
      </Modal>
    );

  },

  renderDeletePollModal:function() {
    let showModal = this.state.modalStoreState.modalToShow == 'deletepoll';
    let modalMessage = this.state.modalStoreState.deletePollModalMessage || 'Do you wish to delete the current poll?';
    return (
      <Modal show={showModal} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage}
        </Modal.Body>
        { (modalMessage != 'Do you wish to delete the current poll?') ?
          <Modal.Footer>
            <Button
              bsStyle='default'
              onClick={this.closeModal}
            >Close</Button>
          </Modal.Footer> :
          <Modal.Footer>
            <Button
              bsStyle='danger'
              onClick={this.deletePollRequest}
            >Delete</Button>
            <Button
              bsStyle='default'
              onClick={this.closeModal}
            >Cancel</Button>
          </Modal.Footer>
        }
      </Modal>
    );
  },


  renderSharePollModal:function() {
    let showModal = this.state.modalStoreState.modalToShow == 'sharepoll';
    let host = window.location;
    // var poll_url = host.protocol + '//' + host.hostname + ':' + host.port + individual_poll_url;
    let poll_url = host.href;
    let individual_poll_url = host.href;
    // console.log('host in fullpoll is:', host);
    let modalMessage = <div>URL for Poll: <a href={individual_poll_url} id='poll-URL'>{poll_url}</a></div>;

    return (
      <Modal show={showModal} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share Poll</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle='primary'
            title='Copy URL to clipboard (not supported on all browsers)'
            onClick={this.copyPollURLToClipboard}
          >Copy to clipboard</Button>
          <Button
            bsStyle='default'
            title='Close this window'
            onClick={this.closeModal}
          >Close</Button>
        </Modal.Footer>
      </Modal>
    );
  },

  renderRegisterLoginModal: function() {
    let showModal = this.state.modalStoreState.modalToShow == 'login' || this.state.modalStoreState.modalToShow == 'register';
    let activeTab = this.state.modalStoreState.modalToShow == 'register' ? 1 : 2;

    return (
      <Modal show={showModal} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration/Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey={activeTab} id='registration-login-tabs'>
            <Tab eventKey={1} title='Register'><RegistrationForm onCancel={this.closeModal} handleRegistration={this.handleRegistration} /></Tab>
            <Tab eventKey={2} title='Login'><LoginForm onCancel={this.closeModal} handleLogin={this.handleLogin} /></Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    );
  },

  renderDialogModal:function() {
    let showModal = this.state.modalStoreState.modalToShow == 'dialog';
    let modalMessage = this.state.modalStoreState.dialogModalMessage;

    return (
      <Modal show={showModal} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>FCC Voting App</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle='default'
            title='Close this window'
            onClick={this.closeModal}
          >Close</Button>
        </Modal.Footer>
      </Modal>
    );
  },



  render: function() {
    console.log('this.state.modalStoreState: ', this.state.modalStoreState);
    // return (
    //   <div className='modal-container'>
    //     {this.renderDialogModal()}
    //     {this.renderSharePollModal()}
    //     {this.renderDeletePollModal()}
    //     {this.renderChangePasswordModal()}
    //     {this.renderRegisterLoginModal()}
    //   </div>
    // );

    let modalToShow = this.state.modalStoreState.modalToShow;

    switch(modalToShow) {
    // options are 'none', 'dialog', 'sharepoll', 'deletepoll', 'changepassword', 'login', and 'register'

    // case 'none': return this.closeModal();
    case 'dialog':
      return this.renderDialogModal();
    case 'sharepoll':
      return this.renderSharePollModal();
    case 'deletepoll':
      return this.renderDeletePollModal();
    case 'changepassword':
      return this.renderChangePasswordModal();
    case 'login':
      //this is the Register/Login modal, set to the login tab
      return this.renderRegisterLoginModal(2);
    case 'register':
      //this is the Register/Login modal, set to the register tab
      return this.renderRegisterLoginModal(1);
    default:
      return (<div/>);
    }

  },

  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onUserChange: function() {
    this.setState({userStoreState: UserStore.getState()});
  },



  /**
   * Event handler for 'change' events coming from the ModalStore
   */
  _onModalChange: function() {
    console.log('received CHANGE signal <ModalContainer/>. Updating modal state.');
    this.setState({modalStoreState: ModalStore.getState()});
    //should also update modal states, unless I handle those with a separate event
  },


});


function copyToClipboard(elem) {
  // create hidden text element, if it doesn't already exist
  var targetId = '_hiddenCopyText_';
  var isInput = elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA';
  var origSelectionStart, origSelectionEnd;
  if (isInput) {
    // can just use the original source element for the selection and copy
    target = elem;
    origSelectionStart = elem.selectionStart;
    origSelectionEnd = elem.selectionEnd;
  } else {
    // must use a temporary form element for the selection and copy
    target = document.getElementById(targetId);
    if (!target) {
      var target = document.createElement('textarea');
      target.style.position = 'absolute';
      target.style.left = '-9999px';
      target.style.top = '0';
      target.id = targetId;
      document.body.appendChild(target);
    }
    target.textContent = elem.textContent;
  }
  // select the content
  var currentFocus = document.activeElement;
  target.focus();
  target.setSelectionRange(0, target.value.length);

  // copy the selection
  var succeed;
  try {
    succeed = document.execCommand('copy');
  } catch(e) {
    succeed = false;
  }
  // restore original focus
  if (currentFocus && typeof currentFocus.focus === 'function') {
    currentFocus.focus();
  }

  if (isInput) {
    // restore prior selection
    elem.setSelectionRange(origSelectionStart, origSelectionEnd);
  } else {
    // clear temporary content
    target.textContent = '';
  }
  return succeed;
}
