import React from 'react';
import { Dimensions } from 'react-native';

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Drawer } from '@src/library/components';
import { useTheme } from '@src/themes';

import { BottomTabScreen } from './bottom-tab';

import { APP_SCREEN } from '../screen-types';

const AppDrawer = createDrawerNavigator();

export const DrawerScreen = () => {
  const { width } = Dimensions.get('window');
  const { colors } = useTheme();

  const renderDrawer = (props: DrawerContentComponentProps) => {
    return <Drawer {...props} />;
  };

  return (
    <AppDrawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'back',
        lazy: true,
        swipeEnabled: false,
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: colors.background,
          width: width,
        },
      }}
      drawerContent={renderDrawer}
    >
      <AppDrawer.Screen
        name={APP_SCREEN.BOTTOM_TAB}
        component={BottomTabScreen}
      />
    </AppDrawer.Navigator>
  );
};
