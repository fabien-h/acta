import Acta from '../src';

describe('Acta.dispatchEvent method', () => {
  /**
   * Feature
   */
  test('After dispatching a sjared event, we should find in in the localstorage', () => {
    const eventKey = 'testSharedEvent';
    const eventValue = 'testSharedEventValue';

    // Dispatch a shared value
    Acta.dispatchEvent(eventKey, eventValue, true);

    // Try to get the value from the local storage & check
    const valueFromStorage = localStorage.getItem(`__actaEvent__${eventKey}`);
    expect(JSON.parse(valueFromStorage as string)).toBe(eventValue);
  });

  /**
   * Error management
   */
  test('Dispatch event requires the event key params to be a string', () => {
    expect(() => {
      // @ts-ignore : should error
      Acta.dispatchEvent(null);
    }).toThrow(
      'Acta.dispatchEvent params => [0]: string & must exist in Acta.events'
    );

    expect(() => {
      // @ts-ignore : should error
      Acta.dispatchEvent();
    }).toThrow(
      'Acta.dispatchEvent params => [0]: string & must exist in Acta.events'
    );

    expect(() => {
      // @ts-ignore : should error
      Acta.dispatchEvent({});
    }).toThrow(
      'Acta.dispatchEvent params => [0]: string & must exist in Acta.events'
    );

    expect(() => {
      // @ts-ignore : should error
      Acta.dispatchEvent(() => true);
    }).toThrow(
      'Acta.dispatchEvent params => [0]: string & must exist in Acta.events'
    );
  });
});
