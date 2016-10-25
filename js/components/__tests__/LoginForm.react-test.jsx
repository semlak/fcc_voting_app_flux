'use strict';

jest.autoMockOff();

import LoginForm from '../LoginForm';
import React from 'react';
// import Link from '../Link.react';
import renderer from 'react-test-renderer';

jest.mock('react-dom');
jest.mock('../PollChart');


var searchTree = function(root, str) {
// http://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
	var stack = [], node, ii;
	stack.push(root);

	while (stack.length > 0) {
		node = stack.pop();
		if (node.children && node.children[0] == str) {
			// Found it!
			return node;
		}
		else if (node.children && node.children.length) {
			for (ii = 0; ii < node.children.length; ii += 1) {
				stack.push(node.children[ii]);
			}
		}
	}
	return null;
}

var searchTreeForProps = function(root, props) {
// http://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
	var stack = [], node, ii;
	stack.push(root);
	if (root == null || props == null) {
		console.log("need to pass both a root element and props to check");
		return null;
	}

	while (stack.length > 0) {
		node = stack.pop();
		if (node.props) {
			// console.log("node.props: ", node.props);
			for (var key in props) {
				// console.log("checking: key:", key, ", node.props[key]: ", node.props[key], ", props[key]:", props[key]);
				if (node.props[key] != null && node.props[key] === props[key]) {
					// Found it!
					return node;
				}
			}
		}
		if (node.children && node.children.length) {
			for (ii = 0; ii < node.children.length; ii += 1) {
				stack.push(node.children[ii]);
			}
		}
	}
	return null;
}


var searchTreeForClassName = function(root, str) {
// http://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
	var stack = [], node, ii;
	stack.push(root);

	while (stack.length > 0) {
		node = stack.pop();
		if (node.props && node.props.className == str) {
			// Found it!
			return node;
		}
		else if (node.children && node.children.length) {
			for (ii = 0; ii < node.children.length; ii += 1) {
				stack.push(node.children[ii]);
			}
		}
	}
	return null;
}




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
		// expect(tree).toMatchSnapshot();
		// console.log('tree.children:', tree.children);
		expect(tree.children.length).toBe(2);

		expect(tree.children[0].props.className).toBe('modal-body');

		let usernameNode = searchTreeForProps(tree, {name: 'username'});
		let passwordNode = searchTreeForProps(tree, {name: 'password'});
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

		// console.log('passwordNode:', passwordNode);
		// var a = 1;
		// expect(a).toBeGreaterThan(0);


	});


	it('responds to changes in username and password fields', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
		// console.log('tree.children:', tree.children);

		let usernameNode = searchTreeForProps(tree, {name: 'username'});
		let passwordNode = searchTreeForProps(tree, {name: 'password'});

		let e1 = {
			target: {
				name: 'username',
				value: 'simple_username84'
			}
		};
		usernameNode.props.onChange(e1);

		tree = component.toJSON();
		usernameNode = searchTreeForProps(tree, {name: 'username'});
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
		passwordNode = searchTreeForProps(tree, {name: 'password'});
		expect(passwordNode.props.value).toBe('dumb_pa$$word');



		// console.log('passwordNode:', passwordNode);
		// var a = 1;
		// expect(a).toBeGreaterThan(0);

	});



	it('calls the handleLogin callback with username and password as arguments when button clicked', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
		// console.log('tree.children:', tree.children);

		let usernameNode = searchTreeForProps(tree, {name: 'username'});
		let passwordNode = searchTreeForProps(tree, {name: 'password'});

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
		// usernameNode = searchTreeForProps(tree, {name: 'username'});
		// expect(usernameNode.props.value).toBe('simple_username84');
		// console.log('usernameNode:', usernameNode);

		// tree = component.toJSON();
		// passwordNode = searchTreeForProps(tree, {name: 'password'});
		// expect(passwordNode.props.value).toBe('dumb_pa$$word');
		let loginButton = searchTreeForProps(tree, {id: 'login-button'});
		// console.log('loginButton:', loginButton);
		loginButton.props != null && loginButton.props.onClick();

		expect(handleLogin).toHaveBeenCalledTimes(1);
		expect(handleLogin).toBeCalledWith('simple_username84', 'dumb_pa$$word');
		expect(handleLogin).lastCalledWith('simple_username84', 'dumb_pa$$word');


		// console.log('passwordNode:', passwordNode);
		// var a = 1;
		// expect(a).toBeGreaterThan(0);

	});






	it('automatically calls the handleLogin callback if enter is pressed while either input field is active', () => {

		var component = renderer.create(
			<LoginForm
				onCancel={onCancel}
				handleLogin={handleLogin}
			/>
		);

		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
		// console.log('tree.children:', tree.children);

		let usernameNode = searchTreeForProps(tree, {name: 'username'});
		let passwordNode = searchTreeForProps(tree, {name: 'password'});

		let e1 = {
			target: {
				name: 'username',
				value: 'simple_username84'
			}
		};
		usernameNode.props != null && usernameNode.props.onChange(e1);

		tree = component.toJSON();
		usernameNode = searchTreeForProps(tree, {name: 'username'});
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
		passwordNode = searchTreeForProps(tree, {name: 'password'});
		expect(passwordNode.props.value).toBe('dumb_pa$$word');

		let node3 = searchTreeForProps(tree, {className: 'sign-in-form'});
		node3.props != null && node3.props.onKeyPress(e3);
		expect(handleLogin).toHaveBeenCalledTimes(1);

		// console.log('passwordNode:', passwordNode);
		// var a = 1;
		// expect(a).toBeGreaterThan(0);

	});


});
