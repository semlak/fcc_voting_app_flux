/*
ModalActionCreators.js
*/


import AppDispatcher from '../dispatcher/AppDispatcher';
import ModalConstants from '../constants/ModalConstants';

module.exports = {

	open: function(modalToShow, modalMessage) {
		console.log('in ModalActionCreators, received the show signal. dispatching the MODAL_SHOW');
		console.log('modalToShow: ', modalToShow, ', modalMessage:', modalMessage);
		AppDispatcher.dispatch({
			actionType: ModalConstants.MODAL_SHOW,
			modalToShow: modalToShow,
			modalMessage: modalMessage
		});
	},

	close: function() {
		console.log('in ModalActionCreators, received the close signal. dispatching the MODAL_SHOW_NONE');
		AppDispatcher.dispatch({
			actionType: ModalConstants.MODAL_SHOW_NONE
		});
	},
};
