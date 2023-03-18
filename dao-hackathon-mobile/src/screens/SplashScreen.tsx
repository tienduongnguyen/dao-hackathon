/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import codePush from 'react-native-code-push';
import * as Progress from 'react-native-progress';

import AsyncStorage from '@react-native-community/async-storage';
import R from '@src/assets/R';
import { dispatch, sizeScale } from '@src/common';
import FastImg from '@src/components/FastImg';
import WText from '@src/components/WText';
import { colors, dimension } from '@src/constants/Theme';
import i18n from '@src/i18n/i18n';
import { navigate } from '@src/navigation/navigation-service';
import { APP_SCREEN } from '@src/navigation/screen-types';
import { ACTION, actions } from '@src/redux';
import { Database } from '@src/utils';

const { height, width } = dimension;

const SplashScreen = () => {
  const [state, setState] = useState({
    progress: {
      receivedBytes: 0,
      totalBytes: 1,
    },
    isNeedUpdate: false,
  });

  const initApp = async () => {
    const language = await AsyncStorage.getItem('language');
    i18n.locale = language || 'vi';
    const isSaveMnemonic = await Database.getMnemonic();

    if (isSaveMnemonic) {
      actions(ACTION.SCREEN_NAVIGATION)({
        route: APP_SCREEN.UN_AUTHORIZE,
        params: { isExpired: true },
      });
      navigate(APP_SCREEN.UN_AUTHORIZE, { isExpired: true });
    } else {
      actions(ACTION.SCREEN_NAVIGATION)({
        route: APP_SCREEN.UN_AUTHORIZE,
        params: { isExpired: false },
      });
      navigate(APP_SCREEN.UN_AUTHORIZE, { isExpired: false });
    }
  };

  const checkUpdate = useCallback(async () => {
    if (__DEV__) {
      return await initApp();
    }
    if (Platform.OS === 'ios') {
      const update = await codePush.checkForUpdate();
      try {
        if (!update) {
          return await initApp();
        } else {
          codePush.sync(
            {
              updateDialog: undefined,
              installMode: codePush.InstallMode.IMMEDIATE,
            },
            status => {},
            progress => {
              setState({
                progress: progress,
                isNeedUpdate: true,
              });
            },
          );
        }
      } catch (error) {
        console.log('error update');
        codePush.restartApp();
      }
    } else {
      return await initApp();
    }
  }, [initApp]);

  useEffect(() => {
    codePush.notifyAppReady();
    checkUpdate();
  }, []);

  return (
    <FastImg
      source={R.images.img_splash}
      resizeMode={Platform.select({
        android: 'stretch',
        ios: 'cover',
      })}
      style={styles.image}
    >
      {state.isNeedUpdate && (
        <View style={styles.box}>
          <Progress.Bar
            progress={state.progress.receivedBytes / state.progress.totalBytes}
            height={height * 0.018}
            width={width * 0.8}
            color={colors.primary4}
            style={styles.bar}
          />
          <WText
            color={colors.white}
            font="regular16"
            style={styles.text}
            children={`${'Sync data'} ${Math.round(
              (state.progress.receivedBytes / state.progress.totalBytes) * 100,
            )}%`}
          />
        </View>
      )}
    </FastImg>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  box: {
    position: 'absolute',
    top: height * 0.75,
    alignSelf: 'center',
  },
  bar: {
    borderWidth: 1.5,
    borderColor: '#dedede',
    backgroundColor: '#dedede',
    borderRadius: sizeScale(10),
  },
  text: {
    color: 'white',
    textAlign: 'center',
    marginTop: sizeScale(5),
  },
});

export default SplashScreen;
