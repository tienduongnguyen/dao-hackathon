/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardEvent,
  KeyboardEventName,
  Platform,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import { FastImg, LoadingProgress, WInput, WText } from '@components-old';
import R from '@src/assets/R';
import {
  DEFAULT_PER_PAGE,
  hideAddress,
  isIos,
  NETWORK_SELECTION,
  NetworkType,
} from '@src/common';
import useDebounce from '@src/common/hooks';
import {
  Block,
  Button,
  Divider,
  HeaderAuthentication,
  Icon,
  Screen,
  SelectionBottomSheet,
  Spacer,
  Text,
  TwoColorText,
} from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { OptionBottomSheet } from '@src/library/components/option-bottom-sheet';
import { Option } from '@src/library/components/selection-bottom-sheet/type';
import { goBack, navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, useReducer } from '@src/redux';
import {
  checkValidAddress,
  getEstimateFeeTransfer,
  getTransferTransaction,
  transfer,
} from '@src/services';
import { ColorDefault } from '@src/themes/color';
import { callAPIHook, Database, showMessages } from '@src/utils';

import ItemSelectAddress from '../../components/ItemSelectAddress';
import { useMainStyle } from '../../style';
import { handleGetNotification } from '../../tab-feed/notifications/actions';

export type ScrollViewRef = ScrollView & {
  scrollTo: () => void;
};

const TransferScreen = (props: any) => {
  // state
  const { styles, colors } = useMainStyle();
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const item = props?.route.params.item;
  const { mint } = item;
  const { uri: jsonUri } = item.data;
  const { image, properties } = item.metadata;
  const addressReducer = useReducer(x => x.Wallet);
  const [toAddress, setToAddress] = useState('');
  const [walletName, setWalletName] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const [isSelect, setIsSelect] = useState(false);
  const [isShowPopupFee, setIsShowPopupFee] = useState(false);
  const address = addressReducer.data[addressReducer.select];
  const { balance } = addressReducer;
  const [fee, setFee] = useState(0);
  const networkType = useReducer(x => x.App.networkType);
  const isValid = useMemo(() => !isError && !!toAddress, [isError, toAddress]);
  const selectionRef = useRef<SelectionBottomSheet>();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('polygon');

  const listAddressSelect = useMemo(
    () =>
      addressReducer.data
        .map((data: any, index: number) => ({
          address: data,
          name: addressReducer.dataName[index],
          network: addressReducer.dataNetwork[index],
        }))
        .filter(i => i.network === selectedNetwork || selectedNetwork === ''),
    [
      addressReducer.data,
      addressReducer.dataName,
      addressReducer.dataNetwork,
      selectedNetwork,
    ],
  );
  const selectData = useMemo(
    () =>
      NETWORK_SELECTION.map(
        item =>
          ({
            ...item,
            label: item.network === 'sol' ? 'Solana' : item.label,
            callback: () => {
              setSelectedNetwork(item.network);
              selectionRef.current?.hide();
            },
          } as Option),
      ),
    [],
  );
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const refScroll = useRef<ScrollViewRef>();

  // func
  const checkAddress = async () => {
    callAPIHook({
      API: checkValidAddress,
      payload: {
        address: toAddress.trim(),
      },
      headers: {
        'network-type': selectedNetwork,
      },
      onSuccess: res => {
        if (!res?.data) {
          setIsError('Please input a valid address');
        } else {
          setIsError('');
        }
      },
    });
  };

  const getDataTransfer = () => {
    callAPIHook({
      API: getTransferTransaction,
      payload: {
        address,
        offset: 0,
      },
      onSuccess: res => {
        if (res?.data) {
          actions(ACTION.SET_HISTORY_TRANSFER)({
            data: res.data,
            firstPage: true,
          });
          if (res.data.length < DEFAULT_PER_PAGE) {
            actions(ACTION.SET_TRANSFER_LOAD_MORE)(false);
          } else {
            actions(ACTION.SET_PAGE_TRANSFER)(true);
            actions(ACTION.SET_TRANSFER_LOAD_MORE)(true);
          }
        }
      },
    });
  };

  const transferNFT = async () => {
    if (balance < fee) {
      return showMessages(
        '',
        'Cannot Transfer NFT. Your balance is not enough to pay for the transaction.',
      );
    }
    const privateKey = await Database.getPrivateKey(address);
    callAPIHook({
      API: transfer,
      payload: {
        privateKey,
        address,
        toAddress: toAddress.trim(),
        tokenAddress: networkType === 'sol' ? [mint] : [jsonUri],
        uri: [`${jsonUri}`],
        walletName,
      },
      setLoading: setLoading,
      onSuccess: res => {
        if (res) {
          getDataTransfer();
          handleGetNotification(0, true);
          navigate(AUTHORIZE_STACK.SUCCESS, {
            type: 'transfer',
          });
        }
      },
    });
  };

  const getFee = useCallback(async () => {
    const privateKey = await Database.getPrivateKey(address);

    callAPIHook({
      API: getEstimateFeeTransfer,
      payload: {
        privateKey,
        toAddress: toAddress.trim(),
        tokenAddress: [jsonUri],
      },
      headers: {
        'network-type': selectedNetwork,
      },
      setLoading: setLoading,
      onSuccess: res => {
        if (res?.data) {
          setFee(res.data);
        }
      },
    });
  }, [address, jsonUri, toAddress, selectedNetwork]);

  const onPressSelectAddress = (
    addressName: string,
    name: string,
    networkType: NetworkType,
  ) => {
    setSelectedNetwork(networkType);
    setWalletName(name);
    setToAddress(addressName);
    setIsSelect(true);
  };

  const onPressQRCode = () => {
    navigate(AUTHORIZE_STACK.QR_CODE_TRANSFER, {
      callback: (value: string, networkType: string) => {
        setToAddress(value);
        setSelectedNetwork(networkType);
      },
      item,
    });
  };

  const onChangeTextAddress = (text: string) => {
    setToAddress(text);
  };

  const ItemListAddress = (listProps: any) => {
    return <ItemSelectAddress {...listProps} onPress={onPressSelectAddress} />;
  };

  const onPressClosePopupFee = () => {
    setIsShowPopupFee(false);
  };

  const onPressShowPopupFee = () => {
    Keyboard.dismiss();
    setIsShowPopupFee(true);
  };

  const onCloseSelect = () => {
    setIsSelect(false);
    setToAddress('');
    setWalletName('');
    setSelectedNetwork('');
  };

  const onSubmitTransfer = () => {
    onPressClosePopupFee();
    transferNFT();
  };

  const onPressSelect = useCallback(() => {
    selectionRef.current?.show(selectData);
  }, [selectData]);

  const onKeyboardShow = useCallback((e: KeyboardEvent) => {
    if (isIos) {
      setIsKeyboardShow(true);
      setTimeout(() => {
        if (refScroll.current?.scrollTo) {
          refScroll.current?.scrollTo({
            y: SCREEN_HEIGHT - e.endCoordinates.height,
            animated: true,
          });
        }
      }, 200);
    }
  }, []);

  const onKeyboardHide = useCallback(() => {
    // keyboardHeight.value = sharedTiming(insets.bottom);
    if (isIos) {
      setIsKeyboardShow(false);
    }
  }, []);

  //effect
  useDebounce(
    () => {
      if (address !== toAddress) {
        setToAddress(toAddress.trim());
        checkAddress();
        getFee();
      }
    },
    500,
    [toAddress, address],
  );

  useEffect(() => {
    Keyboard.addListener(
      Platform.select({
        android: 'keyboardDidShow',
        ios: 'keyboardWillShow',
      }) as KeyboardEventName,
      onKeyboardShow,
    );
  }, []);

  useEffect(() => {
    Keyboard.addListener(
      Platform.select({
        android: 'keyboardDidHide',
        ios: 'keyboardWillHide',
      }) as KeyboardEventName,
      onKeyboardHide,
    );
  }, []);

  useEffect(() => {
    return () => {
      if (isIos) {
        Keyboard.removeAllListeners('keyboardDidShow');
        Keyboard.removeAllListeners('keyboardDidHide');
      }
    };
  }, []);

  useEffect(() => {
    if (address === toAddress) {
      setIsError("You can't send NFT(s) to yourself");
    }
  }, [address, toAddress]);

  useEffect(() => {
    getFee();
  }, []);
  const inputRef = useRef(null);

  //render
  return (
    <Screen statusBarStyle="light-content">
      {isLoading && <LoadingProgress />}
      <HeaderAuthentication txTitle="Transfer" onPress={goBack} />
      <Spacer height={13} />
      <Block block paddingHorizontal={16}>
        <ScrollView
          ref={refScroll as any}
          contentContainerStyle={[
            styles.transferScroll,
            isKeyboardShow && { paddingBottom: 100 },
          ]}
        >
          {properties.files.length === 2 ? (
            <>
              <TouchableOpacity>
                <Block
                  zIndex={1}
                  top={8}
                  left={8}
                  width={46}
                  height={20}
                  borderRadius={5}
                  middle
                  justifyContent="center"
                  position="absolute"
                  color={ColorDefault.frontColor}
                >
                  <Text
                    text={'Front'}
                    preset="notoSanBody3Regular"
                    colorTheme="text1"
                  />
                </Block>
                <FastImg
                  style={styles.transferImage1}
                  resizeMode="contain"
                  source={{ uri: properties.files[0].uri }}
                />
              </TouchableOpacity>

              <Spacer height={20} />
              <TouchableOpacity>
                <Block
                  zIndex={1}
                  top={8}
                  left={8}
                  width={46}
                  height={20}
                  borderRadius={5}
                  middle
                  justifyContent="center"
                  position="absolute"
                  color={ColorDefault.backColor}
                >
                  <Text
                    text={'Back'}
                    preset="notoSanBody3Regular"
                    colorTheme="text1"
                  />
                </Block>
                <FastImg
                  style={styles.transferImage1}
                  resizeMode="contain"
                  source={{ uri: properties.files[1].uri }}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <FastImg
                style={styles.transferImage1}
                resizeMode="contain"
                source={{ uri: image }}
              />
            </>
          )}

          <Spacer height={20} />
          {/* <OptionBottomSheet
            onPress={onPressSelect}
            selected={selectedNetwork}
          /> */}
          <Spacer height={24} />
          {walletName && isSelect ? (
            <Block
              middle
              paddingHorizontal={12}
              justifyContent="center"
              height={68}
              borderWidth={1}
              colorTheme="sub_menu"
              borderColorTheme="primary6"
              direction="row"
            >
              <Block>
                <Text
                  text={walletName}
                  preset="notoSanBody1Regular"
                  colorTheme="text4"
                />
                <Text
                  text={`(${hideAddress(toAddress)})`}
                  preset="notoSanBody1Regular"
                  colorTheme="text2"
                />
              </Block>
              <Block marginRight={19} block alignItems="flex-end">
                <Icon
                  icon="close"
                  size={24}
                  colorTheme="white"
                  onPress={onCloseSelect}
                />
              </Block>
            </Block>
          ) : (
            <WInput
              refInput={inputRef}
              containerStyle={styles.transferInput}
              maxLength={256}
              onFocus={() => {}}
              errorMessage={isError}
              isError={!!isError}
              editable={!!selectedNetwork}
              value={toAddress}
              onChangeText={onChangeTextAddress}
              placeholder="Enter recipient address"
              child={
                <TouchableOpacity onPress={onPressQRCode}>
                  <FastImg
                    tintColor={colors.white}
                    style={styles.transferImage2}
                    source={R.images.ic_qr_code}
                  />
                </TouchableOpacity>
              }
            />
          )}
          <Spacer height={16} />
          {/* <Text
            text="Select the destination address"
            preset="notoSanBold14"
            colorTheme="text1"
          />
          <Spacer height={5} />
          <Divider colorTheme="primary6" />
          {listAddressSelect.filter(e => e.address !== address).length === 0 ? (
            <Block alignSelf="center">
              <FastImg
                style={styles.transferImage}
                source={R.images.ic_empty}
              />
              <WText
                color={colors.primary7}
                children={'Oops! There is nothing here.'}
              />
            </Block>
          ) : (
            listAddressSelect
              .filter(e => e.address !== address)
              .map((propsItem, index) => (
                <React.Fragment key={index.toString()}>
                  <ItemListAddress
                    names={listAddressSelect
                      .filter(e => e.address !== address)
                      .map(e => e.name)}
                    index={index}
                    item={propsItem.address}
                    network={propsItem.network}
                  />
                </React.Fragment>
              ))
          )} */}
        </ScrollView>
        <Block justifyContent="flex-end" paddingVertical={20}>
          <Button
            disabled={!isValid}
            onPress={onPressShowPopupFee}
            text={'Transfer'}
            textColorTheme="white"
            gradient={colors.gradient}
            preset="primary"
            typePreset="medium"
          />
        </Block>
      </Block>
      <BottomSheet
        isVisible={isShowPopupFee}
        title={'Confirm and Pay'}
        description={TwoColorText({
          firstText: 'You will need to pay ',
          fee: `${fee} ${
            'MES'
            // networkType === 'bsc' ? 'BNB' : networkType.toUpperCase()
          }`,
          lastText: ' to accomplish the transaction. Do you want to proceed?',
        })}
        onClose={onPressClosePopupFee}
        onPressCancel={onPressClosePopupFee}
        onPressSubmit={onSubmitTransfer}
        buttonCancelText={'Cancel'}
        buttonSubmitText={'Yes'}
      />
      <SelectionBottomSheet ref={selectionRef} />
    </Screen>
  );
};

export default TransferScreen;
