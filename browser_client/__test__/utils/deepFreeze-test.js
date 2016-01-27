import {
    deepFreezeFunction,
    deepFreezeFunctions,
} from 'app/utils/deepFreeze';


const setup = () => ({
    pure:   obj => ({ ...obj, foo: 'bar' }),
    impure: obj => { obj.foo = 'bar'; return obj; },
});


describe('`deepFreezeFunction`', () => {
    it('deep freezes the returned value of the function it wraps', () => {
        const { pure } = setup();

        const notFrozen = pure({ a: { b: { c: 'c' } } });
        expect( notFrozen.foo ).to.equal( 'bar' );

        const p = deepFreezeFunction(pure);
        const frozen = p({ a: { b: { c: 'c' } } });
        expect( frozen.foo ).to.equal( 'bar' );

        expect( Object.isFrozen(notFrozen) ).to.be.false;
        expect( Object.isFrozen(frozen) ).to.be.true;
        expect( () => { frozen.a.b.c = 'd'; } ).to.throw( Error );
    });

    it('deep freezes the arguments passed in', () => {
        const { impure } = setup();

        const ip = deepFreezeFunction(impure);

        expect( () => impure({}) ).to.not.throw( Error );
        expect( () => ip({}) ).to.throw( Error );
    });
});


describe('`deepFreezeFunctions`', () => {
    it('deep freezes all functions in an object', () => {
        const { pure, impure } = setup();

        const frozenFns = deepFreezeFunctions({ pure, impure });
        const { pure: p, impure: ip } = frozenFns;

        expect( Object.isFrozen(p({})) ).to.be.true;
        expect( () => ip({}) ).to.throw( Error );
    });

    it('does not otherwise change the function signature', () => {
        const { pure } = setup();

        const normalReturnValue = pure({ a: 'b' });
        const { pure: p } = deepFreezeFunctions({ pure });
        const frozenReturnValue = p({ a: 'b' });

        expect( frozenReturnValue ).to.deep.equal( normalReturnValue );
        expect( Object.isFrozen(frozenReturnValue) ).to.be.true;
        expect( Object.isFrozen(normalReturnValue) ).to.be.false;
    });

    it('does not alter non-functions', () => {
        const { pure } = setup();

        const originalObject = {};
        const originalArray  = [];
        const { obj, array } = deepFreezeFunctions({
            pure,
            obj: originalObject,
            array: originalArray,
        });

        expect( Object.isFrozen(obj) ).to.be.false;
        expect( Object.isFrozen(array) ).to.be.false;
        expect( obj ).to.equal( originalObject );
        expect( array ).to.equal( originalArray );
    });
});
