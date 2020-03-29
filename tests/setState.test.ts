const Acta = require('../src/index.ts').default;

describe('Acta set state method', () => {
  test('After setting a state, we can retreive the value.', () => {
    // Values to set and test
    const stateKey = 'testState';
    const stateValue = 'testValue';

    // Inject the value in the state
    Acta.setState({
      [stateKey]: stateValue,
    });

    // Try to get the value
    const valueFromActa = Acta.getState(stateKey);

    expect(valueFromActa).toBe(stateValue);
  });

  test('Calling Acta.setState without a state param should throw an error.', () => {
    try {
      // Try to set an empty object
      Acta.setState();
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('States must be an object.');
    }
  });

  test('Calling Acta.setState with a state param that is not an object should throw an error.', () => {
    try {
      // Try to set an empty object
      Acta.setState([]);
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('States must be an object.');
    }
  });

  test('Calling Acta.setState with an  empty state param should throw an error.', () => {
    try {
      // Try to set an empty object
      Acta.setState({});
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        'You need to provide at least a state to set.',
      );
    }
  });
});
