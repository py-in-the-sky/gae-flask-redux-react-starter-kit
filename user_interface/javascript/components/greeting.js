import React, { Component, PropTypes } from 'react';
import { Spring, presets } from 'react-motion';


export default class Greeting extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const greeting = this.props.salutation + ', ' + this.props.name + '!';

        return (
            <Spring
             defaultValue={{ val: 30 }}
             endValue={{ val: 0, config: presets.gentle }}>

                {currentValue =>
                    <div
                     className="greeting"
                     style={{ transform: `translateY(${currentValue.val}px)` }}>

                        {greeting}

                    </div>
                }

            </Spring>
        );
    }
}


Greeting.propTypes = {
    name:       PropTypes.string.isRequired,
    salutation: PropTypes.string.isRequired,
}
