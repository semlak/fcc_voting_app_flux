import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
// import {Router, Route, hashHistory, IndexRoute} from 'react-router'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import About from './components/About'
import Home from './components/Home'
import RegistrationForm from './components/RegistrationForm'
import LoginForm from './components/LoginForm'
import UserListContainer from './components/UserListContainer'
import FullUser from './components/FullUser'
import UserActionCreators from './actions/UserActionCreators'
var PollActionCreators = require('./actions/PollActionCreators');

import PollBox from './components/PollBox'
import FullPoll from './components/FullPoll'
import NewPollForm from './components/NewPollForm'
// render(<App/>, document.getElementById('app'))

// render((
// 	<Router history={hashHistory}>
// 		<Route path='/' component={App} />
// 	</Router>
// ), document.getElementById('app'))


render((
	<Router history={browserHistory}>
		<Route path='/' component={App}>
			<IndexRoute component={Home} />
			<Route path='/about' component={About}/>
			<Route path='/polls' component={PollBox}>
				<Route path='/users/:userPollsToRender/polls' component={PollBox} />
			</Route>
			<Route path='/new_poll' component={NewPollForm} />
			<Route path='/polls/:poll_id' component={FullPoll} />
			<Route path='/register' component={RegistrationForm} />
			<Route path='/login' component={LoginForm} />
			<Route path='/users' component={UserListContainer}>
			</Route>
			<Route path='/users/:username' component={FullUser} />

		</Route>
	</Router>
), document.getElementById('app'))

UserActionCreators.getAllFromServer();
PollActionCreators.getAllFromServer();
