import React, { useEffect } from 'react';

import { AppModule } from '@common';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { useReducer } from '@src/redux';
import CreateNewPasswordScreen from '@src/screens/auth/CreateNewPasswordScreen';
import CreateNewWalletScreen from '@src/screens/auth/CreateNewWalletScreen';
import CreateSuccessScreen from '@src/screens/auth/CreateSuccessScreen';
import EnterPasswordScreen from '@src/screens/auth/EnterPasswordScreen';
import ImportSuccessScreen from '@src/screens/auth/ImportSuccessScreen';
import ImportWalletScreen from '@src/screens/auth/ImportWalletScreen';
import LoginScreen from '@src/screens/auth/LoginScreen';

import { UN_AUTHORIZE_STACK } from '../screen-types';

const Stack = createStackNavigator();

export const UnAuthentication = () => {
  //state
  const { params } = useReducer(x => x.Navigation);

  // effect
  useEffect(() => {
    // clean cache when logout
    AppModule.clearCache();
  }, []);

  // render
  return (
    <Stack.Navigator
      initialRouteName={
        params?.isExpired
          ? UN_AUTHORIZE_STACK.ENTER_PASSWORD
          : UN_AUTHORIZE_STACK.LOGIN
      }
      screenOptions={{
        headerBackTitleVisible: false,
        headerShown: false,
        headerTitle: '',
        headerStyle: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name={UN_AUTHORIZE_STACK.LOGIN} component={LoginScreen} />
      <Stack.Screen
        name={UN_AUTHORIZE_STACK.IMPORT_WALLET}
        component={ImportWalletScreen}
      />
      <Stack.Screen
        name={UN_AUTHORIZE_STACK.IMPORT_SUCCESS}
        component={ImportSuccessScreen}
      />
      <Stack.Screen
        name={UN_AUTHORIZE_STACK.ENTER_PASSWORD}
        component={EnterPasswordScreen}
      />
      <Stack.Screen
        name={UN_AUTHORIZE_STACK.CREATE_SUCCESS}
        component={CreateSuccessScreen}
      />
      <Stack.Screen
        name={UN_AUTHORIZE_STACK.CREATE_WALLET}
        component={CreateNewWalletScreen}
      />
      <Stack.Screen
        name={UN_AUTHORIZE_STACK.CREATE_PASSWORD}
        component={CreateNewPasswordScreen}
      />
    </Stack.Navigator>
  );
};
