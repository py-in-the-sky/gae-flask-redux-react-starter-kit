import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Greetings from './greetings';
import GreetingControls from './greeting_controls';


export default class PageTwo extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        if (this.props.names.size === 0)
            this.props.fetchAndAddName();
    }

    render () {
        const pageStyle = {
            backgroundColor: '#EFEBE9',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20
        };

        const {
            names,
            requestsPending,
            fetchAndAddName,
            subtractLastName,
        } = this.props;

        return (
            <div className="page" style={pageStyle}>

                <GreetingControls
                 requestsPending={requestsPending}
                 fetchAndAddName={fetchAndAddName}
                 subtractLastName={subtractLastName} />

                <Greetings
                 names={names} />

            </div>
        );
    }
}


PageTwo.propTypes = {
    names:            PropTypes.object.isRequired,
    requestsPending:  PropTypes.bool.isRequired,
    fetchAndAddName:  PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
};
