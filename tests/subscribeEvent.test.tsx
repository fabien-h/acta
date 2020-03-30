import React from 'react';
import renderer from 'react-test-renderer';
import App, { dispatchEventInActa, ACTA_EVENT_KEY_MESSAGE } from './testApp';
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
      // @ts-ignore
      tree.children.find(child => child.props.id === 'message'),
    ).toBeUndefined();
    // Snapshot the resulting markup
    expect(tree).toMatchSnapshot();

    // Set the value in Acta state
    // It should trigger the callback
    dispatchEventInActa();

    // Render the app with an elements array containing strings now
    tree = app.toJSON();
    // The p#message should not be displayed
    expect(
      // @ts-ignore
      tree.children.find(child => child.props.id === 'message'),
    ).toBeDefined();
    // Snapshot the resulting markup
    expect(tree).toMatchSnapshot();
  });

  test('When a component has already subscribed to an event, a new subscritpion return false', () => {
    const actaEventSubs = Acta.events[ACTA_EVENT_KEY_MESSAGE];
    const alreadyEventSubscribedContext =
      actaEventSubs[Object.keys(actaEventSubs)[0]].context;

    expect(
      Acta.subscribeEvent(
        ACTA_EVENT_KEY_MESSAGE,
        () => true,
        alreadyEventSubscribedContext,
      ),
    ).toBe(false);
  });

  /**
   * Errors management
   */
  test('When the stateKey param is not a valid string, should throw an error', () => {
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent(null, () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('', () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent([], () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent({}, () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      Acta.subscribeEvent(
        // @ts-ignore
        () => true,
        // @ts-ignore
        () => true,
        // @ts-ignore
        {} as IComponentWithID,
      );
    }).toThrowError(paramsErrorMessage);
  });

  test('When the callback param is not a valid function, should throw an error', () => {
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('testKey', '', {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('testKey', null, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('testKey', undefined, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('testKey', [], {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('testKey', {}, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
  });

  test('When the callback param is not a valid function, should throw an error', () => {
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('testKey', () => true);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('testKey', () => true, '');
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('testKey', () => true, []);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore
      Acta.subscribeEvent('testKey', () => true, null);
    }).toThrowError(paramsErrorMessage);
  });
});
