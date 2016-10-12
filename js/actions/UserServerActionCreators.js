/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var UserConstants = require('../constants/UserConstants');

module.exports = {

  receiveAll: function(rawUsers) {
    console.log('in UserServerActionCreators, received the receiveAll signal. dispatching the USER_RECEIVE_RAW_USERS signal, rawUsers are ', rawUsers)
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_RECEIVE_RAW_USERS,
      rawUsers: rawUsers
    });
  },

  receiveCreatedUser: function(createdUser) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_RECEIVE_RAW_CREATED_USER,
      rawUser: createdUser
    });
  },


  setAuthenticatedUserState: function(rawUser) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_SET_AUTHENTICATED_USER_STATE,
      rawUser: rawUser
    });
  }

};
