'use strict';

/*
components/App.jsx

*/

import React from 'react';
// import {IndexLink } from 'react-router';
import PollContainer from '../containers/PollContainer';
import ModalContainer from '../containers/ModalContainer';
import NavbarContainer from '../containers/NavbarContainer';
import ReactPropTypes from 'react/lib/ReactPropTypes';


export default React.createClass({
  propTypes: {
    location: ReactPropTypes.object.isRequired
  },

  render: function() {
    // console.log('this.props is', this.props);
    // console.log('props:' , this.props);
    // this.props.location.pathname
    return (
      <div>
        <NavbarContainer location={this.props.location.pathname}/>
        <ModalContainer poll_id={this.props.params != null ? this.props.params.poll_id : null}/>
        <br />
        <div className='app-body container jumbotron well'>
          {this.props.location.pathname == '/' ? <PollContainer /> : this.props.children}
        </div>
      </div>
    );
  }
});
