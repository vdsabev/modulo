import 'jest';

jest.mock('mithril', () => ({ trust: (value: string) => value }));
import { toHTML } from './index';

describe(`toHTML`, () => {
  it(`should wrap string in paragraph`, () => {
    expect((<any>toHTML('a')).trim()).toBe('<p>a</p>');
  });

  it(`should return '' for empty string`, () => {
    expect((<any>toHTML('')).trim()).toBe('');
  });

  it(`should return '' for null`, () => {
    expect((<any>toHTML(null)).trim()).toBe('');
  });

  it(`should return '' for undefined`, () => {
    expect((<any>toHTML(undefined)).trim()).toBe('');
  });
});
