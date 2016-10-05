/*
<AppRoot>/js/components/FullPoll.jsx
*/


import React from 'react'
import {Button, Row, Col, Grid, ButtonToolbar, Modal} from 'react-bootstrap'
var Router = require('react-router');
var UserStore = require('../stores/UserStore');
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {AnswerOptionsBox} from './AnswerOptionsBox';
var PollStore = require('../stores/PollStore');
// var AnswerOptionsBox = require('./AnswerOptionsBox')
import PollChart from './PollChart';
import PollReChart from './PollReChart';
var PollStore = require('../stores/PollStore');
var PollActionCreators = require('../actions/PollActionCreators');


// var React = require('React/addons'),
// var addons = require('react-addons')
  // var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

// var ReactCSSTransitionGroup =


var getRandomColor = function() {
	// var letters = '0123456789ABCDEF'.split('');
	// var color = '#';
	// for (var i = 0; i < 6; i++ ) {
	// 	color += letters[Math.floor(Math.random() * 16)];
	// }
	var arr = []
	for (var i = 0 ; i < 3; i++) {
		arr.push(Math.floor(Math.random() * 256).toString())
	}
	var color = {backgroundColor: 'rgba(' + arr.join(', ') + ', 0.2)', borderColor: 'rgba(' + arr.join(', ') + ', 1)'}
	return color;
	// rgba(255,99,132,1)
}

function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
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
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
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
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}






export default React.createClass({
  propTypes: {
   // poll: ReactPropTypes.object.isRequired
  },

	getInitialState: function() {
		return { new_answer_option: '', chart: null, form_feedback: null, poll: PollStore.getPollById(this.props.params.poll_id), currentUser: this.getCurrentUser(), showDeletePollModal: false, showSharePollModal: false }
	},
	mapVotesToAnswerOptions : function (votes) {
		console.log("in mapVotesToAnswerOptions")
		var answer_option_votes = this.state.poll.answer_options.map(answer_option => 0);
		votes.forEach(function(vote) {
			// console.log
			answer_option_votes[vote.answer_option] = (parseInt(answer_option_votes[vote.answer_option]) + 1 || 1)
		});
		return answer_option_votes
	},
	backToPollList: function() {
		Router.browserHistory.push('/polls');

	},
	handleVote: function(data) {
		console.log("in FullPoll handleVote. Props are" , this.props, ", data is ", data)
		var vote = data;
		vote.poll_id  = this.state.poll.id
		console.log("vote is now", vote)
		var callback = function(vote) {
			console.log("in handleVote callback. vote is ", vote)
			// this.updateChartWithVote(vote);
		}.bind(this)

		// fire action to submit vote to server. Will control through PollActionCreators/Store
		// this.props.handleVote(vote, callback)
	},

	renderChart : function() {

	},
	updateChartWithVote: function() {
		// hints for updating a chart rather than  simply rerendering at
		// http://jsbin.com/bigecinuhu/edit?html,css,js,output

		// var indexToUpdate = vote.index

	},
	updateChartWithNewAnswerOption: function() {


	},

  componentDidMount: function() {
    UserStore.addChangeListener(this._onUserChange);
		PollStore.addChangeListener(this._onPollChange);
		PollStore.addDestroyListener(this._onPollDestroy);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onUserChange);
    PollStore.removeChangeListener(this._onPollChange);
		PollStore.removeDestroyListener(this._onPollDestroy);
  },

	handleAddAnswerOption: function() {
		console.log('in fullpoll "handleAddAnswerOption"')
		var poll_id = this.state.poll.id
		var new_answer_option = this.state.new_answer_option.trim()
		var poll = this.state.poll
		console.log('\n\n\n\ncurrentUser is ', this.state.currentUser)
		if (this.state.currentUser == null || this.state.currentUser == undefined || this.state.currentUser.username == null) {
			console.log("User must be authenticated in order to add answer option.")
			this.setState({form_feedback: {message: 'User must be authenticated in order to add answer option.'}})

		}
		else if (new_answer_option == '' || new_answer_option == null) {
			console.log("Error. A new answer option should not be blank in an existing poll.")
			this.setState({form_feedback: {message: 'A new answer option should not be blank in an existing poll.'}})

		}
		else if (poll.answer_options.filter(option => option == new_answer_option).length > 0 ) {
			console.log("Error. The new answer option should not match any existing answer option.")
			// this.setState({form_feedback: {message: 'The new answer option should not match any existing answer options.'}})
			this.setState({form_feedback: {message: 'Answer Option already exists!'}})
		}
		else {
			var new_option = {poll_id: poll_id, new_answer_option: new_answer_option, user_name: this.state.currentUser.username}
			//fire action
			PollActionCreators.addAnswerOption(poll_id, new_answer_option);
		}

	},
	copyPollURLToClipboard: function(e) {
		copyToClipboard(document.getElementById("poll-URL"));
	},

	handleNewAnswerOptionChange: function(e) {
		var new_answer_option = e.target.value
		this.setState({new_answer_option: e.target.value, form_feedback: null})
	},

	deletePollRequest: function() {
		console.log("in deletePollRequest of FullPoll");
		if (this.state.poll != null) {
			var poll_id = this.state.poll.id;
			PollActionCreators.destroy(poll_id);
		}
	},

	closeDeletePollModal: function() {
		console.log('closing deletePollModal')
		this.setState({ showDeletePollModal: false });
	},

	openDeletePollModal:function() {
		console.log('opening deletePollModal')
		this.setState({ showDeletePollModal: true });
	},


	closeSharePollModal: function() {
		console.log('closing sharePollModal')
		this.setState({ showSharePollModal: false });
	},

	openSharePollModal:function() {
		console.log('opening sharePollModal')
		this.setState({ showSharePollModal: true });
	},

	render: function() {
		// var pollname = this.props.params.pollName;
		// var poll = PollStore.getPollById(this.props.params.poll_id);
		var poll = this.state.poll;

		console.log('rendering FullPoll')
		var author_label = "Poll Author: "
		var question_label = "Poll Question: "
		if (this.state.poll == null || this.state.poll == undefined) {
			return (
				<div>Currently loading data</div>
			)
		}
		// var currentLocation = this.props.location.pathname
		// var individual_poll_url = this.state.poll_url + this.state.poll.id
		var individual_poll_url = this.props.location.pathname
		var currentUserIsPollOwner = (this.state.currentUser == null || this.state.currentUser.username == null) ? false : (this.state.currentUser.id == this.state.poll.owner)
		console.log('\n\n\ncurrentUserIsPollOwner is', currentUserIsPollOwner)
		var host = window.location;
		var poll_url = host.protocol + '//' + host.hostname + ':' + host.port + individual_poll_url
		var sharePollModalBody = <div>URL for Poll: <a href={individual_poll_url} id=' '>{poll_url}</a></div>

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
				title={(currentUserIsPollOwner || this.state.currentUser.role == "admin") ? 'Delete poll' : 'A poll can only be deleted by its owner/creator'}
				data-placement='bottom'
				disabled={(currentUserIsPollOwner || this.state.currentUser.role == "admin") ? false: true}
				bsStyle='danger'
				onClick={this.openDeletePollModal}
			>Delete Poll</Button>
		)

		var openSharePollModalButton = (
			<Button
				data-toggle='tooltip'
				title="Get Link to Poll for sharing"
				data-placement='bottom'
				bsStyle='info'
				onClick={this.openSharePollModal}
			>Share Poll</Button>
		)

		var answerOptionsBox = (
			<AnswerOptionsBox
				poll_id={this.state.poll.id}
				answer_options={poll.answer_options}
				votes={poll.votes}
				options_are_editable={false}
				handleAddAnswerOption={this.handleAddAnswerOption}
				handleVote={this.handleVote}
				handleNewAnswerOptionChange={this.handleNewAnswerOptionChange}
				new_answer_option={this.state.new_answer_option}
				user={this.state.currentUser}
				mapVotesToAnswerOptions={this.mapVotesToAnswerOptions}
				form_feedback={this.state.form_feedback}
			/>
		);


		var deletePollModal = (
			<Modal show={this.state.showDeletePollModal} onHide={this.closeDeletePollModal}>
				<Modal.Header closeButton>
					<Modal.Title>Delete Confirmation</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Do you wish to delete the current poll?
				</Modal.Body>
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
			</Modal>
		)


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
						onClick={this.copyPollURLToClipboard}
					>Copy to clipboard</Button>
					<Button
						bsStyle='default'
						onClick={this.closeSharePollModal}
					>Close</Button>
				</Modal.Footer>
			</Modal>
		)

		return (
			<div className={'fullPollListing'}>
				{deletePollModal}
				{sharePollModal}
				<ReactCSSTransitionGroup transitionName="example1" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
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
							<Row className='hidden-overflow'>
								<Col xs={12} sm={6} md={6} className='' id='poll-text-div'>
									<div className='pollAuthor'>
										{author_label}
										<span className='pollAuthor'>
											{poll.author}
										</span>
									</div>
									<div>
										{question_label}
										<span className='pollQuestion'>
											{poll.question}
										</span>
									</div>
									<div>
										{answerOptionsBox}
									</div>
								</Col>
								<Col xs={12} sm={6} md={6} className='' id='poll-chart-div'>
									<PollReChart poll={this.state.poll}  />
								</Col>
							</Row>
						</Grid>
						<br />
						<Row>
							<Col xs={12} sm={6} md={6}>
								<ButtonToolbar>
									{openSharePollModalButton}
									{openDeletePollModalButton}
								</ButtonToolbar>
							</Col>
						</Row>
						{/*<div><Button type='button' data-toggle='tooltip' title='Back to Poll Listing' data-placement='bottom' bsStyle='default' onClick={this.backToPollList}>Back To Poll List</Button>
							<span className='delete_poll_link' data-toggle='tooltip' title={currentUserIsPollOwner ? 'Delete poll' : 'A poll can only be deleted by its owner/creator'} data-placement='bottom'><Button disabled={currentUserIsPollOwner ? false: true} bsStyle='danger' data-target='#deletePollModal'>Delete Poll</Button></span>
						</div>*/}
						{/*<Button type='button' bsStyle='info' className='share_poll_button' data-toggle='tooltip' title='Get Link to Poll for sharing' data-placement='bottom' data-target='#sharePollModal'>Share Poll</Button>*/}
					</div>
					<div>
						{backToPollListButton}
						{/*<span className='delete_poll_link' data-toggle='tooltip' title={currentUserIsPollOwner ? 'Delete poll' : 'A poll can only be deleted by its owner/creator'} data-placement='bottom'><Button disabled={currentUserIsPollOwner ? false: true} bsStyle='danger' data-target='#deletePollModal'>Delete Poll</Button></span> */}
					</div>

				</ReactCSSTransitionGroup>

			</div>


		)

	},

	getCurrentUser: function() {
		return UserStore.getAuthenticatedUser();
	},

	_onUserChange: function() {
		this.setState({currentUser: UserStore.getAuthenticatedUser()})
	},

	_onPollChange: function() {
		console.log("received notification of poll update from  PollStore");
		var poll = PollStore.getPollById(this.props.params.poll_id);
		var newState = {poll: poll}
		if (poll != null) {
			if (poll.answer_options[poll.answer_options.length - 1] == this.state.new_answer_option) {
				//new_answer_option has been properly added to the poll.
				newState.new_answer_option = '';
				newState.form_feedback = null;
			}
			this.setState(newState);
		}

	},

	_onPollDestroy: function(poll_id) {
		console.log("received notification of poll destroy from  PollStore");
		if (this.state.poll == null || this.state.poll.id == poll_id) {
			// console.log("poll_id == this.state.poll.id: ", poll_id == this.state.poll.id)
			//the poll was just deleted. redirect to /polls
			//in future, would like to add notification or popup showing poll was deleted succesfully before redirect.
			this.backToPollList();
		}
	}
})