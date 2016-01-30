import { connect } from 'react-redux'
import { HomePage } from 'app/components'
import { ActionCreators } from 'app/actions'


const { addName, clearServerValidation } = ActionCreators


const mapStateToProps = ({ names, serverValidation, pendingRequests }) =>
    ({ names, serverValidation, requestsPending: pendingRequests.size > 0 })


const createApp = () => connect(mapStateToProps, {
    addName, clearServerValidation
})(HomePage)


export default createApp()
