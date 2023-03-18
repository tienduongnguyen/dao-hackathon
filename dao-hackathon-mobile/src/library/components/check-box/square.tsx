import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useInterpolateColor, useSharedTransition } from '@animated';
import { onCheckType } from '@common';
import { Block } from '@components/block';
import { Icon } from '@components/icon';
import { useTheme } from '@theme';

import { styles } from './styles';
import { CheckboxProps } from './type';

import { Text } from '../text';

export const SquareCheckbox = ({
  tx,
  disable,
  initialValue = false,
  onToggle,
  text,
  value,
  size = 20,
}: CheckboxProps) => {
  // state
  const { colors } = useTheme();
  const [localValue, setLocalValue] = useState<boolean>(initialValue);
  const progress = useSharedTransition(value ?? localValue, { duration: 200 });
  const activeColor = useInterpolateColor(
    progress,
    [0, 1],
    [colors.transparent, colors.primary],
  );

  // function
  const onPress = useCallback(() => {
    if (typeof value === 'boolean') {
      if (onCheckType(onToggle, 'function')) {
        onToggle && onToggle(!value);
      }
    } else {
      if (onCheckType(onToggle, 'function')) {
        onToggle && onToggle(!localValue);
      }
      setLocalValue(v => !v);
    }
  }, [localValue, onToggle, value]);

  // reanimated style
  const outlineReStyle = useAnimatedStyle(() => ({
    backgroundColor: activeColor.value,
    borderRadius: 4,
  }));

  const iconReStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }));

  // render
  return (
    <TouchableOpacity activeOpacity={1} disabled={disable} onPress={onPress}>
      <View style={[styles.row]}>
        <Animated.View style={[outlineReStyle]}>
          <Block
            borderWidth={1}
            borderColorTheme={'text_title'}
            width={size}
            height={size}
            overflow="hidden"
            middle
            justifyContent="center"
            borderRadius={4}
          >
            <Animated.View style={iconReStyle}>
              <Icon size={size - 2} icon="check" colorTheme={'white'} />
            </Animated.View>
          </Block>
        </Animated.View>
        <Text
          style={[styles.label]}
          tx={tx}
          text={text}
          colorTheme="white"
          preset="notoSanBody1Regular"
        />
      </View>
    </TouchableOpacity>
  );
};
