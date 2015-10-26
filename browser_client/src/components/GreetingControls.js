import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import RaisedButton from 'material-ui/lib/raised-button';


export default class GreetingControls extends PureComponent {
    render () {
        const { fetchAndAddName, subtractLastName, requestsPending } = this.props;

        return (
            <div style={{ float: 'left', marginLeft: 20 }}>

                <RaisedButton
                 primary={true}
                 label="ADD GREETING"
                 onClick={fetchAndAddName} />

                <RaisedButton
                 secondary={true}
                 label="SUBTRACT LAST GREETING"
                 onClick={subtractLastName} />

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
