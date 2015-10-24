/* eslint-disable prefer-arrow-callback */


/*
    Property-based testing of the "greetings" aspect of the app.
 */


import { Simulate } from 'react-addons-test-utils';
import jsc from 'jsverify';
import _ from 'lodash';
import Greeting from '../../src/components/Greeting';


describe('adding and subtracting greetings', function () {
    beforeEach(function () {
        findOnPage = this.findOnPage;
        this.navigate('/1');
        const [ addButton, subtractButton ] = findOnPage('button');

        clickAddButton = function () {
            Simulate.click(addButton);
            return findOnPage(Greeting).length;
        };

        clickSubtractButton = function () {
            Simulate.click(subtractButton);
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
