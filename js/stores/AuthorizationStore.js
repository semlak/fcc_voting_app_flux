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

var UserDispatcher = require('../dispatcher/UserDispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants');
var assign = require('object-assign');
var UserUtils = require('../utils/UserUtils')

var CHANGE_EVENT = 'change';

// var _users = {};
var _users = {}
var _usersByUsername = {};



function addUsers(rawUsers) {
  console.log('in UserStore., addUsers.  adding raw users to _users, rawUsers are', rawUsers)
  rawUsers.forEach(function(user) {
    user.id = user._id
    if (!_users[user.id]) {
      _users[user.id] = UserUtils.convertRawUser(user);
      _usersByUsername[user.username] = _users[user.id]
    }
  });
  console.log('in userStore. _users are now ', _users)
}


// _users['123'] = {id: '123', username: 'Xena', password: 'blah', fullname: 'Xena: Warrior Princess'}

  /**
   * Create user
   * @param  {object} user, containing a username, password, and fullname.
          The password will be hashed on the server. password will not be stored in plaintext after creation
   */
function create(user) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.

  // this logic needs to be enforced by backend as well
  if (user.username != null && user.username != '' && user.password != null && user.password != '' && _usersByUsername[user.username] == null) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _users[id] = {
      id: id,
      username: user.username,
      password: user.password,
      fullname: user.fullname
    };
    _usersByUsername[user.username] = _users[id]
  }
  else {
    console.log('error creating user. Either username or password was blank')
  }
}

/**
 * Update a USER item.
   * @param  {string} id The ID of the User item
   * @param  {object} update object containing possible updates (username, password, and/or fullname)
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

// should move this to webapi utils
  login: function(username, password) {
    var data = {username: username, password: password}
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login-ajax');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status === 200) {
            // console.log('Hello! xhr.responseText is' + xhr.responseText);
            // console.log('xhr is ', xhr)
            // var data =
            // var usersArray = JSON.parse(xhr.responseText).users
            // console.log('usersArray', usersArray)
            // var users = {}
            // var usersByUsername = {}
            // usersArray.forEach(function(user) {
            //   console.log('user is ', user)
            //   // user.id = user._id
            //   users[user._id] = user
            //   users[user._id].id = user._id

            //   usersByUsername[user.username] = user
            //   usersByUsername[user.username].id = user._id

            // })
            // console.log('users', users)
            // _users = users;
            // _usersByUsername = usersByUsername;
            // // return _
            // this.emitChange()


        }
        else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    }.bind(this);


    xhr.send(JSON.stringify(data));


    // $.ajax({
    //   type: 'POST',
    //   url: '/login-ajax',
    //   data: data,
    //   success: function(result) {
    //     if (!result) {
    //       console.log("Loggin Failed")
    //       // $("#usermenu-list").append('<li>Invalid Username or password</li>');

    //     }
    //     else {
    //       console.log("result is ", result)
    //       if (result.user) {
    //         this.props.updateAppState({user: result.user})
    //         $('#register_box').modal('hide')
    //         // $('#register_box').modal('hide')
    //         // It would be nice to execute a callback here. That would make this more useful. It could close modal or dropdown menu.
    //       }
    //       else if (result.message) {
    //         this.setState({error_message: result.message})
    //         $('#sign_in_message').show()
    //         // $('#sign_in_message').append("<div class='alert alert-danger fade in'>" + this.state.modal_error_message + "<button type='button' class='close pull-right' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>")
    //       }
    //       // this.setState({user: result.user})
    //     }
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     // this.setState({data: newPoll});
    //     console.error('xhr:', xhr, ', status: ', status, ', err: ', err.toString());
    //     if (xhr.responseText) {
    //         this.setState({error_message: 'Error Signing In'})
    //         // $('#sign_in_message').append("<div class='alert alert-danger fade in'>" + this.state.modal_error_message + "<button type='button' class='close pull-right' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>")
    //     }
    //   }.bind(this)
    // })

  },

  //should move this to webAPIUtils

  // getAllUsersFromServer: function() {
  //   // An ajax request without using jQuery
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('GET', '/users');
  //   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  //   xhr.onload = function() {
  //       if (xhr.status === 200) {
  //           console.log('Hello! xhr.responseText is' + xhr.responseText);
  //           console.log('xhr is ', xhr)
  //           // var data =
  //           var usersArray = JSON.parse(xhr.responseText).users
  //           console.log('usersArray', usersArray)
  //           var users = {}
  //           var usersByUsername = {}
  //           usersArray.forEach(function(user) {
  //             console.log('user is ', user)
  //             // user.id = user._id
  //             users[user._id] = user
  //             users[user._id].id = user._id

  //             usersByUsername[user.username] = user
  //             usersByUsername[user.username].id = user._id

  //           })
  //           console.log('users', users)
  //           _users = users;
  //           _usersByUsername = usersByUsername;
  //           // return _
  //           this.emitChange()


  //       }
  //       else {
  //           console.log('Request failed.  Returned status of ' + xhr.status);
  //       }
  //   }.bind(this);
  //   xhr.send();


  //   // console.log("loading polls from server")
  //   // $.ajax({
  //   //   url: '/users',
  //   //   dataType: 'json',
  //   //   cache: false,
  //   //   success: function(data) {
  //   //     console.log("in ajax request. Data is ", data);
  //   //     // data is an array of polls. We want the polls stored as a hash for easy lookup when associating with votes
  //   //     var hash = {}
  //   //     // data.polls.forEach(poll => {
  //   //       // hash[poll._id] = poll
  //   //     // })
  //   //     // this.setState({polls: hash});

  //   //   }.bind(this),
  //   //   error: function(xhr, status, err) {
  //   //     // console.log("error with url", this.props.poll_url)
  //   //     console.log("error ", err)
  //   //     // console.error(this.props.poll_url, status, err.toString());
  //   //   }.bind(this)
  //   // });

  // },

  getUserByUsername: function(username) {
    var user = _usersByUsername[username]
    // if username does not correspond to a user, this returns null.
    return user;
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
  }
});

// Register callback to handle all updates
UserStore.dispatchToken = UserDispatcher.register(function(action) {
  switch(action.actionType) {
    case UserConstants.USER_CREATE:
      var user = action.user;
      for (var key in user) {
        user[key] = user[key].trim()
      }
      if (user.username == '' || user.password == '') {
        //this allows user.fullname to be empty
        console.log('error creating user')
      }
      else {
        create(user)
        UserStore.emitChange();
      }
      break;



    // case UserConstants.USER_TOGGLE_COMPLETE_ALL:
    //   if (UserStore.areAllComplete()) {
    //     updateAll({complete: false});
    //   } else {
    //     updateAll({complete: true});
    //   }
    //   UserStore.emitChange();
    //   break;

    // case UserConstants.USER_UNDO_COMPLETE:
    //   update(action.id, {complete: false});
    //   UserStore.emitChange();
    //   break;

    // case UserConstants.USER_COMPLETE:
    //   update(action.id, {complete: true});
    //   UserStore.emitChange();
    //   break;

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

    case UserConstants.USER_RECEIVE_RAW_USERS:
      console.log("\n\nreceived 'RECEIVE_RAW_USERS' action signal")
      addUsers(action.rawUsers);
      // UserDispatcher.waitFor([ThreadStore.dispatchToken]);
      // _markAllInThreadRead(ThreadStore.getCurrentID());
      UserStore.emitChange();
      break;


    default:
      // no op
  }
});

module.exports = UserStore;
