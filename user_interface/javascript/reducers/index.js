import { ADD_NAME, SUBTRACT_LAST_NAME } from '../actions';
import { List } from 'immutable';


const emptyList = List();


export function names (state = emptyList, action) {
    const { type, payload } = action;

    if (type === ADD_NAME)
        return state.push(payload);
    else if (type === SUBTRACT_LAST_NAME)
        return state.pop();
    else
        return state;
}
