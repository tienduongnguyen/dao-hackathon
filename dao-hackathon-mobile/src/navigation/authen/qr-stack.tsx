import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import QrCodeScreen from '@src/screens/main/QrCodeScreen';

import { QR_STACK } from '../screen-types';

const QRStack = createStackNavigator();

export const QRStackScreen = () => {
  // render
  return (
    <QRStack.Navigator screenOptions={{ headerShown: false }}>
      <QRStack.Screen name={QR_STACK.QR} component={QrCodeScreen} />
    </QRStack.Navigator>
  );
};
