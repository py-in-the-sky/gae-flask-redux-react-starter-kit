import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';


// thanks to material-ui
export function windowSize (windowWidth) {
    if (windowWidth >= WindowWidthThresholds.LARGE)
        return WindowSizes.LARGE;

    if (windowWidth >= WindowWidthThresholds.MEDIUM)
        return WindowSizes.MEDIUM;

    return WindowSizes.SMALL;
}


export const WindowWidthThresholds = {
    MEDIUM: 768,
    LARGE:  992,
};


export const WindowSizes = {
    SMALL:  1,
    MEDIUM: 2,
    LARGE:  3,
};


const Default = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: Object.assign({}, LightRawTheme.palette, {
        canvasColor: '#fdfdfd',
    }),
};


const Shire = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: Colors.green500,
        primary2Color: Colors.green700,
        primary3Color: Colors.lightBlack,
        accent1Color: Colors.amberA700,
        accent2Color: Colors.grey100,
        accent3Color: Colors.grey500,
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.white,
        canvasColor: Colors.green100,
        borderColor: Colors.grey300,
        disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    },
};


const Mordor = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: Colors.blueGrey500,
        primary2Color: Colors.blueGrey700,
        primary3Color: Colors.grey600,
        accent1Color: Colors.deepOrangeA400,
        accent2Color: Colors.deepOrangeA700,
        accent3Color: Colors.deepOrangeA200,
        textColor: Colors.fullWhite,
        alternateTextColor: Colors.darkWhite,
        canvasColor: '#303030',
        borderColor: ColorManipulator.fade(Colors.fullWhite, 0.3),
        disabledColor: ColorManipulator.fade(Colors.fullWhite, 0.3)
    },
};


export const Themes = { Shire, Default, Mordor };
