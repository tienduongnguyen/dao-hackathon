import React, { useCallback, useEffect, useState } from 'react';

import { Empty, LoadingProgress } from '@components-old';
import { DEFAULT_PER_PAGE } from '@src/common';
import {
  Block,
  Button,
  CheckBox,
  HeaderAuthentication,
  Img,
  Screen,
  Spacer,
  Text,
  TwoColorText,
} from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { goBack, navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, NFTCard, useReducer } from '@src/redux';
import {
  getEstimateFeeTransfer,
  getTransferTransaction,
  transfer,
} from '@src/services';
import { callAPIHook, Database, showMessages } from '@src/utils';

import { ItemNFTCard } from './components/item-nft-card';

import { useStackStyle } from '../style';

const SelectNftScreen = (props: any) => {
  //state
  const toAddress = props.route.params?.address?.trim();
  const toNetwork = props.route.params?.networkType;
  const addressReducer = useReducer(x => x.Wallet);
  const NFTReducer = useReducer(x => x.NFT);
  const address = addressReducer.data[addressReducer.select];
  const walletName = addressReducer.dataName[addressReducer.select];
  const [isShowPopupFee, setIsShowPopupFee] = useState(false);
  const [fee, setFee] = useState(0);
  const { balance } = addressReducer;
  const [listNft, setListNft] = useState<Array<NFTCard>>([]);
  const [isLoading, setLoading] = useState(false);
  const { colors } = useStackStyle();
  const networkType = useReducer(x => x.App.networkType);

  //func
  const getFee = useCallback(async () => {
    const privateKey = await Database.getPrivateKey(address);
    callAPIHook({
      API: getEstimateFeeTransfer,
      payload:
        listNft.length === 1
          ? {
              privateKey,
              toAddress,
              tokenAddress: listNft.map((i: NFTCard) => i.data.uri),
            }
          : {
              privateKey,
              toAddress,
              tokenAddress: listNft.map((i: NFTCard) => i.data.uri),
              option: 'multi',
            },
      onSuccess: res => {
        setFee(res.data);
      },
    });
  }, [address, listNft, toAddress]);

  const getDataTransfer = () => {
    callAPIHook({
      API: getTransferTransaction,
      payload: {
        address,
        offset: 0,
      },
      onSuccess: res => {
        if (res) {
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

  const onPressSendNFT = async () => {
    const totalFee = await (fee * listNft.length);
    if (balance < totalFee) {
      return showMessages(
        '',
        'Cannot Transfer NFT. Your balance is not enough to pay for the transaction.',
      );
    }
    const privateKey = await Database.getPrivateKey(address);

    setIsShowPopupFee(false);
    await callAPIHook({
      API: transfer,
      payload: {
        privateKey,
        address,
        toAddress,
        tokenAddress:
          networkType === 'sol'
            ? listNft.map((i: NFTCard) => i.mint)
            : listNft.map((i: NFTCard) => i.data.uri),
        uri: listNft.map((i: NFTCard) => i.data.uri.toString()),
        walletName,
      },
      setLoading: setLoading,
      onSuccess: res => {
        if (res) {
          getDataTransfer();
          navigate(AUTHORIZE_STACK.SUCCESS, {
            type: 'transfer',
          });
        }
      },
    });
  };

  const showPopup = () => {
    setIsShowPopupFee(true);
  };

  const closePopupMint = () => {
    setIsShowPopupFee(false);
  };

  const checkAll = () => {
    setListNft(x => {
      if (x.length === NFTReducer.data.length) {
        return [];
      }
      return NFTReducer.data;
    });
  };

  const checkOne = useCallback((cartItem: NFTCard) => {
    setListNft(x => {
      if (
        x.find(i => i.metadata.image === cartItem.metadata.image) !== undefined
      ) {
        return x.filter(i => i.metadata.image !== cartItem.metadata.image);
      }
      return x.concat([cartItem]);
    });
  }, []);

  const renderItem = (item: any, key: number) => {
    return (
      <React.Fragment key={key}>
        <ItemNFTCard
          item={item}
          onPressItem={checkOne}
          selected={
            listNft.find(x => x.metadata.image === item.metadata.image) !==
            undefined
          }
        />
      </React.Fragment>
    );
  };

  //effect
  useEffect(() => {
    getFee();
  }, [getFee]);

  //render
  return (
    <Screen statusBarStyle="light-content">
      {isLoading && <LoadingProgress />}
      <HeaderAuthentication txTitle="Send NFT" onPress={goBack} />
      <Spacer height={30} />
      <Block block paddingHorizontal={16}>
        <Text colorTheme="white" preset="notoSanBody2Regular">
          {'Send to: '}
          <Text
            text={toAddress}
            preset="notoSanBody2Regular"
            colorTheme="text2"
          />
        </Text>
        <Block direction={'row'} middle marginTop={14}>
          <Text
            text={'Network:'}
            colorTheme={'white'}
            preset={'notoSanBody2Regular'}
          />
          <Block width={24} height={24} marginLeft={8}>
            <Img source={toNetwork} />
          </Block>
        </Block>
        <Block
          paddingVertical={17}
          direction="row"
          middle
          justifyContent="space-between"
        >
          <CheckBox
            type="circle"
            size={24}
            text="Select all"
            onToggle={checkAll}
            value={
              NFTReducer.data.length === listNft.length &&
              NFTReducer.data.length !== 0
            }
          />
          {listNft.length !== 0 && (
            <Text
              text={
                listNft.length > 1
                  ? `${listNft.length} selected items`
                  : `${listNft.length} selected item`
              }
              preset="notoSanBody1Regular"
              colorTheme="text2"
            />
          )}
        </Block>
        <Screen scroll unsafe>
          {NFTReducer.data && NFTReducer.data?.length > 0 ? (
            <Block direction="row">
              <Block block>
                <Block>
                  {NFTReducer.data
                    ?.filter((_, i) => i % 2 === 0)
                    ?.map(renderItem)}
                </Block>
              </Block>
              <Spacer width={16} />
              <Block block>
                <Block>
                  {NFTReducer.data
                    ?.filter((_, i) => i % 2 !== 0)
                    ?.map(renderItem)}
                </Block>
              </Block>
            </Block>
          ) : (
            <Empty />
          )}
        </Screen>
      </Block>
      <Block justifyContent="flex-end" paddingTop={24} paddingHorizontal={16}>
        <Button
          onPress={showPopup}
          disabled={!listNft.length || toNetwork !== networkType}
          text="Transfer"
          textColorTheme="white"
          typePreset="medium"
          preset="primary"
          gradient={colors.gradient}
        />
      </Block>
      <BottomSheet
        isVisible={isShowPopupFee}
        title={'Confirm and Pay'}
        description={TwoColorText({
          firstText: 'You will need to pay ',
          fee: `${fee * listNft.length} ${
            networkType === 'bsc' ? 'BNB' : networkType.toUpperCase()
          }`,
          lastText: ' to accomplish the transaction. Do you want to proceed?',
        })}
        onClose={closePopupMint}
        onPressCancel={closePopupMint}
        onPressSubmit={onPressSendNFT}
        buttonCancelText={'Cancel'}
        buttonSubmitText={'Yes'}
      />
    </Screen>
  );
};

export default SelectNftScreen;
