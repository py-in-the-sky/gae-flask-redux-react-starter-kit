import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Greetings from './Greetings';
import GreetingControls from './GreetingControls';
import Paper from 'material-ui/lib/paper';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Themes } from '../utils/styles';
import { Frame, Container } from './Flex';


export default class HomePage extends PureComponent {
    render () {
        const { names, addName } = this.props;

        return (
            <Frame>

                <Paper zDepth={4}>

                    <Container justifyContent="space-between">

                        <Container padding={names.size ? '1rem' : 0}>

                            <Greetings names={names} />

                        </Container>

                        <Container></Container>

                    </Container>

                </Paper>

            </Frame>
        );
    }
}


HomePage.propTypes = {
    names:   PropTypes.object.isRequired,
    addName: PropTypes.func.isRequired,
};
