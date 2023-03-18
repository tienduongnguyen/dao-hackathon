import { CustomOmit } from '@common';

import { InputOutlineProps } from '../text-field/components/out-line/type';

export interface InputProps<T extends Record<string, any>>
  extends CustomOmit<InputOutlineProps, 'name'> {
  name: keyof T;
}

export interface FormRegisterType {
  password: string;
  confirmPassword: string;
}
export interface FormRegisterEmailType extends FormRegisterType {
  email: string;
}
