import fetchMiddleware from 'app/middleware/fetch';


const MY_FETCH_KEY = Symbol('my-fetch-key');


describe('fetchMiddleware', () => {
    it('is a constructor that returns a middleware function', () => {
        expect( fetchMiddleware() ).to.be.a( 'function' );
    });

    it('expects the sole options argument to be an object or undefined', () => {
        expect( () => fetchMiddleware('String is not the right type') )
            .to.throw( Error );
    });

    it('validates option entries', () => {
        expect( () => fetchMiddleware({ key: 'String is not the right type' }) )
            .to.throw( Error );

        expect( () => fetchMiddleware({ beforeFetch: 'String is not the right type' }) )
            .to.throw( Error );

        expect( () =>  fetchMiddleware({ beforeFetch: () => 1 + 1 }) )
            .to.not.throw( Error );
    });
});


describe('the middleware returned by `fetchMiddleware`', () => {
    afterEach(() => {
        if (window.fetch.restore) window.fetch.restore();
    });

    const makeResponse = (status = 200) => new window.Response(
        '{"hello":"world"}',
        { status, headers: { 'Content-type': 'application/json' } }
    );

    const setup = (response, error = false) => {
        let res;

        if (error) {
            sinon.stub(window, 'fetch', () => Promise.reject('error'));
        }
        else {
            res = response || makeResponse();
            sinon.stub(window, 'fetch', () => Promise.resolve(res));
        }

        const opts = {
            key: MY_FETCH_KEY,
            beforeFetch: sinon.spy( x => x ),
            onFetchDone: sinon.spy( (...args) => args ),
            onFetchFail: sinon.spy( (...args) => args ),
            onNetworkError: sinon.spy( (...args) => args ),
        };

        const store = {
            dispatch: sinon.spy(),
            getState: sinon.spy(),
        };

        const nextMiddleware = sinon.spy();
        const middleware = fetchMiddleware(opts)(store)(nextMiddleware);

        const action = {
            type: 'TYPE',
            meta: {
                [MY_FETCH_KEY]: {
                    endpoint: '/test',
                    method: 'POST',
                    body: 'body',
                    done: sinon.spy( x => x ),
                    fail: sinon.spy( x => x ),
                },
            },
        };

        return { response: res, opts, store, nextMiddleware, middleware, action };
    };

    context('when a fetch call is not requested', () => {
        it('calls the next middleware with the action and returns', () => {
            const { opts, store, nextMiddleware, middleware } = setup();
            const action = { type: 'TYPE' };
            middleware(action);

            expect( nextMiddleware ).to.have.been.calledWith( action );
            expect( store.dispatch ).to.not.have.been.called;
            expect( opts.beforeFetch ).to.not.have.been.called;
        });
    });

    it('calls `beforeFetch` with the expected arguments', () => {
        const { opts, middleware, action, store: { dispatch, getState } } = setup();
        const call = action.meta[MY_FETCH_KEY];
        middleware(action);

        expect( opts.beforeFetch )
            .to.have.been.calledWithExactly( call, action, dispatch, getState );
    });

    context('when `dispatchBaseAction` is `false`', () => {
        it('does not call the next middleware with the given action', () => {
            const { nextMiddleware, middleware, action } = setup();
            action.meta[MY_FETCH_KEY].dispatchBaseAction = false;
            middleware(action);

            expect( nextMiddleware ).to.not.have.been.called;
        });
    });

    context('when `dispatchBaseAction` is not `false`', () => {
        it('calls the next middleware with the given action', () => {
            const { nextMiddleware, middleware, action } = setup();
            middleware(action);

            expect( nextMiddleware ).to.have.been.calledWithExactly( action );
        });
    });

    it('calls `fetch` with the expected arguments', () => {
        const { middleware, action } = setup();
        middleware(action);
        const { endpoint, method, body } = action.meta[MY_FETCH_KEY];

        expect( fetch )
            .to.have.been.calledWithMatch( endpoint, { method, body } );
    });

    context('when the fetch request is successful', () => {
        it('calls `onFetchDone` with the expected arguments', done => {
            const {
                opts,
                middleware,
                action,
                response,
                store: { dispatch, getState }
            } = setup();

            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( opts.onFetchFail ).to.not.have.been.called;

                    expect( opts.onFetchDone )
                        .to.have.been
                        .calledWith( { hello: 'world' }, response, fetchCall, action, dispatch, getState );

                    done();
                }
            );
        });

        it('calls `done` with the expected arguments', done => {
            const { opts, middleware, action } = setup();
            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( fetchCall.done )
                        .to.have.been
                        .calledWith( ...opts.onFetchDone.lastCall.returnValue );

                    done();
                }
            );
        });

        it('dispatches the "done" action through the full middleware chain', done => {
            const { middleware, action, store } = setup();
            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( store.dispatch )
                        .to.have.been
                        .calledWith( fetchCall.done.lastCall.returnValue );

                    done();
                }
            );
        });
    });

    context('when the fetch request results in a 400-level error', () => {
        it('calls `onFetchFail` with the expected arguments', done => {
            const {
                opts,
                middleware,
                action,
                response,
                store: { dispatch, getState }
            } = setup(makeResponse(400));

            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( opts.onFetchDone ).to.not.have.been.called;

                    expect( opts.onFetchFail )
                        .to.have.been
                        .calledWith( { hello: 'world' }, response, fetchCall, action, dispatch, getState );

                    done();
                }
            );
        });

        it('calls `fail` with the expected arguments', done => {
            const { opts, middleware, action } = setup(makeResponse(400));
            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( fetchCall.fail )
                        .to.have.been
                        .calledWith( ...opts.onFetchFail.lastCall.returnValue );

                    done();
                }
            );
        });

        it('dispatches the "fail" action through the full middleware chain', done => {
            const { middleware, action, store } = setup(makeResponse(400));
            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( store.dispatch )
                        .to.have.been
                        .calledWith( fetchCall.fail.lastCall.returnValue );

                    done();
                }
            );
        });
    });

    context('when the fetch request results in a 500-level error', () => {
        it('calls `onFetchFail` with the expected arguments', done => {
            const {
                opts,
                middleware,
                action,
                response,
                store: { dispatch, getState }
            } = setup(makeResponse(500));

            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( opts.onFetchDone ).to.not.have.been.called;

                    expect( opts.onFetchFail )
                        .to.have.been
                        .calledWith( '{"hello":"world"}', response, fetchCall, action, dispatch, getState );

                    done();
                }
            );
        });
    });

    context('when the fetch request encounters a network error', () => {
        it('calls `onNetworkError` with the expected arguments', done => {
            const {
                opts,
                middleware,
                action,
                store: { dispatch, getState }
            } = setup(undefined, true);

            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( opts.onFetchDone ).to.not.have.been.called;
                    expect( opts.onFetchFail ).to.not.have.been.called;

                    expect( opts.onNetworkError )
                        .to.have.been
                        .calledWith( 'error', fetchCall, action, dispatch, getState );

                    done();
                }
            );
        });

        it('calls `fail` with the expected arguments', done => {
            const {
                opts,
                middleware,
                action,
                store: { dispatch, getState }
            } = setup(undefined, true);

            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( fetchCall.fail )
                        .to.have.been
                        .calledWith( ...opts.onNetworkError.lastCall.returnValue );

                    done();
                }
            );
        });

        it('dispatches the "fail" action through the full middleware chain', done => {
            const {
                opts,
                middleware,
                action,
                store: { dispatch, getState }
            } = setup(undefined, true);

            const fetchCall = action.meta[MY_FETCH_KEY];

            middleware(action).then(
                () => {
                    expect( dispatch )
                        .to.have.been
                        .calledWith( fetchCall.fail.lastCall.returnValue );

                    done();
                }
            );
        });
    });

    describe('input validations', () => {
        it('expects `action.meta[MY_FETCH_KEY]` to be a plain object or undefined', () => {
            const {
                opts,
                middleware,
                action,
                store: { dispatch, getState }
            } = setup(undefined, true);

            action.meta[MY_FETCH_KEY] = 'Not the right type';

            expect( () => middleware(action) ).to.throw( Error );
        });

        it('expects `done` to be a function', () => {
            const {
                opts,
                middleware,
                action,
                store: { dispatch, getState }
            } = setup(undefined, true);

            action.meta[MY_FETCH_KEY].done = 'Not the right type';

            expect( () => middleware(action) ).to.throw( Error );
        });

        it('expects `fail` to be a function', () => {
            const {
                opts,
                middleware,
                action,
                store: { dispatch, getState }
            } = setup(undefined, true);

            action.meta[MY_FETCH_KEY].fail = 'Not the right type';

            expect( () => middleware(action) ).to.throw( Error );
        });
    });
});
