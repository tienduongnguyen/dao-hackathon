import React, { useCallback, useState } from 'react';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { DEFAULT_PER_PAGE } from '@src/common';
import { LoadingProgress } from '@src/components';
import {
  Block,
  HeaderAuthentication,
  Screen,
  Spacer,
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
import { callAPIHook, Database, getTypeImage, showMessages } from '@src/utils';

import { FormRenameTwoSide } from './components/form-rename';
import { ImageTwoSide } from './components/image';
import { styles } from './styles';
import { RenameCardTwoSideNavigationProps } from './type';

export const RenameTwoSideScreen = ({
  route,
}: RenameCardTwoSideNavigationProps) => {
  //state
  const [isLoading, setLoading] = useState(false);
  const { data, isOneSide, isHidePopup } = route.params;
  const addressReducer = useReducer(x => x.Wallet);
  const address = addressReducer.data[addressReducer.select];
  const [fee, setFee] = useState(0);
  const [jsonUri, setJsonUri] = useState<Array<string>>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleBack, setIsVisibleBack] = useState(false);

  //function
  const onCloseModal = () => {
    setIsVisible(false);
  };

  const onBack = () => {
    onClosePopupBack();
    setTimeout(() => {
      goBack();
    }, 200);
  };
  const onClosePopupBack = () => {
    setIsVisibleBack(false);
  };

  const onShowPopupBack = () => {
    if (isHidePopup) {
      goBack();
    } else {
      setIsVisibleBack(true);
    }
  };

  const getFee = async (uri: any) => {
    const privateKey = await Database.getPrivateKey(address);

    callAPIHook({
      API: getEstimateFeeMint,
      payload: {
        privateKey,
        address,
        uri: uri,
        option: 'multi',
      },
      setLoading: setLoading,
      onSuccess: res => {
        setFee(res.data);
        setIsVisible(true);
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

  const onMintNFT = useCallback(async () => {
    const privateKey = await Database.getPrivateKey(address);
    if (addressReducer.balance < fee) {
      return showMessages(
        '',
        'Cannot Mint NFT. Your balance is not enough to pay for the transaction.',
      );
    }

    setIsVisible(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, addressReducer.balance, fee, jsonUri]);

  const onSubmit = async (dataForm: any) => {
    const formDataImage: any[] = [];
    data.forEach(e => {
      const imageExt = getTypeImage(e);
      formDataImage.push({
        name: 'images',
        type: 'image/' + imageExt,
        filename: 'image.png',
        uri: e,
      });
    });
    const imageProcessed = await callAPIHook({
      API: uploadImage,
      setLoading: setLoading,
      formdata: {
        image: formDataImage,
      },
    });
    const imageUri = imageProcessed.data;
    const metadata: any[] = [
      {
        name: dataForm.card_name,
        symbol: 'MESME',
        description: dataForm?.description,
        edition: '2022',
        external_url: '',
        create_date: Date.now(),
        attributes: [],
        properties: {
          files: !isOneSide
            ? [
                {
                  uri: imageUri[0],
                  type: 'image/png',
                },
                {
                  uri: imageUri[1],
                  type: 'image/png',
                },
              ]
            : [
                {
                  uri: imageUri[0],
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
        image: imageUri[0],
      },
    ];

    callAPIHook({
      API: uploadJson,
      setLoading: setLoading,
      payload: metadata,
      onSuccess: res => {
        if (res) {
          getFee(res.data);
          setJsonUri(res.data);
        }
      },
    });
  };
  // const onConfirm = () => {};

  //render
  return (
    <Screen unsafe statusBarStyle="light-content">
      {isLoading && <LoadingProgress />}
      <KeyboardAwareScrollView
        // behavior={'padding'}
        showsVerticalScrollIndicator={false}
        style={styles.renameContainer}
      >
        <HeaderAuthentication txTitle={'Rename'} onPress={onShowPopupBack} />
        <Block block paddingHorizontal={16}>
          <Spacer height={35} />
          <ImageTwoSide source={data[0]} side={!isOneSide ? 'Front' : ''} />
          <Spacer height={16} />
          {!isOneSide && <ImageTwoSide source={data[1]} side={'Back'} />}
          <Spacer height={16} />
          <FormRenameTwoSide
            onSubmit={onSubmit}
            fee={fee}
            isVisible={isVisible}
            onCloseModal={onCloseModal}
            onMintNFT={onMintNFT}
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
        </Block>
      </KeyboardAwareScrollView>
    </Screen>
  );
};
