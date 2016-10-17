/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * UserStore
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import UserConstants from '../constants/UserConstants';
import assign from 'object-assign';
import UserUtils from '../utils/UserUtils';

var CHANGE_EVENT = 'change';
var CREATE_EVENT = 'create';
var AUTHENTICATION_CHANGE_EVENT = 'authentication_change'
// var _users = {};
var _users = {}
var _usersByUsername = {};
var _authenticatedUserId = null;
var _UserStoreIsInitialized = false;
var _usersURL = '/users';



function addUsers(rawUsers) {
	// console.log('in UserStore., addUsers.  adding raw users to _users, rawUsers are', rawUsers)
	rawUsers.forEach(function(user) {
		if (!_users[user.id]) {
			_users[user.id] = UserUtils.convertRawUser(user);
			_usersByUsername[user.username] = _users[user.id]
		}
	});
	// console.log('in userStore. _users are now ', _users)
}

function addUser(rawUser) {
	// assumes user has already been verified as not in _users
	var user = UserUtils.convertRawUser(rawUser)
	_users[user.id] = user
	_usersByUsername[user.username] = _users[user.id]
	return true;
}


function deleteLocalUser(id) {
	if (_users[id]) {
		_usersByUsername[_users[id].username] = null
	}
	delete _users[id]
	return true
}

function updateUsername(rawUser) {
	var user = UserUtils.convertRawUser(rawUser);
	var newUsername = user.username
	var oldUsername = _users[user.id].username
	_usersByUsername[oldUsername] = null
	_usersByUsername[newUsername] = _users[user.id]
	_users[user.id] = newUsername
	return true
}

function updateFullname(rawUser) {
	var user = UserUtils.convertRawUser(rawUser);
	_users[user.id].fullname = user.fullname
	return true
}

function updateRole(rawUser) {
	var user = UserUtils.convertRawUser(rawUser);
	_users[user.id].role = user.role
	return true
}


function updateUserSet(rawUsers) {
	/*
		Makes sure the current user set is in sync with rawUsers (which was provided by server)
		This means that any users that have been deleted (meaning, they are in the current user set but not in rawUsers) will be removed
		New users will be added. Any changes in the user's username, fullname, or role will be updated.

		Overall, the function returns true if updates were needed, false if no change.
	*/

	//This first line just makes sure the 'id' is set from '_id' for each user. I would like to move this to the UserUtils functions
	rawUsers.forEach(function(user) {user.id = user._id})

	//If there are currently no users in the user set (_users), then add all users and return true
	if (Object.keys(_users).length  == 0 ) {
		addUsers(rawUsers)
		return true
	}

	//Otherwise, we want to delete user from _users who is no longer on the list, add user to _users who was not on list, and update existing user info
	//This variable will keep track if updates were needed (for the return value of the function)
	var updatesNeeded = false


	// to check if user from _user is no longer on list, it is most efficient to create a hash of the new user list and compare
	var new_user_set = {}
	rawUsers.forEach(user => new_user_set[user.id] = user)
	// console.log('new_user_set is', new_user_set)
	for (var id in _users) {
		if (!new_user_set[id]) {
			updatesNeeded = deleteLocalUser(id)
		}
	}

	// check if user already exists. If not, add, if so, veryify data is up to date
	rawUsers.forEach(function(rawUser) {
		if (!_users[rawUser.id]) {
			updatesNeeded = addUser(rawUser)
		}
		else {
			var localUser = _users[user.id]
			if (localUser.username != user.username) {
				updatesNeeded = updateUserName(rawUser)
			}
			if (localUser.fullname != user.fullname) {
				updatesNeeded = updateFullName(rawUser)
			}
			if (localUser.role!= user.role) {
				updatesNeeded = updateRole(rawUser)
			}
		}
	})
	return updatesNeeded
}



function addToUserSet(rawUser) {
	/*
	This function is only expected to be called upon the creation (registration) of a new user. However, we will still check that
	the rawUser is not in existing set, and then add the rawUser. The function returns true if the user was added to the user set.
	*/

	if (_users[rawUser.id] == null) {
		// console.log("in addToUserSet of UserStore. adding to _users set")
		addUser(rawUser)
		return true;
	}
	else {
		// console.log("in addToUserSet of UserStore. Not adding to _users set")
		return false;
	}
}


	/**
	 * Create user
	 * @param  {object} user, containing a username, password,  fullname, role.
					The password will be hashed on the server. password will not be stored in plaintext after creation
	 */
function create(user) {
	//create new user.

	// Hand waving here -- not showing how this interacts with XHR or persistent
	// server-side storage.
	// Using the current timestamp + random number in place of a real id.

	// this logic needs to be enforced by backend as well
	//console.log("_usersByUsername is currently:", _usersByUsername );
	if (user.username != null && user.username != '' && user.password != null && user.password != '' && _usersByUsername[user.username] == null) {
		var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
		_users[id] = {
			id: id,
			username: user.username,
			password: user.password,
			fullname: user.fullname,
			role: user.role
		};
		_usersByUsername[user.username] = _users[id]
	}
	else {
		// console.log('error creating user. Either username or password was blank, or username already taken')
	}
}

/**
 * Update a USER item.
	 * @param  {string} id The ID of the User item
	 * @param  {object} userUpdates object containing possible updates (username, password, and/or fullname, role)
 */
function update(id, userUpdates) {
	// _users[id] = assign({}, _users[id], userUpdates);
	// console.log('user is ', _users[id], ', userUpdates is ', userUpdates)

	// this logic should be handled by backend.
	for (var key in userUpdates) {
		if (key == 'username') {
			// delete _usersByUsername[_users[id]['username']
			_usersByUsername[_users[id].username] = null
			_users[id][key] = userUpdates[key]
			_usersByUsername[_users[id]['username']] = _users[id]
		}
		else {
			_users[id][key] = userUpdates[key]
		}
	}
}

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
 */
function destroy(id) {
	delete _users[id];
}

/**
 * Delete all the completed USER items.
 */
// function destroyCompleted() {
//   for (var id in _users) {
//     if (_users[id].complete) {
//       destroy(id);
//     }
//   }
// }
// console.log("hey");

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
		// var users = this.getAllUsersFromServer
		// _users = users

		return _users;
	},

	getUserByUsername: function(username) {
		var user = _usersByUsername[username]
		// if username does not correspond to a user, this returns null.
		return user;
	},

	getAuthenticatedUser: function() {
		console.log("in '_authenticatedUserId' of UserStore. _authenticatedUserId is", _authenticatedUserId)
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
		// console.log("in UserStore. Emitting CHANGE_EVENT")
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
	// console.log('AppDispatcher firing. action is ' , action)
	switch(action.actionType) {
		case UserConstants.USER_RECEIVE_RAW_USERS:
			// This is the action that actually received the list of users, resulting in this call from the dispatcher
			// console.log("\n\nIn UserStore, dispatch receiving. received 'USER_RECEIVE_RAW_USERS' action signal, rawUsers are", action.rawUsers)
			var updatesMade = updateUserSet(action.rawUsers);
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


		case UserConstants.USER_RECEIVE_RAW_CREATED_USER:
			// console.log("\n\nIn UserStore, dispatch receiving. received 'USER_RECEIVE_RAW_CREATED_USER' action signal, rawUser is", action.rawUser)
			if (action.rawUser != null) {
				var updatesMade = addToUserSet(action.rawUser);
				// console.log("updatesMade in USER_RECEIVE_RAW_CREATED_USER is :", updatesMade)
				if (updatesMade) {
					//also want to set the created user as the authenticated user.
					_authenticatedUserId = action.rawUser.id
					UserStore.emitChange(null);
					UserStore.emitUserCreate({error: false, message_text: "New User created."});
          UserStore.emitAuthenticationChange({error: false, message_text: "New user logged in."})
					// console.log("user set (_users in UserStore) is now", _users);
				}
			}
			else {
				var message = action.message || "Unable to create new user.";
				UserStore.emitUserCreate({error: true, message_text: message});
			}
			break;

		case UserConstants.USER_CREATE:
			var user = action.user;
			for (var key in user) {
				user[key] = user[key].trim()
			}
			if (user.username == '' || user.password == '') {
				//this allows user.fullname and or role to be empty
				// console.log('error creating user')
			}
			else {
				create(user)
				UserStore.emitChange(null);
			}
			break;


		case UserConstants.USER_UPDATE:
      console.log("\n\nIn UserStore, dispatch receiving. received 'USER_UPDATE' action signal, action is", action)
      if (action.rawUser != null) {
        var updatesMade = false;
        var user = action.rawUser;
        if (user.id == null && user._id != null)  {
          user.id = user._id;
        }
        console.log("user in user set is ", _users[user.id]);

        var id = user.id
        if (user.username != _users[id].username) {
          updatesMade = updateUsername(user)
        }
        if (user.fullname != _users[id].fullname) {
          updatesMade = updateFullname(user)
        }
        if (user.role != _users[id].role) {
          updatesMade = updateRole(user)
        }

        if (true || updatesMade) {
          UserStore.emitChange({error: false, message_text: action.message_obj.message_text});
          console.log("user in user set is now", _users[id]);
        }
      }
      else {
        //This branch should not be encountered unless user attempted an update without being logged in.
        //The app shouldn't allow this to happen, but it could happen due to server reload or some other error.
        console.log("User store in USER_UPDATE. Can't update, emitming Change event with error message");
        var message = action.message_obj.message_text || "Unable to update user data.";
        UserStore.emitChange({error: true, message_text: message});
      }

      // //This is just for debugging.
      // if (action.rawUser != null) {
      //   console.log("user in user set is now", _users[action.rawUser._id]);
      // }
      break;

		case UserConstants.USER_DESTROY:
			destroy(action.id);
			UserStore.emitChange(null);
			break;



		case UserConstants.USER_SET_AUTHENTICATED_USER_STATE:
			// Triggered after user successfully logged in or out, and after receiving a list of users.

			// console.log("\n\nIn UserStore, dispatch receiving. received 'USER_SET_AUTHENTICATED_USER_STATE' action signal, rawUser is", action.rawUser)
      var currentUser = action.rawUser;
      var previousAuthenticatedUser = UserStore.getAuthenticatedUser();
      var message_obj = action.message_obj
      console.log("currentUser: ", currentUser, "previousAuth: ", previousAuthenticatedUser, "message_obj:", message_obj )
      if (currentUser == null || currentUser == undefined)    { currentUser = {}; }
      if (currentUser._id != null && currentUser.id == null)  { currentUser.id = currentUser._id; }

			if (currentUser.id == null && message_obj.error) {
        //Login was attempted but failed.
				_authenticatedUserId = null;
				UserStore.emitAuthenticationChange({error: true, message_text: message_obj.message_text || "Failed to log in."});
			}
			else if (message_obj.error == false) {
        if (currentUser.id != null && previousAuthenticatedUser.id != currentUser.id) {
          //This should be a successful login.
          _authenticatedUserId = currentUser.id
          UserStore.emitAuthenticationChange({error: false, message_text: message_obj.message_text || "Login successful."});
        }
        else if (currentUser.id == null && previousAuthenticatedUser.id != currentUser.id) {
          //This should be a successful logout.
          _authenticatedUserId = null;
          UserStore.emitAuthenticationChange({error: false, message_text: message_obj.message_text || "Logged out."});
        }
        // else if (currentUser.id != null && previousAuthenticatedUser.id == currentUser.id) {
        //   //The authenticationState is not changing. This is likely due to a refresh of the UserStore or other application data.
        //   //The user could be authenticated or un-authenticated.
        // }
        else {
          //The authenticationState is not actually changing. This is likely due to a refresh of the UserStore or other application data.
          //This could also be just after a page refresh when UserStore was initially populated.
          //The user could be authenticated or un-authenticated.
          UserStore.emitAuthenticationChange({error: false, message_text: null});
        }
			}
			else {
        //Not sure if this would be encountered.
        var message = "Problem encountered when setting the user authentication state.";
				console.log(message);
				_authenticatedUserId = null;
				UserStore.emitAuthenticationChange({error: true, message_text: message});
			}

			break;

		default:
			// no op
	}
});

module.exports = UserStore;
