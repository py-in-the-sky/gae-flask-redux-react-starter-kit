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
        this.defaultValues = this.defaultValues.bind(this);
        this.endValues = this.endValues.bind(this);
        this.chooseSalutation = memoize( key => randomElement(salutations) );
    }


    render () {
        return (
            <TransitionSpring
             defaultValue={this.defaultValues()}
             endValue={this.endValues()}
             willEnter={() => { return { val: 30 }}}
             willLeave={() => { return { val: 0 }}} >

                {currentValues =>

                    <div className="greetings" style={{ float: 'left', marginLeft: 20 }}>

                        {this.currentChildren(currentValues).map( ([name, index, currentValue]) =>

                            <div
                             key={index}
                             style={{ transform: `translateY(${currentValue.val}px)` }} >

                                <Greeting
                                 name={name}
                                 salutation={this.chooseSalutation(index)} />

                            </div>

                        )}

                    </div>

                }

            </TransitionSpring>
        );
    }

    endValues () {
        return this.props.names.map( () => { return { val: 0 }} ).toObject();
    }

    defaultValues () {
        return this.props.names.map( () => { return { val: 30 }} ).toObject();
    }

    currentChildren (tweenValues) {
        return this.props.names
                   .filter( (_, index) => index in tweenValues )
                   .map( (name, index) => [name, index, tweenValues[index]] );
    }
}


Greetings.propTypes = {
    names: PropTypes.object.isRequired,
}
