import React from 'react'
import {IndexLink } from 'react-router'
import NavLink from './NavLink'
import Navbar from './Navbar'


// var Popover = require('react-bootstrap').Popover;
// var Tooltip = require('react-bootstrap').Tooltip;
// var Button = require('react-bootstrap').Button;
// var Modal = require('react-bootstrap').Modal;
// var OverlayTrigger = require('react-bootstrap').OverlayTrigger;

// export default React.createClass({
//   render() {
//     return <div>Hello, React Router!</div>
//   }
// })


export default React.createClass({

	render: function() {
		console.log('this.props is', this.props)
		return (
			<div>
				<Navbar location={this.props.location.pathname}/>
				<br />
				<div className="app_body container jumbotron well">
					{this.props.children}
				</div>
			</div>
		)
	}
})
