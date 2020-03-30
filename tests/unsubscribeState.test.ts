import Acta from '../src';
import { IComponentWithID } from '../src/types';

const paramError = `Acta.unsubscribeState params =>
[0]: string,
[2]: mounted react component`;

describe('Acta unSubscribeState.test method', () => {
  /**
   * Feature
   */
  test('After unsubscribe, the context property should not exist anymore in acta states.', () => {
    const stateKey = 'testStateForUnsubscribe';
    const actaID = '__id';
    const context: {
      actaID: string;
    } = {
      actaID,
    };

    // We should not find the context in the said state subs
    expect(Acta.states[stateKey]?.subscribtions[actaID]).toBeUndefined();

    // Subscribe to the said state
    Acta.subscribeState(stateKey, () => true, context as IComponentWithID);

    // We should find the context in the said state subs
    expect(Acta.states[stateKey].subscribtions[actaID]).toBeDefined();

    // Unsubscribe
    Acta.unsubscribeState(stateKey, context as IComponentWithID);

    // We should not find the context in the said state subs
    expect(Acta.states[stateKey].subscribtions[actaID]).toBeUndefined();
  });

  /**
   * Error management
   */
  test('If the state key passed is not a valid string, should return an error.', () => {
    expect(() => {
      // @ts-ignore
      Acta.unsubscribeState();
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeState({});
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeState(null);
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeState(undefined);
    }).toThrowError(paramError);
  });

  test('If the context passed is not a valid object, should return an error.', () => {
    expect(() => {
      // @ts-ignore
      Acta.unsubscribeState('a');
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeState('a', []);
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeState('a', () => true);
    }).toThrowError(paramError);
  });
});
