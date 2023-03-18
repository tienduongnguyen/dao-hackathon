/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import R from '@src/assets/R';
import { sizeScale } from '@src/common';
import { Block, Spacer } from '@src/library/components';

import FastImg from './FastImg';
import { useComponentsStyle } from './styles';
import { PopupProps } from './type';
import WText from './WText';
import WView from './WView';

export default (props: PopupProps) => {
  //func
  const { styles } = useComponentsStyle();
  const { content, title, onPressClose, image } = props;

  //render
  return (
    <TouchableWithoutFeedback onPress={onPressClose}>
      <View style={styles.popupFull}>
        <Block
          style={[
            { height: image ? sizeScale(120) : sizeScale(338) },
            styles.popupBox,
          ]}
        >
          {!!title && (
            <>
              <Block
                height={60}
                justifyContent="space-between"
                paddingHorizontal={20}
                paddingVertical={20}
                direction="row"
              >
                <WText font="bold16" children={title} />
                <TouchableOpacity onPress={onPressClose}>
                  <FastImg
                    style={styles.popupImage}
                    source={R.images.ic_close}
                  />
                </TouchableOpacity>
              </Block>
              <WView style={styles.popupBox1} />
            </>
          )}
          <Spacer height={18} />
          {content}
        </Block>
      </View>
    </TouchableWithoutFeedback>
  );
};
