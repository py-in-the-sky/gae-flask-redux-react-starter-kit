import { connect } from 'react-redux'
import { Layout } from 'app/components'
import { ActionCreators } from 'app/actions'


const { enteredPagePath } = ActionCreators
const mapStateToProps = ({ windowSize }) => ({ windowSize })
const createApp = () => connect(mapStateToProps, { enteredPagePath })(Layout)


export default createApp()
