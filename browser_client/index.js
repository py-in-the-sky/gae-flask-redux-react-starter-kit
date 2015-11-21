import 'velocity-react';
// activate Velocity context, and...
import 'velocity-animate/velocity.ui';
// ...make Velocity UI Pack available to Velocity and velocity-react


import Root from './src/containers';
import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';


//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


ReactDOM.render(
    <Root history={new createBrowserHistory()} />,
    document.getElementById('user-interface')
);
