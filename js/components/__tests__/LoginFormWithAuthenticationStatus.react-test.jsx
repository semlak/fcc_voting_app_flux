'use strict';

jest.autoMockOff();

import LoginForm from '../../components/LoginForm';
import React from 'react';
// import Link from '../Link.react';
import renderer from 'react-test-renderer';
// import {searchTree, searchTreeForProps, searchTreeForClassName} from '../../testing/extraFunctions';
import {searchTreeForProps} from '../../testing/extraFunctions';

jest.mock('react-dom');
jest.mock('../../utils/UserWebAPIUtils.js');
import UserActionCreators from '../../actions/UserActionCreators';
import UserServerActionCreators from '../../actions/UserServerActionCreators';

var actualHandleLoginFunction = function(username, password) {
		UserActionCreators.login(username, password);
};

describe('LoginFormWithAuthenticationStatus', function() {
	// var LoginForm;
	var onCancel;
	var handleLogin;

	beforeEach(function() {
		// LoginForm = require('../LoginForm');
		// console.log('\n\n\Pll is', Poll)
		// done()
		onCancel = jest.fn();
		handleLogin = jest.genMockFunction();

	});



	it('displays error message to user when invalid username or password is supplied (after server request), and entered username/password remain', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={actualHandleLoginFunction}
			/>
		);

		let tree = component.toJSON();
		// expect(tree).toMatchSnapshot();

		//populsate userStore with a valid User so that the user can later be authenticated.
		var rawUser = {username: 'simple_username84', fullname: 'Jane Deer', role: 'user', id: 5};
		UserServerActionCreators.receiveCreatedUser(rawUser, null);


		//set state of userStore to no authenticated user;
		UserServerActionCreators.setAuthenticatedUserState({}, {error: false, message_text: null});


		let usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		let passwordNode = searchTreeForProps(tree, {name: 'password'})[0];

		let e1 = {
			target: {
				name: 'username',
				value: 'simple_username84'
			}
		};

		usernameNode.props != null && usernameNode.props.onChange(e1);


		let e2 = {
			target: {
				name: 'password',
				value: 'wrong_password',
			}
		}

		passwordNode.props != null && passwordNode.props.onChange(e2);


		// tree = component.toJSON();
		// usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		// expect(usernameNode.props.value).toBe('simple_username84');
		// console.log('usernameNode:', usernameNode);

		// tree = component.toJSON();
		// passwordNode = searchTreeForProps(tree, {name: 'password'})[0];
		// expect(passwordNode.props.value).toBe('dumb_pa$$word');
		let loginButton = searchTreeForProps(tree, {id: 'login-button'})[0];
		// console.log('loginButton:', loginButton);
		loginButton.props != null && loginButton.props.onClick();
		tree = component.toJSON();
		expect(tree).toMatchSnapshot();


		usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		passwordNode = searchTreeForProps(tree, {name: 'password'})[0];
		expect(usernameNode.props.value).toBe('simple_username84');
		expect(passwordNode.props.value).toBe('wrong_password');

		let helpBlock = searchTreeForProps(tree, {className: 'help-block'})[0];
		// console.log('helpBlock:', helpBlock);
		expect(helpBlock.children[0]).toBe('Invalid username or password.');

		let topFormGroup = searchTreeForProps(tree, {id: 'top-form-group'})[0];
		expect(topFormGroup.props.className).toMatch('has-error');
	});


	// it('displays success message to user when valid username or password is supplied (after server request), and username/password are cleared', () => {
	// 	// Note. The user will not normally see this message, because the login form is usually displayed as a modal, and the modal closes automatically if login is successful.
	// 	// However, I am planning to delay that so user can clearly see that login is successful.

	// 	var component = renderer.create(
	// 		<LoginForm
	// 			onCancel={onCancel}
	// 			handleLogin={actualHandleLoginFunction}
	// 		/>
	// 	);

	// 	//populsate userStore with a valid User so that the user can later be authenticated.
	// 	var rawUser = {username: 'simple_username84', fullname: 'Jane Deer', role: 'user', id: 5};
	// 	UserServerActionCreators.receiveCreatedUser(rawUser, null);


	// 	//set state of userStore to no authenticated user;
	// 	UserServerActionCreators.setAuthenticatedUserState({}, {error: false, message_text: null});

	// 	let tree = component.toJSON();
	// 	// expect(tree).toMatchSnapshot();

	// 	let usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
	// 	let passwordNode = searchTreeForProps(tree, {name: 'password'})[0];

	// 	let e1 = {
	// 		target: {
	// 			name: 'username',
	// 			value: 'simple_username84'
	// 		}
	// 	};

	// 	usernameNode.props != null && usernameNode.props.onChange(e1);


	// 	let e2 = {
	// 		target: {
	// 			name: 'password',
	// 			value: 'dumb_pa$$word',
	// 		}
	// 	}

	// 	passwordNode.props != null && passwordNode.props.onChange(e2);


	// 	// tree = component.toJSON();
	// 	// usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
	// 	// expect(usernameNode.props.value).toBe('simple_username84');
	// 	// console.log('usernameNode:', usernameNode);

	// 	// tree = component.toJSON();
	// 	// passwordNode = searchTreeForProps(tree, {name: 'password'})[0];
	// 	// expect(passwordNode.props.value).toBe('dumb_pa$$word');
	// 	let loginButton = searchTreeForProps(tree, {id: 'login-button'})[0];
	// 	// console.log('loginButton:', loginButton);
	// 	loginButton.props != null && loginButton.props.onClick();
	// 	tree = component.toJSON();
	// 	expect(tree).toMatchSnapshot();

	// 	usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
	// 	passwordNode = searchTreeForProps(tree, {name: 'password'})[0];
	// 	expect(usernameNode.props.value).toBe('');
	// 	expect(passwordNode.props.value).toBe('');

	// 	let helpBlock = searchTreeForProps(tree, {className: 'help-block'})[0];
	// 	// console.log('helpBlock:', helpBlock);
	// 	expect(helpBlock.children[0]).toBe('Login successful.');

	// 	let topFormGroup = searchTreeForProps(tree, {id: 'top-form-group'})[0];
	// 	expect(topFormGroup.props.className).toMatch('has-success');
	// });

});
