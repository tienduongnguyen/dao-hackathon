import { StyleSheet } from 'react-native';

import { sizeScale } from '@src/common';
import { dimension } from '@src/constants';
import { useTheme } from '@src/themes';

export const useStackStyle = () => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    addressDetailButtonText: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 1,
      flex: 1,
    },
    addressDetailButtonText1: {
      flex: 1,
    },
    addressDetailText: {
      margin: sizeScale(20),
    },
    addressDetailInput: {
      marginHorizontal: sizeScale(20),
    },
    addressDetailError: {
      marginStart: sizeScale(20),
    },
    addressDetailButtonText2: {
      width: '90%',
      position: 'absolute',
      bottom: sizeScale(20),
      alignSelf: 'center',
    },
    addressDetailText1: {
      margin: sizeScale(20),
      alignSelf: 'center',
    },
    addressDetailText2: {
      marginHorizontal: sizeScale(20),
    },
    addressDetailText3: {
      margin: sizeScale(10),
      maxWidth: '80%',
    },
    addressDetailText4: {
      paddingHorizontal: sizeScale(50),
      textAlign: 'center',
    },
    confirmBtn: {
      marginLeft: sizeScale(10),
    },
    addressDetailButtonText3: {
      marginVertical: sizeScale(10),
      marginTop: sizeScale(30),
    },
    addressDetailButtonText4: {
      marginVertical: sizeScale(10),
    },
    addressDetailButtonText5: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 1,
      marginVertical: sizeScale(10),
    },
    createAddressBox: {
      marginHorizontal: sizeScale(15),
    },
    createAddressInput: {
      padding: sizeScale(10),
      borderWidth: 1,
      backgroundColor: colors.background_input,
      borderColor: colors.primary6,
    },
    createAddressInputName: {
      borderWidth: 1,
      backgroundColor: colors.background_input,
      borderColor: colors.primary6,
    },
    createAddressButtonText: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 1,
    },
    createAddressBox1: {
      marginHorizontal: sizeScale(20),
    },
    selectNFTButtonText: {
      position: 'absolute',
      width: '95%',
      bottom: sizeScale(5),
      alignSelf: 'center',
    },
    selectNFTButtonText1: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 1,
      flex: 1,
    },
    selectNFTText: {
      padding: sizeScale(10),
    },
    selectNFTText1: {
      marginHorizontal: sizeScale(15),
    },
    selectNFTButtonText2: {
      flex: 1,
    },
    imageViewImage: {
      width: '100%',
      height: '97%',
      alignSelf: 'center',
    },
    imageViewButton: {
      position: 'absolute',
      top: sizeScale(40),
      right: sizeScale(20),
      backgroundColor: 'rgba(225,225,225,0.6)',
      padding: sizeScale(10),
      borderRadius: sizeScale(30),
      overflow: 'hidden',
    },
    imageViewImage1: {
      width: 10,
      aspectRatio: 1,
    },
    nftManualText: {
      marginHorizontal: sizeScale(15),
    },
    nftManualTextInput: {
      marginVertical: sizeScale(10),
    },
    nftManualButtonText: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 1,
      flex: 1,
    },
    nftManualButtonText1: {
      flex: 1,
    },
    nftManualContent: {
      paddingBottom: sizeScale(100),
    },
    exportPrivateKey: {
      paddingBottom: sizeScale(15),
    },
    nftManualScroll: {
      marginHorizontal: sizeScale(15),
    },
    nftManualButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: sizeScale(10),
      marginBottom: sizeScale(25),
      height: sizeScale(195),
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.primary6,
    },
    nftManualImage: {
      aspectRatio: 1.31547619048,
      alignSelf: 'center',
      flex: 1,
    },
    nftManualImageIcon: {
      width: sizeScale(25),
      height: sizeScale(25),
    },
    nftManualFastImage: {
      width: sizeScale(25),
      aspectRatio: 1,
    },
    nftManualPreviewButtonText: {
      flex: 1,
      alignSelf: 'center',
      backgroundColor: colors.background_popup,
      borderWidth: 1,
    },
    nftManualBox: {
      width: '100%',
      height: 1,
      backgroundColor: colors.primary6,
    },
    nftManualBox1: {
      position: 'absolute',
      bottom: 0,
      flex: 1,
    },
    nftManualBox2: {
      position: 'absolute',
      bottom: sizeScale(0),
      flex: 1,
    },
    nftManualInput: {
      marginTop: sizeScale(10),
    },
    nftManualPopupButtonText: {
      flex: 1,
      alignSelf: 'center',
    },
    nftScanInput: {
      marginHorizontal: 0,
      marginTop: sizeScale(10),
    },
    qrCodeCamera: {
      width: '100%',
      height: '100%',
    },
    qrCodeImage: {
      width: dimension.width,
      height: '100%',
      position: 'absolute',
    },
    successButtonText: {
      position: 'absolute',
      bottom: sizeScale(10),
      width: '95%',
      alignSelf: 'center',
      backgroundColor: colors.primary,
    },
    addressButtonText: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 1,
    },
    addressButtonText1: {
      flex: 1,
    },
    addressContainer: {
      marginTop: sizeScale(30),
      paddingBottom: sizeScale(30),
    },
    addressText: {
      marginBottom: sizeScale(5),
    },
    addressBox: {
      height: sizeScale(1),
      width: '90%',
      alignSelf: 'center',
      backgroundColor: colors.primary6,
    },
    addressButtonText2: {
      flex: 1,
      marginStart: sizeScale(10),
      marginEnd: sizeScale(5),
    },
    addressButtonText3: {
      flex: 1,
      marginStart: sizeScale(5),
      marginEnd: sizeScale(10),
    },
    addressButtonText4: {
      backgroundColor: 'transparent',
      marginVertical: sizeScale(10),
      borderColor: colors.white,
      borderWidth: 1,
    },
    addressButtonDisable: {
      backgroundColor: 'transparent',
      marginVertical: sizeScale(10),
      borderColor: colors.border,
      borderWidth: 1,
    },
    nftDetailContent: {
      paddingBottom: sizeScale(50),
    },
    nftDetailScroll: {
      padding: sizeScale(16),
    },
    nftDetailImage: {
      width: '100%',
      aspectRatio: 1.75,
      alignSelf: 'center',
      marginBottom: sizeScale(20),
    },
    nftDetailText: {
      marginVertical: sizeScale(10),
    },
    nftDetailText1: {
      marginVertical: sizeScale(15),
    },
    nftDetailBox: {
      flexWrap: 'wrap',
      marginHorizontal: sizeScale(-4),
    },
    nftDetailBox1: {
      borderWidth: 0.5,
      borderRadius: sizeScale(5),
      borderColor: colors.primary5,
      padding: sizeScale(8),
      margin: sizeScale(4),
    },
    previewButtonText: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 1,
      flex: 1,
    },
    previewButtonText1: {
      flex: 1,
    },
    depositBox: {
      padding: sizeScale(15),
      backgroundColor: colors.white,
      borderRadius: sizeScale(20),
      marginBottom: sizeScale(20),
    },
    depositText: {
      marginTop: sizeScale(20),
      paddingHorizontal: sizeScale(10),
      textAlign: 'center',
    },
    depositBox1: {
      paddingHorizontal: sizeScale(40),
    },
    depositText1: {
      marginTop: sizeScale(5),
      textAlign: 'center',
    },
    depositImage: {
      width: sizeScale(20),
      aspectRatio: 1,
      marginTop: sizeScale(10),
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
    swipeBtn: {
      height: sizeScale(98),
      // width: sizeScale(96),
      // paddingLeft: 16,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    content: {
      flexGrow: 1,
    },
  });
  return { colors, styles };
};
