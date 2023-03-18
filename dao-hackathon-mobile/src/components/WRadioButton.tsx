import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import isEqual from 'react-fast-compare';

import { useComponentsStyle } from './styles';
import { RadioButtonProps } from './type';
import WText from './WText';

export default memo(
  ({ description, isSelect, text, onPress }: RadioButtonProps) => {
    //func
    const { styles, colors } = useComponentsStyle();
    return (
      <>
        <TouchableOpacity
          onPress={onPress}
          style={styles.radioButton}
          children={
            <>
              <View>
                <WText font="medium14" children={text} color={colors.primary} />
                {!!description && (
                  <WText
                    font="medium14"
                    children={description}
                    style={styles.radioButtonText}
                    color={colors.text_medium}
                  />
                )}
              </View>
              <TouchableOpacity
                style={[
                  {
                    borderColor: isSelect ? colors.primary : colors.text2,
                  },
                  styles.radioButtonTouchable,
                ]}
              >
                {!!isSelect && <View style={styles.radioButtonBox} />}
              </TouchableOpacity>
            </>
          }
        />
        <View style={styles.radioButtonBox1} />
      </>
    );
  },
  isEqual,
);
