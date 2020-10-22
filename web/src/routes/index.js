import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import Recipients from '../pages/Recipients';
import Problems from '../pages/Problems';
import DeliveryMan from '../pages/DeliveryMan';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/orders" component={Orders} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />
      <Route path="/recipients" component={Recipients} isPrivate />
      <Route path="/problems" component={Problems} isPrivate />
      <Route path="/deliveryMan" component={DeliveryMan} isPrivate />
    </Switch>
  );
}
