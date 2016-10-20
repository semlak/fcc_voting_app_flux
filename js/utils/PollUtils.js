/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module.exports = {

	convertRawPoll: function(rawPoll) {
		return {
			id: rawPoll.id || rawPoll._id,
			owner: rawPoll.owner,
			author: rawPoll.author,
			question: rawPoll.question,
			answer_options: rawPoll.answer_options,
			votes: rawPoll.votes
		};
	},

	getCreatedPollData: function(owner, author, question, answer_options) {
		var timestamp = Date.now();
		return {
			id: 'u_' + timestamp,
			author: author,
			question: question,
			answer_options: answer_options,
			votes: []
		};
	}

};
