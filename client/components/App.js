import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import IndexPage from './indexPage/IndexPage';
import Layout from './layout/Layout';
import Matchs from './users/Users';
import SignIn from './signIn/SignIn';
import SignUp from './signUp/SignUp';
import Account from './account/Account';
import UpdateAccount from './account/UpdateAccount';
import Chat from './chat/HomeChat';
import ChatWith from './chat/ChatWith';

export const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/signIn" component={SignIn} />
        <Route exact path="/signUp" component={SignUp} />
        <Route exact path="/matchs" component={Matchs} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/updateAccount" component={UpdateAccount} />
        <Route exact path="/chat" component={Chat} />
        <Route exact path="/chat/:login" component={ChatWith} />
        <Route component={IndexPage} />
      </Switch>
    </Layout>
  </BrowserRouter>
);

export default App;
