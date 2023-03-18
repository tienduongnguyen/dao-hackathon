/* eslint-disable import/extensions */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Linking, Permission, Platform, TouchableOpacity } from 'react-native';

import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import QRCode from 'react-native-qrcode-svg';

import { FastImg, ScreenComponent, WText } from '@components-old';
import { useIsFocused } from '@react-navigation/native';
import R from '@src/assets/R';
import { showErrorToast, sizeScale } from '@src/common';
import WView from '@src/components/WView';
import { dimension } from '@src/constants';
import { Block, Button, NftBottom } from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { useReducer } from '@src/redux';
import { checkValidAddress } from '@src/services';
import { callAPIHook, pickFromLib, showMessages } from '@src/utils';
import RNQRGenerator from 'rn-qr-generator';

import { useMainStyle } from './style';
import { ScanDataType } from './type';

import { isJson } from '../../common/method/index';

let isProcessing = false;

const QrCodeScreen = () => {
  //state
  const addressReducer = useReducer(x => x.Wallet);
  const address = useMemo(
    () => addressReducer.data[addressReducer.select],
    [addressReducer.data, addressReducer.select],
  );
  const networkType = useReducer(x => x.App.networkType);
  const [isGrantCameraPermission, setIsGrantCameraPermission] = useState(true);
  const isFocus = useIsFocused();
  const nftBottomRef = useRef<NftBottom>();

  const handleSubmitPermission = () => {
    openSettings().then(() => {
      nftBottomRef.current?.hide();
    });
  };

  const logoSource = useMemo(() => {
    switch (networkType) {
      case 'sol':
        return require('@src/assets/image/source/solana.png');

      case 'bsc':
        return require('@src/assets/image/source/bsc.png');

      case 'polygon':
        return require('@src/assets/image/source/polygon.png');

      default:
        return require('@src/assets/image/source/solana.png');
    }
  }, [networkType]);

  //func
  const { styles } = useMainStyle();

  const handleCheckValidAddress = useCallback(
    (scanData: ScanDataType) => {
      if (scanData.address === address) {
        return showMessages('', "You can't send NFT(s) to yourself", () => {
          isProcessing = false;
        });
      }

      callAPIHook({
        API: checkValidAddress,
        payload: {
          address: scanData.address,
        },
        headers: {
          'network-type': scanData.networkType,
        },
        onSuccess: res => {
          if (res.data) {
            navigate(AUTHORIZE_STACK.SELECT_NFT, {
              address: scanData.address,
              networkType: scanData.networkType,
            });
          } else {
            showErrorToast('Invalid QR code. Please try again');
            isProcessing = false;
          }
        },
        onFinaly: () => {
          isProcessing = false;
        },
      });
    },

    [address],
  );

  const onSuccess = (e: BarCodeReadEvent) => {
    if (!isProcessing) {
      isProcessing = true;
      if (isJson(e.data)) {
        handleCheckValidAddress(JSON.parse(e.data));
      } else {
        showErrorToast(
          'Invalid QR code. Please try again',
          undefined,
          undefined,
          () => {
            isProcessing = false;
          },
        );
      }
    }
  };

  const closePopup = () => {
    setIsGrantCameraPermission(true);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      const isGrantCamera = await check(PERMISSIONS.IOS.CAMERA);
      setIsGrantCameraPermission(isGrantCamera === RESULTS.GRANTED);
      if (isGrantCamera !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.IOS.CAMERA);

        if (isGrant !== RESULTS.GRANTED) {
          Linking.openSettings();
          setIsGrantCameraPermission(false);
        }
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantCameraPermission(true);
        }
      }
    } else {
      const isGrantCamera = await check(PERMISSIONS.ANDROID.CAMERA);

      setIsGrantCameraPermission(isGrantCamera === RESULTS.GRANTED);
      if (isGrantCamera !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.ANDROID.CAMERA);

        if (isGrant !== RESULTS.GRANTED) {
          Linking.openSettings();
          setIsGrantCameraPermission(false);
        }
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantCameraPermission(true);
        }
        if (isGrant === RESULTS.BLOCKED) {
          Linking.openSettings();
        }
      }
    }
  };

  const checkCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      const isGrantCamera = await check(PERMISSIONS.IOS.CAMERA);
      setIsGrantCameraPermission(isGrantCamera === RESULTS.GRANTED);
      if (isGrantCamera !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.IOS.CAMERA);
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantCameraPermission(true);
        } else {
          setIsGrantCameraPermission(false);
        }
      }
    } else {
      const isGrantCamera = await check(PERMISSIONS.ANDROID.CAMERA);
      setIsGrantCameraPermission(isGrantCamera === RESULTS.GRANTED);
      if (isGrantCamera !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.ANDROID.CAMERA);

        if (isGrant === RESULTS.GRANTED) {
          setIsGrantCameraPermission(true);
        } else {
          setIsGrantCameraPermission(false);
        }
      }
    }
  };

  const onPressMyQrCode = () => {
    navigate(AUTHORIZE_STACK.DEPOSIT, { logo: logoSource });
  };

  const handleScanImage = useCallback(() => {
    pickFromLib(
      (uri: string) => {
        RNQRGenerator.detect({
          uri,
        })
          .then(response => {
            const { values } = response;
            if (values?.[0] && isJson(values[0])) {
              if (!isProcessing) {
                isProcessing = true;
              }

              handleCheckValidAddress(JSON.parse(values[0]) as ScanDataType);
            } else {
              showErrorToast('Invalid QR code. Please try again');
            }
          })
          .catch(error => console.log('Cannot detect QR code in image', error));
      },
      'photo',
      1,
      true,
    );
  }, [handleCheckValidAddress]);

  const onCheckPermission = useCallback(async () => {
    const result = await request(
      Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      }) as Permission,
    );

    if (result === RESULTS.GRANTED) {
      handleScanImage();
    } else {
      nftBottomRef.current?.show(true);
    }
  }, [handleScanImage]);

  const handleClosePermission = () => {
    nftBottomRef.current?.hide();
  };

  // effect
  useEffect(() => {
    if (isFocus) {
      checkCameraPermission();
    }
    return () => {
      isProcessing = false;
    };
  }, [isFocus]);

  //render
  return (
    <>
      <NftBottom
        ref={nftBottomRef}
        onClose={handleClosePermission}
        onPressCancel={handleClosePermission}
        onPressSubmit={handleSubmitPermission}
      />
      <ScreenComponent
        titleHeader={'QR Code'}
        children={
          <>
            {!!isFocus && (
              <RNCamera
                captureAudio={false}
                onBarCodeRead={onSuccess}
                style={styles.qrCam}
                children={
                  <>
                    <FastImg
                      resizeMode="cover"
                      style={styles.qrImage}
                      source={R.images.img_bg_frame}
                    />
                    <TouchableOpacity
                      onPress={onPressMyQrCode}
                      style={styles.qrButton}
                    >
                      <WView
                        flexDirection="row"
                        justifyContent="center"
                        marginBottom={10}
                      >
                        <WText children={'My QR code'} />
                        <FastImg
                          style={styles.qrImage1}
                          source={R.images.ic_arrow_up}
                        />
                      </WView>
                      <WView style={styles.qrBox}>
                        <QRCode
                          value={JSON.stringify({ address, networkType })}
                          logo={logoSource}
                          logoSize={60}
                          logoMargin={10}
                          logoBorderRadius={40}
                          logoBackgroundColor={'white'}
                          size={dimension.width * 0.65}
                        />
                      </WView>
                    </TouchableOpacity>
                  </>
                }
              />
            )}

            <BottomSheet
              isVisible={!isGrantCameraPermission}
              title={'Request access'}
              description={
                'Mesme needs permission to use your camera. This allows you to take a photo or scan name cards.'
              }
              onClose={closePopup}
              onPressCancel={closePopup}
              onPressSubmit={requestCameraPermission}
              buttonCancelText={'No'}
              buttonSubmitText={'Allow'}
            />
          </>
        }
        rightComponent={
          <Button onPress={onCheckPermission}>
            <Block
              width={sizeScale(65)}
              alignSelf={'center'}
              alignItems={'center'}
            >
              <WText
                children={'Album'}
                color={'#685A78'}
                style={{
                  fontSize: sizeScale(20),
                }}
              />
            </Block>
          </Button>
        }
      />
    </>
  );
};

export default QrCodeScreen;
