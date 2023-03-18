import React, { memo, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import isEqual from 'react-fast-compare';
import FastImage, { FastImageProps } from 'react-native-fast-image';

import { useComponentsStyle } from './styles';
import { AvatarProps } from './type';
import WText from './WText';
interface FastImageCustomProps extends FastImageProps {
  size?: number;
}
const FastImg = (props: FastImageCustomProps) => {
  //state
  const { size } = props;
  const [imageLoad, setImageLoad] = useState(false);
  const [error, setError] = useState(false);
  // const [reloadKey, useReloadKey] = useState(new Date().getTime().toString());
  // const reloadImage = () => {
  //   useReloadKey(new Date().getTime().toString());
  // };
  // let {source} = props;

  // if (typeof source === 'object') {
  //   source = source.uri
  //     ? {
  //         ...source,
  //         priority: FastImage.priority.high,
  //         uri: source.uri,
  //       }
  //     : {
  //         uri: 'https://i.pinimg.com/originals/ae/8a/c2/ae8ac2fa217d23aadcc913989fcc34a2.png',
  //       };
  // }

  //func
  const { styles, colors } = useComponentsStyle();

  //render
  return (
    <FastImage
      resizeMode="contain"
      style={{ width: size, height: size }}
      children={
        imageLoad ? (
          <View
            style={styles.imageContainer}
            children={
              <ActivityIndicator
                color={colors.primary}
                style={styles.imageIndicator}
              />
            }
          />
        ) : error ? (
          <View
            style={styles.imageContainer}
            children={
              <ActivityIndicator
                color={colors.primary}
                style={styles.imageIndicator}
              />
            }
          />
        ) : (
          props.children
        )
      }
      onLoadStart={() => {
        setError(false);
        setImageLoad(true);
      }}
      onLoadEnd={() => {
        setImageLoad(false);
      }}
      onError={() => {
        setError(true);
        setImageLoad(false);
      }}
      {...props}
    />
  );
};

export const Avatar = (props: AvatarProps) => {
  //func
  const { styles, colors } = useComponentsStyle();
  const { radius, onPress, containerStyle, error, disabled } = props;

  //render
  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        style={[styles.imageButton, containerStyle]}
        onPress={onPress}
        children={
          <FastImg
            style={[
              {
                width: radius || 60,
                height: radius || 60,
                borderRadius: radius / 2 || 30,
                borderColor: error ? colors.error : colors.primary4,
              },
              props.style,
            ]}
            resizeMode="cover"
            {...props}
            source={props.source}
          />
        }
      />
      {!!error && (
        <WText
          color={colors.error}
          style={styles.imageText}
          font="regular16"
          children={error}
        />
      )}
    </>
  );
};
export default memo(FastImg, isEqual);
