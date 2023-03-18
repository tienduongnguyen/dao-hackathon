import { sizeScale } from '@src/common';

import { OptionColor, OptionSize } from './type';

export const TEXT_SIZE: Array<OptionSize> = [
  { id: '1', size: sizeScale(14), name: 'Small' },
  { id: '2', size: sizeScale(16), name: 'Regular' },
  { id: '3', size: sizeScale(18), name: 'Large' },
];

export const LIST_COLOR: Array<OptionColor> = [
  { id: '1', color: '#000000' },
  { id: '2', color: '#2860F5' },
  { id: '3', color: '#65C466' },
  { id: '4', color: '#F7CD45' },
  { id: '5', color: '#EA4D3E' },
  { id: '6', color: '#FFFFFF' },
  { id: '7', color: '#DC3EEA' },
  { id: '8', color: '#753EEA' },
];
