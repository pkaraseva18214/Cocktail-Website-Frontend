import React, { Component } from 'react'

import 'rsuite/dist/rsuite.min.css';
import { Container, FlexboxGrid, Loader } from 'rsuite';

import * as components from '../components/Components'
import { baseUrl } from '../utils/api';

import './../css/index.css';

import * as SearchForm from './../components/SearchForm.js'

export default class Home extends Component {

    constructor() {
        super()
        this.state = {
            recipes: 'empty'
        }

        this.onDelete = this.onDelete.bind(this);
        this.sendSearchReq = this.sendSearchReq.bind(this);

    }

    onDelete(id) {
        let tmpar = this.state.unpublished;
        const index = tmpar.findIndex(item => item.id === id);
        if (index > -1) tmpar.splice(index, 1);
        this.setState({ unpublished: [...tmpar] });
    }

    async componentDidMount() {
        this.sendSearchReq({
            author: '',
            query: '',
            tags: [],
            ingredient: '',
            limit: 100,
            offset: 0
        })
    }

    async sendSearchReq(data) {
        try {

            if (data.author === '') delete data['author'];
            if (data.ingredient === '') delete data['ingredient'];
            if (data.query === '') delete data['query'];
            if (data.tags && data.tags.length === 0) delete data['tags'];

            const response = await fetch(`${baseUrl}/recipe/find`, {
                method: 'post',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            const json = await response.json();
            this.setState({ recipes: json });

        } catch (error) {
            console.log(error.message);
        }
    }

    pageContent() {
        if (this.state.recipes === 'empty') {
            return <Loader content='loading recipes...' />;
        } else if (this.state.recipes.length === 0) {
            return <p>No recipes found</p>;
        } else {
            return <components.CardGroup data={this.state.recipes} source="page" footer="close" onDelete={this.onDelete} />
        }
    }

    render() {
        return (

            <Container>

                <div className="show-grid">
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item colspan={16} align='left'>

                            <div style={{ padding: '48px 0 48px' }}>
                                <SearchForm.SearchForm sendSearchReq={this.sendSearchReq} />
                            </div>

                            {this.pageContent()}

                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>
            </Container>
        )
    }
}
