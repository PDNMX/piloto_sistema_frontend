import {Link} from "react-router-dom";
import {connect} from "react-redux";
import React from 'react';

const Navigation = ()=>(
    <div>
        <Link to="/dashboard">
            <h1>Link dash</h1>
        </Link>
    </div>
)


export const ConnectedNavigation = connect(state => state )(Navigation);
