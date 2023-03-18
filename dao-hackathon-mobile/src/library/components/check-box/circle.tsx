import React, { useCallback, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { onCheckType } from '@common';

import { styles } from './styles';
import { CheckboxProps } from './type';

import { Icon } from '../icon';
import { Text } from '../text';

export const CircleCheckbox = ({
  disable,
  onToggle,
  initialValue = false,
  value,
  text,
  tx,
}: CheckboxProps) => {
  // state
  const [localValue, setLocalValue] = useState<boolean>(initialValue);

  const checked = useMemo<boolean>(
    () => value ?? localValue,
    [localValue, value],
  );

  // function
  const onPress = useCallback(() => {
    if (typeof value === 'boolean') {
      if (onCheckType(onToggle, 'function')) {
        onToggle && onToggle(!value);
      }
    } else {
      if (onCheckType(onToggle, 'function')) {
        onToggle && onToggle(!localValue);
      }
      setLocalValue(v => !v);
    }
  }, [localValue, onToggle, value]);

  // render
  return (
    <TouchableOpacity disabled={disable} onPress={onPress}>
      <View style={[styles.row]}>
        <Icon
          colorTheme={checked ? 'text_success' : 'white'}
          icon={checked ? 'check_circle_on' : 'check_circle_off'}
        />
        <Text
          style={[styles.label]}
          tx={tx}
          text={text}
          colorTheme={'white'}
          preset="notoSanBody3Regular"
        />
      </View>
    </TouchableOpacity>
  );
};
