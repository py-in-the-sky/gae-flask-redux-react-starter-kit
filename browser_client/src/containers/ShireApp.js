import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShirePage from '../components/ShirePage';
import * as Actions from '../actions';


// Construct a 'smart container' around a 'dumb' component.
// The construction for ShirePage and MordorPage are the same.
// However, they could differ and probably would in any
// real-world app.


function mapStateToProps (state) {
    const { names, pendingRequests } = state;
    const requestsPending = pendingRequests.size > 0;
    return { names, requestsPending };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}


function createApp () {
    return connect(mapStateToProps, mapDispatchToProps)(ShirePage);
}


export default createApp();