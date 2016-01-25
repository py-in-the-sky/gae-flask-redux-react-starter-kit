import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import ImmutablePropTypes from 'react-immutable-proptypes';


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
    salutation: PropTypes.string.isRequired,
    name: ImmutablePropTypes.recordOf({
        name: PropTypes.string.isRequired,
    }).isRequired,
};
