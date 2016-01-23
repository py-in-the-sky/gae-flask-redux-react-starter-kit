import 'velocity-react';
// activate Velocity context, and...
import 'velocity-animate/velocity.ui';
// ...make Velocity UI Pack available to Velocity and velocity-react


import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from 'app/containers';
import store from 'app/store';


//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


ReactDOM.render(
    <Root history={new createBrowserHistory()} store={store} />,
    document.getElementById('user-interface')
);
