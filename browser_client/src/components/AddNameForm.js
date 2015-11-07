import React, { PropTypes, Component } from 'react';
// import PureComponent from 'react-pure-render/component';
import t from 'tcomb-form';
import RaisedButton from 'material-ui/lib/raised-button';
import { Frame, Container } from './Flex';


const Form = t.form.Form;
const Name = t.struct({
    name: t.String,
});


export default class AddNameForm extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    render () {
        return (
            <div>

                <Form ref="form" type={Name} />

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
