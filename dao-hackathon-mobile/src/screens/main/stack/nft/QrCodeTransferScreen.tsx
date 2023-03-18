import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Linking, Permission, Platform } from 'react-native';

import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

import { FastImg, ScreenComponent, WText } from '@components-old';
import R from '@src/assets/R';
import { isJson, showErrorToast, sizeScale } from '@src/common';
import { Block, Button, NftBottom } from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { useReducer } from '@src/redux';
import { checkValidAddress } from '@src/services';
import { callAPIHook, pickFromLib, showMessages } from '@src/utils';
import RNQRGenerator from 'rn-qr-generator';

import { ScanDataType } from '../../type';
import { useStackStyle } from '../style';

const QrCodeTransferScreen = (props: any) => {
  //state
  const { callback, item } = props.route.params;
  const [isGrantCameraPermission, setIsGrantCameraPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const addressReducer = useReducer(x => x.Wallet);
  const address = useMemo(
    () => addressReducer.data[addressReducer.select],
    [addressReducer.data, addressReducer.select],
  );
  const nftBottomRef = useRef<NftBottom>();
  const { styles } = useStackStyle();

  //func
  const handleSubmitPermission = () => {
    openSettings().then(() => {
      nftBottomRef.current?.hide();
    });
  };

  const handleClosePermission = () => {
    nftBottomRef.current?.hide();
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
  useEffect(() => {
    checkCameraPermission();
  }, []);

  const closePopup = () => {
    setIsGrantCameraPermission(true);
  };

  const onSuccess = (e: BarCodeReadEvent) => {
    if (!isProcessing) {
      setIsProcessing(true);
      if (isJson(e.data)) {
        handleCheckValidAddress(JSON.parse(e.data));
      } else {
        showErrorToast(
          'Invalid QR code. Please try again',
          undefined,
          undefined,
          () => {
            setIsProcessing(false);
          },
        );
      }
    }
  };

  const handleCheckValidAddress = useCallback(
    (scanData: ScanDataType) => {
      if (scanData.address === address) {
        return showMessages('', "You can't send NFT(s) to yourself", () => {
          setIsProcessing(false);
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
          if (res.data && callback) {
            callback(scanData.address, scanData.networkType);
            navigate(AUTHORIZE_STACK.TRANSFER, {
              item,
            });
          } else {
            showErrorToast('Invalid QR code. Please try again');
            setIsProcessing(false);
          }
        },
        onFinaly: () => {
          setIsProcessing(false);
        },
      });
    },

    [address, callback, item],
  );

  const handleScanImage = useCallback(() => {
    pickFromLib(
      (uri: string) => {
        RNQRGenerator.detect({
          uri,
        })
          .then(response => {
            const { values } = response;
            if (values?.[0]) {
              if (isJson(values[0])) {
                handleCheckValidAddress(JSON.parse(values[0]));
              } else {
                showErrorToast(
                  'Invalid QR code. Please try again',
                  undefined,
                  undefined,
                  () => {
                    setIsProcessing(false);
                  },
                );
              }
            } else {
              showErrorToast(
                'Invalid QR code. Please try again',
                undefined,
                undefined,
                () => {
                  setIsProcessing(false);
                },
              );
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

  // render
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
        back
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
        children={
          <>
            {!!isGrantCameraPermission && (
              <RNCamera
                captureAudio={false}
                onBarCodeRead={onSuccess}
                style={styles.qrCodeCamera}
                children={
                  <>
                    <FastImg
                      resizeMode="cover"
                      style={styles.qrCodeImage}
                      source={R.images.img_bg_frame}
                    />
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
      />
    </>
  );
};

export default QrCodeTransferScreen;
