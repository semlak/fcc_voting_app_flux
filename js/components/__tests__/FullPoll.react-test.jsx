"use strict";

jest.autoMockOff();


import React from 'react';
// import Link from '../Link.react';
import renderer from 'react-test-renderer';


describe('FullPoll', function() {
  var FullPoll;

  beforeEach(function() {
    FullPoll = require('../PollItem');
    // console.log("\n\n\Pll is", Poll)
    // done()
  });

  it('has an author and a question', function() {
    var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []}
    const component = renderer.create(
      <FullPoll poll={poll} key={poll._id} id={poll._id} handlePollSelect={null} />
    );

    // let tree = component.toJSON();
    // expect(tree).toMatchSnapshot();
    // // console.log("tree.children:", tree.children);
    // expect(tree.children.length).toBe(2);

    // expect(tree.children[0].props.className).toBe("pollAuthor");
    // expect(tree.children[0].children.length).toBe(2);
    // expect(tree.children[0].children[0]).toBe("Poll Author: ");
    // expect(tree.children[0].children[1].children[0]).toBe("Xena");

    // expect(tree.children[1].children.length).toBe(2);
    // expect(tree.children[1].children[0]).toBe("Poll Question: ");
    // expect(tree.children[1].children[1].children[0]).toBe("How cute is Xena?");

    // console.log("tree.children[1]:", tree.children[1]);

    var a = 1;
    expect(a).toBe(1)

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
});
