import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Navigation from './Navigation'
import PageHandler from './PageHandler'
import { Flex, WindowFrame, ShrinkWrap } from './Flex'


export default class Layout extends Component {
    render () {
        const { location, children } = this.props

        return (
            <WindowFrame>

                <ShrinkWrap>
                    <Navigation />
                </ShrinkWrap>

                <Flex>
                    <PageHandler location={location}>
                        {children}
                    </PageHandler>
                </Flex>

            </WindowFrame>
        )
    }
}


Layout.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
}
