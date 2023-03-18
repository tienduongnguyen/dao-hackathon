import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { MyPageScreen } from '@src/screens/main/tab-my-page';

import { MY_PAGE_STACK } from '../screen-types';

const MyPageStack = createStackNavigator();

export const MyPageStackScreen = () => {
  // render
  return (
    <MyPageStack.Navigator screenOptions={{ headerShown: false }}>
      <MyPageStack.Screen
        name={MY_PAGE_STACK.MY_PAGE}
        component={MyPageScreen}
      />
    </MyPageStack.Navigator>
  );
};
