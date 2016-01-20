import React from 'react';
import ReactDOM from 'react-dom';
import {
    Simulate,
    findRenderedDOMComponentWithTag,
} from 'react-addons-test-utils';
import $ from 'jquery'
import AddNameForm from '../../src/components/AddNameForm';


describe('user interaction', () => {
    const setup = (serverValidation = {}) => {
        const props = {
            addName: sinon.spy(),
            clearServerValidation: sinon.spy(),
            serverValidation,
        };

        const parent = document.createElement('div');
        const form = ReactDOM.render(<AddNameForm {...props} />, parent);
        const button = findRenderedDOMComponentWithTag(form.refs.submit, 'button');
        const input = findRenderedDOMComponentWithTag(form.refs.name, 'input');

        const rerender = (newProps = {}) =>
            ReactDOM.render(<AddNameForm {...props} {...newProps} />, parent);

        return { props, form, button, input, rerender };
    };

    const fillInText = (input, text) => {
        input.value = text;
        Simulate.change(input);
    };

    const submitForm = component => {
        Simulate.submit(findRenderedDOMComponentWithTag(component, 'form'));
    }

    it('enables the submit button when a name is filled in', () => {
        const { input, button } = setup();
        fillInText(input, 'hi');
        expect( button.disabled ).to.be.false;
    });

    it('enables the submit button when a name is filled in (alt)', () => {
        // same test as above, just a different way to simulate user input
        const { form, button } = setup();
        const formsy = form.refs.form;
        formsy.inputs.name.setValue('blah');
        expect( button.disabled ).to.be.false;
    });

    it('disables the submit button when no name is filled in', () => {
        const { button, input } = setup();
        expect( button.disabled ).to.be.true;
        fillInText(input, '');
        expect( button.disabled ).to.be.true;
    });

    it('disables the submit button when the name is too long', () => {
        const { input, button } = setup();
        // fillInText(input, 'hi');
        // expect( button.disabled ).to.be.false;
        fillInText(input, 'toooooooloooooong');
        expect( button.disabled ).to.be.true;
    });

    it('disables the submit button when the name is not just letters', () => {
        const { input, button } = setup();
        fillInText(input, 'abc 123');
        expect( button.disabled ).to.be.true;
    });

    // it('calls `clearServerValidation`', () => {

    // });
});
