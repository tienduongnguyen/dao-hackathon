import React from 'react';

import { CircleCheckBox } from './circle-checkbox';
import { SquareCheckbox } from './square';
import { CheckboxProps } from './type';

export const CheckBox = (props: CheckboxProps) => {
  // render
  return props.type === 'square' ? (
    <SquareCheckbox {...props} />
  ) : (
    <CircleCheckBox {...props} />
  );
};
