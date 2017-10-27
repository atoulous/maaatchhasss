import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotFoundPage } from './404/404';
import { IndexPage } from './indexPage/IndexPage';
import { Layout } from './layout/Layout';
import { UsersPage } from './users/Users';
import { SignInForm } from './forms/SignInForm';
import { SignupForm } from './forms/SignUpForm';

const renderIndex = () => <IndexPage />;
const renderSignIn = () => <SignInForm />;
const renderSignUp = () => <SignupForm />;
const renderUsers = () => <UsersPage />;

export const App = () => (
  <Layout>
    <Switch>
      <Route exact path="/" render={renderIndex} />
      <Route exact path="/signIn" render={renderSignIn} />
      <Route exact path="/signUp" render={renderSignUp} />
      <Route exact path="/users" render={renderUsers} />
      <Route component={NotFoundPage} />
    </Switch>
  </Layout>
);

export default App;
