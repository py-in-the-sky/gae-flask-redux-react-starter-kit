import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Greetings from './Greetings';
import GreetingControls from './GreetingControls';
import Paper from 'material-ui/lib/paper';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Themes } from '../utils/styles';
import { Flex } from 'jsxstyle';


export default class ShirePage extends PureComponent {
    componentDidMount () {
        if (this.props.names.size === 0)
            this.props.fetchAndAddName();
    }

    getChildContext () {
        return {
            muiTheme: ThemeManager.getMuiTheme(Themes.Shire),
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
             height="100vh"
             position="relative"
             overflow="hidden"
             flex="1 1 auto"
             flexFlow="row wrap"
             flexWrap="nowrap"
             alignItems="stretch"
             justifyContent="center"
             order={0}
             backfaceVisibility="hidden">
                <Paper className="page">

                    <Greetings
                     names={names} />

                    <GreetingControls
                     requestsPending={requestsPending}
                     fetchAndAddName={fetchAndAddName}
                     subtractLastName={subtractLastName} />

                </Paper>
            </Flex>
        );
    }
}


ShirePage.propTypes = {
    names:            PropTypes.object.isRequired,
    requestsPending:  PropTypes.bool.isRequired,
    fetchAndAddName:  PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
};


ShirePage.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
};
