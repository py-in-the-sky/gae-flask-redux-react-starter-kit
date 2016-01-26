import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import {
    Simulate,
    findRenderedDOMComponentWithTag,
} from 'react-addons-test-utils';
import AddNameForm from 'app/components/AddNameForm';


describe('user interaction', () => {
    const setup = (serverValidation = {}) => {
        const props = {
            addName: sinon.spy(),
            clearServerValidation: sinon.spy(),
            serverValidation,
        };

        const wrapper = mount(<AddNameForm {...props} />);
        const input = wrapper.find('input').first();
        const button = wrapper.find('button').first();
        const formsy = wrapper.ref('form');

        return { props, wrapper, input, button, formsy };
    };

    const fillInText = (input, text) => {
        input.value = text;
        Simulate.change(input);
    };

    const submitForm = component => {
        Simulate.submit(findRenderedDOMComponentWithTag(component, 'form'));
    };

    it('enables the submit button when a name is filled in', () => {
        const { input, button } = setup();
        fillInText(input.node, 'hi');
        expect( button ).to.not.be.disabled();
    });

    it('enables the submit button when a name is filled in (alt)', () => {
        // same test as above, just a different way to simulate user input
        const { formsy, button } = setup();
        formsy.node.inputs.name.setValue('blah');
        expect( button ).to.not.be.disabled();
    });

    it('disables the submit button when no name is filled in', () => {
        const { button, input } = setup();
        expect( button ).to.be.disabled();
        fillInText(input.node, '');
        expect( button ).to.be.disabled();
    });

    it('disables the submit button when the name is too long', () => {
        const { button, formsy } = setup();
        const nameInput = formsy.node.inputs.name;

        nameInput.setValue('hi');
        expect( button ).to.not.be.disabled();

        nameInput.setValue('toooooooloooooong');
        expect( button ).to.be.disabled();
    });

    it('disables the submit button when the name is not just letters', () => {
        const { input, button } = setup();
        fillInText(input.node, 'abc 123');
        expect( button ).to.be.disabled();
    });

    it('calls `addName` when the form is submitted', () => {
        const { input, formsy, props } = setup();

        expect( props.addName ).to.not.have.been.called;

        fillInText(input.node, 'hi');
        submitForm(formsy.node);

        expect( props.addName ).to.have.been.calledWith( 'hi' );
    });

    context('when the component unmounts', () => {
        const setup = (serverValidation = {}) => {
            const props = {
                addName: sinon.spy(),
                clearServerValidation: sinon.spy(),
                serverValidation,
            };

            // thanks to: http://stackoverflow.com/a/23974520/1941513
            const container = document.createElement('div');
            ReactDOM.render(<AddNameForm {...props} />, container);

            expect( props.clearServerValidation ).to.not.have.been.called;

            ReactDOM.unmountComponentAtNode(container);

            return props.clearServerValidation;
        };

        it('calls `clearServerValidation` if server validations are present', () => {
            const clearServerValidation = setup({ message: { name: 'error' } });
            expect( clearServerValidation ).to.have.been.called;
        });

        it('does not call `clearServerValidation` if server validations are not present', () => {
            const clearServerValidation = setup();
            expect( clearServerValidation ).to.not.have.been.called;
        });
    });

    context('when server validation errors are present', () => {
        it('calls `clearServerValidation` when the user changes `name`', () => {
            const { input, props } = setup({ message: { name: 'error' } });
            expect( props.clearServerValidation ).to.not.have.been.called;
            fillInText(input.node, 'hi');
            expect( props.clearServerValidation ).to.have.been.called;
        });
    });

    context('when server validation errors are not present', () => {
        it('does not call `clearServerValidation` when the user changes `name`', () => {
            const { input, props } = setup();
            fillInText(input.node, 'hi');
            expect( props.clearServerValidation ).to.not.have.been.called;
        });
    });
});
