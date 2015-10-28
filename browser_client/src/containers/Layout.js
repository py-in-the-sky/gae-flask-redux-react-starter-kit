import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { connect } from 'react-redux';
import Navigation from '../components/Navigation';
import PageHandler from '../components/PageHandler';


export class Layout extends PureComponent {
    // componentWillReceiveProps (newProps) {
        // Calling this.setState() within this function will not
        // trigger an additional render.
        // console.log('incoming page', newProps.location.pathname);
        // console.log('outgoing page', this.props.location.pathname);
    // }

    render () {
        const { location, children, windowWidth } = this.props;

        return (
            <div style={{ backgroundColor: '#FDFDFD' }}>

                <Navigation />

                <PageHandler
                 windowWidth={windowWidth}
                 location={location}>
                    {children}
                </PageHandler>

            </div>
        );
    }
}


Layout.propTypes = {
    children:    PropTypes.object,
    location:    PropTypes.object,
    windowWidth: PropTypes.number.isRequired,
};


function mapStateToProps (state) {
    const  { windowWidth } = state;
    return { windowWidth };
}


export default connect(mapStateToProps, undefined)(Layout);
