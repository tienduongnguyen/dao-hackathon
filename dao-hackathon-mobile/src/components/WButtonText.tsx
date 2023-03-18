import React, { memo } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import isEqual from 'react-fast-compare';

import { useComponentsStyle } from './styles';
import WText, { WTextProps } from './WText';

interface CustomProps {
  TextProps?: WTextProps;
}
type Props = CustomProps & TouchableOpacityProps;
export default memo((props: Props) => {
  //func
  const { styles } = useComponentsStyle();

  //render
  return (
    <TouchableOpacity
      {...props}
      style={[styles.buttonText, props.style]}
      children={
        <WText
          font="regular16"
          color={props.TextProps?.color}
          {...props.TextProps}
        />
      }
    />
  );
}, isEqual);
