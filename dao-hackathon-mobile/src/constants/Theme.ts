import { Dimensions, StyleSheet } from 'react-native';

import R from '@src/assets/R';

const { width, height } = Dimensions.get('window');

const dimension = {
  width,
  height,
};

const colors = {
  white: '#ffffff',
  black: '#000000',
  primary: '#7D31AE',
  primary2: '#253754',
  arrive: '#BC2781',
  border: 'rgba(255, 255, 255, 0.5)',
  background_input: 'rgba(255, 255, 255, 0.05)',
  background_blur: 'rgba(0, 0, 0, 0.7)',
  text_light: '#685A78',
  text_medium: '#7C7C7C',
  text_money: '#C5C5C5',
  text_title: '#B5B5B5',
  text_success: '#0DE463',
  background: '#211134',
  primary3: '#28143E',
  primary4: '#38D3F3',
  primary5: '#1096B1',
  primary6: '#371B57',
  primary7: '#685A78',
  error: '#D60A0A',
  indicator: '#00A69C',
  gradient: ['#00FFA3', '#03E1FF', '#DC1FFF'],
  text: '#000000',
  line: '#DADADA',
  button: '#518EF8',
  placeholder: '#F0F2F5',
  placeholderText: '#979797',
};

const sizes = {};

const fonts = StyleSheet.create({
  regular12: {
    fontSize: 12,
    fontFamily: R.fonts.notosans_regular,
    fontWeight: '400',
    lineHeight: 16.34,
  },
  regular14: {
    fontSize: 14,
    fontFamily: R.fonts.notosans_regular,
    fontWeight: '400',
    lineHeight: 19.07,
  },
  regular20: {
    fontSize: 20,
    fontFamily: R.fonts.notosans_regular,
    fontWeight: '400',
    lineHeight: 27.07,
  },
  regular16: {
    fontSize: 16,
    fontFamily: R.fonts.notosans_regular,
    fontWeight: '400',
    lineHeight: 21.79,
  },
  bold14: {
    fontSize: 14,
    fontFamily: R.fonts.notosans_bold,
    fontWeight: '700',
    lineHeight: 19.07,
  },
  medium14: {
    fontSize: 14,
    fontFamily: R.fonts.notosans_medium,
    fontWeight: '500',
    lineHeight: 19.07,
  },
  bold16: {
    fontSize: 16,
    fontFamily: R.fonts.notosans_bold,
    fontWeight: '700',
    lineHeight: 21.79,
  },
  bold20: {
    fontSize: 20,
    fontFamily: R.fonts.notosans_bold,
    fontWeight: '700',
    lineHeight: 27.24,
  },
  bold36: {
    fontSize: 36,
    fontFamily: R.fonts.notosans_bold,
    fontWeight: '700',
    lineHeight: 49.03,
  },
  bold40: {
    fontSize: 40,
    fontFamily: R.fonts.notosans_bold,
    fontWeight: '700',
    lineHeight: 54.48,
  },
});

export { colors, sizes, fonts, dimension };
