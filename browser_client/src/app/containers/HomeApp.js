import { connect } from 'react-redux'
import { HomePage } from 'app/components'
import { ActionCreators } from 'app/actions'


const { addName, clearServerValidation } = ActionCreators


const mapStateToProps = (state, ownProps) => {
    const { location: { pathname } } = ownProps
    const {
        names,
        serverValidation,
        pendingRequests,
        enteredPagePath,
    } = state

    return {
        names,
        serverValidation,
        requestsPending: pendingRequests.size > 0,
        pageHasEntered: pathname === enteredPagePath,
    }
}


const createApp = () => connect(mapStateToProps, {
    addName, clearServerValidation
})(HomePage)


export default createApp()
