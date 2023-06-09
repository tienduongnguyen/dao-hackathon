import React from 'react';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

import { CustomOmit } from '@common';
import { Colors, useTheme } from '@theme';
import { IconProps } from 'react-native-vector-icons/Icon';

import { ICONS } from './icon-name';

const VectorIconBase = createIconSetFromIcoMoon(
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./selection.json'),
  'luxIcon',
  'luxIcon.ttf',
);

export type VectorIconName = keyof typeof ICONS;

type VectorIconProps = CustomOmit<IconProps, 'name'> & {
  icon: VectorIconName;
  colorTheme?: keyof Colors;
};

export const VectorIcon = (props: VectorIconProps) => {
  // state
  const { colors } = useTheme();
  // render
  return (
    <VectorIconBase
      size={24}
      {...props}
      name={ICONS[props.icon]}
      color={
        props.colorTheme ? (colors[props.colorTheme] as string) : props.color
      }
    />
  );
};
