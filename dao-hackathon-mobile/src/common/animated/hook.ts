import Animated, {
  interpolate,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';

export const useInterpolate = (
  progress: Animated.SharedValue<number>,
  input: number[],
  output: number[],
  type?: Animated.Extrapolate,
) => useDerivedValue(() => interpolate(progress.value, input, output, type));

export const useInterpolateColor = (
  progress: Animated.SharedValue<number>,
  input: number[],
  output: (number | string)[],
  colorSpace?: 'RGB' | 'HSV' | undefined,
) => {
  'worklet';
  return useDerivedValue(() =>
    interpolateColor(progress.value, input, output, colorSpace),
  );
};

/**
 * Linear interpolation between x and y using a to weight between them
 */
export const useMix = (
  progress: Animated.SharedValue<number>,
  x: number,
  y: number,
) => {
  'worklet';
  return useDerivedValue(() => x + progress.value * (y - x));
};

/**
 * Convert number to radian
 */
export const useRadian = (value: Animated.SharedValue<number>) =>
  useDerivedValue(() => {
    'worklet';
    return `${value.value}deg`;
  });
