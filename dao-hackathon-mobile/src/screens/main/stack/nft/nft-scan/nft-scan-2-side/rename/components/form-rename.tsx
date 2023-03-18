import React, { forwardRef, useImperativeHandle } from 'react';

import { FormProvider, useForm, useFormState } from 'react-hook-form';

import { Button, FormInput, Spacer, TwoColorText } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { RenameValidate } from '@src/common/yup-validate/rename';
import BottomSheet from '@src/library/components/bottom-sheet';
import { useReducer } from '@src/redux';
import { useTheme } from '@src/themes';

import { styles } from '../styles';
import { FormRenameProps, FormRenameType } from '../type';

export const FormRenameTwoSide = forwardRef(
  (
    { onSubmit, fee, isVisible, onCloseModal, onMintNFT }: FormRenameProps,
    ref,
  ) => {
    // state
    const formMethod = useForm<FormRenameType>({
      mode: 'all',
      resolver: yupResolver(RenameValidate.formRename),
    });
    const { colors } = useTheme();
    const { isValid } = useFormState(formMethod);
    const networkType = useReducer(x => x.App.networkType);

    // function
    const onSubmitKey = () => {
      formMethod.handleSubmit(onSubmit)();
    };

    const onConfirm = () => {
      onMintNFT();
    };

    // effect
    useImperativeHandle(
      ref,
      () => ({
        getName: () => {
          return formMethod.getValues().card_name;
        },
        getDescription: () => {
          return formMethod.getValues().description;
        },
      }),
      [formMethod],
    );

    // render
    return (
      <FormProvider {...formMethod}>
        <FormInput
          errorColorTheme="error"
          maxLength={32}
          name={'card_name'}
          placeholderTx={'Name your card*'}
          autoCapitalize={'none'}
        />
        <Spacer height={16} />
        <FormInput
          errorColorTheme="error"
          maxLength={4000}
          containerStyle={styles.descriptionContainer}
          inputStyle={styles.input}
          multiline
          name={'description'}
          placeholderTx={'Description (Optional)'}
          autoCapitalize={'none'}
        />
        <Spacer height={38} />

        <Button
          preset="outline"
          text="Mint"
          typePreset="medium"
          gradient={colors.gradient}
          textColorTheme="white"
          disabled={!isValid}
          onPress={onSubmitKey}
        />
        <BottomSheet
          isVisible={isVisible}
          title={'Confirm and Pay'}
          description={TwoColorText({
            firstText: 'You will need to pay ',
            fee: `${fee} ${
              networkType === 'bsc' ? 'BNB' : networkType.toUpperCase()
            }`,
            lastText: ' to Mint an NFT. Do you want to proceed?',
          })}
          onClose={onCloseModal}
          onPressCancel={onCloseModal}
          onPressSubmit={onConfirm}
          buttonCancelText={'Cancel'}
          buttonSubmitText={'Yes'}
        />
      </FormProvider>
    );
  },
);

export type FormRenameTwoSide = {
  getName: () => string;
  getDescription: () => string;
  getIsValid: () => boolean;
};
