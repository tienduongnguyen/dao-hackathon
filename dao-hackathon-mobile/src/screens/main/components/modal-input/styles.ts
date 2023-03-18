import { StyleSheet } from 'react-native';

import { sizeScale } from '@src/common';
import { FontDefault } from '@src/themes/typography';

export const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
  },
  input: {
    fontFamily: FontDefault.notoSansRegular,
    width: '90%',
  },
  backdropContainer: {
    flex: 1,
    backgroundColor: '#00000070',
  },
  addressDetailInput: {
    marginHorizontal: sizeScale(20),
  },
  addressDetailError: {
    marginStart: sizeScale(20),
  },
});
