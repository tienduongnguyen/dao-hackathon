import { StyleSheet } from 'react-native';

import { dimension } from '@src/constants';

export const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: dimension.width / 1.25,
    paddingHorizontal: 16,
  },
  listStyle: {
    width: dimension.width,
  },
});
