"use strict";


import React from 'react';
// import renderer from 'react-test-renderer';
import ReactTestUtils from 'react-addons-test-utils'
import {AnswerOptionsBox, AnswerOptionsList, AnswerOption} from '../AnswerOptionsBox';
var TestUtils = ReactTestUtils;


jest.autoMockOff();
jest.mock('react-dom');

// import {AnswerOption} from
		var mapVotesToAnswerOptions = function (votes) {
				var answer_option_votes = []
				votes.forEach(vote => answer_option_votes[vote.answer_option] = (answer_option_votes[vote.answer_option] + 1 || 1) )
				return answer_option_votes
		}

describe('AnswerOption', function() {
	it('adds a border when the vote button is hovered over', () => {
		var answer_options = [
					"Cuddly",
					"Cute"
		];

    // const renderer = ReactTestUtils.createRenderer();


		// const renderer = ReactTestUtils.createRenderer();
  //   renderer.render(
  //     <AnswerOption
  //       answer_option={answer_options[0]}
  //       answer_option_votes={2}
  //       key={0}
  //       index={0}
  //       handleAnswerOptionChange={null}
  //       option_is_editable={null}
  //       handleVote={null}
  //       handleKeyPress={null}
  //     />
  //   );
  //   let result = renderer.getRenderOutput();
  //   // renderer.SimulateNative.mouseEnter

  //   // console.log("result:", result.props.children[0].props.children);
  //   let node = result;
    // console.log("node:", node);
    // ReactTestUtils.Simulate.click(node);

    var component = ReactTestUtils.renderIntoDocument(
      <AnswerOption
        answer_option={answer_options[0]}
        answer_option_votes={2}
        key={0}
        index={0}
        handleAnswerOptionChange={null}
        option_is_editable={null}
        handleVote={null}
        handleKeyPress={null}
      />
    );



    // TestUtils.Simulate.
    expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    // console.log("component: \n", component);
    var componentsWithBorder = null;
    // var answerOptionTextDiv = TestUtils.scryRenderedDOMComponentsWithClass(component, 'answer-option-text');

    // var componentsWithoutBorder = TestUtils.scryRenderedDOMComponentsWithClass(component, 'answer-option');
    componentsWithBorder = TestUtils.scryRenderedDOMComponentsWithClass(component, 'add-border');
    expect(componentsWithBorder.length).toBe(0);
    // var node = component.getDOMNode();
    // var node = componentsWithoutBorder;
    // console.log("componentWithoutBorder: \n", componentsWithoutBorder);

    var voteButtons = TestUtils.scryRenderedDOMComponentsWithClass(component, 'vote-button');
    // console.log("voteButton:", voteButton);
    // TestUtils.Simulate.click(voteButton);

    TestUtils.SimulateNative.mouseOver(voteButtons[0]);
    componentsWithBorder = TestUtils.scryRenderedDOMComponentsWithClass(component, 'add-border');
    expect(componentsWithBorder.length).toBe(1);

    TestUtils.SimulateNative.mouseOut(voteButtons[0]);
    componentsWithBorder = TestUtils.scryRenderedDOMComponentsWithClass(component, 'add-border');
    expect(componentsWithBorder.length).toBe(0);
		// let a = 1;
		// expect(a).toBe(1);

	});


});





// describe('AnswerOption', function() {
//   // var Poll;
//   // var AnswerOptionsBox;
//   // var Poll1            = require('../PollItem');
//   beforeEach(function() {
//     // Poll = require('../PollItem');
//     // AnswerOptionsBox = require('../AnswerOptionsBox');
//     // AnswerOptionsBox =
//     // console.log("\n\n\Pll is", Poll)
//     // done()
//   });

//   it('has a string containing the answer option text', () => {
//     var answer_options = [
//         "Cuddly",
//         "Cute"
//     ];

//     var votes = [];
//     // var handleAddAnswerOption = function() {};
//     var form_feedback = {message: "Test message."}
//     var user = {username: "Xena", fullname: "Xena: Warrior Princess!"}
//     const component = renderer.create(
//         <AnswerOption answer_option={answer_options[0]} answer_option_votes={votes[0]} key={0} index={0} handleAnswerOptionChange={ null} option_is_editable={null} handleVote={null} handleKeyPress={null} />

//         // <AnswerOptionsBox poll_id={1} answer_options={answer_options} votes={votes} options_are_editable={false} handleAddAnswerOption={mapVotesToAnswerOptions} handleVote={mapVotesToAnswerOptions}
//             // handleNewAnswerOptionChange={mapVotesToAnswerOptions} new_answer_option={""} user={ user} mapVotesToAnswerOptions={mapVotesToAnswerOptions} form_feedback={form_feedback} />
//     )
//   //   var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []}
//   //   const component = renderer.create(
//   //     <Poll poll={poll} key={poll._id} id={poll._id} handlePollSelect={null} />
//   //   );


//     // ReactTestUtils.renderIntoDocument(component);
//     // ReactTestUtils.Simulate.click(events.refs.button.getDOMNode());

//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//     // console.log("tree:", tree);
//     // console.log("tree.children:", tree.children);
//     // console.log("tree.children[0].children:", tree.children[0].children);
//     // console.log("tree.children[1].children:", tree.children[1].children);
//     // console.log("tree.children[0].children:", tree.children[0].children);
//     expect(tree.children.length).toBe(2);

//     expect(tree.children[0].children[0].type).toBe("button");
//     expect(tree.children[0].children[0].children[0]).toBe("Vote");
//     expect(tree.children[1].children[0].children[0]).toBe("Cuddly");
//     // expect(tree.children[0].props.className).toBe("pollAuthor");
//     // expect(tree.children[0].children.length).toBe(2);
//     // expect(tree.children[0].children[0]).toBe("Poll Author: ");
//     // expect(tree.children[0].children[1].children[0]).toBe("Xena");

//     // expect(tree.children[1].children.length).toBe(2);
//     // expect(tree.children[1].children[0]).toBe("Poll Question: ");
//     // expect(tree.children[1].children[1].children[0]).toBe("How cute is Xena?");

//   //   // console.log("tree.children[1]:", tree.children[1]);



//     // // manually trigger the callback
//     // tree.children[0].children[0].props.onMouseEnter();
//     // // re-rendering
//     // tree = component.toJSON();
//     // expect(tree.props.className).toBe('answer-option poll-listing uneditable add-border')
//     // expect(tree).toMatchSnapshot();


//   });
// });


// describe('AnswerOptionsBox', function() {
//   // var Poll;
//   // var AnswerOptionsBox;
//   // var Poll1            = require('../PollItem');
//   beforeEach(function() {
//     // Poll = require('../PollItem');
//     // AnswerOptionsBox = require('../AnswerOptionsBox');
//     // AnswerOptionsBox =
//     // console.log("\n\n\Pll is", Poll)
//     // done()
//   });

//   it('It contains an AnswerOptionsList with all of the existing answer_options', () => {
//     var answer_options = [
//         "Cuddly",
//         "Cute"
//     ];

//     var votes = [];
//     // var handleAddAnswerOption = function() {};
//     var form_feedback = {message: "Test message."}
//     var user = {username: "Xena", fullname: "Xena: Warrior Princess!"}
//     const component = renderer.create(
//         <AnswerOptionsBox poll_id={1} answer_options={answer_options} votes={votes} options_are_editable={false} handleAddAnswerOption={mapVotesToAnswerOptions} handleVote={mapVotesToAnswerOptions}
//             handleNewAnswerOptionChange={mapVotesToAnswerOptions} new_answer_option={""} user={ user} mapVotesToAnswerOptions={mapVotesToAnswerOptions} form_feedback={form_feedback} />
//     )
//   //   var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []}
//   //   const component = renderer.create(
//   //     <Poll poll={poll} key={poll._id} id={poll._id} handlePollSelect={null} />
//   //   );

//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//   // //   // console.log("tree.children:", tree.children);
//   // //   expect(tree.children.length).toBe(2);

//   //   expect(tree.children[0].props.className).toBe("pollAuthor");
//   //   expect(tree.children[0].children.length).toBe(2);
//   //   expect(tree.children[0].children[0]).toBe("Poll Author: ");
//   //   expect(tree.children[0].children[1].children[0]).toBe("Xena");

//   //   expect(tree.children[1].children.length).toBe(2);
//   //   expect(tree.children[1].children[0]).toBe("Poll Question: ");
//   //   expect(tree.children[1].children[1].children[0]).toBe("How cute is Xena?");

//   //   // console.log("tree.children[1]:", tree.children[1]);

//     var a = 1;
//     expect(a).toBe(1)
//   });
// });



// var handleAddAnswerOption = function(data) {
//   return false;
// }

