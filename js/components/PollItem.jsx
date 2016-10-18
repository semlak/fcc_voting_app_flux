
 // This is called PollItem rather than just 'Poll', because it is specifically to represent a Poll on a list of Polls.

import React from 'react';
import {browserHistory} from 'react-router';
import ReactPropTypes from 'react/lib/ReactPropTypes';
import PollActionCreators from '../actions/PollActionCreators';
// import NavLink from './NavLink'

var PollItem = React.createClass({

  propTypes: {
   poll: ReactPropTypes.object.isRequired
  },

  handlePollSelect: function(e) {
    browserHistory.push('/polls/' + this.props.poll.id);
  },
  /**
   * @return {object}
   */
  render: function() {
    var poll = this.props.poll;
    var author_label = "Poll Author: "
    var question_label = "Poll Question: "
    return (
      <div className='poll well' id={'poll_' + this.props.id} onClick={this.handlePollSelect}>
        <div className='pollAuthor poll-label'>
          {author_label}
          <span>
            {poll.author}
          </span>
        </div>
        <div className='pollQuestion poll-label'>
          {question_label}
          <span>
            {poll.question}
          </span>
        </div>
      </div>
    )
  }
});

module.exports = PollItem;
