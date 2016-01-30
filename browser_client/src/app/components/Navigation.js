import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import IconButton from 'material-ui/lib/icon-button'
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu'


const MenuButtonElement = <IconButton><MenuIcon /></IconButton>


// currently not using "optimisation.react.constantElements" in
// .babelrc "env.production.optional" because this element is
// considered constant by the optimization, and therefore in
// production we do not see the animation run when the
// navigation links first appear on the page


export default class Navigation extends Component {
    constructor (props, context) {
        super(props, context)
        this.navigate = this.navigate.bind(this)
    }

    componentWillMount () {
        this.history = this.context.history
    }

    render () {
        return (
            <IconMenu
             onItemTouchTap={this.navigate}
             iconButtonElement={MenuButtonElement}
             openDirection="bottom-right">

                <MenuItem route="/"       primaryText="Home" />
                <MenuItem route="/shire"  primaryText="Shire Theme" />
                <MenuItem route="/mordor" primaryText="Mordor Theme" />

            </IconMenu>
        )
    }

    navigate (_, item) {
        this.history.pushState(null, item.props.route)
    }
}


Navigation.contextTypes = {
    history: PropTypes.object.isRequired,
}
