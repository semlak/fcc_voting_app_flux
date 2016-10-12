import React from 'react'
import {IndexLink } from 'react-router'
import NavLink from './NavLink'
import Navbar from './Navbar'



export default React.createClass({
	render: function() {
		return (
			<div>
				<Navbar />
				<h1>React Router Tutorial</h1>
				<ul role='nav'>
					<li><IndexLink to="/" activeClassName='active'>Home</IndexLink></li>
					<li><NavLink to="/About" >About</NavLink></li>
					<li><NavLink to="/Polls" >Polls</NavLink></li>
					<li><NavLink to="/New_poll" >New Poll</NavLink></li>
					<li><NavLink to="/Users" >Users</NavLink></li>
					<li><NavLink to="/Register">Register</NavLink></li>
					<li><NavLink to="/Login" >Login</NavLink></li>
				</ul>
				{/* add this */}
				{this.props.children}
			</div>
		)
	}
})
