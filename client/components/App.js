import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotFoundPage } from './404/404';
import { IndexPage } from './indexPage/IndexPage';
import { Layout } from './layout/Layout';
import { UsersPage } from './users/Users';
import { LoginForm } from './forms/LoginForm';
import { SigninForm } from './forms/SigninForm';

const renderIndex = () => <IndexPage />;
const renderLogin = () => <LoginForm />;
const renderSignin = () => <SigninForm />;
const renderUsers = () => <UsersPage />;

export const App = () => (
  <Layout>
    <Switch>
      <Route exact path="/" render={renderIndex} />
      <Route exact path="/home" render={renderIndex} />
      <Route exact path="/login" render={renderLogin} />
      <Route exact path="/signin" render={renderSignin} />
      <Route exact path="/users" render={renderUsers} />
      <Route component={NotFoundPage} />
    </Switch>
  </Layout>
);

export default App;
