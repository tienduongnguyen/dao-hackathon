import React from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { useController, useFormContext } from 'react-hook-form';

import { onCheckType } from '@common';
import { TextField } from '@components';
import { useMessageYupTranslation } from '@hooks';

import { FormRegisterEmailType, InputProps } from './type';

export const FormInput = <T extends Record<string, any>>({
  name,
  labelTx,
  nameTrigger,
  placeholderTx,
  rightChildren,
  onBlur,
  onSubmit,
  defaultValue = '',
  ...rest
}: InputProps<T>) => {
  // state
  const { trigger, getValues } = useFormContext<FormRegisterEmailType>();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as string,
    defaultValue,
  });
  const msgError = useMessageYupTranslation(error?.message);

  // func
  const _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    field.onBlur();
    if (onCheckType(onBlur, 'function')) {
      onBlur(e);
    }
  };

  // render
  return (
    <>
      <TextField
        ref={field.ref}
        value={field.value}
        error={msgError}
        onBlur={_onBlur}
        trigger={trigger}
        labelTx={labelTx}
        onSubmit={onSubmit}
        typeInput="outline"
        nameTrigger={nameTrigger}
        onChangeText={field.onChange}
        defaultValue={(getValues() as any)[name] as string}
        placeholderTx={placeholderTx}
        rightChildren={rightChildren}
        {...rest}
      />
    </>
  );
};
