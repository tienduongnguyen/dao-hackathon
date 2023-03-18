/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Toast from 'react-native-toast-message';

import { ScreenComponent, WButtonText, WText } from '@components-old';
import Clipboard from '@react-native-clipboard/clipboard';
import { VectorIcon } from '@src/assets/vector-icon/vector-icon';
import { parseBalance, useDidMount } from '@src/common';
import WView from '@src/components/WView';
import { Block, Button, TextField } from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { goBack } from '@src/navigation/navigation-service';
import { ACTION, actions, useReducer } from '@src/redux';
import { getBalance } from '@src/services';
import { callAPIHook, Database } from '@src/utils';
import axios from 'axios';

import { ModalInput } from '../../components/modal-input';
import { useStackStyle } from '../style';

const AddressDetailScreen = (props: any) => {
  //state
  const { address, walletName, network } = props.route.params;
  const addressReducer = useReducer(x => x.Wallet);
  const walletAddress = addressReducer.data[addressReducer.select];
  const [price, setPrice] = useState('');
  const [balance, setBalance] = useState(0);
  const { styles, colors } = useStackStyle();
  const [isShowPopupRemoveWallet, setIsShowPopupRemoveWallet] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [newName, setNewName] = useState(walletName);
  const inputRef = useRef<ModalInput>();

  //func
  const isValid = password !== '';
  const getPriceUSDT = useCallback((value: number) => {
    axios({
      method: 'GET',
      url:
        network === 'sol'
          ? 'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT'
          : 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT',
      headers: {
        accept: 'application/json',
      },
    })
      .then(res => {
        setPrice(
          `${(
            parseFloat(res.data.price) * parseBalance(value, network)
          ).toFixed(5)}`,
        );
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const onSubmitPassword = async () => {
    if (await Database.checkPassword(password)) {
      setIsAuth(true);
    } else {
      setIsError(true);
    }
  };

  const getPrivateKey = useCallback(async () => {
    const pk = await Database.getPrivateKey(address);
    setPrivateKey(pk || '');
  }, [address]);

  const callGetBalanceAPI = useCallback(() => {
    callAPIHook({
      API: getBalance,
      setLoading: setLoading,
      payload: { address },
      headers: {
        'network-type': network,
      },
      onSuccess: res => {
        setBalance(res.data);
        getPriceUSDT(res.data);
      },
    });
  }, [address]);
  const onPressShowPopupPrivateKey = async () => {
    inputRef.current?.show();
  };

  const onPressClosePopupPrivateKey = () => {
    setIsAuth(false);
    setIsError(false);
    setPassword('');
    setPrivateKey('');
  };

  const onPressShowPopupRemoveWallet = async () => {
    setIsShowPopupRemoveWallet(true);
  };
  const onPressClosePopupRemoveWallet = () => {
    setIsShowPopupRemoveWallet(false);
  };
  const onPressRemoveWallet = async () => {
    try {
      setIsShowPopupRemoveWallet(false);
      goBack();
      await Database.clearPrivateKey(address);
      actions(ACTION.GET_ADDRESS)();
      Toast.show({
        type: 'info',
        text1: 'Clear wallet',
        text2: address,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
        text2: address,
      });
    }
  };

  const onPressSelectWallet = async () => {
    await Database.setSelectAddress(address, network);
    actions(ACTION.CANCEL)();
    setTimeout(() => {
      const index = addressReducer.data.indexOf(address);
      actions(ACTION.SELECT_ADDRESS)(index);
      actions(ACTION.SET_CURRENT_RECEIVE)(0);
      goBack();
    }, 300);
  };

  const onEdit = () => {
    setIsEdit(v => !v);
  };

  const onChangeTextWalletName = (text: string) => {
    setNewName(text);
  };

  const onSubmit = async () => {
    const newAddressName = newName.trim();

    if (newName === walletName || newAddressName === '') {
      setIsEdit(false);
      setNewName(walletName);
      return;
    }
    setLoading(true);
    await Database.renameWallet(address, newAddressName);
    actions(ACTION.GET_ADDRESS)();
    await Database.getAllAddress();
    setIsEdit(false);
    setLoading(false);
    setNewName(newAddressName);
  };

  const needDisableClearWallet = walletAddress?.trim() === address?.trim();

  //effect
  useEffect(() => {
    if (isAuth) {
      getPrivateKey();
    }
  }, [isAuth]);

  useDidMount(() => {
    callGetBalanceAPI();
  });

  const onChangeText = (text: string) => {
    setPassword(text);
    setIsError(false);
  };

  return (
    <ScreenComponent
      back
      isLoading={isLoading}
      rightComponent={<></>}
      titleHeader={walletName}
      children={
        <Block justifyContent="space-between" block>
          <WView
            alignItems="center"
            marginTop={20}
            marginHorizontal={15}
            paddingVertical={30}
            borderWidth={1}
            borderColor={colors.primary6}
            backgroundColor={colors.primary3}
          >
            <Block direction="row" middle>
              {isEdit ? (
                <React.Fragment>
                  <TextField
                    autoFocus={true}
                    defaultValue={walletName}
                    value={newName}
                    onChangeText={onChangeTextWalletName}
                    typeInput="outline"
                    containerStyle={styles.containerInput}
                    inputStyle={styles.inputStyle}
                    unActiveTintBorderColor={colors.primary6}
                    maxLength={50}
                  />
                  <Button onPress={onSubmit} style={styles.confirmBtn}>
                    <VectorIcon icon="bx_check" size={24} colorTheme="white" />
                  </Button>
                </React.Fragment>
              ) : (
                <WText
                  font="regular14"
                  color={colors.primary4}
                  style={styles.addressDetailText3}
                  children={newName}
                />
              )}
              {!isEdit && (
                <Button onPress={onEdit}>
                  <VectorIcon icon="bx_edit_alt" size={24} colorTheme="white" />
                </Button>
              )}
            </Block>
            <WText
              onPress={() => {
                Clipboard.setString(address);
                Toast.show({
                  text1: 'Copied 🥳',
                  text2: address,
                });
              }}
              color={colors.primary7}
              style={styles.addressDetailText4}
              font="regular14"
              children={`(${address})`}
            />
            <WText
              font="bold36"
              children={`${parseFloat(
                `${parseBalance(balance, network)}`,
              ).toFixed(5)} ${
                network === 'bsc' ? 'BNB' : network.toUpperCase()
              }`}
            />
            <WText
              color={colors.text_money}
              style={styles.addressDetailText4}
              font="regular14"
              children={`≈ ${parseFloat(price)} USDT`}
            />
          </WView>
          <Block>
            <Block paddingHorizontal={16} paddingVertical={8}>
              <Button
                onPress={onPressSelectWallet}
                text={'Use this wallet'}
                preset={'outline'}
                gradient={colors.gradient}
                typePreset={'medium'}
                textColorTheme={'white'}
              />
            </Block>

            <WButtonText
              onPress={onPressShowPopupPrivateKey}
              style={styles.addressButtonText4}
              TextProps={{
                children: 'Export private key',
              }}
            />
            <WButtonText
              onPress={onPressShowPopupRemoveWallet}
              style={
                needDisableClearWallet
                  ? styles.addressButtonDisable
                  : styles.addressButtonText4
              }
              disabled={needDisableClearWallet}
              TextProps={{
                children: 'Clear wallet',
                color: needDisableClearWallet ? colors.border : colors.white,
              }}
            />
          </Block>
          <BottomSheet
            isVisible={isShowPopupRemoveWallet}
            title={'Clear wallet?'}
            description={`Are you sure you want to clear ${walletName}?`}
            onClose={onPressClosePopupRemoveWallet}
            onPressCancel={onPressClosePopupRemoveWallet}
            onPressSubmit={onPressRemoveWallet}
            buttonCancelText={'Cancel'}
            buttonSubmitText={'Clear'}
          />
          <ModalInput
            ref={inputRef}
            onClose={onPressClosePopupPrivateKey}
            onPressSubmit={onSubmitPassword}
            title={'Private key of ' + walletName}
            disabled={!isValid}
            onChangeText={onChangeText}
            password={password}
            isError={isError}
            privateKey={privateKey}
            isAuth={!isAuth}
            address={address}
          />
        </Block>
      }
    />
  );
};

export default AddressDetailScreen;
