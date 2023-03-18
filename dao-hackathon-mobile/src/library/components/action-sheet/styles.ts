import { StyleSheet } from 'react-native';

import { sizeScale } from '@common';

const ACTION_SHEET_HEIGHT = 338;
export const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  wrap: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: sizeScale(ACTION_SHEET_HEIGHT),
    backgroundColor: '#1B0D2D',
  },
  backDrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 998,
  },
  wrapOption: {
    backgroundColor: '#1B0D2D',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: sizeScale(10),
  },
  wrapCancel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: sizeScale(10),
  },
  textCancel: {
    color: 'rgba(255,0,0,0.8)',
  },
  wrapTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  title: {
    fontSize: sizeScale(15),

    alignSelf: 'center',
    color: '#333333',
  },
  wrapTextCancel: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  wrapTextOption: {
    paddingVertical: 10,
    paddingHorizontal: sizeScale(16),
  },
});
