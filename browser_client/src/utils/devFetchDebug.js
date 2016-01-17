/*
thanks to:
    http://stackoverflow.com/a/3354511/1941513
    http://ilee.co.uk/changing-url-without-page-refresh/
    http://stackoverflow.com/a/4001415/1941513
    http://stackoverflow.com/a/11933007/1941513
    http://stackoverflow.com/a/3340186/1941513
*/
const werkzeugDebugger = (flaskResponse, url, fetchCall) => {
    if (!sameOrigin(url)) return;

    if(!confirm('Server Error!  Open Werkzeug Debugger?')) return;

    window.history.pushState({}, 'Werkzeug Debugger', fetchCall.endpoint);

    try {
        window.document.open();
        window.document.write(flaskResponse);
    }
    finally {
        window.document.close();
    }
};


/*
thanks to: https://gist.github.com/jlong/2428561
*/
const sameOrigin = url => {
    const parser = document.createElement('a');
    parser.href = url;
    return parser.origin === window.location.origin;
};


export default werkzeugDebugger;
