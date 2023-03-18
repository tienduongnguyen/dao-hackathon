import React, { memo, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import isEqual from 'react-fast-compare';
import DateTimePicker from 'react-native-date-picker';

import R from '@src/assets/R';
import { sizeScale } from '@src/common';

import FastImg from './FastImg';
import ModalView from './ModalView';
import { useComponentsStyle } from './styles';
import { DatePickerProps } from './type';
import WText from './WText';

export default memo((props: DatePickerProps) => {
  //func
  const { styles, colors } = useComponentsStyle();
  const { onDateChange, date, title, minimumDate, style, error, disabled } =
    props;
  const [isShow, setShow] = useState(false);
  const backgroundColor = (error ? colors.error : colors.primary4) + '20';

  const textValue = useMemo(() => {
    const dateValue = isNaN(date.getTime()) ? new Date() : date;
    const str = dateValue.toLocaleDateString('vi-VN', {
      day: 'numeric',
      weekday: 'short',
      year: 'numeric',
      month: 'long',
    });
    try {
      const arr = str.split(',');
      return `${arr[1]},${arr[2]}`;
    } catch (err) {
      return str;
    }
  }, [date]);

  //render
  return (
    <>
      <View
        style={[
          {
            backgroundColor: backgroundColor,
          },
          style,
          styles.datePickerContainer,
        ]}
      >
        <View
          style={[styles.common_style, { paddingVertical: sizeScale(8) }]}
          children={
            <>
              <TouchableOpacity
                disabled={disabled}
                style={styles.datePickerButton}
                onPress={() => setShow(!isShow)}
                children={
                  <>
                    <WText
                      font="medium14"
                      color={colors.black}
                      children={textValue}
                    />
                    <FastImg
                      source={R.images.ic_arrow_up}
                      tintColor={colors.black}
                      style={[
                        {
                          transform: [
                            {
                              rotate: !isShow ? '90deg' : '-90deg',
                            },
                          ],
                        },
                        styles.datePickerImage,
                      ]}
                    />
                  </>
                }
              />
              <ModalView
                isVisible={isShow}
                setClose={() => setShow(false)}
                contentStyle={styles.datePickerModal}
                contentView={
                  <>
                    <WText
                      font="bold16"
                      style={styles.dateModalText}
                      color={colors.primary}
                      children={title}
                    />
                    <DateTimePicker
                      minimumDate={minimumDate}
                      mode="date"
                      locale="vi"
                      style={styles.dateTimePicker}
                      onDateChange={onDateChange}
                      androidVariant="nativeAndroid"
                      date={date}
                    />
                  </>
                }
              />
            </>
          }
        />
      </View>
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
