import React, { useEffect, useState } from 'react';

import { ScreenComponent, WInput } from '@components-old';
import { sizeScale } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import WView from '@src/components/WView';
import { Block, Button, Spacer, Text } from '@src/library/components';
import { goBack } from '@src/navigation/navigation-service';
import { ACTION, actions, useReducer } from '@src/redux';
import { privateKeyToAddress } from '@src/services';
import { callAPIHook, Database } from '@src/utils';

import { ImportAddressScreenProps } from './type';

import { useStackStyle } from '../style';
const ImportAddressScreen = ({ route }: ImportAddressScreenProps) => {
  //state
  const addressReducer = useReducer(x => x.Wallet);
  const [name, setName] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isError, setError] = useState('');
  const [placeHolder, setPlaceholder] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const networkType = route.params?.network;

  //func
  const { styles, colors } = useStackStyle();

  const getIndexWallet = async () => {
    const idx = (await Database.getAllAddress()).data.length;
    setPlaceholder(`Wallet ${idx + 1}`);
  };

  const getAddress = async (privateKeyValue: string) => {
    const tokenFCM = await getDeviceToken();

    console.log({ tokenFCM });

    try {
      const res = await callAPIHook({
        API: privateKeyToAddress,
        payload: {
          privatekey: privateKeyValue,
          tokenFCM,
        },
        headers: {
          'network-type': networkType,
        },
        setLoading: setIsLoading,
      });
      return {
        address: res.data,
        privateKeyNew: privateKeyValue,
      };
    } catch (error) {
      setError('Private key is incorrect');
      return {
        address: '',
        privateKeyNew: '',
      };
    }
  };
  useEffect(() => {
    getIndexWallet();
  }, []);

  useEffect(() => {
    setError('');
  }, [privateKey]);

  const isValid = privateKey.trim().length > 0 && isError.length === 0;

  const onPressImportAddress = async () => {
    const privateKeyValue = privateKey.trim();
    setPrivateKey(privateKeyValue);
    const { address, privateKeyNew } = await getAddress(privateKeyValue);
    if (!address || !privateKeyNew) {
      return;
    }

    const nameSet = name.trim().length > 0 ? name.trim() : placeHolder;
    const _privateKey = await Database.importPrivateKey(
      address,
      privateKeyNew,
      nameSet,
      false,
      networkType,
    );
    if (_privateKey === false) {
      setError('Wallet already existed');
    } else {
      actions(ACTION.CANCEL)();
      actions(ACTION.GET_ADDRESS)();
      setTimeout(async () => {
        try {
          actions(ACTION.SELECT_ADDRESS)(addressReducer.data.length);
          await Database.setSelectAddress(privateKeyNew, networkType);
          actions(ACTION.SET_CURRENT_RECEIVE)(0);
        } catch (error) {}
      }, 1000);
      goBack();
    }
  };

  const handleEndEditing = () => {
    const privateKeyValue = privateKey.trim();
    setPrivateKey(privateKeyValue);
  };

  //render
  return (
    <ScreenComponent
      back
      dialogLoading={isLoading}
      rightComponent={<></>}
      titleHeader={'Import a wallet'}
      children={
        <WView flex={1} justifyContent="space-between">
          <WView style={styles.createAddressBox1}>
            {networkType === 'sol' ? (
              <>
                <Text
                  text={'Please take note:'}
                  preset={'notoSanBody2Regular'}
                  colorTheme={'white'}
                />
                <Spacer height={20} />
                <Text
                  text={
                    'You are importing a wallet in Solana. This means you will not be able to switch to other networks in the future, nor to switch wallet in any other networks to Solana.'
                  }
                  preset={'notoSanBody2Regular'}
                  colorTheme={'white'}
                />
              </>
            ) : null}
            <Spacer height={24} />
            <WInput
              placeholder={placeHolder}
              value={name}
              onChangeText={setName}
            />
            <Spacer height={16} />
            <WInput
              placeholder={'Your private key'}
              value={privateKey}
              maxLength={88}
              isError={!!isError}
              errorMessage={isError}
              onChangeText={setPrivateKey}
              onEndEditing={handleEndEditing}
            />
          </WView>
          <WView>
            <Block padding={sizeScale(16)}>
              <Button
                disabled={!isValid}
                onPress={onPressImportAddress}
                text={'Import a wallet'}
                preset={'outline'}
                gradient={colors.gradient}
                typePreset={'medium'}
                textColorTheme={'white'}
              />
            </Block>
          </WView>
        </WView>
      }
    />
  );
};

export default ImportAddressScreen;
