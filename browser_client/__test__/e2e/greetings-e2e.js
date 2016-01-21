/* eslint-disable prefer-arrow-callback */


/*
Property-based testing of the "greetings" aspect of the app.
*/


import ReactDOM from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import jsc from 'jsverify';
import _ from 'lodash';
import RaisedButton from 'material-ui/lib/raised-button';
import Greeting from '../../src/components/Greeting';
import { createFinder } from '../utils';
import { ActionTypes as T } from '../../src/actions';
import store from '../../src/store';


const returnMockThenable = () => ({
    then: returnMockThenable,
    catch: returnMockThenable,
});


const mockFetch = () => {
    store.dispatch({
        type: T.ADD_NAME_DONE,
        payload: { name: 'world' },
        meta: {},
    });

    return returnMockThenable();
};


describe('adding and subtracting greetings', function () {
    afterEach(() => {
        if (window.fetch.restore) window.fetch.restore();
    });

    beforeEach(function () {
        sinon.stub(window, 'fetch', mockFetch);

        findOnPage = this.findOnPage;
        this.navigate('/shire');
        const [ raisedAddButton, raisedSubtractButton ] = findOnPage(RaisedButton);
        const addButton = createFinder(raisedAddButton)('button')[0];
        const subtractButton = createFinder(raisedSubtractButton)('button')[0];

        clickAddButton = function () {
            Simulate.touchTap(addButton);
            return findOnPage(Greeting).length;
        };

        clickSubtractButton = function () {
            Simulate.touchTap(subtractButton);
            return findOnPage(Greeting).length;
        };
    });

    let clickAddButton, clickSubtractButton, findOnPage;
    const [ ADD, SUBTRACT, FLOOR ] = [ 1, -1, 0 ];

    describe('the number of greetings on the page', function () {
        jsc.property('equals scan of sum of actions with a floor of 0',
                     'array bool',
                     function (arrayOfBooleans) {

            const initialGreetingsCount = findOnPage(Greeting).length;
            const inputStream = arrayOfBooleans.map( b => b ? ADD : SUBTRACT );
            const sumScanWithFloor = inputStream.reduce(
                (array, action) => array.concat(
                    [ Math.max(FLOOR, action + array[array.length - 1]) ]
                )
            , [ initialGreetingsCount ]);

            const uiStateStream = inputStream.map( action =>
                (action === ADD ? clickAddButton : clickSubtractButton)()
            );

            uiStateStream.unshift(initialGreetingsCount);

            return _.isEqual(uiStateStream, sumScanWithFloor);
        });
    });
});
