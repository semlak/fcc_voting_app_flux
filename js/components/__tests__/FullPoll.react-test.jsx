'use strict';

jest.autoMockOff();


import React from 'react';
// import Link from '../Link.react';
import renderer from 'react-test-renderer';

jest.mock('react-dom');
jest.mock('../PollChart');

<<<<<<< HEAD
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

=======
import {searchTree, searchTreeForProps, searchTreeForClassName} from '../../testing/extraFunctions';
>>>>>>> more_tests


const openDeletePollModal = function() {return true;};
const openSharePollModal = openDeletePollModal;
const backToPollList = jest.fn();
const handleAddAnswerOption = openDeletePollModal;
const closeModal = openDeletePollModal;
const deletePollRequest = openDeletePollModal;
const currentUser = {};

var funct = jest.fn();

describe('FullPoll', function() {
  var FullPoll;

  beforeEach(function() {
    FullPoll = require('../FullPoll');
    // console.log('\n\n\Pll is', Poll)
    // done()
  });

  it('has an author and a question', () => {
    var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: ["Very cute!"], id: 1, votes: []}
    const component = renderer.create(
      <FullPoll
      	poll={poll}
      	openDeletePollModal={openDeletePollModal}
      	openSharePollModal={openSharePollModal}
      	backToPollList={backToPollList}
      	handleAddAnswerOption={handleAddAnswerOption}
      	closeModal={closeModal}
      	deletePollRequest={deletePollRequest}
      	currentUser={currentUser}
      	modalToShow='none'
      	modalMessage=''
      	new_answer_option=''
			/>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    // console.log('tree.children:', tree.children);
    expect(tree.children.length).toBe(4);

    expect(tree.children[0].props.className).toBe('container');

    expect(searchTreeForClassName(tree, 'header-column')[0].children[0]).toBe('Single Poll Listing');
    expect(searchTree(tree, 'Poll Author: ')[0].children[1].children[0]).toBe('Xena');
    expect(searchTree(tree, 'Poll Question: ')[0].children[1].children[0]).toBe('How cute is Xena?');
  });

  it('has an answer option box', () => {
    var poll = {author: 'Kronos', question: 'What time do you wake up?', answer_options: ["7:00am", '7:30am', "8:00am"], id: 2, votes: []}
    const component = renderer.create(
      <FullPoll
      	poll={poll}
      	openDeletePollModal={openDeletePollModal}
      	openSharePollModal={openSharePollModal}
      	backToPollList={backToPollList}
      	handleAddAnswerOption={handleAddAnswerOption}
      	closeModal={closeModal}
      	deletePollRequest={deletePollRequest}
      	currentUser={currentUser}
      	modalToShow='none'
      	modalMessage=''
      	new_answer_option=''
			/>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    // console.log('tree.children:', tree.children);
    expect(tree.children.length).toBe(4);

    expect(tree.children[0].props.className).toBe('container');

    expect(searchTreeForClassName(tree, 'header-column')[0].children[0]).toBe('Single Poll Listing');
    expect(searchTree(tree, 'Poll Author: ')[0].children[1].children[0]).toBe('Kronos');
    expect(searchTree(tree, 'Poll Question: ')[0].children[1].children[0]).toBe('What time do you wake up?');

    let answerOptionsBox = searchTreeForClassName(tree, 'answer-options-box')[0];
    let answerOptionsList = answerOptionsBox.children[0];
    // console.log(JSON.stringify(answerOptionsList));

    // Verify that the answerOptionsList contains three answers.
    expect(answerOptionsList.children[0].children.length).toBe(3);

    // verify the presence of answer_options
    expect(searchTree(tree, "7:00am")[0].children[0]).toBe('7:00am');
    expect(searchTree(tree, '7:30am')[0].children[0]).toBe('7:30am');
    expect(searchTree(tree, '8:00am')[0].children[0]).toBe('8:00am');



    let node1 = searchTreeForProps(tree, {className: 'poll-author'})[0];
    expect(node1.children[0]).toBe('Poll Author: ');
    expect(node1.children[1].children[0]).toBe('Kronos');

	});
});
