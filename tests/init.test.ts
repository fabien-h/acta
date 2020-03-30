import Acta from '../src';

describe('Acta.init method', () => {
  test('On init, the data in the storages should be imported.', () => {
    // Inject data in storages
    localStorage.setItem(
      '__acta__testLocalKey',
      JSON.stringify('testLocalValue'),
    );
    sessionStorage.setItem(
      '__acta__testSessionKey',
      JSON.stringify('testSessionValue'),
    );

    // Set initialized to false to be able to re-init Acta
    Acta.initialized = false;

    // Check that we don’t have the targetKeys in the states
    expect(Acta.hasState('testLocalKey')).toBe(false);
    expect(Acta.hasState('testSessionKey')).toBe(false);

    // Init again
    Acta.init();

    // Check that we have the targetKeys in the states
    expect(Acta.hasState('testLocalKey')).toBe(true);
    expect(Acta.hasState('testSessionKey')).toBe(true);

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'test_key',
        newValue: 'test_value',
      }),
    );
  });
});
