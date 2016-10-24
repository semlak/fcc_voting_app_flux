'use strict';

jest.autoMockOff();


import React from 'react';
// import Link from '../Link.react';
import renderer from 'react-test-renderer';

jest.mock('react-dom');
jest.mock('../PollChart');


		// poll: ReactPropTypes.object.isRequired,
		// openDeletePollModal: React.PropTypes.func.isRequired,
		// openSharePollModal: React.PropTypes.func.isRequired,
		// currentUser: ReactPropTypes.object.isRequired,
		// backToPollList: React.PropTypes.func.isRequired,
		// handleAddAnswerOption: React.PropTypes.func.isRequired,
		// closeModal: React.PropTypes.func.isRequired,
		// modalToShow: React.PropTypes.string.isRequired,
		// modalMessage: React.PropTypes.string.isRequired,
		// new_answer_option: React.PropTypes.string.isRequired,
		// deletePollRequest: React.PropTypes.func.isRequired

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

	while (stack.length > 0) {
		node = stack.pop();
		if (node.props) {
			for (var key in props) {
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



const openDeletePollModal = function() {return true;};
const openSharePollModal = openDeletePollModal;
const backToPollList = openDeletePollModal;
const handleAddAnswerOption = openDeletePollModal;
const closeModal = openDeletePollModal;
const deletePollRequest = openDeletePollModal;
const currentUser = {};

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
    // expect(tree.children[0].children[0].children[0].children[0].props.className).toBe('header-column');
    // expect(tree.children[0].children[0].children[0].children[0].children[0]).toBe('Single Poll Listing');

    // expect(tree.children[2].children[0].children[0].children[0].children[0].children[0]).toBe('Poll Author: ');
    // expect(tree.children[2].children[0].children[0].children[0].children[0].children[1].children[0]).toBe('Xena');

    // expect(tree.children[2].children[0].children[0].children[0].children[1].children[0]).toBe('Poll Question: ');
    // expect(tree.children[2].children[0].children[0].children[0].children[1].children[1].children[0]).toBe('How cute is Xena?');

    expect(searchTreeForClassName(tree, 'header-column').children[0]).toBe('Single Poll Listing');
    expect(searchTree(tree, 'Poll Author: ').children[1].children[0]).toBe('Xena');
    expect(searchTree(tree, 'Poll Question: ').children[1].children[0]).toBe('How cute is Xena?');


    // expect(tree.children[2].children[0].children[0].children[0].children[2].children[0].props.className).toBe('answer-options-box');
    // expect(tree.children[2].children[0].children[0].children[0].children[2].children[1].chi
    // expect(tree.children[0].props.className).toBe('poll-author poll-label');
    // expect(tree.children[0].children.length).toBe(2);
    // expect(tree.children[0].children[0]).toBe('Poll Author: ');
    // expect(tree.children[0].children[1].children[0]).toBe('Xena');

    // expect(tree.children[1].children.length).toBe(2);
    // expect(tree.children[1].children[0]).toBe('Poll Question: ');
    // expect(tree.children[1].children[1].children[0]).toBe('How cute is Xena?');

    // console.log('tree.children[1]:', tree.children[1]);

    // var a = 1;
    // expect(a).toBe(1)

    // manually trigger the callback
    // tree.props.onMouseEnter();
    // re-rendering
    // tree = component.toJSON();
    // expect(tree).toMatchSnapshot();

    // manually trigger the callback
    // tree.props.onMouseLeave();
    // re-rendering
    // tree = component.toJSON();
    // expect(tree).toMatchSnapshot();
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
    // expect(tree.children[0].children[0].children[0].children[0].props.className).toBe('header-column');
    // expect(tree.children[0].children[0].children[0].children[0].children[0]).toBe('Single Poll Listing');

    // expect(tree.children[2].children[0].children[0].children[0].children[0].children[0]).toBe('Poll Author: ');
    // expect(tree.children[2].children[0].children[0].children[0].children[0].children[1].children[0]).toBe('Kronos');

    // expect(tree.children[2].children[0].children[0].children[0].children[1].children[0]).toBe('Poll Question: ');
    // expect(tree.children[2].children[0].children[0].children[0].children[1].children[1].children[0]).toBe('What time do you wake up?');

    expect(searchTreeForClassName(tree, 'header-column').children[0]).toBe('Single Poll Listing');
    expect(searchTree(tree, 'Poll Author: ').children[1].children[0]).toBe('Kronos');
    expect(searchTree(tree, 'Poll Question: ').children[1].children[0]).toBe('What time do you wake up?');

    // expect(tree.children[2].children[0].children[0].children[0].children[2].children[0].props.className).toBe('answer-options-box');
    // expect(tree.children[2].children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[0]).toBe('answer-options-box');
    // expect(tree.children[2].children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[0].children[1].children[0].children[0]).toBe('7:00am');
    let answerOptionsBox = searchTreeForClassName(tree, 'answer-options-box');
    let answerOptionsList = answerOptionsBox.children[0];
    // console.log(JSON.stringify(answerOptionsList));

    expect(searchTree(tree, "7:00am").children[0]).toBe('7:00am');
    expect(searchTree(tree, '7:30am').children[0]).toBe('7:30am');
    expect(searchTree(tree, '8:00am').children[0]).toBe('8:00am');

    // Verify that the answerOptionsList contains three answers.
    expect(answerOptionsList.children[0].children.length).toBe(3);

    expect(answerOptionsList.children[0].children[0].children[1].children[0].children[0]).toBe('7:00am');
    // let node0 = searchTree(tree, "7:00am");
    // // console.log('node:', node);
    // expect(searchTree(tree, '7:30am').children[0]).toBe('7:30am');
    // let node1 = searchTree(tree, '8:00am');
    // expect(node1.children[0]).toBe('8:00am');

    let node1 = searchTreeForProps(tree, {className: 'poll-author poll-label'});
    // console.log('node1: ', node1);
    expect(node1.children[0]).toBe('Poll Author: ');
    expect(node1.children[1].children[0]).toBe('Kronos');

	});
});
