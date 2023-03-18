import I18n from '@src/i18n/i18n';
function strings() {
  return {
    phone_number: I18n.t('phone_number', { defaultValue: '' }),
    login: I18n.t('login', { defaultValue: '' }),
    password: I18n.t('password', { defaultValue: '' }),
    re_password: I18n.t('re_password', { defaultValue: '' }),
    forgot_password: I18n.t('forgot_password', { defaultValue: '' }),
    create_account: I18n.t('create_account', { defaultValue: '' }),
    register: I18n.t('register', { defaultValue: '' }),
    new_feed: I18n.t('new_feed', { defaultValue: '' }),
  };
}
export default strings;
