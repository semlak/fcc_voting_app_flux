'use strict';

jest.autoMockOff();

import LoginForm from '../LoginForm';
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

describe('LoginForm', function() {
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

	it('has has username and password input fields', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
		// console.log('tree.children:', tree.children);
		expect(tree.children.length).toBe(2);

		expect(tree.children[0].props.className).toBe('modal-body');

		let usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		let passwordNode = searchTreeForProps(tree, {name: 'password'})[0];
		expect(usernameNode.props.name).toBe('username');
		expect(usernameNode.props.value).toBe('');
		expect(usernameNode.props.placeholder).toBe('Enter Username');
		expect(usernameNode.props.type).toBe('text');
		expect(usernameNode.props.className).toBe('form-control');


		expect(passwordNode.props.name).toBe('password');
		expect(passwordNode.props.value).toBe('');
		expect(passwordNode.props.placeholder).toBe('Enter Password');
		expect(passwordNode.props.type).toBe('password');
		expect(passwordNode.props.className).toBe('form-control');


	});


	it('responds to changes in username and password fields', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		// expect(tree).toMatchSnapshot();
		// console.log('tree.children:', tree.children);

		let usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		let passwordNode = searchTreeForProps(tree, {name: 'password'})[0];

		let e1 = {
			target: {
				name: 'username',
				value: 'simple_username84'
			}
		};
		usernameNode.props.onChange(e1);

		tree = component.toJSON();
		usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		expect(usernameNode.props.value).toBe('simple_username84');
		// console.log('usernameNode:', usernameNode);

		let e2 = {
			target: {
				name: 'password',
				value: 'dumb_pa$$word'
			}
		}

		passwordNode.props.onChange(e2);
		tree = component.toJSON();
		passwordNode = searchTreeForProps(tree, {name: 'password'})[0];
		expect(passwordNode.props.value).toBe('dumb_pa$$word');

		expect(tree).toMatchSnapshot();

	});



	it('calls the handleLogin callback with username and password as arguments when sign-in button clicked', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		// expect(tree).toMatchSnapshot();

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
				value: 'dumb_pa$$word',
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

		expect(handleLogin).toHaveBeenCalledTimes(1);
		expect(handleLogin).toBeCalledWith('simple_username84', 'dumb_pa$$word');
		expect(handleLogin).lastCalledWith('simple_username84', 'dumb_pa$$word');

	});






	it('automatically calls the handleLogin callback if \'enter\' key is pressed while either input field is active', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		// expect(tree).toMatchSnapshot();

		let usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		let passwordNode = searchTreeForProps(tree, {name: 'password'})[0];

		let e1 = {
			target: {
				name: 'username',
				value: 'simple_username84'
			}
		};
		usernameNode.props != null && usernameNode.props.onChange(e1);

		tree = component.toJSON();
		usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		expect(usernameNode.props.value).toBe('simple_username84');
		// console.log('usernameNode:', usernameNode);

		let e2 = {
			target: {
				name: 'password',
				value: 'dumb_pa$$word',
			}
		}

		let e3 = {
			target: {
				name: 'password',
				value: 'dumb_pa$$word',
			},
			key: 'Enter'
		}

		passwordNode.props != null && passwordNode.props.onChange(e2);
		tree = component.toJSON();
		passwordNode = searchTreeForProps(tree, {name: 'password'})[0];
		expect(passwordNode.props.value).toBe('dumb_pa$$word');

		let node3 = searchTreeForProps(tree, {className: 'sign-in-form'})[0];
		node3.props != null && node3.props.onKeyPress(e3);
		expect(handleLogin).toHaveBeenCalledTimes(1);


	});


	it('calls the onCancel callback when cancel button is clicked', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		// expect(tree).toMatchSnapshot();

		let cancelButton = searchTreeForProps(tree, {id: 'cancel-button'})[0];
		// console.log('loginButton:', loginButton);
		cancelButton.props != null && cancelButton.props.onClick();

		expect(onCancel).toHaveBeenCalledTimes(1);

	});




	it('displays error message to user when no username is provided on sign-in attempt, and whatever password entered remains', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		// expect(tree).toMatchSnapshot();

		let passwordNode = searchTreeForProps(tree, {name: 'password'})[0];

		let e2 = {
			target: {
				name: 'password',
				value: 'dumb_pa$$word'
			}
		};

		passwordNode.props != null && passwordNode.props.onChange(e2);

		let loginButton = searchTreeForProps(tree, {id: 'login-button'})[0];
		loginButton.props != null && loginButton.props.onClick();

		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Because the LoginForm has its own function called onClick, the handleLogin mockFunction callback is only called if the username and password are not empty
		expect(handleLogin).toHaveBeenCalledTimes(0);
		expect(handleLogin).not.toHaveBeenCalled();

		let helpBlock = searchTreeForProps(tree, {className: 'help-block'})[0];
		// console.log('helpBlock:', helpBlock);
		expect(helpBlock.children[0]).toBe('Username must be at least one character long.');

		passwordNode = searchTreeForProps(tree, {name: 'password'})[0];
		expect(passwordNode.props.value).toBe('dumb_pa$$word');

		// let formGroups = searchTreeForProps(tree, {className: 'form-group'});
		let topFormGroup = searchTreeForProps(tree, {id: 'top-form-group'})[0];
		// console.log('formGroups:', formGroups);
		// console.log('topFormGroup:', topFormGroup);
		expect(topFormGroup.props.className).toMatch('has-error');

	});



	it('displays error message to user when no password is provided on sign-in attempt, and whatever username entered remains', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		// expect(tree).toMatchSnapshot();

		let usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		let passwordNode = searchTreeForProps(tree, {name: 'password'})[0];

		let e1 = {
			target: {
				name: 'username',
				value: 'simple_username84'
			}
		};

		usernameNode.props != null && usernameNode.props.onChange(e1);

		let loginButton = searchTreeForProps(tree, {id: 'login-button'})[0];
		loginButton.props != null && loginButton.props.onClick();

		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Because the LoginForm has its own function called onClick, the handleLogin mockFunction callback is only called if the username and password are not empty
		expect(handleLogin).toHaveBeenCalledTimes(0);
		expect(handleLogin).not.toHaveBeenCalled();

		usernameNode = searchTreeForProps(tree, {name: 'username'})[0];
		expect(usernameNode.props.value).toBe('simple_username84');

		let helpBlock = searchTreeForProps(tree, {className: 'help-block'})[0];
		// console.log('helpBlock:', helpBlock);
		expect(helpBlock.children[0]).toBe('Password must be at least one character long.');


		let topFormGroup = searchTreeForProps(tree, {id: 'top-form-group'})[0];
		expect(topFormGroup.props.className).toMatch('has-error');

	});


});
