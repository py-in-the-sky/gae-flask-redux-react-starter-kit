import React, { PropTypes } from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import PureComponent from 'react-pure-render/component';
import { Flex } from 'jsxstyle';


export default class PageHandler extends PureComponent {
    render () {
        const { children, location: { pathname } } = this.props;

        return (
            <VelocityTransitionGroup
             component="div"
             enter={pageEnter}
             leave={pageLeave}>

                <div key={pathname} style={pageStyle}>
                    {children}
                </div>

            </VelocityTransitionGroup>
        );
    }
}


PageHandler.propTypes = {
    children:    PropTypes.element,
    location:    PropTypes.object,
};


const pageStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
};


const defaultAnimationOpts = {
    duration: 700,
    // easing: [ 250, 15 ],  // could use spring instead
    easing: 'easeOutExpo',
};


const pageEnter = {
    ...defaultAnimationOpts,
    animation: {
        translateX: [0, '-100%'],
    },
};


const pageLeave = {
    ...defaultAnimationOpts,
    animation: {
        translateX: ['100%', 0],
    },
};
