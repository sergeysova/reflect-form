import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ExampleForm } from './examples/page';

const App = () => (
  <Switch>
    <Route exact path="/" component={ExampleForm} />
  </Switch>
);

export default App;
