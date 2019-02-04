'use strict';
/*
./js/utils/__mocks__/UserWebAPIUtils.js

*/

import UserServerActionCreators from '../../actions/UserServerActionCreators';


/*
  users is an array of user objects
  Note: Neither passwords nor hashed passwords are stored in the client-app, and only hashed-salted passwords are stored on the server.
        However, the passwords are sent unhashed from the client to the server, where they are then checked during authentication process.
        Storing the passwords below in plaintext is purely
*/

const users = {
  4: {id: 4, username: 'username1', password: 'dumbpa$$word1', fullname: 'John Doe', role: 'user'},
  5: {id: 5, username: 'simple_username84', password: 'dumb_pa$$word', fullname: 'Jane Deer', role: 'user'}
};

module.exports = {
  login(username, password) {
    var message_obj, user_obj;
    var filteredUsers = Object.keys(users).map(id => users[id]).filter(user => user.username == username && user.password == password);
    if (filteredUsers.length != 1) {
      message_obj = { error: true, message_text: 'Invalid username or password.'};
      user_obj = null;
      UserServerActionCreators.setUserErrorStatusAndMessage(true, message_obj.message_text, '');

    }
    else {
      message_obj = { error: false, message_text: 'Login successful.'};
      user_obj = filteredUsers[0];
      delete user_obj.password;
      UserServerActionCreators.setAuthenticatedUserState(user_obj, message_obj);
    }
  }
};
