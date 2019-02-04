'use strict';

/*
 * UIStore
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import UIConstants from '../constants/UIConstants';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';
// var CREATED_EVENT = 'create';
// var DESTROY_EVENT = 'destroy';

// var _modals = {};
var _modalToShow = 'none';
//other options: 'dialog', 'sharepoll', 'deletepoll'
//I plan to add changepassword and login.
const _modalToShowOptions = ['dialog', 'sharepoll', 'deletepoll', 'changepassword', 'login', 'register', 'none'];


var _navbarIsExpanded = false;

var _registrationFormState =  {
  username: '',
  password: '',
  password_confirm: '',
  fullname: '',
  errorStatus: false,
  message: ''
};

var _modalMessage = '';
var _dialogModalMessage = '';
var _sharepollModalMessage = '';
var _deletepollModalMessage = '';
var _changepasswordModalMessage = '';
var _loginModalMessage = '';
var _registerModalMessage = '';


// var _loginErrorStatus = false;
// var _loginMessage = '';

// var _registerErrorStatus = false;
// var _registerMessage = '';

// var _changePasswordErrorStatus = false;
// var _changePasswordMessage = '';

// var _userUpdateErrorStatus = false;
// var _userUpdateMessage = '';


var UIStore = assign({}, EventEmitter.prototype, {
  getModalToShow: function() {
    return _modalToShow;
  },

  getModalToShowOptions: function() {
    return _modalToShowOptions;
  },

  getModalMessage: function() {
    return _modalMessage || '';
  },

  getState: function() {
    return {
      modalToShow: _modalToShow,
      modalMessage: _modalMessage,
      dialogModalMessage: _dialogModalMessage,
      sharepollModalMessage: _sharepollModalMessage,
      deletepollModalMessage: _deletepollModalMessage,
      changepasswordModalMessage: _changepasswordModalMessage,
      loginModalMessage: _loginModalMessage,
      registerModalMessage: _registerModalMessage,
      navbarIsExpanded: _navbarIsExpanded,
      registrationFormState: _registrationFormState
    };
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },


  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },


  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },


});

// Register callback to handle all updates
UIStore.dispatchToken = AppDispatcher.register(function(action) {
  // console.log('received dispatch signal in UIStore. action is:', action);

  switch(action.actionType) {

  case UIConstants.MODAL_SHOW:
    console.log('triggered MODAL_SHOW case in UIStore dispatch receiving. action is ', action);
    // check that action.modalToShow is in the list of valid options (_modalToShowOptions array)
    if (_modalToShowOptions.indexOf(action.modalToShow) < 0) {
      // console.error('\'modalToShow\' variable dispatched to UIStore is not a valid option');
    }

    var modalToShow = action.modalToShow;
    var modalMessage = action.modalMessage;
    _modalToShow = modalToShow;
    switch(modalToShow) {
    case 'dialog': _dialogModalMessage = modalMessage; break;
    case 'sharepoll': _sharepollModalMessage = modalMessage; break;
    case 'deletepoll': _deletepollModalMessage = modalMessage; break;
    case 'changepassword': _changepasswordModalMessage = modalMessage; break;
    case 'login': _loginModalMessage = modalMessage; break;
    case 'register': _registerModalMessage = modalMessage; break;
    }

    _modalMessage = modalMessage;

    UIStore.emitChange();
    // if (_modalToShow != modalToShow || modalMessage != _modalMessage) {
    //   _modalToShow = modalToShow;
    //   _modalMessage = modalMessage;
    //   UIStore.emitChange();
    // }
    // else {
    //   // console.log('Received Modal dispatch, but no change detected. action is ', action);
    // }
    break;

  // case UIConstants.MODAL_SHOW_DIALOG:
  //   var modalToShow = action.modalToShow;
  //   var modalMessage = action.modalMessage;
  //   if (_modalToShow != modalToShow || modalMessage != _modalMessage) {
  //     _modalToShow = modalToShow;
  //     _modalMessage = modalMessage;
  //     UIStore.emitChange();
  //   }
  //   else {
  //     console.log("Received Modal dispatch, but no change detected. action is ", action)
  //   }
  //   break;


  case UIConstants.UI_TOGGLE_NAVBAR:
    console.log('in UIStore, received UI_TOGGLE_NAVBAR dispatch signal');
    _navbarIsExpanded = !_navbarIsExpanded;
    UIStore.emitChange();
    break;

  default:
    // no op
  }
});

module.exports = UIStore;
