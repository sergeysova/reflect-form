import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CreditForm } from './examples/credit-form/page';

const App = () => (
  <Switch>
    <Route exact path="/" component={CreditForm} />
  </Switch>
);

export default App;
