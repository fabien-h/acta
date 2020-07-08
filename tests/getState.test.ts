import Acta from '../src';

// Values to set and test
const stateKey = 'testState';
const stateValue = 'testValue';

describe('Acta getState.test method', () => {
  /**
   * Feature
   */
  test('When passing a valid existing state key, returns the value.', () => {
    // Setting the state
    Acta.setState({
      [stateKey]: stateValue,
    });
    // Getting the value
    const valueFromActa = Acta.getState(stateKey);
    // Check the match
    expect(valueFromActa).toBe(stateValue);
  });

  test('When trying to call with a key that does not exist; we should get undefined.', () => {
    // Call with a non existing key
    // Getting the value
    const valueFromActa = Acta.getState('nonExistingKey');
    // Check the match
    expect(valueFromActa).toBe(undefined);
  });

  /**
   * Errors management
   */
  test('When trying to call without a key; we should get an error.', () => {
    expect(() => {
      // Call with no param
      // @ts-ignore : should error
      Acta.getState();
    }).toThrowError('Acta.deleteState params => [0]: string');
  });

  test('When trying to call with a param that is not a string; we should get an error.', () => {
    expect(() => {
      // Call with a non existing key
      // @ts-ignore : should error
      Acta.getState([]);
    }).toThrowError('Acta.deleteState params => [0]: string');

    expect(() => {
      // Call with a non existing key
      // @ts-ignore : should error
      Acta.getState({});
    }).toThrowError('Acta.deleteState params => [0]: string');

    expect(() => {
      // Call with a non existing key
      // @ts-ignore : should error
      Acta.getState(10);
    }).toThrowError('Acta.deleteState params => [0]: string');

    expect(() => {
      // Call with a non existing key
      // @ts-ignore : should error
      Acta.getState(new Date());
    }).toThrowError('Acta.deleteState params => [0]: string');
  });
});
