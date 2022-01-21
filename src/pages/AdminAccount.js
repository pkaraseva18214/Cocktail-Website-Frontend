import React, { Component } from 'react'

import * as components from '../components/Components'
import { ListModerator } from '../components/ModeratorList'

import {
    Container, FlexboxGrid, Nav, Loader
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

const CustomNavAdmin = ({ active, onSelect, ...props }) => {
    return (
        <Nav {...props} activeKey={active} onSelect={onSelect} style={styles}>
            <Nav.Item eventKey="moderators" onClick={props.moderatorNav}>Moderators</Nav.Item>
            <Nav.Item eventKey="users" onClick={props.usersNav}>Pending requests</Nav.Item>
        </Nav>
    );
};

const DemoAdmin = ({ ...props }) => {
    const [active, setActive] = React.useState('moderators');
    return (
        <div>
            <CustomNavAdmin {...props} appearance="subtle" active={active} onSelect={setActive} justified />
        </div>
    );
};

export default class AdminAccount extends Component {

    constructor(props) {

        super(props)

        this.state = {

            moderators: 'empty',
            users: 'empty',
            tab: 'moderators'

        }

        this.moderatorNav = this.moderatorNav.bind(this);
        this.usersNav = this.usersNav.bind(this);

    }

    async componentDidMount() {
        this.moderatorNav()
    }

    async moderatorNav() {

        this.setState({
            moderators: 'empty',
            users: 'empty',
            tab: 'moderators'
        });

        try {
            const response = await fetch(`${baseUrl}/admin/moderator/list`, {
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            const json = await response.json();
            this.setState({ moderators: json });

        } catch (error) {
            console.log(error.message);
        }

    }

    async usersNav() {

        this.setState({
            moderators: 'empty',
            users: 'empty',
            tab: 'users'
        });

        try {

            const responsePending = await fetch(`${baseUrl}/admin/moderator/pending`, {
                mode: 'cors',
                credentials: 'include'
            })

            if (!responsePending.ok) {
                const message = `An error has occured: ${responsePending.status} - ${responsePending.statusText}`;
                throw new Error(message);
            }

            const json2 = await responsePending.json();
            this.setState({ users: json2 });

        } catch (error) {
            console.log(error.message);
        }

    }

    renderSwitchAdmin(tab) {

        switch (tab) {
            case 'moderators':
                if (this.state.moderators === 'empty') {
                    return <Loader content='loading list of moderators...' />;
                } else if (this.state.moderators.length === 0) {
                    return <h6 style={{ padding: '0 0 12px' }}>There are no moderators</h6>;
                } else {
                    return <div>
                        <h6 style={{ padding: '0 0 12px' }}>Moderators</h6>
                        <ListModerator data={this.state.moderators} status={"moderator"} />
                    </div>
                }

            case 'users':
                if (this.state.users === 'empty') {
                    return <Loader content='loading list of users...' />;
                } else if (this.state.users.length === 0) {
                    return <h6 style={{ padding: '0 0 12px' }}>There are no users who request moderator rights</h6>;
                } else {
                    return <div>
                        <h6 style={{ padding: '0 0 12px' }}>Users, requested moderator rights</h6>
                        <ListModerator data={this.state.users} status={"user"} />
                    </div>
                }

            default:
                return <Loader content='some error may occur...' />;
        }
    }

    render() {
        if (this.state.moderators) {
            return (
                <Container>
                    <div className="show-grid">
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item colspan={16} align='left'>

                                <div style={{ padding: '24px 0 24px' }}>
                                    <components.MyBreadcrumb separator={'>'} title='Account' />
                                    <h2>Account</h2>
                                </div>

                                <DemoAdmin
                                    moderatorNav={this.moderatorNav}
                                    usersNav={this.usersNav}
                                />

                                <br /> <br />

                                {this.renderSwitchAdmin(this.state.tab)}


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
