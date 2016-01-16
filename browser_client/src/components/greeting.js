import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';


export default class Greeting extends PureComponent {
    render () {
        const { salutation, name } = this.props;

        return (
            <div>
                {`${salutation}, ${name.name}!`}
            </div>
        );
    }
}


Greeting.propTypes = {
    name:       PropTypes.object.isRequired,
    salutation: PropTypes.string.isRequired,
};
