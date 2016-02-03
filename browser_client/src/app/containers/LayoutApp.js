import { connect } from 'react-redux'
import { Layout } from 'app/components'


const mapStateToProps = ({ windowSize }) => ({ windowSize })
const createApp = () => connect(mapStateToProps)(Layout)


export default createApp()
