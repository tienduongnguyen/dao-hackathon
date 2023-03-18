import { StyleSheet, useWindowDimensions } from 'react-native';

import { colors } from '@src/constants';

export const useShakeStyle = () => {
  const { width, height } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      // flex: 1,
    },
    loading: {
      position: 'absolute',
      width,
      height,
      backgroundColor: colors.background_blur,
    },
  });

  return { styles };
};
