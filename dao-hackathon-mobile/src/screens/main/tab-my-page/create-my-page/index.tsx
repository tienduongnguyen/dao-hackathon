import React, { useState } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sizeScale, USER_NAME_LENGTH } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import { LoadingProgress } from '@src/components';
import {
  Block,
  Button,
  Icon,
  Spacer,
  Text,
  TextField,
} from '@src/library/components';
import { ACTION, actions } from '@src/redux';
import { addEditProfile } from '@src/services';
import { useTheme } from '@src/themes';
import { callAPIHook, Database } from '@src/utils';

import { styles } from './styles';

export const CreateMyPage = () => {
  //state
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  //func
  const onPressNext = async () => {
    console.log('press next');
    const tokenFCM = await getDeviceToken();
    const mnemonic = await Database.getMnemonic();
    callAPIHook({
      API: addEditProfile,
      payload: {
        username,
        tokenFCM,
        mnemonic,
      },
      setLoading: setLoading,
      onSuccess: res => {
        console.log('success', res);
        actions(ACTION.SET_PROFILE)({ username: username });
      },
    });
    // actions(ACTION.ADD_EDIT_PROFILE);
  };
  const onChangeText = (text: string) => {
    setUsername(text);
  };
  // render
  return (
    <Block padding={sizeScale(16)} block>
      {loading && <LoadingProgress />}
      <Text
        preset="body1"
        text="Create your profile by inputting a user name (You can edit your user name)"
        colorTheme="text2"
      />
      <Spacer height={40} />
      <Block direction="row" justifyContent="center" alignItems="center">
        <TextField
          containerStyle={styles.inputContainer}
          maxLength={USER_NAME_LENGTH}
          typeInput="outline"
          placeholder="Username *"
          onChangeText={onChangeText}
          value={username}
        />
        <Spacer width={8} />
        <Icon icon={!username ? 'ic_pencil' : 'check'} />
      </Block>
      <Block block justifyContent="flex-end">
        <Button
          onPress={onPressNext}
          text="Next"
          disabled={!username}
          textColorTheme="white"
          preset="primary"
          gradient={colors.gradient}
          typePreset="medium"
        />
        <Spacer height={insets.bottom + 14} />
      </Block>
    </Block>
  );
};
