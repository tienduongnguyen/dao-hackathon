import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { ListRenderItemInfo, TouchableOpacity } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconTypes } from '@src/assets/icon';
import { execFunc, sizeScale } from '@src/common';
import { useTheme } from '@src/themes';

import { listIcons } from './const';
import { styles } from './styles';
import { BottomIconProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { Divider } from '../divider';
import { Icon } from '../icon';
import { ListView } from '../list-view';
import { Modal } from '../modal';
import { Spacer } from '../spacer';
import { Text } from '../text';

//const

export const BottomIcon = forwardRef(
  ({ onChangeItem, onClose, onOpen }: BottomIconProps, ref) => {
    // state
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const keyboardHeight = useSharedValue(insets.bottom);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    // reanimated style
    const wrapStyle = useAnimatedStyle(
      () => ({
        paddingBottom: keyboardHeight.value + 10,
        backgroundColor: colors.background_popup,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }),
      [keyboardHeight.value],
    );

    // function
    const onHideModal = () => {
      setIsVisible(false);
      execFunc(onClose);
    };

    const kexExtractor = useCallback((item, index) => {
      return index.toString();
    }, []);

    const onPressItem = (item: IconTypes) => {
      if (onChangeItem) {
        onChangeItem(item);
      }
      onHideModal();
    };

    const renderIcons = ({ item, index }: ListRenderItemInfo<IconTypes>) => {
      return (
        <Button onPress={() => onPressItem(item)} key={index}>
          <Block
            padding={sizeScale(8)}
            colorTheme={'white'}
            borderRadius={5}
            middle
            block
            justifyContent="center"
            marginRight={1}
          >
            <Icon icon={item} size={40} />
          </Block>
        </Button>
      );
    };

    const renderSeparator = () => {
      return <Spacer height={1} />;
    };
    // effects
    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setIsVisible(true);
        },
        hide: () => {
          setIsVisible(false);
        },
      }),
      [],
    );

    // render
    return (
      <Modal
        isVisible={isVisible}
        hasGesture={false}
        onBackdropPress={onHideModal}
        onModalShow={onOpen}
        onModalHide={onClose}
        animatedIn={'slideInUp'}
        animatedOut={'slideOutDown'}
        backdropOpacity={1}
        backdropColor={'transparent'}
        onBackButtonPress={onHideModal}
        style={styles.modalContainer}
      >
        <Animated.View style={[wrapStyle]}>
          <Block
            direction={'row'}
            paddingVertical={16}
            paddingLeft={16}
            paddingRight={19}
            justifyContent={'space-between'}
            middle
          >
            <Text
              text={'Icon'}
              colorTheme={'white'}
              preset={'notoSanHeading6Bold'}
            />
            <TouchableOpacity onPress={onHideModal}>
              <Icon icon={'close'} colorTheme={'white'} />
            </TouchableOpacity>
          </Block>
          <Divider colorTheme={'primary6'} />
          <ListView
            canRefresh={false}
            data={listIcons}
            numColumns={6}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 30,
            }}
            keyExtractor={kexExtractor}
            renderItem={renderIcons}
            style={[styles.list]}
            onEndReachedThreshold={0.5}
            ItemSeparatorComponent={renderSeparator}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </Modal>
    );
  },
);

export type BottomIcon = {
  show: () => void;
  hide: () => void;
};
