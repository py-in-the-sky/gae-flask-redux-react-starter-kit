import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Navigation from './navigation';
import PageHandler from './page_handler';


export default class Layout extends PureComponent {
    // componentWillReceiveProps (newProps) {
        // Calling this.setState() within this function will not
        // trigger an additional render.
        // console.log('incoming page', newProps.location.pathname);
        // console.log('outgoing page', this.props.location.pathname);
    // }

    render () {
        return (
            <div style={{ backgroundColor: '#FDFDFD' }}>

                <Navigation />

                <PageHandler location={this.props.location}>
                    {this.props.children}
                </PageHandler>

            </div>
        );
    }
}


Layout.propTypes = {
    children: PropTypes.object,
    location: PropTypes.object,
};
