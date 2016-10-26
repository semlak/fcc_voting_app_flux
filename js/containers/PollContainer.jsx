'use strict';


/**
PollContainer.jsx
 */

/**
 * This component operates as a 'Controller-View'.  It listens for changes in
 * the PollStore and passes the new data to its children. It will render either a PollList or FullPoll as its child element.
 */

import React from 'react';
import {browserHistory} from 'react-router';
import PollList from '../components/PollList';
import FullPoll from '../components/FullPoll';

import PollStore from '../stores/PollStore';
import PollActionCreators from '../actions/PollActionCreators';

import UserStore from '../stores/UserStore';

import ModalStore from '../stores/ModalStore';
import ModalActionCreators from '../actions/ModalActionCreators';

// import ReactPropTypes from 'react/lib/ReactPropTypes';


function filterPollsByOwner(polls, owner_username) {
	var owner = UserStore.getUserByUsername(owner_username);
	var owner_id = typeof owner == 'object' ? owner.id : '';

	var filteredPolls = {};
	Object.keys(polls).forEach(function(poll_id) {
		if (polls[poll_id].owner.toString() == owner_id.toString()) {
			filteredPolls[poll_id] = polls[poll_id];
		}
	});
	return filteredPolls;
}

/**
 * Retrieve the current POLL data from the PollStore
 */
function getPollState() {
	return {
		allPolls: PollStore.getAll()
		// areAllComplete: PollStore.areAllComplete()
	};
}

export default React.createClass({

	getInitialState: function() {
		var pollState = getPollState();
		var currentUser = UserStore.getAuthenticatedUser();
		// var modalToShow = PollStore.getModalToShow();
		var modalToShow = ModalStore.getModalToShow();
		// other options: 'dialog', 'sharepoll', 'deletepoll'
		var modalMessage = ModalStore.getModalMessage();
		var new_answer_option = '';

		return Object.assign({}, pollState, {modalToShow: modalToShow, modalMessage: modalMessage, currentUser: currentUser, new_answer_option: new_answer_option});
	},


	componentDidMount: function() {
		// PollStore.addChangeListener(this._onChange);
		UserStore.addAuthenticationChangeListener(this._onAuthenticationChange);
		PollStore.addChangeListener(this._onPollChange);
		PollStore.addDestroyListener(this._onPollDestroy);
		// PollStore.addVoteCreatedListener(this._onVoteCreate);
		ModalStore.addChangeListener(this._onModalChange);
	},

	componentWillUnmount: function() {
		// PollStore.removeChangeListener(this._onChange);
		UserStore.removeAuthenticationChangeListener(this._onAuthenticationChange);
		PollStore.removeChangeListener(this._onPollChange);
		PollStore.removeDestroyListener(this._onPollDestroy);
		// PollStore.removeVoteCreatedListener(this._onVoteCreate);
		ModalStore.removeChangeListener(this._onModalChange);
	},

	handlePollSelect: function(poll_id) {
		browserHistory.push('/polls/' + poll_id);
	},

	backToPollList: function() {
		browserHistory.push('/polls');

	},

	// componentDidMount: function() {
	// 	UserStore.addAuthenticationChangeListener(this._onAuthenticationChange);
	// 	PollStore.addChangeListener(this._onPollChange);
	// 	PollStore.addDestroyListener(this._onPollDestroy);
	// 	PollStore.addVoteCreatedListener(this._onVoteCreate);
	// },

	// componentWillUnmount: function() {
	// 	UserStore.removeAuthenticationChangeListener(this._onAuthenticationChange);
	// 	PollStore.removeChangeListener(this._onPollChange);
	// 	PollStore.removeDestroyListener(this._onPollDestroy);
	// 	PollStore.removeVoteCreatedListener(this._onVoteCreate);
	// },




	handleAddAnswerOption: function(new_answer_option_from_answer_option_box) {
		// console.log('in fullpoll 'handleAddAnswerOption'');
		var poll_id = this.props.params.poll_id;
		var new_answer_option = new_answer_option_from_answer_option_box.trim();
		var poll = PollStore.getPollById(this.props.params.poll_id);
		var currentUser = UserStore.getAuthenticatedUser();
		// console.log('\n\n\n\ncurrentUser is ', currentUser);
		if (currentUser == null || currentUser == undefined || currentUser.username == null) {
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

	deletePollRequest: function() {
		console.log('in deletePollRequest of FullPoll');
		var poll_id = this.props.params != null ? this.props.params.poll_id : null;
		if (poll_id != null) {
			PollActionCreators.destroy(poll_id);
		}
	},

	closeModal: function() {
	//Closed all modals.
		ModalActionCreators.close();
	},


	// closeSharePollModal: function() {
	// 	ModalActionCreators.close();
	// 	// console.log('closing sharePollModal');
	// },
	// closeDialogModal: function() {
	// 	ModalActionCreators.close();
	// 	// console.log('closing dialogModal');
	// },
	// closeDeletePollModal: function() {
	// 	ModalActionCreators.close();
	// 	// console.log('closing deletePollModal');
	// },



	openDeletePollModal:function() {
		console.log('firing action to open deletePollModal');
		ModalActionCreators.open('deletepoll', 'Do you wish to delete the current poll?');
	},


	openSharePollModal:function() {
		console.log('firing action to open sharePollModal');
		ModalActionCreators.open('sharepoll', 'URL for poll: blah');
	},


	openDialogModal:function() {
		console.log('firiing action to open dialogModal');
		ModalActionCreators.open('dialog', 'Vote failed?  NEED TO FIX THIS');
	},

	renderPollList: function() {
		var pollsToRender;
		if (this.props.params && this.props.params.userPollsToRender && this.props.params.userPollsToRender != null) {
			pollsToRender = filterPollsByOwner(this.state.allPolls, this.props.params.userPollsToRender);
		}
		else {
			pollsToRender = this.state.allPolls;
		}
		// console.log('polls to render are ', pollsToRender);
		var pollListHeader = this.props.params == null || this.props.params.userPollsToRender == null ? 'Listing of All Polls:' : 'Listing of ' + this.props.params.userPollsToRender + '\'s Polls:';
		return (
				<div id='pollapp'  className='poll-container'>
					<PollList allPolls={pollsToRender} header={pollListHeader} handlePollSelect={this.handlePollSelect} />
				</div>
		);
	},

	renderSingleFullPoll: function() {
	// getInitialState: function() {
	// 	return {
	// 		new_answer_option: '',
	// 		form_feedback: null,
	// 		deletePollModalMessage: '',
	// 		dialogModalMessage: '',

	// 		poll: PollStore.getPollById(this.props.poll_id),
	// 		currentUser: this.getCurrentUser(),
	// 		showDeletePollModal: false,
	// 		showDialogModal: false,
	// 		showSharePollModal: false

	// 	};
	// },



		//var poll_id = this.props.params.poll_id;
		var poll = PollStore.getPollById(this.props.params.poll_id) || {};
		var currentUser = this.state.currentUser;
		var modalToShow = this.state.modalToShow;
		var modalMessage = this.state.modalMessage;
		var new_answer_option = this.state.new_answer_option;

		return (
			<FullPoll
				poll={poll}
				currentUser={currentUser}
				modalToShow={modalToShow}
				modalMessage={modalMessage}
				new_answer_option={new_answer_option}
				backToPollList={this.backToPollList}
				handleAddAnswerOption={this.handleAddAnswerOption}
				openDeletePollModal={this.openDeletePollModal}
				openSharePollModal={this.openSharePollModal}
				closeModal={this.closeModal}
				deletePollRequest={this.deletePollRequest}
			/>
		);
	},


	render: function() {
		// console.log('rendering PollContainer, props are', this.props, ', allPolls are', this.state.allPolls);
		// console.log('props:', this.props);
		if (this.props.params != null && this.props.params.poll_id != null) {
			return this.renderSingleFullPoll();
		}
		else {
			return this.renderPollList();
		}
	},

	getCurrentUser: function() {
		return UserStore.getAuthenticatedUser();
	},

	_onAuthenticationChange: function() {
		this.setState({currentUser: UserStore.getAuthenticatedUser()});
	},






	/**
	 * Event handler for 'change' events coming from the PollStore
	 */
	_onPollChange: function() {
		// console.log('received CHANGE signal for poll in PollContainer. Updating state with allPolls.');
		this.setState(getPollState());
		//should also update modal states, unless I handle those with a separate event
	},



	/**
	 * Event handler for 'change' events coming from the ModalStore
	 */
	_onModalChange: function() {
		// console.log('received CHANGE signal for poll in PollContainer. Updating state with allPolls.');
		var modalToShow = ModalStore.getModalToShow();
		var modalMessage = ModalStore.getModalMessage();
		this.setState({modalToShow: modalToShow, modalMessage: modalMessage});
		//should also update modal states, unless I handle those with a separate event
	},

	// _onPollChange: function() {
	// 	/*
	// 		As long as the poll is not null, the state is updated with the poll's freshest data.
	// 		We attempt to verify that the poll's answer_options array now contains the new_answer_option. If so, we reset new_answer_option.
	// 	*/
	// 	// console.log('in _onPollChange of FullPoll, received notification of poll update from  PollStore');
	// 	var poll = PollStore.getPollById(this.props.poll_id);
	// 	var newState = {};
	// 	newState.poll = poll;
	// 	if (poll != null && poll != undefined) {
	// 		if (poll.answer_options[poll.answer_options.length - 1] == this.state.new_answer_option) {
	// 			//new_answer_option has been properly added to the poll.
	// 			newState.new_answer_option = '';
	// 			newState.form_feedback = null;
	// 		} else if (poll.answer_options.indexOf(this.state.new_answer_option) >= 0) {
	// 			//Presumably, the answer option submitted was added to the poll but is just not the last answer_option on the updated poll.
	// 			//(Possible due to multiple users submitting new answer_options.)
	// 			newState.new_answer_option = '';
	// 			newState.form_feedback = null;
	// 		}
	// 		this.setState(newState);
	// 	}
	// }

	_onPollDestroy: function(poll_id, success) {
		// console.log('received notification of possible poll destroy from  PollStore');
		var currentPollId = this.props.params != null ? this.props.params.poll_id : null;
		if (currentPollId ==  poll_id) {
			// console.log('poll_id == this.state.poll.id: ', poll_id == this.state.poll.id);
			if (success) {
				//the poll was just deleted. redirect to /polls
				//in future, would like to add notification or popup showing poll was deleted succesfully before redirect.
				this.backToPollList();
			}
			else {
				//the poll was attempted to be deleted, but this somehow failed. Print message.
				ModalActionCreators.open('deletepoll', 'Failed to delete poll.');
			}
		}
	},


	_onVoteCreate: function(poll_id, success, message) {
		// console.log('received notification of possible vote creation from  PollStore');
		var currentPollId = this.props.params != null ? this.props.params.poll_id : null;

		if (currentPollId == poll_id) {
			// console.log('poll_id == this.state.poll.id: ', poll_id == this.state.poll.id);
			if (success) {
				//the vote was a success
				//the store should have updated the polls and _onPollChange will handle updating of poll
			}
			else {
				//the poll was attempted to be deleted, but this somehow failed. Print message.
				// this.setState({
				// 	dialogModalMessage: (message.length != null ? message : 'Vote failed.'),
				// 	modalToShow: 'dialog'
				// });
				let action_message = message != null ? message : 'Vote failed.';
				ModalActionCreators.open('dialog', action_message);
			}
		}
	}

});
