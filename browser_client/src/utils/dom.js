// thanks to https://github.com/cesarandreu/react-window-resize-listener
export function getWindowWidth () {
    const w = (window.innerWidth ||
               document.documentElement.clientWidth ||
               document.body.clientWidth);

    if (__DEV__)
        console.log('*** getWindowWidth() ->', w, '***');

    return w;
}
