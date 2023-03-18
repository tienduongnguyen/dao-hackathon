/* eslint-disable react-native/split-platform-components */
import React, { memo } from 'react';
import { ActionSheetIOS, Platform, TouchableOpacity, View } from 'react-native';

import isEqual from 'react-fast-compare';
import FastImage from 'react-native-fast-image';

import { Picker } from '@react-native-picker/picker';
import R from '@src/assets/R';
import { Block } from '@src/library/components';

import { useComponentsStyle } from './styles';
import { DropdownProps } from './type';
import WText from './WText';

export default memo((props: DropdownProps) => {
  //func
  const { styles, colors } = useComponentsStyle();
  const { data, onSelect, value, title, error, disabled } = props;
  const d =
    Platform.select({
      android: data,
      ios: [...data, R.strings().create_account],
    }) || [];
  const backgroundColor = (error ? colors.error : colors.primary4) + '20';
  const textColor = error ? colors.error : colors.primary3;
  return (
    <>
      <Block
        direction="row"
        paddingVertical={10}
        borderRadius={5}
        paddingHorizontal={10}
        style={{ backgroundColor: backgroundColor }}
      >
        <WText
          color={textColor}
          style={styles.dropdownText}
          font="medium14"
          children={title}
        />

        {Platform.select({
          android: (
            <View style={styles.dropdownView}>
              <Picker
                enabled={!disabled}
                selectedValue={value}
                onValueChange={onSelect}
              >
                {d.map((elem, i) => (
                  <Picker.Item
                    color={colors.primary4}
                    key={i}
                    value={elem}
                    label={elem}
                  />
                ))}
              </Picker>
            </View>
          ),
          ios: (
            <TouchableOpacity
              disabled={disabled}
              style={styles.dropdownButton}
              onPress={() => {
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    options: d,
                    cancelButtonIndex: d.length - 1,
                  },
                  buttonIndex => {
                    if (buttonIndex === d.length - 1) {
                      return;
                    }
                    if (onSelect) {
                      onSelect(data[buttonIndex], buttonIndex);
                    }
                  },
                );
              }}
            >
              <WText font="bold16" color={colors.primary4} children={value} />
              <FastImage
                style={styles.dropdownImage}
                source={R.images.ic_back}
              />
            </TouchableOpacity>
          ),
        })}
      </Block>
      {!!error && (
        <WText
          color={colors.error}
          style={styles.imageText}
          font="regular12"
          children={error}
        />
      )}
    </>
  );
}, isEqual);
