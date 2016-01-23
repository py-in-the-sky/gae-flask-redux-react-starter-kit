import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import { connect } from 'react-redux';
import { ActionCreators } from 'app/actions';


const { clearServerError, clearNetworkError } = ActionCreators;


export class CriticalErrorAlert extends PureComponent {
    render () {
        const {
            serverError,
            networkError,
            clearServerError,
            clearNetworkError,
        } = this.props;

        const open = serverError || networkError;

        let closeAction;
        if (open) {
            closeAction = serverError ? clearServerError : clearNetworkError;
        }

        let message;
        if (serverError) {
            message = `A problem occurred on the server.
                       Please try again later.`;
        }
        else if (networkError) {
            message = `Cannot connect to internet.
                       Please ensure you're connected and try again.`;
        }

        const closeButton = (
            <FlatButton
             key="close-button"
             label="Close"
             primary={true}
             onTouchTap={closeAction} />
        );

        // TODO: no need to wrap `closeAction` in array
        // after upgrading to `material-ui` v0.14.x

        return (
            <Dialog
             title="Oops!"
             actions={[closeButton]}
             open={open}
             onRequestClose={closeAction}>

              {message}

            </Dialog>
        );
    }
}


CriticalErrorAlert.propTypes = {
    serverError: PropTypes.bool.isRequired,
    networkError: PropTypes.bool.isRequired,
    clearServerError: PropTypes.func.isRequired,
    clearNetworkError: PropTypes.func.isRequired,
};


const mapStateToProps = ({ serverError, networkError }) =>
    ({ serverError, networkError });


export default connect(mapStateToProps, {
    clearServerError, clearNetworkError
})(CriticalErrorAlert);
