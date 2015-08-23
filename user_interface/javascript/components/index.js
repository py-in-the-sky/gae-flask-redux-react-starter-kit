import React, { Component, PropTypes } from 'react';
import Greeting from './greeting';


export default class RootComponent extends Component {
    constructor(props) {
        super(props);
        this.renderGreetings = this.renderGreetings.bind(this);
        this.addGreeting     = this.addGreeting.bind(this);
    }

    componentDidMount () {
        // request one name when component mounts
        this.addGreeting();
    }

    render () {
        return (
            <div className="page">

                <div className="greetings">
                    {this.renderGreetings()}
                </div>

                <button onTouchTap={this.addGreeting}>
                    ADD GREETING
                </button>

            </div>
        );
    }

    renderGreetings () {
        return this.props.names.map( (name, index) => <Greeting key={index} name={name} /> );
    }

    addGreeting () {
        this.props.fetchAndAddName();
    }
}


RootComponent.propTypes = {
    names:            PropTypes.object.isRequired,
    fetchAndAddName:  PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
}
