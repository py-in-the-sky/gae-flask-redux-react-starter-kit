import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { TransitionSpring } from 'react-motion';
import Greeting from './greeting';
import { randomElement } from '../utils/array';
import { memoize } from '../utils/lodash_utils';


/* eslint-disable no-unused-vars */


const salutations = [ 'Hello', 'Hi', 'Hey', 'Yo', ];


export default class Greetings extends PureComponent {
    constructor(props) {
        super(props);
        this.endValues = this.endValues.bind(this);
        this.willEnter = this.willEnter.bind(this);
        this.willLeave = this.willLeave.bind(this);
        this.chooseSalutation = memoize( key => randomElement(salutations) );
    }


    render () {
        return (
            <TransitionSpring
             endValue={this.endValues()}
             willEnter={this.willEnter}
             willLeave={this.willLeave} >

                {configs =>

                    <div className="greetings" style={{ float: 'left', marginLeft: 20 }}>

                        {Object.keys(configs).map( index => {
                            const { name, translateY, opacity } = configs[index];
                            const style = {
                                transform: `translateY(${translateY.val}px)`,
                                opacity: opacity.val
                            };

                            return (
                                <div key={index} style={style} >

                                    <Greeting
                                     name={name}
                                     salutation={this.chooseSalutation(index)} />

                                </div>
                            );
                        })}

                    </div>

                }

            </TransitionSpring>
        );
    }

    endValues () {
        return this.props.names.map( (name) => {
            return { name, translateY: { val: 0 }, opacity: { val: 1 } };
        }).toObject();
    }

    willEnter (keyThatEnters, correspondingValueOfKey, endValueYouJustSpecified, currentInterpolatedValue, currentSpeed) {
        const { name } = correspondingValueOfKey;
        return { name, translateY: { val: 30 }, opacity: { val: 0 } };
    }

    willLeave (keyThatLeaves, correspondingValueOfKeyThatJustLeft, endValueYouJustSpecified, currentInterpolatedValue, currentSpeed) {
        const { name } = correspondingValueOfKeyThatJustLeft;
        return { name, translateY: { val: 30 }, opacity: { val: 0} };
    }
}


Greetings.propTypes = {
    names: PropTypes.object.isRequired,
};
