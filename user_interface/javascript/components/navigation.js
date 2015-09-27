import React from 'react';
import PureComponent from 'react-pure-render/component';
import { Link } from 'react-router';


export default class Navigation extends PureComponent {
    render () {
        return (
            <div className="links">
                <ul>
                    <li><Link to="/1" >Page One</Link></li>
                    <li><Link to="/2">Page Two</Link></li>
                </ul>
            </div>
        );
    }
}
