import { StyleSheet } from 'react-native';

import { sizeScale } from '@common';
import { FontDefault } from '@theme/typography';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sizeScale(16),
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: 5,
    height: sizeScale(48),
    borderColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: '#000',
    padding: 0,
    flex: 1,
    fontSize: sizeScale(16),
    fontFamily: FontDefault.notoSansRegular,
    borderBottomColor: 'transparent',
  },
  wrapLabel: {
    alignSelf: 'flex-start',
    paddingBottom: sizeScale(8),
    flexDirection: 'row',
  },
  content: {
    alignItems: 'flex-start',
  },
  wrapPlaceHolder: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingLeft: 5,
  },
  flex: {
    flex: 1,
  },
});
