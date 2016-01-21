import React from 'react';
import { shallow } from 'enzyme';
import GreetingControls from '../../src/components/GreetingControls';
import RaisedButton from 'material-ui/lib/raised-button';


function setup (requestsPending = false) {
    const props = {
        requestsPending,
        addName:  sinon.spy( x => x ),
        subtractLastName: sinon.spy( x => x ),
    };

    const wrapper = shallow(<GreetingControls {...props} />);

    return { props, wrapper };
}


describe('adding a greeting', () => {
    it('calls the `addName` action creator', () => {
        const { props, wrapper } = setup();
        wrapper.find(RaisedButton).first().simulate('touchTap');
        expect( props.addName ).to.have.been.calledOnce;
    });
});


describe('subtracting a greeting', () => {
    it('calls the `subtractLastName` action creator', () => {
        const { props, wrapper } = setup();
        wrapper.find(RaisedButton).last().simulate('touchTap');
        expect( props.subtractLastName ).to.have.been.calledOnce;
    });
});


describe('awaiting a greeting', () => {

    context('when there is not a pending greeting request', () => {
        it('does not show a waiting indicator', () => {
            const { wrapper } = setup();
            expect( wrapper.find('.waiting').prop('style').visibility )
                .to.equal( 'hidden' );
        });
    });

    context('when there is a pending greeting request', () => {
        it('does show a waiting indicator', () => {
            const { wrapper } = setup(true);
            expect( wrapper.find('.waiting').prop('style').visibility )
                .to.equal( 'visible' );
        });
    });
});
