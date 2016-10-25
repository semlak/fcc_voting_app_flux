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
		handleLogin = jest.fn();

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

		let node1 = searchTreeForProps(tree, {name: 'username'});
		let node2 = searchTreeForProps(tree, {name: 'password'});
		expect(node1.props.name).toBe('username');
		expect(node1.props.value).toBe('');
		expect(node1.props.placeholder).toBe('Enter Username');
		expect(node1.props.type).toBe('text');
		expect(node1.props.className).toBe('form-control');


		expect(node2.props.name).toBe('password');
		expect(node2.props.value).toBe('');
		expect(node2.props.placeholder).toBe('Enter Password');
		expect(node2.props.type).toBe('password');
		expect(node2.props.className).toBe('form-control');

		// console.log('node2:', node2);
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

		let node1 = searchTreeForProps(tree, {name: 'username'});
		let node2 = searchTreeForProps(tree, {name: 'password'});

		let e1 = {
			target: {
				name: 'username',
				value: 'simple_username84'
			}
		};
		node1.props.onChange(e1);

		tree = component.toJSON();
		node1 = searchTreeForProps(tree, {name: 'username'});
		expect(node1.props.value).toBe('simple_username84');
		// console.log('node1:', node1);

		let e2 = {
			target: {
				name: 'password',
				value: 'dumb_pa$$word'
			}
		}

		node2.props.onChange(e2);
		tree = component.toJSON();
		node2 = searchTreeForProps(tree, {name: 'password'});
		expect(node2.props.value).toBe('dumb_pa$$word');



		// console.log('node2:', node2);
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

		let node1 = searchTreeForProps(tree, {name: 'username'});
		let node2 = searchTreeForProps(tree, {name: 'password'});

		let e1 = {
			target: {
				name: 'username',
				value: 'simple_username84'
			}
		};

		node1.props != null && node1.props.onChange(e1);


		let e2 = {
			target: {
				name: 'password',
				value: 'dumb_pa$$word',
			}
		}

		node2.props != null && node2.props.onChange(e2);


		// tree = component.toJSON();
		// node1 = searchTreeForProps(tree, {name: 'username'});
		// expect(node1.props.value).toBe('simple_username84');
		// console.log('node1:', node1);

		// tree = component.toJSON();
		// node2 = searchTreeForProps(tree, {name: 'password'});
		// expect(node2.props.value).toBe('dumb_pa$$word');
		let loginButton = searchTreeForProps(tree, {id: 'login-button'});
		console.log('loginButton:', loginButton);
		loginButton.props != null && loginButton.props.onClick();

		expect(handleLogin).toHaveBeenCalledTimes(1);
		expect(handleLogin).toHaveBeenCalledWith('simple_username84', 'dumb_pa$$word');

		// console.log('node2:', node2);
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

		let node1 = searchTreeForProps(tree, {name: 'username'});
		let node2 = searchTreeForProps(tree, {name: 'password'});

		let e1 = {
			target: {
				name: 'username',
				value: 'simple_username84'
			}
		};
		node1.props != null && node1.props.onChange(e1);

		tree = component.toJSON();
		node1 = searchTreeForProps(tree, {name: 'username'});
		expect(node1.props.value).toBe('simple_username84');
		// console.log('node1:', node1);

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

		node2.props != null && node2.props.onChange(e2);
		tree = component.toJSON();
		node2 = searchTreeForProps(tree, {name: 'password'});
		expect(node2.props.value).toBe('dumb_pa$$word');

		let node3 = searchTreeForProps(tree, {className: 'sign-in-form'});
		node3.props != null && node3.props.onKeyPress(e3);
		expect(handleLogin).toHaveBeenCalledTimes(1);

		// console.log('node2:', node2);
		// var a = 1;
		// expect(a).toBeGreaterThan(0);

	});


});
