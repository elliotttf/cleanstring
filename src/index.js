// @flow

const memoize = require('lodash.memoize');
const striptags = require('striptags');
const { transliterate } = require('transliteration');

const REG_EXP_CHAR = /[\\^$.*+?()[\]{}|]/g;
const REG_EXP_ASCII = /[^a-zA-Z0-9/]+/g;

/**
 * Constant for remove action.
 */
const CLEANSTRING_REMOVE = 'remove';
/**
 * Constant for replace action.
 */
const CLEANSTRING_REPLACE = 'replace';
/**
 * Constant for do nothing action.
 */
const CLEANSTRING_DONOTHING = 'donothing';

export type CleanstringConfig = {
  case: boolean,
  ignoreWords: Array<string>,
  maxComponentLength: number,
  punctuation: {
    [string]: 'remove' | 'replace' | 'donothing',
  },
  reduceAscii: boolean,
  separator: string,
  transliterate: Boolean,
};

const defaultConfig: CleanstringConfig = {
  case: true,
  ignoreWords: [
    'a',
    'an',
    'as',
    'at',
    'before',
    'but',
    'by',
    'for',
    'from',
    'is',
    'in',
    'into',
    'like',
    'of',
    'off',
    'on',
    'onto',
    'per',
    'since',
    'than',
    'the',
    'this',
    'that',
    'to',
    'up',
    'via',
    'with',
  ],
  maxComponentLength: 100,
  punctuation: {
    '"': CLEANSTRING_REMOVE,
    "'": CLEANSTRING_REMOVE,
    '`': CLEANSTRING_REMOVE,
    ',': CLEANSTRING_REMOVE,
    '.': CLEANSTRING_REMOVE,
    '-': CLEANSTRING_REMOVE,
    _: CLEANSTRING_REMOVE,
    ':': CLEANSTRING_REMOVE,
    ';': CLEANSTRING_REMOVE,
    '|': CLEANSTRING_REMOVE,
    '{': CLEANSTRING_REMOVE,
    '}': CLEANSTRING_REMOVE,
    '[': CLEANSTRING_REMOVE,
    ']': CLEANSTRING_REMOVE,
    '+': CLEANSTRING_REMOVE,
    '=': CLEANSTRING_REMOVE,
    '*': CLEANSTRING_REMOVE,
    '&': CLEANSTRING_REMOVE,
    '%': CLEANSTRING_REMOVE,
    '^': CLEANSTRING_REMOVE,
    $: CLEANSTRING_REMOVE,
    '#': CLEANSTRING_REMOVE,
    '@': CLEANSTRING_REMOVE,
    '!': CLEANSTRING_REMOVE,
    '~': CLEANSTRING_REMOVE,
    '(': CLEANSTRING_REMOVE,
    ')': CLEANSTRING_REMOVE,
    '?': CLEANSTRING_REMOVE,
    '<': CLEANSTRING_REMOVE,
    '>': CLEANSTRING_REMOVE,
    '/': CLEANSTRING_REMOVE,
    '\\': CLEANSTRING_REMOVE,
  },
  reduceAscii: false,
  separator: '-',
  transliterate: false,
};

/**
 * Constructs a method for cleaning strings.
 *
 * Note: passed in config is merged
 *   with the default config, but not recursively. Therefore, if you override one
 *   of the arrays or objects in the config you must provide all the members that
 *   you would like that array or object to contain.
 *
 * @param {CleanstringConfig} config
 *   The config object to use for cleaning. Anything passed in here will be
 *   merged with the default config, but not recursively, i.e. if you override
 *   config.punctuation you will need to provide values for every punctionation
 *   character you wish to handle.
 * @param {boolean} [config.case=true]
 *   True if the generated string should be lowercased.
 * @param {Array<string>} [config.ignoreWords=[ 'a', 'an', 'as', 'at', 'before', 'but', 'by', 'for', 'from', 'is', 'in', 'into', 'like', 'of', 'off', 'on', 'onto', 'per', 'since', 'than', 'the', 'this', 'that', 'to', 'up', 'via', 'with' ]]
 *   The list of words to strip from the passed in string.
 * @param {int} [config.maxComponentLength=100]
 *   The maximum length of the resulting string. The string will be split on
 *   boundaries so it may be shorter than this value, but will never be longer.
 * @param {Object} [config.punctuation={
 *    '"': CLEANSTRING_REMOVE,
 *    "'": CLEANSTRING_REMOVE,
 *    '`': CLEANSTRING_REMOVE,
 *    ',': CLEANSTRING_REMOVE,
 *    '.': CLEANSTRING_REMOVE,
 *    '-': CLEANSTRING_REMOVE,
 *    _: CLEANSTRING_REMOVE,
 *    ':': CLEANSTRING_REMOVE,
 *    ';': CLEANSTRING_REMOVE,
 *    '|': CLEANSTRING_REMOVE,
 *    '{': CLEANSTRING_REMOVE,
 *    '}': CLEANSTRING_REMOVE,
 *    '[': CLEANSTRING_REMOVE,
 *    ']': CLEANSTRING_REMOVE,
 *    '+': CLEANSTRING_REMOVE,
 *    '=': CLEANSTRING_REMOVE,
 *    '*': CLEANSTRING_REMOVE,
 *    '&': CLEANSTRING_REMOVE,
 *    '%': CLEANSTRING_REMOVE,
 *    '^': CLEANSTRING_REMOVE,
 *    $: CLEANSTRING_REMOVE,
 *    '#': CLEANSTRING_REMOVE,
 *    '@': CLEANSTRING_REMOVE,
 *    '!': CLEANSTRING_REMOVE,
 *    '~': CLEANSTRING_REMOVE,
 *    '(': CLEANSTRING_REMOVE,
 *    ')': CLEANSTRING_REMOVE,
 *    '?': CLEANSTRING_REMOVE,
 *    '<': CLEANSTRING_REMOVE,
 *    '>': CLEANSTRING_REMOVE,
 *    '/': CLEANSTRING_REMOVE,
 *    '\\': CLEANSTRING_REMOVE,
 *  }]
 *   The punctuation directives, each member of this object will have a value of
 *   CLEANSTRING_REMOVE, CLEANSTRING_REPLACE, or CLEANSTRING_DONOTHING which
 *   will determine how the characters are handled during cleaning
 * @param {boolean} [config.reduceAscii=false]
 *   True if the generated string should have all non-ascii characters removed.
 * @param {string} [config.separator='-']
 *   The character to use to separate words on boundaries.
 * @param {boolean} [config.transliterate=false]
 *   True if the generated string should have non-ascii characters
 *   transliterated.
 *
 * @return {CleanstringCallback}
 *   A function which can be used to clean strings. Accepts a string as its only
 *   parameter and will return a string cleaned according to the settings
 *   provided.
 */
function cleanstring(
  config: CleanstringConfig = defaultConfig
): (string: string) => string {
  const mergedConfig = {
    ...defaultConfig,
    ...config,
  };

  const punctuation = Object.keys(mergedConfig.punctuation).reduce(
    (ret, key) => {
      ret[mergedConfig.punctuation[key]].push(
        key.replace(REG_EXP_CHAR, '\\$&')
      );
      return ret;
    },
    {
      [CLEANSTRING_REMOVE]: [],
      [CLEANSTRING_REPLACE]: [],
      [CLEANSTRING_DONOTHING]: [],
    }
  );

  /**
   * Method to clean a string according to config.
   *
   * @callback CleanstringCallback
   * @param {string} string
   *   The string to clean.
   *
   * @retrun {string}
   *   The cleaned string.
   */
  return memoize(
    (string: string): string => {
      // Short circuit any more work if we're starting with an empty string.
      if (string === '' || string === null) {
        return '';
      }

      // First, strip tags.
      let retString = striptags(string);

      // Then remove desired punctuation.
      if (punctuation[CLEANSTRING_REMOVE].length) {
        retString = retString.replace(
          new RegExp(punctuation[CLEANSTRING_REMOVE].join('|'), 'g'),
          ''
        );
      }

      // Then replace desired punctuation. Whitespace will be replaced with
      // separator characters below.
      if (punctuation[CLEANSTRING_REPLACE].length) {
        retString = retString.replace(
          new RegExp(punctuation[CLEANSTRING_REPLACE].join('|'), 'g'),
          ' '
        );
      }

      // Then remove any ignored words.
      if (mergedConfig.ignoreWords.length) {
        retString = retString.replace(
          new RegExp(`\\b${mergedConfig.ignoreWords.join('\\b|\\b')}\\b`, 'ig'),
          ''
        );
      }

      // Then trim any whitespace.
      retString = retString.trim();

      if (mergedConfig.transliterate) {
        retString = transliterate(retString);
      }

      // Then reduce the string to ASCII only characters.
      if (mergedConfig.reduceAscii) {
        retString = retString.replace(REG_EXP_ASCII, ' ');
      }

      // Then filter down the string to fit within the max length.
      const components = retString
        .replace(/…$/, '')
        .replace(/\s{2,}/g, ' ')
        .split(' ')
        .filter(i => i);

      let tString = '';
      let i = 0;
      while (
        i < components.length &&
        tString.length < mergedConfig.maxComponentLength
      ) {
        const prefix = `${
          tString ? `${tString}${mergedConfig.separator}` : ''
        }`;
        if (
          `${prefix}${components[i]}`.length <= mergedConfig.maxComponentLength
        ) {
          tString = `${prefix}${components[i]}`;
        } else {
          break;
        }
        i++;
      }
      retString = tString;

      // Then, optionally convert the string to lowercase.
      if (mergedConfig.case) {
        retString = retString.toLowerCase();
      }

      return retString;
    }
  );
}

module.exports = {
  CLEANSTRING_REMOVE,
  CLEANSTRING_REPLACE,
  CLEANSTRING_DONOTHING,
  cleanstring,
};
