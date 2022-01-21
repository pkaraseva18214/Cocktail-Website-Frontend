import React from 'react';

import { Link } from "react-router-dom"

export default class NotFound extends React.Component {
    render () {
        return(
            <div>
                <h1>NOT FOUND</h1>
                <Link to="/login">Log in</Link>
            </div>
        )
    }
}