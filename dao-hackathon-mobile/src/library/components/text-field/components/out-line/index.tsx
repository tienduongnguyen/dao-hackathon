import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

import { enhance, onCheckType, REQUIRED_DOT } from '@common';
import { ErrorInput } from '@components/error-input';
import { useTheme } from '@theme';

import { styles } from './styles';
import { InputOutlineProps } from './type';

import { Text } from '../../../text';

const UN_ACTIVE_COLOR = 'rgb(159,152,146)';

export const InputOutline = forwardRef<any, InputOutlineProps>((props, ref) => {
  // props
  const {
    label,
    labelTx,
    required,
    rxRemove,
    nameTrigger,
    placeholder,
    defaultValue,
    leftChildren,
    labelPresets,
    rightChildren,
    placeholderTx,
    labelColorTheme,
    errorColorTheme,
    placeholderColor,
    errorBorderColor,
    colorThemeRequired,
    activeTintBorderColor,
    unActiveTintBorderColor,
    onBlur,
    trigger,
    onFocus,
    onSubmit,
    onTextChange,
    handleValue,
    onChangeText,
    name = '',
    disabled = false,
    error = undefined,
    inputStyle: inputStyleOverwrite = {},
    disabledBorderColor = UN_ACTIVE_COLOR,
    containerStyle: containerStyleOverwrite = {},
    ...rest
  } = props;

  // state
  const { colors } = useTheme();
  const [t] = useTranslation();
  const [localDefaultValue, setLocalDefaultValue] = useState('');
  const [localValue, setLocalValue] = useState('');
  const [focused, setFocused] = useState(false);

  // reanimated
  const borderColor = useDerivedValue(() => {
    switch (true) {
      case disabled:
        return disabledBorderColor;
      case error !== undefined:
        return errorBorderColor || colors.error;
      case focused:
        return activeTintBorderColor || colors.primary6;
      case localValue.length > 0:
        return colors.primary6;
      default:
        return unActiveTintBorderColor || colors.primary6;
    }
  });

  // function
  const _onFocus = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (onCheckType(onFocus, 'function')) {
      onFocus(e);
    }
    setFocused(true);
  };

  const _onBlur = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (onCheckType(onBlur, 'function')) {
      onBlur(e);
    }
    setFocused(false);
  };

  const _onChangeText = (text: string) => {
    let actualText = rxRemove !== undefined ? text.replace(rxRemove, '') : text;
    if (onCheckType(handleValue, 'function')) {
      actualText = handleValue(text);
    }
    setLocalValue(actualText);
    if (onCheckType(onChangeText, 'function')) {
      onChangeText(actualText);
    }
    if (onCheckType(onTextChange, 'function')) {
      onTextChange(name, actualText);
    }
    if (
      trigger &&
      onCheckType(trigger, 'function') &&
      nameTrigger &&
      onCheckType(nameTrigger, 'string')
    ) {
      setTimeout(() => {
        trigger(nameTrigger);
      }, 0);
    }
  };

  // effect
  useEffect(() => {
    if (defaultValue) {
      setLocalDefaultValue(String(defaultValue));
    }
  }, [defaultValue]);

  // style
  const labelText = useMemo(
    () => (labelTx && t(labelTx)) || label || undefined,
    [labelTx, label, t],
  );

  const placeHolder = useMemo(
    () => (placeholderTx && t(placeholderTx)) || placeholder || '',
    [placeholder, placeholderTx, t],
  );

  const inputStyle = useMemo(
    () => enhance([styles.input, { color: colors.white }, inputStyleOverwrite]),
    [colors.white, inputStyleOverwrite],
  );

  const containerStyle = useMemo(
    () => [
      styles.container,
      { backgroundColor: colors.sub_menu },
      containerStyleOverwrite,
    ],
    [colors.sub_menu, containerStyleOverwrite],
  );

  // reanimated style
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  // render
  return (
    <>
      {labelText && (
        <View pointerEvents={'none'} style={[styles.wrapLabel]}>
          <Text
            preset={labelPresets || 'notoSanBody1Regular'}
            colorTheme={labelColorTheme || 'white'}
          >
            {labelText ?? ''}
          </Text>
          {required && (
            <Text
              preset={'notoSanBody1Regular'}
              colorTheme={colorThemeRequired || 'primary6'}
            >
              {' ' + REQUIRED_DOT}
            </Text>
          )}
        </View>
      )}
      <Animated.View style={[containerStyle, containerAnimatedStyle]}>
        {leftChildren}
        <View style={[styles.flex]}>
          <TextInput
            placeholder={placeHolder}
            placeholderTextColor={placeholderColor || colors.text2}
            defaultValue={localDefaultValue}
            autoCorrect={false}
            editable={!disabled}
            clearButtonMode={'never'}
            selectionColor={activeTintBorderColor}
            style={[inputStyle]}
            ref={ref}
            onSubmitEditing={onSubmit}
            {...rest}
            onChangeText={_onChangeText}
            onFocus={_onFocus}
            onBlur={_onBlur}
          />
        </View>
        {rightChildren}
      </Animated.View>
      {error !== undefined && (
        <ErrorInput error={error} errorColorTheme={errorColorTheme} />
      )}
    </>
  );
});
