import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Home } from './home';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
  </Switch>
);

export default App;
