import React from 'react'
import NavLink from './NavLink'
import {IndexLink } from 'react-router'
import {Modal, Tab, Tabs, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import RegistrationForm from './RegistrationForm'
import LoginForm from './LoginForm'

var UserStore = require('../stores/UserStore');
var UserActionCreators = require('../actions/UserActionCreators');
var Router = require('react-router');



export default React.createClass({
	getInitialState: function() {
		// console.log("getting initial state for <Navbar/>");
		//we want to require a login if an unauthenticated user loads the "/New_poll" location
		var currentUser = this.getCurrentUser();
		var showModal = this.props.location == "/New_poll" && currentUser.username == null ? true : false;
		// console.log("currentUser:", currentUser, ", showModal: ", showModal);
		return {
			currentUser: currentUser,
			showModal: showModal,
			activeModalTab : 2,
			expanded: false
		};
	},

	close: function() {
		// console.log('closing modal')
		this.setState({ showModal: false });
	},

	open:function() {
		// console.log('opening modal')
		this.setState({ showModal: true });
	},

  openModalToRegister: function() {
  	this.setState({activeModalTab: 1, showModal: true})
  },

  openModalToLogin: function() {
  	this.setState({activeModalTab: 2, showModal: true})
  },

	componentDidMount: function() {
		UserStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		UserStore.removeChangeListener(this._onChange);
	},

	componentWillReceiveProps: function(nextProps) {
		// console.log("in componentWillReceiveProps of <Navbar />, nextProps: ", nextProps);
		if (this.state.currentUser.username == null && nextProps.location.toLowerCase() == "/new_poll") {
			this.setState({showModal: true});
		}
	},

	loadUserPolls: function() {

	},

	handleLogout: function() {
		UserActionCreators.logout();
	},

	onToggle: function(navExpanded) {
		// console.log("in 'onToggle' of <Navbar />.",  ", navExpanded:", navExpanded);
		this.setState({expanded: !this.state.expanded});

	},

	// onClose: function() {
	// 	console.log("in 'onClose' of <Navbar />.");

	// },


	onSelect: function(eventKey, event) {
		// console.log("in 'onSelect' of <Navbar />. ", "eventKey: ", eventKey, ", event:", event);
		//this is used primarily to just close an expanded navbar (like a mobile view's dropdown) when a navitem is clicked.

		//right now, there are no eventKeys that I don't want to trigger this state change. But if there were some, I would put in if statement.
		if (eventKey != 654 ) {
			this.setState({expanded: false});
		}

	},

	// navbarToggleClick: function(e) {
	// 	// console.log("in 'navbarToggleClick' of <Navbar />.", "event: ", e);
	// },

	render: function() {
		// console.log("this.props:", this.props)
		// var usermenu = <UserMenu user={this.props.user} />
		// console.log("rendering NavBar, state is ", this.state)
		// var rightNavbarListItems = function() {[<div/>]}
		var rightNavbarListItems = function() {
			if (this.state.currentUser == null || this.state.currentUser.username == null) {
				return ([
					<NavItem key={1001} eventKey={1001} onClick={this.openModalToRegister} >Register</NavItem>,
					<NavItem key={1002} eventKey={1002} onClick={this.openModalToLogin} >Login</NavItem>
				])

			}
			else {
				return ([
					<NavDropdown key={1001} eventKey={1001} title={this.state.currentUser.username} id="basic-nav-dropdown" onClose={this.onClose}>
						<LinkContainer eventKey={1011} to={'/Users/' + this.state.currentUser.username.toString() +'/polls'}><MenuItem>View My Polls</MenuItem></LinkContainer>
						<MenuItem divider />
						<MenuItem eventKey={1012} onClick={this.handleLogout}>Logout</MenuItem>
					</NavDropdown>
				])


			}
		}.bind(this);

		var modal = (
			<Modal show={this.state.showModal} onHide={this.close}>
				<Modal.Header closeButton>
					<Modal.Title>Registration/Login</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Tabs defaultActiveKey={this.state.activeModalTab} id="uncontrolled-tab-example">
						<Tab eventKey={1} title="Register"><RegistrationForm onCancel={this.close}/></Tab>
						<Tab eventKey={2} title="Login"><LoginForm onCancel={this.close}/></Tab>
					</Tabs>
				</Modal.Body>
			</Modal>
		)

		const mainNavBar = (
			<div>
				<Navbar inverse onToggle={this.onToggle} expanded={this.state.expanded} >
					<Navbar.Header>
						<Navbar.Brand>
							<IndexLink to="/" >Voting App</IndexLink>
						</Navbar.Brand>
						<Navbar.Toggle onClick={this.navbarToggleClick}/>
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav onSelect={this.onSelect}>
							<IndexLinkContainer to="/" ><NavItem eventKey={1} >Home</NavItem></IndexLinkContainer>
							<LinkContainer to="/About" ><NavItem eventKey={2} >About</NavItem></LinkContainer>
							<LinkContainer to="/Polls" ><NavItem eventKey={3} >Polls</NavItem></LinkContainer>
							<LinkContainer to="/New_poll" ><NavItem eventKey={4} >New Poll</NavItem></LinkContainer>
							<LinkContainer to="/Users" ><NavItem eventKey={5} >Users</NavItem></LinkContainer>
						</Nav>
						<Nav pullRight onSelect={this.onSelect}>
							{rightNavbarListItems()}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				{modal}
			</div>
		);
		// console.log("mainNavBar:", mainNavBar);
		return mainNavBar;

	},


	getCurrentUser: function() {
		return UserStore.getAuthenticatedUser();
	},

	_onChange: function(message) {
		// console.log("in _onChange of <Navbar/>", "props: ", this.props)

		//things are a little misnamed here. the variable currentUser below is refering to the most recent updated authenticated user
		//this.state.currentUser is the authenticated user last set in the NavBar object, which could be out of date (being checked here)
		var currentUser = this.getCurrentUser();
		var newState = {};
		var location = this.props.location.toLowerCase()

		if (message != null) {

		}
		if (currentUser.username == null && this.state.currentUser.username != null) {
			// this should only occur when user has logged out
			this.setState({currentUser: currentUser})
			if ( location == '/login' || location == '/register') {
				Router.browserHistory.push('/');
			}
		}
		else if (currentUser.username == null && location == "/new_poll") {
			//this should occur if the user has loaded the app directly to the "/new_poll" page, just after the app updates users
			//we still want to show the login/register modal upon page rendering.
			this.setState({currentUser: currentUser})
		}
		else {
			this.setState({currentUser: currentUser, showModal: false})
		}
	}
})

// module.exports = Navbar;
