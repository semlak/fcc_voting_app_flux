/*
<AppRoot>/js/components/PollChart.jsx
using react-d3-basic library
*/

import React from 'react'
// import {Button, Row, Col, Grid, ButtonToolbar, Modal} from 'react-bootstrap'
// var Router = require('react-router');
var UserStore = require('../stores/UserStore');
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
var BarChart = require('react-d3-basic').BarChart
var PollStore = require('../stores/PollStore');
// var AnswerOptionsBox = require('./AnswerOptionsBox')

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



export default React.createClass({
  propTypes: {
   // poll: ReactPropTypes.object.isRequired
  },

	// getInitialState: function() {
	// 	return { new_answer_option: '', chart: null, form_feedback: null, poll: PollStore.getPollById(this.props.params.poll_id), currentUser: this.getCurrentUser(), showDeletePollModal: false, showSharePollModal: false }
	// },
	mapVotesToAnswerOptions : function (votes) {
		console.log("in mapVotesToAnswerOptions")
		var answer_option_votes = this.props.poll.answer_options.map(answer_option => 0);
		votes.forEach(function(vote) {
			// console.log
			answer_option_votes[vote.answer_option] = (parseInt(answer_option_votes[vote.answer_option]) + 1 || 1)
		});
		return answer_option_votes
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



	render: function() {
		// var pollname = this.props.params.pollName;
		// var poll = PollStore.getPollById(this.props.params.poll_id);
		var poll = this.props.poll;

		console.log('rendering PollChart')

		// var currentUserIsPollOwner = (this.state.currentUser == null || this.state.currentUser.username == null) ? false : (this.state.currentUser.id == this.state.poll.owner)
		// console.log('\n\n\ncurrentUserIsPollOwner is', currentUserIsPollOwner)

		  // var generalChartData = require('dsv?delimiter=\t!../../public/data/letter.tsv')
		 //  var generalChartData = [{ letter: "A", frequency: .08167 }, { letter: "B", frequency: .01492 }, { letter: "C", frequency: .02782 }, { letter: "D", frequency: .04253 }, { letter: "E", frequency: .12702 }, { letter: "F", frequency: .02288 }, { letter: "G", frequency: .02015 }, { letter: "H", frequency: .06094 }, { letter: "I", frequency: .06966 }, { letter: "J", frequency: .00153 }, { letter: "K", frequency: .00772 }, { letter: "L", frequency: .04025 }, { letter: "M", frequency: .02406 }, { letter: "N", frequency: .06749 }, { letter: "O", frequency: .07507 }, { letter: "P", frequency: .01929 }, { letter: "Q", frequency: .00095 }, { letter: "R", frequency: .05987 }, { letter: "S", frequency: .06327 }, { letter: "T", frequency: .09056 }, { letter: "U", frequency: .02758 }, { letter: "V", frequency: .00978 }, { letter: "W", frequency: .02360 }, { letter: "X", frequency: .00150 }, { letter: "Y", frequency: .01974 }, { letter: "Z", frequency: .00074 }]
			// console.log("generalChartData:" , generalChartData)

		 //  var width = 400,
		 //    height = 400,
		 //    title = "Bar Chart",
		 //    chartSeries = [
		 //      {
		 //        field: 'frequency',
		 //        name: 'Frequency'
		 //      }
		 //    ],
		 //    x = function(d) {
		 //      return d.letter;
		 //    },
		 //    xScale = 'ordinal',
		 //    xLabel = "Letter",
		 //    yLabel = "Frequency",
		 //    yTicks = [10, "n"];

		 //  return (
		 //    <BarChart
		 //      title= {title}
		 //      data= {generalChartData}
		 //      width= {width}
		 //      height= {height}
		 //      chartSeries = {chartSeries}
		 //      x= {x}
		 //      xLabel= {xLabel}
		 //      xScale= {xScale}
		 //      yTicks= {yTicks}
		 //      yLabel = {yLabel}
		 //    />
		 //  );

    var mappedVotes = this.mapVotesToAnswerOptions(poll.votes);
    var generalChartData = mappedVotes.map(function(answer_option_votes, i ) {
			return {
				answer_option: poll.answer_options[i],
				votes: answer_option_votes}

		});
		var maxNumVotes = Math.max.apply(null, mappedVotes);
		console.log("maxNumVotes:", maxNumVotes, ", mappedVotes:", mappedVotes);
	  var width = 500,
	    height = 400,
	    title = "Bar Chart",
	    chartSeries = [
	      {
	        field: 'votes',
	        name: 'Votes'
	      }
	    ],
	    x = function(d) {
	      return d.answer_option;
	    },
	    xScale = 'ordinal',
	    xLabel = "Answer Option",
	    yLabel = "Votes",
	    // yTicks = [poll.answer_options.length, "s"];
	    yTicks = [maxNumVotes, "s"];
	    // yTickFormat = d3.format("1");
	    console.log("generalChartData:" , generalChartData)
	  return (
	    <BarChart
	      title= {title}
	      data= {generalChartData}
	      width= {width}
	      height= {height}
	      chartSeries = {chartSeries}
	      x= {x}
	      xLabel= {xLabel}
	      xScale= {xScale}
		    yTicks= {yTicks}
	      yLabel = {yLabel}
	    />
		)

		// return (
		// 	<div />
		// );




	}

	// getCurrentUser: function() {
	// 	return UserStore.getAuthenticatedUser();
	// },

	// _onUserChange: function() {
	// 	this.setState({currentUser: UserStore.getAuthenticatedUser()})
	// },

	// _onPollChange: function() {
	// 	console.log("received notification of poll update from  PollStore");
	// 	var poll = PollStore.getPollById(this.props.params.poll_id);
	// 	var newState = {poll: poll}
	// 	if (poll != null) {
	// 		if (poll.answer_options[poll.answer_options.length - 1] == this.state.new_answer_option) {
	// 			//new_answer_option has been properly added to the poll.
	// 			newState.new_answer_option = '';
	// 			newState.form_feedback = null;
	// 		}
	// 		this.setState(newState);
	// 	}

	// },

	// _onPollDestroy: function(poll_id) {
	// 	console.log("received notification of poll destroy from  PollStore");
	// 	if (this.state.poll == null || this.state.poll.id == poll_id) {
	// 		// console.log("poll_id == this.state.poll.id: ", poll_id == this.state.poll.id)
	// 		//the poll was just deleted. redirect to /polls
	// 		//in future, would like to add notification or popup showing poll was deleted succesfully before redirect.
	// 		this.backToPollList();
	// 	}
	// }
})