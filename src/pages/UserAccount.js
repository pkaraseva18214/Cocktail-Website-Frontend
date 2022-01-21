import React, { Component } from 'react'

import * as modal from './../components/MyModal'
import * as components from '../components/Components'

import {
    Container, FlexboxGrid, Nav, Loader, Button
} from 'rsuite';

import './../css/index.css';
import 'rsuite/dist/rsuite.min.css';
import { baseUrl } from '../utils/api';

const styles = {
    marginBottom: '50',
};

const WaitFetch = () => {
    return (
        <Loader center content="loading..." />
    )
};

const CustomNav = ({ active, onSelect, ...props }) => {
    return (
        <Nav {...props} activeKey={active} onSelect={onSelect} style={styles}>
            <Nav.Item eventKey="favourite" onClick={props.favouriteNav}>Saved recipes</Nav.Item>
            <Nav.Item eventKey="drafts" onClick={props.draftsNav}>Drafts</Nav.Item>
            <Nav.Item eventKey="awaiting" onClick={props.awaitingNav}>Awaiting moderation</Nav.Item>
            <Nav.Item eventKey="rejected" onClick={props.rejectedNav}>Rejected recipes</Nav.Item>
            <Nav.Item eventKey="published" onClick={props.publishedNav}>Published recipes</Nav.Item>
        </Nav>
    );
};

const Demo = ({ ...props }) => {
    const [active, setActive] = React.useState('favourite');
    return (
        <div>
            <CustomNav {...props} appearance="subtle" active={active} onSelect={setActive} justified />
        </div>
    );
};

export default class UserAccount extends Component {

    constructor() {
        super()

        // tab: favourite, drafts, awaiting, rejected, pending;
        this.state = {
            favourite: 'empty',
            drafts: 'empty',
            awaiting: 'empty',
            rejected: 'empty',
            published: 'empty',
            tab: 'favourite',
            moderatorStatus: 'none'
        }
        this.onDelete = this.onDelete.bind(this);

        this.favouriteNav = this.favouriteNav.bind(this);
        this.draftsNav = this.draftsNav.bind(this);
        this.awaitingNav = this.awaitingNav.bind(this);
        this.rejectedNav = this.rejectedNav.bind(this);
        this.publishedNav = this.publishedNav.bind(this);

        this.checkRequestModeratorRightsStatus = this.checkRequestModeratorRightsStatus.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    async componentDidMount() {
        this.favouriteNav()
        this.checkRequestModeratorRightsStatus()
    }

    async checkRequestModeratorRightsStatus() {
        try {
            const res = await fetch(`${baseUrl}/account/moderator`, {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                const message = `An error has occured: ${res.status} - ${res.statusText}`;
                throw new Error(message);
            }

            const data = await res.json();
            this.setState({ moderatorStatus: data.response })

        } catch (err) {
            console.log(err.message);
        }
    }

    async favouriteNav() {

        this.setState({
            favourite: 'empty',
            drafts: 'empty',
            awaiting: 'empty',
            rejected: 'empty',
            published: 'empty',
            tab: 'favourite'
        });

        try {
            const response = await fetch(`${baseUrl}/favourite`, {
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            const json = await response.json();
            this.setState({ favourite: json });

        } catch (error) {
            console.log(error.message);
        }
    }

    async draftsNav() {

        this.setState({
            favourite: 'empty',
            drafts: 'empty',
            awaiting: 'empty',
            rejected: 'empty',
            published: 'empty',
            tab: 'drafts'
        });

        try {
            const response = await fetch(`${baseUrl}/recipe/own?status=none`, {
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            const json = await response.json();
            this.setState({ drafts: json });

        } catch (error) {
            console.log(error.message);
        }
    }

    async awaitingNav() {

        this.setState({
            favourite: 'empty',
            drafts: 'empty',
            awaiting: 'empty',
            rejected: 'empty',
            published: 'empty',
            tab: 'awaiting'
        });

        try {
            const response = await fetch(`${baseUrl}/recipe/own?status=pending`, {
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            const json = await response.json();
            this.setState({ awaiting: json });

        } catch (error) {
            console.log(error.message);
        }
    }

    async rejectedNav() {

        this.setState({
            favourite: 'empty',
            drafts: 'empty',
            awaiting: 'empty',
            rejected: 'empty',
            published: 'empty',
            tab: 'rejected'
        });

        try {
            const response = await fetch(`${baseUrl}/recipe/own?status=declined`, {
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            const json = await response.json();
            this.setState({ rejected: json });

        } catch (error) {
            console.log(error.message);
        }
    }

    async publishedNav() {

        this.setState({
            favourite: 'empty',
            drafts: 'empty',
            awaiting: 'empty',
            rejected: 'empty',
            published: 'empty',
            tab: 'published'
        });

        try {
            const response = await fetch(`${baseUrl}/recipe/own?status=accepted`, {
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            const json = await response.json();
            this.setState({ published: json });

        } catch (error) {
            console.log(error.message);
        }
    }

    async sendRequest() {

        try {
            const response = await fetch(`${baseUrl}/account/moderator`, {
                mode: 'cors',
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            this.setState({ moderatorStatus: 'pending' })

        } catch (error) {
            console.log(error.message);
        }
    }

    onDelete(id) {
        let tmpar = this.state.unpublished;
        const index = tmpar.findIndex(item => item.id === id);
        if (index > -1) tmpar.splice(index, 1);
        this.setState({ unpublished: [...tmpar] });
    }

    renderSwitch(tab) {
        switch (tab) {
            case 'favourite':
                if (this.state.favourite === 'empty') {
                    return <Loader content='loading favourite...' />;
                } else if (this.state.favourite.length === 0) {
                    return <p>You have no favourite recipes</p>;
                } else {
                    return <components.CardGroup data={this.state.favourite} source="page" footer="close" onDelete={this.onDelete} />
                }


            case 'drafts':
                if (this.state.drafts === 'empty') {
                    return <Loader content='loading drafts...' />;
                } else if (this.state.drafts.length === 0) {
                    return <p>You have no drafts</p>;
                } else {
                    return <components.CardGroup data={this.state.drafts} source="edit" onDelete={this.onDelete} onUpdate={this.draftsNav} />
                }


            case 'awaiting':
                if (this.state.awaiting === 'empty') {
                    return <Loader content='loading awaiting...' />;
                } else if (this.state.awaiting.length === 0) {
                    return <p>You have no awaiting moderation recipes</p>;
                } else {
                    return <components.CardGroup data={this.state.awaiting} source="preview" footer="close" onDelete={this.onDelete} />
                }


            case 'rejected':
                if (this.state.rejected === 'empty') {
                    return <Loader content='loading rejected...' />;
                } else if (this.state.rejected.length === 0) {
                    return <p>You have no rejected recipes</p>;
                } else {
                    return <components.CardGroup data={this.state.rejected} source="preview" footer="delete" onDelete={this.onDelete} />
                }


            case 'published':
                if (this.state.published === 'empty') {
                    return <Loader content='loading published...' />;
                } else if (this.state.published.length === 0) {
                    return <p>You have no published recipes</p>;
                } else {
                    return <components.CardGroup data={this.state.published} source="preview" footer="delete" onDelete={this.onDelete} />
                }

            default:
                return <p>error</p>
        }

    }

    render() {
        if (this.state.favourite) {
            return (
                <Container>
                    <div className="show-grid">
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item colspan={16} align='left'>
                                <div style={{ padding: '24px 0 24px' }}>
                                    <components.MyBreadcrumb separator={'>'} title='Account' />
                                    <h2>Account</h2>
                                </div>

                                <div style={{ padding: '0 0 24px' }}>

                                    {
                                        {
                                            'accepted': <Button appearance="ghost" color="green" disabled>Request was accepted, please refresh page</Button>,
                                            'none': <Button appearance="ghost" onClick={this.sendRequest}>Send request to get moderator rights</Button>,
                                            'declined': <Button appearance="ghost" onClick={this.sendRequest}>Send request to get moderator rights</Button>,
                                            'pending': <Button appearance="ghost" disabled>Request has been sent</Button>,
                                        }[this.state.moderatorStatus]
                                    }
                                </div>

                                <modal.MyModal />

                                <Demo
                                    favouriteNav={this.favouriteNav}
                                    draftsNav={this.draftsNav}
                                    awaitingNav={this.awaitingNav}
                                    rejectedNav={this.rejectedNav}
                                    publishedNav={this.publishedNav}
                                />

                                <br /> <br />

                                {this.renderSwitch(this.state.tab)}

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