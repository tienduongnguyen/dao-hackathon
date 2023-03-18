import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LayoutChangeEvent, ListRenderItemInfo, View } from 'react-native';

import { FlatList } from 'react-native-gesture-handler';

import { DEFAULT_PER_PAGE } from '@src/common';
import { LoadingProgress } from '@src/components';
import {
  Block,
  Button,
  HeaderAuthentication,
  Icon,
  ListView,
  Screen,
  Spacer,
  Text,
  TwoColorText,
} from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { goBack, navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, useReducer } from '@src/redux';
import {
  getEstimateFeeMint,
  getMintTransaction,
  mintAPI,
  uploadImage,
  uploadJson,
} from '@src/services';
import { useTheme } from '@src/themes';
import { callAPIHook, Database, getTypeImage, showMessages } from '@src/utils';

import { ItemScan } from './components/item-scan';
import { useScanStyle } from './styles';
import { ListingCardOneSideProps, NFTCardProps } from './type';

export const ListingCardOneSideScreen = ({
  route,
}: ListingCardOneSideProps) => {
  //state
  const { colors } = useTheme();
  const { styles } = useScanStyle();
  // const onFilter = route.params.onFilterImage;
  const ref = useRef<FlatList>(null);
  const [fee, setFee] = useState(0);
  const [images, setImages] = useState(route?.params.data ?? []);
  const [widthLayout, setWidthLayout] = useState(0);
  const [indexImage, setIndexImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleBack, setIsVisibleBack] = useState(false);
  const addressReducer = useReducer(x => x.Wallet);
  const address = addressReducer.data[addressReducer.select];
  const [isLoading, setLoading] = useState(false);
  const { balance } = addressReducer;
  const networkType = useReducer(x => x.App.networkType);
  const [jsonUri, setJsonUri] = useState<Array<string>>([]);
  const [currentPosition, setCurrentPosition] = useState<string>('1');

  //func
  const onPressCard = (item: NFTCardProps) => {
    return () => {
      navigate(AUTHORIZE_STACK.RENAME_CARD_ONE_SIDE, {
        data: item,
        onEditDetail: onEditDetail,
      });
    };
  };

  const getFee = async (uri: Array<string>) => {
    const privateKey = await Database.getPrivateKey(address);
    callAPIHook({
      API: getEstimateFeeMint,
      payload:
        uri.length === 1
          ? {
              privateKey,
              address,
              uri: uri,
            }
          : { privateKey, address, uri: uri, option: 'multi' },
      setLoading: setLoading,
      onSuccess: res => {
        if (res) {
          setFee(res.data);
          setIsVisible(true);
        }
      },
    });
  };

  const isShowPopupMint = async () => {
    const formDataImage: any[] = [];
    images.forEach(e => {
      const imageExt = getTypeImage(e.img);
      formDataImage.push({
        name: 'images',
        type: 'image/' + imageExt,
        filename: 'image.png',
        uri: e.img,
      });
    });
    const imageProcessed = await callAPIHook({
      API: uploadImage,
      setLoading: setLoading,
      formdata: {
        image: formDataImage,
      },
    });
    const imageUri = await imageProcessed.data;
    const metadata: any[] = [];
    images.forEach((e, index) => {
      metadata.push({
        name: e.card_name,
        symbol: 'MESME',
        description: e?.description,
        edition: '2022',
        external_url: '',
        create_date: Date.now(),
        attributes: [],
        properties: {
          files: [
            {
              uri: imageUri[index],
              type: 'image/png',
            },
          ],
          category: 'image',
          creators: [
            {
              address: address,
              share: 100,
            },
          ],
        },
        image: imageUri[index],
      });
    });
    callAPIHook({
      API: uploadJson,
      setLoading: setLoading,
      payload: metadata,
      onSuccess: res => {
        if (res) {
          setJsonUri(res.data);
          getFee(res.data);
          console.log('setCurrentPosition', images[0].position);
          setCurrentPosition(images[0].position || '1');
        }
      },
    });
  };
  const closePopupMint = () => {
    setIsVisible(false);
  };
  const getDataMint = () => {
    callAPIHook({
      API: getMintTransaction,
      payload: {
        address,
        offset: 0,
      },
      onSuccess: res => {
        if (res) {
          actions(ACTION.SET_HISTORY_MINT)({
            data: res.data,
            firstPage: true,
          });
          if (res.data.length < DEFAULT_PER_PAGE) {
            actions(ACTION.SET_MINT_LOAD_MORE)(false);
          } else {
            actions(ACTION.SET_PAGE_MINT)(true);
            actions(ACTION.SET_MINT_LOAD_MORE)(true);
          }
        }
      },
    });
  };
  const onConfirm = async () => {
    closePopupMint();
    if (balance < fee * images.length) {
      return showMessages(
        '',
        'Cannot Mint NFT. Your balance is not enough to pay for the transaction.',
      );
    }
    console.log('currentPosition', currentPosition);

    const privateKey = await Database.getPrivateKey(address);
    callAPIHook({
      API: mintAPI,
      setLoading: setLoading,
      payload: {
        privateKey,
        address,
        uri: jsonUri,
        option: currentPosition,
      },
      onSuccess: res => {
        if (res) {
          getDataMint();
          navigate(AUTHORIZE_STACK.SUCCESS, {
            type: 'mint',
          });
        }
      },
    });
  };

  const onPressDelete = (id: string) => {
    return () => {
      if (images.length === 1) {
        const filterData = images.filter(item => item.id !== id);
        setImages(filterData);
        if (images.findIndex(item => item.id === id) > 0) {
          setIndexImage(x => x - 1);
        }
        goBack();
      }
      const filterData = images.filter(item => item.id !== id);
      setImages(filterData);
      if (images.findIndex(item => item.id === id) > 0) {
        setIndexImage(x => x - 1);
      }
    };
  };

  const onPressNext = () => {
    if (indexImage === images.length - 1) {
      setIndexImage(images.length - 1);
    } else {
      setIndexImage(indexImage + 1);
    }
  };

  const onPressBack = () => {
    if (indexImage === 0) {
      setIndexImage(0);
    } else {
      setIndexImage(indexImage - 1);
    }
  };

  const onBack = () => {
    // onFilter(images);
    // navigate(AUTHORIZE_STACK.TAKE_PHOTO_ONE_SIDE);
    onClosePopupBack();
    setTimeout(() => {
      goBack();
    }, 200);
  };
  const onClosePopupBack = () => {
    setIsVisibleBack(false);
  };

  const onShowPopupBack = () => {
    setIsVisibleBack(true);
  };

  const renderItem = ({ item }: ListRenderItemInfo<NFTCardProps>) => {
    return (
      <ItemScan
        item={item}
        onPressCard={onPressCard(item)}
        onPressDelete={onPressDelete(item.id)}
      />
    );
  };

  const keyExtractor = (item: NFTCardProps) => {
    return item.id;
  };

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setWidthLayout(e.nativeEvent.layout.width);
  }, []);

  const handleScroll = useCallback(
    event => {
      const xOffset = event.nativeEvent.contentOffset.x + 1;
      const contentWidth = widthLayout;
      const ratio = (xOffset % contentWidth) / contentWidth;
      const value =
        ratio < 0.5
          ? Math.floor(xOffset / contentWidth)
          : Math.ceil(xOffset / contentWidth);
      if (value < images.length) {
        setIndexImage(value);
      }
    },
    [images.length, widthLayout],
  );

  const onEditDetail = (
    name: string,
    description: string,
    position: string = '1',
  ) => {
    setImages(imgs =>
      imgs.map((item, index) => {
        if (index === indexImage) {
          return {
            ...item,
            card_name: name,
            description: description,
            position,
          };
        }
        return item;
      }),
    );
  };

  const isValid = useMemo(() => {
    let check = true;
    images.forEach(item => {
      if (!item.card_name) {
        check = false;
      }
    });

    return check;
  }, [images]);

  //effect
  useEffect(() => {
    ref?.current?.scrollToIndex({
      animated: true,
      index: indexImage,
      viewPosition: 0.5,
    });
  }, [indexImage, ref]);

  // render
  return (
    <Screen statusBarStyle="light-content">
      {isLoading && <LoadingProgress />}
      <HeaderAuthentication txTitle="Your Image(s)" onPress={onShowPopupBack} />
      <Spacer height={10} />
      <View onLayout={onLayout} style={styles.container}>
        <ListView
          data={images ?? []}
          ref={ref}
          contentContainerStyle={styles.content}
          horizontal
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          onMomentumScrollEnd={handleScroll}
          alwaysBounceVertical={false}
        />
      </View>
      <Block
        block
        paddingHorizontal={16}
        justifyContent="flex-end"
        paddingBottom={20}
      >
        <Block alignSelf="center" direction="row">
          <Button disabled={indexImage === 0} onPress={onPressBack}>
            <Icon icon="arrow_left" size={24} colorTheme="white" />
          </Button>
          <Spacer width={44} />
          <Text
            text={`${indexImage + 1}/${images.length}`}
            preset="notoSanBody1Regular"
            colorTheme="white"
          />
          <Spacer width={44} />
          <Button
            disabled={indexImage === images.length - 1}
            onPress={onPressNext}
          >
            <Icon icon="arrow_right" size={24} colorTheme="white" />
          </Button>
        </Block>
        <Spacer height={30} />
        <Button
          disabled={!isValid || isLoading}
          text="Mint"
          textColorTheme="white"
          gradient={colors.gradient}
          typePreset="medium"
          preset="primary"
          onPress={isShowPopupMint}
        />
      </Block>
      <BottomSheet
        isVisible={isVisible}
        title={'Confirm and Pay'}
        description={TwoColorText({
          firstText: 'You will need to pay ',
          fee: `${fee * images.length} ${
            'MES'
            // networkType === 'bsc' ? 'BNB' : networkType.toUpperCase()
          }`,
          lastText: ' to accomplish the transaction. Do you want to proceed?',
        })}
        onClose={closePopupMint}
        onPressCancel={closePopupMint}
        onPressSubmit={onConfirm}
        buttonCancelText={'Cancel'}
        buttonSubmitText={'Yes'}
      />
      <BottomSheet
        isVisible={isVisibleBack}
        title={'Discard Photo(s)?'}
        description={
          'You will lose all your scanned images. Do you want to proceed?'
        }
        onClose={onClosePopupBack}
        onPressCancel={onClosePopupBack}
        onBackdropPress={onClosePopupBack}
        onPressSubmit={onBack}
        buttonCancelText={'Cancel'}
        buttonSubmitText={'Yes'}
      />
    </Screen>
  );
};
