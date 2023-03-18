import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import Modal from 'react-native-modal';

import R from '@src/assets/R';

import FastImg from './FastImg';
import { useComponentsStyle } from './styles';
import { ModalViewProps } from './type';

const ModalView = ({
  contentView,
  isVisible,
  backdrop = true,
  setClose,
  onModalHide,
  contentStyle,
  hideCloseButton = false,
}: ModalViewProps) => {
  //func
  const { styles, colors } = useComponentsStyle();
  const renderCloseButton = () => {
    return (
      <TouchableOpacity
        onPress={() => setClose(false)}
        style={styles.modalViewContainer}
        children={
          <FastImg
            style={styles.modalViewImage}
            source={R.images.ic_close}
            tintColor={colors.primary}
          />
        }
      />
    );
  };

  return (
    <Modal
      onModalHide={() => {
        if (onModalHide) {
          onModalHide();
        }
      }}
      isVisible={isVisible}
      onBackdropPress={() => {
        if (backdrop) {
          setClose(false);
        }
      }}
      backdropColor={'rgba(0,0,0,0.8)'}
      backdropOpacity={0.8}
      animationInTiming={500}
      animationOutTiming={500}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
    >
      <View style={[styles.contentStyle, contentStyle]}>
        {!hideCloseButton && renderCloseButton()}
        {contentView}
      </View>
    </Modal>
  );
};

export default ModalView;
