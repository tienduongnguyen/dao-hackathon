import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  Linking,
  Platform,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';

import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import { Empty, ScreenComponent } from '@components-old';
import { useIsFocused } from '@react-navigation/native';
import {
  hiddenModalPickImage,
  rearrangeData,
  showModalPickImage,
  sizeScale,
} from '@src/common';
import {
  Block,
  Button,
  Divider,
  NftBottom,
  Screen,
  SelectActionScan,
  Spacer,
  Text,
} from '@src/library/components';
import { SelectAction } from '@src/library/components/select-action';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, useReducer } from '@src/redux';

import ItemNFT from './components/ItemNFT';
import { useMainStyle } from './style';
import { NFTListHeaderProps } from './type';

const NftScreen = () => {
  //state
  const addressReducer = useReducer(x => x.Wallet);
  const NFTReducer = useReducer(x => x.NFT);
  const [isGrantPhotoPermission, setIsGrantPhotoPermission] = useState(true);
  const nftBottomRef = useRef<NftBottom>();
  const selectScanRef = useRef<SelectActionScan>();
  const selectInputRef = useRef<SelectAction>();
  const { colors } = useMainStyle();
  const [dataGetSize, setDataGetSize] = useState(NFTReducer.data);
  const [loading, setLoading] = useState(false);
  const { width: widthScreen } = useWindowDimensions();
  const widthCard = (widthScreen - sizeScale(48)) / 2;

  //func
  const isFocus = useIsFocused();
  const [category, setCategory] = useState<Array<NFTListHeaderProps>>([
    {
      id: 1,
      text: 'All',
      isSelect: true,
    },
    {
      id: 2,
      text: 'Mint',
      isSelect: false,
    },
    {
      id: 3,
      text: 'Transfer',
      isSelect: false,
    },
  ]);

  const data = useMemo(() => {
    const selected = category.find(item => item.isSelect === true);
    if (selected) {
      if (selected.text === 'All') {
        return dataGetSize;
      } else {
        return dataGetSize.filter(
          nftItem =>
            nftItem?.type.toLowerCase() === selected.text.toLowerCase(),
        );
      }
    }
  }, [category, dataGetSize]);

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
  const renderItem = (item: NFTListHeaderProps) => {
    const amount = NFTReducer?.data?.filter(
      nftItem => nftItem?.type.toLowerCase() === item.text.toLowerCase(),
    );

    return (
      <React.Fragment key={item.id}>
        <Button onPress={onPressFilter(item)}>
          <Block
            width={103}
            middle
            justifyContent="center"
            borderBottomWidth={item.isSelect === true ? 3 : 0}
            borderBottomColor={
              item.isSelect === true ? colors.text3 : colors.transparent
            }
            paddingVertical={14}
          >
            <Text
              text={
                item.text +
                ' ' +
                `(${
                  item.text === 'All' ? NFTReducer.data.length : amount.length
                })`
              }
              preset={'notoSanBold14'}
              colorTheme={item.isSelect ? 'white' : 'text2'}
            />
          </Block>
        </Button>
      </React.Fragment>
    );
  };

  const onGetImageSize = useCallback(async () => {
    setLoading(true);
    let _dataNew: any[] = [];
    const _dataPromise = NFTReducer.data.map(e => {
      return new Promise(res => {
        Image.getSize(e?.metadata?.image?.toString(), (_width, _height) => {
          if (_width) {
            res({ ...e, height: widthCard * (_height / _width) });
          }
        });
      });
    });
    _dataNew = await Promise.all(_dataPromise);
    setDataGetSize(_dataNew);
    setLoading(false);
  }, [NFTReducer.data, widthCard]);

  const getData = () => {
    actions(ACTION.GET_LIST_NFT)({
      address: addressReducer.data[addressReducer.select],
    });
  };

  const onPressInput = () => {
    selectInputRef.current?.hide();
    navigate(AUTHORIZE_STACK.MINT_NFT_MANUAL);
  };

  const onPressCustomize = () => {
    selectInputRef.current?.hide();
    navigate(AUTHORIZE_STACK.CUSTOMIZE_STACK);
  };

  const onPressMintNFTManual = () => {
    // actionSheet.current?.show();
    selectInputRef.current?.show();
  };

  const onPressMintNFTScan = () => {
    selectScanRef.current?.show();
  };

  const onPressOneSided = () => {
    navigate(AUTHORIZE_STACK.TAKE_PHOTO_ONE_SIDE);
  };
  const onPressTwoSided = () => {
    navigate(AUTHORIZE_STACK.TAKE_PHOTO_TWO_SIDE);
  };
  const onCallbackSelectImageTwoSide = (res: any) => {
    hiddenModalPickImage();
    navigate(AUTHORIZE_STACK.RENAME_TWO_SIDE, { data: res });
  };
  const onCallbackSelectImageOneSide = (res: any) => {
    hiddenModalPickImage();
    navigate(AUTHORIZE_STACK.LISTING_CARD_ONE_SIDE, {
      data: rearrangeData(res),
    });
  };
  const onPressOneSidedGallery = () => {
    selectScanRef.current?.hide();
    showModalPickImage({
      onHeaderRight: onCallbackSelectImageOneSide,
      isShowHeader: true,
      maxSelect: 5,
    });
  };
  const onPressTwoSidedGallery = () => {
    selectScanRef.current?.hide();
    showModalPickImage({
      onHeaderRight: onCallbackSelectImageTwoSide,
      isShowHeader: true,
      maxSelect: 2,
    });
  };

  const requestPhotosPermission = async () => {
    if (Platform.OS === 'ios') {
      const isGrantPhoto = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      setIsGrantPhotoPermission(isGrantPhoto === RESULTS.GRANTED);
      if (isGrantPhoto !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

        if (isGrant !== RESULTS.GRANTED) {
          Linking.openSettings();
          setIsGrantPhotoPermission(false);
        }
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantPhotoPermission(true);
        }
      }
    } else {
      const isGrantPhoto = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      setIsGrantPhotoPermission(isGrantPhoto === RESULTS.GRANTED);
      if (isGrantPhoto !== RESULTS.GRANTED) {
        const isGrant = await request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );

        if (isGrant !== RESULTS.GRANTED) {
          Linking.openSettings();
          setIsGrantPhotoPermission(false);
        }
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantPhotoPermission(true);
        }
        if (isGrant === RESULTS.BLOCKED) {
          Linking.openSettings();
        }
      }
    }
  };

  const checkPhotosPermission = async () => {
    if (Platform.OS === 'ios') {
      const isGrantPhoto = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      setIsGrantPhotoPermission(isGrantPhoto === RESULTS.GRANTED);
      if (isGrantPhoto !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantPhotoPermission(true);
        } else {
          setIsGrantPhotoPermission(false);
        }
      }
    } else {
      const isGrantPhoto = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      setIsGrantPhotoPermission(isGrantPhoto === RESULTS.GRANTED);
      if (isGrantPhoto !== RESULTS.GRANTED) {
        const isGrant = await request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );

        if (isGrant === RESULTS.GRANTED) {
          setIsGrantPhotoPermission(true);
        } else {
          setIsGrantPhotoPermission(false);
        }
      }
    }
  };

  const onClosePermissionPhotoPopup = () => {
    nftBottomRef.current?.hide();
    setTimeout(() => {
      selectScanRef.current?.show();
    }, 300);
  };
  const showPermissionPhotoPopup = () => {
    selectScanRef.current?.hide();
    setTimeout(() => {
      nftBottomRef.current?.show(true);
    }, 300);
  };

  const renderListEmty = () => {
    return (
      <>
        <Empty description="Oops! There is nothing here." />
      </>
    );
  };

  const refreshControl = (
    <RefreshControl
      onRefresh={getData}
      refreshing={NFTReducer.isLoading || addressReducer.isLoading}
    />
  );

  //effect
  useEffect(() => {
    if (isFocus) {
      checkPhotosPermission();
    }
  }, [isFocus]);

  useEffect(() => {
    if (addressReducer.select > -1) {
      getData();
    }
  }, []);

  useEffect(() => {
    onGetImageSize();
  }, [onGetImageSize]);

  //render
  return (
    <>
      <ScreenComponent
        isLoading={NFTReducer.isLoading || addressReducer.isLoading || loading}
        titleHeader={'My NFT List'}
        children={
          <Block block paddingHorizontal={16}>
            <Block direction="row" paddingLeft={16}>
              {category.map(renderItem)}
            </Block>
            <Divider colorTheme="primary6" />
            <Screen scroll unsafe refreshControl={refreshControl}>
              {NFTReducer && NFTReducer.data?.length > 0 ? (
                <Block direction="row">
                  <Block block>
                    <Block>
                      {data && data?.length
                        ? data
                            ?.filter((_, i) => i % 2 === 0)
                            ?.map((nft, index) => (
                              <React.Fragment key={String(nft.key) + index}>
                                <ItemNFT item={nft} />
                              </React.Fragment>
                            ))
                        : null}
                    </Block>
                  </Block>
                  <Spacer width={16} />
                  <Block block>
                    <Block>
                      {data && data?.length
                        ? data
                            ?.filter((_, i) => i % 2 !== 0)
                            ?.map((nft, index) => {
                              return (
                                <React.Fragment key={String(nft.key) + index}>
                                  <ItemNFT item={nft} />
                                </React.Fragment>
                              );
                            })
                        : null}
                    </Block>
                  </Block>
                </Block>
              ) : (
                renderListEmty()
              )}
            </Screen>

            <Block
              direction="row"
              paddingVertical={24}
              middle
              justifyContent="space-between"
            >
              <Block block>
                <Button
                  onPress={onPressMintNFTScan}
                  text="Scan"
                  textColorTheme="white"
                  preset="primary"
                  gradient={colors.gradient}
                  typePreset="medium"
                />
              </Block>
              <Spacer width={12} />
              <Block block>
                <Button
                  onPress={onPressMintNFTManual}
                  text="Input"
                  textColorTheme="white"
                  preset="outline"
                  borderColorTheme="white"
                  buttonColorTheme={'transparent'}
                  typePreset="medium"
                />
              </Block>
            </Block>
            <SelectActionScan
              ref={selectScanRef}
              optionsCapture={[
                { text: '1-sided', itemCallback: onPressOneSided },
                { text: '2-sided', itemCallback: onPressTwoSided },
              ]}
              optionsGallery={[
                {
                  text: '1-sided',
                  itemCallback: onPressOneSidedGallery,
                },
                {
                  text: '2-sided',
                  itemCallback: onPressTwoSidedGallery,
                },
              ]}
              isGrantPhotoPermission={isGrantPhotoPermission}
              showPermission={showPermissionPhotoPopup}
            />
            <SelectAction
              ref={selectInputRef}
              option={[
                {
                  text: 'Input',
                  icon: 'edit',
                  itemCallback: onPressInput,
                },
                {
                  text: 'Customize',
                  icon: 'setting',
                  itemCallback: onPressCustomize,
                },
              ]}
            />
            <NftBottom
              ref={nftBottomRef}
              onClose={onClosePermissionPhotoPopup}
              onPressCancel={onClosePermissionPhotoPopup}
              onPressSubmit={requestPhotosPermission}
            />
          </Block>
        }
      />
    </>
  );
};

export default NftScreen;
