const werkzeugDebugger = (flaskResponse, url) => {
    const debuggerLocation = url;
    const debuggerWindow   = window.open(debuggerLocation, 'Werkzeug Debugger');
    try {
        debuggerWindow.document.open();
        debuggerWindow.location.href = debuggerLocation;
        debuggerWindow.document.write(flaskResponse);
    }
    finally {
        debuggerWindow.document.close();
    }
};


// TODO: fix: this works for GET requests but not POST


export default werkzeugDebugger;
