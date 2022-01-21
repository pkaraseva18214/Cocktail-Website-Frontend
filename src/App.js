import React, { Component } from 'react';

import { Redirect, Route, Switch, withRouter } from 'react-router-dom'

import styles from './css/App.module.css';
import Login from './pages/Login'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Recipe from './pages/Recipe'
import Account from './pages/Account'

import { NavBar } from './components/Components';
import { Container, Content, Header } from 'rsuite';

import { baseUrl } from './utils/api';

function Logout(props) {

  async function logout() {
    try {
      const res = await fetch(`${baseUrl}/account/logout`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }

      props.handleLogout();

    } catch (err) {
      console.log(err.message);
    }

  }

  if (props.loggedInStatus === "LOGGED_IN") {
    logout();
  }

  return <Redirect to='/login' />;

}

class App extends Component {

  constructor() {
    super();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

  }

  handleLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    });

  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: "LOGGED_IN",
      user: data
    });

  }

  async getUserData() {
    try {
      const res = await fetch(`${baseUrl}/account`, {
        mode: 'cors',
        credentials: 'include',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }

      const data = await res.json();
      this.handleLogin(data);

    } catch (err) {
      console.log(err.message);
    }

  }

  render() {
    const { history } = this.props

    return (
      <Container className={styles.app}>
        <Header>
          <NavBar state={this.state.loggedInStatus} />
        </Header>

        <Content>
          <Switch>

            {/* <Route history={history} path='/home' component={Home} /> */}

            <Route history={history} path='/home' render={() => (
              this.state.loggedInStatus === "NOT_LOGGED_IN" ? <Redirect to="/login" /> : <Home />
            )} />

            <Route history={history} path='/login' render={props => (
              this.state.loggedInStatus === "LOGGED_IN" ? <Redirect to="/home" /> : <Login
                {...props}
                handleLogin={this.handleLogin}
                handleLogout={this.handleLogout}
                loggedInStatus={this.state.loggedInStatus}
                user={this.state.user}
                getData={this.getUserData}
              />
            )} />

            <Route history={history} path='/signup' render={props => (
              this.state.loggedInStatus === "LOGGED_IN" ? <Redirect to="/home" /> : <SignUp
                {...props}
                handleLogin={this.handleLogin}
                handleLogout={this.handleLogout}
                loggedInStatus={this.state.loggedInStatus}
                user={this.state.user}
                getData={this.getUserData}
              />
            )} />

            <Route history={history} path='/account' render={props => (
              this.state.loggedInStatus === "NOT_LOGGED_IN" ? <Redirect to="/login" /> : <Account
                {...props}
                loggedInStatus={this.state.loggedInStatus}
                user={this.state.user}
              />
            )} />

            <Route history={history} path='/recipe/:recipeId' render={(props) => (
              this.state.loggedInStatus === "NOT_LOGGED_IN" ? <Redirect to="/login" /> : <Recipe {...props}/>
            )} />

            <Route history={history} path='/logout' render={props => (
              <Logout
                {...props}
                handleLogout={this.handleLogout}
                loggedInStatus={this.state.loggedInStatus}
              />
            )} />

            <Redirect from='/' to='/home' />
          </Switch>
        </Content>

        <div className={styles.footer}>
          <p>COCKTAIL WEBSITE</p>
          <p>Made by NSU students</p>
        </div>

      </Container>
    );
  }
}

export default withRouter(App)
