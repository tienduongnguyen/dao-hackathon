import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEvent,
  KeyboardEventName,
  Platform,
  TouchableOpacity,
} from 'react-native';

import { TextInput } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VectorIconName } from '@src/assets/vector-icon/vector-icon';
import { execFunc, isIos } from '@src/common';
import { sharedTiming } from '@src/common/animated';
import { Description } from '@src/screens/main/stack/nft/customize/design-card/type';
import { useTheme } from '@src/themes';

import { styles } from './styles';
import { Toolbar } from './toolbar';
import { BottomInputProps, Option } from './type';

import { Block } from '../block';
import { Divider } from '../divider';
import { Icon } from '../icon';
import { Modal } from '../modal';
import { Text } from '../text';

//const
type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
const TEXT_ALIGN: Array<TextAlign> = ['left', 'center', 'right'];

export const BottomInput = forwardRef(
  ({ onChangeText, onChangeStyle, onClose }: BottomInputProps, ref) => {
    // state
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [mounted, setMounted] = useState<boolean>(false);
    const keyboardHeight = useSharedValue(insets.bottom);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const inputRef = useRef<TextInput>(null);
    const [description, setDescription] = useState<Description>(
      {} as Description,
    );
    const [currentToolbar, setCurrentToolbar] = useState<
      'default' | 'text-size' | 'color'
    >('default');

    const textStyle = useMemo(() => {
      return {
        fontSize: (description.fontSize ?? 0) + 6,
        color: description.color,
        fontWeight: description.fontWeight,
        textDecorationLine: description.textDecorationLine,
        fontStyle: description.fontStyle,
        textAlign: description.textAlign,
      };
    }, [description]);

    // reanimated style
    const wrapStyle = useAnimatedStyle(
      () => ({
        paddingBottom: keyboardHeight.value + (isIos ? 10 : 24),
        backgroundColor: colors.background_popup,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }),
      [keyboardHeight.value],
    );

    // function
    const onTextChange = (text: string) => {
      onChangeText(text);
      setDescription({ ...description, text });
    };

    const onHideModal = () => {
      setIsVisible(false);
      setCurrentToolbar('default');
      execFunc(onClose);
    };

    const onSetDidMount = useCallback(() => {
      setMounted(true);
      keyboardHeight.value = insets.bottom;
      inputRef.current?.focus();
    }, [insets.bottom, keyboardHeight]);

    const onSetUnMount = useCallback(() => {
      keyboardHeight.value = insets.bottom;
      setMounted(false);
    }, [insets.bottom, keyboardHeight]);

    const onKeyboardShow = useCallback(
      (e: KeyboardEvent) => {
        keyboardHeight.value = sharedTiming(
          e.endCoordinates.height + (isIos ? 0 : insets.bottom),
        );
      },
      [insets.bottom, keyboardHeight],
    );

    const onKeyboardHide = useCallback(() => {
      keyboardHeight.value = sharedTiming(insets.bottom);
    }, [insets.bottom, keyboardHeight]);

    const onPressBold = useCallback(() => {
      if (description.fontWeight === '400') {
        setDescription({ ...description, fontWeight: 'bold' });
        onChangeStyle('fontWeight', 'bold');
      } else {
        setDescription({ ...description, fontWeight: '400' });
        onChangeStyle('fontWeight', '400');
      }
    }, [description, onChangeStyle]);

    const onPressItalic = useCallback(() => {
      if (description.fontStyle === 'normal') {
        setDescription({ ...description, fontStyle: 'italic' });
        onChangeStyle('fontStyle', 'italic');
      } else {
        setDescription({ ...description, fontStyle: 'normal' });
        onChangeStyle('fontStyle', 'normal');
      }
    }, [description, onChangeStyle]);

    const onPressUnderline = useCallback(() => {
      if (description.textDecorationLine === 'none') {
        setDescription({ ...description, textDecorationLine: 'underline' });
        onChangeStyle('textDecorationLine', 'underline');
      } else {
        setDescription({ ...description, textDecorationLine: 'none' });
        onChangeStyle('textDecorationLine', 'none');
      }
    }, [description, onChangeStyle]);

    const onPressTextAlign = useCallback(() => {
      const index = TEXT_ALIGN.indexOf(description.textAlign);
      if (index === -1) {
        setDescription({ ...description, textAlign: TEXT_ALIGN[1] });
        onChangeStyle('textAlign', TEXT_ALIGN[1]);
      } else {
        if (index === TEXT_ALIGN.length - 1) {
          setDescription({ ...description, textAlign: TEXT_ALIGN[0] });
          onChangeStyle('textAlign', TEXT_ALIGN[0]);
        } else {
          setDescription({ ...description, textAlign: TEXT_ALIGN[index + 1] });
          onChangeStyle('textAlign', TEXT_ALIGN[index + 1]);
        }
      }
    }, [description, onChangeStyle]);

    const onPressTextSize = useCallback(() => {
      setCurrentToolbar('text-size');
    }, []);

    const onPressColor = useCallback(() => {
      setCurrentToolbar('color');
    }, []);

    const onPressDefault = useCallback(() => {
      setCurrentToolbar('default');
    }, []);

    const onChangeColor = useCallback(
      (color: string) => {
        setDescription({ ...description, color: color });
        onChangeStyle('color', color);
      },
      [description, onChangeStyle],
    );

    const onChangeTextSize = useCallback(
      (size: number) => {
        setDescription({ ...description, fontSize: size });
        onChangeStyle('fontSize', size);
      },
      [description, onChangeStyle],
    );

    // effects
    useImperativeHandle(
      ref,
      () => ({
        show: (selectedDescription: Description) => {
          if (selectedDescription) {
            setDescription(selectedDescription);
          }
          setIsVisible(true);
        },
        hide: () => {
          setIsVisible(false);
        },
      }),
      [],
    );

    useEffect(() => {
      if (mounted) {
        Keyboard.addListener(
          Platform.select({
            android: 'keyboardDidShow',
            ios: 'keyboardWillShow',
          }) as KeyboardEventName,
          onKeyboardShow,
        );
        Keyboard.addListener(
          Platform.select({
            android: 'keyboardDidHide',
            ios: 'keyboardWillHide',
          }) as KeyboardEventName,
          onKeyboardHide,
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    // toolbar data
    const toolbarData = useMemo<Array<Option>>(() => {
      return [
        {
          id: '1',
          icon: 'text_size',
          callback: onPressTextSize,
        },
        {
          id: '2',
          icon: 'bx_bold',
          callback: onPressBold,
        },
        {
          id: '3',
          icon: 'bx_italic',
          callback: onPressItalic,
        },
        {
          id: '4',
          icon: 'bx_underline',
          callback: onPressUnderline,
        },
        {
          id: '5',
          icon: `${
            description.textAlign ? description.textAlign : 'left'
          }_align` as VectorIconName,
          callback: onPressTextAlign,
        },
        {
          id: '6',
          icon: 'color_palette',
          callback: onPressColor,
        },
      ];
    }, [
      description.textAlign,
      onPressBold,
      onPressColor,
      onPressItalic,
      onPressTextAlign,
      onPressTextSize,
      onPressUnderline,
    ]);

    // render
    return (
      <Modal
        isVisible={isVisible}
        hasGesture={false}
        onBackdropPress={onHideModal}
        onModalShow={onSetDidMount}
        onModalHide={onSetUnMount}
        animatedIn={'slideInUp'}
        animatedOut={'slideOutDown'}
        backdropOpacity={1}
        backdropColor={'transparent'}
        onBackButtonPress={onHideModal}
        style={styles.modalContainer}
        customBackDrop={
          <Animated.View style={[styles.backdropContainer]}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoiding}
            >
              <TextInput
                ref={inputRef}
                defaultValue={description.text}
                onChangeText={onTextChange}
                multiline
                style={[styles.input, textStyle]}
                maxLength={256}
              />
            </KeyboardAvoidingView>
          </Animated.View>
        }
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
              text={'Text'}
              colorTheme={'white'}
              preset={'notoSanHeading6Bold'}
            />
            <TouchableOpacity onPress={onHideModal}>
              <Icon icon={'close'} colorTheme={'white'} />
            </TouchableOpacity>
          </Block>
          <Divider colorTheme={'primary6'} />
          <Toolbar
            type={currentToolbar}
            data={toolbarData}
            selected={description}
            onPressDefault={onPressDefault}
            onChangeColor={onChangeColor}
            onChangeSize={onChangeTextSize}
          />
        </Animated.View>
      </Modal>
    );
  },
);

export type BottomInput = {
  show: (selectedDescription: Description) => void;
  hide: () => void;
};
