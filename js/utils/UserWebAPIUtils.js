

var UserServerActionCreators = require('../actions/UserServerActionCreators');
var UserStore = require('../stores/UserStore');

var usersURL = UserStore.getUsersURL()


module.exports = {

  getAllUsers: function() {
    // simulate retrieving data from a database
    var xhr = new XMLHttpRequest();
    xhr.open('GET', usersURL);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.onload = function() {
        if (xhr.status === 200) {
            // console.log('Successfully received server response for getAllUsers request. xhr.responseText is' + xhr.responseText);
            // console.log('xhr is ', xhr)
            // var data =
            var rawUsers = JSON.parse(xhr.responseText).users
            var currentUser = JSON.parse(xhr.responseText).user
            console.log('req.user is ', currentUser)
            console.log('firing UserServerActionCreators.receiveAll')
            // console.log('raw users are ', rawUsers)
            UserServerActionCreators.receiveAll(rawUsers);
            UserServerActionCreators.setAuthenticatedUserState(currentUser);


        }
        else {
            console.log('Request for all users failed.  Returned status of ' + xhr.status);
        }
    }.bind(this);
    xhr.send();

  },

  registerNewUser: function(data, cb) {
    // var data = {
    //   username: this.state.username,
    //   password: this.state.password,
    //   fullname: this.state.fullname || this.state.username,
    //   email: this.state.email
    // }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/register');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status === 200) {
          console.log('Submitted Registration ajax xhr! xhr.responseText is' + xhr.responseText);
          // should receive a new list of users.
          // UserServerActionCreators.receiveAll(rawUsers);

        }
        else {
          console.log('Registration xrh request failed.  Returned status is ' + xhr.status);
        }
    }.bind(this);

    xhr.send(JSON.stringify(data));
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
            console.log('Successfully received reponse from user.login xhr. xhr.responseText is' + xhr.responseText);
            var rawLoginResponse = JSON.parse(xhr.responseText)
            UserServerActionCreators.setAuthenticatedUserState(rawLoginResponse.user);

        }
        else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    }.bind(this);

    xhr.send(JSON.stringify(data));

  },

  logout: function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/logout');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Successfully received reponse from user.logout xhr. xhr. The responseText is' + xhr.responseText);
            var rawLoginResponse = JSON.parse(xhr.responseText)
            UserServerActionCreators.setAuthenticatedUserState({});
        }
        else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    }.bind(this);
    xhr.send();
  }


};
