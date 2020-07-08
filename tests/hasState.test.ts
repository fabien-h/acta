import Acta from '../src';

describe('Acta hasState method', () => {
  /**
   * Normal Path
   */
  test('HasState on a non existing state should return false.', () => {
    // Test a non existing state
    const has = Acta.hasState('nonExistingState');
    // Should not have
    expect(has).toBe(false);
  });

  test('HasState on an existing state with a string should return true.', () => {
    // Set a state
    Acta.setState({
      existingState: 'value',
    });
    // Try with the state we just set
    const has = Acta.hasState('existingState');
    // Should have
    expect(has).toBe(true);
  });

  test('HasState on an existing state with a nullish should return true.', () => {
    // Set nullish states
    Acta.setState({
      existingState2: false,
      existingState3: null,
      existingState4: undefined,
      existingState5: 0,
      existingState6: '',
    });

    // Should all return true
    expect(Acta.hasState('existingState2')).toBe(true);
    expect(Acta.hasState('existingState3')).toBe(true);
    expect(Acta.hasState('existingState4')).toBe(true);
    expect(Acta.hasState('existingState5')).toBe(true);
    expect(Acta.hasState('existingState6')).toBe(true);
  });

  /**
   * Errors management
   */
  test('Calling hasState without key should throw an error.', () => {
    expect(() => {
      // Try to call without a key
      // @ts-ignore : should error
      Acta.hasState();
    }).toThrowError('Acta.hasState params => [0]: string');
  });

  test('Calling hasState with a non string key should throw an error.', () => {
    expect(() => {
      // Try to call with null
      // @ts-ignore : should error
      Acta.hasState(null);
    }).toThrowError('Acta.hasState params => [0]: string');

    expect(() => {
      // Try to call with undefined
      // @ts-ignore : should error
      Acta.hasState(undefined);
    }).toThrowError('Acta.hasState params => [0]: string');

    expect(() => {
      // Try to call with a number
      // @ts-ignore : should error
      Acta.hasState(10);
    }).toThrowError('Acta.hasState params => [0]: string');

    expect(() => {
      // Try to call with an object
      // @ts-ignore : should error
      Acta.hasState({ a: 1 });
    }).toThrowError('Acta.hasState params => [0]: string');
  });
});
