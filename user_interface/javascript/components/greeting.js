import React, { Component, PropTypes } from 'react';


export default class Greeting extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="greeting">
                {this.props.salutation + ', ' + this.props.name + '!'}
            </div>
        );
    }
}


Greeting.propTypes = {
    name:       PropTypes.string.isRequired,
    salutation: PropTypes.string.isRequired,
}
