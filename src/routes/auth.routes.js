import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Forgot from '../pages/auth/forgot';
import Login from '../pages/auth/login';
import Reset from '../pages/auth/reset';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/forgot' exact component={Forgot} />
        <Route path='/reset' exact component={Reset} />
      </Switch>
    </BrowserRouter>
  );
}
