import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Menu from '../pages/app/menu';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Menu} />
      </Switch>
    </BrowserRouter>
  );
}
