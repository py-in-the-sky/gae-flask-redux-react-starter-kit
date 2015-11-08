import React, { PropTypes, Component } from 'react';
// TODO: import PureComponent from 'react-pure-render/component';
import t from 'tcomb-form';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import { Frame, Container } from './Flex';


const Form = t.form.Form;
const Name = t.struct({
    name: t.String,
});
var options = {
    fields: {
        name: {
            // https://github.com/gcanti/tcomb-form/blob/master/GUIDE.md#custom-factories
            factory: class extends Component {
                render () {
                    const { onChange, ctx: { path } } = this.props;

                    return (
                        <TextField
                         ref="input"
                         onChange={e => onChange(e.target.value, path)}
                         hintText="Name" />
                    );
                }

                validate () {
                    // object schema: https://github.com/gcanti/tcomb-validation#validationresult
                    return {
                        errors: [],
                        value: this.refs.input.getValue(),
                    };
                }
            }
        }
    }
};


export default class AddNameForm extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    render () {
        return (
            <div>

                <Form
                 ref="form"
                 type={Name}
                 options={options} />

                <RaisedButton
                 primary={true}
                 label="ADD NAME"
                 onTouchTap={this.submit} />

            </div>
        );
    }

    submit () {
        const maybeValue = this.refs.form.getValue();
        if (maybeValue)
            // maybeValue here is an instance of Name
            this.props.addName(maybeValue.name);
    }
}


AddNameForm.propTypes = {
    addName: PropTypes.func.isRequired,
};
