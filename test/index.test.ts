import * as fc from 'fast-check';
import escapeStringRegexp from 'escape-string-regexp';

import { regexp } from '../src/index';

const escapeForwardSlash = (str: string) => escapeStringRegexp(str).replace(/\//g, '\\/');
const specialchar = '<_>';

describe('regexp', () => {
  const strConfig = { minLength: 1, maxLength: 10 };
  test('creates regexp properly', () =>
    fc.assert(
      fc.property(
        fc.array(fc.tuple(fc.string(strConfig), fc.string(strConfig))),
        fc.string(strConfig),
        (arr: Array<[string, string]>, firstRegSegment: string) => {
          const [reg, strings, res] = arr.reduce((acc: [string, string[], string], curr: [string, string]) =>
            [`${acc[0]}${specialchar}${escapeForwardSlash(curr[0])}`, [...acc[1], curr[1]], `${acc[2]}${escapeForwardSlash(curr[1])}${escapeForwardSlash(curr[0])}`],
            [escapeForwardSlash(firstRegSegment), [], escapeForwardSlash(firstRegSegment)]
          );
          const regRes = regexp(reg)(...strings);
          expect(regRes.source).toEqual(res);
        }
      )
    )
  );

  test('manual cases', () => {
    const test1 = '_><_';
    expect(regexp(test1)().source).toEqual(test1);
    const test2 = '_><_><_';
    expect(regexp(test2)('a').source).toEqual('_>a<_');
    expect(regexp(test2)('.').source).toEqual('_>\\.<_');
    const test3 = '/>?<?/a<__><_>?A';
    expect(regexp(test3)('a').source).toEqual('\\/>?<?\\/a<__>a?A');
    expect(regexp(test3)('.').source).toEqual('\\/>?<?\\/a<__>\\.?A');
    const test4 = '_<>_<_>?/?_<_>?.*';
    expect(regexp(test4)('.*)*.*///', '<_>').source).toEqual('_<>_\\.\\*\\)\\*\\.\\*\\/\\/\\/?\\/?_<_>?.*');
  });
});
