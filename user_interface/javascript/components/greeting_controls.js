import React, { Component, PropTypes } from 'react';


export default class GreetingControls extends Component {
    constructor(props) {
        super(props);
        this.addGreeting          = this.addGreeting.bind(this);
        this.subtractLastGreeting = this.subtractLastGreeting.bind(this);
        this.loadingVisibility    = this.loadingVisibility.bind(this);
    }

    render () {
        return (
            <div style={{ float: 'left', marginLeft: 20 }}>

                <button onTouchTap={this.addGreeting}>
                    ADD GREETING
                </button>

                <button onTouchTap={this.subtractLastGreeting}>
                    SUBTRACT LAST GREETING
                </button>

                <div style={{ visibility: this.loadingVisibility() }}>
                    Waiting...
                </div>

            </div>
        );
    }

    addGreeting () {
        this.props.fetchAndAddName();
    }

    subtractLastGreeting () {
        this.props.subtractLastName();
    }

    loadingVisibility () {
        // TODO: can this just return a Boolean?
        return this.props.requestsPending ? 'visible' : 'hidden';
    }
}


GreetingControls.propTypes = {
    requestsPending:  PropTypes.bool.isRequired,
    fetchAndAddName:  PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
}
