"use strict";


import React from 'react';
import renderer from 'react-test-renderer';
import {AnswerOptionsBox, AnswerOptionsList, AnswerOption} from '../AnswerOptionsBox';

jest.autoMockOff();
jest.mock('react-dom');

// import {AnswerOption} from
    var mapVotesToAnswerOptions = function (votes) {
        var answer_option_votes = []
        votes.forEach(vote => answer_option_votes[vote.answer_option] = (answer_option_votes[vote.answer_option] + 1 || 1) )
        return answer_option_votes
    }

describe('AnswerOption', function() {
  // var Poll;
  // var AnswerOptionsBox;
  // var Poll1            = require('../PollItem');
  beforeEach(function() {
    // Poll = require('../PollItem');
    // AnswerOptionsBox = require('../AnswerOptionsBox');
    // AnswerOptionsBox =
    // console.log("\n\n\Pll is", Poll)
    // done()
  });

  it('has a string containing the answer option text', () => {
    var answer_options = [
        "Cuddly",
        "Cute"
    ];

    var votes = [];
    // var handleAddAnswerOption = function() {};
    var form_feedback = {message: "Test message."}
    var user = {username: "Xena", fullname: "Xena: Warrior Princess!"}
    const component = renderer.create(
        <AnswerOption answer_option={answer_options[0]} answer_option_votes={votes[0]} key={0} index={0} handleAnswerOptionChange={ null} option_is_editable={null} handleVote={null} handleKeyPress={null} />

        // <AnswerOptionsBox poll_id={1} answer_options={answer_options} votes={votes} options_are_editable={false} handleAddAnswerOption={mapVotesToAnswerOptions} handleVote={mapVotesToAnswerOptions}
            // handleNewAnswerOptionChange={mapVotesToAnswerOptions} new_answer_option={""} user={ user} mapVotesToAnswerOptions={mapVotesToAnswerOptions} form_feedback={form_feedback} />
    )
  //   var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []}
  //   const component = renderer.create(
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

    expect(tree.children[0].children[0].type).toBe("button");
    expect(tree.children[0].children[0].children[0]).toBe("Vote");
    expect(tree.children[1].children[0].children[0]).toBe("Cuddly");
    // expect(tree.children[0].props.className).toBe("pollAuthor");
    // expect(tree.children[0].children.length).toBe(2);
    // expect(tree.children[0].children[0]).toBe("Poll Author: ");
    // expect(tree.children[0].children[1].children[0]).toBe("Xena");

    // expect(tree.children[1].children.length).toBe(2);
    // expect(tree.children[1].children[0]).toBe("Poll Question: ");
    // expect(tree.children[1].children[1].children[0]).toBe("How cute is Xena?");

  //   // console.log("tree.children[1]:", tree.children[1]);

    var a = 1;
    expect(a).toBe(1)
  });
});


describe('AnswerOptionsBox', function() {
  // var Poll;
  // var AnswerOptionsBox;
  // var Poll1            = require('../PollItem');
  beforeEach(function() {
    // Poll = require('../PollItem');
    // AnswerOptionsBox = require('../AnswerOptionsBox');
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
    const component = renderer.create(
        <AnswerOptionsBox poll_id={1} answer_options={answer_options} votes={votes} options_are_editable={false} handleAddAnswerOption={mapVotesToAnswerOptions} handleVote={mapVotesToAnswerOptions}
            handleNewAnswerOptionChange={mapVotesToAnswerOptions} new_answer_option={""} user={ user} mapVotesToAnswerOptions={mapVotesToAnswerOptions} form_feedback={form_feedback} />
    )
  //   var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []}
  //   const component = renderer.create(
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
        // console.log('in fullpoll "handleAddAnswerOption"')
        // var poll_id = this.state.poll.id
        // var new_answer_option = this.state.new_answer_option.trim()
        // var poll = this.state.poll
        // console.log('\n\n\n\ncurrentUser is ', this.state.currentUser)
        // if (this.state.currentUser == null || this.state.currentUser == undefined || this.state.currentUser.username == null) {
        //     console.log("User most be authenticated in order to add answer option.")
        // }
        // else if (new_answer_option == '' || new_answer_option == null) {
        //     console.log("Error. A new answer option should not be blank in an existing poll.")
        //         this.setState({form_feedback: {message: 'A new answer option should not be blank in an existing poll.'}})

        // }
        // else if (poll.answer_options.filter(option => option == new_answer_option).length > 0 ) {
        //     console.log("Error. The new answer option should not match any existing answer option.")
        //     // this.setState({form_feedback: {message: 'The new answer option should not match any existing answer options.'}})
        //     this.setState({form_feedback: {message: 'Answer Option already exists!'}})
        // }
        // else {
        //     var new_option = {poll_id: poll_id, new_answer_option: new_answer_option, user_name: this.state.currentUser.username}
        //     //fire mapVotesToAnswerOptions
        // }

    }

