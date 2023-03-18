import { StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sizeScale } from '@src/common';
import { useTheme } from '@src/themes';

export const useAuthStyle = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    newPasswordText: {
      marginBottom: sizeScale(30),
    },
    newPasswordPressText: {
      marginStart: sizeScale(10),
    },
    newPasswordButtonText: {
      position: 'absolute',
      bottom: sizeScale(10),
      width: '95%',
      alignSelf: 'center',
    },
    newWalletButton: {
      justifyContent: 'center',
      backgroundColor: colors.primary3,
      borderColor: '#3A1D59',
      borderWidth: 1,
    },
    newWalletButtonText: {
      textAlign: 'center',
      lineHeight: sizeScale(45),
      marginHorizontal: sizeScale(2),
    },
    newWalletBlur: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    newWalletImage: {
      width: sizeScale(25),
      aspectRatio: 1,
      position: 'absolute',
      alignSelf: 'center',
    },
    newWalletText: {
      marginStart: sizeScale(10),
    },
    newWalletText1: {
      textAlign: 'center',
      lineHeight: sizeScale(45),
      marginHorizontal: sizeScale(2),
      paddingHorizontal: sizeScale(12),
    },
    newWalletButtonText1: {
      position: 'absolute',
      bottom: sizeScale(10),
      width: '95%',
      alignSelf: 'center',
    },
    successButtonText: {
      position: 'absolute',
      bottom: sizeScale(10),
      width: '95%',
      alignSelf: 'center',
      backgroundColor: colors.primary,
    },
    passwordButtonText: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 1,
      flex: 1,
    },
    passwordButtonText1: {
      flex: 1,
    },
    passwordText: {
      marginBottom: sizeScale(30),
    },
    passwordInput: {
      textAlign: 'center',
      marginTop: sizeScale(20),
    },
    passwordBox: {
      position: 'absolute',
      bottom: insets.bottom,
      width: '100%',
    },
    passwordButtonText2: {
      width: '95%',
      alignSelf: 'center',
    },
    passwordButtonText3: {
      width: '95%',
      alignSelf: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.white,
    },
    importSuccess: {
      position: 'absolute',
      bottom: sizeScale(10),
      width: '95%',
      alignSelf: 'center',
      backgroundColor: colors.primary,
    },
    importWalletContainer: { flex: 1 },
    importWalletText: {
      marginVertical: sizeScale(20),
    },
    importWalletText1: {
      textAlign: 'center',
    },
    importWalletButton: {
      width: '95%',
      alignSelf: 'center',
    },
    importWalletButtonText: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.white,
      width: '95%',
      alignSelf: 'center',
    },
    loginImage: {
      flex: 1,
    },
    loginButtonText: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.white,
    },
    skeleton: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 9999,
    },
    blurView: {
      ...StyleSheet.absoluteFillObject,
      top: 1,
      left: 1,
      bottom: 1,
      right: 1,
    },
  });
  return { colors, styles };
};
