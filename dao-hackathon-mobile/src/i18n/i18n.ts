import I18n from 'react-native-i18n';

import en from './locales/en';
import jp from './locales/ja';
import vi from './locales/vi';

I18n.fallbacks = false;

I18n.translations = {
  vi,
  en,
  jp,
};
// I18n.defaultLocale = "vi";
I18n.locale = 'vi';

export default I18n;
