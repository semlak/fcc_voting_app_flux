'use strict';

/*
./js/utils/UserWebAPIUtils.js

*/
import UserServerActionCreators from '../actions/UserServerActionCreators';
import UserStore from '../stores/UserStore';

var usersURL = UserStore.getUsersURL();


module.exports = {

	getAllUsers: function() {
		// simulate retrieving data from a database
		var xhr = new XMLHttpRequest();
		xhr.open('GET', usersURL);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.onload = function() {
			if (xhr.status === 200) {
				// console.log('xhr is ', xhr);
				var response = JSON.parse(xhr.responseText);
				// console.log('Successfully received server response for getAllUsers request.\nxhr.responseText:', response);
				var rawUsers = response.users;
				var currentUser = response.authorizedUser;
				// console.log('req.user is ', currentUser);
				// console.log('firing UserServerActionCreators.receiveAll');
				// console.log('raw users are ', rawUsers);
				UserServerActionCreators.receiveAll(rawUsers);
				// If this is a page reload and a user is authenticated, we want to set that state as well
				// if (currentUser != null ) {
				// 	UserServerActionCreators.setAuthenticatedUserState(currentUser);
				// }
				var message_obj = {error: false, message_text: response.message};
				UserServerActionCreators.setAuthenticatedUserState(currentUser, message_obj);
			}
			else {
				console.log('Request for all users failed.  Returned status of ' + xhr.status);
			}
		}.bind(this);
		xhr.send();

	},

	// registerNewUser: function(data, cb) {
	registerNewUser: function(data) {
		// var data = {
		//   username: this.state.username,
		//   password: this.state.password,
		//   fullname: this.state.fullname || this.state.username,
		//   email: this.state.email
		// };
		var xhr = new XMLHttpRequest();
		xhr.open('POST', usersURL+ '/register');
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

		xhr.onload = function() {
			if (xhr.status === 200) {
				const response = JSON.parse(xhr.responseText);
				// console.log('Submitted Registration ajax xhr! xhr.responseText is', response);
				// should receive the new user object as 'authoriedUser' (includes id, username, fullname, and role)
				UserServerActionCreators.receiveCreatedUser(response.authorizedUser, null);

			}
			else {
				// console.log('Registration xrh request failed.  Returned status is ' + xhr.status);
				UserServerActionCreators.receiveCreatedUser(null, 'Failed to register new user.');
			}
		}.bind(this);

		xhr.send(JSON.stringify(data));
	},

	login: function(username, password) {
		var data = {username: username, password: password};
		var xhr = new XMLHttpRequest();
		xhr.open('POST', usersURL + '/login');
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

		xhr.onload = function() {
			if (xhr.status === 200) {
					// console.log('Successfully received reponse from user.login xhr. xhr.responseText is' + xhr.responseText);
				let rawLoginResponse = JSON.parse(xhr.responseText);
				let message_obj = {error: false, message_text: rawLoginResponse.message };
				UserServerActionCreators.setAuthenticatedUserState(rawLoginResponse.authorizedUser, message_obj);

			}
			else {
				let rawLoginResponse = JSON.parse(xhr.responseText);
				console.log('Request failed.  Returned status of' + xhr.status);
				let message_obj = {error: true, message_text: rawLoginResponse.message || 'Login Request failed.  Returned status of ' + xhr.status};
				UserServerActionCreators.setAuthenticatedUserState(null, message_obj);
			}
		}.bind(this);

		xhr.send(JSON.stringify(data));

	},


	logout: function() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', usersURL + '/logout');
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

		xhr.onload = function() {
			if (xhr.status === 200) {
				var rawLogoutResponse = JSON.parse(xhr.responseText);
				// console.log('Successfully received reponse from user.logout xhr. xhr. The responseText is', rawLogoutResponse);
				var message_obj = {error: false, message_text: rawLogoutResponse.message};
				UserServerActionCreators.setAuthenticatedUserState({}, message_obj);
			}
			else {
				console.log('Request failed.  Returned status of ' + xhr.status);
			}
		}.bind(this);
		xhr.send();
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
				UserServerActionCreators.receiveUpdatedUser(null, message_obj);
			}
		}.bind(this);
		console.log('data:', data);

		xhr.send(JSON.stringify(data));
	}

};
