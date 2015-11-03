import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import Navigation from './Navigation';
import PageHandler from './PageHandler';
import { Flex } from 'jsxstyle';


export default class Layout extends PureComponent {
    render () {
        const { location, children } = this.props;

        return (
            <Flex
             height="100vh"
             position="relative"
             overflow="hidden"
             flex="1 1 auto"
             flexFlow="column wrap"
             flexWrap="nowrap"
             alignItems="stretch"
             justifyContent="flex-start"
             order={0}
             backfaceVisibility="hidden">

                <Flex
                 height="auto"
                 position="relative"
                 flex="0 0 auto"
                 flexFlow="row wrap"
                 flexWrap="nowrap"
                 alignItems="stretch"
                 justifyContent="flex-start"
                 order={0}
                 backfaceVisibility="hidden">

                    <Navigation />

                </Flex>

                <Flex
                 backgroundColor="gray"
                 flex="1 1 auto"
                 position="relative"
                 backfaceVisibility="hidden">

                    <PageHandler location={location}>
                        {children}
                    </PageHandler>

                </Flex>

            </Flex>
        );
    }
}


Layout.propTypes = {
    children:    PropTypes.element,
    location:    PropTypes.object,
};
