import devLogFunctionCalls from './devLogFunctionCalls'


// thanks to https://github.com/cesarandreu/react-window-resize-listener
const _getWindowWidth = () =>
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth


export const getWindowWidth = devLogFunctionCalls(_getWindowWidth)
