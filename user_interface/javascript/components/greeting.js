import React, { Component, PropTypes } from 'react';


export default class Greeting extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="greeting">
                {'Hello, ' + this.props.name + '!'}
            </div>
        );
    }
}


Greeting.propTypes = {
    name: PropTypes.string.isRequired
}
