import React, { Component, PropTypes, Children } from 'react';
import { TransitionSpring, presets } from 'react-motion';
import Navigation from './navigation';


function windowWidthPlus (x) {
    return window.innerWidth + x;
}


export default class PageHandler extends Component {
    constructor(props) {
        super(props);
        this.endValues = this.endValues.bind(this);
        this.willEnter = this.willEnter.bind(this);
        this.willLeave = this.willLeave.bind(this);
    }

    render () {
        return (
            <div style={{ backgroundColor: '#FDFDFD' }}>

                <Navigation />

                <TransitionSpring
                 endValue={this.endValues()}
                 willEnter={this.willEnter}
                 willLeave={this.willLeave} >

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

    willEnter (key, value) {
        const { child } = value;
        return {
            child,
            translateX: { val: -windowWidthPlus(0) },
        };
    }

    willLeave (key, value) {
        const { child } = value;
        return {
            child,
            translateX: { val: windowWidthPlus(200) },
        };
    }
}


PageHandler.propTypes = {
    children: PropTypes.object,
}
