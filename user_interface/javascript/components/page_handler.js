import React, { PropTypes, Children } from 'react';
import PureComponent from 'react-pure-render/component';
import { TransitionSpring, presets } from 'react-motion';
import Navigation from './navigation';
import { getWindowWidth } from '../utils/dom';


// Notes on animations choices and using TransitionSpring:
// 1) `willEnter` and `willLeave` take `windowWidth` and return
//    functions that TransitionSpring can use for tweening and
//    animating.  The reason for this is to prevent DOM thrashing
//    (the interleaving of gets and sets on the DOM).  The get
//    operation on the DOM of getting the window's width is performed
//    only once at the beginning of the page transition; the rest
//    of the animation is then sets on the (virtual) DOM by TransitionSpring.
// 2) Note that inside TransitionSpring's children function ({configs => ...}),
//    ALL variable data used to render children comes from `configs`.  Any
//    variable data that comes from outside the children function's context
//    is not guaranteed to sync/work well with the transition animation.
//    And by all variable data, I mean ALL variable data: styles, child components,
//    props for child components, etc.  Note in the children function below that
//    the child React component that's rendered inside the div comes from `configs`,
//    and hence was passed into TransitionSpring via the `endValues`, `willEnter`, and
//    `willLeave` functions.
// 3) Note that in the `endValues` function below we return an object that conatins only
//    one key and one child.  This is because we intend that the end state of the animation
//    leaves just one top-level page inside PageHandler.
// 4) Note that even though we really only return one child component from
//    `endValues`, we provide it under a key in an object.  TransitionSpring can
//    handle multiple entering/exiting children and the API for `endValues`
//    is to return an object with a key-value pair for each child that should be
//    present at the end of the transition animation.
// 5) Note that even though we only supply one child in the return value of
//    `endValues`, we don't just give it an arbitrary key; in this case, we give it
//    a key that identifies the URL path to the page.  TransitionSpring triggers a
//    transition animation only when the keys of the object returned by `endValues`
//    have changed.  Hence, in our case, providing the URL path as the key to the
//    object ensures that when a new page is chosen by the user, the keys of the
//    object from `endValues` change to reflect the new URL path, and hence
//    TransitionSpring will kick off the animation that we describe in `endValues`,
//    `willEnter`, and `willLeave`.


export default class PageHandler extends PureComponent {
    constructor(props) {
        super(props);
        this.endValues = this.endValues.bind(this);
        this.willEnter = this.willEnter.bind(this);
        this.willLeave = this.willLeave.bind(this);
    }

    render () {
        const windowWidth = getWindowWidth();

        return (
            <div style={{ backgroundColor: '#FDFDFD' }}>

                <Navigation />

                <TransitionSpring
                 endValue={this.endValues()}
                 willEnter={this.willEnter(windowWidth)}
                 willLeave={this.willLeave(windowWidth)} >

                    {configs =>
                        <div>
                            {Object.keys(configs).map( pathname => {
                                const { translateX, child } = configs[pathname];
                                const style = {
                                    transform: `translateX(${translateX.val}px)`,
                                    position: 'absolute',
                                    top: 70,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                };

                                return <div style={style} key={pathname}>{child}</div>;
                            })}
                        </div>
                    }

                </TransitionSpring>

            </div>
        );
    }

    endValues () {
        const { children, location: { pathname } } = this.props;
        return {
            [pathname]: {
                child: children,
                translateX: { val: 0, config: [450, 35] },
            }
        };
    }

    willEnter (windowWidth) {
        const translateXStart = windowWidth;

        return (key, value) => {
            const { child } = value;
            return {
                child,
                translateX: { val: -translateXStart },
            };
        };
    }

    willLeave (windowWidth) {
        const translateXEnd = windowWidth + 200;

        return (key, value) => {
            const { child } = value;
            return {
                child,
                translateX: { val: translateXEnd },
            };
        };
    }
}


PageHandler.propTypes = {
    children: PropTypes.object,
}
