import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';

import Toast from 'react-native-toast-message';

import { ScreenComponent, WText } from '@components-old';
import Clipboard from '@react-native-clipboard/clipboard';
import { useIsFocused } from '@react-navigation/native';
import { VectorIcon } from '@src/assets/vector-icon/vector-icon';
import { parseBalance } from '@src/common';
import WView from '@src/components/WView';
import { colors, dimension, WALLET_TAB } from '@src/constants';
import { Block, Button, TextField } from '@src/library/components';
import { ACTION, actions, useReducer } from '@src/redux';
import { Database } from '@src/utils';
import axios from 'axios';

import PageMint from './components/PageMint';
import PageTransfer from './components/PageTransfer';
import SelectButtonWallet from './components/SelectButtonWallet';
import { useMainStyle } from './style';

const WalletScreen = () => {
  //state
  const addressReducer = useReducer(x => x.Wallet);
  const historyReducer = useReducer(x => x.History);
  const networkType = useReducer(x => x.App.networkType);
  const [price, setPrice] = useState('');
  const [tabSelect, setTabSelect] = useState(WALLET_TAB.TRANSFER);
  const [isEdit, setIsEdit] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const address = useMemo(
    () => addressReducer.data[addressReducer.select],
    [addressReducer.data, addressReducer.select],
  );
  const isFocus = useIsFocused();

  const addressName = addressReducer.dataName[addressReducer.select];
  const [newName, setNewName] = useState(addressName);

  //func
  const { styles } = useMainStyle();

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = e.nativeEvent;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum =
      Math.floor(contentOffset.x / viewSize.width) === 0
        ? WALLET_TAB.TRANSFER
        : WALLET_TAB.MINT;
    if (pageNum !== tabSelect) {
      setTabSelect(pageNum);
    }
  };

  const getPriceUSDT = useCallback(async () => {
    try {
      const res = await axios({
        method: 'GET',
        url:
          networkType === 'sol'
            ? 'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT'
            : 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT',
        headers: {
          accept: 'application/json',
        },
      });

      setPrice(
        `${(
          parseFloat(res.data.price) *
          parseBalance(addressReducer.balance, networkType)
        ).toFixed(5)}`,
      );
    } catch (error) {
      console.log(error);
    }
  }, [addressReducer.balance, networkType]);

  const onEdit = () => {
    setIsEdit(v => !v);
  };

  const onChangeTextWalletName = (text: string) => {
    setNewName(text);
  };

  const onSubmit = async () => {
    const newAddressName = newName.trim();

    if (newName === addressName || newAddressName === '') {
      setIsEdit(false);
      setNewName(addressName);
      return;
    }

    await Database.renameWallet(address, newAddressName);
    actions(ACTION.GET_ADDRESS)();
    await Database.getAllAddress();
    setIsEdit(false);
    setNewName(newAddressName);
  };

  //effect
  useEffect(() => {
    try {
      scrollRef.current?.scrollTo({
        animated: true,
        x: tabSelect === WALLET_TAB.TRANSFER ? 0 : dimension.width * 2,
      });
    } catch (error) {}
  }, [tabSelect]);

  useEffect(() => {
    if (isFocus) {
      getPriceUSDT();
    }
  }, [getPriceUSDT, isFocus]);

  //render
  return (
    <ScreenComponent
      dialogLoading={addressReducer.isLoading || historyReducer.isLoading}
      titleHeader={'Wallet'}
      children={
        <>
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
                    defaultValue={addressName}
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
                  style={styles.walletText}
                  children={addressName}
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
              style={styles.walletText1}
              font="regular14"
              children={`(${address})`}
            />
            <WText
              font="bold36"
              children={`${parseFloat(
                `${parseBalance(addressReducer.balance, networkType)}`,
              ).toFixed(5)} ${
                networkType === 'bsc' ? 'BNB' : networkType.toUpperCase()
              }`}
            />
            <WText
              color={colors.text_money}
              style={styles.walletText1}
              font="regular14"
              children={`≈ ${parseFloat(price)} USDT`}
            />
          </WView>
          <WView marginTop={30}>
            <WView flexDirection="row" marginHorizontal={20} marginBottom={25}>
              <SelectButtonWallet
                onPress={setTabSelect}
                isSelect={tabSelect === WALLET_TAB.TRANSFER}
                title={WALLET_TAB.TRANSFER}
              />
              <SelectButtonWallet
                onPress={setTabSelect}
                isSelect={tabSelect === WALLET_TAB.MINT}
                title={WALLET_TAB.MINT}
              />
            </WView>

            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              onMomentumScrollEnd={onScrollEnd}
              ref={scrollRef}
            >
              <PageTransfer />
              <PageMint />
            </ScrollView>
          </WView>
        </>
      }
    />
  );
};

export default WalletScreen;
