'use strict';


/*
components/Navbar.jsx
*/

import React from 'react';
// import NavLink from './NavLink';
import {IndexLink } from 'react-router';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
// import RegistrationForm from './RegistrationForm';
// import LoginForm from './LoginForm';
// import ChangePasswordForm from './ChangePasswordForm';

// import UserStore from '../stores/UserStore';
// import UserActionCreators from '../actions/UserActionCreators';
// import ModalActionCreators from '../actions/ModalActionCreators';
// import {browserHistory} from 'react-router';
// import ReactPropTypes from 'react/lib/ReactPropTypes';



export default function (props) {
  // console.log('props:', props)
  // var usermenu = <UserMenu user={props.user} />
  // console.log('rendering <NavBar />, props are ', props);
  // var rightNavbarListItems = function() {[<div/>]}
  var rightNavbarListItems = function() {
    if (props.userStoreState.authenticatedUser == null || props.userStoreState.authenticatedUser.username == null) {
      return ([
        <NavItem key={1001} eventKey={1001} onClick={props.openModalToRegister} >Register</NavItem>,
        <NavItem key={1002} eventKey={1002} onClick={props.openModalToLogin} >Login</NavItem>
      ]);

    }
    else {
      return ([
        <NavDropdown key={1001} eventKey={1001} title={props.userStoreState.authenticatedUser.username} id='basic-nav-dropdown' onClose={props.onClose}>
          <LinkContainer eventKey={1011} to={'/Users/' + props.userStoreState.authenticatedUser.username.toString() +'/polls'}><MenuItem>View My Polls</MenuItem></LinkContainer>
          <MenuItem divider />
          <LinkContainer eventKey={1012} to={'/Users/' + props.userStoreState.authenticatedUser.username.toString()}><MenuItem>My Profile</MenuItem></LinkContainer>
          <MenuItem eventKey={1013} onClick={props.openChangePasswordModal}>Change Password</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={1014} onClick={props.handleLogout}>Logout</MenuItem>
        </NavDropdown>
      ]);
    }
  }.bind(this);

  const mainNavBar = (
    <div>
      <Navbar inverse onToggle={props.onToggle} expanded={props.navbarIsExpanded} >
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to='/' >Voting App</IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle onClick={props.navbarToggleClick}/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav onSelect={props.onSelect}>
            <IndexLinkContainer to='/' ><NavItem eventKey={1} >Home</NavItem></IndexLinkContainer>
            <LinkContainer to='/About' ><NavItem eventKey={2} >About</NavItem></LinkContainer>
            <LinkContainer to='/Polls' ><NavItem eventKey={3} >Polls</NavItem></LinkContainer>
            <LinkContainer to='/New_poll' ><NavItem eventKey={4} >New Poll</NavItem></LinkContainer>
            <LinkContainer to='/Users' ><NavItem eventKey={5} >Users</NavItem></LinkContainer>
          </Nav>
          <Nav pullRight onSelect={props.onSelect}>
            {rightNavbarListItems()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
  return mainNavBar;
}

