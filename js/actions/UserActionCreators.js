/*

 */

var UserDispatcher = require('../dispatcher/UserDispatcher');
var UserConstants = require('../constants/UserConstants');
import UserWebAPIUtils from '../utils/UserWebAPIUtils'

var UserActionCreators = {

  /**
   * @param  {object} user, containing a username, password, and fullname, role.
          The password will be hashed on the server. password will not be stored in plaintext after creation
   */
  create: function(/*object*/ user) {
    UserDispatcher.dispatch({
      actionType: UserConstants.USER_CREATE,
      username: user.username,
      password: user.password,
      fullname: user.fullname,
      role: user.role
    });
  },

  /**
   * @param  {string} id The ID of the User item
   * @param  {object} userUpdates:  object containing possible updates (username, password, and/or fullname, role)
   */
  update: function(id, /*object*/ userUpdates) {
    UserDispatcher.dispatch({
      actionType: UserConstants.USER_UPDATE,
      id: id,
      userUpdates: userUpdates
    });
  },

  getAllFromServer: function() {
    // console.log('in UserActionCreators, getallFromServer. Dispatching USER_GET_ALL_FROM_SERVER')

    // UserDispatcher.dispatch({
    //   actionType: UserConstants.USER_GET_ALL_FROM_SERVER
    // });
    UserWebAPIUtils.getAllUsers();
  },
  /**
   * Toggle whether a single User is complete
   * @param  {object} user
   */
  // toggleComplete: function(user) {
  //   var id = user.id;
  //   var actionType = user.complete ?
  //       UserConstants.USER_UNDO_COMPLETE :
  //       UserConstants.USER_COMPLETE;

  //   UserDispatcher.dispatch({
  //     actionType: actionType,
  //     id: id
  //   });
  // },

  /**
   * Mark all Users as complete
   */
  // toggleCompleteAll: function() {
  //   UserDispatcher.dispatch({
  //     actionType: UserConstants.USER_TOGGLE_COMPLETE_ALL
  //   });
  // },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    //note: currently, the server will not destroy any polls or votes associated with user when user is deleted
    // UserWebAPIUtils.destroy(id)
    // UserDispatcher.dispatch({
    //   actionType: UserConstants.USER_DESTROY,
    //   id: id
    // });
  },


  login: function(username, password) {
    UserWebAPIUtils.login(username, password);
    // UserDispatcher.dispatch({
    //   actionType: UserConstants.USER_LOGIN,
    //   username: username,
    //   password: password
    // })
  },

  logout: function() {
    UserWebAPIUtils.logout()
  }

  /**
   * Delete all the completed Users
   */
  // destroyCompleted: function() {
  //   UserDispatcher.dispatch({
  //     actionType: UserConstants.USER_DESTROY_COMPLETED
  //   });
  // }

};

module.exports = UserActionCreators;
