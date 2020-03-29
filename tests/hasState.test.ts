import Acta from '../src';

describe('Acta hasState method', () => {
  test('Trying a non existing state should return false.', () => {
    // Test a non existing state
    const has = Acta.hasState('nonExistingState');
    // Should not have
    expect(has).toBe(false);
  });

  test('Trying an existing state should return true.', () => {
    // Set a state
    Acta.setState({
      existingState: 'value',
    });
    // Try with the state we just set
    const has = Acta.hasState('existingState');
    // Should have
    expect(has).toBe(true);
  });

  test('Calling hasState without key should throw an error.', () => {
    try {
      // Try to call without a key
      // @ts-ignore
      Acta.hasState();
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        'You must pass a string key to Acta.hasState.',
      );
    }
  });

  test('Calling hasState with a null key should throw an error.', () => {
    try {
      // Try to call without a key
      // @ts-ignore
      Acta.hasState(null);
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        'You must pass a string key to Acta.hasState.',
      );
    }
  });

  test('Calling hasState with an undefined key should throw an error.', () => {
    try {
      // Try to call without a key
      // @ts-ignore
      Acta.hasState(undefined);
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        'You must pass a string key to Acta.hasState.',
      );
    }
  });

  test('Calling hasState with a number key should throw an error.', () => {
    try {
      // Try to call without a key
      // @ts-ignore
      Acta.hasState(10);
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        'You must pass a string key to Acta.hasState.',
      );
    }
  });

  test('Calling hasState with an object key should throw an error.', () => {
    try {
      // Try to call without a key
      // @ts-ignore
      Acta.hasState({ a: 1 });
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        'You must pass a string key to Acta.hasState.',
      );
    }
  });
});
