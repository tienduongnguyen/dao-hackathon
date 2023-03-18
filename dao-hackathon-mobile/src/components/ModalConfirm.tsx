import React, { memo, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import isEqual from 'react-fast-compare';
import * as Progress from 'react-native-progress';

import ModalView from './ModalView';
import { useComponentsStyle } from './styles';
import { ModalConfirmProps } from './type';
import WText from './WText';

let timeIntervalConfirm: any = null;
let timeStart: any = null;
let isConfirm = false;
export default memo((props: ModalConfirmProps) => {
  //state
  const {
    isVisible,
    setClose,
    time = 3,
    content = 'Xác nhận',
    setConfirm,
  } = props;
  const [currentTime, setCurrentTime] = useState(time);
  useEffect(() => {
    if (isVisible) {
      timeStart = new Date().getTime();
      timeIntervalConfirm = setInterval(() => {
        const timeCheck = new Date().getTime() - timeStart;

        setCurrentTime(time * 1000 - timeCheck);
        if (timeCheck >= time * 1000) {
          clearInterval(timeIntervalConfirm);
          return;
        }
      }, 100);
    }
  }, [isVisible, time]);
  //func
  const { styles, colors } = useComponentsStyle();
  const progress = 1 - currentTime / (time * 1000);

  const close = () => {
    if (setClose) {
      setClose();
    }
    clearInterval(timeIntervalConfirm);
  };

  const isProgressDone = progress >= 1;

  return (
    <ModalView
      isVisible={isVisible}
      setClose={close}
      hideCloseButton
      contentStyle={styles.modalBox}
      onModalHide={() => {
        if (setConfirm && isConfirm) {
          setConfirm();
          isConfirm = false;
        }
      }}
      contentView={
        <>
          <WText
            font="bold16"
            style={styles.modalConfirmText}
            children={content}
          />
          <View style={styles.modalConfirmBox}>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={() => {
                isConfirm = false;
                close();
              }}
            >
              <WText color={colors.error} font="bold16" children="Huỷ" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!isProgressDone}
              style={[
                {
                  paddingVertical: !isProgressDone ? 0 : 15,
                  backgroundColor: !isProgressDone
                    ? colors.error + '11'
                    : colors.primary4 + '11',
                },
                styles.modalConfirmProgress,
              ]}
              onPress={() => {
                close();
                isConfirm = true;
              }}
            >
              {!isProgressDone ? (
                <Progress.Pie
                  color={colors.error}
                  unfilledColor={colors.error + '11'}
                  progress={progress}
                  size={35}
                />
              ) : (
                <WText
                  color={colors.primary4}
                  font="bold16"
                  children="Xác nhận"
                />
              )}
            </TouchableOpacity>
          </View>
        </>
      }
    />
  );
}, isEqual);
