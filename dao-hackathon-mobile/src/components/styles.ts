import { Dimensions, Platform, StyleSheet } from 'react-native';

import { sizeScale } from '@src/common';
import { useTheme } from '@src/themes';
import { isIphoneX } from '@src/utils';

const { width } = Dimensions.get('window');
export const useComponentsStyle = () => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    emptyContainer: {
      flex: 1,
    },
    boxEmpty: {
      alignItems: 'center',
      flex: 1,
      marginHorizontal: sizeScale(15),
      marginTop: sizeScale(196),
    },
    boxText: {
      textAlign: 'center',
      paddingHorizontal: sizeScale(10),
    },
    imageContainer: {
      backgroundColor: colors.black,
      flex: 1,
      overflow: 'hidden',
    },
    imageIndicator: {
      flex: 1,
    },
    imageText: {
      marginHorizontal: sizeScale(25),
    },
    imageButton: {
      overflow: 'hidden',
    },
    modal_icon_input: {
      width: sizeScale(25),
      aspectRatio: 1,
      alignSelf: 'center',
      marginStart: sizeScale(15),
    },
    input_edit: {
      margin: sizeScale(15),
      borderBottomWidth: 0.8,
      padding: 0,
      width: '80%',
      fontSize: sizeScale(16),
    },
    textModalContainer: {
      flexDirection: 'row',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingProgressContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      elevation: Platform.OS === 'android' ? 4 : 0,
      zIndex: 9999,
    },
    popupFull: {
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      height: '100%',
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      elevation: Platform.OS === 'android' ? 4 : 0,
    },
    loadingProgressBox: {
      height: sizeScale(140),
      backgroundColor: 'white',
      padding: sizeScale(30),
      borderRadius: sizeScale(10),
    },
    image: {
      width: width / 2,
      height: width / 2,
      resizeMode: 'contain',
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: '10%',
      paddingVertical: sizeScale(12),
      borderRadius: sizeScale(50),
    },
    textReload: {
      fontSize: sizeScale(14),
      color: 'white',
    },
    description: {
      fontSize: sizeScale(16),
      color: colors.black,
      marginTop: sizeScale(8),
      marginBottom: '10%',
    },
    modalConfirmText: {
      textAlign: 'center',
      margin: sizeScale(30),
      lineHeight: sizeScale(30),
      alignSelf: 'center',
    },
    modalConfirmButton: {
      padding: sizeScale(15),
      backgroundColor: colors.error + '11',
      flex: 1,
      borderRadius: sizeScale(5),
      margin: sizeScale(10),
      alignItems: 'center',
    },
    modalConfirmProgress: {
      paddingHorizontal: sizeScale(15),
      flex: 1,
      borderRadius: 5,
      margin: sizeScale(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalViewContainer: {
      position: 'absolute',
      top: sizeScale(5),
      right: sizeScale(5),
      zIndex: sizeScale(15),
    },
    contentStyle: {
      width: width * 0.9,
      backgroundColor: 'white',
      borderRadius: 5,
      alignSelf: 'center',
      padding: 0,
    },
    modalViewImage: {
      width: sizeScale(30),
      aspectRatio: 1,
    },
    popupBox: {
      width: '100%',
      overflow: 'hidden',
      backgroundColor: colors.background_popup,
      borderTopRightRadius: sizeScale(20),
      borderTopLeftRadius: sizeScale(20),
    },
    popupImage: {
      width: sizeScale(15),
      aspectRatio: 1,
    },
    popupBox1: {
      width: '100%',
      backgroundColor: colors.primary6,
      height: sizeScale(1),
    },
    headerContainer: {
      paddingTop: sizeScale(25),
      backgroundColor: colors.background,
      flexDirection: 'row',
      height: Platform.OS === 'ios' ? (isIphoneX() ? 95 : 80) : 80,
    },
    headerImage: {
      width: sizeScale(24),
      aspectRatio: 1,
    },
    headerText: {
      textAlign: 'center',
    },
    leftComp: {},
    menuListImage: {
      width: sizeScale(24),
      aspectRatio: 1,
    },
    screenBody: { flex: 1 },
    screenBodyConfig: {
      flex: 1,
      backgroundColor: colors.background,
    },
    buttonText: {
      backgroundColor: colors.primary,
      padding: sizeScale(10),
      justifyContent: 'center',
      alignItems: 'center',
      margin: sizeScale(16),
      borderRadius: sizeScale(100),
    },
    datePickerContainer: {
      flexDirection: 'row',
      marginVertical: 10,
      borderRadius: 5,
      marginHorizontal: 15,
    },
    common_style: {
      borderRadius: sizeScale(5),
      borderWidth: sizeScale(0.5),
      borderColor: colors.border,
      paddingHorizontal: sizeScale(10),
      flex: 1,
      backgroundColor: colors.white,
    },
    datePickerButton: {
      paddingVertical: sizeScale(8),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    datePickerModal: {
      borderRadius: sizeScale(5),
      padding: sizeScale(10),
      justifyContent: 'center',
    },
    dateModalText: { margin: sizeScale(15), textAlign: 'center' },
    dropdownText: {
      alignSelf: 'center',
      flex: 0.6,
      paddingStart: sizeScale(15),
    },
    dropdownView: {
      borderRadius: sizeScale(5),
      borderWidth: sizeScale(0.5),
      borderColor: colors.border,
      flex: 1.1,
      backgroundColor: colors.white,
    },
    dropdownButton: {
      borderRadius: sizeScale(5),
      borderWidth: sizeScale(0.5),
      padding: sizeScale(10),
      paddingVertical: sizeScale(15),
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.white,
      flex: 1,
    },
    radioButton: {
      paddingBottom: sizeScale(12),
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: width - 35,
    },
    radioButtonText: {
      maxWidth: '95%',
      marginTop: sizeScale(5),
    },
    radioButtonBox: {
      backgroundColor: colors.primary,
      width: sizeScale(10),
      aspectRatio: 1,
      borderRadius: sizeScale(5),
    },
    radioButtonTouchable: {
      width: sizeScale(18),
      aspectRatio: 1,
      borderWidth: sizeScale(2),
      borderRadius: sizeScale(9),
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonBox1: {
      height: sizeScale(1),
      width: width - 30,
      backgroundColor: colors.line,
      marginBottom: sizeScale(12),
    },
    scrollTabBar: {
      marginTop: sizeScale(15),
    },
    scrollUnderline: {
      borderRadius: sizeScale(3),
      backgroundColor: colors.primary,
    },
    checkBoxImage: {
      width: sizeScale(12),
      aspectRatio: 1,
      alignSelf: 'center',
    },
    checkBoxButton: {
      borderWidth: 1,
      width: sizeScale(20),
      aspectRatio: 1,
      justifyContent: 'center',
    },
    dropdownImage: {
      width: sizeScale(15),
      aspectRatio: 1,
      alignSelf: 'center',
      transform: [{ rotate: '-180deg' }],
    },
    inputBox: {
      flexDirection: 'row',
      borderWidth: 1,
      alignItems: 'center',
      paddingStart: sizeScale(5),
      backgroundColor: colors.sub_menu,
    },
    progressText: {
      color: colors.primary,
    },
    headerBox: {
      flex: 1,
      justifyContent: 'center',
      paddingStart: sizeScale(15),
    },
    headerBox1: {
      flex: 8,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    headerBox2: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingEnd: sizeScale(15),
    },
    modalBox: {
      borderRadius: sizeScale(5),
      padding: sizeScale(10),
    },
    modalConfirmBox: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    dateTimePicker: {
      alignSelf: 'center',
    },
    datePickerImage: {
      width: sizeScale(20),
      aspectRatio: 1,
      alignSelf: 'center',
    },
  });
  return { styles, colors };
};
