import { StyleSheet } from 'react-native';

import { sizeScale } from '@src/common';
export const styles = StyleSheet.create({
  textWrapper: {
    borderWidth: 1,
    position: 'absolute',
    zIndex: 99,
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
  },
  wrapper: {
    borderWidth: 1,
    position: 'absolute',
    zIndex: 1,
  },
  cardStyle: {
    width: '100%',
    height: sizeScale(193),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
