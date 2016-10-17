import React from 'react'
import NavLink from './NavLink'
import {IndexLink } from 'react-router'
import {Modal, Tab, Tabs, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import RegistrationForm from './RegistrationForm'
import LoginForm from './LoginForm'
import ChangePasswordForm from './ChangePasswordForm'

import UserStore from '../stores/UserStore';
import UserActionCreators from '../actions/UserActionCreators';
var Router = require('react-router');



export default React.createClass({
	getInitialState: function() {
		// console.log("getting initial state for <Navbar/>");
		//we want to require a login if an unauthenticated user loads the "/New_poll" location
		var currentUser = this.getCurrentUser();
		var userStoreIsInitializedState = UserStore.getUserStoreIsInitializedState();
		// var showRegisterLoginModal = false;
		var location = this.props.location.toLowerCase()

		/*
			The registerLoginModal should be shown automatically to the user if '/new_poll' page is rendered.
			However, on a page refresh, the user might be authenticated but the userStore just not initialized.
			Therefore, if store is not initialized, don't show registerLoginModal right away. This eliminated
			a brief flash of the registerLoginModal when user is logged in but refreshes the "/new_poll" page.
		*/
		var showRegisterLoginModal = location == "/new_poll" && userStoreIsInitializedState && currentUser.username == null ? true : false ;
		// console.log("currentUser:", currentUser, ", showRegisterLoginModal: ", showRegisterLoginModal);
		return {
			currentUser: currentUser,
			showRegisterLoginModal: showRegisterLoginModal,
			activeModalTab : 2,
			showChangePasswordModal: false,
			expanded: false
		};
			//expanded in the state refers to if the navBar is expanded, as in when in mobile view and the bar has been clicked to drop down the nav elements
			//Unfortunately, it seems we need to control this state explicitly to accurately make sure the bar collapses after clicks when wanted
	},

	closeRegisterLoginModal: function() {
		// console.log('closing registerLoginModal')
		this.setState({ showRegisterLoginModal: false });
	},

	openRegisterLoginModal:function() {
		// console.log('opening registerLoginModal')
		this.setState({ showRegisterLoginModal: true });
	},

  openModalToRegister: function() {
  	this.setState({activeModalTab: 1, showRegisterLoginModal: true})
  },

  openModalToLogin: function() {
  	this.setState({activeModalTab: 2, showRegisterLoginModal: true})
  },

	closeChangePasswordModal: function() {
		// console.log('closing ChangePasswordModal')
		this.setState({ showChangePasswordModal: false });
	},

	openChangePasswordModal:function() {
		// console.log('opening ChangePasswordModal')
		if (this.state.showRegisterLoginModal == false) {
			this.setState({ showChangePasswordModal: true });
		}
		else {
			console.error("Can't show ChangePassword Modal and RegisterLogin Modal at the same time");
		}
	},


	componentDidMount: function() {
		UserStore.addAuthenticationChangeListener(this._onAuthenticationChange);
	},

	componentWillUnmount: function() {
		UserStore.removeAuthenticationChangeListener(this._onAuthenticationChange);
	},

	componentWillReceiveProps: function(nextProps) {
		// console.log("in componentWillReceiveProps of <Navbar />, nextProps: ", nextProps);
		if (this.state.currentUser.username == null && nextProps.location.toLowerCase() == "/new_poll") {
			this.setState({showRegisterLoginModal: true});
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
						<LinkContainer eventKey={1012} to={'/Users/' + this.state.currentUser.username.toString()}><MenuItem>My Profile</MenuItem></LinkContainer>
						<MenuItem eventKey={1013} onClick={this.openChangePasswordModal}>Change Password</MenuItem>
						<MenuItem divider />
						<MenuItem eventKey={1014} onClick={this.handleLogout}>Logout</MenuItem>
					</NavDropdown>
				])
			}
		}.bind(this);

		var registerLoginModal = (
			<Modal show={this.state.showRegisterLoginModal} onHide={this.closeRegisterLoginModal}>
				<Modal.Header closeButton>
					<Modal.Title>Registration/Login</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Tabs defaultActiveKey={this.state.activeModalTab} id="registration-login-tabs">
						<Tab eventKey={1} title="Register"><RegistrationForm onCancel={this.closeRegisterLoginModal}/></Tab>
						<Tab eventKey={2} title="Login"><LoginForm onCancel={this.closeRegisterLoginModal}/></Tab>
					</Tabs>
				</Modal.Body>
			</Modal>
		)

		var changePasswordModal = (
			<Modal show={this.state.showChangePasswordModal} onHide={this.closeChangePasswordModal}>
				<Modal.Header closeButton>
					<Modal.Title>Change Password</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ChangePasswordForm username={this.state.currentUser.username} onCancel={this.closeChangePasswordModal}/>
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
				{registerLoginModal}
				{changePasswordModal}
			</div>
		);
		// console.log("mainNavBar:", mainNavBar);
		return mainNavBar;

	},


	getCurrentUser: function() {
		return UserStore.getAuthenticatedUser();
	},

	_onAuthenticationChange: function(message_obj) {
		console.log("in _onAuthenticationChange of <Navbar/>")

		//things are a little confusing here. the variable currentUser below is refering to the most recent updated authenticated user
		//However, this.state.currentUser is the authenticated user last set in the NavBar object, which could be out of date (being checked here)
		var currentUser = this.getCurrentUser();
		var newState = {};
		var location = this.props.location.toLowerCase()
		var userStoreIsInitializedState = UserStore.getUserStoreIsInitializedState();
		// var showRegisterLoginModal = location == "/new_poll" && userStoreIsInitializedState && currentUser.username == null ? true : false ;

		if (message_obj != null && message_obj.error) {
			//There was a error in the authentication change; don't modify navbar or its modal boxes, other than updating their messages/validation state
			// this.setState({message_obj: message_obj});
		}
		else if (currentUser.username == null && this.state.currentUser.username != null) {
			//This should only occur when user has logged out
			this.setState({currentUser: currentUser})
			if ( location == '/login' || location == '/register') {
				Router.browserHistory.push('/');
			}
		}
		else if (userStoreIsInitializedState && currentUser.username == null && location == "/new_poll") {
			//this should occur if the user has loaded the app directly to the "/new_poll" page, just after the app updates users
			//we want to show the registerLoginModal upon page rendering.
			this.setState({currentUser: currentUser, showRegisterLoginModal: true})
		}
		else {
			//this should occur when the user logged in while viewing a page. Might eventually find way to briefly show message_text
			this.setState({currentUser: currentUser, showRegisterLoginModal: false, message_obj: message_obj})
		}
	}
})

// module.exports = Navbar;
