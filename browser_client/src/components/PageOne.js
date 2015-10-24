import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Greetings from './Greetings';
import GreetingControls from './GreetingControls';


export default class PageOne extends PureComponent {
    componentDidMount () {
        if (this.props.names.size === 0)
            this.props.fetchAndAddName();
    }

    render () {
        const {
            names,
            requestsPending,
            fetchAndAddName,
            subtractLastName,
        } = this.props;

        return (
            <div className="page">

                <Greetings
                 names={names} />

                <GreetingControls
                 requestsPending={requestsPending}
                 fetchAndAddName={fetchAndAddName}
                 subtractLastName={subtractLastName} />

            </div>
        );
    }
}


PageOne.propTypes = {
    names:            PropTypes.object.isRequired,
    requestsPending:  PropTypes.bool.isRequired,
    fetchAndAddName:  PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
};
