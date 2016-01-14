import fetchMiddleware from './fetch';


const EMPTY_OBJ = {};


const beforeFetch = fetchCall => ({
    ...fetchCall,
    credentials: 'same-origin',
    headers: {
        ...(fetchCall.headers || EMPTY_OBJ),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(fetchCall.body),
});


const onFetchFail = response => response;
// TODO: in __DEV__, open Werkzeug debugger (500-level response)
// in new window
// TODO: if failure is 500-level, don't send action-creator's fail response;
// instead, send an action creator that results in the user being told
// "Could not connect to server.  Please try again."


export default fetchMiddleware({ beforeFetch, onFetchFail });
