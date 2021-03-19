import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { UserForm } from './examples/user-info/page';

const App = () => (
  <Switch>
    <Route exact path="/" component={UserForm} />
  </Switch>
);

export default App;
