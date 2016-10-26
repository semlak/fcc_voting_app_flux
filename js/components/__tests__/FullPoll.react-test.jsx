'use strict';

jest.autoMockOff();


import React from 'react';
// import Link from '../Link.react';
import renderer from 'react-test-renderer';

jest.mock('react-dom');
jest.mock('../PollChart');

import {searchTree, searchTreeForProps, searchTreeForClassName} from '../../testing/extraFunctions';


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
    // expect(tree.children[0].children[0].children[0].children[0].props.className).toBe('header-column');
    // expect(tree.children[0].children[0].children[0].children[0].children[0]).toBe('Single Poll Listing');

    // expect(tree.children[2].children[0].children[0].children[0].children[0].children[0]).toBe('Poll Author: ');
    // expect(tree.children[2].children[0].children[0].children[0].children[0].children[1].children[0]).toBe('Xena');

    // expect(tree.children[2].children[0].children[0].children[0].children[1].children[0]).toBe('Poll Question: ');
    // expect(tree.children[2].children[0].children[0].children[0].children[1].children[1].children[0]).toBe('How cute is Xena?');

    expect(searchTreeForClassName(tree, 'header-column')[0].children[0]).toBe('Single Poll Listing');
    expect(searchTree(tree, 'Poll Author: ')[0].children[1].children[0]).toBe('Xena');
    expect(searchTree(tree, 'Poll Question: ')[0].children[1].children[0]).toBe('How cute is Xena?');


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
    // let node = searchTreeForProps(tree, {title: "Back to Poll Listing"})[0];
    // console.log("node:", node);
    // node.props != null && node.props.onClick();
    // expect(backToPollList).toHaveBeenCalled();

    // node.props != null && node.props.onClick();
    // let node1 = searchTreeForClassName(tree, 'full-poll-listing')[0];
    // node1.props != null && node1.props.onMouseOver();
    // console.log("node1:", node1);
    // node1.props != null && node1.props.onMouseOver();
    // expect(backToPollList).toHaveBeenCalled();

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

    expect(searchTreeForClassName(tree, 'header-column')[0].children[0]).toBe('Single Poll Listing');
    expect(searchTree(tree, 'Poll Author: ')[0].children[1].children[0]).toBe('Kronos');
    expect(searchTree(tree, 'Poll Question: ')[0].children[1].children[0]).toBe('What time do you wake up?');

    // expect(tree.children[2].children[0].children[0].children[0].children[2].children[0].props.className).toBe('answer-options-box');
    // expect(tree.children[2].children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[0]).toBe('answer-options-box');
    // expect(tree.children[2].children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[0].children[1].children[0].children[0]).toBe('7:00am');
    let answerOptionsBox = searchTreeForClassName(tree, 'answer-options-box')[0];
    let answerOptionsList = answerOptionsBox.children[0];
    // console.log(JSON.stringify(answerOptionsList));

    expect(searchTree(tree, "7:00am")[0].children[0]).toBe('7:00am');
    expect(searchTree(tree, '7:30am')[0].children[0]).toBe('7:30am');
    expect(searchTree(tree, '8:00am')[0].children[0]).toBe('8:00am');

    // Verify that the answerOptionsList contains three answers.
    expect(answerOptionsList.children[0].children.length).toBe(3);

    expect(answerOptionsList.children[0].children[0].children[1].children[0].children[0]).toBe('7:00am');
    // let node0 = searchTree(tree, "7:00am")[0];
    // // console.log('node:', node);
    // expect(searchTree(tree, '7:30am')[0].children[0]).toBe('7:30am');
    // let node1 = searchTree(tree, '8:00am')[0];
    // expect(node1.children[0]).toBe('8:00am');

    let node1 = searchTreeForProps(tree, {className: 'poll-author'})[0];
    // console.log('node1: ', node1);
    expect(node1.children[0]).toBe('Poll Author: ');
    expect(node1.children[1].children[0]).toBe('Kronos');

	});
});
