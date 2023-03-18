import React, { memo, useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import isEqual from 'react-fast-compare';
import { RNCamera } from 'react-native-camera';
import FastImage from 'react-native-fast-image';
import { RESULTS } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  execFunc,
  MAX_NFT_MINT,
  onCheckType,
  sizeScale,
  useCameraPermission,
} from '@common';
import { useIsFocused } from '@react-navigation/native';
import { ColorDefault } from '@src/themes/color';
import { takeCropFromImage } from '@src/utils/ImagePickerCropHelper';

import { CaptureImageProps } from './type';
import { UnAuthorizedCamera } from './UnAuthorizedCamera';

import { Block } from '../block';
import BottomSheet from '../bottom-sheet';
import { Button } from '../button';
import { Icon } from '../icon';
import { Text } from '../text';

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

const HEIGHT_DIVIDER = 70;

const CaptureButton = memo(
  ({
    onCapture,
    onNext,
    amount,
  }: {
    onCapture: () => void;
    onNext: () => void;
    amount: number;
  }) => {
    // state
    const inset = useSafeAreaInsets();
    // render
    return (
      <Block
        bottom={inset.bottom + 30}
        zIndex={1}
        position={'absolute'}
        direction="row"
        width={'100%'}
        paddingHorizontal={sizeScale(16)}
        justifyContent={'center'}
        middle
      >
        <Button onPress={onCapture} disabled={amount === MAX_NFT_MINT}>
          <Block
            height={80}
            width={80}
            middle
            justifyContent={'center'}
            color={ColorDefault.disable_button}
            borderRadius={40}
          >
            <Block
              height={55}
              width={55}
              borderRadius={30}
              colorTheme={'white'}
            />
          </Block>
        </Button>
        {amount > 0 && (
          <Block position="absolute" right={sizeScale(16)}>
            <Button
              onPress={onNext}
              text={`Next (${amount})`}
              textColorTheme={'white'}
              preset="primary"
              gradient={ColorDefault.gradient}
              typePreset="small"
            />
          </Block>
        )}
      </Block>
    );
  },
  isEqual,
);

const PreviewImage = memo(({ uri }: { uri: string }) => {
  return (
    <Block style={StyleSheet.absoluteFillObject}>
      <FastImage
        source={{ uri }}
        resizeMode={'contain'}
        style={[styles.image]}
      />
    </Block>
  );
}, isEqual);

const CaptureImageComponent = ({
  onClose,
  onNext,
  // waitToNext,
  type = '1-sided',
}: CaptureImageProps) => {
  // state
  const isFocused = useIsFocused();
  const camera = useRef<RNCamera>(null);
  const [uriImage, setUriImage] = useState<Array<string | undefined>>([]);
  const [isFlash, setIsFlash] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const inset = useSafeAreaInsets();
  const [isVisible, setIsVisible] = useState(false);

  // function
  const onCapture = useCallback(() => {
    if (!uriImage[currentIndex]) {
      camera?.current?.takePictureAsync({ orientation: 'auto' }).then(res => {
        setUriImage(e => e.concat([res.uri]));
      });
    }
  }, [currentIndex, uriImage]);

  const onFlash = useCallback(() => {
    if (!uriImage[currentIndex]) {
      setIsFlash(v => !v);
    }
  }, [currentIndex, uriImage]);

  const onRetake = useCallback(() => {
    const _uriImage = [...uriImage];
    _uriImage.splice(currentIndex);
    setUriImage(_uriImage);
  }, [currentIndex, uriImage]);

  const cropImageSuccess = (uri: string) => {
    const _uriImage = uriImage;
    _uriImage[currentIndex] = uri;
    setUriImage(_uriImage);
    setCurrentIndex(e => e + 1);
    if (type === '2-sided' && currentIndex === 1) {
      onNextScreen();
    }
  };

  const onUsePress = () => {
    takeCropFromImage(cropImageSuccess, uriImage[currentIndex] ?? '');
    // if (!waitToNext) {
    //   setUriImage([]);
    // }
  };

  const onNextScreen = () => {
    if (onCheckType(onNext, 'function')) {
      setIsFlash(false);
      setCurrentIndex(0);
      onNext(uriImage as Array<string>);
      setUriImage([]);
    }
  };

  const showPopup = () => {
    setIsVisible(true);
  };

  const closePopup = () => {
    setIsVisible(false);
  };

  const onCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      execFunc(onClose);
    }, 300);
  };

  // render
  return (
    <Block block>
      {uriImage[currentIndex] !== undefined && (
        <Block
          zIndex={1}
          paddingHorizontal={20}
          justifyContent={'space-between'}
          direction={'row'}
          height={HEIGHT_DIVIDER}
          middle
          colorTheme={'background'}
        >
          <Button onPress={onRetake}>
            <Text
              text="Retake"
              preset={'notoSanBody2Regular'}
              colorTheme={'white'}
            />
          </Button>
          <Button onPress={onUsePress}>
            <Text
              text="Use photo"
              preset={'notoSanBody2Regular'}
              colorTheme={'primary4'}
            />
          </Button>
        </Block>
      )}
      {uriImage[currentIndex] === undefined && (
        <Block
          paddingHorizontal={20}
          justifyContent={'space-between'}
          direction={'row'}
          zIndex={2}
          height={HEIGHT_DIVIDER}
          colorTheme={'background'}
        >
          <Block justifyContent={'center'} height={HEIGHT_DIVIDER}>
            <Button onPress={uriImage.length > 0 ? showPopup : onClose}>
              <Text
                text="Cancel"
                preset={'notoSanBody2Regular'}
                colorTheme={'white'}
              />
            </Button>
          </Block>
          <Block justifyContent={'center'} height={HEIGHT_DIVIDER}>
            <Button onPress={onFlash}>
              <Icon
                icon={isFlash ? 'flash' : 'flash_disable'}
                colorTheme={'white'}
              />
            </Button>
          </Block>
        </Block>
      )}
      {uriImage[currentIndex] !== undefined ? (
        <PreviewImage uri={uriImage[currentIndex] ?? ''} />
      ) : null}
      <Block block>
        {isFocused && uriImage[currentIndex] === undefined && (
          <RNCamera
            ref={camera}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode[isFlash ? 'on' : 'off']}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            autoFocus={'on'}
            captureAudio={false}
          />
        )}
        {currentIndex === MAX_NFT_MINT && (
          <Block
            colorTheme="transparentGrey"
            position="absolute"
            bottom={inset.bottom + 195}
            marginHorizontal={sizeScale(16)}
            paddingHorizontal={sizeScale(30)}
            paddingVertical={sizeScale(16)}
            borderRadius={8}
          >
            <Text
              textAlign="center"
              colorTheme="white"
              preset="notoSanBody2Regular"
              text="You have reached the Scan limitation. Please click Next to Mint NFTs or to delete unnecessary images"
            />
          </Block>
        )}

        {uriImage[currentIndex] === undefined && (
          <CaptureButton
            onCapture={onCapture}
            onNext={onNextScreen}
            amount={
              type === '1-sided' && uriImage.length > 0 ? uriImage.length : 0
            }
          />
        )}
        {type === '2-sided' && (
          <Block
            position="absolute"
            height={'100%'}
            width={'100%'}
            middle
            justifyContent="center"
          >
            <Block
              borderRadius={40}
              colorTheme="transparentGrey"
              paddingHorizontal={sizeScale(45)}
              paddingVertical={sizeScale(10)}
            >
              <Text
                colorTheme="white"
                preset="notoSanBody2Regular"
                text={currentIndex === 0 ? 'Front' : 'Back'}
              />
            </Block>
          </Block>
        )}
      </Block>
      <BottomSheet
        isVisible={isVisible}
        title={'Discard Photo(s)?'}
        description={
          'You will lose all your scanned images. Do you want to proceed?'
        }
        onClose={closePopup}
        onPressCancel={closePopup}
        onBackdropPress={closePopup}
        onPressSubmit={onCancel}
        buttonCancelText={'Cancel'}
        buttonSubmitText={'Yes'}
      />
    </Block>
  );
};

export const CaptureImage = memo((props: CaptureImageProps) => {
  //state
  const [status] = useCameraPermission();

  //render
  if (status && status !== RESULTS.GRANTED) {
    return <UnAuthorizedCamera onClose={props.onClose} />;
  }

  return <CaptureImageComponent {...props} />;
}, isEqual);
