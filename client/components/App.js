import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { IndexPage } from './indexPage/IndexPage';
import { Layout } from './layout/Layout';
import { UsersPage } from './users/Users';
import { SignIn } from './signIn/SignIn';
import { SignUp } from './signUp/SignUp';
import { Account } from './account/Account';

const renderIndex = () => <IndexPage />;
const renderSignIn = () => <SignIn />;
const renderSignUp = () => <SignUp />;
const renderUsers = () => <UsersPage />;
const renderAccount = () => <Account />;

export const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" render={renderIndex} />
        <Route exact path="/signIn" render={renderSignIn} />
        <Route exact path="/signUp" render={renderSignUp} />
        <Route exact path="/users" render={renderUsers} />
        <Route exact path="/account" render={renderAccount} />
        <Route render={renderIndex} />
      </Switch>
    </Layout>
  </BrowserRouter>
);

export default App;
