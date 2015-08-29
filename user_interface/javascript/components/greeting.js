import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';


export default class Greeting extends PureComponent {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="greeting">
                {`${this.props.salutation}, ${this.props.name}!`}
            </div>
        );
    }
}


Greeting.propTypes = {
    name:       PropTypes.string.isRequired,
    salutation: PropTypes.string.isRequired,
}
