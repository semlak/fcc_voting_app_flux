// Link.react-test.js
import React from 'react';
import PollList from '../PollList.react';
import renderer from 'react-test-renderer';

// describe('Poll', () => {
//   it('has an author and a question', () => {
//     var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []}
//     const component = renderer.create(
//       <Poll author={poll.author} question={poll.question} answer_options={poll.answer_options} votes={poll.votes} key={poll._id} id={poll._id} handlePollSelect={null} />
//     );

//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();

//     // manually trigger the callback
//     // tree.props.onMouseEnter();
//     // re-rendering
//     // tree = component.toJSON();
//     // expect(tree).toMatchSnapshot();

//     // manually trigger the callback
//     // tree.props.onMouseLeave();
//     // re-rendering
//     // tree = component.toJSON();
//     // expect(tree).toMatchSnapshot();
//   });
// });


describe('PollList', () => {
    it('has a list of polls', () => {
        var poll = {author: 'Xena', question: 'How cute is Xena?', answer_options: [], _id: 1, votes: []};
        poll['_id'] = 1
        var polls = {}
        polls[poll._id] = poll;
        console.log("polls are", polls)
        const component = renderer.create(
            <PollList handlePollSelect={null} polls={polls} listOnlyCurrentUserPolls={false} user={null} updateAppState={null}/>
        );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    });
});