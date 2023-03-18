import React, { useMemo } from 'react';
import {
  Text as ReactNativeText,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';

import { enhance, propsToStyle, sizeScale } from '@common';
import { useTheme } from '@theme';
import { FontDefault } from '@theme/typography';

import { textPresets } from './preset';
import { TextProps } from './type';

import { translate } from '../../utils';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export const Text = (props: TextProps) => {
  // state
  const theme = useTheme();
  const {
    tx,
    txOptions,
    text,
    children,
    flex,
    fontSize,
    fontWeight,
    textDecorationLine,
    fontFamily,
    color,
    center,
    textTransform,
    textAlign,
    fontStyle,
    letterSpacing,
    lineHeight,
    colorTheme,
    preset = 'default',
    style: styleOverride = {},
    ...rest
  } = props;
  const i18nText = useMemo(
    () => tx && translate(tx, txOptions),
    [tx, txOptions],
  );
  const content = useMemo(
    () => i18nText || text || children,
    [i18nText, text, children],
  );

  const styleComponent = useMemo(
    () =>
      enhance([
        [
          textPresets[preset],
          flex === true && styles.flex,
          fontSize && { fontSize: sizeScale(fontSize) },
          fontFamily && { fontFamily: FontDefault[fontFamily] },
          colorTheme && { color: theme.colors[colorTheme] },
          center && { textAlign: 'center' },

          propsToStyle([
            { fontWeight },
            { color },
            { textAlign },
            { textTransform },
            { textDecorationLine },
            { fontStyle },
            { letterSpacing },
            { lineHeight },
          ]),

          enhance([styleOverride]),
        ] as StyleProp<TextStyle>,
      ]),
    [
      flex,
      fontSize,
      fontFamily,
      colorTheme,
      theme.colors,
      center,
      fontWeight,
      color,
      textAlign,
      textTransform,
      textDecorationLine,
      fontStyle,
      letterSpacing,
      lineHeight,
      preset,
      styleOverride,
    ],
  );
  // render
  return (
    <ReactNativeText
      allowFontScaling={false}
      {...rest}
      style={[styleComponent]}
    >
      {content}
    </ReactNativeText>
  );
};
