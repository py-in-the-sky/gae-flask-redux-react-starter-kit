import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Greetings from './Greetings';
import GreetingControls from './GreetingControls';
import Paper from 'material-ui/lib/paper';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Themes } from '../utils/styles';
import { Flex } from 'jsxstyle';


export default class MordorPage extends PureComponent {
    componentDidMount () {
        if (this.props.names.size === 0)
            this.props.fetchAndAddName();
    }

    getChildContext () {
        return {
            muiTheme: ThemeManager.getMuiTheme(Themes.Mordor),
        };
    }

    render () {
        const {
            names,
            requestsPending,
            fetchAndAddName,
            subtractLastName,
        } = this.props;

        return (
            <Flex
             height="70vh"
             position="relative"
             overflow="hidden"
             flex="1 1 auto"
             flexFlow="row wrap"
             flexWrap="nowrap"
             alignItems="stretch"
             justifyContent="center"
             order={0}
             backfaceVisibility="hidden"
             padding={30}>
                <Paper zDepth={4} style={{ color: '#eeeeee' }}>

                    <GreetingControls
                     requestsPending={requestsPending}
                     fetchAndAddName={fetchAndAddName}
                     subtractLastName={subtractLastName} />

                    <Greetings
                     names={names} />

                </Paper>
            </Flex>
        );
    }
}


MordorPage.propTypes = {
    names:            PropTypes.object.isRequired,
    requestsPending:  PropTypes.bool.isRequired,
    fetchAndAddName:  PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
};


MordorPage.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
}
