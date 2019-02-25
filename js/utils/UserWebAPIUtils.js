'use strict';

/*
./js/utils/UserWebAPIUtils.js

*/
import axios from 'axios';

import UserServerActionCreators from '../actions/UserServerActionCreators';
import UserStore from '../stores/UserStore';

var usersURL = UserStore.getUsersURL();


module.exports = {

  getAllUsers: function() {
    // simulate retrieving data from a database
    axios.get(usersURL)
      .then(response => {
        console.log('Successfully received server response for getAllUsers request.\nxhr.responseText:', response);
        var rawUsers = response.data.users;
        var currentUser = response.data.authorizedUser;
        // console.log('req.user is ', currentUser);
        // console.log('firing UserServerActionCreators.receiveAll');
        // console.log('raw users are ', rawUsers);
        UserServerActionCreators.receiveAll(rawUsers);
        // If this is a page reload and a user is authenticated, we want to set that state as well
        // if (currentUser != null ) {
        //   UserServerActionCreators.setAuthenticatedUserState(currentUser);
        // }
        var message_obj = {error: false, message_text: response.data.message};
        UserServerActionCreators.setAuthenticatedUserState(currentUser, message_obj);
      })
      .catch((err) => {
        // let message = 'Request for all users failed.  Returned status of ' + xhr.status;
        let message = 'Request for all users failed.';
        console.error(message, err);
        UserServerActionCreators.setUserErrorStatusAndMessage(true, message, '');
      });
  },

  // registerNewUser: function(data, cb) {
  registerNewUser: function(data) {
    // var data = {
    //   username: this.state.username,
    //   password: this.state.password,
    //   fullname: this.state.fullname || this.state.username,
    //   email: this.state.email
    // };
    axios.post(usersURL+ '/register', data)
      .then(response => {
        // console.log('Submitted Registration ajax xhr! xhr.responseText is', response);
        // should receive the new user object as 'authoriedUser' (includes id, username, fullname, and role)
        UserServerActionCreators.receiveCreatedUser(response.data.authorizedUser, null);
      })
      .catch(err => {
        // console.log('Registration xrh request failed.  Returned status is ' + xhr.status);
        let error_message = (err && err.response && err.response.data && err.response.data.message) || 'Failed to register new user.';
        UserServerActionCreators.receiveCreatedUser(null, error_message);
        UserServerActionCreators.setUserErrorStatusAndMessage(true, error_message, '');
      });
  },
  login: function(username, password) {
    var data = {username: username, password: password};
    axios.post(usersURL + '/login', data)
      .then(response => {
        let message_obj = {error: false, message_text: response.data.message };
        UserServerActionCreators.setAuthenticatedUserState(response.data.authorizedUser, message_obj);

      })
      .catch(err => {
        // console.log('Request failed.  Returned status of ' + (err));
        console.log(err.response);
        let message_obj = { error: true, message_text: (err && err.response && err.response.data && err.response.data.message) || 'Login Request failed.' };
        // UserServerActionCreators.setAuthenticatedUserState(null, message_obj);
        UserServerActionCreators.setUserErrorStatusAndMessage(true, message_obj.message_text, '');
      });
  },

  logout: function() {
    axios.get(usersURL + '/logout')
      .then(res => {
        // console.log('Successfully received reponse from user.logout xhr. xhr. The responseText is', rawLogoutResponse);
        var message_obj = {error: false, message_text: res.data && res.data.message};
        UserServerActionCreators.setAuthenticatedUserState({}, message_obj);
      })
      .catch(() => console.error('Logout request failed.'));
  },

  update: function(id, userUpdates) {
    var data = {};
    if (id == null) {
      console.log('No id passed to update function in UserWebAPIUtils.');
      return;
    }
    console.log('id and userUpdates in UserWebAPIUtils update function:', id, ', ', userUpdates);
    for (var key in userUpdates) {
      console.log('key is ', key);
      switch(key) {
      case 'role':
        data.new_role = userUpdates[key];
        break;
      case 'new_password':
        data.new_password = userUpdates[key];
        break;
      case 'fullname':
        data.new_fullname = userUpdates[key];
        break;
      case 'username':
        data.new_username = userUpdates[key];
        break;
      case 'current_password':
        data.current_password = userUpdates[key];
        //don\'t change this. Just send with data.
        break;
      default:
        console.log('in UserWebAPIUtils. Unknown userUpdate field passed to user update function.');
        return ;
      }
    }

    axios.post(usersURL + '/' + id, data)
      .then(response => {
        console.log('Submitted user update ajax xhr! xhr.responseText is', response.data || response);
        // should receive the updated user object as response.user (includes id, username, fullname, and role)
        let message_obj = { error: false, message_text: response.data.message};
        UserServerActionCreators.receiveUpdatedUser(response.data.user, message_obj);
      })
      .catch(err => {
        // console.log('Registration xrh request failed.  Returned status is ' + xhr.status);
        let message_obj = {error: true, message_text: err.message || err || 'Failed to update user.'};
        // UserServerActionCreators.receiveUpdatedUser(null, message_obj);
        UserServerActionCreators.setUserErrorStatusAndMessage(true, message_obj.message_text, '');
      });
  },

  update1: function(id, userUpdates) {
    var data = {};
    if (id == null) {
      console.log('No id passed to update function in UserWebAPIUtils.');
      return;
    }
    console.log('id and userUpdates in UserWebAPIUtils update function:', id, ', ', userUpdates);
    for (var key in userUpdates) {
      console.log('key is ', key);
      switch(key) {
      case 'role':
        data.new_role = userUpdates[key];
        break;
      case 'new_password':
        data.new_password = userUpdates[key];
        break;
      case 'fullname':
        data.new_fullname = userUpdates[key];
        break;
      case 'username':
        data.new_username = userUpdates[key];
        break;
      case 'current_password':
        data.current_password = userUpdates[key];
        //don\'t change this. Just send with data.
        break;
      default:
        console.log('in UserWebAPIUtils. Unknown userUpdate field passed to user update function.');
        return ;
      }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', usersURL + '/' + id);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onload = function() {
      if (xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        console.log('Submitted user update ajax xhr! xhr.responseText is', response);
        // should receive the updated user object as response.user (includes id, username, fullname, and role)
        let message_obj = { error: false, message_text: response.message};
        UserServerActionCreators.receiveUpdatedUser(response.user, message_obj);
      }
      else {
        // console.log('Registration xrh request failed.  Returned status is ' + xhr.status);
        let response = JSON.parse(xhr.responseText);
        let message_obj = {error: true, message_text: response.message || 'Failed to update user.'};
        // UserServerActionCreators.receiveUpdatedUser(null, message_obj);
        UserServerActionCreators.setUserErrorStatusAndMessage(true, message_obj.message_text, '');
      }
    }.bind(this);
    console.log('data:', data);

    xhr.send(JSON.stringify(data));
  }

};
