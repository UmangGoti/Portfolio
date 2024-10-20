import * as Clipboard from 'expo-clipboard';

/**
 * To set some delay.
 *
 * @param {number | string} time in ms
 * @returns
 */
export const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * For copying string value
 *
 * @param {string} value
 */
export const copyToClipboard = async (value = '') => {
  await Clipboard.setStringAsync(String(value));
};
