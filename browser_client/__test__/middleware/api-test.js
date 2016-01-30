import apiMiddleware, {
    beforeFetch,
    onFetchFail,
    onNetworkError,
} from 'app/middleware/api'
import { ActionCreators, ActionTypes as T } from 'app/actions'
import configureMockStore from 'redux-mock-store'
import { deepFreeze } from 'app/utils/deepFreeze'


describe('`beforeFetch`', () => {
    it('returns a fetch call with added headers and stringified body', () => {
        const fetchCall = {
            endpoint: '/blah/',
            method:   'POST',
            body:     { hello: 'world' },
        }

        expect( beforeFetch(fetchCall) ).to.deep.eq({
            endpoint: '/blah/',
            method:   'POST',
            body:     '{"hello":"world"}',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
    })

    it('leaves `body` undefined if not provided', () => {
        const fetchCall = {
            endpoint: '/blah/',
            method:   'GET',
        }

        expect( beforeFetch(fetchCall).body ).to.be.undefined
    })
})


describe('`onFetchFail`', () => {
    const setup = status => ({
        dispatch: sinon.spy(),
        response: { status },
        body:     'body',
    })

    it('returns a body-response pair', () => {
        const { body, response } = setup(400)
        expect( onFetchFail(body, response) ).to.deep.eq( [body, response] )
    })

    context('when the response represents a 500-level error', () => {
        it('returns an undefined-response pair', () => {
            const { body, response, dispatch } = setup(500)
            expect( onFetchFail(body, response, undefined, undefined, dispatch) )
                .to.deep.eq( [undefined, response] )
        })

        it('dispatches the SERVER_ERROR action to the store', () => {
            const { body, response, dispatch } = setup(500)
            onFetchFail(body, response, undefined, undefined, dispatch)
            expect( dispatch ).to.have.been.calledWithMatch({ type: T.SERVER_ERROR })
        })
    })
})


describe('`onNetworkError`', () => {
    it('returns an empty array', () => {
        expect( onNetworkError(undefined, undefined, undefined, sinon.spy()) )
            .to.deep.eq( [] )
    })

    it('dispatches the NETWORK_ERROR action to the store', () => {
        const dispatch = sinon.spy()
        onNetworkError(undefined, undefined, undefined, dispatch)
        expect( dispatch ).to.have.been.calledWithMatch({ type: T.NETWORK_ERROR })
    })
})


describe('redux integration', () => {
    afterEach(() => {
        if (window.fetch.restore) window.fetch.restore()
    })

    const makeResponse = (status = 200) => new window.Response(
        '{"name":"foo"}',
        { status, headers: { 'Content-type': 'application/json' } }
    )

    const setup = (response, error = false) => {
        if (error) {
            sinon.stub(window, 'fetch', () => Promise.reject('error'))
        } else {
            sinon.stub(window, 'fetch',
                       () => Promise.resolve(response || makeResponse()))
        }

        return configureMockStore([ apiMiddleware ])
    }

    it('dispatches the expected actions when successful', done => {
        const mockStore = setup()

        let requestId

        const expectedActions = [
            firstAction => {
                expect( firstAction.type ).to.equal( T.ADD_NAME )
                expect( firstAction.meta ).to.have.all.keys( 'requestId' )

                requestId = firstAction.meta.requestId
            },
            secondAction => {
                expect( secondAction.type ).to.equal( T.ADD_NAME_DONE )
                expect( secondAction.payload ).to.deep.equal( { name: 'foo' } )
                expect( secondAction.meta ).to.have.all.keys( 'requestId' )

                expect( secondAction.meta.requestId ).to.equal( requestId )
            },
        ]

        const store = mockStore(deepFreeze({}), expectedActions, done)
        store.dispatch(ActionCreators.addName())
    })

    it('dispatches the expected actions when there is an error', done => {
        const mockStore = setup(makeResponse(400))

        let requestId

        const expectedActions = [
            firstAction => {
                expect( firstAction.type ).to.equal( T.ADD_NAME )
                expect( firstAction.meta ).to.have.all.keys( 'requestId' )

                requestId = firstAction.meta.requestId
            },
            secondAction => {
                expect( secondAction.type ).to.equal( T.ADD_NAME_FAIL )
                expect( secondAction.meta ).to.have.all.keys( 'requestId' )

                expect( secondAction.meta.requestId ).to.equal( requestId )
            },
        ]

        const store = mockStore(deepFreeze({}), expectedActions, done)
        store.dispatch(ActionCreators.addName())
    })

    it('dispatches `SERVER_ERROR` when there is a 500 error', done => {
        const mockStore = setup(makeResponse(500))

        const expectedActions = [
            firstAction => {
                expect( firstAction.type ).to.equal( T.ADD_NAME )
            },
            secondAction => {
                expect( secondAction.type ).to.equal( T.SERVER_ERROR )
            },
            thirdAction => {
                expect( thirdAction.type ).to.equal( T.ADD_NAME_FAIL )
            },
        ]

        const store = mockStore(deepFreeze({}), expectedActions, done)
        store.dispatch(ActionCreators.addName())
    })

    it('dispatches `NETWORK_ERROR` when fetch resolves to an error state', done => {
        const error = true
        const mockStore = setup(undefined, error)

        const expectedActions = [
            firstAction => {
                expect( firstAction.type ).to.equal( T.ADD_NAME )
            },
            secondAction => {
                expect( secondAction.type ).to.equal( T.NETWORK_ERROR )
            },
            thirdAction => {
                expect( thirdAction.type ).to.equal( T.ADD_NAME_FAIL )
            },
        ]

        const store = mockStore(deepFreeze({}), expectedActions, done)
        store.dispatch(ActionCreators.addName())
    })
})
