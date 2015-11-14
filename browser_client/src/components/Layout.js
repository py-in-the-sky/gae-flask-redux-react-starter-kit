import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Navigation from '../containers/Navigation';
import PageHandler from './PageHandler';
import { Flex, WindowFrame, ShrinkWrap } from './Flex';


export default class Layout extends PureComponent {
    render () {
        const { location, children } = this.props;

        return (
            <WindowFrame>

                <ShrinkWrap>
                    <Navigation />
                </ShrinkWrap>

                <Flex backgroundColor="gray">
                    <PageHandler location={location}>
                        {children}
                    </PageHandler>
                </Flex>

            </WindowFrame>
        );
    }
}


Layout.propTypes = {
    children:    PropTypes.element,
    location:    PropTypes.object,
};
