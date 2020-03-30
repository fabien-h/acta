import Acta from '../src';

// Values to set and test
const stateKey = 'testState';
const stateValue = 'testValue';

describe('Acta setState method', () => {
  test('After setting a state, we can retreive the value.', () => {
    // Inject the value in the state
    Acta.setState({
      [stateKey]: stateValue,
    });
    // Try to get the value
    const valueFromActa = Acta.getState(stateKey);
    expect(valueFromActa).toBe(stateValue);
  });

  test('Calling Acta.setState without a state param should throw an error.', () => {
    expect(() => {
      // Try to set an empty object
      // @ts-ignore
      Acta.setState();
    }).toThrowError('States must be an object.');
  });

  test('Calling Acta.setState with a state param that is not an object should throw an error.', () => {
    expect(() => {
      // Try to set an empty array
      // @ts-ignore
      Acta.setState([]);
    }).toThrowError('States must be an object.');
  });

  test('Calling Acta.setState with an empty object param should throw an error.', () => {
    expect(() => {
      // Try to set an empty object
      // @ts-ignore
      Acta.setState({});
    }).toThrowError('You need to provide at least a state to set.');
  });

  test('If an invalid persistence type is set, should throw an error.', () => {
    expect(() => {
      // Try to set a state with an invalid persistence
      // @ts-ignore
      Acta.setState({ a: 1 }, 'invalidPersistence');
    }).toThrowError(
      'Invalid persistence. Can be "sessionStorage" or "localStorage".',
    );
  });

  test('If a persistence is set to sessionStorage, we should find the state in the local storage', () => {
    // Inject a state
    Acta.setState({ [stateKey]: stateValue }, 'sessionStorage');

    // Get it form the storage
    const valueFromStorage = JSON.parse(sessionStorage[`__acta__${stateKey}`]);

    expect(valueFromStorage).toBe(stateValue);
  });

  test('If a persistence is set to localStorage, we should find the state in the local storage', () => {
    // Inject a state
    Acta.setState({ [stateKey]: stateValue }, 'localStorage');

    // Get it form the storage
    const valueFromStorage = JSON.parse(localStorage[`__acta__${stateKey}`]);

    expect(valueFromStorage).toBe(stateValue);
  });
});
