import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'


export default class Greeting extends Component {
    render () {
        const { salutation, name } = this.props

        return (
            <div>
                {`${salutation}, ${name.name}!`}
            </div>
        )
    }
}


Greeting.propTypes = {
    salutation: PropTypes.string.isRequired,
    name: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
}
