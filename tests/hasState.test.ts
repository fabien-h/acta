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
    expect(() => {
      // Try to call without a key
      // @ts-ignore
      Acta.hasState();
    }).toThrowError('You must pass a string key to Acta.hasState.');
  });

  test('Calling hasState with a null key should throw an error.', () => {
    expect(() => {
      // Try to call without a key
      // @ts-ignore
      Acta.hasState(null);
    }).toThrowError('You must pass a string key to Acta.hasState.');
  });

  test('Calling hasState with an undefined key should throw an error.', () => {
    expect(() => {
      // Try to call with an undefined key
      // @ts-ignore
      Acta.hasState(undefined);
    }).toThrowError('You must pass a string key to Acta.hasState.');
  });

  test('Calling hasState with a number key should throw an error.', () => {
    expect(() => {
      // Try to call with a number key
      // @ts-ignore
      Acta.hasState(10);
    }).toThrowError('You must pass a string key to Acta.hasState.');
  });

  test('Calling hasState with an object key should throw an error.', () => {
    expect(() => {
      // Try to call with an object key
      // @ts-ignore
      Acta.hasState({ a: 1 });
    }).toThrowError('You must pass a string key to Acta.hasState.');
  });
});
