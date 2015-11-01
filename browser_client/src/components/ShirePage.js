import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Greetings from './Greetings';
import GreetingControls from './GreetingControls';
import Paper from 'material-ui/lib/paper';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Themes } from '../utils/styles';


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
            <Paper className="page">

                <Greetings
                 names={names} />

                <GreetingControls
                 requestsPending={requestsPending}
                 fetchAndAddName={fetchAndAddName}
                 subtractLastName={subtractLastName} />

            </Paper>
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
