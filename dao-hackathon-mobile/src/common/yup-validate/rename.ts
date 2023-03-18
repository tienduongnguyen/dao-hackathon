import * as yup from 'yup';

export const RenameValidate = {
  formRename: yup.object().shape({
    card_name: yup.string().required('This field is required').trim(),
    description: yup.string(),
  }),
};
