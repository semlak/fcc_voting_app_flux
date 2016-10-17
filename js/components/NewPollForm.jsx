/*
NewPollForm.jsx component.
Does not receive any props. I might change this if I have to create a container for NewPollForm to be a child of.
*/


import React from 'react'
import {Button, Form, FormGroup, FormControl, Checkbox, Col, ControlLabel, HelpBlock} from 'react-bootstrap'
import {browserHistory} from 'react-router';
import UserStore from '../stores/UserStore';
import PollStore from '../stores/PollStore';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {AnswerOptionsBox, AnswerOptionsList, NewAnswerOptionForm} from './AnswerOptionsBox';
import PollActionCreators from '../actions/PollActionCreators';
// import ReactPropTypes from 'react/lib/ReactPropTypes';



var eliminateArrayDuplicates = function(arr) {
// http://stackoverflow.com/questions/840781/easiest-way-to-find-duplicate-values-in-a-javascript-array

  var i,
      len=arr.length,
      out=[],
      obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

export default React.createClass({
  // propTypes: {
  //  // poll: ReactPropTypes.object.isRequired
  // },

	getInitialState: function() {
		// console.log("in 'getInitialState' for <NewPollForm /> ")
		// this just sets a default author value, but the user can change it (it does not have to match account data)
		var currentUser = UserStore.getAuthenticatedUser();
		var author = currentUser.fullname || currentUser.username || '';
		// console.log("author is ", author);
		return {
			currentUser: currentUser,
			author: author,
			question: '',
			answer_options: [],
			votes: [],
			// the votes parameter is not really used in the pollForm, but having this empty array avoids issue in AnswerOptionsBox
			authorField: {},
			questionField: {},
			answerOptionsField: {},
			initial_new_answer_option: ''
		};
	},
	handleAuthorChange: function(e) {
		var newAuthorField = {validationState: null, validationMessage: null}
		this.setState({author: e.target.value, authorField: newAuthorField});
	},
	handleQuestionChange: function(e) {
		var newQuestionField = {validationState: null, validationMessage: null}
		this.setState({question: e.target.value, questionField: newQuestionField})
	},
	handleAddAnswerOption: function(new_answer_option_from_answer_option_box) {
		// console.log("in 'handleAddAnswerOption' of pollForm, e.target.value is", e.target.value)
		// e.preventDefault()
		// this.setState({answer_options: options.filter(option => (option != '' && option != null))})
		var updated_answer_options = this.state.answer_options
		updated_answer_options.push(new_answer_option_from_answer_option_box)
		// console.log("updated_answer_options are", updated_answer_options)
		var answerOptionsField = {validationState: null, validationMessage: null}
		this.setState({answer_options: updated_answer_options, form_feedback: null, answerOptionsField: answerOptionsField})
	},

  componentDidMount: function() {
    UserStore.addAuthenticationChangeListener(this._onAuthenticationChange);
		PollStore.addCreatedListener(this._onPollCreated);
  },

  componentWillUnmount: function() {
    UserStore.removeAuthenticationChangeListener(this._onAuthenticationChange);
    PollStore.removeCreatedListener(this._onPollCreated);
  },

	handleAnswerOptionChange: function(option, index) {
		// console.log("in 'handleAnswerOptionChange' of pollForm, option is ", option, ", index is ", index, ", and state is ", this.state)
		var updated_answer_options = this.state.answer_options
		updated_answer_options[index] = option
		this.setState({answer_options: updated_answer_options})
	},

	componentWillReceiveProps: function(nextProps) {
		// console.log("in 'componentWillReceiveProps' of PollForm")
	},
	handleSubmit: function(e) {
		// console.log("handling poll submit!")
		// This includes the current answer options as well as the new_answer_option
		// e.preventDefault();
		var author = this.state.author.trim();
		var question = this.state.question.trim();
		var answer_options = eliminateArrayDuplicates(this.state.answer_options.concat([this.state.new_answer_option || '']).map(option => option.trim()).filter(option => (option != '' && option != null)))
		// console.log("answer_options are", answer_options)
		// console.log("answer_options:", answer_options)

		if (!author) {
			var newState = {
				authorField: {
					validationState: "error",
					validationMessage: "You must enter something for the poll author."
				}
			}
			this.setState(newState);
		}
		if (!question) {
			var newState = {
				questionField: {
					validationState: "error",
					validationMessage: "You must enter something for the poll question."
				}
			}
			this.setState(newState);
		}
		if (!answer_options || answer_options.length == 0) {
			var newState = {
				answerOptionsField: {
					validationState: "error",
					validationMessage: "You must enter at least one answer option."
				}
			}
			this.setState(newState);
		}
		if (!question || !author || !answer_options || answer_options.length == 0) {
			return ;
		}
		this.onPollSubmit({
			author: author,
			question: question,
			answer_options: answer_options
		});
	},
	onPollSubmit: function(newPoll) {
		// console.log("in onPollSubmit, newPoll is ", newPoll)
		//newPoll should be an object contain author (string), owner (user.id), question (string), answer_options (String[])
		PollActionCreators.create(newPoll);

	},
	backToPollList: function() {
		browserHistory.push('/polls');

	},

	render: function() {
		// console.log("rendering NewPollForm. answer_options are:", this.state.answer_options)

		var authorField = this.state.authorField;
		var questionField = this.state.questionField;
		var answerOptionsField = this.state.answerOptionsField;
		var userIsAuthenticated = this.state.currentUser != null && this.state.currentUser.username != null;

		var formInstance = (
			// uses <AnswerOptionsList> and <NewAnswerOptionForm> separately rather than single <AnswerOptionsBox>
			<div className='poll well'>
	      <form>
	        <FormGroup controlId="formAuthor" validationState={authorField.validationState}>
	          <ControlLabel>Poll Author:</ControlLabel>
	          <FormControl
	            type="text"
	            value={this.state.author}
	            title={userIsAuthenticated ? "Poll Author" : "Login to create a poll."}
	            placeholder={userIsAuthenticated ? "Your name" : "Login to create a poll."}
							disabled={userIsAuthenticated ? null : 'disabled'}
	            onChange={this.handleAuthorChange}
	          />
	          <FormControl.Feedback />
						{authorField.validationMessage == null ? <HelpBlock>You can enter any name you like.</HelpBlock> : <HelpBlock>{authorField.validationMessage}</HelpBlock> }
	        </FormGroup>
	        <FormGroup controlId="formQuestion" validationState={questionField.validationState}>
	          <ControlLabel>Poll Question:</ControlLabel>
	          <FormControl
	            type="text"
	            value={this.state.question}
	            title={userIsAuthenticated ? "Poll Question" : "Login to create a poll."}
	            placeholder="Type your poll question..."
							disabled={userIsAuthenticated ? null : 'disabled'}
	            onChange={this.handleQuestionChange}
	          />
	          <FormControl.Feedback />
						{questionField.validationMessage == null ? <HelpBlock>You can enter any question you like.</HelpBlock> : <HelpBlock>{questionField.validationMessage}</HelpBlock> }
	        </FormGroup>
	        <FormGroup controlId="answerOptions" validationState={answerOptionsField.validationState} className="answerOptionListContainer well">
	          <ControlLabel>Current Answer options:</ControlLabel>
						<AnswerOptionsList answer_options={this.state.answer_options} votes={[]} handleAnswerOptionChange={this.handleAnswerOptionChange} options_are_editable={true} />
	          <FormControl.Feedback />
						{answerOptionsField.validationMessage == null ? null : <HelpBlock>{answerOptionsField.validationMessage}</HelpBlock> }
					</FormGroup>
					<FormGroup controlId="newAnswerOptionForm" className="newAnswerOptionFormContainer well">
	          <ControlLabel>Add additional answer option:</ControlLabel>
						<NewAnswerOptionForm handleAddAnswerOption={this.handleAddAnswerOption} initial_new_answer_option={this.state.initial_new_answer_option} user={this.state.currentUser} />
					</FormGroup>
					<br />
					<Button type='button' bsStyle="primary" onClick={this.handleSubmit}>Post New Poll </Button>
	      </form>
	    </div>
		)


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

		return (
			<div className='pollForm'>
        <div className='newPollHeader'>
            <h2 className='displayInline'>Create a new Poll</h2> :
        </div>
        <br />
        {formInstance}
        {backToPollListButton}
			</div>
		);
	},

	getCurrentUser: function() {
		return UserStore.getAuthenticatedUser();
	},

	_onAuthenticationChange: function() {
		// console.log("in _onAuthenticationChange of NewPollForm component");
		// var location = this.props.location.toLowerCase()
		// console.log("location: ", location);
		var currentUser = UserStore.getAuthenticatedUser();
		if (currentUser.username == null && this.state.currentUser.username != null) {
			//this means a user was logged in and now has logged out.
			browserHistory.push('/');
		}
		else if (currentUser.username != this.state.currentUser.username) {
			//user has changed. Likely gone from unauthenticated to authenticated
			var newState = {currentUser: currentUser}
			if (this.state.author == '') {
				newState.author = currentUser.fullname || currentUser.username || '';
			}
			// console.log("setting the following variables in setState:", newState);
			this.setState(newState);
		}
	},

	_onUserChange: function() {
		// console.log("in _onUserChange of NewPollForm component");
		// var location = this.props.location.toLowerCase()
		// console.log("location: ", location);

		//This could be the result of user having viewed the form and then updating some of their user profile information.
		var currentUser = UserStore.getAuthenticatedUser();
		// var newState = {};
		// if (currentUser.fullname != this.state.currentUser.fullname) {
		// 	//The user appears to have changed their fullname on their user profile. If this.state.author was set to fullname, then update the author state.
		// 	if (this.state.author == this.state.currentUser.fullname) {
		// 		newState.author = currentUser.fullname;
		// 		newState.currentUser = currentUser;
		// 		this.setState(newState);
		// 	}
		// }
	},

	_onPollCreated: function(new_poll_id) {
		browserHistory.push('/polls/' + new_poll_id);
		// this.setState({poll: PollStore.getPollById(this.props.params.poll_id)});
	}
})

