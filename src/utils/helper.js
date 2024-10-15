/**
 * To set some delay.
 *
 * @param {number | string} time in ms
 * @returns
 */
export const sleep = ms => new Promise(r => setTimeout(r, ms));
