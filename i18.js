import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import ReactNative from "react-native";
import en from "./locales/en.json";
import gu from "./locales/gu.json";
import hi from "./locales/hi.json";
import { STORAGE } from "./src/constants/storage";

const i18n = new I18n({
  en,
  hi,
  gu,
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? "en";

// Should the app fallback to English if user locale doesn't exists.
i18n.enableFallback = true;

// Default Languages for support.
export const getLanguages = () => {
  return {
    en: "English",
    hi: "Hindi",
    gu: "Gujarati",
  };
};

// Set local.
export const setLocale = async (locale) => {
  i18n.locale = locale;
  await AsyncStorage.setItem(STORAGE.LANGUAGE, locale);
};

export const isRTL = false;

ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string.
export const strings = (name, params = {}) => {
  return i18n.t(name, params);
};

// Allow persist locale after app closed.
export const getUserPreferableLocale = async () => {
  const locale = await AsyncStorage.getItem(STORAGE.LANGUAGE);
  if (locale) {
    i18n.locale = locale;
  }
};

// If language selected, get locale.
getUserPreferableLocale();