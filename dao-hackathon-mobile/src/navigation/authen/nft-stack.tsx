import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import NftScreen from '@src/screens/main/NftScreen';

import { NFT_STACK } from '../screen-types';

const NFTStack = createStackNavigator();

export const NFTStackScreen = () => {
  // render
  return (
    <NFTStack.Navigator screenOptions={{ headerShown: false }}>
      <NFTStack.Screen name={NFT_STACK.NFT} component={NftScreen} />
    </NFTStack.Navigator>
  );
};
