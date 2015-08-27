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
        const pathname = this.props.location.pathname;
        const child = this.props.children;

        return (
            <div style={{ backgroundColor: '#FDFDFD' }}>

                <Navigation />

                <TransitionSpring
                 endValue={this.endValues()}
                 willEnter={this.willEnter}
                 willLeave={this.willLeave} >

                    {configs => {
                        if (!configs[pathname])
                            return null;

                        const { opacity } = configs[pathname];
                        const style = {
                            position: 'relative',
                            opacity:  opacity.val,
                        };

                        return <div style={style} key={pathname}>{child}</div>;
                    }}

                </TransitionSpring>

            </div>
        );
    }

    endValues () {
        return {
            [this.props.location.pathname]: {
                opacity: { val: 1 }
            }
        };
    }

    willEnter () {
        return { opacity: { val: 0 } };
    }

    willLeave () {
        return { opacity: { val: 0 } };
    }
}


Page.propTypes = {
    children: PropTypes.object,
}
