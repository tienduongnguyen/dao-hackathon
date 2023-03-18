import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import R from '@src/assets/R';
import { showAlertSuccess } from '@src/common';
import { FastImg, WText } from '@src/components';
import WView from '@src/components/WView';
import { Block } from '@src/library/components';
import { useReducer } from '@src/redux';
import { toDateString } from '@src/utils';

import { useMainStyle } from '../style';
interface Props {
  item?: any;
  index?: number;
  onPress: (item?: any, index?: number) => void;
  isShow: boolean;
  transactionType: string;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ item, index, transactionType, isShow, onPress }: Props) => {
  //state
  const { styles, colors } = useMainStyle();
  const addressReducer = useReducer(x => x.Wallet);
  const nftReducer = useReducer(x => x.NFT);
  const address = addressReducer.data[addressReducer.select];
  const nameFrom = (() => {
    const idx = addressReducer.data.indexOf(item.from);
    if (idx !== -1) {
      return `${addressReducer.dataName[idx]}`;
    }
    return '';
  })();

  const nameTo = (() => {
    const idx = addressReducer.data.indexOf(item.to);
    if (idx !== -1) {
      return `${addressReducer.dataName[idx]}`;
    }
    return '';
  })();

  const nameCard = useMemo<string>(() => {
    const idx = nftReducer.data.findIndex((e: any) => e.mint === item.token);
    if (idx !== -1) {
      return `${nftReducer.data[idx].data.name}`;
    }
    return '';
  }, [item.token, nftReducer.data]);

  //func
  const handleLongPressItem = () => {
    Clipboard.setString(item.txhash);
    showAlertSuccess('Copied your transaction hash', item.txhash);
  };

  const onPressItem = () => {
    onPress(item, index);
  };
  const textType = address === item.from ? 'Send' : 'Receive';

  //render
  return (
    <TouchableOpacity
      onPress={onPressItem}
      onLongPress={handleLongPressItem}
      style={[
        {
          backgroundColor: isShow ? colors.primary3 : 'transparent',
          borderColor: isShow ? colors.primary6 : 'transparent',
        },
        styles.itemActivityButton,
      ]}
    >
      <Block borderColorTheme={'white'} block direction="row">
        <>
          <FastImg
            style={[
              {
                transform: [{ rotate: isShow ? '90deg' : '0deg' }],
              },
              styles.itemActivityImage,
            ]}
            source={R.images.ic_polygon}
          />
          <WView flex={4} marginHorizontal={10}>
            <WText
              font="regular14"
              color="white"
              ellipsizeMode="tail"
              children={item.txhash}
            />
            <WView flexDirection="row">
              <WText
                font="regular12"
                color={colors.text_title}
                children={toDateString(item.createdAt || 0)}
              />
              <WView style={styles.itemActivityText} />
              <WText
                font="regular12"
                color={colors.text_success}
                children={'Success'}
              />
            </WView>
          </WView>
          <WView flex={1.5}>
            {transactionType === 'transfer' && (
              <WText
                style={[
                  {
                    backgroundColor:
                      textType === 'Receive' ? colors.arrive : colors.primary4,
                  },
                  styles.itemActivityText1,
                ]}
                font="regular14"
                color="white"
                children={textType}
              />
            )}
          </WView>
        </>
      </Block>
      {!!isShow && (
        <>
          <WView style={styles.itemActivityBox} />
          <WView style={styles.itemActivityBox1}>
            <WView
              flexDirection="row"
              children={
                <>
                  <WText
                    color={colors.text_title}
                    style={{ flex: 1 }}
                    font="medium14"
                    children={'From: '}
                  />
                  <WText
                    style={{ flex: 5 }}
                    ellipsizeMode="tail"
                    children={
                      <>
                        <WText
                          color={colors.primary4}
                          font="regular14"
                          children={`${nameFrom}`}
                        />
                        <WText
                          font="regular14"
                          children={`${nameFrom ? ' - ' : ''}${item.from}`}
                        />
                      </>
                    }
                  />
                </>
              }
            />
            {transactionType === 'transfer' ? (
              <WView
                flexDirection="row"
                marginTop={8}
                children={
                  <>
                    <WText
                      color={colors.text_title}
                      style={{ flex: 1 }}
                      font="medium14"
                      children={'To: '}
                    />
                    <WText
                      style={{ flex: 5 }}
                      ellipsizeMode="tail"
                      children={
                        <>
                          <WText
                            color={colors.primary4}
                            font="regular14"
                            children={`${nameTo}`}
                          />
                          <WText
                            font="regular14"
                            children={`${nameTo ? ' - ' : ''}${item.to}`}
                          />
                        </>
                      }
                    />
                  </>
                }
              />
            ) : null}
            <WView
              flexDirection="row"
              marginTop={8}
              marginBottom={12}
              children={
                <>
                  <WText
                    color={colors.text_title}
                    style={{ flex: 1 }}
                    font="medium14"
                    children={'Token: '}
                  />
                  <WText
                    style={{ flex: 5 }}
                    font="regular14"
                    ellipsizeMode="tail"
                    children={
                      <>
                        <WText
                          color={colors.primary4}
                          font="regular14"
                          children={`${nameCard}`}
                        />
                        <WText
                          font="regular14"
                          children={`${nameCard ? ' - ' : ''}${item.token}`}
                        />
                      </>
                    }
                  />
                </>
              }
            />
          </WView>
        </>
      )}
    </TouchableOpacity>
  );
};
