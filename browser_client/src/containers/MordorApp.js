import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MordorPage } from '../components';
import { ActionCreators } from '../actions';


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
    return bindActionCreators(ActionCreators, dispatch);
}


function createApp () {
    return connect(mapStateToProps, mapDispatchToProps)(MordorPage);
}


export default createApp();
