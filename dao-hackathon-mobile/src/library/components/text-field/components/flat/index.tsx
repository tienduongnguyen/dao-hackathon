import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
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

import { useInterpolate, useSharedTransition } from '@animated';
import { enhance, onCheckType } from '@common';
import { Text } from '@components/text';

import { styles } from './styles';
import { InputFlatProps } from './type';

const UN_ACTIVE_COLOR = 'rgb(159,152,146)';
const ACTIVE_COLOR = 'rgb(0,87,231)';
const ERROR_COLOR = 'rgb(214,45,32)';

export const InputFlat = forwardRef<any, InputFlatProps>((props, ref) => {
  // props
  const {
    defaultValue,
    label,
    labelTx,
    placeholder,
    placeholderTx,
    placeholderColor = UN_ACTIVE_COLOR,
    onTextChange,
    trigger,
    nameTrigger,
    inputStyle: inputStyleOverwrite = {},
    name = '',
    errorBorderColor = ERROR_COLOR,
    errorLabelColor = ERROR_COLOR,
    disabledLabelColor = UN_ACTIVE_COLOR,
    activeTintBorderColor = ACTIVE_COLOR,
    activeTintLabelColor = ACTIVE_COLOR,
    unActiveTintBorderColor = UN_ACTIVE_COLOR,
    unActiveTintLabelColor = UN_ACTIVE_COLOR,
    disabledBorderColor = UN_ACTIVE_COLOR,
    disabled = false,
    error = undefined,
    rightChildren = undefined,
    containerStyle: containerStyleOverwrite = {},
    onChangeText,
    onFocus,
    onBlur,
    rxRemove,
    ...rest
  } = props;

  // state
  const [t] = useTranslation();
  const [heightContainerInput, setHeightContainerInput] = useState(0);
  const [focused, setFocused] = useState(false);
  const [localDefaultValue, setLocalDefaultValue] = useState('');
  const [value, setValue] = useState('');

  // reanimated
  const progress = useSharedTransition(focused || value.length > 0, {
    duration: 150,
  });

  const bottom = useInterpolate(
    progress,
    [0, 1],
    [0, heightContainerInput - 10],
  );

  const fontLabel = useInterpolate(progress, [0, 1], [14, 12]);

  const labelColor = useDerivedValue(() => {
    switch (true) {
      case disabled:
        return disabledLabelColor;
      case error !== undefined:
        return errorLabelColor;
      case focused:
        return activeTintLabelColor;
      default:
        return unActiveTintLabelColor;
    }
  });

  const borderColor = useDerivedValue(() => {
    switch (true) {
      case disabled:
        return disabledBorderColor;
      case error !== undefined:
        return errorBorderColor;
      case focused:
        return activeTintBorderColor;
      default:
        return unActiveTintBorderColor;
    }
  });

  // function
  const onLayoutContainerInput = (e: LayoutChangeEvent) => {
    setHeightContainerInput(e.nativeEvent.layout.height);
  };

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
    const actualText =
      rxRemove !== undefined ? text.replace(rxRemove, '') : text;
    if (onCheckType(onTextChange, 'function')) {
      onTextChange(name, actualText);
    }
    if (onCheckType(onChangeText, 'function')) {
      onChangeText(actualText);
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
    setValue(actualText);
  };

  // effect
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
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
    () => enhance([styles.input, inputStyleOverwrite]),
    [inputStyleOverwrite],
  );

  const containerStyle = useMemo(
    () => enhance([styles.container, containerStyleOverwrite]),
    [containerStyleOverwrite],
  );

  // reanimated style
  const wrapLabelStyle = useAnimatedStyle(() => ({
    bottom: bottom.value,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    fontSize: fontLabel.value,
    color: labelColor.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  // render
  return (
    <Animated.View style={[containerStyle, containerAnimatedStyle]}>
      <View style={[styles.content]}>
        {(placeholderTx || placeholder) && value.length === 0 && (
          <View style={[styles.wrapPlaceHolder]} pointerEvents={'none'}>
            <Text
              tx={placeholderTx}
              text={placeHolder}
              color={placeholderColor}
            />
          </View>
        )}
        {labelText && (
          <Animated.View
            pointerEvents={'none'}
            style={[styles.wrapLabel, wrapLabelStyle]}
          >
            <Animated.Text style={[labelStyle]}>
              {labelText ?? ''}
            </Animated.Text>
          </Animated.View>
        )}
        <View style={[styles.flex]} onLayout={onLayoutContainerInput}>
          <TextInput
            defaultValue={localDefaultValue}
            autoCorrect={false}
            selectionColor={activeTintBorderColor}
            underlineColorAndroid={'transparent'}
            clearButtonMode={'never'}
            editable={!disabled}
            style={[inputStyle]}
            ref={ref}
            {...rest}
            onChangeText={_onChangeText}
            onFocus={_onFocus}
            onBlur={_onBlur}
          />
        </View>
        {rightChildren}
      </View>
    </Animated.View>
  );
});
