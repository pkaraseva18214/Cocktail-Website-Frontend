import React from 'react'

import {
    Table, Message, toaster
} from 'rsuite';

import 'rsuite/dist/rsuite.min.css';
import { baseUrl } from '../utils/api';

const {
    Column,
    HeaderCell,
    Cell,
} = Table;

const messageError = (
    <Message showIcon type="error" >
        An error occured, please try later.
    </Message>
);

const messageSuccessSetrights = (
    <Message showIcon type="success" >
        Rights set successfully.
    </Message>
);

const messageSuccessRemoverights = (
    <Message showIcon type="success" >
        Rights revoked successfully.
    </Message>
);

export const ListModerator = ({ data, status }) => {

    const fakeLargeData = data.map(name => ({ name, status }));

    const [userList, setUserList] = React.useState(fakeLargeData);

    return (
        <Table
            virtualized
            data={userList}
        >
            <Column flexGrow={1}>
                <HeaderCell>Username</HeaderCell>
                <Cell dataKey="name" />
            </Column>

            <Column flexGrow={1}>
                <HeaderCell>Status</HeaderCell>
                <Cell dataKey="status" />
            </Column>

            <Column flexGrow={1}>
                <HeaderCell>Action</HeaderCell>

                <Cell>
                    {rowData => {
                        async function handleAction() {
                            try {

                                let data1 = {};

                                if (rowData.status === 'moderator') {
                                    data1 = {
                                        method: 'DELETE',
                                        mode: 'cors',
                                        credentials: 'include',
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: rowData.name
                                    };
                                } else {
                                    data1 = {
                                        method: 'POST',
                                        mode: 'cors',
                                        credentials: 'include',
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: rowData.name
                                    };
                                }

                                const response = await fetch(`${baseUrl}/admin/moderator`, data1)

                                if (response.ok) {
                                    if (rowData.status === 'moderator') {
                                        toaster.push(messageSuccessRemoverights);
                                    } else {
                                        toaster.push(messageSuccessSetrights);
                                    }

                                    const index = userList.indexOf(rowData);

                                    console.log(index);

                                    if (index > -1) {
                                        userList.splice(index, 1);
                                    }

                                    setUserList([...userList]);

                                } else {
                                    toaster.push(messageError);
                                }

                            } catch (error) {
                                alert('not ok from catch');
                            }
                        }
                        return (
                            // eslint-disable-next-line
                            <span><a onClick={handleAction}>
                                {rowData.status === 'user' ? 'Set moderator rights' : 'Remove moderator rights'}
                            </a></span>
                        );
                    }}
                </Cell>
            </Column>

            {
                status === 'user' &&

                <Column flexGrow={1}>
                    <HeaderCell>Action</HeaderCell>

                    <Cell>
                        {rowData => {
                            async function handleAction() {
                                try {

                                    let data1 = {};

                                    data1 = {
                                        method: 'DELETE',
                                        mode: 'cors',
                                        credentials: 'include',
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: rowData.name
                                    };


                                    const response = await fetch(`${baseUrl}/admin/moderator`, data1)

                                    if (response.ok) {
                                        toaster.push(messageSuccessRemoverights);

                                        const index = userList.indexOf(rowData);
                                        console.log(index);

                                        if (index > -1) {
                                            userList.splice(index, 1);
                                        }

                                        setUserList([...userList]);

                                    } else {
                                        toaster.push(messageError);
                                    }

                                } catch (error) {
                                    alert('not ok from catch');
                                }
                            }
                            return (
                                // eslint-disable-next-line
                                <span><a onClick={handleAction}>Decline request</a></span>
                            );
                        }}
                    </Cell>
                </Column>
            }

        </Table>
    );
};
