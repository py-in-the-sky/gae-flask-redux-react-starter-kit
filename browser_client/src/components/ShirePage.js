import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Greetings from './Greetings';
import GreetingControls from './GreetingControls';
import Paper from 'material-ui/lib/paper';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Themes, WindowSizes } from '../utils/styles';
import { Frame, Container } from './Flex';


const ShireTheme = ThemeManager.getMuiTheme(Themes.Shire);


const baseImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
const imageUrls = {
    [WindowSizes.SMALL]:  `${baseImageUrl}4/4c/Hobbiton%2C_New_Zealand.jpg/800px-Hobbiton%2C_New_Zealand.jpg`,
    [WindowSizes.MEDIUM]: `${baseImageUrl}4/4c/Hobbiton%2C_New_Zealand.jpg/1024px-Hobbiton%2C_New_Zealand.jpg`,
    [WindowSizes.LARGE]:  `${baseImageUrl}8/89/Hobbit_holes_reflected_in_water.jpg/1280px-Hobbit_holes_reflected_in_water.jpg`,
};


export default class ShirePage extends PureComponent {
    componentDidMount () {
        if (this.props.names.size === 0)
            this.props.addName();
    }

    getChildContext () {
        return {
            muiTheme: ShireTheme,
        };
    }

    render () {
        const {
            names,
            windowSize,
            requestsPending,
            addName,
            subtractLastName,
        } = this.props;

        const imageUrl = imageUrls[windowSize];

        return (
            <Frame
             backgroundSize="cover"
             background={`url(${imageUrl}) no-repeat center center fixed`}>

                <Paper zDepth={4}>

                    <Container justifyContent="space-between">

                        <Container padding={names.size ? '1rem' : 0}>

                            <Greetings names={names} />

                        </Container>

                        <Container>

                            <GreetingControls
                             requestsPending={requestsPending}
                             addName={addName}
                             subtractLastName={subtractLastName} />

                        </Container>

                    </Container>

                </Paper>

            </Frame>
        );
    }
}


ShirePage.propTypes = {
    names:            PropTypes.object.isRequired,
    windowSize:       PropTypes.number.isRequired,
    requestsPending:  PropTypes.bool.isRequired,
    addName:          PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
};


ShirePage.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
};
