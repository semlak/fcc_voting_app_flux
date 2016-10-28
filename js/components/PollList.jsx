'use strict';

/**
PollList.jsx
 */

import React from 'react';
import ReactPropTypes from 'react/lib/ReactPropTypes';
import {Row, Col, Grid} from 'react-bootstrap';
import PollItem from './PollItem';

var PollList = React.createClass({

	propTypes: {
		allPolls: ReactPropTypes.object.isRequired,
		handlePollSelect: ReactPropTypes.func.isRequired
	},

	/**
	 * @return {object}
	 */
	render: function() {
		var allPolls = this.props.allPolls;
		var pollNodes = [];
		// var polls = allPolls.map(poll => (<li><PollItem key={poll.id} poll={poll}/></li>));

		for (var key in allPolls) {
			// console.log('poll:', allPolls[key]);
			pollNodes.push(
				<Col key={key} xs={12} sm={6} md={6} className=''>
					<PollItem  poll={allPolls[key]} handlePollSelect={this.props.handlePollSelect} />
				</Col>
				);
		}

		if (pollNodes.length == 0) {
			pollNodes.push(
				<Col key={1} xs={12} sm={12} md={12} className=''>
					<div>No polls.</div>
				</Col>
			);
		}

		return (
			// <div id='poll-list'>
			//   <ul id='poll-list'>{polls}</ul>
			// </div>
			<div>
				<div className='poll-container-header'>
					<h2 className='display-inline'>{this.props.header || 'Listing of all polls'}</h2>
				</div>
				<br />
				<Grid>
					<Row className='poll-list'>
						{pollNodes}
					</Row>
				</Grid>
			</div>

		);
	}
});

module.exports = PollList;
