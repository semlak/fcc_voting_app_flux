'use strict';

/*
 *
 * ./js/stores/UserStore
 */


/*
  Throughout this App, I refer to data from the server, such as polls and votes, as rawPolls and rawUsers, modeled after an example from Facebook's Flux examples.
  I'm not sure if my application has any differences between rawUsers and users or rawPolls and polls. I try to have the server clean them up.

  Most of these helper functions are called from the Switch statement functions trigged by action dispatch after an API call to the server.

  The '_usersByUsername' object is just an object that allows for efficiently looking up a user by their username, instead of their ID, sort of like a
  secondary index in a database.
  It is possible that this is a bit of violation of the React/Flux recommendation to not store data in state that is really just derived data.
*/


import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import UserConstants from '../constants/UserConstants';
import assign from 'object-assign';
import UserUtils from '../utils/UserUtils';

var CHANGE_EVENT = 'change';
var CREATE_EVENT = 'create';
// var _users = {};
var _users = {};
var _usersByUsername = {};
var _authenticatedUserId = null;
var _UserStoreIsInitialized = false;
var _usersURL = '/api/users';


/*
  I'm currently trying to use these variables to handle error updates in a less confusing manner. These could be errors while logging in, registering, or updating user.
  The error message is meant to be provided as a message to the user in whatever view they are in (or dialog box)
*/
var _error = false;
var _errorMessage = '';
var _successMessage = '';

/*
  function: addUsers(rawUsers) - takes as input an array of rawUser objects.
  Right now, this function is only called by the 'updateUserSet' function, and only when there were initially no users in the store (so on the initial application load).

  The if statement in the code checking for an existing user with the same ID as the one about to be entered should be unnessary, as the server should not allow multiple
  users to have the same ID, but it seems to prudent to check anyway.
*/

function addUsers(rawUsers) {
  rawUsers.forEach(function(user) {
    if (!_users[user.id]) {
      addUser(user);
    }
  });
}


/*
  function: addUser(rawUser) - takes as input a single rawUser object.
  This function is called in the above addUsers function (initial store population) as well as when a new user is created (registered) by the server.

  **It is assumed that the that the rawUser's ID has already been confirmed to not exist in the current set of users in the store.

  In order to maintain the _usersByUsername object, for easy lookup of users by their username, both the _users and _usersByUsername array must be updated
  for each user that is added or when their username is changed
*/

function addUser(rawUser) {
  var user = UserUtils.convertRawUser(rawUser);
  _users[user.id] = user;
  _usersByUsername[user.username] = _users[user.id];
  return true;
}


/*
  function: updateUser(rawUser) - A helper function that takes as input a rawUser object that has been updated by the server.
  The rawUser object will likely contain all of the user's info (username, fullname, role), but only the username is updated in this function.

  Note, currently, updating the username is slighly problematic due to the fact that user's profiles are viewed based on their username:
    The problem being that after the username is updated, the URL currently being rendered is no longer valid. I attempt to redirect to the new page, but
    havnen't really focused too much on this. This is why I have disabled this feature for non-admin.
    Currently I would recommend having a user contact an admin to change their username.

  In order to maintain the _usersByUsername object, for easy lookup of users by their username, both the _users and _usersByUsername array must be updated
  when their username is changed, including the removal of the old username from the _usersByUsername object.
*/

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



/*
  function: updateFullname(rawUser) - A helper function that takes as input a rawUser object that has been updated by the server.
  The rawUser object will likely contain all of the user's info (username, fullname, role), but only the updateFullname is updated in this function.
*/

function updateFullname(rawUser) {
  var user = UserUtils.convertRawUser(rawUser);
  _users[user.id].fullname = user.fullname;
  return true;
}



/*
  function: updateRole(rawUser) - A helper function that takes as input a rawUser object that has been updated by the server.
  The rawUser object will likely contain all of the user's info (username, fullname, role), but only the updateRole is updated in this function.
*/

function updateRole(rawUser) {
  var user = UserUtils.convertRawUser(rawUser);
  _users[user.id].role = user.role;
  return true;
}





/*
  function updateUserSet(rawUsers) - takes as input an array of rawUsers (provided by server), and makes sure current store is in sync with the rawUsers from server.

  This means that any users that have been deleted (meaning, they are in the current store's user set but not in rawUsers) will be removed
  New users will be added (presumably, they were added by another client between refreshes). Any changes in the user\'s username, fullname, or role
  will be detected and  updated.

  Overall, the function returns true if updates are made (even if just to a single user), false if no change.
*/
function updateUserSet(rawUsers) {

  //If there are currently no users in the user set (_users), then add all users and return true
  if (Object.keys(_users).length  == 0 ) {
    addUsers(rawUsers);
    return true;
  }
  //Otherwise, we want to delete user from _users who is no longer on the updated list, add user to _users who was not on list, and update existing user info


  //The variable 'updatesMade' will keep track if updates were needed (for the return value of the function)
  var updatesMade = false;


  // to check if user from _user is no longer on list, it is most efficient to create a hash of the new user list and compare
  var new_user_set = {};
  rawUsers.forEach(user => new_user_set[user.id] = user);
  // console.log('new_user_set is', new_user_set);
  for (var id in _users) {
    if (!new_user_set[id]) {
      updatesMade = destroy(id);
    }
  }

  // check if user already exists. If not, addUser, if so, veryify data is up to date and update if not ('update' function does this)
  rawUsers.forEach(function(rawUser) {
    if (!_users[rawUser.id]) {
      updatesMade = addUser(rawUser);
    }
    else {
      updatesMade = update(rawUser) || updatesMade;
    }
  });
  return updatesMade;
}



/**
 * Create user
 * @param  {object} rawUser, containing a id, username, fullname, role.
       This is occurring after the new user info has been sent to the server via ajax request.
       No password information is involved in the create request at this time.

 */
function create(rawUser) {
  if (rawUser.id != null && _users[rawUser.id] == null) {
    addUser(rawUser);
    return true;
  }
  else {
    console.error('UserStore error while creating user: the ID of the new user conflicts with an existing user ID.');
    return false;
  }
}


/**
 * Update a USER item.
 * @param  {object} rawUser object containing username, fullname, and role (any of which could be updated).
   These updates will have already been done by the server.

   Since this function also serves as a helper function to 'updateUserSet', it returns a boolean of 'true' if an update is made, and 'false' otherwise.

 */

function update(rawUser) {
  var user = UserUtils.convertRawUser(rawUser);
  // var localUser = Object.assign({}, _users[user.id]);
  var localUser = Object.assign({}, _users[user.id]);
  // console.log(local)
  var updatesMade = false;
  if (localUser.username != user.username) {
    updatesMade = updateUsername(user);
  }
  if (localUser.fullname != user.fullname) {
    updatesMade = updateFullname(user);
  }
  if (localUser.role != user.role) {
    updatesMade = updateRole(user);
  }
  return updatesMade;
}



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
 * Delete all the USER items. This currently is not used by app, but presumably there could be an admin feature to do this.
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
   * Get the entire state of the UserStore.
   * @return {object}, containing:
       users object (an object of user objects keyed by their id),
       authenticatedUser (user object),
       error (boolean)
       errorMessage (string)
   */

  getState: function() {
    return {
      users: _users,
      authenticatedUser: _users[_authenticatedUserId] || {},
      userStoreIsInitialized: _UserStoreIsInitialized,
      error: _error,
      errorMessage: _errorMessage,
      successMessage: _successMessage
    };

  },


  /**
   * Get the entire collection of USERs.
   * @return {object}
   */

  getAll: function() {
    return _users;
  },


  /**
   * Get a single USER by its username
   * @return {object}
   */
  getUserByUsername: function(username) {
    var user = _usersByUsername[username];
    // if username does not correspond to a user, this returns null.
    return user;
  },

  /**
   * Get the user object of the authenticated user (if the client is authenticated) or {} if the client is not signed in.
   * @return {object}
   */
  getAuthenticatedUser: function() {
    return _users[_authenticatedUserId] || {};
  },


  /**
  * Broadcast that _users has changed or was attempted to be changed.
  * @param  {object} message_obj containing an 'error' (boolean) and message_text (string)
   If the user tries but failes to update a user, the error message will be provided in message_obj
  */
  emitChange: function(message_obj) {
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


  getUsersURL: function() {
    return _usersURL;
  }
});


// Register callback to handle all updates
UserStore.dispatchToken = AppDispatcher.register(function(action) {
  var updatesMade = false;

  switch(action.actionType) {
  case UserConstants.USER_RECEIVE_RAW_USERS:
    // This is the action that actually received the list of users, resulting in this call from the dispatcher
    updatesMade = updateUserSet(action.rawUsers);
    // AppDispatcher.waitFor([ThreadStore.dispatchToken]);
    // _markAllInThreadRead(ThreadStore.getCurrentID());

    _UserStoreIsInitialized = true;
    _error = false;
    _errorMessage = '';
    _successMessage = '';
    if (updatesMade) {
      UserStore.emitChange(null);
    }
    break;


  case UserConstants.USER_CREATE:
    if (action.rawUser != null && action.rawUser.username != '' && action.rawUser.username != null && _usersByUsername[action.rawUser.username] == null) {
      updatesMade = create(action.rawUser);
      if (updatesMade) {
        //also want to set the created user as the authenticated user.
        _authenticatedUserId = action.rawUser.id;
        _error = false;
        _errorMessage = '';
        _successMessage = 'New User created.';
        UserStore.emitChange(null);
        UserStore.emitUserCreate({error: false, message_text: 'New User created.'});
        // UserStore.emitAuthenticationChange({error: false, message_text: 'New User created.'});
        // console.log('user set (_users in UserStore) is now', _users);
      }
      else {
        // I feel like if might be possible to encounter this branch. Not sure what to do.
        console.log('Did not expect to get here. Error when creating user.');
      }
    }
    else {
      _error = true;
      _errorMessage = action.message || action.errorMessage || 'Unable to create new user.';
      _successMessage = '';
      UserStore.emitUserCreate({error: true, message_text: _errorMessage});
      //UserStore.emitChange({error: true, message_text: _errorMessage});
    }
    break;


  case UserConstants.USER_UPDATE:
    if (action.rawUser != null) {
      updatesMade = false;
      let rawUser = action.rawUser;
      updatesMade = update(rawUser);
      _error = false;
      _errorMessage = '';
      let message_text =  action.message_obj != null ?  action.message_obj.message_text : null;
      _successMessage = message_text || '';
      UserStore.emitChange({error: false, message_text: message_text});
    }
    else {
      //This branch should not be encountered unless user attempted an update without being logged in.
      //The app shouldn't allow this to happen, but it could happen due to server reload or some other error.
      console.error('User store in USER_UPDATE. Can\'t update, emitming Change event with error message');
      _error = true;
      _errorMessage = action.message_obj.message_text || 'Unable to update user data.';
      _successMessage = '';
      UserStore.emitChange({error: true, message_text: _errorMessage});
    }
    break;


  case UserConstants.USER_DESTROY:
    destroy(action.id);
    UserStore.emitChange(null);
    break;


  case UserConstants.USER_DESTROY_ALL:
    destroyAll();
    UserStore.emitChange(null);
    break;



  case UserConstants.USER_SET_ERROR:
    _error = action.errorStatus;
    _errorMessage = action.errorMessage;
    _successMessage = action.successMessage;
    UserStore.emitChange({error: _error, message_text: _errorMessage|| _successMessage});
    break;



  case UserConstants.USER_SET_AUTHENTICATED_USER_STATE:
    // Triggered after user successfully logged in or out, and after receiving a list of users.

    // console.log('\n\nIn UserStore, dispatch receiving. received 'USER_SET_AUTHENTICATED_USER_STATE' action signal, rawUser is', action.rawUser);
    var currentUser = action.rawUser;
    var previousAuthenticatedUser = UserStore.getAuthenticatedUser();
    var message_obj = action.message_obj;
    // console.log('currentUser: ', currentUser, 'previousAuth: ', previousAuthenticatedUser, 'message_obj:', message_obj );
    if (currentUser == null || currentUser == undefined)    { currentUser = {}; }

    if (previousAuthenticatedUser.id != currentUser.id) {
      // The authenticatedUser has changed. The user has either Logged in or Logged out, or potentially changed users (UI does not currently support this on purpose).
      if (currentUser.id != null) {
        //This should be a successful login.
        _successMessage = message_obj.message_text || 'Login successful.';
      }
      else if (currentUser.id == null) {
        //This should be a successful logout.;
        _successMessage = message_obj.message_text || 'Logout successful.';
      }

      _authenticatedUserId = currentUser.id;
      _errorMessage = '';
      _error = false;
      UserStore.emitChange({error: _error, message_text: _successMessage});
    }
    else {
      // no op.
      // This is likely just trigged on a refresh of users. This function is called just to ensure that app authentication state is current.
      // In this case, there with no change to the authentication state, so no op needed.
    }
    break;

  // case UserConstants.USER_SET_AUTHENTICATED_USER_STATE:
  //   // Right now, this is a bit of a mess.
  //   // Triggered after user successfully logged in or out, and after receiving a list of users.
  //   // Also trigged due to failed attempt to login, but I hope to remove this functionalilty to USER_SET_ERROR case

  //   // console.log('\n\nIn UserStore, dispatch receiving. received 'USER_SET_AUTHENTICATED_USER_STATE' action signal, rawUser is', action.rawUser);
  //   var currentUser = action.rawUser;
  //   var previousAuthenticatedUser = UserStore.getAuthenticatedUser();
  //   var message_obj = action.message_obj;
  //   // console.log('currentUser: ', currentUser, 'previousAuth: ', previousAuthenticatedUser, 'message_obj:', message_obj );
  //   if (currentUser == null || currentUser == undefined)    { currentUser = {}; }

  //   if (currentUser.id == null && message_obj.error) {
  //     //Login was attempted but failed.
  //     _authenticatedUserId = null;
  //     // UserStore.emitAuthenticationChange({error: true, message_text: message_obj.message_text || 'Failed to log in.'});
  //     UserStore.emitChange({error: true, message_text: message_obj.message_text || 'Failed to log in.'});
  //   }
  //   else if (message_obj.error == false) {
  //     if (currentUser.id != null && previousAuthenticatedUser.id != currentUser.id) {
  //       //This should be a successful login.
  //       _authenticatedUserId = currentUser.id;
  //       _successMessage = message_obj.message_text || 'Login successful.';
  //       _errorMessage = '';
  //       // UserStore.emitAuthenticationChange({error: false, message_text: message_obj.message_text || 'Login successful.'});
  //       UserStore.emitChange({error: false, message_text: message_obj.message_text || 'Login successful.'});
  //     }
  //     else if (currentUser.id == null && previousAuthenticatedUser.id != currentUser.id) {
  //       //This should be a successful logout.;
  //       _authenticatedUserId = null;
  //       // UserStore.emitAuthenticationChange({error: false, message_text: message_obj.message_text || 'Logged out.'});
  //       UserStore.emitChange({error: false, message_text: message_obj.message_text || 'Logged out.'});
  //       _successMessage = message_obj.message_text || 'Logout successful.';
  //       _errorMessage = '';
  //     }
  //     // else if (currentUser.id != null && previousAuthenticatedUser.id == currentUser.id) {
  //     //   //The authenticationState is not changing. This is likely due to a refresh of the UserStore or other application data.;
  //     //   //The user could be authenticated or un-authenticated.;
  //     // }
  //     else {
  //       //The authenticationState is not actually changing. This is likely due to a refresh of the UserStore or other application data.;
  //       //This could also be just after a page load or refresh when UserStore was initially populated.;
  //       //The user could be authenticated or un-authenticated.;
  //       // UserStore.emitAuthenticationChange({error: false, message_text: null});
  //       UserStore.emitChange();
  //     }
  //   }
  //   else {
  //     //Not sure if this would be encountered. I'm am considering trying to really think about and see if I can create a test that triggers this. Haven't tried though.
  //     _error = true;
  //     _errorMessage = 'Problem encountered when setting the user authentication state.';
  //     console.error(_errorMessage);
  //     _authenticatedUserId = null;
  //     // UserStore.emitAuthenticationChange({error: true, message_text: _errorMessage});
  //     UserStore.emitChange({error: true, message_text: _errorMessage});
  //   }

  //   break;

  default:
    // no op;
  }
});

module.exports = UserStore;
