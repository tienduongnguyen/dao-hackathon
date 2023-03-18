import React, { useMemo, useState } from 'react';
import { Image } from 'react-native';

import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { yupResolver } from '@hookform/resolvers/yup';
import { CARDNAME_LENGTH, DESCRIPTION_LENGTH, sizeScale } from '@src/common';
import { RenameValidate } from '@src/common/yup-validate/rename';
import {
  Block,
  Button,
  DropDown,
  FormInput,
  HeaderAuthentication,
  Screen,
  Spacer,
  Text,
} from '@src/library/components';
import { goBack, navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';

import { styles } from './styles';
import { FormRenameType, RenameCardOneSideNavigationProps } from './type';
import { FontDefault } from '@src/themes/typography';

export const RenameCardOneSideScreen = ({
  route,
}: RenameCardOneSideNavigationProps) => {
  //state
  const onEdit = useMemo(() => route.params?.onEditDetail, [route.params]);

  //func
  const onSubmit = (data: FormRenameType) => {
    goBack();
    onEdit(data.card_name, data.description, position);
  };

  const formMethod = useForm<FormRenameType>({
    mode: 'all',
    resolver: yupResolver(RenameValidate.formRename),
    defaultValues: {
      card_name: route?.params?.data.card_name,
      description: route?.params?.data.description,
    },
  });

  const onSubmitKey = () => {
    formMethod.handleSubmit(onSubmit)();
  };

  const [position, setPosition] = useState('1');
  const { isValid } = useFormState(formMethod);

  const renderRightComponent = () => {
    return (
      <>
        <Button onPress={onSubmitKey} disabled={!isValid}>
          <Text
            text="Done"
            preset="notoSanBody2Regular"
            colorTheme="primary4"
          />
        </Button>
      </>
    );
  };

  const onPressViewImage = () => {
    navigate(AUTHORIZE_STACK.IMAGE_VIEW, {
      url: route?.params.data.img,
    });
  };

  //render
  return (
    <FormProvider {...formMethod}>
      <Screen>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={styles.renameContainer}
        >
          <HeaderAuthentication
            txTitle="Rename"
            onPress={goBack}
            renderRightComponent={renderRightComponent}
          />
          <Spacer height={30} />
          <Block block paddingHorizontal={16}>
            <Button onPress={onPressViewImage}>
              <Block width={343} height={196} overflow="hidden">
                <Image
                  source={{ uri: route?.params.data.img ?? [] }}
                  resizeMode="contain"
                  style={styles.image}
                />
              </Block>
            </Button>
            <Spacer height={21} />
            <FormInput
              errorColorTheme="error"
              maxLength={CARDNAME_LENGTH}
              name={'card_name'}
              placeholderTx={'Name your card*'}
              autoCapitalize={'none'}
            />
            <Spacer height={31} />
            <DropDown
              placeHolder="Employee"
              defaultValue="1"
              style={{
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 8,
              }}
              placeholderStyle={{
                color: '#fff',
                fontSize: sizeScale(16),
                fontFamily: FontDefault.notoSansRegular,
              }}
              onChangeItem={(item, idx) => {
                setPosition(`${(idx as number) + 1}`);
              }}
              data={[
                {
                  label: 'Employee',
                  value: '1',
                },
                {
                  label: 'Leader',
                  value: '2',
                },
                {
                  label: 'Manager',
                  value: '3',
                },
                {
                  label: 'Director',
                  value: '4',
                },
              ]}
            />
            <Spacer height={31} />
            <FormInput
              errorColorTheme="error"
              maxLength={DESCRIPTION_LENGTH}
              containerStyle={styles.descriptionContainer}
              inputStyle={styles.inputStyle}
              multiline
              name={'description'}
              placeholderTx={'Description (Optional)'}
              autoCapitalize={'none'}
            />
          </Block>
        </KeyboardAwareScrollView>
      </Screen>
    </FormProvider>
  );
};
