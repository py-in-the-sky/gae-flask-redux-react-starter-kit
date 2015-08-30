import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Navigation from './navigation';
import PageHandler from './page_handler';


export default class Layout extends PureComponent {
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
}
