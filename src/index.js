// @flow

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
};

/**
 * Method for cleaning strings.
 *
 * @param {string} string
 *   The string to clean.
 * @param {CleanstringConfig} config
 *   The config object to use for cleaning. Anything passed in here will be
 *   merged with the default config, but not recursively, i.e. if you override
 *   config.punctuation you will need to provide values for every punctionation
 *   character you wish to handle.
 *
 *   Additionally, each punctuation member's value must be one of the exported
 *   CLEANSTRING_REMOVE, CLEANSTRING_REPLACE, or CLEANSTRING_DONOTHING constants.
 *
 * @return {string}
 *   The cleaned string.
 */
function cleanstring(
  string: string,
  config: CleanstringConfig = defaultConfig
): string {
  // Short circuit any more work if we're starting with an empty string.
  if (string === '' || string === null) {
    return '';
  }

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

  // First, strip tags.
  // TODO
  let retString = string;

  // Then remove desired punctuation.
  if (punctuation[CLEANSTRING_REMOVE].length) {
    retString = retString.replace(
      new RegExp(punctuation[CLEANSTRING_REMOVE].join('|'), 'g'),
      ''
    );
  }

  if (punctuation[CLEANSTRING_REPLACE].length) {
    retString = retString.replace(
      new RegExp(punctuation[CLEANSTRING_REPLACE].join('|'), 'g'),
      ' '
    );
  }

  // Then remove any ignored words and trim whitespace.
  if (mergedConfig.ignoreWords.length) {
    retString = retString
      .replace(
        new RegExp(`\\b${mergedConfig.ignoreWords.join('\\b|\\b')}\\b`, 'ig'),
        ''
      )
      .trim();
  }

  if (mergedConfig.reduceAscii) {
    retString = retString.replace(REG_EXP_ASCII, ' ');
  }

  // Then filter down the string to fit within the max length.
  const components = retString
    .replace(/\s{2,}/g, ' ')
    .split(' ')
    .filter(i => i);

  let tString = '';
  let i = 0;
  while (
    i < components.length &&
    tString.length < mergedConfig.maxComponentLength
  ) {
    const prefix = `${tString ? `${tString}${mergedConfig.separator}` : ''}`;
    if (`${prefix}${components[i]}`.length <= mergedConfig.maxComponentLength) {
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

module.exports = {
  CLEANSTRING_REMOVE,
  CLEANSTRING_REPLACE,
  CLEANSTRING_DONOTHING,
  cleanstring,
};
