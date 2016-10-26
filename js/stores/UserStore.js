'use strict';

/*
 *
 * ./js/stores/UserStore
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import UserConstants from '../constants/UserConstants';
import assign from 'object-assign';
import UserUtils from '../utils/UserUtils';

var CHANGE_EVENT = 'change';
var CREATE_EVENT = 'create';
var AUTHENTICATION_CHANGE_EVENT = 'authentication_change';
// var _users = {};
var _users = {};
var _usersByUsername = {};
var _authenticatedUserId = null;
var _UserStoreIsInitialized = false;
var _usersURL = '/api/users';



function addUsers(rawUsers) {
	// console.log('in UserStore., addUsers.  adding raw users to _users, rawUsers are', rawUsers);
	rawUsers.forEach(function(user) {
		if (!_users[user.id]) {
			// console.log('adding users');
			return addUser(user);
		}
	});
	// console.log('in userStore. _users are now ', _users);
}

function addUser(rawUser) {
	// assumes user has already been verified as not in _users;
	var user = UserUtils.convertRawUser(rawUser);
	_users[user.id] = user;
	_usersByUsername[user.username] = _users[user.id];
	// _users = assign({}, _users, {user.id: newUser} );
	// _usersByUsername = Object.assign(_usersByUsername, {user.username : user[user.id]};
	return true;
}



function updateUsername(rawUser) {
	var user = UserUtils.convertRawUser(rawUser);
	var newUsername = user.username;
	var oldUsername = _users[user.id].username;
	if (newUsername == null || newUsername.length < 1) {
		return false;
	}
	else {
		_usersByUsername[oldUsername] = null;
		_usersByUsername[newUsername] = _users[user.id];
		_users[user.id] = user;
		return true;
	}
}

function updateFullname(rawUser) {
	var user = UserUtils.convertRawUser(rawUser);
	_users[user.id].fullname = user.fullname;
	return true;
}

function updateRole(rawUser) {
	var user = UserUtils.convertRawUser(rawUser);
	_users[user.id].role = user.role;
	return true;
}


function updateSingleUser(rawUser) {
	var user = UserUtils.convertRawUser(rawUser);
	// var localUser = Object.assign({}, _users[user.id]);
	var localUser = Object.assign({}, _users[user.id]);
	// console.log(local)
	var updatesNeeded = false;
	if (localUser.username != user.username) {
		updatesNeeded = updateUsername(user);
	}
	if (localUser.fullname != user.fullname) {
		updatesNeeded = updateFullname(user);
	}
	if (localUser.role != user.role) {
		updatesNeeded = updateRole(user);
	}
	return updatesNeeded;
}

function updateUserSet(rawUsers) {
	/*
		Makes sure the current user set is in sync with rawUsers (which was provided by server)
		This means that any users that have been deleted (meaning, they are in the current user set but not in rawUsers) will be removed
		New users will be added. Any changes in the user\'s username, fullname, or role will be updated.

		Overall, the function returns true if updates were needed, false if no change.
	*/

	//If there are currently no users in the user set (_users), then add all users and return true
	if (Object.keys(_users).length  == 0 ) {
		addUsers(rawUsers);
		return true;
	}

	//Otherwise, we want to delete user from _users who is no longer on the updated list, add user to _users who was not on list, and update existing user info
	//This variable will keep track if updates were needed (for the return value of the function)
	var updatesNeeded = false;


	// to check if user from _user is no longer on list, it is most efficient to create a hash of the new user list and compare
	var new_user_set = {};
	rawUsers.forEach(user => new_user_set[user.id] = user);
	// console.log('new_user_set is', new_user_set);
	for (var id in _users) {
		if (!new_user_set[id]) {
			updatesNeeded = destroy(id);
		}
	}

	// check if user already exists. If not, addUser, if so, veryify data is up to date (updateSingleUser)
	rawUsers.forEach(function(rawUser) {
		if (!_users[rawUser.id]) {
			updatesNeeded = addUser(rawUser);
		}
		else {
			updatesNeeded = updateSingleUser(rawUser);
		}
	});
	return updatesNeeded;
}



function addToUserSet(rawUser) {
	/*
	This function is only expected to be called upon the creation (registration) of a new user. However, we will still check that
	the rawUser is not in existing set, and then add the rawUser. The function returns true if the user was added to the user set.
	*/

	if (_users[rawUser.id] == null) {
		// console.log('in addToUserSet of UserStore. adding to _users set');
		addUser(rawUser);
		return true;
	}
	else {
		// console.log('in addToUserSet of UserStore. Not adding to _users set');
		return false;
	}
}


	/**
	 * Create user
	 * @param  {object} user, containing a username, fullname, role.
		 		This is occurring after the new user info has been sent to the server via ajax request.
		 		No password information is involved in the create request at this time.
	 */
// function create(user) {
// 	if (user.username != null && user.username != '' &&  _usersByUsername[user.username] == null) {
// 		var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
// 		_users[id] = {
// 			id: id,
// 			username: user.username,
// 			fullname: user.fullname,
// 			role: user.role
// 		};
// 		_usersByUsername[user.username] = _users[id];
// 	}
// 	else {
// 		console.error('error creating user. Either username or password was blank, or username already taken.');
// 	}
// }

/**
 * Update a USER item.
	 * @param  {string} id The ID of the User item
	 * @param  {object} userUpdates object containing possible updates (username, password, and/or fullname, role)
 */
// function update(id, userUpdates) {
// 	// _users[id] = assign({}, _users[id], userUpdates);
// 	// console.log('user is ', _users[id], ', userUpdates is ', userUpdates);

// 	// this logic should be handled by backend.
// 	for (var key in userUpdates) {
// 		if (key == 'username') {
// 			// delete _usersByUsername[_users[id]['username'];
// 			_usersByUsername[_users[id].username] = null;
// 			_users[id][key] = userUpdates[key];
// 			_usersByUsername[_users[id]['username']] = _users[id];
// 		}
// 		else {
// 			_users[id][key] = userUpdates[key];
// 		}
// 	}
// }

/**
 * Update all of the USER items with the same object.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
// function updateAll(updates) {
//   for (var id in _users) {
//     update(id, updates);
//   }
// }

/**
 * Delete a USER item.
 * @param  {string} id

 	User has been deleted on the server, and that ajax call's callback sends dispatch to store to destroy local user
 */
function destroy(id) {
	if (_users[id]) {
		delete _usersByUsername[_users[id].username];
	}
	delete _users[id];
	return true;
}


/**
 * Delete all the USER items.
 */
function destroyAll() {
	for (var id in _users) {
		if (_users[id] != null) {
			destroy(id);
		}
	}
}

var UserStore = assign({}, EventEmitter.prototype, {

	/**
	 * Tests whether all the remaining USERs items are marked as completed.
	 * @return {boolean}
	 */
	// areAllComplete: function() {
	//   for (var id in _users) {
	//     if (!_users[id].complete) {
	//       return false;
	//     }
	//   }
	//   return true;
	// },

	/**
	 * Get the entire collection of USERs.
	 * @return {object}
	 */

	getAll: function() {
		// var users = this.getAllUsersFromServer;
		// _users = users;

		return _users;
	},

	getUserByUsername: function(username) {
		var user = _usersByUsername[username];
		// if username does not correspond to a user, this returns null.
		return user;
	},

	getAuthenticatedUser: function() {
		// console.log('in '_authenticatedUserId' of UserStore. _authenticatedUserId is', _authenticatedUserId);
		return _users[_authenticatedUserId] || {};
	},

	getUserStoreIsInitializedState: function() {
		return _UserStoreIsInitialized;
	},

/**
 * Broadcast that _users has changed or was attempted to be changed.
	 * @param  {object} message_obj containing an 'error' (boolean) and message_text (string)
 */
	emitChange: function(message_obj) {
		// console.log('in UserStore. Emitting CHANGE_EVENT');
		this.emit(CHANGE_EVENT, message_obj);
	},

/**
 * Broadcast that new user was created or attempted to be created.
	 * @param  {object} message_obj containing an 'error' (boolean) and message_text (string)
 */
	emitUserCreate: function(message_obj) {
		this.emit(CREATE_EVENT, message_obj);
	},

/**
 * Broadcast that authenticated user state was changed or attempted to be changed (login, failed login, logout, failed logout).
	 * might try to incorporate this with emitUserCreate
	 * @param  {object} message_obj containing an 'error' (boolean) and message_text (string)
 */
	emitAuthenticationChange: function(message_obj) {
		this.emit(AUTHENTICATION_CHANGE_EVENT, message_obj);
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

/**
	 * @param {function} callback
	 */
	addCreateListener: function(callback) {
		this.on(CREATE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeCreateListener: function(callback) {
		this.removeListener(CREATE_EVENT, callback);
	},


	/**
	 * @param {function} callback
	 */
	addAuthenticationChangeListener: function(callback) {
		this.on(AUTHENTICATION_CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeAuthenticationChangeListener: function(callback) {
		this.removeListener(AUTHENTICATION_CHANGE_EVENT, callback);
	},


	getUsersURL: function() {
		return _usersURL;
	}
});

// Register callback to handle all updates
UserStore.dispatchToken = AppDispatcher.register(function(action) {
	// console.log('AppDispatcher firing. action is ' , action);
	var updatesMade = false;
	switch(action.actionType) {
	case UserConstants.USER_RECEIVE_RAW_USERS:
		// This is the action that actually received the list of users, resulting in this call from the dispatcher
		// console.log('\n\nIn UserStore, dispatch receiving. received 'USER_RECEIVE_RAW_USERS' action signal, rawUsers are', action.rawUsers);
		updatesMade = updateUserSet(action.rawUsers);
		// AppDispatcher.waitFor([ThreadStore.dispatchToken]);
		// _markAllInThreadRead(ThreadStore.getCurrentID());

		// ideally, would only fire this if there is a change to the users
		// also, the adduser function only adds user if they are not already in _users. It does not update their data if it has changed.
		// add, it does not remove users from _users that are no longer registered.
		if (updatesMade) {
			UserStore.emitChange(null);
		}
		_UserStoreIsInitialized = true;
		break;


	case UserConstants.USER_CREATE:
		// console.log('\n\nIn UserStore, dispatch receiving. received 'USER_CREATE' action signal, rawUser is', action.rawUser);
		if (action.rawUser != null && action.rawUser.username != '' && action.rawUser.username != null) {
			updatesMade = addToUserSet(action.rawUser);
			// console.log('updatesMade in USER_RECEIVE_RAW_CREATED_USER is :', updatesMade)
			if (updatesMade) {
				//also want to set the created user as the authenticated user.
				_authenticatedUserId = action.rawUser.id;
				UserStore.emitChange(null);
				UserStore.emitUserCreate({error: false, message_text: 'New User created.'});
				UserStore.emitAuthenticationChange({error: false, message_text: 'New user logged in.'});
				// console.log('user set (_users in UserStore) is now', _users);
			}
		}
		else {
			var message = action.message || 'Unable to create new user.';
			UserStore.emitUserCreate({error: true, message_text: message});
		}
		break;


	// case UserConstants.USER_CREATE:
	// 	var rawUser = action.rawUser;
	// 	if (rawUser != null) {
	// 		for (var key in rawUser) {
	// 			rawUser[key] = rawUser[key].trim();
	// 		}
	// 		if (rawUser.username != '' & rawUsername != null) {
	// 			//this allows rawUser.fullname and or rawUser.role to be empty. Neither the web site UI nor the server should have allowed, either
	// 			create(rawUser);
	// 			UserStore.emitChange(null);
	// 		}
	// 		else {
	// 			console.error('error creating user');
	// 		}
	// 	}
	// 	break;


	case UserConstants.USER_UPDATE:
		// console.log('\n\nIn UserStore, dispatch receiving. received 'USER_UPDATE' action signal, action is', action);
		if (action.rawUser != null) {
			updatesMade = false;
			let rawUser = action.rawUser;
			// console.log('rawUser in rawUser set is ', _users[rawUser.id]);

			updatesMade = updateSingleUser(rawUser);

			// if (true || updatesMade) {
			let message_text =  action.message_obj != null ?  action.message_obj.message_text : null;
			UserStore.emitChange({error: false, message_text: message_text});
				// console.log('user in user set is now', _users[id]);
			// }
		}
		else {
			//This branch should not be encountered unless user attempted an update without being logged in.
			//The app shouldn\'t allow this to happen, but it could happen due to server reload or some other error.
			console.error('User store in USER_UPDATE. Can\'t update, emitming Change event with error message');
			let message = action.message_obj.message_text || 'Unable to update user data.';
			UserStore.emitChange({error: true, message_text: message});
		}

		// //This is just for debugging.
		// if (action.rawUser != null) {
		//   console.log('user in user set is now', _users[action.rawUser.id]);
		// }
		break;


	case UserConstants.USER_DESTROY:
		destroy(action.id);
		UserStore.emitChange(null);
		break;


	case UserConstants.USER_DESTROY_ALL:
		destroyAll();
		UserStore.emitChange(null);
		break;


	case UserConstants.USER_SET_AUTHENTICATED_USER_STATE:
		// Triggered after user successfully logged in or out, and after receiving a list of users.

		// console.log('\n\nIn UserStore, dispatch receiving. received 'USER_SET_AUTHENTICATED_USER_STATE' action signal, rawUser is', action.rawUser);
		var currentUser = action.rawUser;
		var previousAuthenticatedUser = UserStore.getAuthenticatedUser();
		var message_obj = action.message_obj;
		// console.log('currentUser: ', currentUser, 'previousAuth: ', previousAuthenticatedUser, 'message_obj:', message_obj );
		if (currentUser == null || currentUser == undefined)    { currentUser = {}; }

		if (currentUser.id == null && message_obj.error) {
			//Login was attempted but failed.
			_authenticatedUserId = null;
			UserStore.emitAuthenticationChange({error: true, message_text: message_obj.message_text || 'Failed to log in.'});
		}
		else if (message_obj.error == false) {
			if (currentUser.id != null && previousAuthenticatedUser.id != currentUser.id) {
				//This should be a successful login.
				_authenticatedUserId = currentUser.id;
				UserStore.emitAuthenticationChange({error: false, message_text: message_obj.message_text || 'Login successful.'});
			}
			else if (currentUser.id == null && previousAuthenticatedUser.id != currentUser.id) {
				//This should be a successful logout.;
				_authenticatedUserId = null;
				UserStore.emitAuthenticationChange({error: false, message_text: message_obj.message_text || 'Logged out.'});
			}
			// else if (currentUser.id != null && previousAuthenticatedUser.id == currentUser.id) {
			//   //The authenticationState is not changing. This is likely due to a refresh of the UserStore or other application data.;
			//   //The user could be authenticated or un-authenticated.;
			// }
			else {
				//The authenticationState is not actually changing. This is likely due to a refresh of the UserStore or other application data.;
				//This could also be just after a page load or refresh when UserStore was initially populated.;
				//The user could be authenticated or un-authenticated.;
				UserStore.emitAuthenticationChange({error: false, message_text: null});
			}
		}
		else {
			//Not sure if this would be encountered.;
			let message = 'Problem encountered when setting the user authentication state.';
			console.log(message);
			_authenticatedUserId = null;
			UserStore.emitAuthenticationChange({error: true, message_text: message});
		}

		break;

	default:
		// no op;
	}
});

module.exports = UserStore;
