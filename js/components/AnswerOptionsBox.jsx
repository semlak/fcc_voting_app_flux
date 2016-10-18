import React from 'react'
import {Button, Grid, Row, Col, Form, FormGroup, FormControl,  ControlLabel, HelpBlock} from 'react-bootstrap'

import PollStore from '../stores/PollStore';
import VoteActionCreators from '../actions/VoteActionCreators';
import ReactPropTypes from 'react/lib/ReactPropTypes';



var AnswerOption = React.createClass({
	//the number of votes for the answer option is passed as a prop, this.props.answer_option_votes
	//It can be used to display the number of votes for the answer option.
	//However, I'm not displaying the data here (in the answer option), as I am using a chart instead

	//Also, in order to handle a vote (user pressing the button), the AnswerOption needs either
	//the this.prop.handleVote function or this.props.index value to be defined
	getInitialState: function() {
		return {hoverOn: false}
	},
	vote: function(e) {
		// This is only used for uneditable AnswerOption (meaning, not a new poll form)

		//Ideally, I will add logic here to check if user has already voted in this poll
		// However, I am relying on the server to handle that, and the user sees (or should see) a modal box if that is the case

		/*
			I have tried to set this up so the call to the vote_action can occur from here,
			or a function can be passed as a prop to handle the vote
		*/
		var data = {index: this.props.index, answer_option_text: this.props.answer_option}
		if (this.props.poll_id != null) {
			data.poll_id = this.props.poll_id;
			//fire vote action
			// console.log("firing vote action creator from AnswerOption");
			VoteActionCreators.create(data);
		}

		else if (typeof this.props.handleVote == 'function') {
			// console.log("passing vote data to parent object from AnswerOption");
			this.props.handleVote(data);
		}

		else {
			// console.log("problem submitting vote");
		}

	},

	handleExistingAnswerOptionChange: function(e) {
		// only used for editable AnswerOption (on a NewPollForm)
		this.props.handleAnswerOptionChange(e.target.value, this.props.index)
	},
	onButtonMouseIn: function(e) {
		// this is used to highlight or put border around entire answer option but only when the vote button is covered
		// the goal is to help the user see what option being voted for when hovering on vote button
		this.setState({hoverOn: true})
	},
	onButtonMouseOut: function(e) {
		this.setState({hoverOn: false})
	},
	render: function() {
		// console.log("rendering answerOption")
		var className = "";
		var editableAnswerOption = (
      <FormGroup controlId="answerOption">
        <FormControl
					type='text'
					value={this.props.answer_option}
					onChange={this.handleExistingAnswerOptionChange}
					onKeyPress={this.props.handleKeyPress}
					className={'form-control'}
					autoComplete="off"
        />
      </FormGroup>
		);

		if (this.props.option_is_editable) {
			return editableAnswerOption;
		}
		else {
			// var uneditableAnswerOptionWithVotes = (
			// // Used primarily for development. It displays votes next to answer option. Not really needed if chart is being rendered in PollForm.
			// 	<Row className={'answer_option pollListing uneditable' + (this.state.hoverOn ? ' addBorder' : '')}>
			// 		<Col xs={4} sm={4} md={2} className=''>
			// 			<Button
			// 				onClick={this.vote}
			// 				onMouseOver={this.onButtonMouseIn}
			// 				onMouseOut={this.onButtonMouseOut}
			// 				bsStyle='default'
			// 				data-toggle='tooltip'
			// 				title='Click to Vote'
			// 				data-placement='bottom'>Vote</Button>
			// 		</Col>
			// 		<Col xs={6} sm={6} md={8} className=''>
			// 			<div>{this.props.answer_option}</div>
			// 		</Col>
			// 		<Col xs={2} sm={2} md={2} className=''>
			// 			<div>{this.props.answer_option_votes}</div>
			// 		</Col>
			// 	</Row>
			// )
			var uneditableAnswerOption = function() {
				return (
					<Row className={'answer_option pollListing uneditable' + (this.state.hoverOn ? ' addBorder' : '')}>
						<Col xs={4} sm={4} md={2} className=''>
							<Button
								onClick={this.vote}
								onMouseOver={this.onButtonMouseIn}
								onMouseOut={this.onButtonMouseOut}
								bsStyle='default'
								data-toggle='tooltip'
								title='Click to Vote'
								data-placement='bottom'>Vote</Button>
						</Col>
						<Col xs={8} sm={8} md={10} className=''>
							<div>{this.props.answer_option}</div>
						</Col>
					</Row>
				)
			}.bind(this);
			return uneditableAnswerOption();
		}
	}
});

var AnswerOptionsList = React.createClass({
	// this just renders the existing answer options (not the new_answer_option, which is handled by AnswerOptionsBox)
	// The votes for each answer_option are passed in case the developer wishes to display them in the answer_option
	render: function() {
		// console.log('rendering AnswerOptionsList. props are', this.props)
		var numAnswerOptions = this.props.answer_options.length;
		var answerOptionNodes = this.props.answer_options.map(function(answer_option, i) {
			// console.log('this.props.options_are_editable', this.props.options_are_editable)
			var answer_option_votes = (this.props.options_are_editable == true) ? [] : this.props.answer_option_votes
			return (
				//could pass this.props.handleVote to AnswerOption, or let AnswerOption handle vote (then you need to pass index)
				<AnswerOption
					answer_option={answer_option}
					answer_option_votes={answer_option_votes[i]}
					key={i}
					index={i}
					handleAnswerOptionChange={this.props.handleAnswerOptionChange}
					option_is_editable={this.props.options_are_editable}
					handleVote={this.props.handleVote}
					handleKeyPress={this.props.handleKeyPress}
					poll_id={this.props.poll_id}
				/>
			);
		}.bind(this));
		return (
			<div className='answer_options_list'>
				<Grid>
					{answerOptionNodes.length > 0 ? answerOptionNodes : "None"}
				</Grid>
			</div>
		);
	}
});




var NewAnswerOptionForm = React.createClass({
	getInitialState: function() {
		// console.log("in getInitialState for AnswerOptionsBox")
		return {
			new_answer_option: this.props.initial_new_answer_option,
			form_feedback: this.props.form_feedback
		};
	},
	handleAnswerOptionAdd: function(e) {
		if (e) {
			// e.preventDefault()
		}
		this.props.handleAddAnswerOption(this.state.new_answer_option);
	},
	handleNewAnswerOptionChange: function(e) {
		var new_answer_option = e.target.value;
		var newState = {new_answer_option: new_answer_option, form_feedback: null};
		this.setState(newState);
	},
	componentWillReceiveProps: function(nextProps) {
		// console.log("in 'componentWillReceiveProps' of AnswerOptionsBox. nextProps: ", nextProps)
		var newState = {};
		newState.form_feedback = nextProps.form_feedback

		if (nextProps.form_feedback == null && nextProps.initial_new_answer_option != null) {
			//initial_new_answer_option will likely be '', but set to whatever is provided
			//we only update new_answer_option when form_feedback is set back to null (this is indicator that Parent component added answer option)
			newState.new_answer_option = nextProps.initial_new_answer_option;
		}
		this.setState(newState);
	},
	handleKeyPress: function(e) {
		// console.log('\n\n\n\n\ndetected key press')
		if (e.key === 'Enter') {
			// e.preventDefault();
			this.props.handleAddAnswerOption(this.state.new_answer_option);
		}
	},

	render: function() {
		var validationState = this.state.form_feedback == null ? null : "error";
		var validationMessage = this.state.form_feedback == null ? "" : this.state.form_feedback.message;

		var userIsAuthenticated = this.props.user != null && this.props.user.username != null;
		// console.log("userIsAuthenticated:", userIsAuthenticated, ", this.props.user: ", this.props.user);
		return (
			<Grid className='newAnswerOptionForm'>
        <FormGroup controlId="newAnswerOptionForm" validationState={validationState}>
        	<FormGroup controlId='newAnswerOptionField' validationState={validationState}>
	          <FormControl
							type="text"
							value={this.state.new_answer_option}
							title={userIsAuthenticated ? 'Enter a new poll answer option here' : 'Login to add a poll answer option'}
							placeholder={userIsAuthenticated ? 'Enter a new poll answer option here' : 'Login to add a poll answer option'}
							onChange={this.handleNewAnswerOptionChange}
							autoComplete="off"
							disabled={userIsAuthenticated ? null : 'disabled'}
	          />
	          <FormControl.Feedback />
	        </FormGroup>
	        <FormGroup controlId='newAnswerOptionButton'>
						<Button
							onClick={this.handleAnswerOptionAdd}
							bsStyle='default'
							title={userIsAuthenticated ? 'Add Answer' : 'Login to add a poll answer option'}
							disabled={userIsAuthenticated ? false :  true}
							>Add Answer Option</Button>
						{this.state.form_feedback == null ? null : <HelpBlock>{validationMessage}</HelpBlock> }
					</FormGroup>
        </FormGroup>
    </Grid>
		);
	}
});






var AnswerOptionsBox = React.createClass({
	//this is the updated AnswerOptionsBox that uses the separate NewAnswerOptionForm component rather than builds its own newAnswerOptionForm
	getInitialState: function() {
		// console.log("in getInitialState for AnswerOptionsBox")
		return {
			new_answer_option: this.props.initial_new_answer_option,
			form_feedback: this.props.form_feedback
		};
	},
	handleAnswerOptionAdd: function(e) {
		if (e) {
			// e.preventDefault()
		}
		// console.log("in 'handleAnswerOptionAdd' of AnswerOptionsBoxNew, props is", this.props)

		this.props.handleAddAnswerOption(this.state.new_answer_option);
	},
	handleNewAnswerOptionChange: function(e) {
		var new_answer_option = e.target.value;
		var newState = {new_answer_option: new_answer_option, form_feedback: null};
		this.setState(newState);
	},
	componentWillReceiveProps: function(nextProps) {
		// console.log("in 'componentWillReceiveProps' of AnswerOptionsBox. nextProps: ", nextProps)
		var newState = {};
		newState.form_feedback = nextProps.form_feedback

		if (nextProps.form_feedback == null && nextProps.initial_new_answer_option != null) {
			//initial_new_answer_option will likely be '', but set to whatever is provided
			//we only update new_answer_option when form_feedback is set back to null (this is indicator that Parent component added answer option)
			newState.new_answer_option = nextProps.initial_new_answer_option;
		}
		this.setState(newState);
	},
	handleKeyPress: function(e) {
		// console.log('\n\n\n\n\ndetected key press')
		if (e.key === 'Enter') {
			// e.preventDefault();
			this.props.handleAddAnswerOption(this.state.new_answer_option);
		}
	},

	render: function() {
		// console.log("rendering AnswerOptionsBoxNew, props are ", this.props)

		// var validationState = this.state.form_feedback == null ? null : "error";
		// var validationMessage = this.state.form_feedback == null ? "" : this.state.form_feedback.message;
		// console.log("this.state.form_feedback", this.state.form_feedback);



	// 					placeholder={(this.props.user == null ? 'Login to add a poll answer option' : 'Enter a new poll answer option here')}
		// var userIsAuthenticated = this.props.user != null && this.props.user.username != null;
		// console.log("userIsAuthenticated:", userIsAuthenticated, ", this.props.user: ", this.props.user);
		var newAnswerOptionForm = (
			<NewAnswerOptionForm
				initial_new_answer_option={this.props.initial_new_answer_option}
				form_feedback={this.props.form_feedback}
				handleAddAnswerOption={this.props.handleAddAnswerOption}
				user={this.props.user}
			/>
		)

		return (
			<div className='answerOptionBox'>
					<AnswerOptionsList
						answer_options={this.props.answer_options}
						answer_option_votes={!this.props.options_are_editable ? this.props.mapVotesToAnswerOptions(this.props.votes) : null}
						options_are_editable={this.props.options_are_editable}
						handleKeyPress={this.handleKeyPress}
						handleVote={this.props.handleVote}
						handleAnswerOptionChange={this.props.handleAnswerOptionChange}
						poll_id={this.props.poll_id}
					/>

					{/*// this next ul just contains the empty field to add a new answer option and the button. It is in ul form to align with existing answer options. */}
				{newAnswerOptionForm}
			</div>
		);
	}
});


// module.exports = AnswerOptionsBox
export {AnswerOptionsBox, AnswerOptionsList, AnswerOption, NewAnswerOptionForm}
