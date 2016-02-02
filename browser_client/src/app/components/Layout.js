import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Navigation from './Navigation'
import PageHandler from './PageHandler'
import { Flex, WindowFrame, ShrinkWrap } from './Flex'
import { imageMarkup } from 'app/utils/images'


export default class Layout extends Component {
    render () {
        const { location: { pathname }, children, windowSize } = this.props
        const imageUrl = imageMarkup(pathname, windowSize)
        const background = imageUrl
            ? `${imageUrl} no-repeat center center fixed`
            : undefined

        return (
            <WindowFrame
             backgroundColor="white"
             backgroundSize="cover"
             background={background}>

                <ShrinkWrap backgroundColor="white">
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
    windowSize: PropTypes.number.isRequired,
    children: PropTypes.element.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
}
