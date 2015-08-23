import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';


export default class Navigation extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="links">
                <ul>
                    <li><Link to="/" >Page One</Link></li>
                    <li><Link to="/2">Page Two</Link></li>
                </ul>
            </div>
        );
    }
}
