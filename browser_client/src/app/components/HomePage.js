import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import AddNameForm from './AddNameForm';
import Greetings from './Greetings';
import Paper from 'material-ui/lib/paper';
import Block from 'jsxstyle/Block';
import { Frame, Container } from './Flex';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Themes } from 'app/utils/styles';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';


const DefaultTheme = ThemeManager.getMuiTheme(Themes.Default);


export default class HomePage extends PureComponent {
    getChildContext () {
        return {
            muiTheme: DefaultTheme,
        };
    }

    render () {
        const {
            names,
            serverValidation,
            addName,
            requestsPending,
            clearServerValidation,
        } = this.props;

        return (
            <Block height="100%">
                <Frame>
                    <Paper style={{ overflow: 'hidden' }} zDepth={4}>
                        <Container justifyContent="space-between">
                            <Container padding={names.size ? '1rem' : 0}>
                                <Greetings
                                 names={names}
                                 requestsPending={requestsPending} />
                            </Container>
                            <Container>
                                <AddNameForm
                                 addName={addName}
                                 serverValidation={serverValidation}
                                 clearServerValidation={clearServerValidation} />
                            </Container>
                        </Container>
                    </Paper>
                </Frame>
                <Container>
                    <h1>Below the Fold</h1>
                </Container>
            </Block>
        );
    }
}


HomePage.propTypes = {
    names: ImmutablePropTypes.listOf( ImmutablePropTypes.recordOf({
        name: PropTypes.string.isRequired,
    }) ).isRequired,
    addName:               PropTypes.func.isRequired,
    requestsPending:       PropTypes.bool.isRequired,
    clearServerValidation: PropTypes.func.isRequired,
    serverValidation: ImmutablePropTypes.recordOf({
        name: PropTypes.string.isRequired,
    }),
};


HomePage.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
};
