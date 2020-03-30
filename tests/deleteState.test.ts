import Acta from '../src';

// Values to set and test
const stateKey = 'testState';
const stateValue = 'testValue';

describe('Acta deleteState test method', () => {
  /**
   * Method
   */
  test('Delete a simple key.', () => {
    // Inject the key in Acta
    Acta.setState({
      [stateKey]: stateValue,
    });
    // Check that the key exists
    expect(Acta.hasState(stateKey)).toBe(true);
    // Delete the key
    Acta.deleteState(stateKey);
    // Check that the key does not exist anymore
    expect(Acta.hasState(stateKey)).toBe(false);
  });

  test('Delete a simple key in the local storage.', () => {
    // Inject the key in Acta
    Acta.setState(
      {
        [stateKey]: stateValue,
      },
      'localStorage',
    );
    // Check that the key exists in Acta and in the local storage
    expect(Acta.hasState(stateKey)).toBe(true);
    expect(JSON.parse(localStorage[`__acta__${stateKey}`])).toBe(stateValue);
    // Delete the key
    Acta.deleteState(stateKey, 'localStorage');
    // Check that the key does not exist anymore in Acta and in the local storage
    expect(Acta.hasState(stateKey)).toBe(false);
    expect(localStorage[`__acta__${stateKey}`]).toBeUndefined();
  });

  test('Delete a simple key in the session storage.', () => {
    // Inject the key in Acta
    Acta.setState(
      {
        [stateKey]: stateValue,
      },
      'sessionStorage',
    );
    // Check that the key exists in Acta and in the session storage
    expect(Acta.hasState(stateKey)).toBe(true);
    expect(JSON.parse(sessionStorage[`__acta__${stateKey}`])).toBe(stateValue);
    // Delete the key
    Acta.deleteState(stateKey, 'sessionStorage');
    // Check that the key does not exist anymore in Acta and in the session storage
    expect(Acta.hasState(stateKey)).toBe(false);
    expect(sessionStorage[`__acta__${stateKey}`]).toBeUndefined();
  });

  /**
   * Error management
   */
  test('When passing a stateKey that is an empty string, should throw an error.', () => {
    expect(() => {
      //@ts-ignore
      Acta.deleteState('');
    }).toThrowError('Acta.deleteState params => [0]: string');
  });

  test('When passing a stateKey that is not a string, should throw an error.', () => {
    expect(() => {
      //@ts-ignore
      Acta.deleteState();
    }).toThrowError('Acta.deleteState params => [0]: string');

    expect(() => {
      //@ts-ignore
      Acta.deleteState(false);
    }).toThrowError('Acta.deleteState params => [0]: string');

    expect(() => {
      //@ts-ignore
      Acta.deleteState({ a: 1 });
    }).toThrowError('Acta.deleteState params => [0]: string');

    expect(() => {
      //@ts-ignore
      Acta.deleteState([]);
    }).toThrowError('Acta.deleteState params => [0]: string');

    expect(() => {
      //@ts-ignore
      Acta.deleteState({});
    }).toThrowError('Acta.deleteState params => [0]: string');

    expect(() => {
      //@ts-ignore
      Acta.deleteState(new Date());
    }).toThrowError('Acta.deleteState params => [0]: string');
  });

  test('When passing an invalid persistence target, throw an error.', () => {
    expect(() => {
      //@ts-ignore
      Acta.deleteState('validKey', 'invalidPersistence');
    }).toThrowError(
      'Acta.deleteState params => [1]: "sessionStorage" | "localStorage".',
    );

    expect(() => {
      //@ts-ignore
      Acta.deleteState('validKey', {});
    }).toThrowError(
      'Acta.deleteState params => [1]: "sessionStorage" | "localStorage".',
    );
  });
});
