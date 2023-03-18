import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity } from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';

import { FastImg } from '@components-old';
import { StackScreenProps } from '@react-navigation/stack';
import { goBack } from '@src/navigation/navigation-service';
import {
  AUTHORIZE_STACK,
  AuthorizeParamsList,
} from '@src/navigation/screen-types';

import { useStackStyle } from './style';

import R from '@R';
type ImageViewProps = StackScreenProps<
  AuthorizeParamsList,
  AUTHORIZE_STACK.IMAGE_VIEW
>;

const ImageViewScreen = ({ route }: ImageViewProps) => {
  //func
  const { styles } = useStackStyle();
  const { url } = route.params;

  //render
  return (
    <>
      <ImageViewer
        imageUrls={[{ url }]}
        menus={elem => {
          elem.cancel();
          return <></>;
        }}
        renderIndicator={() => <Text />}
        enablePreload
        loadingRender={() => <ActivityIndicator />}
        renderImage={props => {
          return (
            <Image
              {...props}
              style={styles.imageViewImage}
              resizeMode="contain"
            />
          );
        }}
      />

      <TouchableOpacity
        style={styles.imageViewButton}
        onPress={() => {
          goBack();
        }}
      >
        <FastImg
          tintColor={'black'}
          style={styles.imageViewImage1}
          source={R.images.ic_close}
        />
      </TouchableOpacity>
    </>
  );
};
export default ImageViewScreen;
