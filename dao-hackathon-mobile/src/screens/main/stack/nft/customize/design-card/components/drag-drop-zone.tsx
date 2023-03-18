import React, { useCallback, useMemo } from 'react';
import { LayoutChangeEvent, ViewStyle } from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { sharedClamp } from '@src/common/animated';
import { Button } from '@src/library/components';

import { CAN_SIZE } from './trash-can';

import { styles } from '../style';
import { DragDropZoneProps } from '../type';

export const DragDropZone = ({
  id,
  children,
  cardY,
  layout,
  enabled,
  onSelect,
  onToggleDelete,
  onDelete,
  trashLayout,
  onToggleHold,
  isIcon = false,
}: DragDropZoneProps) => {
  // state
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offset = useSharedValue({ x: 0, y: 0 });
  const hold = useSharedValue(false);
  const elementLayout = useSharedValue({ width: 0, height: 0 });
  const pointer = useSharedValue({ x: 0, y: 0 });
  // const [scale, setScale] = useState(1);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const wrapperStyle = useMemo<ViewStyle>(
    () => ({
      borderWidth: hold.value ? 1 : 0,
      borderColor: hold.value ? '#8DF8FF' : undefined,
    }),
    [hold.value],
  );
  const gesturePinch = Gesture.Pinch()
    .enabled(enabled)
    .onUpdate(event => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      if (isIcon) {
        if (scale.value < 1) {
          savedScale.value = scale.value;
        } else {
          scale.value = 1;
          savedScale.value = 1;
        }
      } else {
        const ratio = (layout.height ?? 0) / 100;
        if (scale.value < ratio) {
          savedScale.value = scale.value;
        } else {
          scale.value = ratio;
          savedScale.value = ratio;
        }
      }
    });

  const gestureDrag = Gesture.Pan()
    .enabled(enabled)
    .onBegin(() => {
      hold.value = true;
      runOnJS(onToggleHold)(true);
    })
    .onChange(event => {
      // 'worklet';
      const actualTranslateX = sharedClamp(
        offset.value.x + event.translationX,
        -(
          (layout.width ?? 0) / 2 -
          (elementLayout.value.width * savedScale.value) / 2
        ),
        (layout.width ?? 0) / 2 -
          (elementLayout.value.width * savedScale.value) / 2,
      );
      const actualTranslateY = sharedClamp(
        offset.value.y + event.translationY,
        -(
          (layout.height ?? 0) / 2 -
          (elementLayout.value.height * savedScale.value) / 2
        ),
        (layout.height ?? 0) / 2 -
          (elementLayout.value.height * savedScale.value) / 2,
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
        runOnJS(onDelete)(id);
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
      elementLayout.value = { width, height };
    },
    [elementLayout],
  );

  // reStyle
  const reStyle = useAnimatedStyle(() => {
    return isIcon
      ? {
          transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
          ],
        }
      : {
          transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
          ],
        };
  }, []);
  const reStyleChildren = useAnimatedStyle(() => {
    return isIcon
      ? {
          transform: [{ scale: scale.value }],
        }
      : {};
  }, []);

  const composed = Gesture.Simultaneous(gestureDrag, gesturePinch);

  // render
  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        onLayout={onLayout}
        style={[[styles.textWrapper, wrapperStyle, reStyle]]}
      >
        <Animated.View style={reStyleChildren}>
          <Button onPress={onSelect}>{children}</Button>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
