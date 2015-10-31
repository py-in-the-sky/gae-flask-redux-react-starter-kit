import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { connect } from 'react-redux';
import Navigation from '../components/Navigation';
import PageHandler from '../components/PageHandler';


export class Layout extends PureComponent {
    render () {
        const { location, children, windowWidth } = this.props;

        return (
            <div style={{ backgroundColor: '#FDFDFD' }}>

                <Navigation />

                <PageHandler windowWidth={windowWidth} location={location}>
                    {children}
                </PageHandler>

            </div>
        );
    }
}


Layout.propTypes = {
    children:    PropTypes.element,
    location:    PropTypes.object,
    windowWidth: PropTypes.number.isRequired,
};


const mapStateToProps = ({ windowWidth }) => ({ windowWidth });


export default connect(mapStateToProps, undefined)(Layout);
