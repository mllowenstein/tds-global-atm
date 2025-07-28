import { TopCryptos } from "./constants";

export const isCrypto = (code: string): boolean => {
  // Common crypto currency codes
  const cryptoCodes = TopCryptos;
  return cryptoCodes.includes(code);
};

/** Generic-Type Clone */
const clone = <T>(object: T): T => {
  const cloned: T = JSON.parse(JSON.stringify(object));
  return cloned;
};

/** Custom grouping function for an input array. */
export const groupBy = function (array: any[], key: string): any[] {
  return array.reduce(function (obj, x) {
    (obj[x[key]] = obj[x[key]] || []).push(x);
    return obj;
  }, {});
};

export const padDigits = function (num: number, padding: number): string {
  return (num + 1).toString().padStart(padding, '0');
};

/** Custom duplicate-removal function for an input array. */
export const unique = function (array: any[]): any[] {
  let vals = '';
  let keys: string[];
  let newArray: any[];
  let unique: any;
  unique = {};
  newArray = [];
  array.forEach((item) => {
    vals = '';
    keys = Object.keys(item);
    keys.forEach((key) => {
      vals += item[key] + ' ';
    });
    if (!unique[vals]) {
      newArray.push(item);
    }
    unique[vals] = item;
  });
  return newArray;
};

/** Optimized duplicate-removal function for input array of any data-type */
export const uniqueVersal = <T>(inputs: T[]): T[] => {
  const singleSet = new Set<string>();
  const singles: T[] = [];
  inputs.forEach((elem: T) => {
    const dataString = JSON.stringify(elem);
    if (!singleSet.has(dataString)) {
      singles.push(elem);
      singleSet.add(dataString);
    }
  });
  return singles;
};

/**
 * Combine an array of unlike objects into a single
 * entity containing all properties and key-value
 * pairs (e.g. multipart forms being aggregated).
 */
export const fuse = function (items: any[]): any {
  return Object.assign({}, ...items);
};

/** Another generic sorting function used for sorting an array
 * of units by an input parameter (property), which changes,
 * depending on the level at which a hierarchy field is
 * is situated in the tree. */
export const getSorted = function (prop: string) {
  return function (a: any, b: any) {
    if (a[prop] > b[prop]) {
      return 1;
    }
    if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
};

/** Creates a random 4-char chunk which will be
 * concatenated with other chunks to make our
 * randomly-generated GUID for batch-posts. */
export const segment = function (): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

/** Creates a random 32-character GUID for
 * batch POST requests - helpful when 2+
 * values need to be created inflight. */
export const generate = function (): string {
  return (
    segment() +
    segment() +
    segment() +
    '4' +
    segment().substr(0, 3) +
    segment() +
    segment() +
    segment() +
    segment()
  ).toLowerCase();
};

/** Creates a random 16-character GUID for
 * interacting with firebase nosql db. */
export const generateUid = function (): string {
  return (
    segment() +
    segment() +
    segment() +
    '4' +
    segment().substr(0, 3)
  ).toLowerCase();
};

/**
 * Smooth-scroll utility function for optional mark or top of page
 * @param spot Optional numeric input for specifying a scroll point
 */
export const scrollTo = (spot?: number): void => {
  window.scrollTo({
    top: spot ?? 0,
    behavior: 'smooth',
  });
};

/**
 * Simpler floor syntax for calculation logic
 * @param val Floating-point number to round down
 */
export const whole = (val: number): number => {
  return ~~val;
};

/**
 * Log object in tuple-format
 * @elem Object with key-value pairs
 */
export const readme = (elem: any): void => {
  for (let [key, value] of Object.entries(elem)) {
    console.log(`${key}: ${value}`);
  }
};

/**
 * Base64-Encryption
 * @plaintext Input text to be encrypted
 */
export const enc64 = (plaintext: string): string => {
  return window.btoa(plaintext);
};

/**
 * Base64-Decryption
 * @encodedText Text content to be decrypted
 */
export const dec64 = (encodedText: string): string => {
  return window.atob(encodedText);
};
