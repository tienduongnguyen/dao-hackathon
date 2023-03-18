import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, useWindowDimensions } from 'react-native';

import { useRoute } from '@react-navigation/native';
import { ImageTypes } from '@src/assets/image';
import { sizeScale } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import { ScreenComponent } from '@src/components';
import {
  Block,
  Button,
  Icon,
  Img,
  Screen,
  Spacer,
  Text,
} from '@src/library/components';
import { NftType } from '@src/model';
import { goBack } from '@src/navigation/navigation-service';
import { getNotificationDetail } from '@src/services';
import { callAPIHook } from '@src/utils';

import { NotificationDetailProps } from './type';

import ItemNFT from '../../components/ItemNFT';
import { handleGetNotification } from '../notifications/actions';
import { useNotification } from '../notifications/hook';
import { ItemNotificationType } from '../notifications/type';

export const NotificationDetail = () => {
  // state
  const [data, setData] = useState<NftType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { item } = useRoute<NotificationDetailProps['route']>().params;
  const [itemNotify, setItemNotify] = useState<ItemNotificationType>(item);
  const { dataNotificationNft } = useNotification();
  const isFromNotification = useMemo(
    () => !!item.isFromNotification,
    [item.isFromNotification],
  );
  const addressReceived = useMemo(
    () => itemNotify.addressReceived,
    [itemNotify.addressReceived],
  );
  const { width: widthScreen } = useWindowDimensions();
  const widthCard = useMemo(
    () => (widthScreen - sizeScale(48)) / 2,
    [widthScreen],
  );

  // func
  const getNotification = useCallback(async () => {
    handleGetNotification(0, true);
  }, []);

  const handleCallNotifyDetail = useCallback(
    async (id: string) => {
      const tokenFCM = (await getDeviceToken()) as string;
      setIsLoading(true);
      callAPIHook({
        API: getNotificationDetail,
        payload: { id, tokenFCM },
        onSuccess: async res => {
          if (res.data) {
            const dataPromise = res.data.map((e: any) => {
              return new Promise(response => {
                Image.getSize(
                  e?.metadata?.image?.toString(),
                  (_width, _height) => {
                    if (_width) {
                      response({
                        ...e,
                        height: widthCard * (_height / _width),
                      });
                    }
                  },
                );
              });
            });

            setData(await Promise.all(dataPromise));
          }

          setIsLoading(false);

          await getNotification();
        },
        onError: (err: any) => {
          console.log({ err });
          setIsLoading(false);
        },
      });
    },
    [getNotification, widthCard],
  );

  // effect
  useEffect(() => {
    if (item.id) {
      handleCallNotifyDetail(item.id);
    }
  }, [handleCallNotifyDetail, item.id]);

  useEffect(() => {
    if (dataNotificationNft) {
      const notifyItemData = dataNotificationNft.find(el => el.id === item.id);
      notifyItemData && setItemNotify(notifyItemData as ItemNotificationType);
    }
  }, [dataNotificationNft, item.id]);

  // render
  return (
    <ScreenComponent
      titleHeader={'Notifications'}
      isLoading={isLoading}
      leftComponent={
        <Button onPress={goBack}>
          <Icon icon="ic_left" size={sizeScale(28)} />
        </Button>
      }
      rightComponent={<Block />}
      children={
        <Block block paddingHorizontal={16}>
          <Block direction="row">
            <Text preset="body2" colorTheme="white">
              Received from:{' '}
              <Text
                preset="body2"
                colorTheme="text2"
                // onPress={handleNavigateToBrowser(item.addressSent || '')}
              >
                {itemNotify?.addressSent}
              </Text>
            </Text>
          </Block>
          <Block
            marginTop={8}
            marginBottom={15}
            alignItems="center"
            direction="row"
          >
            <Text preset="body2" colorTheme="white">
              Network:{' '}
            </Text>
            <Spacer width={5} />
            <Block height={24} width={24} borderRadius={12} overflow="hidden">
              <Img source={itemNotify?.networkType as ImageTypes} />
            </Block>
          </Block>
          <Screen scroll unsafe>
            {data?.length > 0 ? (
              <Block direction="row">
                <Block block>
                  <Block>
                    {data
                      ?.filter((_: NftType, i: number) => i % 2 === 0)
                      ?.map((nft: NftType) => (
                        <React.Fragment key={nft.mint}>
                          <ItemNFT
                            item={nft}
                            isFromNotification={isFromNotification}
                            addressReceived={addressReceived}
                          />
                        </React.Fragment>
                      ))}
                  </Block>
                </Block>
                <Spacer width={16} />
                <Block block>
                  <Block>
                    {data
                      ?.filter((_: NftType, i: number) => i % 2 !== 0)
                      ?.map((nft: NftType) => (
                        <React.Fragment key={nft.mint}>
                          <ItemNFT
                            item={nft}
                            isFromNotification={isFromNotification}
                            addressReceived={addressReceived}
                          />
                        </React.Fragment>
                      ))}
                  </Block>
                </Block>
              </Block>
            ) : (
              <Block>
                <Text preset="body1" colorTheme="delete_button">
                  You transferred this NFT!
                </Text>
              </Block>
            )}
          </Screen>
        </Block>
      }
    />
  );
};
