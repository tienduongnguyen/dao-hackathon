import { StyleSheet } from 'react-native';

import { sizeScale } from '@src/common';
import { dimension } from '@src/constants';
import { useTheme } from '@src/themes';
import { FontDefault } from '@src/themes/typography';

export const useMainStyle = () => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    itemActivityButton: {
      marginVertical: sizeScale(10),
      padding: sizeScale(8),
    },
    itemActivityImage: {
      width: sizeScale(15),
      aspectRatio: 1,
      top: sizeScale(5),
    },
    itemCardButton: {
      width: dimension.width / 2,
      marginEnd: 30,
      marginBottom: 20,
      justifyContent: 'center',
    },
    itemCardImage: {
      width: '100%',
      aspectRatio: 1.75,
      borderRadius: sizeScale(5),
      marginBottom: sizeScale(10),
    },
    confirmBtn: {
      marginLeft: sizeScale(10),
    },
    itemCardBox: {
      padding: sizeScale(5),
      position: 'absolute',
      aspectRatio: 1,
      backgroundColor: colors.primary,
      borderRadius: sizeScale(15),
      right: sizeScale(10),
      top: sizeScale(10),
      borderWidth: 1,
      borderColor: colors.white,
    },
    itemCardText: {
      position: 'absolute',
      bottom: sizeScale(15),
      left: sizeScale(5),
      backgroundColor: colors.primary2 + 'DD',
      padding: sizeScale(5),
      borderRadius: sizeScale(5),
      overflow: 'hidden',
      paddingHorizontal: sizeScale(10),
      maxWidth: '70%',
    },
    itemNFTButton: {
      flex: 1,
    },
    itemNFTImage: {
      width: '100%',
      borderRadius: sizeScale(5),
      overflow: 'hidden',
    },
    itemNFTBox: {
      padding: sizeScale(5),
      position: 'absolute',
      aspectRatio: 1,
      backgroundColor: colors.primary,
      borderRadius: sizeScale(15),
      right: sizeScale(8),
      top: sizeScale(8),
      borderWidth: 1,
      borderColor: colors.white,
    },
    itemNFTImage1: {
      width: sizeScale(15),
      aspectRatio: 1,
    },
    itemNFTText1: {
      position: 'absolute',
      bottom: sizeScale(15),
      left: sizeScale(5),
      backgroundColor: colors.primary2 + 'DD',
      padding: sizeScale(5),
      borderRadius: sizeScale(5),
      overflow: 'hidden',
      paddingHorizontal: sizeScale(10),
      maxWidth: '70%',
    },
    itemSelectButton: {
      marginTop: sizeScale(16),
    },
    itemSelectText: {
      marginBottom: sizeScale(5),
    },
    itemSelectText1: {
      paddingRight: sizeScale(18),
    },
    itemSelectBox: {
      width: '100%',
      height: 1,
      backgroundColor: colors.primary6,
      marginTop: sizeScale(16),
      alignSelf: 'center',
    },
    buttonWalletButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonWalletBox: {
      width: '100%',
      height: sizeScale(3),
      marginTop: sizeScale(15),
    },
    nftButtonText: {
      flex: 1,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.white,
    },
    nftButtonText1: {
      flex: 1,
    },
    nftBox: {
      height: sizeScale(50),
    },
    qrCam: {
      width: '100%',
      height: '100%',
    },
    qrImage: {
      width: dimension.width,
      height: '100%',
      position: 'absolute',
    },
    qrButton: {
      bottom: -(dimension.width * 0.65) / 1.12345,
      position: 'absolute',
      alignSelf: 'center',
    },
    qrImage1: {
      width: sizeScale(22),
      height: sizeScale(12),
      alignSelf: 'center',
      marginStart: sizeScale(10),
    },
    qrBox: {
      padding: sizeScale(15),
      borderRadius: sizeScale(20),
      backgroundColor: colors.white,
    },
    walletText: {
      margin: sizeScale(10),
      maxWidth: '80%',
    },
    walletText1: {
      paddingHorizontal: sizeScale(50),
      textAlign: 'center',
    },
    itemActivityText: {
      height: '100%',
      width: 1,
      marginHorizontal: sizeScale(5),
      backgroundColor: colors.primary6,
    },
    itemActivityText1: {
      padding: sizeScale(2),
      borderRadius: sizeScale(5),
      textAlign: 'center',
      margin: sizeScale(5),
      overflow: 'hidden',
    },
    itemActivityBox: {
      width: '100%',
      height: 1,
      marginVertical: sizeScale(10),
      backgroundColor: colors.primary6,
    },
    itemActivityBox1: {
      marginHorizontal: sizeScale(25),
    },
    transferImage: {
      width: dimension.width / 2,
      aspectRatio: 1,
      marginTop: '15%',
    },
    transferButtonText: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 1,
      flex: 1,
    },
    transferImage1: {
      width: '100%',
      aspectRatio: 1.75,
      alignSelf: 'center',
    },
    transferImage2: {
      width: sizeScale(20),
      aspectRatio: 1,
      marginEnd: sizeScale(15),
      marginStart: sizeScale(20),
    },
    transferScroll: {
      alignItems: 'flex-start',
    },
    transferText: {
      marginHorizontal: sizeScale(15),
    },
    transferButtonText1: {
      flex: 1,
    },
    transferInput: {
      width: '100%',
    },
    containerInput: {
      width: sizeScale(182),
      height: sizeScale(32),
      marginBottom: sizeScale(5),
    },
    inputStyle: {
      textAlign: 'center',
      color: colors.primary4,
    },
    dropdownBox: {
      backgroundColor: colors.background,
      height: sizeScale(40),
      width: sizeScale(110),
      justifyContent: 'center',
      borderRadius: sizeScale(100),
      borderColor: colors.white,
      borderWidth: 1,
      paddingHorizontal: sizeScale(6),
    },
    placeholderStyle: {
      color: colors.white,
      fontSize: sizeScale(16),
      fontFamily: FontDefault.notoSansBold,
      fontWeight: '700',
    },
    content: {
      paddingTop: sizeScale(8),
    },
  });
  return { styles, colors };
};
