import { connect } from 'react-redux'
import { Layout } from 'app/components'


const createApp = () => connect(({ windowSize }) => ({ windowSize }), null)(Layout)


export default createApp()
