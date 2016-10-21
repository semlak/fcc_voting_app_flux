/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * UserStore-test
 */

// jest.autoMockOff();
// jest.autoMockOn();

// jest.dontMock('../../constants/UserConstants');
// jest.dontMock('../UserStore');
jest.mock('../../dispatcher/AppDispatcher');
var generateTempId = function() {
	var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
	return id;
}

import UserConstants from '../../constants/UserConstants';

describe('UserStore', function() {
	it('should be a sample test', function() {
		expect(1).toEqual(1);
	})



	var AppDispatcher;
	var UserStore;
	var callback;

	// mock actions
	var actionUserCreate = {
		actionType: UserConstants.USER_CREATE,
		rawUser: {username: 'foo', fullname: 'bar', role: 'user', id: generateTempId()}
		// text: 'foo'
	};

	var actionUserCreateEmptyUsername = {
		actionType: UserConstants.USER_CREATE,
		rawUser: {username: '', fullname: 'bar', role: 'user', id: generateTempId()}
		// text: 'foo'
	};

	var actionUserCreateAdmin = {
		actionType: UserConstants.USER_CREATE,
		rawUser: {username: 'john', fullname: 'john doe', role: 'admin', id: generateTempId()}
	};

	var actionUserDestroy = {
		actionType: UserConstants.USER_DESTROY,
		id: 'replace me in test'
	};


	var actionUserDestroyAll = {
		actionType: UserConstants.USER_DESTROY_ALL,
	};


	var actionUserUpdate = {
		actionType: UserConstants.USER_UPDATE,
		//update this 'rawUser' object during test
		rawUser: {username: null, fullname: null, role: null, id: 'replace me in test'}
	};


	beforeEach(function() {
		AppDispatcher = require('../../dispatcher/AppDispatcher');
		UserStore = require('../UserStore');

		// console.log("user store is:", UserStore.getAll());
		// console.log('\n\n\nAppDispatcher.register is', AppDispatcher.register)
		// console.log('\n\n\nAppDispatcher.register is', AppDispatcher.register.mock)
		callback = AppDispatcher.register.mock.calls[0][0];

		//clear user store.
		callback(actionUserDestroyAll);
	});

	it('registers a callback with the dispatcher', function() {
		expect(AppDispatcher.register.mock.calls.length).toBe(1);
	});

	it('should initialize with no user items', function() {
		var all = UserStore.getAll();
		expect(all).toEqual({});
	});

	it('creates a user', function() {
		callback(actionUserCreate);
		var all = UserStore.getAll();
		var keys = Object.keys(all);
		// console.log("all:", all);
		expect(keys.length).toBe(1);
		expect(all[keys[0]].username).toEqual('foo');
    expect(all[keys[0]].fullname).toEqual('bar');
		expect(all[keys[0]].role).toEqual('user');

		//test UserByUsername
		var userByUsername = UserStore.getUserByUsername('foo');
		expect(userByUsername.username).toEqual('foo');
		expect(userByUsername.fullname).toEqual('bar');
    expect(userByUsername.role).toEqual('user');

	});


	it('does not create a user if username is empty', function() {
		callback(actionUserCreateEmptyUsername);
		var all = UserStore.getAll();
		var keys = Object.keys(all);
		// console.log("all:", all);
		expect(keys.length).toBe(0);
	});


	it('does not create two users if usernames are the same', function() {
		callback(actionUserCreate);
		callback(actionUserCreate);
		var all = UserStore.getAll();
		var keys = Object.keys(all);
		expect(keys.length).toBe(1);
		expect(all[keys[0]].username).toEqual('foo');
		expect(all[keys[0]].fullname).toEqual('bar');
    expect(all[keys[0]].role).toEqual('user');
	});


	it('destroys a user item', function() {
		callback(actionUserCreate);
		var all = UserStore.getAll();
		var keys = Object.keys(all);
		expect(keys.length).toBe(1);
		actionUserDestroy.id = keys[0];
		callback(actionUserDestroy);

    var all_1 = UserStore.getAll();
    var keys_1 = Object.keys(all_1);
    expect(keys_1.length).toBe(0);
		expect(all_1[keys_1[0]]).toBeUndefined();
	});

	it('edits a username', function() {
		callback(actionUserCreate);
		var all = UserStore.getAll();
		var keys = Object.keys(all);
		expect(keys.length).toBe(1);

		// update username
		let newUsername = 'foofoo'
		actionUserUpdate.rawUser = Object.assign ({}, all[keys[0]], {username: newUsername});
		callback(actionUserUpdate);

		// verify
		expect(all[keys[0]].username).toEqual('foofoo');
		expect(all[keys[0]].fullname).toEqual('bar');
    expect(all[keys[0]].role).toEqual('user');
	});


	it('edits a fullname', function() {
		callback(actionUserCreate);
		var all = UserStore.getAll();
		var keys = Object.keys(all)
		expect(keys.length).toBe(1);

		// update fullname
		let newFullname = 'barbar'
		actionUserUpdate.rawUser = Object.assign ({}, all[keys[0]], {fullname: newFullname});
		callback(actionUserUpdate);

		keys = Object.keys(UserStore.getAll());
		expect(all[keys[0]].username).toEqual('foo');
		expect(all[keys[0]].fullname).toEqual('barbar');
    expect(all[keys[0]].role).toEqual('user');
	});


	it('edits a username and fullname at the same time', function() {
		callback(actionUserCreate);
		var all = UserStore.getAll();
		var keys = Object.keys(all)
		expect(keys.length).toBe(1);

		// update username and fullname
		let newUsername = 'foofoo'
		let newFullname = 'barbar'
		actionUserUpdate.rawUser = Object.assign ({}, all[keys[0]], {username: newUsername, fullname: newFullname});
		callback(actionUserUpdate);

		keys = Object.keys(UserStore.getAll());
		expect(all[keys[0]].username).toEqual('foofoo');
		expect(all[keys[0]].fullname).toEqual('barbar');
    expect(all[keys[0]].role).toEqual('user');
	});


	it('does not allow a username to be edited to an empty string', function() {
		callback(actionUserCreate);
		var all = UserStore.getAll();
		var keys = Object.keys(all);
		expect(keys.length).toBe(1);

		// update username
		let newUsername = ''
		actionUserUpdate.rawUser = Object.assign ({}, all[keys[0]], {username: newUsername});
		callback(actionUserUpdate);

		// verify
		all = UserStore.getAll();
		keys = Object.keys(all);
		expect(all[keys[0]].username).toEqual('foo');
		expect(all[keys[0]].fullname).toEqual('bar');
    expect(all[keys[0]].role).toEqual('user');
	});


	it('does allow a fullname to be edited to an empty string', function() {
    callback(actionUserCreate);
    var all = UserStore.getAll();
    var keys = Object.keys(all);
    expect(keys.length).toBe(1);

    // update username
    let newFullname = ''
    actionUserUpdate.rawUser = Object.assign ({}, all[keys[0]], {fullname: newFullname});
    callback(actionUserUpdate);

    // verify
    all = UserStore.getAll();
    keys = Object.keys(all);
    expect(all[keys[0]].username).toEqual('foo');
    expect(all[keys[0]].fullname).toEqual('');
    expect(all[keys[0]].role).toEqual('user');
	});



  it('creates an \'admin\' user', function() {
    //Note: server will not allow non-admin to create an 'admin' user
    callback(actionUserCreateAdmin);
    var all = UserStore.getAll();
    var keys = Object.keys(all);
    // console.log("all:", all);
    expect(keys.length).toBe(1);
    expect(all[keys[0]].username).toEqual('john');
    expect(all[keys[0]].fullname).toEqual('john doe');
    expect(all[keys[0]].role).toEqual('admin');
  });


  it('changes a user role to \'admin\'', function() {
    callback(actionUserCreate);
    var all = UserStore.getAll();
    var keys = Object.keys(all)
    expect(keys.length).toBe(1);
    expect(all[keys[0]].role).toEqual('user');

    // update role. Note: server will not allow non-admin to update user to 'admin'
    let newRole = 'admin'
    actionUserUpdate.rawUser = Object.assign ({}, all[keys[0]], {role: newRole});
    callback(actionUserUpdate);

    expect(all[keys[0]].username).toEqual('foo');
    expect(all[keys[0]].fullname).toEqual('bar');
    expect(all[keys[0]].role).toEqual('admin');
  });

  it('changes a user role to \'user\'', function() {
    callback(actionUserCreateAdmin);
    var all = UserStore.getAll();
    var keys = Object.keys(all)
    expect(keys.length).toBe(1);

    // update role. Note: server will not allow non-admin to update user to 'admin'
    let newRole = 'user'
    actionUserUpdate.rawUser = Object.assign ({}, all[keys[0]], {role: newRole});
    callback(actionUserUpdate);

    keys = Object.keys(UserStore.getAll());
    expect(all[keys[0]].username).toEqual('john');
    expect(all[keys[0]].fullname).toEqual('john doe');
    expect(all[keys[0]].role).toEqual('user');
  });

  it('creates two users', function() {
    callback(actionUserCreate);
    callback(actionUserCreateAdmin);

    var all = UserStore.getAll();
    var keys = Object.keys(all);
    // console.log("all:", all);
    expect(keys.length).toBe(2);
    expect(all[keys[0]].username).toEqual('foo');
    expect(all[keys[0]].fullname).toEqual('bar');
    expect(all[keys[0]].role).toEqual('user');
    expect(all[keys[1]].username).toEqual('john');
    expect(all[keys[1]].fullname).toEqual('john doe');
    expect(all[keys[1]].role).toEqual('admin');
  });

  it('destroys one user without removing other users', function() {
    callback(actionUserCreate);
    callback(actionUserCreateAdmin);

    var all = UserStore.getAll();
    var keys = Object.keys(all);
    // console.log("all:", all);
    expect(keys.length).toBe(2);
    expect(all[keys[0]].username).toEqual('foo');
    expect(all[keys[0]].fullname).toEqual('bar');
    expect(all[keys[0]].role).toEqual('user');
    expect(all[keys[1]].username).toEqual('john');
    expect(all[keys[1]].fullname).toEqual('john doe');
    expect(all[keys[1]].role).toEqual('admin');

    actionUserDestroy.id = keys[0];
    callback(actionUserDestroy);

    var all_1 = UserStore.getAll();
    var keys_1 = Object.keys(all_1);
    expect(keys_1.length).toBe(1);
    expect(all_1[keys_1[0]].username).toEqual('john');
    expect(all_1[keys_1[0]].fullname).toEqual('john doe');
    expect(all_1[keys_1[0]].role).toEqual('admin');
  });
});
