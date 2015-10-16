/*
    Property-based testing of the "greetings" aspect of the app.
 */

import Root from '../../containers';
import React from 'react';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import { Router } from 'react-router';
import {
    renderIntoDocument,
    scryRenderedDOMComponentsWithTag,
    scryRenderedDOMComponentsWithClass,
    scryRenderedComponentsWithType,
    Simulate,
} from 'react-addons-test-utils';
import { install } from 'mocha-testcheck';


function setup () {
    return renderIntoDocument(<Root history={new BrowserHistory()} />);
}


function visitePageOne (UI) {
    const router = scryRenderedComponentsWithType(UI, Router)[0];
    router.transitionTo('/1');
}


describe('navigating to page one', () => {
    it('shows buttons for the greetings controls', () => {
        const UI = setup();

        expect( scryRenderedDOMComponentsWithTag(UI, 'button') ).to.be.empty;

        visitePageOne(UI);

        expect( scryRenderedDOMComponentsWithTag(UI, 'button') ).to.not.be.empty;
    });
});

// b=TestUtils.scryRenderedDOMComponentsWithTag(UI, 'button')[0]
// Simulate.click(b)
// scryRenderedDOMComponentsWithClass(UI, 'greeting')
// Simulate.click(b)
// scryRenderedDOMComponentsWithClass(UI, 'greeting')



// function greetingsCount (UI) {
//     return scryRenderedDOMComponentsWithClass(UI, 'greeting').length;
// }


// [rmw] here's an example of how to use testcheck
// see: https://github.com/leebyron/testcheck-js
// generator API: https://github.com/leebyron/testcheck-js/blob/master/type-definitions/testcheck.d.ts
// Mocha API: https://github.com/leebyron/mocha-check/
// on React components: https://vimeo.com/122070164
// describe('testcheck of filterString', () => {

//   install();  // install mocha-testcheck

//   /* eslint-disable no-undef */

//   const actionTypes = Object.values(ActionTypes);

//   const randomPreviousStates = gen.alphaNumString;

//   const randomActions = gen.object({
//     type:    gen.returnOneOf(actionTypes),
//     payload: gen.alphaNumString,
//   });

//   check.it('always returns a string',
//            [randomPreviousStates, randomActions],
//            (previousState, action) => {

//     expect( filterString(previousState, action) ).to.be.a('string');

//   });
// });
