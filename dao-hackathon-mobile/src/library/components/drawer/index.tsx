import React, { useRef, useState } from 'react';

import ReactNativeBlobUtil from 'react-native-blob-util';

import {
  Block,
  Button,
  Divider,
  InfoPopup,
  Screen,
  Spacer,
  Text,
} from '@components';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { hideAddress } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import { shareFile } from '@src/common/share/ShareFile';
import { LoadingProgress } from '@src/components';
import { BASE_URL } from '@src/constants';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, useReducer } from '@src/redux';
import { deleteAccount } from '@src/services';
import { callAPIHook, Database } from '@src/utils';

import { ItemNavigatorProps } from './type';

import { Icon } from '../icon';

const ItemNavigator = ({
  icon,
  txTitle,
  arrow = false,
  onPress,
}: ItemNavigatorProps) => {
  return (
    <Button onPress={onPress}>
      <Block direction="row" middle justifyContent="space-between">
        <Block direction="row">
          <Icon icon={icon} size={24} colorTheme="white" />
          <Spacer width={16} />
          <Text
            text={txTitle}
            preset="notoSanBody1Regular"
            colorTheme="text1"
          />
        </Block>
        {arrow && (
          <Block>
            <Icon icon="arrow_right" size={24} colorTheme="white" />
          </Block>
        )}
      </Block>
    </Button>
  );
};

export const Drawer = ({ navigation }: DrawerContentComponentProps) => {
  //state
  const addressReducer = useReducer(x => x.Wallet);
  const address = addressReducer.data[addressReducer.select];
  const addressName = addressReducer.dataName[addressReducer.select];
  const [isLoading, setLoading] = useState(false);
  const NFTReducer = useReducer(x => x.NFT);
  const refInfo = useRef<InfoPopup>(null);
  const [textInfo, setTextInfo] = useState('');
  const networkType = useReducer(x => x.App.networkType);

  // func
  const closeDrawer = () => {
    navigation.closeDrawer();
  };

  const onPressWalletList = () => {
    navigate(AUTHORIZE_STACK.ADDRESS);
  };

  const onPressShake = () => {
    navigate(AUTHORIZE_STACK.SHAKE);
  };

  const onPressExportNFT = () => {
    //1. Check NTF List Empty
    if (NFTReducer.data.length === 0) {
      // Show message empty
      setTextInfo('No NFT to export!');
      refInfo.current?.show();
    } else {
      // Call API
      setLoading(true);
      downloadFile();
    }
  };

  const downloadFile = async () => {
    const urlForDownload =
      BASE_URL + 'nft/download-file-excel-nft?address=' + address.trim();
    const { dirs } = ReactNativeBlobUtil.fs;
    ReactNativeBlobUtil.config({
      fileCache: true,
      path: dirs.DocumentDir + '/nftshare.xlsx',
    })
      .fetch('GET', urlForDownload, {
        'network-type': networkType,
      })
      .then(res => {
        setLoading(false);
        const pathUrl = res.path();
        setTextInfo('Export success!');
        refInfo.current?.show();
        setTimeout(() => {
          shareFile([pathUrl], 'export');
        }, 2000);
      })
      .catch(errorMessage => {
        console.log(errorMessage);
        setTextInfo('Export failed.Please try again');
        refInfo.current?.show();
      });
  };

  const onPressClearWallet = async () => {
    const tokenFCM = await getDeviceToken();
    await callAPIHook({
      API: deleteAccount,
      payload: { tokenFCM },
      onSuccess: res => {
        console.log({ resDeleteAccount: res });
      },
    });
    try {
      await Database.clearMnemonic();
    } catch (error) {
      await Database.clearAllData();
    }
    actions(ACTION.RESET)();
  };

  //render
  return (
    <Screen statusBarStyle="light-content">
      {isLoading && <LoadingProgress />}
      <Block direction="row" paddingHorizontal={16} paddingTop={20}>
        <Block
          width={50}
          height={50}
          borderRadius={25}
          borderWidth={1}
          borderColorTheme="primary6"
          overflow="hidden"
        >
          {/* <ImageRemote source="https://i.scdn.co/image/ab6761610000e5eb006ff3c0136a71bfb9928d34" /> */}
          <Block block middle justifyContent="center">
            <Icon icon="user" size={24} colorTheme="white" />
          </Block>
        </Block>
        <Spacer width={16} />
        <Block flex={9} justifyContent="space-between">
          <Text
            text={addressName}
            preset="notoSanBody2Regular"
            colorTheme="text4"
          />
          <Text
            text={hideAddress(`${address}`)}
            preset="notoSanBody2Regular"
            colorTheme="text2"
          />
        </Block>
        <Block block marginRight={5} alignItems="flex-end">
          <Button onPress={closeDrawer}>
            <Icon icon="close" size={24} colorTheme="white" />
          </Button>
        </Block>
      </Block>
      <Spacer height={16} />
      <Divider colorTheme="primary6" />
      <Block block marginTop={24} paddingHorizontal={16}>
        <ItemNavigator
          icon="ic_wallet"
          txTitle="Wallet list"
          arrow
          onPress={onPressWalletList}
        />
        <Spacer height={24} />
        <ItemNavigator
          icon="ic_shake"
          txTitle="Shake"
          arrow
          onPress={onPressShake}
        />
        <Spacer height={24} />
        <ItemNavigator
          icon="ic_nft"
          txTitle="Export NFTs detail"
          onPress={onPressExportNFT}
        />
        <Block block justifyContent="flex-end" paddingBottom={20}>
          <Button
            onPress={onPressClearWallet}
            text="Logout"
            textColorTheme="text1"
            buttonColorTheme="transparent"
            preset="outline"
            typePreset="medium"
            borderColorTheme="white"
          />
        </Block>
      </Block>
      <InfoPopup
        ref={refInfo}
        text={textInfo}
        backgroundColor={'text_color_gray'}
      />
    </Screen>
  );
};
