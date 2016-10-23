/*
<AppRoot>/js/components/FullPoll.jsx
*/


import React from 'react';
import {Button, Row, Col, Grid, ButtonToolbar, Modal} from 'react-bootstrap';

// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {AnswerOptionsBox} from './AnswerOptionsBox';
// import AnswerOptionsBox from './AnswerOptionsBox';
import PollChart from './PollChart';
import ReactPropTypes from 'react/lib/ReactPropTypes';


// import React from 'React/addons',
// import addons from 'react-addons';
	// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


function copyToClipboard(elem) {
	// create hidden text element, if it doesn't already exist
	var targetId = '_hiddenCopyText_';
	var isInput = elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA';
	var origSelectionStart, origSelectionEnd;
	if (isInput) {
		// can just use the original source element for the selection and copy
		target = elem;
		origSelectionStart = elem.selectionStart;
		origSelectionEnd = elem.selectionEnd;
	} else {
		// must use a temporary form element for the selection and copy
		target = document.getElementById(targetId);
		if (!target) {
			var target = document.createElement('textarea');
			target.style.position = 'absolute';
			target.style.left = '-9999px';
			target.style.top = '0';
			target.id = targetId;
			document.body.appendChild(target);
		}
		target.textContent = elem.textContent;
	}
	// select the content
	var currentFocus = document.activeElement;
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// copy the selection
	var succeed;
	try {
		succeed = document.execCommand('copy');
	} catch(e) {
		succeed = false;
	}
	// restore original focus
	if (currentFocus && typeof currentFocus.focus === 'function') {
		currentFocus.focus();
	}

	if (isInput) {
		// restore prior selection
		elem.setSelectionRange(origSelectionStart, origSelectionEnd);
	} else {
		// clear temporary content
		target.textContent = '';
	}
	return succeed;
}



var FullPoll = React.createClass({
	propTypes: {
		poll: ReactPropTypes.object.isRequired,
		openDeletePollModal: React.PropTypes.func.isRequired,
		openSharePollModal: React.PropTypes.func.isRequired,
		currentUser: ReactPropTypes.object.isRequired,
		backToPollList: React.PropTypes.func.isRequired,
		handleAddAnswerOption: React.PropTypes.func.isRequired,
		closeModal: React.PropTypes.func.isRequired,
		modalToShow: React.PropTypes.string.isRequired,
		modalMessage: React.PropTypes.string.isRequired,
		new_answer_option: React.PropTypes.string.isRequired,
		deletePollRequest: React.PropTypes.func.isRequired
	},



	mapVotesToAnswerOptions : function () {
		// console.log('in mapVotesToAnswerOptions of FullPoll');
		var answer_options = this.props.poll.answer_options;
		var votes = this.props.poll.votes;
		var answer_option_votes = answer_options.map(() => 0);
		votes.forEach(function(vote) {
			answer_option_votes[vote.answer_option] = (parseInt(answer_option_votes[vote.answer_option]) + 1 || 1);
		});
		return answer_option_votes;
	},



	copyPollURLToClipboard: function() {
	// copyPollURLToClipboard: function(e) {
		copyToClipboard(document.getElementById('poll-URL'));
		this.props.closeModal();
	},

	// handleNewAnswerOptionChange: function(e) {
	// 	var new_answer_option = e.target.value;
	// 	this.setState({new_answer_option: e.target.value, form_feedback: null});
	// },



	render: function() {
		var poll = this.props.poll;
		// console.log('rendering FullPoll');
		// console.log('props in Fullpoll are', this.props);
		var author_label = 'Poll Author: ';
		var question_label = 'Poll Question: ';
		if (this.props.poll == null || this.props.poll == undefined || this.props.poll.id == null) {
			return (
				<div>Currently loading data</div>
			);
		}
		// var currentLocation = this.props.location.pathname;
		// var individual_poll_url = this.props.poll_url + this.props.poll.id;
		// var individual_poll_url = this.props.location.pathname;
		// var individual_poll_url = '/this.props.location.pathname';
		var currentUserIsPollOwner = (this.props.currentUser == null || this.props.currentUser.username == null) ? false : (this.props.currentUser.id == this.props.poll.owner);
		// console.log('\n\n\ncurrentUserIsPollOwner is', currentUserIsPollOwner);
		var host = window.location;
		// var poll_url = host.protocol + '//' + host.hostname + ':' + host.port + individual_poll_url;
		var poll_url = host.href;
		var individual_poll_url = host.href;
		// console.log('host in fullpoll is:', host);
		var sharePollModalBody = <div>URL for Poll: <a href={individual_poll_url} id='poll-URL'>{poll_url}</a></div>;

		var backToPollListButton = (
			<Button
				type='button'
				bsStyle='default'
				onClick={this.props.backToPollList}
				data-toggle='tooltip'
				title='Back to Poll Listing'
				data-placement='bottom'
			>Back To Poll List</Button>
		);
		//{this.props.blah}
		// var sharePollButton = (
		// 	<Button
		// 		type='button'
		// 		bsStyle='info'
		// 		className='share-poll-button'
		// 		data-toggle='tooltip'
		// 		title='Get Link to Poll for sharing'
		// 		data-placement='bottom'
		// 		data-target='#sharePollModal'
		// 	>Share Poll</Button>
		// );

		// var deletePollButtonOld = (
		// 	<Button
		// 		className='delete-poll-link'
		// 		data-toggle='tooltip'
		// 		title={currentUserIsPollOwner ? 'Delete poll' : 'A poll can only be deleted by its owner/creator'}
		// 		data-placement='bottom'
		// 		disabled={currentUserIsPollOwner ? false: true}
		// 		bsStyle='danger'
		// 		data-target='#deletePollModal'
		// 	>Delete Poll</Button>
		// );

		// var deletePollButton = (
		// 	<Button
		// 		className='delete-poll-link'
		// 		data-toggle='tooltip'
		// 			title={currentUserIsPollOwner ? 'Delete poll' : 'A poll can only be deleted by its owner/creator'}
		// 		data-placement='bottom'
		// 		disabled={currentUserIsPollOwner ? false: true}
		// 		bsStyle='danger'
		// 		onClick={this.props.deletePollRequest}
		// 	>Delete</Button>
		// );

		var openDeletePollModalButton = (
			<Button
				data-toggle='tooltip'
				title={(currentUserIsPollOwner || this.props.currentUser.role == 'admin') ? 'Delete poll' : 'A poll can only be deleted by its owner/creator'}
				data-placement='bottom'
				disabled={(currentUserIsPollOwner || this.props.currentUser.role == 'admin') ? false: true}
				bsStyle='danger'
				onClick={this.props.openDeletePollModal}
			>Delete Poll</Button>
		);

		var openSharePollModalButton = (
			<Button
				data-toggle='tooltip'
				title='Get Link to Poll for sharing'
				data-placement='bottom'
				bsStyle='info'
				onClick={this.props.openSharePollModal}
			>Share Poll</Button>
		);

		var answerOptionsBox = (
			<AnswerOptionsBox
				poll_id={this.props.poll.id}
				answer_options={poll.answer_options}
				votes={poll.votes}
				options_are_editable={false}
				handleAddAnswerOption={this.props.handleAddAnswerOption}
				handleVote={this.props.handleVote}
				user={this.props.currentUser}
				mapVotesToAnswerOptions={this.mapVotesToAnswerOptions}
				initial_new_answer_option={this.props.new_answer_option}
				form_feedback={this.props.form_feedback}
			/>
		);

		// {this.props.modalMessage.length > 0 ? this.props.modalMessage : 'Do you wish to delete the current poll?' }

		var deletePollModal = (
			<Modal show={this.props.modalToShow == 'deletepoll'} onHide={this.props.closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>Delete Confirmation</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.props.modalMessage}
					{/*this.props.modalMessage.length > 0 ? this.props.modalMessage : 'Do you wish to delete the current poll?' */}
				</Modal.Body>
				{
					(this.props.modalMessage != 'Do you wish to delete the current poll?')
						?
						<Modal.Footer>
							<Button
								bsStyle='default'
								onClick={this.props.closeModal}
								>Close</Button>
						</Modal.Footer>
						:
						<Modal.Footer>
							<Button
								bsStyle='danger'
								onClick={this.props.deletePollRequest}
							>Delete</Button>
							<Button
								bsStyle='default'
								onClick={this.props.closeModal}
								>Cancel</Button>
						</Modal.Footer>
				}
			</Modal>
		);


		var sharePollModal = (
			<Modal show={this.props.modalToShow == 'sharepoll'} onHide={this.props.closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>Share Poll</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{sharePollModalBody}
				</Modal.Body>
				<Modal.Footer>
					<Button
						bsStyle='primary'
						title='Copy URL to clipboard (not supported on all browsers)'
						onClick={this.copyPollURLToClipboard}
					>Copy to clipboard</Button>
					<Button
						bsStyle='default'
						title='Close this window'
						onClick={this.props.closeModal}
					>Close</Button>
				</Modal.Footer>
			</Modal>
		);

		var dialogModal = (
			<Modal show={this.props.modalToShow == 'dialog'} onHide={this.props.closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>FCC Voting App</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.props.modalMessage}
				</Modal.Body>
				<Modal.Footer>
					<Button
						bsStyle='default'
						title='Close this window'
						onClick={this.props.closeModal}
					>Close</Button>
				</Modal.Footer>
			</Modal>
		);

		return (
			<div className={'full-poll-listing'}>
				{deletePollModal}
				{sharePollModal}
				{dialogModal}


				<Grid>
					<Row >
						<Col xs={6} sm={6} md={9}>
							<h2  className='header-column'>Single Poll Listing</h2>
						</Col>
						<Col xs={6} sm={6} md={3} className=''>
							{backToPollListButton}
						</Col>
					</Row>
				</Grid>
				<br />

				<div className='poll well' id={'poll-' + this.props.poll.id}>
					<Grid>
						<Row >
							<Col xs={12} sm={6} md={6} className='' id='poll-text-div'>
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
								<div>
									{answerOptionsBox}
								</div>
							</Col>
							<Col xs={12} sm={6} md={6} className='' id=''>
								<PollChart poll={this.props.poll}/>
							</Col>
						</Row>
						<Row>
							<Col xs={12} sm={12} md={12}>
								<ButtonToolbar>
									{openSharePollModalButton}
									{openDeletePollModalButton}
								</ButtonToolbar>
							</Col>
						</Row>
					</Grid>
				</div>
				<div>
					{backToPollListButton}
				</div>


			</div>


		);
	}
});

module.exports = FullPoll;
