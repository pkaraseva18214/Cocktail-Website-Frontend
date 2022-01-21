import React, { Component } from 'react'
import { Loader, Message } from 'rsuite';
import { Link } from 'react-router-dom';

// import { RecipeView } from './../components/RecipeView.js'

import 'rsuite/dist/rsuite.min.css';
import { baseUrl } from '../utils/api';

const WaitFetch = () => {
    return (
        <Loader center content="loading..." />
    )
};

export default class Recipe extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {
        const recipeId = this.props.match.params.recipeId;

        try {
            const response = await fetch(`${baseUrl}/recipe/${recipeId}`, {
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            const json = await response.json();
            this.setState({ recipeData: json });

        } catch (error) {
            console.log(error)
        }

    }

    render() {
        if (this.state.recipeData) {
            // return <RecipeView recipeData={this.state.recipeData} source="page" />
        } else if (this.state.error) {
            return <div style={{width: '60%', padding: '48px 0 48px', margin: 'auto'}}>
                <Message type="error" header="Error">
                    Аn error has occured, please try later. <Link to="/home"> Go back.</Link>
                </Message>
            </div>
        } else {
            return <WaitFetch />
        }
    }
};