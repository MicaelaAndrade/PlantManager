import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import StackRouter from './stack.routes';

const Routes = () => (
  <NavigationContainer>
    <StackRouter />
  </NavigationContainer>
)

export default Routes;