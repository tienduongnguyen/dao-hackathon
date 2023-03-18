import { StyleSheet } from 'react-native';

import { colors } from '@src/constants';
import { ColorDefault } from '@theme/color';

const DIMENSIONS = { width: 20, height: 20 };
export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  radioStyle: {
    borderWidth: 1,
    borderColor: colors.text_title,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  outline: {
    ...DIMENSIONS,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ColorDefault.primary,
    borderRadius: 1,
  },
  fill: {
    width: DIMENSIONS.width - 4,
    height: DIMENSIONS.height - 4,
    backgroundColor: ColorDefault.primary,
  },
  label: {
    paddingLeft: 8,
  },
});
