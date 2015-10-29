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
}


export const WindowSizes = {
    SMALL:  1,
    MEDIUM: 2,
    LARGE:  3,
};
