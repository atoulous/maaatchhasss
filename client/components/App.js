import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './home/Home';
import Layout from './layout/Layout';
import SignIn from './signIn/SignIn';
import SignUp from './signUp/SignUp';
import Account from './users/account/Account';
import UpdateAccount from './users/account/updateAccount/UpdateAccount';
import Users from './users/Users';
import Matchs from './users/Matchs';
import Chat from './chat/HomeChat';
import ChatWith from './chat/ChatWith';

export const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signIn" component={SignIn} />
        <Route exact path="/signUp" component={SignUp} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/updateAccount" component={UpdateAccount} />
        <Route exact path="/updateAccount/:login" component={UpdateAccount} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/matchs" component={Matchs} />
        <Route exact path="/chat" component={Chat} />
        <Route exact path="/chat/:login" component={ChatWith} />
        <Route component={Home} />
      </Switch>
    </Layout>
  </BrowserRouter>
);

export default App;
