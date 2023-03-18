import React, { memo, useState } from 'react';
import {
  Platform,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import isEqual from 'react-fast-compare';

import { fonts } from '@src/constants';
import { Icon } from '@src/library/components';

import { WText } from '.';

import { useComponentsStyle } from './styles';
import { CustomInputProps } from './type';

type Props = CustomInputProps & TextInputProps;

export default memo((props: Props) => {
  //func
  const { colors, styles } = useComponentsStyle();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const {
    note,
    font = 'regular16',
    containerStyle,
    prefix,
    errorMessage,
    isError,
    errorStyle,
    useEye = false,
  } = props;

  const toggleShowPassword = () => {
    setIsVisible(v => !v);
  };

  //render
  return (
    <>
      <View
        style={[
          {
            borderColor: isError ? colors.error : colors.primary6,
          },
          styles.inputBox,
          containerStyle,
        ]}
        children={
          <>
            {!!prefix && <WText children={prefix} />}
            <TextInput
              ref={props.refInput}
              maxLength={props.maxLength || 50}
              placeholderTextColor={colors.text2}
              {...props}
              secureTextEntry={useEye && !isVisible}
              multiline={props.multiline || note}
              style={[
                {
                  flex: 1,
                  paddingVertical: Platform.select({
                    android: 10,
                    ios: 12,
                  }),
                  paddingHorizontal: 10,
                  height: note ? 100 : undefined,
                  textAlignVertical: note ? 'top' : 'center',
                  paddingTop: note ? 15 : undefined,
                  color: colors.white,
                },
                {
                  ...fonts[font],
                },
                props.style,
              ]}
            />
            {props.child}
            {useEye && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: '3%',
                  top: '25%',
                }}
                onPress={toggleShowPassword}
                children={
                  <Icon
                    size={24}
                    icon={isVisible ? 'eye' : 'eye_close'}
                    colorTheme="white"
                  />
                }
              />
            )}
          </>
        }
      />
      {!!isError && (
        <WText
          font="regular16"
          style={[{ marginStart: 5 }, errorStyle, containerStyle]}
          color={colors.error}
          children={errorMessage}
        />
      )}
    </>
  );
}, isEqual);
