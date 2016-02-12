import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import { ShrinkWrap } from './Flex'
import { reduxForm } from 'redux-form'
import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'


const textFieldStyle = { marginBottom: '3rem' }


const fields = [ 'name' ]
const nonAlphaRe = /[^a-zA-Z]/
const validate = values => {
    const errors = {}

    const { name } = values
    if (!name) {
        errors.name = 'A name is required'
    }
    else if (nonAlphaRe.test(name)) {
        errors.name = 'You may only use letters'
    } else if (name.length > 10) {
        errors.name = 'The name is too long (10 characters max)'
    }

    return errors
}


export class AddNameForm extends Component {
    constructor (props) {
        super(props)
        this.submit = this.submit.bind(this)
        this.refNameInput = c => this.nameInput = c
    }

    componentDidUpdate (prevProps) {
        const { formHasEntered } = this.props
        if (formHasEntered && !prevProps.formHasEntered) {
            this.nameInput.focus()
        }
    }

    render () {
        const { fields: { name }, submitting, valid } = this.props

        return (
            <form onSubmit={this.submit}>

                <ShrinkWrap flexDirection="column">

                    <TextField
                        ref={this.refNameInput}
                        style={textFieldStyle}
                        floatingLabelText="Name"
                        errorText={name.touched && name.error}
                        {...name}
                    />

                    <RaisedButton
                        type="submit"
                        primary={true}
                        disabled={submitting || !valid}
                        label="ADD NAME"
                    />

                </ShrinkWrap>

            </form>
        )
    }

    submit (e) {
        const { handleSubmit, resetForm } = this.props
        handleSubmit(e)
        resetForm()
        this.nameInput.focus()
    }
}


AddNameForm.propTypes = {
    formHasEntered: PropTypes.bool.isRequired,
    fields: PropTypes.shape({
        name: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
            visited: PropTypes.bool,
            touched: PropTypes.bool,
        }),
    }),
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
}


export default reduxForm({
    form: 'addName',
    fields: [ 'name' ],
    validate,
})(AddNameForm)
