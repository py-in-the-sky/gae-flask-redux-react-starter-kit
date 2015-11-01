import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import RaisedButton from 'material-ui/lib/raised-button';


export default class GreetingControls extends PureComponent {
    render () {
        const { fetchAndAddName, subtractLastName, requestsPending } = this.props;

        return (
            <div>

                <RaisedButton
                 primary={true}
                 label="ADD GREETING"
                 onTouchTap={fetchAndAddName} />

                <RaisedButton
                 secondary={true}
                 label="SUBTRACT LAST GREETING"
                 onTouchTap={subtractLastName} />

                <div
                 className="waiting"
                 style={{ visibility: requestsPending ? 'visible' : 'hidden' }}>
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
