'use strict';


/*
components/Navbar.jsx
*/

import React from 'react';
// import NavLink from './NavLink';
// import {IndexLink } from 'react-router';
// import {Modal, Tab, Tabs, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
// import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

import Navbar from '../components/Navbar';
import UserStore from '../stores/UserStore';
import UserActionCreators from '../actions/UserActionCreators';
import ModalActionCreators from '../actions/ModalActionCreators';
// import {browserHistory} from 'react-router';
// import ReactPropTypes from 'react/lib/ReactPropTypes';



export default React.createClass({
	getInitialState: function() {

		return {
			navbarIsExpanded: false,
			userStoreState: UserStore.getState()
		};
			//navbarIsExpanded in the state refers to if the navBar is expanded, as in when in mobile view and the bar has been clicked to drop down the nav elements
			//Unfortunately, it seems we need to control this state explicitly to accurately make sure the bar collapses after clicks when wanted
	},

	openModalToRegister: function() {
		ModalActionCreators.open('register', '');
	},

	openModalToLogin: function() {
		console.log('in openModalToLoginof <Navbar>');
		ModalActionCreators.open('login', '');
	},

	openChangePasswordModal:function() {
		ModalActionCreators.open('changepassword', '');

	},


	handleLogout: function() {
		UserActionCreators.logout();
	},

	// onToggle: function(navExpanded) {
	onToggle: function() {
		// console.log('in 'onToggle' of <Navbar />.',  ', navExpanded:', navExpanded);
		this.setState({navbarIsExpanded: !this.state.navbarIsExpanded});

	},

	componentDidMount: function() {
		UserStore.addChangeListener(this._onUserStoreChange);
	},


	componentWillUnmount: function() {
		UserStore.removeChangeListener(this._onUserStoreChange);
	},

	// onClose: function() {
	// 	console.log('in 'onClose' of <Navbar />.');

	// // },


	// // onSelect: function(eventKey, event) {
	// onSelect: function(eventKey) {
	// 	// console.log('in 'onSelect' of <Navbar />. ', 'eventKey: ', eventKey, ', event:', event);
	// 	//this is used primarily to just close an expanded navbar (like a mobile view's dropdown) when a navitem is clicked.

	// 	//right now, there are no eventKeys that I don't want to trigger this state change. But if there were some, I would put in if statement.
	// 	if (eventKey != 654 ) {
	// 		this.setState({expanded: false});
	// 	}

	// },



	// navbarToggleClick: function(e) {
	// 	// console.log('in 'navbarToggleClick' of <Navbar />.', 'event: ', e);
	// },

	render: function() {
		// console.log('this.props:', this.props)
		// var usermenu = <UserMenu user={this.props.user} />
		// console.log('rendering NavBar, state is ', this.state)
		// var rightNavbarListItems = function() {[<div/>]}
		return (
			<Navbar
				openModalToRegister={this.openModalToRegister}
				openModalToLogin={this.openModalToLogin}
				openChangePasswordModal={this.openChangePasswordModal}
				handleLogout={this.handleLogout}
				onToggle={this.onToggle}
				navbarIsExpanded={this.state.navbarIsExpanded}
				userStoreState={this.state.userStoreState}
			/>
		);

	},


	_onUserStoreChange: function() {
		this.setState({userStoreState: UserStore.getState()});
	}

	// _onChange: function() {
	// 	console.log('in _onChange for Navbar');
	// 	var newState = UserStore.getState();
	// 	var location = this.props.location.toLowerCase();
	// 	var userStoreIsInitializedState = newState.userStoreIsInitializedState;
	// 	console.log('newState:', newState);
	// 	var currentUser = newState.authenticatedUser;
	// 	console.log('currentUser:', currentUser);

	// 	if (this.state.userStoreIsInitializedState == false && userStoreIsInitializedState == true) {
	// 		let showRegisterLoginModal = location == '/new_poll' && userStoreIsInitializedState && currentUser.username == null ? true : false ;
	// 		this.setState({
	// 			userStoreIsInitializedState: userStoreIsInitializedState,
	// 			showRegisterLoginModal: showRegisterLoginModal,
	// 			userStoreState: UserStore.getState()
	// 		});
	// 	}
	// 	else if (newState.error) {
	// 		this.setState({
	// 			message_obj: {error: true, message_text: newState.errorMessage},
	// 			userStoreState: UserStore.getState()
	// 		});
	// 	}
	// 	else if (newState.authenticatedUser.id != null) {
	// 		// User has possible just logged in
	// 		console.log('setting new currentUser:', currentUser);
	// 		this.setState({
	// 			message_obj: {error: false, message_text: newState.successMessage},
	// 			userStoreState: UserStore.getState()
	// 		});
	// 	}
	// 	else if (newState.authenticatedUser.id == null) {
	// 		// User has possibly just logged out.
	// 		this.setState({
	// 			message_obj: {error: false, message_text: newState.successMessage},
	// 			userStoreState: UserStore.getState()
	// 		});
	// 		if ( location == '/login' || location == '/register') {
	// 			browserHistory.push('/');
	// 		}
	// 	}
	// },

	// _onAuthenticationChange: function(message_obj) {
	// _onAuthenticationChange: function() {
	// 	// console.log('in _onAuthenticationChange of <Navbar/>')

	// 	//things are a little confusing here. the variable currentUser below is refering to the most recent updated authenticated user
	// 	//However, this.state.currentUser is the authenticated user last set in the NavBar object, which could be out of date (being checked here)

	// 	// var currentUser = this.getCurrentUser();
	// 	// // var newState = {};
	// 	// var location = this.props.location.toLowerCase();
	// 	// var userStoreIsInitializedState = UserStore.getUserStoreIsInitializedState();
	// 	// // var showRegisterLoginModal = location == '/new_poll' && userStoreIsInitializedState && currentUser.username == null ? true : false ;

	// 	// if (message_obj != null && message_obj.error) {
	// 	// 	//There was a error in the authentication change; don't modify navbar or its modal boxes, other than updating their messages/validation state
	// 	// 	// this.setState({message_obj: message_obj});
	// 	// }
	// 	// else if (currentUser.username == null && this.state.currentUser.username != null) {
	// 	// 	//This should only occur when user has logged out
	// 	// 	this.setState({currentUser: currentUser});
	// 	// 	if ( location == '/login' || location == '/register') {
	// 	// 		browserHistory.push('/');
	// 	// 	}
	// 	// }
	// 	// else if (userStoreIsInitializedState && currentUser.username == null && location == '/new_poll') {
	// 	// 	//this should occur if the user has loaded the app directly to the '/new_poll' page, just after the app updates users
	// 	// 	//we want to show the registerLoginModal upon page rendering.
	// 	// 	this.setState({currentUser: currentUser, showRegisterLoginModal: true});
	// 	// }
	// 	// else {
	// 	// 	//this should occur when the user logged in while viewing a page. Might eventually find way to briefly show message_text
	// 	// 	this.setState({currentUser: currentUser, showRegisterLoginModal: true, message_obj: message_obj});
	// 	// }
	// }
});

// module.exports = Navbar;
