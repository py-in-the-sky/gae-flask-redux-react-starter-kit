import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';


export default class Greeting extends PureComponent {
    render () {
        const { salutation, name } = this.props;

        return (
            <div className="greeting">
                {`${salutation}, ${name}!`}
            </div>
        );
    }
}


Greeting.propTypes = {
    name:       PropTypes.string.isRequired,
    salutation: PropTypes.string.isRequired,
};
