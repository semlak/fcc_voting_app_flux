'use strict';

/*
./components/PollItem.jsx

 This is called PollItem rather than just 'Poll', because it is specifically to represent a Poll node on a list of Polls.
 It does not list all of the poll, just the author and question.

*/

import React from 'react';
import ReactPropTypes from 'react/lib/ReactPropTypes';
// import PollActionCreators from '../actions/ PollActionCreators';
// import NavLink from './NavLink';


var PollItem = function(props) {
  var poll = props.poll;
  var author_label = 'Poll Author: ';
  var question_label = 'Poll Question: ';
  return (
    <div className='poll well' id={'poll-' + poll.id} onClick={props.handlePollSelect.bind(null, poll.id)}>
      <div className='poll-author poll-label'>
        {author_label}
        <span>
          {poll.author}
        </span>
      </div>
      <div className='poll-question poll-label'>
        {question_label}
        <span>
          {poll.question}
        </span>
      </div>
    </div>
  );
};


PollItem.propTypes = {
  poll: ReactPropTypes.object.isRequired,
  handlePollSelect: React.PropTypes.func.isRequired
};



module.exports = PollItem;




// var PollItem = React.createClass({

//   propTypes: {
//     poll: ReactPropTypes.object.isRequired,
//     handlePollSelect: React.PropTypes.func.isRequired
//   },

//   render: function() {
//     var poll = this.props.poll;
//     var author_label = 'Poll Author: ';
//     var question_label = 'Poll Question: ';
//     return (
//       <div className='poll well' id={'poll-' + poll.id} onClick={this.props.handlePollSelect.bind(null, poll.id)}>
//         <div className='poll-author poll-label'>
//           {author_label}
//           <span>
//             {poll.author}
//           </span>
//         </div>
//         <div className='poll-question poll-label'>
//           {question_label}
//           <span>
//             {poll.question}
//           </span>
//         </div>
//       </div>
//     );
//   }
// });

// module.exports = PollItem;
