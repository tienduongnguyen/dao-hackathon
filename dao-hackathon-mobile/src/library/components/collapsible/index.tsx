import React, { useCallback, useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { sharedTiming, useSharedTransition } from '@animated';
import { execFunc } from '@src/common';

import { styles } from './styles';
import { CollapsibleProps } from './type';

export const Collapsible = ({
  renderContent,
  renderMasterView,
  children,
  withAnimated = true,
  defaultState = false,
  onToggle,
}: CollapsibleProps) => {
  // state
  const [measured, setMeasured] = useState<LayoutRectangle>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const [isShow, setIsShow] = useState(defaultState);

  // reanimated
  const progress = useSharedTransition(isShow);
  const height = useSharedValue(0);

  // function
  const _onPress = useCallback(() => {
    setIsShow(v => !v);
    execFunc(onToggle);
  }, [onToggle]);

  const _onLayoutContent = (e: LayoutChangeEvent) => {
    setMeasured(e.nativeEvent.layout);
  };

  const renderContentView = () => {
    if (withAnimated) {
      return (
        <Animated.View style={[styles.base, contentStyle]}>
          {renderContent ? renderContent(progress) : children}
        </Animated.View>
      );
    }
    if (isShow) {
      return (
        <Animated.View style={[styles.base]}>
          {renderContent ? renderContent(progress) : children}
        </Animated.View>
      );
    }
    return null;
  };

  // reanimated style
  const contentStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  // effect
  useEffect(() => {
    if (isShow) {
      height.value = sharedTiming(measured.height);
    } else {
      height.value = sharedTiming(0);
    }
  }, [height, isShow, measured.height]);

  // render
  return (
    <View>
      {withAnimated ? (
        <Animated.View
          pointerEvents={'none'}
          onLayout={_onLayoutContent}
          style={[styles.base, styles.hiddenView]}
        >
          {renderContent ? renderContent(progress) : children}
        </Animated.View>
      ) : null}
      <TouchableOpacity onPress={_onPress}>
        {renderMasterView ? (
          renderMasterView(progress)
        ) : (
          <View style={styles.header}>
            <Text>Toggle</Text>
          </View>
        )}
      </TouchableOpacity>
      {renderContentView()}
    </View>
  );
};
