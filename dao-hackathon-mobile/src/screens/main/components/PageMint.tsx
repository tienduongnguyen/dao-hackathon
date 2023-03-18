import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';

import { Empty } from '@components-old';
import { DEFAULT_PER_PAGE } from '@src/common';
import { WALLET_TAB } from '@src/constants';
import { Divider, ListView } from '@src/library/components';
import { ACTION, actions, useReducer } from '@src/redux';
import { getMintTransaction } from '@src/services';
import { callAPIHook } from '@src/utils';
import moment from 'moment';

import ItemActivity from './ItemActivity';
import { styles } from './styles';

const PageMint = () => {
  //state
  const [showItem, setShowItem] = useState<number>(-1);
  const historyReducer = useReducer(x => x.History);
  const addressReducer = useReducer(x => x.Wallet);
  const dataMint = useMemo(() => {
    return historyReducer.dataMint
      .map((e: any) => ({
        ...e,
        createdAt: e.createdAt || Date.now(),
      }))
      .sort((a: any, b: any) => moment(b.createdAt).diff(a.createdAt));
  }, [historyReducer.dataMint]);
  const address = useMemo(
    () => addressReducer.data[addressReducer.select],
    [addressReducer.data, addressReducer.select],
  );
  const pageOffset = useReducer(x => x.History.pageMint);
  const canLoadMore = useReducer(x => x.History.mintLoadMore);

  //func
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
        transactionType={WALLET_TAB.MINT.toLowerCase()}
      />
    );
  };

  const keyExtractor = (_: any, index: number) => {
    return index.toString();
  };

  const renderSeparator = () => {
    return <Divider colorTheme="primary6" />;
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
        API: getMintTransaction,
        payload: {
          address,
          offset,
        },
        onSuccess: res => {
          if (res) {
            actions(ACTION.SET_HISTORY_MINT)({
              data: res.data,
              firstPage: offset === 0,
            });
            if (res.data.length < DEFAULT_PER_PAGE) {
              actions(ACTION.SET_MINT_LOAD_MORE)(false);
            } else {
              actions(ACTION.SET_PAGE_MINT)(offset === 0);
              actions(ACTION.SET_MINT_LOAD_MORE)(true);
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

  //render
  return (
    <ListView
      contentContainerStyle={styles.listContainer}
      data={dataMint}
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

export default PageMint;
