import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import RaisedButton from 'material-ui/lib/raised-button'
import { ColumnWise } from './Flex'


const buttonMargin    = { marginBottom: 5 }
const waitingStyle    = { visibility: 'visible' }
const notWaitingStyle = { visibility: 'hidden' }


export default class GreetingControls extends Component {
    constructor (props) {
        super(props)
        this.addName = () => this.props.addName()
        this.subtractLastName = () => this.props.subtractLastName()
    }

    render () {
        const { requestsPending } = this.props

        return (
            <ColumnWise
             overflow="hidden"
             flexWrap="wrap"
             padding="0 10px">

                <RaisedButton
                 style={buttonMargin}
                 primary={true}
                 label="ADD GREETING"
                 onTouchTap={this.addName} />

                <RaisedButton
                 style={buttonMargin}
                 secondary={true}
                 label="SUBTRACT LAST GREETING"
                 onTouchTap={this.subtractLastName} />

                <div
                 className="waiting"
                 style={requestsPending ? waitingStyle : notWaitingStyle}>
                    Waiting...
                </div>

            </ColumnWise>
        )
    }
}


GreetingControls.propTypes = {
    requestsPending: PropTypes.bool.isRequired,
    addName: PropTypes.func.isRequired,
    subtractLastName: PropTypes.func.isRequired,
}
