import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Navigation from './Navigation'
import { Flex, WindowFrame, ShrinkWrap } from './Flex'
import { imageMarkup } from 'app/utils/images'
import { VelocityTransitionGroup } from 'velocity-react'


// Although `React.cloneElement(this.props.children, { ... })` is not a bad pattern
// and is sometimes useful, it is best to first find a data-flow architecture where
// just React owners, not parents, control the props of children.  However, in this
// case, the `pageHasEntered` message is very particular to the Layout-child
// relationship where the Layout controls the layout and entrance/exit animation
// of top-level pages that are navigated to.  The implementation here, using
// `React.cloneElement(this.props.children, { ... })` is very direct and reflects
// this relationship; there is not undue coupling between Layout and its
// `this.props.children` via `pageHasEntered` because Layout is a top-level
// container-like component that is partly defined by this specific relationship.
// References:
//     `React.cloneElement`
//         https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
//     React "parent" versus "owner"
//         https://facebook.github.io/react/docs/multiple-components.html#ownership


export default class Layout extends Component {
    constructor (props) {
        super(props)
        this.state = { enteredPagePath: null }
        const complete = () => this.setState({
            enteredPagePath: this.props.location.pathname
        })
        this.pageEnter = {
            ...pageEnter,
            complete
        }
    }

    render () {
        const {
            location: { pathname },
            children,
            windowSize,
        } = this.props

        const { enteredPagePath } = this.state

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
                    <VelocityTransitionGroup
                     component="div"
                     enter={this.pageEnter}
                     leave={pageLeave}>

                        <div key={pathname} style={pageStyle}>

                            {React.cloneElement(children, {
                                pageHasEntered: enteredPagePath === pathname
                            })}

                        </div>

                    </VelocityTransitionGroup>
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


const pageStyle = {
    position: 'absolute',
    top:      0,
    bottom:   0,
    left:     0,
    right:    0,
}


const defaultAnimationOpts = {
    duration: 1000,
    // easing: [ 250, 15 ],  // could use spring instead
    easing: 'easeOutExpo',
}


const pageEnter = {
    ...defaultAnimationOpts,
    animation: {
        translateX: [0, '-100%'],
    },
}


const pageLeave = {
    ...defaultAnimationOpts,
    animation: {
        translateX: ['100%', 0],
    },
}
