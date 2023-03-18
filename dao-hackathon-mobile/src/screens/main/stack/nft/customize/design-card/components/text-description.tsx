import React, { useCallback, useMemo } from 'react';
import { LayoutChangeEvent, TextStyle, ViewStyle } from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { sharedClamp } from '@src/common/animated';

import { CAN_SIZE } from './trash-can';

import { styles } from '../style';
import { TextDescriptionProps } from '../type';

export const TextDescription = ({
  item,
  cardY,
  layout,
  enabled,
  onSelect,
  onToggleDelete,
  onDelete,
  trashLayout,
  onToggleHold,
}: TextDescriptionProps) => {
  // state
  const hold = useSharedValue(false);
  const textLayout = useSharedValue({ width: 0, height: 0 });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offset = useSharedValue({
    x: 0,
    y: 0,
  });
  const pointer = useSharedValue({ x: 0, y: 0 });

  const wrapperStyle = useMemo<ViewStyle>(
    () => ({
      opacity: item.isShow ? 1 : 0,
      borderWidth: hold.value ? 1 : 0,
      borderColor: hold.value ? '#8DF8FF' : undefined,
    }),
    [hold.value, item.isShow],
  );

  const textStyle = useMemo<TextStyle>(() => {
    const temp = (({
      fontSize,
      color,
      fontWeight,
      textDecorationLine,
      fontStyle,
      textAlign,
    }) => ({
      fontSize,
      color,
      fontWeight,
      textDecorationLine,
      fontStyle,
      textAlign,
    }))(item);
    return temp;
  }, [item]);

  const gesture = Gesture.Pan()
    .enabled(enabled)
    .onBegin(() => {
      hold.value = true;
      runOnJS(onToggleHold)(true);
    })
    .onChange(event => {
      'worklet';
      const actualTranslateX = sharedClamp(
        offset.value.x + event.translationX,
        -((layout.width ?? 0) / 2 - textLayout.value.width / 2),
        (layout.width ?? 0) / 2 - textLayout.value.width / 2,
      );
      const actualTranslateY = sharedClamp(
        offset.value.y + event.translationY,
        -((layout.height ?? 0) / 2 - textLayout.value.height / 2),
        (layout.height ?? 0) / 2 - textLayout.value.height / 2,
      );
      translateX.value = actualTranslateX;
      translateY.value = actualTranslateY;
      pointer.value = { x: event.absoluteX, y: event.absoluteY };
      const spaceX = event.absoluteX - (layout.x + trashLayout.x);
      const spaceY = event.absoluteY - (layout.y + cardY + trashLayout.y);
      if (
        spaceX >= 0 &&
        spaceX <= CAN_SIZE &&
        spaceY >= 0 &&
        spaceY <= CAN_SIZE
      ) {
        runOnJS(onToggleDelete)(true);
      } else {
        runOnJS(onToggleDelete)(false);
      }
    })
    .onFinalize(event => {
      hold.value = false;
      runOnJS(onToggleHold)(false);
      runOnJS(onToggleDelete)(false);
      const spaceX = event.absoluteX - (layout.x + trashLayout.x);
      const spaceY = event.absoluteY - (layout.y + cardY + trashLayout.y);
      if (
        spaceX >= 0 &&
        spaceX <= CAN_SIZE &&
        spaceY >= 0 &&
        spaceY <= CAN_SIZE
      ) {
        runOnJS(onDelete)(item.id);
      }
      offset.value = { x: translateX.value, y: translateY.value };
    });

  // functions
  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width, height },
      },
    }: LayoutChangeEvent) => {
      textLayout.value = { width, height };
    },
    [textLayout],
  );

  // reStyle
  const reStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  }, []);

  // render
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        onLayout={onLayout}
        style={[[styles.textWrapper, wrapperStyle, reStyle]]}
        pointerEvents={item.isShow ? 'auto' : 'none'}
      >
        <Animated.Text
          style={[textStyle]}
          onPress={enabled ? onSelect : undefined}
        >
          {item.text}
        </Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
};
