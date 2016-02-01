import * as FlexLayout from './Flex'
import pure from 'recompose/pure'


const PureFlexLayout = Object.keys(FlexLayout).reduce( (obj, key) => {
    obj[key] = pure(FlexLayout[key])
    return obj
}, {})


export default PureFlexLayout
