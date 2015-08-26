import React, { Component, PropTypes } from 'react';
import { TransitionSpring } from 'react-motion';
import { List, Set } from 'immutable';
import Greeting from './greeting';
import { randomElement } from '../utils/array';
import { memoize } from '../utils/lodash_utils';


const salutations = [ 'Hello', 'Hi', 'Hey', 'Yo', ];
const emptyList = List();


export default class Greetings extends Component {
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
                            const { name, translateY } = configs[index];

                            return (
                                <div
                                 key={index}
                                 style={{ transform: `translateY(${translateY.val}px)` }} >

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
                return { name, translateY: { val: 0 } };
            }).toObject();
    }

    willEnter (keyThatEnters, correspondingValueOfKey, endValueYouJustSpecified, currentInterpolatedValue, currentSpeed) {
        const { name } = correspondingValueOfKey;
        return { name, translateY: { val: 30 }};
    }

    willLeave (keyThatLeaves, correspondingValueOfKeyThatJustLeft, endValueYouJustSpecified, currentInterpolatedValue, currentSpeed) {
        const { name, translateY } = correspondingValueOfKeyThatJustLeft;
        return { name, translateY: { val: 30 }};
    }
}


Greetings.propTypes = {
    names: PropTypes.object.isRequired,
}
