import Acta from '../src';
import { IComponentWithID } from '../src/types';

const paramError = `Acta.subscribeEvent params =>
[0]: string,
[2]: mounted react component`;

describe('Acta unsubscribeEvent.test method', () => {
  /**
   * Feature
   */
  test('After unsubscribe, the context property should not exist anymore in the events map.', () => {
    // Inject an event in Acta
    const context: {
      actaID: string;
    } = {
      actaID: '__id',
    };
    Acta.events.testEvent = {
      [context.actaID]: {
        callback: () => {
          console.log('//');
        },
        context: context as IComponentWithID,
      },
    };
    // We should find the context in the event subscribtions map
    expect(Acta.events?.testEvent.hasOwnProperty('__id')).toBe(true);

    // unsubscribe to the event for the target context
    Acta.unsubscribeEvent('testEvent', context as IComponentWithID);

    // We should not find the context in the event subscribtions map any more
    expect(Acta.events?.testEvent.hasOwnProperty('__id')).toBe(false);
  });

  /**
   * Error management
   */
  test('If the eventKey passed is not a valid string, should return an error.', () => {
    expect(() => {
      // @ts-ignore
      Acta.unsubscribeEvent();
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeEvent({});
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeEvent(null);
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeEvent(undefined);
    }).toThrowError(paramError);
  });

  test('If the event key passed does not exist in Acta.event, throw an error.', () => {
    expect(() => {
      // @ts-ignore
      Acta.unsubscribeEvent('nonExistingKey');
    }).toThrowError(paramError);
  });

  test('If the context passed is not a valid object, should return an error.', () => {
    expect(() => {
      // @ts-ignore
      Acta.unsubscribeEvent('a');
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeEvent('a', []);
    }).toThrowError(paramError);

    expect(() => {
      // @ts-ignore
      Acta.unsubscribeEvent('a', () => true);
    }).toThrowError(paramError);
  });
});
