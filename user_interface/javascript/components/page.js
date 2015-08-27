import React, { Component, PropTypes, Children } from 'react';
import { TransitionSpring } from 'react-motion';
import Navigation from './navigation';


export default class Page extends Component {
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
                                    position: 'relative',
                                    transform: `translateX(${translateX.val}px)`,
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
                translateX: { val: 0 },
            }
        };
    }

    willEnter (key, value) {
        const { child } = value;
        return {
            child,
            translateX: { val: -window.innerWidth },
        };
    }

    willLeave (key, value) {
        const { child } = value;
        return {
            child,
            translateX: { val: window.innerWidth },
        };
    }
}


Page.propTypes = {
    children: PropTypes.object,
}
