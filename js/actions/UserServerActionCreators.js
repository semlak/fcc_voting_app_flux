'use strict';


import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';

module.exports = {

	receiveAll: function(rawUsers) {
		// console.log('in UserServerActionCreators, received the receiveAll signal. dispatching the USER_RECEIVE_RAW_USERS signal, rawUsers are ', rawUsers)
		AppDispatcher.dispatch({
			actionType: UserConstants.USER_RECEIVE_RAW_USERS,
			rawUsers: rawUsers
		});
	},

	receiveCreatedUser: function(createdUser, message) {
		//errorMessage will be null if user was successfully created.
		// console.log("in UserServerActionCreators, receiveCreatedUser; createdUser is ", createdUser);
		AppDispatcher.dispatch({
			actionType: UserConstants.USER_CREATE,
			rawUser: createdUser,
			errorMessage: createdUser ==  null ? message : null,
			successMessage: createdUser !=  null ? message : null
		});
		// if (createdUser != null) {
		// 	// console.log("in if branch of receiveCreatedUser");
		// 	// console.log("createdUser is ",  createdUser)
		// 	AppDispatcher.dispatch({
		// 		actionType: UserConstants.USER_CREATE,
		// 		rawUser: createdUser,
		// 		errorMessage: null,
		// 		successMessage: message
		// 	});
		// }
		// else {
		// 	// console.log("in else branch of receiveCreatedUser");
		// 	AppDispatcher.dispatch({
		// 		actionType: UserConstants.USER_CREATE,
		// 		rawUser: null,
		// 		errorMessage: message,
		// 		successMessage: null
		// 	});
		// }
	},

	receiveUpdatedUser: function(updatedUser, message_obj) {
		//errorMessage will be null if user was successfully created.
		// console.log("in UserServerActionCreators, receiveUpdatedUser; updatedUser is ", updatedUser);
		AppDispatcher.dispatch({
			actionType: UserConstants.USER_UPDATE,
			rawUser: updatedUser,
			message_obj: message_obj
		});
	},

	setAuthenticatedUserState: function(rawUser, message_obj) {
		AppDispatcher.dispatch({
			actionType: UserConstants.USER_SET_AUTHENTICATED_USER_STATE,
			rawUser: rawUser,
			message_obj: message_obj
		});
	}

};
