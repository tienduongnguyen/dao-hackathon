import React from 'react';
import { TouchableOpacity } from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';

import { FastImg, ScreenComponent, WText } from '@components-old';
import Clipboard from '@react-native-clipboard/clipboard';
import { StackScreenProps } from '@react-navigation/stack';
import R from '@src/assets/R';
import WView from '@src/components/WView';
import { colors, dimension } from '@src/constants';
import {
  AUTHORIZE_STACK,
  AuthorizeParamsList,
} from '@src/navigation/screen-types';
import { useReducer } from '@src/redux';

import { useStackStyle } from '../style';

type DepositScreenProps = StackScreenProps<
  AuthorizeParamsList,
  AUTHORIZE_STACK.DEPOSIT
>;

const DepositScreen = ({ route }: DepositScreenProps) => {
  //state
  const { logo } = route.params;
  const addressReducer = useReducer(x => x.Wallet);
  const address = addressReducer.data[addressReducer.select];
  const addressName = addressReducer.dataName[addressReducer.select];
  const networkType = useReducer(x => x.App.networkType);

  //func
  const { styles } = useStackStyle();

  //render
  return (
    <ScreenComponent
      back
      rightComponent={<></>}
      titleHeader={'My QR'}
      children={
        <>
          <WView flex={1} justifyContent="center" alignItems="center">
            <WView style={styles.depositBox}>
              <QRCode
                value={JSON.stringify({ address, networkType })}
                logo={logo}
                logoSize={60}
                logoMargin={10}
                logoBorderRadius={40}
                logoBackgroundColor={'white'}
                size={dimension.width * 0.65}
              />
            </WView>
            <WText
              style={styles.depositText}
              font="regular14"
              color={colors.primary4}
              children={`${addressName}`}
            />
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(address);
                Toast.show({
                  text1: 'Copied 🥳',
                  text2: address,
                });
              }}
            >
              <WView flexDirection="row" style={styles.depositBox1}>
                <WText
                  style={styles.depositText1}
                  font="regular14"
                  color={colors.text_light}
                  children={`(${address})`}
                />
                <FastImg
                  style={styles.depositImage}
                  source={R.images.ic_copy}
                />
              </WView>
            </TouchableOpacity>
          </WView>
        </>
      }
    />
  );
};

export default DepositScreen;
