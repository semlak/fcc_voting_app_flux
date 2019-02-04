"use strict";


import React from 'react';
import renderer from 'react-test-renderer';
// import ReactTestUtils from 'react-addons-test-utils'
import {AnswerOptionsBox, AnswerOptionsList, AnswerOption} from '../AnswerOptionsBox';
// var TestUtils = ReactTestUtils;

import {searchTree, searchTreeForProps, searchTreeForClassName} from '../../testing/extraFunctions';


jest.autoMockOff();
jest.mock('react-dom');

// import {AnswerOption} from
var mapVotesToAnswerOptions = function (votes) {
    var answer_option_votes = []
    votes.forEach(vote => answer_option_votes[vote.answer_option] = (answer_option_votes[vote.answer_option] + 1 || 1) )
    return answer_option_votes
}

var handleVote = jest.fn();
// var handleKeyPress = jest.fn();



// describe('AnswerOption', function() {
//   it('adds a border when the vote button is hovered over', () => {
//   });
// });

//
//


describe('AnswerOption', function() {
  // var Poll;
  // var AnswerOption;
  // var AnswerOptionsBox;
  // var Poll1            = require('../PollItem');
  beforeEach(function() {
    // Poll = require('../PollItem');
    // AnswerOptionsBox = require('../AnswerOptionsBox');
    // AnswerOption = require('../AnswerOptionBox').AnswerOption;
    // AnswerOptionsBox =
    // console.log("\n\n\Pll is", Poll)
    // done()
  });

  it('has a string containing the answer option text', () => {
    var answer_options = [
        "Cuddly",
        "Cute"
    ];

    // var votes = [];
    // var handleAddAnswerOption = function() {};
    // var form_feedback = {message: "Test message."}
    // var user = {username: "Xena", fullname: "Xena: Warrior Princess!"}
    var component = renderer.create(
      <AnswerOption
        poll_id={1}
        answer_option={answer_options[0]}
        index={0}
        option_is_editable={false}
        handleVote={handleVote}
        handleKeyPress={null}
      />
    );
  //   var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []}
  //   var component = renderer.create(
  //     <Poll poll={poll} key={poll._id} id={poll._id} handlePollSelect={null} />
  //   );


    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    // console.log("tree:", tree);
    // console.log("tree.children:", tree.children);
    // console.log("tree.children[0].children:", tree.children[0].children);
    // console.log("tree.children[1].children:", tree.children[1].children);
    // console.log("tree.children[0].children:", tree.children[0].children);
    expect(tree.children.length).toBe(2);
    // var buttons = searchTreeForClassName(tree, 'vote-button')[0];
    // console.log("buttons:", buttons);
    // console.log("tree:", tree);
    expect(tree.children[0].children[0].type).toBe("button");
    expect(tree.children[0].children[0].children[0]).toBe("Vote");
    expect(tree.children[1].children[0].children[0]).toBe("Cuddly");

    expect(tree.props.className).not.toMatch('add-border');  //className will NOT contain 'add-border'

    let button = tree.children[0].children[0];
    // console.log("button:", button);
    button.props != null && button.props.onMouseOver();
    tree = component.toJSON();
    // console.log("tree.props.className:", tree.props.className);
    expect(tree.props.className).toMatch('add-border');  //className will contain 'add-border'

    // button = tree.children[0].children[0];
    button.props != null && button.props.onMouseOut();
    expect(component.toJSON().props.className).not.toMatch('add-border');  //className will NOT contain 'add-border'

    // buttons.props != null && button.props.onClick();
    button.props.onClick();
    expect(handleVote).toHaveBeenCalled();


    // expect(tree.children[0].props.className).toBe("pollAuthor");
    // expect(tree.children[0].children.length).toBe(2);
    // expect(tree.children[0].children[0]).toBe("Poll Author: ");
    // expect(tree.children[0].children[1].children[0]).toBe("Xena");

    // expect(tree.children[1].children.length).toBe(2);
    // expect(tree.children[1].children[0]).toBe("Poll Question: ");
    // expect(tree.children[1].children[1].children[0]).toBe("How cute is Xena?");

  //   // console.log("tree.children[1]:", tree.children[1]);



    // // manually trigger the callback
    // tree.children[0].children[0].props.onMouseEnter();
    // // re-rendering
    // tree = component.toJSON();
    // expect(tree.props.className).toBe('answer-option poll-listing uneditable add-border')
    // expect(tree).toMatchSnapshot();


  });
});


describe('AnswerOptionsBox', function() {
  // var Poll;
  // var AnswerOptionsBox;
  // var Poll1            = require('../PollItem');
  beforeEach(function() {
    // Poll = require('../PollItem');
    // AnswerOptionsBox = require('../AnswerOptionsBox').AnswerOptionsBox;
    // AnswerOptionsBox =
    // console.log("\n\n\Pll is", Poll)
    // done()
  });

  it('It contains an AnswerOptionsList with all of the existing answer_options', () => {
    var answer_options = [
        "Cuddly",
        "Cute"
    ];

    var votes = [];
    // var handleAddAnswerOption = function() {};
    var form_feedback = {message: "Test message."}
    var user = {username: "Xena", fullname: "Xena: Warrior Princess!"}
    var component = renderer.create(
      <AnswerOptionsBox
        poll_id={1}
        answer_options={answer_options}
        votes={votes}
        options_are_editable={false}
        handleAddAnswerOption={null}
        handleVote={handleVote}
        handleNewAnswerOptionChange={null}
        new_answer_option={""}
        user={user}
        mapVotesToAnswerOptions={mapVotesToAnswerOptions}
        form_feedback={form_feedback}
      />
    );
  //   var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []}
  //   var component = renderer.create(
  //     <Poll poll={poll} key={poll._id} id={poll._id} handlePollSelect={null} />
  //   );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  // //   // console.log("tree.children:", tree.children);
  // //   expect(tree.children.length).toBe(2);

  //   expect(tree.children[0].props.className).toBe("pollAuthor");
  //   expect(tree.children[0].children.length).toBe(2);
  //   expect(tree.children[0].children[0]).toBe("Poll Author: ");
  //   expect(tree.children[0].children[1].children[0]).toBe("Xena");

  //   expect(tree.children[1].children.length).toBe(2);
  //   expect(tree.children[1].children[0]).toBe("Poll Question: ");
  //   expect(tree.children[1].children[1].children[0]).toBe("How cute is Xena?");

  //   // console.log("tree.children[1]:", tree.children[1]);

    var a = 1;
    expect(a).toBe(1)
  });
});



var handleAddAnswerOption = function(data) {
  return false;
}

