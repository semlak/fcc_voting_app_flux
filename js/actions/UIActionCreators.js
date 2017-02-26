'use strict';

/*
UIActionCreators.js
*/


import AppDispatcher from '../dispatcher/AppDispatcher';
import UIConstants from '../constants/UIConstants';

module.exports = {

	// open: function(modalToShow, modalMessage) {
	// 	console.log('in UIActionCreators, received the show signal. dispatching the MODAL_SHOW');
	// 	console.log('modalToShow: ', modalToShow, ', modalMessage:', modalMessage);
	// 	AppDispatcher.dispatch({
	// 		actionType: UIConstants.MODAL_SHOW,
	// 		modalToShow: modalToShow,
	// 		modalMessage: modalMessage
	// 	});
	// },

	// close: function() {
	// 	console.log('in UIActionCreators, received the close signal. dispatching the MODAL_SHOW_NONE');
	// 	AppDispatcher.dispatch({
	// 		actionType: UIConstants.MODAL_SHOW_NONE
	// 	});
	// },

	toggleNavbar: function() {
		AppDispatcher.dispatch({
			actionType: UIConstants.UI_TOGGLE_NAVBAR
		});
	}
};
