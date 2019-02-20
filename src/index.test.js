const { CLEANSTRING_REPLACE, cleanstring } = require('./');

const TEST_STRING =
  'a~ quick  brown 8-bit fox jumps onto the lazy dog Vinyl cursus nibh eros pharetra vim congue a risus sem Portland risus commodo pharetra Austin non proin urna brunch tempus porta amet before they sold out quisque adipiscing tempus. Portland sit metus quisque viral fusce sagittis fusce vegan arcu adipiscing porta artisan mauris ipsum sed artisan ligula metus. undefined Brooklyn donec integer bibendum organic tellus fusce sit keytar vitae quisque odio VHS eros arcu. Ut vim bibendum';

describe('cleanstring', () => {
  describe('default settings', () => {
    const cs = cleanstring();

    test('can handle empty strings', () => {
      expect.assertions(2);
      expect(cs('')).toBe('');
      expect(cs(null)).toBe('');
    });

    test('can clean with defaults', () => {
      expect.assertions(1);
      const string = cs(TEST_STRING);
      expect(string).toBe(
        'quick-brown-8bit-fox-jumps-lazy-dog-vinyl-cursus-nibh-eros-pharetra-vim-congue-risus-sem-portland'
      );
    });
    test('can remove HTML tags', () => {
      expect.assertions(1);
      expect(cs('<a href="foo.html"><b>hello world</b></a> testing 123!')).toBe(
        'hello-world-testing-123'
      );
    });
  });

  test('can replace punctuation', () => {
    expect.assertions(1);
    expect(
      cleanstring({
        punctuation: { '-': CLEANSTRING_REPLACE, '~': CLEANSTRING_REPLACE },
      })(TEST_STRING)
    ).toBe(
      'quick-brown-8-bit-fox-jumps-lazy-dog-vinyl-cursus-nibh-eros-pharetra-vim-congue-risus-sem-portland'
    );
  });

  test('can reduce to ascii', () => {
    expect.assertions(1);
    expect(cleanstring({ reduceAscii: true })(`💜${TEST_STRING}`)).toBe(
      'quick-brown-8bit-fox-jumps-lazy-dog-vinyl-cursus-nibh-eros-pharetra-vim-congue-risus-sem-portland'
    );
  });

  test('can preserve case', () => {
    expect.assertions(1);
    expect(cleanstring({ case: false })(TEST_STRING)).toBe(
      'quick-brown-8bit-fox-jumps-lazy-dog-Vinyl-cursus-nibh-eros-pharetra-vim-congue-risus-sem-Portland'
    );
  });

  test('can skip ignored words removal', () => {
    expect.assertions(1);
    expect(cleanstring({ ignoreWords: [] })(TEST_STRING)).toBe(
      'a-quick-brown-8bit-fox-jumps-onto-the-lazy-dog-vinyl-cursus-nibh-eros-pharetra-vim-congue-a-risus'
    );
  });
});
