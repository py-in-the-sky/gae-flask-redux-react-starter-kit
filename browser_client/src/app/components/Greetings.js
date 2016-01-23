import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { VelocityTransitionGroup } from 'velocity-react';
import CircularProgress from 'material-ui/lib/circular-progress';
import Greeting from './Greeting';
import { randomElement } from 'app/utils/array';
import { memoize } from 'app/utils/lodash';
import { List } from 'immutable';


const circularProgress = <CircularProgress size={0.5} />;


export default class Greetings extends PureComponent {
    constructor(props) {
        super(props);
        /* eslint-disable no-unused-vars */
        this.chooseSalutation = memoize( key => randomElement(salutations) );
    }

    render () {
        const { names, requestsPending } = this.props;
        return (
            <div>
                <VelocityTransitionGroup
                 component="div"
                 enter={greetingEnter}
                 leave={greetingLeave}>

                    {names.map( (name, index) =>

                        <Greeting
                         key={index}
                         name={name}
                         salutation={this.chooseSalutation(index)} />

                    )}

                </VelocityTransitionGroup>

                {requestsPending ? circularProgress : null}
            </div>
        );
    }
}


Greetings.propTypes = {
    names:           PropTypes.instanceOf(List).isRequired,
    requestsPending: PropTypes.bool,
};


const salutations = [ 'Hello', 'Hi', 'Hey', 'Yo', ];


const defaultAnimationOpts = {
    duration: 300,
    easing:   'easeOutExpo',
};


const greetingEnter = {
    ...defaultAnimationOpts,
    animation: {
        translateY: [0, 30],
        opacity:    [1, 0],
    },
};


const greetingLeave = {
    ...defaultAnimationOpts,
    animation: {
        translateY: [30, 0],
        opacity:    [0, 1],
    },
};
