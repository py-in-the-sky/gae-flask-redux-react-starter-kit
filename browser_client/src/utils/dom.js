import { throttle } from './lodash';


// thanks to https://github.com/cesarandreu/react-window-resize-listener
export function getWindowWidth () {
    if (__DEV__)
        console.log('*** getWindowWidth ***');

    return (window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth);
}


export const throttledGetWindowWidth = throttle(
    getWindowWidth,
    300,
    { leading: true, trailing: false }
);
