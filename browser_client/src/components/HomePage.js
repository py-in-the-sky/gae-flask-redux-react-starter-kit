import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import AddNameForm from './AddNameForm';
import Greetings from './Greetings';
import Paper from 'material-ui/lib/paper';
import { Frame, Container } from './Flex';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Themes } from '../utils/styles';


const DefaultTheme = ThemeManager.getMuiTheme(Themes.Default);


export default class HomePage extends PureComponent {
    getChildContext () {
        return {
            muiTheme: DefaultTheme,
        };
    }

    render () {
        const { names, addName, requestsPending } = this.props;

        return (
            <Frame>
                <Paper style={{ overflow: 'hidden' }} zDepth={4}>
                    <Container justifyContent="space-between">
                        <Container padding={names.size ? '1rem' : 0}>
                            <Greetings
                             names={names}
                             requestsPending={requestsPending} />
                        </Container>
                        <Container>
                            <AddNameForm addName={addName} />
                        </Container>
                    </Container>
                </Paper>
            </Frame>
        );
    }
}


HomePage.propTypes = {
    names:           PropTypes.object.isRequired,
    addName:         PropTypes.func.isRequired,
    requestsPending: PropTypes.bool.isRequired,
};


HomePage.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
};
