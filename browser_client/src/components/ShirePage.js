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
             height="100%"
             position="relative"
             overflow="hidden"
             flex="1 1 auto"
             flexFlow="row wrap"
             flexWrap="nowrap"
             alignItems="stretch"
             justifyContent="center"
             order={0}
             backfaceVisibility="hidden"
             padding={20}>

                <Paper zDepth={4}>

                    <Flex
                     position="relative"
                     overflow="hidden"
                     flex="1 1 auto"
                     flexFlow="row wrap"
                     flexWrap="nowrap"
                     alignItems="stretch"
                     justifyContent="space-between"
                     order={0}
                     backfaceVisibility="hidden"
                     padding={20}>

                        <Flex
                         position="relative"
                         overflow="hidden"
                         flex="1 1 auto"
                         flexFlow="row wrap"
                         flexWrap="nowrap"
                         alignItems="stretch"
                         order={0}
                         backfaceVisibility="hidden"
                         padding={names.size ? 20 : 0}>

                            <Greetings names={names} />

                        </Flex>

                        <Flex
                         position="relative"
                         overflow="hidden"
                         flex="1 1 auto"
                         flexFlow="row wrap"
                         flexWrap="nowrap"
                         alignItems="stretch"
                         order={0}
                         backfaceVisibility="hidden"
                         padding={20}>

                            <GreetingControls
                             requestsPending={requestsPending}
                             fetchAndAddName={fetchAndAddName}
                             subtractLastName={subtractLastName} />

                        </Flex>

                    </Flex>

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
