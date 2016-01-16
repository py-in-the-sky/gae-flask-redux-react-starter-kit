import { Callbacks, Models } from '../../src/middleware/api';
import { ActionTypes as T } from '../../src/actions';


describe('`beforeFetch`', () => {
    it('returns a fetch call with added headers and stringified body', () => {
        const fetchCall = {
            endpoint: '/blah/',
            method:   'POST',
            body:     { hello: 'world' },
        };

        expect( Callbacks.beforeFetch(fetchCall) ).to.deep.eq({
            endpoint: '/blah/',
            method:   'POST',
            body:     '{"hello":"world"}',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
    });

    it('leaves `body` undefined if not provided', () => {
        const fetchCall = {
            endpoint: '/blah/',
            method:   'GET',
        };

        expect( Callbacks.beforeFetch(fetchCall).body ).to.be.undefined;
    });
});


describe('`onFetchFail`', () => {
    const setup = status => ({
        dispatch: sinon.spy(),
        response: { status },
        body:     'body',
    });

    it('returns a body-response pair', () => {
        const { body, response } = setup(400);
        expect( Callbacks.onFetchFail(body, response) ).to.deep.eq( [body, response] );
    });

    context('when the response represents a 500-level error', () => {
        it('returns an undefined-response pair', () => {
            const { body, response, dispatch } = setup(500);
            expect( Callbacks.onFetchFail(body, response, undefined, undefined, dispatch) )
                .to.deep.eq( [undefined, response] );
        });

        it('dispatches the SERVER_ERROR action to the store', () => {
            const { body, response, dispatch } = setup(500);
            Callbacks.onFetchFail(body, response, undefined, undefined, dispatch);
            expect( dispatch ).to.have.been.calledWithMatch({ type: T.SERVER_ERROR });
        });
    });
});


describe('`onNetworkError`', () => {
    it('returns an empty array', () => {
        expect( Callbacks.onNetworkError(undefined, undefined, undefined, sinon.spy()) )
            .to.deep.eq( [] );
    });

    it('dispatches the NETWORK_ERROR action to the store', () => {
        const dispatch = sinon.spy();
        Callbacks.onNetworkError(undefined, undefined, undefined, dispatch);
        expect( dispatch ).to.have.been.calledWithMatch({ type: T.NETWORK_ERROR });
    });
});
