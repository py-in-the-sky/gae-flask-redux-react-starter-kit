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
// external validations take priority over internal
// form ones; internal form errors will only appear
// if `validationErrors` is falsy
// e.g.: const externalValidationErrors = {
//           name: 'some error from server',
//       };
// this is another alternative:
//  https://github.com/christianalfoni/formsy-react/blob
//  /master/API.md#updateinputswitherrorerrors


export default class AddNameForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state  = { isValid: false };
        this.submit = this.submit.bind(this);
        this.clearServerValidation = this.clearServerValidation.bind(this);
        this.setValid = () => this.setState({ isValid: true });
        this.setInvalid = () => this.setState({ isValid: false});
    }

    render () {
        return (
            <Form
             validationErrors={this.props.serverValidation.message}
             onChange={this.clearServerValidation}
             onValid={this.setValid}
             onInvalid={this.setInvalid}
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

    clearServerValidation () {
        if (this.props.serverValidation.message) {
            this.props.clearServerValidation();
        }
    }
}


AddNameForm.propTypes = {
    addName: PropTypes.func.isRequired,
    clearServerValidation: PropTypes.func.isRequired,
    serverValidation: PropTypes.shape({
        message: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
    }).isRequired,
};
