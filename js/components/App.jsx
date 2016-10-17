import React from 'react'
import {IndexLink } from 'react-router'
import PollBox from './PollBox'
import Navbar from './Navbar'
import ReactPropTypes from 'react/lib/ReactPropTypes';


export default React.createClass({

	render: function() {
		// console.log('this.props is', this.props)
		// console.log("props:" , this.props)
		// this.props.location.pathname
		return (
			<div>
				<Navbar location={this.props.location.pathname}/>
				<br />
				<div className="app_body container jumbotron well">
					{this.props.location.pathname == "/" ? <PollBox /> : this.props.children}
				</div>
			</div>
		)
	}
})
