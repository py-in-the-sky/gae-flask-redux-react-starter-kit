const werkzeugDebugger = (flaskResponse, path) => {
    const debuggerWindow   = window.open(undefined, 'Werkzeug Debugger');

    try {
        debuggerWindow.document.open();

        if (path) {
            debuggerWindow.location.href = window.location.origin + path;
        }

        debuggerWindow.document.write(flaskResponse);
    }
    finally {
        debuggerWindow.document.close();
    }
};


export default werkzeugDebugger;
