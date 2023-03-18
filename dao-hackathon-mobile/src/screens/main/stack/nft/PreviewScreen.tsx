import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

import { FastImg, ScreenComponent, WText } from '@components-old';
import { DEFAULT_PER_PAGE, sizeScale } from '@src/common';
import WView from '@src/components/WView';
import { Block, Button, TwoColorText } from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, useReducer } from '@src/redux';
import {
  getEstimateFeeMint,
  getMintTransaction,
  mintAPI,
  uploadJson,
} from '@src/services';
import { callAPIHook, Database, showMessages } from '@src/utils';

import { useStackStyle } from '../style';

const PreviewScreen = (props: any) => {
  //state
  const [isShowPopupMint, setIsShowPopupMint] = useState(false);
  const addressReducer = useReducer(x => x.Wallet);
  const [fee, setFee] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const { balance } = addressReducer;
  const { styles, colors } = useStackStyle();
  const address = addressReducer.data[addressReducer.select];
  const networkType = useReducer(x => x.App.networkType);
  const [jsonUri, setJsonUri] = useState<Array<string>>([]);
  const metadata = props.route.params?.metadata;
  const { name, image, description, attributes } = metadata;

  const [
    company_name,
    company_address,
    full_name,
    other_name,
    position,
    email,
    company_website,
    phone_number,
  ] = attributes.map((e: any) => e.value);

  //func
  const closePopupMint = () => {
    setIsShowPopupMint(false);
  };

  const getFee = async (uri: any) => {
    const privateKey = await Database.getPrivateKey(address);

    callAPIHook({
      API: getEstimateFeeMint,
      payload: {
        privateKey,
        address,
        uri: uri,
      },
      setLoading: setLoading,
      onSuccess: res => {
        setFee(res.data);
        setIsShowPopupMint(true);
      },
    });
  };

  const showPopup = async () => {
    const imageUri = image;

    const metadataValue = [
      {
        name: full_name.trim(),
        symbol: 'MESME',
        description: description.trim(),
        edition: '2022',
        external_url: '',
        create_date: Date.now(),
        attributes: [
          {
            trait_type: 'Company Name',
            value: company_name.trim(),
          },
          {
            trait_type: 'Other Name',
            value: other_name.trim(),
          },
          {
            trait_type: 'Company Address',
            value: company_address.trim(),
          },
          {
            trait_type: 'Full Name',
            value: full_name.trim(),
          },
          {
            trait_type: 'Position',
            value: position.trim(),
          },
          {
            trait_type: 'Email',
            value: email.trim(),
          },
          {
            trait_type: 'Company Website',
            value: company_website.trim(),
          },
          {
            trait_type: 'Phone Number',
            value: phone_number.trim(),
          },
        ],
        properties: {
          files: [
            {
              uri: imageUri,
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
        image: imageUri,
      },
    ];

    callAPIHook({
      API: uploadJson,
      setLoading: setLoading,
      payload: metadataValue,
      onSuccess: res => {
        getFee(res.data);
        setJsonUri(res.data);
      },
    });
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

  const onPressMintNFT = async () => {
    if (balance < fee) {
      return showMessages(
        '',
        'Cannot Mint NFT. Your balance is not enough to pay for the transaction.',
      );
    }
    closePopupMint();
    const privateKey = await Database.getPrivateKey(address);

    callAPIHook({
      API: mintAPI,
      setLoading: setLoading,
      payload: {
        privateKey,
        address,
        uri: jsonUri,
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

  const onPressImage = () => {
    navigate(AUTHORIZE_STACK.IMAGE_VIEW, {
      url: image,
    });
  };

  //render
  return (
    <ScreenComponent
      back
      rightComponent={<></>}
      dialogLoading={isLoading}
      titleHeader={name}
      children={
        <>
          <ScrollView
            contentContainerStyle={styles.nftDetailContent}
            style={styles.nftDetailScroll}
          >
            <TouchableOpacity onPress={onPressImage}>
              <FastImg
                style={styles.nftDetailImage}
                resizeMode="contain"
                source={{ uri: image }}
              />
            </TouchableOpacity>

            <WText font="bold20" children={'Description'} />
            <WText
              style={styles.nftDetailText1}
              font="regular16"
              children={description}
            />
            <WView flexDirection="row" style={styles.nftDetailBox}>
              {attributes.map((item: any, index: number) => (
                <WView style={styles.nftDetailBox1} key={index}>
                  <WText font="bold14" children={item.trait_type} />
                  <WText font="regular14" children={item.value} />
                </WView>
              ))}
            </WView>
          </ScrollView>
          <Block padding={sizeScale(16)}>
            <Button
              onPress={showPopup}
              text={'Mint'}
              preset={'outline'}
              gradient={colors.gradient}
              typePreset={'medium'}
              textColorTheme={'white'}
            />
          </Block>
          <BottomSheet
            isVisible={isShowPopupMint}
            title={'Confirm and Pay'}
            description={TwoColorText({
              firstText: 'You will need to pay ',
              fee: `${fee} ${
                networkType === 'bsc' ? 'BNB' : networkType.toUpperCase()
              }`,
              lastText:
                ' to accomplish the transaction. Do you want to proceed?',
            })}
            onClose={closePopupMint}
            onPressCancel={closePopupMint}
            onPressSubmit={onPressMintNFT}
            buttonCancelText={'Cancel'}
            buttonSubmitText={'Yes'}
          />
        </>
      }
    />
  );
};

export default PreviewScreen;
