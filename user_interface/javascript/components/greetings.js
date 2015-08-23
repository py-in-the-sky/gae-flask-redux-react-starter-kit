import React, { Component, PropTypes } from 'react';
import Greeting from './greeting';
import { randomElement } from '../utils/array';
import { memoize } from '../utils/lodash_utils';


const salutations    = [ 'Hello', 'Hi', 'Hey', 'Yo', ];


export default class Greetings extends Component {
    constructor(props) {
        super(props);
        this.renderGreetings      = this.renderGreetings.bind(this);
        this.chooseSalutation = memoize( key => randomElement(salutations) );
    }


    render () {
        return (
            <div className="greetings" style={{ float: 'left', marginLeft: 20 }}>
                {this.renderGreetings()}
            </div>
        );
    }

    renderGreetings () {
        return this.props.names.map( (name, index) =>
            <Greeting
             key={index}
             name={name}
             salutation={this.chooseSalutation(index)} />
        );
    }
}


Greetings.propTypes = {
    names: PropTypes.object.isRequired,
}
