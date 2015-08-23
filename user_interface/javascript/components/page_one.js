import React, { Component, PropTypes } from 'react';
import Greetings from './greetings';
import GreetingControls from './greeting_controls';
import Navigation from './navigation';


export default class PageOne extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        if (this.props.names.size === 0)
            this.props.fetchAndAddName();
    }

    render () {
        const pageStyle = {
            backgroundColor: '#E8F5E9',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20
        };

        return (
            <div className="page" style={pageStyle}>

                <Navigation />

                <Greetings
                 names={this.props.names} />

                <GreetingControls
                 requestsPending={this.props.requestsPending}
                 fetchAndAddName={this.props.fetchAndAddName}
                 subtractLastName={this.props.subtractLastName} />

            </div>
        );
    }
}


PageOne.propTypes = {
    names:            PropTypes.object.isRequired,
    requestsPending:  PropTypes.bool.isRequired,
    fetchAndAddName:  PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
}
