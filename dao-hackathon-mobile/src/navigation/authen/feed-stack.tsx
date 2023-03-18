import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { Feed } from '@src/screens/main/tab-feed/feed';

import { FEED_STACK } from '../screen-types';

const FeedStack = createStackNavigator();

export const FeedStackScreen = () => {
  // render
  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name={FEED_STACK.FEED} component={Feed} />
    </FeedStack.Navigator>
  );
};
