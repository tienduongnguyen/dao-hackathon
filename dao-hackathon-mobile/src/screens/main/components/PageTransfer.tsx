import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';

import { Empty } from '@components-old';
import firestore from '@react-native-firebase/firestore';
import { DEFAULT_PER_PAGE } from '@src/common';
import { WALLET_TAB } from '@src/constants';
import { Block, ListView } from '@src/library/components';
import { ACTION, actions, useReducer } from '@src/redux';
import { getTransferTransaction } from '@src/services';
import { useTheme } from '@src/themes';
import { callAPIHook } from '@src/utils';
import moment from 'moment';

import ItemActivity from './ItemActivity';
import { styles } from './styles';

const PageTransfer = () => {
  // state
  const [showItem, setShowItem] = useState<number>(-1);
  const { colors } = useTheme();
  const historyReducer = useReducer(x => x.History);
  const addressReducer = useReducer(x => x.Wallet);
  const currentReceive = useReducer(x => x.History.currentReceive);
  const dataTransfer = useMemo(() => {
    return historyReducer.dataTransfer
      .map((e: any) => ({
        ...e,
        createdAt: e.createdAt || Date.now(),
      }))
      .sort((a: any, b: any) => moment(b.createdAt).diff(a.createdAt));
  }, [historyReducer.dataTransfer]);
  const address = useMemo(
    () => addressReducer.data[addressReducer.select],
    [addressReducer.data, addressReducer.select],
  );
  const pageOffset = useReducer(x => x.History.pageTransfer);
  const canLoadMore = useReducer(x => x.History.transferLoadMore);

  // func
  const onPressItem = (item?: any, index?: number) => {
    if (index !== undefined) {
      if (showItem === index) {
        setShowItem(-1);
      } else {
        setShowItem(index);
      }
    }
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<any>) => {
    return (
      <ItemActivity
        item={item}
        index={index}
        isShow={showItem === index}
        onPress={onPressItem}
        transactionType={WALLET_TAB.TRANSFER.toLowerCase()}
      />
    );
  };

  const keyExtractor = (_: any, index: number) => {
    return index.toString();
  };

  const renderSeparator = () => {
    return (
      <Block
        width={'100%'}
        borderWidth={1}
        borderBottomColor={colors.primary6}
      />
    );
  };

  const renderEmptyList = () => {
    return (
      <Empty
        marginTop={'10%'}
        description="Oops! There is nothing here."
        onRefresh={getDataFirst}
      />
    );
  };

  const getData = useCallback(
    offset => {
      callAPIHook({
        API: getTransferTransaction,
        payload: {
          address,
          offset,
        },
        onSuccess: res => {
          if (res) {
            console.log({ res: res.data });

            actions(ACTION.SET_HISTORY_TRANSFER)({
              data: res.data,
              firstPage: offset === 0,
            });
            if (res.data.length < DEFAULT_PER_PAGE) {
              actions(ACTION.SET_TRANSFER_LOAD_MORE)(false);
            } else {
              actions(ACTION.SET_PAGE_TRANSFER)(offset === 0);
            }
          }
        },
      });
    },
    [address],
  );

  const getDataFirst = useCallback(() => {
    getData(0);
  }, [getData]);

  const onLoadMore = useCallback(() => {
    getData(pageOffset);
  }, [getData, pageOffset]);

  // effect
  useEffect(() => {
    getDataFirst();
  }, [getDataFirst]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('transaction_transfer')
      .onSnapshot(querySnapshot => {
        const current = querySnapshot.docs.filter(
          doc => doc.data().payloadTransfer.to === address,
        ).length;
        if (current > currentReceive) {
          actions(ACTION.SET_CURRENT_RECEIVE)(current);
          getDataFirst();
        }
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [address, currentReceive, getDataFirst]);

  // render
  return (
    <ListView
      contentContainerStyle={styles.listContainer}
      data={dataTransfer}
      style={styles.listStyle}
      renderItem={renderItem}
      canRefresh
      onRefresh={getDataFirst}
      canLoadMore={canLoadMore}
      onLoadMore={onLoadMore}
      ListEmptyComponent={renderEmptyList}
      ItemSeparatorComponent={renderSeparator}
      keyExtractor={keyExtractor}
    />
  );
};

export default PageTransfer;
