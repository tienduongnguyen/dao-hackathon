import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, TouchableOpacity } from 'react-native';

import { FastImg, ScreenComponent, WText } from '@components-old';
import { sizeScale } from '@src/common';
import { shareFile } from '@src/common/share/ShareFile';
import WView from '@src/components/WView';
import { Block, Button, Icon, NftBottom, Text } from '@src/library/components';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, useReducer } from '@src/redux';
import { ColorDefault } from '@src/themes/color';
import { Database } from '@src/utils';

import { useStackStyle } from '../style';

const NftDetailScreen = (props: any) => {
  //state
  const { styles, colors } = useStackStyle();
  const nftReducer = useReducer(x => x.NFT);
  const { data, select, dataNetwork } = useReducer(x => x.Wallet);
  const [item, setItem] = useState(
    props.route.params?.item || {
      metadata: {
        name: '',
        symbol: '',
        image: '',
        description: '',
        attributes: [],
      },
      mint: '',
    },
  );
  const token = props.route.params?.token;
  const mint = item.mint || token;

  const { name, image, description, attributes, properties } = item.metadata;

  const addressSelected = useMemo(() => data?.[select], [data, select]);

  const nftBottomRef = useRef<NftBottom>();

  //func

  // const onPressTokenAddress = () => {
  //   Linking.openURL(`https://solscan.io/token/${mint}?cluster=devnet`);
  // };

  const handleClosePermission = () => {
    nftBottomRef.current?.hide();
  };

  const handleSubmitPermission = async () => {
    nftBottomRef.current?.hide();
    const indexWallet = data.findIndex(
      wallet => wallet === item?.addressReceived,
    );

    if (indexWallet !== -1) {
      await Database.setSelectAddress(
        data[indexWallet],
        dataNetwork[indexWallet],
      );
      actions(ACTION.CANCEL)();
      actions(ACTION.GET_ADDRESS)();
      setTimeout(() => {
        actions(ACTION.SELECT_ADDRESS)(indexWallet);
        actions(ACTION.SET_CURRENT_RECEIVE)(0);
        navigate(AUTHORIZE_STACK.TRANSFER, {
          item,
        });
      }, 100);
    }
  };

  const onPressTransfer = () => {
    if (item?.addressReceived && item?.addressReceived !== addressSelected) {
      nftBottomRef.current?.show(
        false,
        'This NFT is not in the current default wallet. If you want to transfer it, the wallet that own this NFT will be set to default. Do you want to proceed?',
        'Message',
        false,
        'Proceed',
        'Cancel',
      );

      return;
    }

    navigate(AUTHORIZE_STACK.TRANSFER, {
      item,
    });
  };

  const onPressImageFront = () => {
    navigate(AUTHORIZE_STACK.IMAGE_VIEW, {
      url: image,
    });
  };

  const onPressImageBack = () => {
    navigate(AUTHORIZE_STACK.IMAGE_VIEW, {
      url: properties.files[1].uri,
    });
  };

  const shareClicked = () => {
    if (properties.files.length === 2) {
      shareFile(
        Platform.OS === 'ios'
          ? [
              properties.files[0].uri?.toString(),
              properties.files[1].uri?.toString(),
            ]
          : [
              `${properties.files[0].uri?.toString()} \n ${properties.files[1].uri?.toString()}`,
            ],
        'share',
      );
    } else {
      shareFile([image.toString()], 'share');
    }
  };

  // effect
  useEffect(() => {
    if (token) {
      const itemFound = nftReducer.data.find((e: any) => e.mint === token);
      if (itemFound) {
        setItem(nftReducer.data.find((e: any) => e.mint === token));
      }
    }
  }, [nftReducer.isLoading, nftReducer.data.length, token, nftReducer.data]);

  // render
  return (
    <ScreenComponent
      back
      rightComponent={<Icon icon="ic_share" onPress={shareClicked} />}
      isLoading={nftReducer.isLoading}
      titleHeader={name}
      children={
        <>
          <ScrollView
            contentContainerStyle={styles.nftDetailContent}
            style={styles.nftDetailScroll}
          >
            {properties.files.length === 2 ? (
              <>
                <TouchableOpacity onPress={onPressImageFront}>
                  <Block
                    zIndex={1}
                    top={8}
                    left={8}
                    width={46}
                    height={20}
                    borderRadius={5}
                    middle
                    justifyContent="center"
                    position="absolute"
                    color={ColorDefault.frontColor}
                  >
                    <Text
                      text={'Front'}
                      preset="notoSanBody3Regular"
                      colorTheme="text1"
                    />
                  </Block>
                  <FastImg
                    style={styles.nftDetailImage}
                    resizeMode="contain"
                    source={{ uri: properties.files[0].uri }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressImageBack}>
                  <Block
                    zIndex={1}
                    top={8}
                    left={8}
                    width={46}
                    height={20}
                    borderRadius={5}
                    middle
                    justifyContent="center"
                    position="absolute"
                    color={ColorDefault.backColor}
                  >
                    <Text
                      text={'Back'}
                      preset="notoSanBody3Regular"
                      colorTheme="text1"
                    />
                  </Block>
                  <FastImg
                    style={styles.nftDetailImage}
                    resizeMode="contain"
                    source={{ uri: properties.files[1].uri }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={onPressImageFront}>
                  <FastImg
                    style={styles.nftDetailImage}
                    resizeMode="contain"
                    source={{ uri: image }}
                  />
                </TouchableOpacity>
              </>
            )}

            <WText
              style={styles.nftDetailText}
              // onPress={onPressTokenAddress}
              color={colors.primary4}
              font="regular14"
              children={mint}
            />
            <WText font="bold20" children={'Description'} />
            <WText
              style={styles.nftDetailText1}
              font="regular16"
              children={description.trim()}
            />
            <WView flexDirection="row" style={styles.nftDetailBox}>
              {attributes.map((ele: any, index: number) => (
                <WView style={styles.nftDetailBox1} key={index}>
                  <WText font="bold14" children={ele.trait_type} />
                  <WText font="regular14" children={ele.value} />
                </WView>
              ))}
            </WView>
          </ScrollView>
          <Block padding={sizeScale(15)}>
            <Button
              onPress={onPressTransfer}
              text={'Transfer'}
              textColorTheme="white"
              gradient={colors.gradient}
              preset="primary"
              typePreset="medium"
            />
          </Block>
          <NftBottom
            ref={nftBottomRef}
            onClose={handleClosePermission}
            onPressCancel={handleClosePermission}
            onPressSubmit={handleSubmitPermission}
          />
        </>
      }
    />
  );
};

export default NftDetailScreen;
