import {
    scryRenderedDOMComponentsWithTag,
    scryRenderedDOMComponentsWithClass,
    scryRenderedComponentsWithType,
} from 'react-addons-test-utils'


export const createFinder = reactTree => query => {
    if (typeof query !== 'string')
        return scryRenderedComponentsWithType(reactTree, query)
    else if (query.startsWith('.'))
        return scryRenderedDOMComponentsWithClass(reactTree, query.substring(1))
    else
        return scryRenderedDOMComponentsWithTag(reactTree, query)
}
