import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HomePage } from 'components';
import { ActionCreators } from 'actions';


const { addName, clearServerValidation } = ActionCreators;


const mapStateToProps = ({ names, serverValidation, pendingRequests }) =>
    ({ names, serverValidation, requestsPending: pendingRequests.size > 0 });


const createApp = () => connect(mapStateToProps, {
    addName, clearServerValidation
})(HomePage);


export default createApp();
