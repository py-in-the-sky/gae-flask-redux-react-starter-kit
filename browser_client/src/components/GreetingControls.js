import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import RaisedButton from 'material-ui/lib/raised-button';
import { Flex } from 'jsxstyle';


export default class GreetingControls extends PureComponent {
    render () {
        const { fetchAndAddName, subtractLastName, requestsPending } = this.props;

        return (
            <Flex
             position="relative"
             overflow="hidden"
             flex="1 1 auto"
             flexFlow="column wrap"
             flexWrap="wrap"
             justifyContent="flex-start"
             order={0}
             padding={'0 10px'}
             backfaceVisibility="hidden">

                <RaisedButton
                 style={{ marginBottom: 5 }}
                 primary={true}
                 label="ADD GREETING"
                 onTouchTap={fetchAndAddName} />

                <RaisedButton
                 style={{ marginBottom: 5 }}
                 secondary={true}
                 label="SUBTRACT LAST GREETING"
                 onTouchTap={subtractLastName} />

                <div
                 className="waiting"
                 style={{ visibility: requestsPending ? 'visible' : 'hidden' }}>
                    Waiting...
                </div>

            </Flex>
        );
    }
}


GreetingControls.propTypes = {
    requestsPending:  PropTypes.bool.isRequired,
    fetchAndAddName:  PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
};
