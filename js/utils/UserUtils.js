'use strict';


/**
./js/utils/UserUtils.js
 */

module.exports = {

  convertRawUser: function(rawUser) {
    return {
      id: rawUser.id,
      username: rawUser.username,
      fullname: rawUser.fullname,
      role: rawUser.role
    };
  },

// I currently don't seem to use this function. Will probably delete.
  getCreatedUserData: function(username, password, fullname, role) {
    var timestamp = Date.now();
    return {
      id: 'u_' + timestamp,
      username: username,
      // password: password,
      fullname: fullname,
      role: role
    };
  }

};
