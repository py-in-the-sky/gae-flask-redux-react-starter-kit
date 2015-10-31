import React, { PropTypes } from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import PureComponent from 'react-pure-render/component';


export default class PageHandler extends PureComponent {
    render () {
        const {
            children,
            location: { pathname },
            windowWidth,
        } = this.props;

        return (
            <VelocityTransitionGroup
             component="div"
             enter={pageEnter(windowWidth)}
             leave={pageLeave(windowWidth)}>

                <div key={pathname} style={pageStyle[pathname]}>
                    {children}
                </div>

            </VelocityTransitionGroup>
        );
    }
}


PageHandler.propTypes = {
    children:    PropTypes.element,
    location:    PropTypes.object,
    windowWidth: PropTypes.number.isRequired,
};


const pageEnter = windowWidth => ({
    ...defaultAnimationOpts,
    animation: {
        translateX: [0, -windowWidth],
    },
});


const pageLeave = windowWidth => ({
    ...defaultAnimationOpts,
    animation: {
        translateX: [windowWidth, 0],
    },
});


const defaultAnimationOpts = {
    duration: 300,
    // easing: [ 250, 15 ],  // could use spring instead
    easing: 'easeOutExpo',
};


const defaultPageStyle = {
    position: 'absolute',
    top: 70,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
};


const pageStyle = {
    '/1': {
        ...defaultPageStyle,
        backgroundColor: '#E8F5E9',
    },
    '/2': {
        ...defaultPageStyle,
        backgroundColor: '#EFEBE9',
    },
};
