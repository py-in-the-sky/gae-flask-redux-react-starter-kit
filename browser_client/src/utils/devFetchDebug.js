const werkzeugDebugger = (flaskResponse, url) => {
    const debuggerLocation = url;
    const debuggerWindow   = window.open(debuggerLocation, 'Werkzeug Debugger');
    debuggerWindow.document.open();
    debuggerWindow.location.href = debuggerLocation;
    debuggerWindow.document.write(flaskResponse);
    debuggerWindow.document.close();
}


export default werkzeugDebugger;
