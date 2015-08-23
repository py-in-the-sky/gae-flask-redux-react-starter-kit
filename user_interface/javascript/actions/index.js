// import $ from 'jquery';


export function fetchAndAddName (delay = 300) {
    return dispatch => {
        setTimeout(() => { dispatch(addName('Ryan')); } , delay);
        // return $.get('endpoint')
        //         .done(name => dispatch(addName(name)));
                // .fail()
    };
}


export const ADD_NAME = 'ADD_NAME';
function addName (name) {
    return {
        type: ADD_NAME,
        payload: name
    };
}


export const SUBTRACT_LAST_NAME = 'SUBTRACT_LAST_NAME';
export function subtractLastName () {
    return {
        type: SUBTRACT_LAST_NAME
    };
}
