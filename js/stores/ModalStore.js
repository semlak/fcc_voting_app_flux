/*
 * ModalStore
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import ModalConstants from '../constants/ModalConstants';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';
// var CREATED_EVENT = 'create';
// var DESTROY_EVENT = 'destroy';

// var _modals = {};
var _modalToShow = 'none';
//other options: 'dialog', 'sharepoll', 'deletepoll'
//I plan to add changepassword and login.
const _modalToShowOptions = ['dialog', 'sharepoll', 'deletepoll', 'changepassword', 'login'];

var _modalMessage = '';



var ModalStore = assign({}, EventEmitter.prototype, {
	getModalToShow: function() {
		return _modalToShow;
	},

	getModalMessage: function() {
		return _modalMessage || '';
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
ModalStore.dispatchToken = AppDispatcher.register(function(action) {
	// console.log('received dispatch signal in ModalStore. action is:', action);

	switch(action.actionType) {

	case ModalConstants.MODAL_SHOW:
		console.log('triggered MODAL_SHOW case in ModalStore dispatch receiving. action is ', action);
		if (action.modalToShow != 'none' && action.modalToShow != 'sharepoll' && action.modalToShow != 'deletepoll' && action.modalToShow != 'dialog') {
			console.error('\'modalToShow\' variable dispatched to ModalStore is not a valid option');
		}

		var modalToShow = action.modalToShow;
		var modalMessage = action.modalMessage;
		if (_modalToShow != modalToShow || modalMessage != _modalMessage) {
			_modalToShow = modalToShow;
			_modalMessage = modalMessage;
			ModalStore.emitChange();
		}
		else {
			console.log('Received Modal dispatch, but no change detected. action is ', action);
		}
		break;

	// case ModalConstants.MODAL_SHOW_DIALOG:
	// 	var modalToShow = action.modalToShow;
	// 	var modalMessage = action.modalMessage;
	// 	if (_modalToShow != modalToShow || modalMessage != _modalMessage) {
	// 		_modalToShow = modalToShow;
	// 		_modalMessage = modalMessage;
	// 		ModalStore.emitChange();
	// 	}
	// 	else {
	// 		console.log("Received Modal dispatch, but no change detected. action is ", action)
	// 	}
	// 	break;


	case ModalConstants.MODAL_SHOW_NONE:
		// console.log("in ModalStore, received MODAL_SHOW_NONE dispatch signal");
		if (modalToShow != 'none') {
			_modalToShow = 'none';
			_modalMessage = null;
			ModalStore.emitChange();
		}
		break;

	default:
		// no op
	}
});

module.exports = ModalStore;
