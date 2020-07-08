// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import renderer from 'react-test-renderer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import App, {
  addElementsInActa,
  ACTA_STATE_ELEMENTS_LIST_WITH_CALLBACK,
} from './testApp';
import Acta from '../src';
import { IComponentWithID } from '../src/types';

const paramsErrorMessage = `Acta.subscribeState params =>
[0]: string,
[1]: function or string,
[2]: mounted react component`;

describe('Acta subscribeState.test method', () => {
  /**
   * Feature
   */
  test('When a state change, the callback is triggered in the component.', () => {
    const app = renderer.create(<App />);

    // Render the app with an empty elements array
    let tree = app.toJSON();
    // The ul child should have no children
    let children = tree?.children?.find(
      // @ts-ignore : should error
      (child) => child.props.id === 'listContainer'
      // @ts-ignore : should error
    )?.children;
    expect(children).toBe(null);
    // Snapshot the resulting markup
    expect(tree).toMatchSnapshot();

    // Set the value in Acta state
    // It should trigger the callback
    addElementsInActa();

    // Render the app with an elements array containing strings now
    tree = app.toJSON();
    // The ul child should have children now
    children = tree?.children?.find(
      // @ts-ignore : should error
      (child) => child.props.id === 'listContainer'
      // @ts-ignore : should error
    )?.children;
    expect(Array.isArray(children)).toBe(true);
    expect(children.length > 0).toBe(true);
    // Snapshot the resulting markup
    expect(tree).toMatchSnapshot();
  });

  test('When a component subscribe with a string, the corresponding local state key should be updated', () => {
    const app = renderer.create(<App />);

    // Before the unmount, we should have the base value for the paragraph
    expect(app.root.findByProps({ id: 'simpleValue' }).props.children).toBe(
      'Not Set'
    );

    // Set the new value
    renderer.act(() => {
      app.root.findByProps({ id: 'setSimpleValueState' }).props.onClick();
    });

    // Check if the value has changed
    expect(app.root.findByProps({ id: 'simpleValue' }).props.children).toBe(
      'Set'
    );
  });

  test('When a component has already subscribed to a state, a new subscritpion return false', () => {
    const actaSubs =
      Acta.states[ACTA_STATE_ELEMENTS_LIST_WITH_CALLBACK].subscribtions;
    const alreadySubscribedContext = actaSubs[Object.keys(actaSubs)[0]]
      .context as IComponentWithID;

    expect(
      Acta.subscribeState(
        ACTA_STATE_ELEMENTS_LIST_WITH_CALLBACK,
        () => true,
        alreadySubscribedContext
      )
    ).toBeUndefined();
  });

  test('When a component unmounts, it should not be in the acta subs anymore', () => {
    const actaSubs =
      Acta.states[ACTA_STATE_ELEMENTS_LIST_WITH_CALLBACK].subscribtions;
    const alreadySubscribedContext = actaSubs[Object.keys(actaSubs)[0]]
      .context as IComponentWithID;

    // We should have one sub
    const baseSubCount = Object.keys(actaSubs).length;

    if (
      alreadySubscribedContext &&
      alreadySubscribedContext.componentWillUnmount
    ) {
      alreadySubscribedContext?.componentWillUnmount();
    }

    // We should have one less sub
    expect(Object.keys(actaSubs).length).toBe(baseSubCount - 1);
  });

  /**
   * Errors management
   */
  test('When the stateKey param is not a valid string, should throw an error', () => {
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState(null, () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState('', () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState([], () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState({}, () => true, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      Acta.subscribeState(
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
      Acta.subscribeState('testKey', null, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState('testKey', undefined, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState('testKey', [], {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState('testKey', {}, {} as IComponentWithID);
    }).toThrowError(paramsErrorMessage);
  });

  test('When the context is not param is not an object, should throw an error', () => {
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState('testKey', () => true);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState('testKey', () => true, '');
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState('testKey', () => true, []);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      // @ts-ignore : should error
      Acta.subscribeState('testKey', () => true, null);
    }).toThrowError(paramsErrorMessage);
  });

  test('When the initial value is an object containing a circular object, should return false', () => {
    const circularObject: { item?: Record<string, unknown> } = {};
    circularObject.item = circularObject;

    expect(
      Acta.subscribeState(
        'testKey',
        () => true,
        {} as IComponentWithID,
        circularObject
      )
    ).toBe(undefined);
  });
});
