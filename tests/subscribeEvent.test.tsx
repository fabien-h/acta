// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import renderer from 'react-test-renderer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import App, {
  dispatchEventInActa,
  dispatchEventInActaWithNullValue,
  ACTA_EVENT_KEY_MESSAGE,
} from './testApp';
import Acta from '../src';
import { IComponentWithID } from '../src/types';

const paramsErrorMessage = `Acta.subscribeEvent params =>
[0]: string,
[1]: function,
[2]: mounted react component`;

describe('Acta subscribeState.test method', () => {
  /**
   * Feature
   */
  test('When an event is dispatched, the callback is triggered in the component.', () => {
    const app = renderer.create(<App />);

    // Render the app with an empty elements array
    let tree = app.toJSON();
    // The p#message should not be displayed
    expect(
      // @ts-ignore : should error
      tree.children.find((child) => child.props.id === 'message')
    ).toBeUndefined();
    // Snapshot the resulting markup
    expect(tree).toMatchSnapshot();

    // Set the value in Acta state
    // It should trigger the callback
    dispatchEventInActa();

    // Dispatch an event with a null value
    dispatchEventInActaWithNullValue();

    // Render the app with an elements array containing strings now
    tree = app.toJSON();
    // The p#message should not be displayed
    expect(
      // @ts-ignore : should error
      tree.children.find((child) => child.props.id === 'message')
    ).toBeDefined();
    // Snapshot the resulting markup
    expect(tree).toMatchSnapshot();
  });

  test('When a component has already subscribed to an event, a new subscritpion return false', () => {
    const actaEventSubs = Acta.events[ACTA_EVENT_KEY_MESSAGE];
    const alreadyEventSubscribedContext = actaEventSubs[
      Object.keys(actaEventSubs)[0]
    ].context as IComponentWithID;

    expect(
      Acta.subscribeEvent(
        ACTA_EVENT_KEY_MESSAGE,
        () => true,
        alreadyEventSubscribedContext
      )
    ).toBe(false);
  });

  test('When a component unmounts, it should not be in the acta subs anymore', () => {
    const actaEventSubs = Acta.events[ACTA_EVENT_KEY_MESSAGE];
    const alreadyEventSubscribedContext =
      actaEventSubs[Object.keys(actaEventSubs)[0]].context;

    // We should have one sub
    expect(Object.keys(actaEventSubs).length).toBe(1);

    if (
      alreadyEventSubscribedContext &&
      alreadyEventSubscribedContext.componentWillUnmount
    ) {
      alreadyEventSubscribedContext?.componentWillUnmount();
    }

    // We should not has subs anymore
    expect(Object.keys(actaEventSubs).length).toBe(0);
  });

  /**
   * Errors management
   */
  test('When the stateKey param is not a valid string, should throw an error', () => {
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent(null, () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('', () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent([], () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent({}, () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      Acta.subscribeEvent(
        // @ts-ignore : should error
        () => true,
        // @ts-ignore : should error
        () => true,
        // @ts-ignore : should error
        {} as IComponentWithID
      );
    }).toThrowError(paramsErrorMessage);
  });

  test('When the callback param is not a valid function, should throw an error', () => {
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('testKey', '', {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('testKey', null, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('testKey', undefined, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('testKey', [], {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('testKey', {}, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
  });

  test('When the callback param is not a valid function, should throw an error', () => {
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('testKey', () => true);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('testKey', () => true, '');
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('testKey', () => true, []);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeEvent('testKey', () => true, null);
    }).toThrowError(paramsErrorMessage);
  });
});
