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

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants');
var assign = require('object-assign');
var UserUtils = require('../utils/UserUtils')

var CHANGE_EVENT = 'change';
var CREATE_EVENT = 'create';

// var _users = {};
var _users = {}
var _usersByUsername = {};
var _authenticatedUser = {};
var _usersURL = '/users';



function addUsers(rawUsers) {
  // console.log('in UserStore., addUsers.  adding raw users to _users, rawUsers are', rawUsers)
  rawUsers.forEach(function(user) {
    // user.id = user._id
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
  var user = UserUtils.converRawUser(rawUser);
  _users[user.id].fullname = user.fullname
  return true
}

function updateRole(rawUser) {
  var user = UserUtils.converRawUser(rawUser);
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

  rawUser.id = rawUser._id;
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
   * @param  {object} update object containing possible updates (username, password, and/or fullname, role)
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
    // console.log("in 'getAuthenticatedUser' of UserStore. _authenticatedUser is", _authenticatedUser)
    return _authenticatedUser;
  },

  emitChange: function(message) {
    // console.log("in UserStore. Emitting CHANGE_EVENT")
    this.emit(CHANGE_EVENT, message);
  },

  emitUserCreate: function(message) {
    this.emit(CREATE_EVENT, message);
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
      break;


    case UserConstants.USER_RECEIVE_RAW_CREATED_USER:
      // console.log("\n\nIn UserStore, dispatch receiving. received 'USER_RECEIVE_RAW_CREATED_USER' action signal, rawUser is", action.rawUser)
      if (action.rawUser != null) {
        var updatesMade = addToUserSet(action.rawUser);
        // console.log("updatesMade in USER_RECEIVE_RAW_CREATED_USER is :", updatesMade)
        if (updatesMade) {
          //also want to set the created user as the authenticated user.
          _authenticatedUser = action.rawUser
          UserStore.emitChange(null);
          UserStore.emitUserCreate(null);
          // console.log("user set (_users in UserStore) is now", _users);
        }
      }
      else {
        var message = action.message || "Unable to create new user.";
        UserStore.emitUserCreate(message);
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
        UserStore.emitChange();
      }
      break;


    case UserConstants.USER_UPDATE:
      // console.log("action is ", action);
      var userUpdates = action.userUpdates
      // console.log('userUpdates is ', userUpdates)
      for (var key in userUpdates) {
        userUpdates[key] = userUpdates[key].trim()
      }
      if (userUpdates.username != '' && userUpdates.password != '') {
        update(action.id, userUpdates);
        UserStore.emitChange();
      }
      break;

    case UserConstants.USER_DESTROY:
      destroy(action.id);
      UserStore.emitChange();
      break;



    case UserConstants.USER_SET_AUTHENTICATED_USER_STATE:
      // triggered after user successfully logged.
      // console.log("\n\nIn UserStore, dispatch receiving. received 'USER_SET_AUTHENTICATED_USER_STATE' action signal, rawUser is", action.rawUser)
      if (action.rawUser == null || action.rawUser == undefined || action.rawUser.username == null) {
        _authenticatedUser = {};
        UserStore.emitChange();
      }
      else if (_authenticatedUser.username != action.rawUser.username || _authenticatedUser.fullname != action.rawUser.fullname) {
        _authenticatedUser = action.rawUser
        UserStore.emitChange();
      }
      else {
        console.log("Problem encountered when setting the user authentication state");
        _authenticatedUser = {};
        UserStore.emitChange();
      }
      // console.log('_authenticatedUser is now', _authenticatedUser)

      break;


    default:
      // no op
  }
});

module.exports = UserStore;
