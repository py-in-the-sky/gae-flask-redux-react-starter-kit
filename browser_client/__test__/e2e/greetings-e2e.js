/* eslint-disable prefer-arrow-callback */


/*
    Property-based testing of the "greetings" aspect of the app.
 */


import ReactDOM from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import jsc from 'jsverify';
import _ from 'lodash';
import Greeting from '../../src/components/Greeting';
import RaisedButton from 'material-ui/lib/raised-button';


describe('adding and subtracting greetings', function () {
    beforeEach(function () {
        findOnPage = this.findOnPage;
        this.navigate('/1');
        const [ raisedAddButton, raisedSubtractButton ] = findOnPage(RaisedButton);
        const addButton = ReactDOM.findDOMNode(raisedAddButton).firstChild;
        const subtractButton = ReactDOM.findDOMNode(raisedSubtractButton).firstChild;

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
