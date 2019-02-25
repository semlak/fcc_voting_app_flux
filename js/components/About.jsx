'use strict';


/*
components/About.jsx
*/

import React from 'react';

export default React.createClass({
  render() {
    return (
      <div>
        <h2 className='display-inline'>About</h2>
        <p>
          I created this app to fulfill requirements for the freecodecamp.com coding curriculum, and I added some of my own requirements.
        </p>
        <p>
          It is the voting app, an app that one can create and vote on polls, described at <a href="https://www.freecodecamp.com/challenges/build-a-voting-app" target="_blank" rel="noopener noreferrer">https://www.freecodecamp.com/challenges/build-a-voting-app</a>.
          <br />
          <br />
          The project is hosted on github at <a href="https://github.com/semlak/fcc_voting_app_flux" target="_blank" rel="noopener noreferrer">https://github.com/semlak/fcc_voting_app_flux</a>.
          <br />
          <br />
          This web app allows users to create polls, vote on them, share them, etc. It uses React.js + Flux Architecture.

          <p>Slightly more info:</p>
          <ul>
            <li>You can create a poll (if logged in).</li>
            <li>You can add an answer option to an existing poll (if logged in).</li>
            <li>You can vote on a poll whether or not you are logged in (you can only vote for a poll once).</li>
            <li>You can delete a poll that you created.</li>
            <li>You can view all polls created (that haven't since been deleted).</li>
            <li>You can filter the polls to see ones created by a specific user.</li>
            <li>You can share a poll (currently done by providing a URL to the poll. There is not a "Share on Facebook/Twitter" feature yet)</li>
            <li>The application uses React.js (a JavaScript framework) with a Flux architecture for the front-end, and node.js/Express 4 server with a Mongo database on the back-end.</li>
            <li>For authentication, the application uses the Passport.js module for node.js. I haven't currently implemented OAuth strategy support, only username/password strategy.</li>
          </ul>
        </p>

      </div>
    );
  }

});
