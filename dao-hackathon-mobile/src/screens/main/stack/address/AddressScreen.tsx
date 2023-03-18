import React, { useCallback, useMemo, useRef, useState } from 'react';

import Toast from 'react-native-toast-message';

import { Empty, ScreenComponent, WButtonText } from '@components-old';
import { NETWORK_SELECTION, NetworkType } from '@src/common';
import {
  Block,
  Button,
  Img,
  Screen,
  SelectionBottomSheet,
  Spacer,
  Text,
} from '@src/library/components';
import { Option } from '@src/library/components/selection-bottom-sheet/type';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, useReducer } from '@src/redux';
import { Database } from '@src/utils';

import { ItemAddress } from './ItemAddress';

import { NFTListHeaderProps } from '../../type';
import { useStackStyle } from '../style';

const AddressScreen = () => {
  //state
  const addressReducer = useReducer(x => x.Wallet);
  const walletAddress = addressReducer.data[addressReducer.select];
  const { styles, colors } = useStackStyle();
  const [indexOpen, setIndexOpen] = useState<number | undefined>(undefined);
  const selectionRef = useRef<SelectionBottomSheet>();
  const [category, setCategory] = useState<Array<NFTListHeaderProps>>([
    {
      id: 1,
      text: 'Solana',
      isSelect: true,
      icon: 'sol',
    },
    {
      id: 2,
      text: 'Binance',
      isSelect: false,
      icon: 'bsc',
    },
    {
      id: 3,
      text: 'Polygon',
      isSelect: false,
      icon: 'polygon',
    },
  ]);
  const data = useMemo(() => {
    const selected = category.find(item => item.isSelect === true);
    if (selected) {
      return addressReducer?.data.filter(
        (address, index) =>
          addressReducer?.dataNetwork[index].toLowerCase() ===
          selected?.icon?.toLowerCase(),
      );
    }
  }, [addressReducer?.data, addressReducer?.dataNetwork, category]);

  //func
  const onSelectOption = useCallback((type: 'create' | 'import') => {
    return (network: NetworkType) => {
      selectionRef.current?.hide();
      if (type === 'create') {
        navigate(AUTHORIZE_STACK.CREATE_ADDRESS, { network });
      } else {
        navigate(AUTHORIZE_STACK.IMPORT_ADDRESS, { network });
      }
    };
  }, []);

  const onPressWallet = (
    address: string,
    name: string,
    network: NetworkType,
  ) => {
    navigate(AUTHORIZE_STACK.ADDRESS_DETAIL, {
      address,
      walletName: name,
      network,
    });
  };

  const onDeleteItem = async (item: string) => {
    try {
      await Database.clearPrivateKey(item);
      actions(ACTION.GET_ADDRESS)();
      Toast.show({
        type: 'info',
        text1: 'Clear wallet',
        text2: item,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
        text2: item,
      });
    }
  };

  const onEditItem = async (address: string, network: NetworkType) => {
    await Database.setSelectAddress(address, network);
    actions(ACTION.CANCEL)();
    setTimeout(() => {
      const index = addressReducer?.data.indexOf(address);
      actions(ACTION.SELECT_ADDRESS)(index);
      actions(ACTION.SET_CURRENT_RECEIVE)(0);
    }, 100);
  };

  const renderItem = (item: string, index: number) => {
    return (
      <ItemAddress
        item={item}
        index={index}
        indexOpen={indexOpen}
        setIndexOpen={setIndexOpen}
        walletAddress={walletAddress}
        addressReducer={addressReducer}
        onPressItem={() => {
          onPressWallet(
            item,
            addressReducer.dataName[index],
            addressReducer.dataNetwork[index],
          );
        }}
        onDeletePress={onDeleteItem}
        onEditPress={() => {
          const selected = category.find(item => item.isSelect === true);
          onEditItem(item, selected?.icon as NetworkType);
        }}
      />
    );
  };

  const createSelectionData = useMemo<Array<Option>>(
    () =>
      NETWORK_SELECTION.map(
        item =>
          ({
            ...item,
            callback: onSelectOption('create'),
          } as Option),
      ),
    [onSelectOption],
  );

  const importSelectionData = useMemo<Array<Option>>(
    () =>
      NETWORK_SELECTION.map(
        item =>
          ({
            ...item,
            callback: onSelectOption('import'),
          } as Option),
      ),
    [onSelectOption],
  );

  const onPressCreateAddress = async () => {
    selectionRef.current?.show(createSelectionData);
  };

  const onPressImportAddress = async () => {
    selectionRef.current?.show(importSelectionData);
  };

  const onPressFilter = (filter: NFTListHeaderProps) => {
    return () => {
      setCategory(d =>
        d.map(item => {
          if (item.id === filter.id) {
            return { ...item, isSelect: true };
          }
          return { ...item, isSelect: false };
        }),
      );
    };
  };

  const renderCategoryItem = (item: NFTListHeaderProps) => {
    return (
      <React.Fragment key={item.id}>
        <Block block>
          <Button onPress={onPressFilter(item)}>
            <Block
              // block
              direction="row"
              middle
              justifyContent="center"
              opacity={item.isSelect ? 1 : 0.5}
              paddingVertical={14}
            >
              <Block width={24} height={24}>
                <Img source={item.icon ?? 'sol'} />
              </Block>
              <Spacer width={6} />
              <Text
                text={item.text}
                preset={'notoSanBold14'}
                colorTheme={'white'}
              />
            </Block>
          </Button>
        </Block>
      </React.Fragment>
    );
  };

  const renderListEmty = () => {
    return <Empty description="Oops! There is nothing here." />;
  };

  //render
  return (
    <ScreenComponent
      back
      rightComponent={<></>}
      titleHeader={'Wallet list'}
      children={
        <>
          <Block direction="row" paddingHorizontal={16}>
            {category.map(renderCategoryItem)}
          </Block>
          <Screen scroll unsafe>
            {data && data?.length > 0 ? (
              <Block direction="row">
                <Block block>
                  <Block>
                    {data && data?.length ? data.map(renderItem) : null}
                  </Block>
                </Block>
              </Block>
            ) : (
              renderListEmty()
            )}
          </Screen>
          <Block paddingHorizontal={16} paddingVertical={8}>
            <Button
              onPress={onPressCreateAddress}
              text={'Create a new wallet'}
              preset={'outline'}
              gradient={colors.gradient}
              typePreset={'medium'}
              textColorTheme={'white'}
            />
          </Block>

          <WButtonText
            onPress={onPressImportAddress}
            style={styles.addressButtonText4}
            TextProps={{
              children: 'Import a wallet',
            }}
          />
          <SelectionBottomSheet ref={selectionRef} />
        </>
      }
    />
  );
};

export default AddressScreen;
