import React, { Component } from 'react'

import * as modal from './../components/MyModal'
import * as components from '../components/Components'

import {
    Container, FlexboxGrid, Loader
} from 'rsuite';

import './../css/index.css';
import 'rsuite/dist/rsuite.min.css';
import { baseUrl } from '../utils/api';

const WaitFetch = () => {
    return (
        <Loader center content="loading..." />
    )
};

export default class ModeratorAccount extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete(id) {
        let tmpar = this.state.unpublished;
        const index = tmpar.findIndex(item => item.id === id);
        if (index > -1) tmpar.splice(index, 1);
        this.setState({ unpublished: [...tmpar] });
    }

    async componentDidMount() {

        this.setState({ unpublished: [] });

        try {
            const response = await fetch(`${baseUrl}/recipe/unpublished`, {
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            const json = await response.json();
            this.setState({ unpublished: json });

        } catch (error) {
            console.log(error.message);
        }
    }

    render() {
        if (this.state.unpublished) {
            return (
                <Container>
                    <div className="show-grid">
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item colspan={16} align='left'>

                                <div style={{ padding: '24px 0 48px' }}>
                                    <components.MyBreadcrumb separator={'>'} title='Account' />
                                    <h2>Account</h2>
                                </div>

                                <modal.MyModal />

                                {
                                    this.state.unpublished.length === 0 
                                        ?
                                    <h6>There are no recipes, awaiting moderation</h6> 
                                        : 
                                    <components.CardGroup data={this.state.unpublished} source="preview" footer='modal' onDelete={this.onDelete} />
                                }

                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </div>
                </Container>
            )
        } else {
            return <WaitFetch />
        }
    }

}