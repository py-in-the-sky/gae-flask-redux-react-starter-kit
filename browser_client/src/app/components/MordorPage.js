import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Greetings from './Greetings';
import GreetingControls from './GreetingControls';
import Paper from 'material-ui/lib/paper';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Themes } from 'app/utils/styles';
import { Frame } from './Flex';
import { List } from 'immutable';


const MordorTheme = ThemeManager.getMuiTheme(Themes.Mordor);


export default class MordorPage extends PureComponent {
    componentDidMount () {
        if (this.props.names.size === 0)
            this.props.addName();
    }

    getChildContext () {
        return {
            muiTheme: MordorTheme,
        };
    }

    render () {
        const {
            names,
            requestsPending,
            addName,
            subtractLastName,
        } = this.props;

        return (
            <Frame>

                <Paper zDepth={4} style={{ color: '#eeeeee' }}>

                    <GreetingControls
                     requestsPending={requestsPending}
                     addName={addName}
                     subtractLastName={subtractLastName} />

                    <Greetings
                     names={names} />

                </Paper>

            </Frame>
        );
    }
}


MordorPage.propTypes = {
    names:            PropTypes.instanceOf(List).isRequired,
    requestsPending:  PropTypes.bool.isRequired,
    addName:          PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
};


MordorPage.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
}
