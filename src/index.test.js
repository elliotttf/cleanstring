const { CLEANSTRING_REPLACE, cleanstring } = require('./');

const TEST_STRING =
  'a~ quick  brown 8-bit fox jumps onto the lazy dog Vinyl cursus nibh eros pharetra vim congue a risus sem Portland risus commodo pharetra Austin non proin urna brunch tempus porta amet before they sold out quisque adipiscing tempus. Portland sit metus quisque viral fusce sagittis fusce vegan arcu adipiscing porta artisan mauris ipsum sed artisan ligula metus. undefined Brooklyn donec integer bibendum organic tellus fusce sit keytar vitae quisque odio VHS eros arcu. Ut vim bibendum';

describe('cleanstring', () => {
  test('can handle empty strings', () => {
    expect.assertions(2);
    expect(cleanstring('')).toBe('');
    expect(cleanstring(null)).toBe('');
  });

  test('can clean with defaults', () => {
    expect.assertions(1);
    const string = cleanstring(TEST_STRING);
    expect(string).toBe(
      'quick-brown-8bit-fox-jumps-lazy-dog-vinyl-cursus-nibh-eros-pharetra-vim-congue-risus-sem-portland'
    );
  });

  test('can replace punctuation', () => {
    expect.assertions(1);
    expect(
      cleanstring(TEST_STRING, {
        punctuation: { '-': CLEANSTRING_REPLACE, '~': CLEANSTRING_REPLACE },
      })
    ).toBe(
      'quick-brown-8-bit-fox-jumps-lazy-dog-vinyl-cursus-nibh-eros-pharetra-vim-congue-risus-sem-portland'
    );
  });

  test('can reduce to ascii', () => {
    expect.assertions(1);
    expect(cleanstring(`💜${TEST_STRING}`, { reduceAscii: true })).toBe(
      'quick-brown-8bit-fox-jumps-lazy-dog-vinyl-cursus-nibh-eros-pharetra-vim-congue-risus-sem-portland'
    );
  });

  test('can preserve case', () => {
    expect.assertions(1);
    expect(cleanstring(TEST_STRING, { case: false })).toBe(
      'quick-brown-8bit-fox-jumps-lazy-dog-Vinyl-cursus-nibh-eros-pharetra-vim-congue-risus-sem-Portland'
    );
  });

  test('can skip ignored words removal', () => {
    expect.assertions(1);
    expect(cleanstring(TEST_STRING, { ignoreWords: [] })).toBe(
      'a-quick-brown-8bit-fox-jumps-onto-the-lazy-dog-vinyl-cursus-nibh-eros-pharetra-vim-congue-a-risus'
    );
  });
});
