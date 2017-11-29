import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import IndexPage from './indexPage/IndexPage';
import Layout from './layout/Layout';
import Matchs from './users/Users';
import SignIn from './signIn/SignIn';
import SignUp from './signUp/SignUp';
import Account from './account/Account';
import Chat from './chat/HomeChat';

export const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" render={() => <IndexPage />} />
        <Route exact path="/signIn" render={() => <SignIn />} />
        <Route exact path="/signUp" render={() => <SignUp />} />
        <Route exact path="/matchs" render={() => <Matchs />} />
        <Route exact path="/account" render={() => <Account />} />
        <Route exact path="/chat" render={() => <Chat />} />
        <Route render={() => <IndexPage />} />
      </Switch>
    </Layout>
  </BrowserRouter>
);

export default App;
