import { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import { on, off } from 'material-ui/lib/utils/events'
import { debounce } from 'app/utils/lodash'
import { getWindowWidth } from 'app/utils/dom'
import { windowSize } from 'app/utils/styles'
import { connect } from 'react-redux'
import { ActionCreators } from 'app/actions'


const { windowData } = ActionCreators


/*
* Concept: React components handle DOM events from the user
* and send off relevant data to the store.  Window resizing
* is a user action via the DOM, telling the app, "Hey, I'm
* adjusting my window size, please adjust your styling accordingly."
*/
export class WindowResizeListener extends Component {
    constructor (props) {
        super(props)

        this.sendWindowData = this.sendWindowData.bind(this)

        this.debouncedSendWindowData = debounce(
            this.sendWindowData,
            this.props.debounceTime,
            { leading: false, trailing: true, maxWait: this.props.debounceTime * 2 }
        )
    }

    sendWindowData () {
        const windowWidth = getWindowWidth()
        this.props.windowData({ windowWidth, windowSize: windowSize(windowWidth) })
    }

    componentWillMount () {
        on(window, 'resize', this.debouncedSendWindowData)
        // Now we're listening to the window-resize event.
        // For performance over correctness, we do not actually
        // query the window size upon `componentWillMount` since
        // our Redux store will have done so on its initialization
        // just a fraction of a second prior to this component
        // mounting.
    }

    componentWillUnmount () {
        off(window, 'resize', this.debouncedSendWindowData)
    }

    render () {
        return null
    }
}


WindowResizeListener.propTypes = {
    debounceTime: PropTypes.number.isRequired,
    windowData:   PropTypes.func.isRequired,
}


WindowResizeListener.defaultProps = {
    debounceTime: 350,
}


export default connect(undefined, { windowData })(WindowResizeListener)
