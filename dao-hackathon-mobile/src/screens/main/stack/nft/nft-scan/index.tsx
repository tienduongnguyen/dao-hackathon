import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Linking, Platform, TouchableOpacity } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FastImg, ScreenComponent, WInput } from '@components-old';
import { useIsFocused } from '@react-navigation/native';
import R from '@src/assets/R';
import {
  hiddenModalPickImage,
  showModalPickImage,
  sizeScale,
} from '@src/common';
import {
  Block,
  Button,
  NftBottom,
  Spacer,
  TwoColorText,
} from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { SelectAction } from '@src/library/components/select-action';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { useReducer } from '@src/redux';
import {
  getEstimateFeeMint,
  mintAPI,
  uploadImage,
  uploadJson,
} from '@src/services';
import {
  callAPIHook,
  Database,
  lengthInUtf8Bytes,
  showMessages,
  takeFromCamera,
} from '@src/utils';

import { useStackStyle } from '../../style';

const MintNftScanScreen = () => {
  //state
  const [image, setImage] = useState('');
  const [nameCard, setNameCard] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isShowPopupMint, setIsShowPopupMint] = useState(false);
  const [fee, setFee] = useState(0);
  const [maxLengthName, setMaxLengthName] = useState(32);
  const addressReducer = useReducer(x => x.Wallet);
  const { styles, colors } = useStackStyle();
  const isValid = nameCard.trim().length > 0 && image.length > 0;
  const popupSelectStyle = useMemo(() => {
    if (image) {
      return {
        width: '100%',
        height: sizeScale(195),
      };
    }
    return {
      width: sizeScale(25),
      height: sizeScale(25),
    };
  }, [image]);
  const insets = useSafeAreaInsets();
  const [isGrantCameraPermission, setIsGrantCameraPermission] = useState(true);
  const networkType = useReducer(x => x.App.networkType);

  //func
  const selectRef = useRef<SelectAction>();
  const nftBottomRef = useRef<NftBottom>();
  const { balance } = addressReducer;
  const onCallbackSelectImage = (res: any) => {
    // imagePickerCropHelper(res => {
    hiddenModalPickImage();
    closePopupSelectImage();
    setImage(res);
    if (!image) {
      setTimeout(() => {
        if (Platform.OS === 'android') {
          setImage(res + '?key=' + Date.now());
        } else {
          setImage(res);
        }
      }, 100);
    }
    // }, image);
  };

  const getFee = () => {
    callAPIHook({
      API: getEstimateFeeMint,
      setLoading: setLoading,
      onSuccess: res => {
        setFee(res.data);
      },
    });
  };

  useEffect(() => {
    showPopupSelectImage();
    getFee();
  }, []);

  const onPressMintNFT = async () => {
    if (balance < fee) {
      return showMessages(
        '',
        'Cannot Mint NFT. Your balance is not enough to pay for the transaction.',
      );
    }
    closePopupMint();
    const address = addressReducer.data[addressReducer.select];
    const privateKey = await Database.getPrivateKey(address);
    const imgExt = image.split('.').pop();

    const idxEnd = imgExt?.indexOf('?key=');
    const imageExt = idxEnd === -1 ? imgExt : imgExt?.substring(0, idxEnd);

    const imageProcessed = await callAPIHook({
      API: uploadImage,
      setLoading: setLoading,
      formdata: {
        image: {
          name: 'images',
          type: 'image/' + imageExt,
          filename: 'image.png',
          uri: image,
        },
      },
    });
    const imageUri = imageProcessed.data;

    const metadata = [
      {
        name: nameCard,
        symbol: 'MESME',
        description: description,
        edition: '2022',
        external_url: '',
        create_date: Date.now(),
        attributes: [],
        properties: {
          files: [
            {
              uri: imageUri[0],
              type: 'image/png',
            },
          ],
          category: 'image',
          creators: [
            {
              address: address,
              share: 100,
            },
          ],
        },
        image: imageUri[0],
      },
    ];

    const jsonUploaded = await callAPIHook({
      API: uploadJson,
      setLoading: setLoading,
      payload: metadata,
    });
    const jsonUri = jsonUploaded.data;

    callAPIHook({
      API: mintAPI,
      setLoading: setLoading,
      payload: {
        privateKey,
        address,
        uri: jsonUri,
      },
      onSuccess: res => {
        if (res) {
          navigate(AUTHORIZE_STACK.SUCCESS, {
            type: 'mint',
          });
        }
      },
    });
  };

  const closePopupMint = () => {
    setIsShowPopupMint(false);
  };

  const showPopupMint = () => {
    Keyboard.dismiss();
    setIsShowPopupMint(true);
  };

  const closePopupSelectImage = () => {
    selectRef.current?.hide();
  };

  const showPopupSelectImage = () => {
    Keyboard.dismiss();
    selectRef.current?.show();
  };

  const showPermissionPopup = () => {
    selectRef.current?.hide();
    setTimeout(() => {
      nftBottomRef.current?.show(false);
    }, 300);
  };

  const onSelectFromGallery = () => {
    showModalPickImage({
      onHeaderRight: onCallbackSelectImage,
      maxSelect: 1,
      isShowHeader: true,
    });
  };

  const onTakeNewPhoto = () => {
    takeFromCamera(onCallbackSelectImage);
  };

  const allowCameraPermissions = () => {
    nftBottomRef.current?.hide();
    setTimeout(() => {
      requestCameraPermission();
    }, 200);
  };
  const onChangeTextFullName = (text: string) => {
    if (lengthInUtf8Bytes(text) >= 32) {
      setMaxLengthName(text.length > 32 ? 32 : text.length);
    }
    setNameCard(text);
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

  const isFocus = useIsFocused();
  useEffect(() => {
    if (isFocus) {
      checkCameraPermission();
    }
  }, [isFocus]);
  const onClosePermissionPopup = () => {
    nftBottomRef.current?.hide();
    setTimeout(() => {
      selectRef.current?.show();
    }, 300);
  };

  //render
  return (
    <ScreenComponent
      dialogLoading={isLoading}
      back
      titleHeader="Scan"
      children={
        <KeyboardAwareScrollView
          contentContainerStyle={{ flex: 1 }}
          scrollEnabled={false}
        >
          <Block
            block
            style={styles.nftManualScroll}
            justifyContent={'space-between'}
          >
            <Block>
              <TouchableOpacity
                style={styles.nftManualButton}
                onPress={showPopupSelectImage}
              >
                <FastImg
                  resizeMode="contain"
                  style={[popupSelectStyle, styles.nftManualImage]}
                  source={
                    image
                      ? {
                          uri: image,
                          priority: 'high',
                        }
                      : R.images.ic_camera
                  }
                />
              </TouchableOpacity>
              <Spacer height={24} />
              <WInput
                maxLength={maxLengthName}
                value={nameCard}
                containerStyle={styles.nftScanInput}
                placeholder={'Enter your name card *'}
                onChangeText={onChangeTextFullName}
              />
              <WInput
                value={description}
                maxLength={4000}
                containerStyle={styles.nftScanInput}
                note
                placeholder="Description (Optional)"
                onChangeText={setDescription}
              />
            </Block>
            <Block paddingBottom={insets.bottom + sizeScale(16)}>
              <Button
                disabled={!isValid}
                onPress={showPopupMint}
                text={'Next'}
                preset={'outline'}
                gradient={colors.gradient}
                typePreset={'medium'}
                textColorTheme={'white'}
              />
              <BottomSheet
                isVisible={isShowPopupMint}
                title={'Confirm and Pay'}
                description={TwoColorText({
                  firstText: 'You will need to pay ',
                  fee: `${fee} ${
                    networkType === 'bsc' ? 'BNB' : networkType.toUpperCase()
                  }`,
                  lastText:
                    ' to accomplish the transaction. Do you want to proceed?',
                })}
                onClose={closePopupMint}
                onPressCancel={closePopupMint}
                onPressSubmit={onPressMintNFT}
                buttonCancelText={'Cancel'}
                buttonSubmitText={'Yes'}
              />
              <SelectAction
                ref={selectRef}
                option={[
                  {
                    text: 'Select photo from Camera roll',
                    icon: 'gallery',
                    itemCallback: onSelectFromGallery,
                  },
                  {
                    text: 'Take a photo',
                    icon: 'camera',
                    itemCallback: isGrantCameraPermission
                      ? onTakeNewPhoto
                      : showPermissionPopup,
                  },
                ]}
              />
              <NftBottom
                ref={nftBottomRef}
                onClose={onClosePermissionPopup}
                onPressCancel={onClosePermissionPopup}
                onPressSubmit={allowCameraPermissions}
              />
            </Block>
          </Block>
        </KeyboardAwareScrollView>
      }
    />
  );
};

export default MintNftScanScreen;
