import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import { Link } from 'react-router';


// currently not using "optimisation.react.constantElements" in
// .babelrc "env.production.optional" because this element is
// considered constant by the optimization, and therefore in
// production we do not see the animation run when the
// navigation links first appear on the page


export default () => (
    <div className="links">
        <ul>
            <VelocityTransitionGroup
             component="div"
             runOnMount={true}
             enter={linkOnEnter}
             leave={linkOnLeave}>

                <li><Link to="/1" >Page One</Link></li>
                <li><Link to="/2">Page Two</Link></li>

            </VelocityTransitionGroup>
        </ul>
    </div>
);


const linkOnEnter = {
    animation: 'transition.slideUpBigIn',
    style: {
        opacity: 0,
    },
    duration: 300,
    stagger: 100,
    drag: true,
};


const linkOnLeave = {
    animation: 'transition.slideDownBigOut',
};
