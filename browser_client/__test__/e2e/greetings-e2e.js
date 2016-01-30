/* eslint-disable prefer-arrow-callback */


/*
Property-based testing of the "greetings" aspect of the app.
*/


import React from 'react'
import ReactDOM from 'react-dom'
import Root from 'app/containers'
import { createStoreWithMiddleware } from 'app/store'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { createFinder } from '../utils'
import { Simulate } from 'react-addons-test-utils'
import jsc from 'jsverify'
import _ from 'lodash'
import RaisedButton from 'material-ui/lib/raised-button'
import Greeting from 'app/components/Greeting'
import { ActionTypes as T } from 'app/actions'


const returnMockThenable = () => ({
    then: returnMockThenable,
    catch: returnMockThenable,
})


const makeMockFetch = store => () => {
    store.dispatch({
        type: T.ADD_NAME_DONE,
        payload: { name: 'world' },
        meta: {},
    })

    return returnMockThenable()
}


describe('adding and subtracting greetings', function () {
    afterEach(function () {
        this.appHistory.replaceState(null, '/')
        ReactDOM.unmountComponentAtNode(this.container)
        if (window.fetch.restore) window.fetch.restore()
    })

    beforeEach(function () {
        const store = createStoreWithMiddleware()

        sinon.stub(window, 'fetch', makeMockFetch(store))

        /* eslint-disable new-cap */
        this.appHistory = new createBrowserHistory()
        this.container = document.createElement('div')
        const appRoot = ReactDOM.render(
            <Root history={this.appHistory} store={store} />,
            this.container
        )

        findOnPage = createFinder(appRoot)
        this.appHistory.pushState(null, '/shire')
        const [ raisedAddButton, raisedSubtractButton ] = findOnPage(RaisedButton)
        const addButton = createFinder(raisedAddButton)('button')[0]
        const subtractButton = createFinder(raisedSubtractButton)('button')[0]

        clickAddButton = function () {
            Simulate.touchTap(addButton)
            return findOnPage(Greeting).length
        }

        clickSubtractButton = function () {
            Simulate.touchTap(subtractButton)
            return findOnPage(Greeting).length
        }
    })

    let clickAddButton, clickSubtractButton, findOnPage
    const [ ADD, SUBTRACT, FLOOR ] = [ 1, -1, 0 ]

    describe('the number of greetings on the page', function () {
        this.timeout(3000)  // see https://mochajs.org/#timeouts

        jsc.property('equals scan of sum of actions with a floor of 0',
                     'array bool',
                     function (arrayOfBooleans) {
            const initialGreetingsCount = findOnPage(Greeting).length
            const inputStream = arrayOfBooleans.map( b => b ? ADD : SUBTRACT )
            const sumScanWithFloor = inputStream.reduce(
                (array, action) => array.concat(
                    [ Math.max(FLOOR, action + array[array.length - 1]) ]
                )
            , [ initialGreetingsCount ])

            const uiStateStream = inputStream.map( action =>
                (action === ADD ? clickAddButton : clickSubtractButton)()
            )

            uiStateStream.unshift(initialGreetingsCount)

            return _.isEqual(uiStateStream, sumScanWithFloor)
        })
    })
})
