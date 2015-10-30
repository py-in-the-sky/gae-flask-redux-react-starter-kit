import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { connect } from 'react-redux';
import Navigation from './Navigation';
import PageHandler from './PageHandler';
import WindowSizeProvider from './WindowSizeProvider';


export default class Layout extends PureComponent {
    // componentWillReceiveProps (newProps) {
        // Calling this.setState() within this function will not
        // trigger an additional render.
        // console.log('incoming page', newProps.location.pathname);
        // console.log('outgoing page', this.props.location.pathname);
    // }

    render () {
        const { location, children } = this.props;

        return (
            <WindowSizeProvider>
                <div style={{ backgroundColor: '#FDFDFD' }}>

                    <Navigation />

                    <PageHandler location={location}>
                        {children}
                    </PageHandler>

                </div>
            </WindowSizeProvider>
        );
    }
}


Layout.propTypes = {
    children: PropTypes.element,
    location: PropTypes.object,
};
