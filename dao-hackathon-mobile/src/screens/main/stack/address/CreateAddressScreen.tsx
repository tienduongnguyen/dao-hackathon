import React, { useState } from 'react';

import { ScreenComponent, WInput, WText } from '@components-old';
import { NETWORK, sizeScale, useDidMount } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import WView from '@src/components/WView';
import { Block, Button, Spacer, Text } from '@src/library/components';
import { goBack } from '@src/navigation/navigation-service';
import { ACTION, actions, useReducer } from '@src/redux';
import { generateAddress } from '@src/services';
import { callAPIHook, Database } from '@src/utils';

import { CreateAddressScreenProps } from './type';

import { useStackStyle } from '../style';

const CreateAddressScreen = ({ route }: CreateAddressScreenProps) => {
  //state
  const addressReducer = useReducer(x => x.Wallet);
  const [name, setName] = useState('');
  const [placeHolder, setPlaceholder] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [address, setAddress] = useState({
    address: '',
    privateKey: '',
  });
  const networkType = route.params?.network;

  //func
  const { styles, colors } = useStackStyle();

  const getIndexWallet = async () => {
    const idx = (await Database.getAllAddress()).data.length;
    setPlaceholder(`Wallet ${idx + 1}`);
  };

  const getAddress = async () => {
    const tokenFCM = await getDeviceToken();

    const indexWallet =
      parseInt((await Database.getIndexMnemonic()) || '0', 10) + 1;
    callAPIHook({
      API: generateAddress,
      payload: {
        mnemonic: await Database.getMnemonic(),
        index: indexWallet,
        tokenFCM,
      },
      headers: {
        'network-type': NETWORK[networkType],
      },
      setLoading: setisLoading,
      onSuccess: async res => {
        setAddress({
          address: res.data.address,
          privateKey: res.data.privateKey,
        });
      },
    });
  };

  useDidMount(() => {
    getAddress();
    getIndexWallet();
  });

  const onPressCreateAddress = async () => {
    const nameSet = name.trim().length > 0 ? name.trim() : placeHolder;
    await Database.importPrivateKey(
      address.address,
      address.privateKey,
      nameSet,
      true,
      NETWORK[networkType],
    );

    actions(ACTION.CANCEL)();
    actions(ACTION.GET_ADDRESS)();
    setTimeout(async () => {
      try {
        actions(ACTION.SELECT_ADDRESS)(addressReducer.data.length);
        await Database.setSelectAddress(address.privateKey, networkType);
        actions(ACTION.SET_CURRENT_RECEIVE)(0);
      } catch (error) {}
    }, 1000);
    goBack();
  };

  //render
  return (
    <ScreenComponent
      back
      dialogLoading={isLoading}
      rightComponent={<></>}
      titleHeader={'Create a new wallet'}
      children={
        <Block block justifyContent="space-between">
          <WView style={styles.createAddressBox}>
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
                    'You are creating a wallet in Solana. This means you will not be able to switch to other networks in the future, nor to switch wallet in any other networks to Solana.'
                  }
                  preset={'notoSanBody2Regular'}
                  colorTheme={'white'}
                />
              </>
            ) : null}
            <Spacer height={24} />
            <WInput
              containerStyle={styles.createAddressInputName}
              placeholder={placeHolder}
              value={name}
              onChangeText={setName}
            />
            <Spacer height={24} />
            <WText
              font="regular14"
              style={styles.createAddressInput}
              color={colors.primary7}
              children={address.address}
            />
          </WView>
          <Block padding={sizeScale(15)}>
            <Button
              onPress={onPressCreateAddress}
              text={'Create a new wallet'}
              gradient={colors.gradient}
              preset="outline"
              typePreset={'medium'}
              textColorTheme={'white'}
            />
          </Block>
        </Block>
      }
    />
  );
};

export default CreateAddressScreen;
