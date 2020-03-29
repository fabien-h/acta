import Acta from '../src';

// Values to set and test
const stateKey = 'testState';
const stateValue = 'testValue';

describe('Acta getState.test method', () => {
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

  test('When trying to call without a key; we should get an error.', () => {
    try {
      // Call with no param
      // @ts-ignore
      Acta.getState();
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('You need to provide an existing state key.');
    }
  });

  test('When trying to call with a key that does not exist; we should get an error.', () => {
    try {
      // Call with a non existing key
      // @ts-ignore
      Acta.getState('nonExistingKey');
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('You need to provide an existing state key.');
    }
  });

  test('When trying to call with a param that is not a string; we should get an error.', () => {
    try {
      // @ts-ignore
      Acta.getState([]);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('You need to provide an existing state key.');
    }
    try {
      // @ts-ignore
      Acta.getState({});
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('You need to provide an existing state key.');
    }
    try {
      // @ts-ignore
      Acta.getState(10);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('You need to provide an existing state key.');
    }
    try {
      // @ts-ignore
      Acta.getState(new Date());
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('You need to provide an existing state key.');
    }
  });
});
