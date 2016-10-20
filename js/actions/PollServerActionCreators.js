/*
PollServerActionCreators.js
*/


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

import AppDispatcher from '../dispatcher/AppDispatcher';
import PollConstants from '../constants/PollConstants';

module.exports = {

	receiveAll: function(rawPolls) {
		// console.log('in PollServerActionCreators, received the receiveAll signal. dispatching the POLL_RECEIVE_RAW_POLLS signal, rawPolls are ', rawPolls)
		AppDispatcher.dispatch({
			actionType: PollConstants.POLL_RECEIVE_RAW_POLLS,
			rawPolls: rawPolls
		});
	},

	receiveCreatedPoll: function(rawPolls, new_poll_id) {
		// console.log("in PollServerActionCreators.receiveCreatedPoll, rawPolls is ", rawPolls);
		AppDispatcher.dispatch({
			actionType: PollConstants.POLL_RECEIVE_RAW_CREATED_POLL,
			new_poll_id: new_poll_id,
			rawPolls: rawPolls
		});
	},

	handleDeletedPoll: function(poll_id) {
		// console.log("in handleDeletedPoll of PollServerActionCreators. dispatching POLL_DESTROY signal with poll_id ", poll_id)
		AppDispatcher.dispatch({
			actionType: PollConstants.POLL_DESTROY,
			id: poll_id
		});
	},

	handleDeletedPollFail: function(poll_id) {
		// console.log("in handleDeletedPollFail of PollServerActionCreators. dispatching POLL_DESTROY_FAIL signal with poll_id ", poll_id)
		AppDispatcher.dispatch({
			actionType: PollConstants.POLL_DESTROY_FAIL,
			id: poll_id
		});
	}
};
