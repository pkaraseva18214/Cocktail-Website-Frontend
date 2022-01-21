import React from 'react';
import { Button, ButtonToolbar, FlexboxGrid, Form, Panel, Schema } from 'rsuite';

import { Redirect } from 'react-router-dom'

import 'rsuite/dist/rsuite.min.css';
import { baseUrl } from '../utils/api';

const { StringType } = Schema.Types;

const model = Schema.Model({
  username: StringType().isRequired('This field is required.'),
  password: StringType().isRequired('This field is required.')
});

export async function LoginRequest(props, data) {
  try {
    const res = await fetch(`${baseUrl}/account/auth`, {
      method: "post",
      mode: 'cors',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!res.ok) {
      const message = `An error has occured: ${res.status} - ${res.statusText}`;
      throw new Error(message);
    }

    props.getData();

  } catch (err) {
    console.log(err.message);
  }
}

export default function Login(props) {

  const formRef = React.useRef();
  const [formValue, setFormValue] = React.useState({});

  async function onClick() {
    if (formRef.current.check()) {
      LoginRequest(props, JSON.stringify(formValue));
    }
  }

  if (props.loggedInStatus === "LOGGED_IN") {
    return <Redirect to='/home' />;
  }

  return (

    <FlexboxGrid justify="center" align="middle" style={{ height: '100%' }}>
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Login</h3>} bordered>
          <Form ref={formRef} model={model} formValue={formValue} onChange={setFormValue} fluid>
            <Form.Group>
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control name="username" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control name="password" type="password" autoComplete="off" />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" onClick={onClick}>Sign in</Button>
                <Button appearance="link" href="/signup">Sign up</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}