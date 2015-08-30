import $ from 'jquery';


export function initializeAjaxDebuggingUtils () {
    if (document)
        ajaxErrorDebug();

    if (document && console && console.log)
        ajaxCompleteLog();
}


function ajaxErrorDebug () {
    $(document).ajaxError((event, jqXHR, settings, error) => {
        if (jqXHR.status >= 500 && !settings.crossDomain)
            werkzeugDebugger(jqXHR.responseText, settings.url);
    });
}


function werkzeugDebugger (flaskResponse, path) {
    const debuggerLocation = window.location.origin + path;
    const debuggerWindow   = window.open(debuggerLocation, 'Werkzeug Debugger');
    debuggerWindow.document.open();
    debuggerWindow.location.href = debuggerLocation;
    debuggerWindow.document.write(flaskResponse);
    debuggerWindow.document.close();
}


function ajaxCompleteLog () {
    $(document).ajaxComplete((event, jqXHR, settings) => {
        const data = {
            event:    event,
            jqXHR:    jqXHR,
            settings: settings
        };
        console.log('[AJAX Complete]', data);
    });
}
