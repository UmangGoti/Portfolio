// src/i18n.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {initReactI18next, useTranslation} from 'react-i18next';
import {I18nManager} from 'react-native';
import en from './locales/en.json';
import gu from './locales/gu.json';
import hi from './locales/hi.json';
import {STORAGE} from './src/constants/storage';

export const LANGUAGES = {
  en: 'English',
  hi: 'Hindi',
  gu: 'Gujarati',
};

const getUserLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(STORAGE.LANGUAGE);
    if (language) {
      return language;
    } else {
      await AsyncStorage.setItem(STORAGE.LANGUAGE, 'en');
    }
    // Ensure localeIdentifier is defined
    const locale = I18nManager?.localeIdentifier
      ? I18nManager.localeIdentifier.split('_')[0]
      : undefined;

    return LANGUAGES[locale] ? locale : 'en';
  } catch (error) {
    console.error('Failed to fetch the user language from storage', error);
    return 'en';
  }
};

const initI18n = async () => {
  const language = await getUserLanguage();

  await i18n.use(initReactI18next).init({
    resources: {
      en: {translation: en},
      hi: {translation: hi},
      gu: {translation: gu},
    },
    lng: language,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(language);
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
};

initI18n();

export const strings = value => {
  const {t} = useTranslation();

  return t(value);
};

export const changeLanguage = async language => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(STORAGE.LANGUAGE, language);
    const isRTL = ['ar', 'he', 'fa', 'ur'].includes(language);
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // Optionally, reload the app if RTL changes
  } catch (error) {
    console.error('Failed to change language', error);
  }
};

export default i18n;
