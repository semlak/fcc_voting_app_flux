/*
<AppRoot>/js/components/FullPoll.jsx
*/


import React from 'react';
import {Button, Row, Col, Grid, ButtonToolbar, Modal} from 'react-bootstrap';
import {browserHistory} from 'react-router';
import UserStore from '../stores/UserStore';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {AnswerOptionsBox} from './AnswerOptionsBox';
import PollStore from '../stores/PollStore';
// import AnswerOptionsBox from './AnswerOptionsBox';
import PollChart from './PollChart';
import PollActionCreators from '../actions/PollActionCreators';
// import ReactPropTypes from 'react/lib/ReactPropTypes';


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



export default React.createClass({
	propTypes: {
		// poll: ReactPropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			new_answer_option: '',
			form_feedback: null,
			poll: PollStore.getPollById(this.props.poll_id),
			currentUser: this.getCurrentUser(),
			showDeletePollModal: false,
			deletePollModalMessage: '',
			dialogModalMessage: '',
			showDialogModal: false,
			showSharePollModal: false
		};
	},
	mapVotesToAnswerOptions : function (votes) {
		// console.log('in mapVotesToAnswerOptions of FullPoll');
		var answer_option_votes = this.state.poll.answer_options.map(() => 0);
		votes.forEach(function(vote) {
			answer_option_votes[vote.answer_option] = (parseInt(answer_option_votes[vote.answer_option]) + 1 || 1);
		});
		return answer_option_votes;
	},

	backToPollList: function() {
		browserHistory.push('/polls');

	},

	componentDidMount: function() {
		UserStore.addAuthenticationChangeListener(this._onAuthenticationChange);
		PollStore.addChangeListener(this._onPollChange);
		PollStore.addDestroyListener(this._onPollDestroy);
		PollStore.addVoteCreatedListener(this._onVoteCreate);
	},

	componentWillUnmount: function() {
		UserStore.removeAuthenticationChangeListener(this._onAuthenticationChange);
		PollStore.removeChangeListener(this._onPollChange);
		PollStore.removeDestroyListener(this._onPollDestroy);
		PollStore.removeVoteCreatedListener(this._onVoteCreate);
	},

	handleAddAnswerOption: function(new_answer_option_from_answer_option_box) {
		// console.log('in fullpoll 'handleAddAnswerOption'');
		var poll_id = this.state.poll.id;
		var new_answer_option = new_answer_option_from_answer_option_box.trim();
		var poll = this.state.poll;
		// console.log('\n\n\n\ncurrentUser is ', this.state.currentUser);
		if (this.state.currentUser == null || this.state.currentUser == undefined || this.state.currentUser.username == null) {
			// console.log('User must be authenticated in order to add answer option.');
			this.setState({form_feedback: {message: 'User must be authenticated in order to add answer option.'}});

		}
		else if (new_answer_option == '' || new_answer_option == null) {
			// console.log('Error. A new answer option should not be blank in an existing poll.');
			this.setState({form_feedback: {message: 'A new answer option should not be blank in an existing poll.'}});

		}
		else if (poll.answer_options.filter(option => option == new_answer_option).length > 0 ) {
			// console.log('Error. The new answer option should not match any existing answer option.');
			// this.setState({form_feedback: {message: 'The new answer option should not match any existing answer options.'}});
			this.setState({form_feedback: {message: 'Answer Option already exists!'}});
		}
		else {
			//fire action
			PollActionCreators.addAnswerOption(poll_id, new_answer_option);
			//would like to user listener or something to handle feedback here. Client attemps to validate the input, but server might reject for some reason.
			this.setState({form_feedback: null});
		}
	},

	copyPollURLToClipboard: function() {
	// copyPollURLToClipboard: function(e) {
		copyToClipboard(document.getElementById('poll-URL'));
		this.setState({showSharePollModal: false});
	},

	// handleNewAnswerOptionChange: function(e) {
	// 	var new_answer_option = e.target.value;
	// 	this.setState({new_answer_option: e.target.value, form_feedback: null});
	// },

	deletePollRequest: function() {
		// console.log('in deletePollRequest of FullPoll');
		if (this.state.poll != null) {
			var poll_id = this.state.poll.id;
			PollActionCreators.destroy(poll_id);
		}
	},

	closeDeletePollModal: function() {
		// console.log('closing deletePollModal');
		this.setState({ showDeletePollModal: false });
		this.setState({ deletePollModalMessage: '' });
	},

	openDeletePollModal:function() {
		// console.log('opening deletePollModal');
		this.setState({ showDeletePollModal: true });
	},


	closeSharePollModal: function() {
		// console.log('closing sharePollModal');
		this.setState({ showSharePollModal: false });
	},

	openSharePollModal:function() {
		// console.log('opening sharePollModal');
		this.setState({ showSharePollModal: true });
	},

	closeDialogModal: function() {
		// console.log('closing dialogModal');
		this.setState({ showDialogModal: false });
	},

	openDialogModal:function() {
		// console.log('opening dialogModal');
		this.setState({ showDialogModal: true });
	},

	render: function() {
		// var poll = PollStore.getPollById(this.props.poll_id);
		var poll = this.state.poll;

		// console.log('rendering FullPoll');
		var author_label = 'Poll Author: ';
		var question_label = 'Poll Question: ';
		if (this.state.poll == null || this.state.poll == undefined) {
			return (
				<div>Currently loading data</div>
			);
		}
		// var currentLocation = this.props.location.pathname;
		// var individual_poll_url = this.state.poll_url + this.state.poll.id;
		// var individual_poll_url = this.props.location.pathname;
		var individual_poll_url = 'this.props.location.pathname';
		var currentUserIsPollOwner = (this.state.currentUser == null || this.state.currentUser.username == null) ? false : (this.state.currentUser.id == this.state.poll.owner);
		// console.log('\n\n\ncurrentUserIsPollOwner is', currentUserIsPollOwner);
		var host = window.location;
		var poll_url = host.protocol + '//' + host.hostname + ':' + host.port + individual_poll_url;
		var sharePollModalBody = <div>URL for Poll: <a href={individual_poll_url} id='poll-URL'>{poll_url}</a></div>;

		var backToPollListButton = (
			<Button
				type='button'
				bsStyle='default'
				onClick={this.backToPollList}
				data-toggle='tooltip'
				title='Back to Poll Listing'
				data-placement='bottom'
			>Back To Poll List</Button>
		);
		// var sharePollButton = (
		// 	<Button
		// 		type='button'
		// 		bsStyle='info'
		// 		className='share_poll_button'
		// 		data-toggle='tooltip'
		// 		title='Get Link to Poll for sharing'
		// 		data-placement='bottom'
		// 		data-target='#sharePollModal'
		// 	>Share Poll</Button>
		// );

		// var deletePollButtonOld = (
		// 	<Button
		// 		className='delete_poll_link'
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
		// 		className='delete_poll_link'
		// 		data-toggle='tooltip'
		// 		title={currentUserIsPollOwner ? 'Delete poll' : 'A poll can only be deleted by its owner/creator'}
		// 		data-placement='bottom'
		// 		disabled={currentUserIsPollOwner ? false: true}
		// 		bsStyle='danger'
		// 		onClick={this.deletePollRequest}
		// 	>Delete</Button>
		// );

		var openDeletePollModalButton = (
			<Button
				data-toggle='tooltip'
				title={(currentUserIsPollOwner || this.state.currentUser.role == 'admin') ? 'Delete poll' : 'A poll can only be deleted by its owner/creator'}
				data-placement='bottom'
				disabled={(currentUserIsPollOwner || this.state.currentUser.role == 'admin') ? false: true}
				bsStyle='danger'
				onClick={this.openDeletePollModal}
			>Delete Poll</Button>
		);

		var openSharePollModalButton = (
			<Button
				data-toggle='tooltip'
				title='Get Link to Poll for sharing'
				data-placement='bottom'
				bsStyle='info'
				onClick={this.openSharePollModal}
			>Share Poll</Button>
		);

		var answerOptionsBox = (
			<AnswerOptionsBox
				poll_id={this.state.poll.id}
				answer_options={poll.answer_options}
				votes={poll.votes}
				options_are_editable={false}
				handleAddAnswerOption={this.handleAddAnswerOption}
				handleVote={this.handleVote}
				user={this.state.currentUser}
				mapVotesToAnswerOptions={this.mapVotesToAnswerOptions}
				initial_new_answer_option={this.state.new_answer_option}
				form_feedback={this.state.form_feedback}
			/>
		);


		var deletePollModal = (
			<Modal show={this.state.showDeletePollModal} onHide={this.closeDeletePollModal}>
				<Modal.Header closeButton>
					<Modal.Title>Delete Confirmation</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.state.deletePollModalMessage.length > 0 ? this.state.deletePollModalMessage : 'Do you wish to delete the current poll?' }
				</Modal.Body>
				{
					(this.state.deletePollModalMessage.length > 0)
						?
						<Modal.Footer>
							<Button
								bsStyle='default'
								onClick={this.closeDeletePollModal}
								>Close</Button>
						</Modal.Footer>
						:
						<Modal.Footer>
							<Button
								bsStyle='danger'
								onClick={this.deletePollRequest}
							>Delete</Button>
							<Button
								bsStyle='default'
								onClick={this.closeDeletePollModal}
								>Cancel</Button>
						</Modal.Footer>
				}
			</Modal>
		);


		var sharePollModal = (
			<Modal show={this.state.showSharePollModal} onHide={this.closeSharePollModal}>
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
						onClick={this.closeSharePollModal}
					>Close</Button>
				</Modal.Footer>
			</Modal>
		);

		var dialogModal = (
			<Modal show={this.state.showDialogModal} onHide={this.closeDialogModal}>
				<Modal.Header closeButton>
					<Modal.Title>FCC Voting App</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.state.dialogModalMessage}
				</Modal.Body>
				<Modal.Footer>
					<Button
						bsStyle='default'
						title='Close this window'
						onClick={this.closeDialogModal}
					>Close</Button>
				</Modal.Footer>
			</Modal>
		);

		return (
			<div className={'fullPollListing'}>
				{deletePollModal}
				{sharePollModal}
				{dialogModal}
				<ReactCSSTransitionGroup transitionName='example1' transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
					<Grid>
						<Row >
							<Col xs={6} sm={6} md={9}>
								<h2  className='headerColumn'>Single Poll Listing</h2>
							</Col>
							<Col xs={6} sm={6} md={3} className=''>
								{backToPollListButton}
							</Col>
						</Row>
					</Grid>
					<br />

					<div className='poll well' id={'poll_' + this.state.poll.id}>
						<Grid>
							<Row >
								<Col xs={12} sm={6} md={6} className='' id='poll-text-div'>
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
									<div>
										{answerOptionsBox}
									</div>
								</Col>
								<Col xs={12} sm={6} md={6} className='' id=''>
									<PollChart poll={this.state.poll}/>
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

				</ReactCSSTransitionGroup>

			</div>


		);

	},

	getCurrentUser: function() {
		return UserStore.getAuthenticatedUser();
	},

	_onAuthenticationChange: function() {
		this.setState({currentUser: UserStore.getAuthenticatedUser()});
	},

	_onPollChange: function() {
		/*
			As long as the poll is not null, the state is updated with the poll's freshest data.
			We attempt to verify that the poll's answer_options array now contains the new_answer_option. If so, we reset new_answer_option.
		*/
		// console.log('in _onPollChange of FullPoll, received notification of poll update from  PollStore');
		var poll = PollStore.getPollById(this.props.poll_id);
		var newState = {};
		newState.poll = poll;
		if (poll != null && poll != undefined) {
			if (poll.answer_options[poll.answer_options.length - 1] == this.state.new_answer_option) {
				//new_answer_option has been properly added to the poll.
				newState.new_answer_option = '';
				newState.form_feedback = null;
			} else if (poll.answer_options.indexOf(this.state.new_answer_option) >= 0) {
				//Presumably, the answer option submitted was added to the poll but is just not the last answer_option on the updated poll.
				//(Possible due to multiple users submitting new answer_options.)
				newState.new_answer_option = '';
				newState.form_feedback = null;
			}
			this.setState(newState);
		}
	},

	_onPollDestroy: function(poll_id, success) {
		// console.log('received notification of possible poll destroy from  PollStore');
		if (this.state.poll == null || this.state.poll.id == poll_id) {
			// console.log('poll_id == this.state.poll.id: ', poll_id == this.state.poll.id);
			if (success) {
				//the poll was just deleted. redirect to /polls
				//in future, would like to add notification or popup showing poll was deleted succesfully before redirect.
				this.backToPollList();
			}
			else {
				//the poll was attempted to be deleted, but this somehow failed. Print message.
				this.setState({deletePollModalMessage: 'Failed to delete poll.'});

			}
		}
	},


	_onVoteCreate: function(poll_id, success, message) {
		// console.log('received notification of possible vote creation from  PollStore');
		if (this.state.poll == null || this.state.poll.id == poll_id) {
			// console.log('poll_id == this.state.poll.id: ', poll_id == this.state.poll.id);
			if (success) {
				//the vote was a success
				//the store should have updated the polls and _onPollChange will handle updating of poll
			}
			else {
				//the poll was attempted to be deleted, but this somehow failed. Print message.
				this.setState({
					dialogModalMessage: (message.length != null ? message : 'Vote failed.'),
					showDialogModal: true,
					showSharePollModal: false,
					showDeletePollModal: false
				});
			}
		}
	}
});