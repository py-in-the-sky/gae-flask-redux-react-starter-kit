import React from 'react';
import {
    renderIntoDocument,
    scryRenderedDOMComponentsWithTag,
    Simulate,
} from 'react-addons-test-utils';
import GreetingControls from '../../components/greeting_controls';


function setup (requestsPending = false) {
    const props = {
        requestsPending,
        fetchAndAddName:  expect.createSpy(),
        subtractLastName: expect.createSpy(),
    };
    const greetingControls = renderIntoDocument(<GreetingControls {...props} />);
    const divs = scryRenderedDOMComponentsWithTag(greetingControls, 'div');
    const buttons = scryRenderedDOMComponentsWithTag(greetingControls, 'button');

    const [ addButton, subtractButton ] = buttons;
    const waitingIndicator = divs[1];

    return { props, addButton, subtractButton, waitingIndicator };
}


describe('adding a greeting', () => {
    it('calls the `fetchAndAddName` action creator', () => {
        const { props, addButton } = setup();
        Simulate.click(addButton);
        expect( props.fetchAndAddName.calls.length ).toBe( 1 );
    });
});


describe('subtracting a greeting', () => {
    it('calls the `subtractLastName` action creator', () => {
        const { props, subtractButton } = setup();
        Simulate.click(subtractButton);
        expect( props.subtractLastName.calls.length ).toBe( 1 );
    });
});


describe('awaiting a greeting', () => {

    context('when there is not a pending greeting request', () => {
        it('does not show a waiting indicator', () => {
            const { waitingIndicator } = setup();
            expect( waitingIndicator.style.visibility ).toBe( 'hidden' );
        });
    });

    context('when there is a pending greeting request', () => {
        it('does show a waiting indicator', () => {
            const { waitingIndicator } = setup(true);
            expect( waitingIndicator.style.visibility ).toBe( 'visible' );
        });
    });
});
