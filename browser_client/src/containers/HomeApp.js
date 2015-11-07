import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HomePage } from '../components';
import { ActionCreators } from '../actions';


const { addName } = ActionCreators;


const createApp = () =>
    connect(
        state => ({
            names: state.names,
            requestsPending: state.pendingRequests.size > 0
        }),
        dispatch => bindActionCreators({ addName }, dispatch)
    )(HomePage);


export default createApp();
