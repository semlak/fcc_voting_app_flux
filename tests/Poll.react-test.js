// Link.react-test.js
import React from 'react';
import Poll from '../Poll.react';
// import Main from '../public/javascripts/main.jsx'
import renderer from 'react-test-renderer';

describe('Poll', () => {
  it('has an author and a question', () => {
    var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []}
    const component = renderer.create(
      <Poll author={poll.author} question={poll.question} answer_options={poll.answer_options} votes={poll.votes} key={poll._id} id={poll._id} handlePollSelect={null} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

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
