// thanks to material-ui
export function windowSize (windowWidth) {
    if (windowWidth >= 992) return WindowSizes.LARGE;
    if (windowWidth >= 768) return WindowSizes.MEDIUM;
    return WindowSizes.SMALL;
}


export const WindowSizes = {
    SMALL:  1,
    MEDIUM: 2,
    LARGE:  3,
};
