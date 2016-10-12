/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var PollActionCreators = require('../actions/PollActionCreators');
import {Row, Col, Grid} from 'react-bootstrap'

var PollItem = require('./PollItem');

var PollList = React.createClass({

  propTypes: {
    allPolls: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are polls.
    if (Object.keys(this.props.allPolls).length < 1) {
      return null;
    }

    // if (this.props.allPolls.length < 1) {
    //   return null;
    // }

    var allPolls = this.props.allPolls;
    var pollNodes = []
    // var polls = allPolls.map(poll => (<li><PollItem key={poll.id} poll={poll}/></li>));

    for (var key in allPolls) {
      console.log("poll:", allPolls[key]);
      pollNodes.push(
        <Col key={key} xs={12} sm={6} md={6} className=''>
          <PollItem  poll={allPolls[key]} />
        </Col>
        );
    }

    return (
      // <div id="poll-list">
      //   <ul id="poll-list">{polls}</ul>
      // </div>
      <div>
        <div className='pollBoxHeader'>
          <h2 className='displayInline'>Listing of all polls</h2>
        </div>
        <br />
        <Grid>
          <Row className='pollList'>
            {pollNodes}
          </Row>
        </Grid>
      </div>

    );
  },

  /**
   * Event handler to mark all POLLs as complete
   */
  _onToggleCompleteAll: function() {
    PollActionCreators.toggleCompleteAll();
  }

});

module.exports = PollList;
