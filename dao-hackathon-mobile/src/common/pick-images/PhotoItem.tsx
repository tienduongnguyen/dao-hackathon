/* eslint-disable react-native/no-unused-styles */
import React, { memo, useCallback, useMemo } from 'react';
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import isEqual from 'react-fast-compare';
import FastImage from 'react-native-fast-image';

import { enhance, isIos, onCheckType } from '@common';
import { useTheme } from '@react-navigation/native';

import { PADDING } from './constants';
import { Photo } from './ImageLibrary.props';

const ImageLoad = isIos ? Image : FastImage;

const UN_ACTIVE_COLOR = 'rgba(255,255,255,.5)';
const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  wrapCamera: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  wrapSelected: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  icon: {
    width: 50,
    height: 50,
  },
  wrapDot: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    width: 15,
    height: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

interface PhotoItemProps {
  photo: Photo;
  selected?: boolean;
  canSelect?: boolean;
  isMaxSelected?: boolean;
  onSelect?: (photo: Photo) => void;
  onPressCamera?: () => void;
}

const PhotoItemComponent = ({
  photo,
  canSelect = true,
  onSelect,
  selected = false,
  isMaxSelected = true,
}: PhotoItemProps) => {
  // state
  const theme = useTheme();
  const { width: deviceWidth } = useWindowDimensions();
  const widthContent = useMemo<number>(
    () => deviceWidth / 3 - PADDING,
    [deviceWidth],
  );

  const wrapStyle = useMemo<ViewStyle>(
    () => ({
      padding: 5,
      width: widthContent,
      height: widthContent,
    }),
    [widthContent],
  );

  const disabledSelectedStyle = useMemo<ViewStyle>(
    () => ({
      opacity: 0.4,
    }),
    [],
  );

  const wrapDot = useMemo<ViewStyle>(
    () =>
      enhance<ViewStyle>([
        styles.wrapDot,
        {
          borderColor: selected ? theme.colors.primary : UN_ACTIVE_COLOR,
        },
      ]),
    [selected, theme.colors.primary],
  );

  const dot = useMemo<ViewStyle>(
    () =>
      enhance<ViewStyle>([
        styles.dot,
        {
          backgroundColor: selected ? theme.colors.primary : UN_ACTIVE_COLOR,
        },
      ]),
    [selected, theme.colors.primary],
  );

  // function
  const onPhotoPress = useCallback(() => {
    if (onSelect && onCheckType(onSelect, 'function')) {
      onSelect(photo);
    }
  }, [onSelect, photo]);

  // render
  return (
    <View
      style={[wrapStyle, !isMaxSelected && !selected && disabledSelectedStyle]}
    >
      <View style={[styles.content]}>
        <TouchableWithoutFeedback onPress={onPhotoPress} disabled={!canSelect}>
          <ImageLoad
            source={{ uri: photo.uri }}
            resizeMode={'cover'}
            style={styles.photo}
          />
        </TouchableWithoutFeedback>
        {canSelect && photo.isRenderCamera !== true && (
          <View style={[styles.wrapSelected]} pointerEvents={'none'}>
            <View style={[wrapDot]}>{selected && <View style={dot} />}</View>
          </View>
        )}
      </View>
    </View>
  );
};

export const PhotoItem = memo(PhotoItemComponent, isEqual);
