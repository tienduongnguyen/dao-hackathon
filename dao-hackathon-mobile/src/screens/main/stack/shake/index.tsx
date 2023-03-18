import React, { useMemo } from 'react';
import { ListRenderItemInfo } from 'react-native';

import { openSettings } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { showErrorToast } from '@src/common';
import { Loading } from '@src/components';
import {
  Block,
  HeaderAuthentication,
  Icon,
  ListView,
  NftBottom,
  Spacer,
  Text,
} from '@src/library/components';
import { ShakeWalletType, WalletListType } from '@src/model/shake';
import { useLocation } from '@src/navigation/hook';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';

import { ItemShake } from './components/ItemShake';
import { useShake } from './hooks';
import { useShakeStyle } from './styles';

export const ShakeScreen = () => {
  //state
  const { styles } = useShakeStyle();
  const insets = useSafeAreaInsets();
  const { nftBottomRef, isShaking, wallets, isLoading, setIsLoading } =
    useShake();

  useLocation();

  //func
  const onClosePermissionPopup = () => {
    nftBottomRef.current?.hide();
    isShaking.current = false;
    setIsLoading(false);
    showErrorToast('Location not allowed');
  };

  const requestLocationPermission = () => {
    openSettings().then(() => {
      nftBottomRef.current?.hide();
      isShaking.current = false;
      setIsLoading(false);
    });
  };

  const onPressItem = (item: ShakeWalletType) => {
    navigate(AUTHORIZE_STACK.SELECT_NFT, {
      address: item.address,
      networkType: item.networkType,
    });
  };

  const renderItemShake = ({ item }: ListRenderItemInfo<WalletListType>) => {
    return <ItemShake item={item} onPressCard={onPressItem} />;
  };

  const renderItemSeparator = () => {
    return <Spacer height={16} />;
  };

  const keyExtractor = (item: ShakeWalletType, index: number) => {
    return index.toString();
  };

  //render

  const renderEmpty = useMemo(
    () => (
      <Block middle height={'90%'} justifyContent="center">
        <Icon icon="shake" size={173} />
        <Block padding={42}>
          <Text
            textAlign="center"
            preset="notoSanBody3Regular"
            colorTheme="text2"
            text="Shake to find people near you"
          />
        </Block>
      </Block>
    ),
    [],
  );

  // render

  return (
    <Block paddingTop={insets.top}>
      <HeaderAuthentication txTitle={'Shake'} />
      <Spacer height={16} />
      <ListView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 80 },
        ]}
        ItemSeparatorComponent={renderItemSeparator}
        data={wallets}
        renderItem={renderItemShake}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
      />
      {wallets?.length <= 0 && renderEmpty}
      {isLoading && <Loading style={styles.loading} />}
      <NftBottom
        ref={nftBottomRef}
        onClose={onClosePermissionPopup}
        onPressCancel={onClosePermissionPopup}
        onPressSubmit={requestLocationPermission}
      />
    </Block>
  );
};
