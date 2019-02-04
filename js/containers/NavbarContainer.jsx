'use strict';


/*
components/Navbar.jsx
*/

import React from 'react';
import Navbar from '../components/Navbar';
import UserStore from '../stores/UserStore';
import UserActionCreators from '../actions/UserActionCreators';

import ModalActionCreators from '../actions/ModalActionCreators';

import UIStore from '../stores/UIStore';
import UIActionCreators from '../actions/UIActionCreators';



export default React.createClass({
  getInitialState: function() {
    return {
      navbarIsExpanded: false,
      UIStoreState: UserStore.getState(),
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

  onToggle: function() {
    console.log('in onToggle of NavbarContainer');
    // this.setState({navbarIsExpanded: !this.state.navbarIsExpanded});
    UIActionCreators.toggleNavbar();
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onUserStoreChange);
    UIStore.addChangeListener(this._onUIStoreChange);
  },


  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onUserStoreChange);
    UIStore.removeChangeListener(this._onUIStoreChange);
  },

  render: function() {
    return (
      <Navbar
        openModalToRegister={this.openModalToRegister}
        openModalToLogin={this.openModalToLogin}
        openChangePasswordModal={this.openChangePasswordModal}
        handleLogout={this.handleLogout}
        onToggle={this.onToggle}
        navbarIsExpanded={this.state.UIStoreState.navbarIsExpanded}
        userStoreState={this.state.userStoreState}
      />
    );
  },

  _onUserStoreChange: function() {
    this.setState({userStoreState: UserStore.getState()});
  },

  _onUIStoreChange: function() {
    this.setState({UIStoreState: UIStore.getState()});
  }

});
