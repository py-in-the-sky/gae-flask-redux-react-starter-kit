const werkzeugDebugger = (flaskResponse, path) => {
    window.history.pushState({}, 'Werkzeug Debugger', path);

    try {
        window.document.open();
        window.document.write(flaskResponse);
    }
    finally {
        window.document.close();
    }
};


export default werkzeugDebugger;
