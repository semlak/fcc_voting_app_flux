/*
<AppRoot>/js/components/PollChart.jsx
using react-d3-basic library
*/

import React from 'react'
// import {Button, Row, Col, Grid, ButtonToolbar, Modal} from 'react-bootstrap'
// var Router = require('react-router');
var UserStore = require('../stores/UserStore');
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
var Recharts = require('recharts');
var PollStore = require('../stores/PollStore');
var ReactPropTypes = React.PropTypes;
// var AnswerOptionsBox = require('./AnswerOptionsBox')

var PollStore = require('../stores/PollStore');
var PollActionCreators = require('../actions/PollActionCreators');


// var React = require('React/addons'),
// var addons = require('react-addons')
  // var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

// var ReactCSSTransitionGroup =

function shadeColor(color, percent) {
//from http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

var truncateString = function(string, length) {
	//if the input string is more than 'length' characters long, this will take the first 'length - 3' characters and append "..." to those.
	//otherwise, return original string
	//might look a little strange if split is in word boundary but I am not attempting to address some things

	//if length is less than 3, can't really handle, so we override.
	var maxLength = Math.max(3, length);

	if (string.length <= maxLength) {
		return string;
	}
	else {
		var newString = string.substring(0, maxLength) + "...";
		return newString ;
	}
}

var rgb2hex = function(rgb){
	//from http://jsfiddle.net/Mottie/xcqpF/1/light/
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}



var getRandomColor = function() {
	//don't remember source of this.
	var arr = []
	for (var i = 0 ; i < 3; i++) {
		arr.push(Math.floor(Math.random() * 256).toString())
	}
	var color = {backgroundColor: 'rgba(' + arr.join(', ') + ', 0.2)', borderColor: 'rgba(' + arr.join(', ') + ', 1)'}
	var color1 = rgb2hex(color.backgroundColor);
	color = {backgroundColor: shadeColor(color1, 0.5), borderColor: color1}
	return color;
}



export default React.createClass({
  propTypes: {
   poll: ReactPropTypes.object.isRequired
  },
  getInitialState: function() {
  	// console.log("getting initial state for PollChart");
  	return {
  		poll: this.props.poll
  	};
  },
	componentWillReceiveProps: function(nextProps) {
		// console.log("in 'componentWillReceiveProps' of PollChart. nextProps: ", nextProps)
		//We expect to receive PropUpdates that don't really call for a new rendering of the chart. (user logging in, form_feedback change, sharing poll)

		//Only update if there is a new answer_option or a new vote.
		// if (nextProps.poll && (nextProps.poll.votes > this.state.poll.votes || nextProps.answer_options > this.state.answer_options)) {
			// this.setState({poll: this.props.poll});
		// }
	},
	colors: [],

	mapVotesToAnswerOptions : function (answer_options, votes) {
		// console.log("in mapVotesToAnswerOptions of PollChart")
		var answer_option_votes = answer_options.map(answer_option => 0);
		votes.forEach(function(vote) {
			answer_option_votes[vote.answer_option]++;
		});
		return answer_option_votes;
	},

	renderChart : function() {

	},
	updateChartWithVote: function() {

	},
	updateChartWithNewAnswerOption: function() {


	},



	render: function() {
		// var pollname = this.props.params.pollName;
		// var poll = PollStore.getPollById(this.props.params.poll_id);
		var poll = this.state.poll;

		console.log('rendering PollChart')

		// var currentUserIsPollOwner = (this.state.currentUser == null || this.state.currentUser.username == null) ? false : (this.state.currentUser.id == this.state.poll.owner)
		// console.log('\n\n\ncurrentUserIsPollOwner is', currentUserIsPollOwner)
		const {BarChart, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} = Recharts;


    var mappedVotes = this.mapVotesToAnswerOptions(poll.answer_options, poll.votes);
    var data = mappedVotes.map(function(answer_option_votes, i ) {
			return {
				answer_option: truncateString(poll.answer_options[i], 25),
				votes: answer_option_votes
			}
		});

		var maxNumVotes = Math.max.apply(null, mappedVotes);

		// console.log("maxNumVotes:", maxNumVotes, ", mappedVotes:", mappedVotes);

		while (this.colors.length < poll.answer_options.length) {
			this.colors[this.colors.length] = getRandomColor();
		}
		// console.log("colors: ", this.colors);

		var containerHeight = data.length * 36 + 30 + 120;
		// console.log("containerHeight will be set to:", containerHeight)
  	return (
  		<div>
	  		<div className="chart-title poll-label">Current Poll Results:</div>
	  		<ResponsiveContainer height={containerHeight} >
		    	<BarChart data={data} layout='vertical'
		            margin={{top: 0, right: 30, left: 20, bottom: 5}}>
						<YAxis dataKey="answer_option" type="category" />
						<XAxis type="number" domain={[0, 'auto']} allowDecimals={false} />
						<CartesianGrid strokeDasharray="3 3"/>
						<Tooltip/>
						<Legend />
						<Bar dataKey="votes" isAnimationActive={false}>
							{
								data.map(function(entry, index) {
									var color = this.colors[index];
									// console.log("color: ", color);
									// console.log("entry:", entry)
									return (
										<Cell key={'cell-' + index} stroke={color.borderColor} strokeWidth={entry.votes > 0 ? 2 : 0 } fill={color.backgroundColor} />
									)
								}.bind(this))
							}
						</Bar>
		      </BarChart>
	      </ResponsiveContainer>
      </div>
    );

		// return (
		// 	<div />
		// );




	}

})