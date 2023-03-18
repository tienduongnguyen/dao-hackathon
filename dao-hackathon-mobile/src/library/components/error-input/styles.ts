import { StyleSheet } from 'react-native';

import { sizeScale } from '@common';

export const styles = StyleSheet.create({
  wrapError: {
    marginTop: sizeScale(4),
    flexDirection: 'row',
  },
  wrapErrorIcon: {
    marginRight: sizeScale(4),
  },
});
