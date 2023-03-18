import React, { useEffect } from 'react';

import BootSplash from 'react-native-bootsplash';

import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { useReducer } from '@src/redux';
import SplashScreen from '@src/screens/SplashScreen';

import { MainScreen } from './authen/index';
import { APP_SCREEN, RootStackParamList } from './screen-types';
import { UnAuthentication } from './un-authen/index';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  // state
  const { route } = useReducer(x => x.Navigation);

  // effect
  useEffect(() => {
    const id = setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 1000);
    return () => clearTimeout(id);
  }, []);

  // render
  return (
    <RootStack.Navigator
      // initialRouteName={APP_SCREEN.UN_AUTHORIZE}
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      {route === APP_SCREEN.AUTHORIZE ? (
        <RootStack.Screen
          options={{ gestureEnabled: false }}
          name={APP_SCREEN.AUTHORIZE}
          component={MainScreen}
        />
      ) : route === APP_SCREEN.UN_AUTHORIZE ? (
        <RootStack.Screen
          options={{ animationTypeForReplace: 'pop' }}
          name={APP_SCREEN.UN_AUTHORIZE}
          component={UnAuthentication}
        />
      ) : (
        <RootStack.Screen
          options={{ animationTypeForReplace: 'pop' }}
          name={APP_SCREEN.SPLASH}
          component={SplashScreen}
        />
      )}
    </RootStack.Navigator>
  );
};
