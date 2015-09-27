import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';


export default class GreetingControls extends PureComponent {
    render () {
        const { fetchAndAddName, subtractLastName, requestsPending } = this.props;

        return (
            <div style={{ float: 'left', marginLeft: 20 }}>

                <button onTouchTap={fetchAndAddName}>
                    ADD GREETING
                </button>

                <button onTouchTap={subtractLastName}>
                    SUBTRACT LAST GREETING
                </button>

                <div style={{ visibility: requestsPending ? 'visible' : 'hidden' }}>
                    Waiting...
                </div>

            </div>
        );
    }
}


GreetingControls.propTypes = {
    requestsPending:  PropTypes.bool.isRequired,
    fetchAndAddName:  PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
};
