import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HomePage } from '../components';
import { ActionCreators } from '../actions';


const { addName } = ActionCreators;


const mapStateToProps = ({ names, pendingRequests }) =>
    ({ names, requestsPending: pendingRequests.size > 0 });


const createApp = () => connect(mapStateToProps, { addName })(HomePage);



export default createApp();
