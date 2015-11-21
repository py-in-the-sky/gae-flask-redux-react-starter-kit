import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ShirePage } from '../components';
import { ActionCreators } from '../actions';


// Construct a 'smart container' around a 'dumb' component.
// The construction for ShirePage and MordorPage are the same.
// However, they could differ and probably would in any
// real-world app.


const mapStateToProps = ({ names, windowSize, pendingRequests }) =>
    ({ names, windowSize, requestsPending: pendingRequests.size > 0 });


const createApp = () => connect(mapStateToProps, ActionCreators)(ShirePage);


export default createApp();
