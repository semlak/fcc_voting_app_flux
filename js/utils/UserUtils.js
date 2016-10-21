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
