import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { Form } from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import RaisedButton from 'material-ui/lib/raised-button';
import { ShrinkWrap } from './Flex';


const nameValidationErrors = {
    isAlpha:   'You may only use letters',
    minLength: 'The name is too short',
    maxLength: 'The name is too long',
};


// external validation errors can come in from server
// and be passed down as props
// external validations take priority over interanal
// form ones; internal form errors will only appear
// if `externalValidationErrors` is falsy
const externalValidationErrors = undefined;
// const externalValidationErrors = {
//     name: 'some error from server',
// };


export default class AddNameForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state  = { isValid: false };
        this.submit = this.submit.bind(this);
    }

    render () {
        return (
            <Form
             validationErrors={externalValidationErrors}
             onValid={  () => this.setState({ isValid: true })}
             onInvalid={() => this.setState({ isValid: false})}
             onValidSubmit={this.submit}>

                <ShrinkWrap flexDirection="column">

                    <FormsyText
                     style={{ marginBottom: '3rem' }}
                     name="name"
                     required
                     formNoValidate
                     floatingLabelText="Name"
                     validationErrors={nameValidationErrors}
                     validations="isAlpha,minLength:1,maxLength:10" />

                    <RaisedButton
                     type="submit"
                     primary={true}
                     disabled={!this.state.isValid}
                     label="ADD NAME" />

                </ShrinkWrap>

            </Form>
        );
    }

    submit (model, resetForm) {
        const delayMS = 1100;
        this.props.addName(model.name, delayMS);
        resetForm();
    }
}


AddNameForm.propTypes = {
    addName: PropTypes.func.isRequired,
};
