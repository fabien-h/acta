import { isObject } from '../src/isObject';

describe('Test the "isObject" utility', () => {
  test('Object litterals should return true.', () => {
    expect(isObject({})).toBe(true);
    expect(
      isObject({
        a: 1,
      }),
    ).toBe(true);
  });

  test('Object created via the constructor should return true.', () => {
    expect(isObject(new Object())).toBe(true);
    expect(isObject(new Object({ a: 1 }))).toBe(true);
    expect(isObject(Object.create({ a: 1 }))).toBe(true);
  });

  test('Object created via a JSON parse should return true.', () => {
    const parsedJSON = JSON.parse('{"a": 1}');
    expect(isObject(parsedJSON)).toBe(true);
  });

  test('null, undefined and booleans should return false.', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });

  test('Functions should return false.', () => {
    const myFunction = () => true;
    expect(isObject(myFunction)).toBe(false);
  });

  test('Arrays should return false.', () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  test('Strings should return false.', () => {
    expect(isObject('Hello world.')).toBe(false);
  });

  test('Numbers should return false.', () => {
    expect(isObject(0)).toBe(false);
    expect(isObject(33)).toBe(false);
  });

  test('Dates should return false.', () => {
    expect(isObject(new Date())).toBe(false);
  });
});
