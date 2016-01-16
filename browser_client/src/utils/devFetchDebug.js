const werkzeugDebugger = (flaskResponse, path) => {
    const debuggerLocation = window.location.origin + path;
    const debuggerWindow   = window.open(debuggerLocation, 'Werkzeug Debugger');
    debuggerWindow.document.open();
    debuggerWindow.location.href = debuggerLocation;
    debuggerWindow.document.write(flaskResponse);
    debuggerWindow.document.close();
}


export default werkzeugDebugger;
