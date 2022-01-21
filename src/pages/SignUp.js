import React from 'react';
import { FlexboxGrid, Panel, Form, ButtonToolbar, Button, Schema, Message, toaster } from 'rsuite';

import { Redirect } from 'react-router-dom'

import 'rsuite/dist/rsuite.min.css';
import { baseUrl } from '../utils/api';
import { LoginRequest } from './Login';

const { StringType } = Schema.Types;

const model = Schema.Model({
    username: StringType().isRequired('This field is required.'),
    password: StringType().isRequired('This field is required.'),
    email: StringType().isEmail('Please enter a valid email address.').isRequired('This field is required.')
});

const messageError = (
    <Message showIcon type="error" >
        Account already exist. Please, enter another username or                 
        <a href="/login"> Log in</a>
    </Message>
);

export async function CheckAccountExist(props, username, data) {
    try {
        const res = await fetch(`${baseUrl}/account/exist/` + username, {
            method: "get",
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!res.ok) {
            const message = `An error has occured: ${res.status} - ${res.statusText}`;
            throw new Error(message);
        } 

        const json = await res.json();          
        if (json === true) {
            toaster.push(messageError);
        } else {

            try {
                const res = await fetch(`${baseUrl}/account/register`, {
                    method: "post",
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    const message = `An error has occured: ${res.status} - ${res.statusText}`;
                    throw new Error(message);
                }

                delete data['email'];
                LoginRequest(props, JSON.stringify(data))

            } catch (err) {
                console.log(err.message);
            }
        }
        

    } catch (err) {
        console.log(err.message);
    }
}

export default function SignUp(props) {

    const formRef = React.useRef();
    const [formValue, setFormValue] = React.useState({});

    async function onClick() {
        if (formRef.current.check()) {
            CheckAccountExist(props, formValue['username'], formValue);
        }
    }

    if (props.loggedInStatus === "LOGGED_IN") {
        return <Redirect to='/home' />;
    }

    return (
        <FlexboxGrid justify="center" align="middle" style={{ height: '100%' }}>
            <FlexboxGrid.Item colspan={12}>
                <Panel header={<h3>Sign Up</h3>} bordered>
                    <Form ref={formRef} model={model} formValue={formValue} onChange={setFormValue} fluid>
                        <Form.Group>
                            <Form.ControlLabel>Username</Form.ControlLabel>
                            <Form.Control name="username" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control name="email" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Password</Form.ControlLabel>
                            <Form.Control name="password" type="password" autoComplete="off" />
                        </Form.Group>
                        <Form.Group>
                            <ButtonToolbar>
                                <Button appearance="primary" onClick={onClick}>Sign up</Button>
                                <Button appearance="link" href="/login">Log in</Button>
                            </ButtonToolbar>
                        </Form.Group>
                    </Form>
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )

}
