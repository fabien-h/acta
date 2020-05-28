// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import renderer, { ReactTestRenderer } from 'react-test-renderer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import App, { setHookValueInActa } from './testApp';

describe('Acta useActaState hook test', () => {
  /**
   * Feature
   */
  test('When a state change, the value in the the component is updated.', () => {
    let app: ReactTestRenderer;
    renderer.act(() => {
      app = renderer.create(<App />);
    });

    // Render the app with an empty elements array
    // @ts-ignore
    let tree = app.toJSON();

    // Get the target paragraph
    let functionnalComponentRoot = tree?.children?.find(
      // @ts-ignore
      (child) => child.props.id === 'functionnalComponentRoot'
    );
    // @ts-ignore
    let valueFromStateParagraph = functionnalComponentRoot.children.find(
      // @ts-ignore
      (child) => child.props.id === 'valueFromState'
    );

    // Check that we have the initial value
    expect(valueFromStateParagraph.children[0]).toBe('Not set yet');
    expect(tree).toMatchSnapshot();

    // Set the value in Acta state
    // It should trigger the callback
    renderer.act(() => {
      setHookValueInActa();
    });

    // Render the app with an elements array containing strings now
    tree = app.toJSON();

    // Get the target paragraph
    functionnalComponentRoot = tree?.children?.find(
      // @ts-ignore
      (child) => child.props.id === 'functionnalComponentRoot'
    );
    // @ts-ignore
    valueFromStateParagraph = functionnalComponentRoot.children.find(
      // @ts-ignore
      (child) => child.props.id === 'valueFromState'
    );

    // Check that we have the final value
    expect(valueFromStateParagraph.children[0]).toBe(
      'Value from updated state'
    );
    expect(tree).toMatchSnapshot();
  });

  //   test('When a component has already subscribed to a state, a new subscritpion return false', () => {
  //     const actaSubs = Acta.states[ACTA_STATE_ELEMENTS_LIST].subscribtions;
  //     const alreadySubscribedContext = actaSubs[Object.keys(actaSubs)[0]]
  //       .context as IComponentWithID;

  //     expect(
  //       Acta.subscribeState(
  //         ACTA_STATE_ELEMENTS_LIST,
  //         () => true,
  //         alreadySubscribedContext
  //       )
  //     ).toBeUndefined();
  //   });

  //   test('When a component unmounts, it should not be in the acta subs anymore', () => {
  //     const actaSubs = Acta.states[ACTA_STATE_ELEMENTS_LIST].subscribtions;
  //     const alreadySubscribedContext = actaSubs[Object.keys(actaSubs)[0]]
  //       .context as IComponentWithID;

  //     // We should have one sub
  //     expect(Object.keys(actaSubs).length).toBe(1);

  //     if (
  //       alreadySubscribedContext &&
  //       alreadySubscribedContext.componentWillUnmount
  //     ) {
  //       alreadySubscribedContext?.componentWillUnmount();
  //     }

  //     // We should not has subs anymore
  //     expect(Object.keys(actaSubs).length).toBe(0);
  //   });

  //   /**
  //    * Errors management
  //    */
  //   test('When the stateKey param is not a valid string, should throw an error', () => {
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState(null, () => true, {} as IComponentWithID);
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState('', () => true, {} as IComponentWithID);
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState([], () => true, {} as IComponentWithID);
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState({}, () => true, {} as IComponentWithID);
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       Acta.subscribeState(
  //         // @ts-ignore
  //         () => true,
  //         // @ts-ignore
  //         () => true,
  //         // @ts-ignore
  //         {} as IComponentWithID
  //       );
  //     }).toThrowError(paramsErrorMessage);
  //   });

  //   test('When the callback param is not a valid function, should throw an error', () => {
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState('testKey', null, {} as IComponentWithID);
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState('testKey', undefined, {} as IComponentWithID);
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState('testKey', [], {} as IComponentWithID);
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState('testKey', {}, {} as IComponentWithID);
  //     }).toThrowError(paramsErrorMessage);
  //   });

  //   test('When the context is not param is not an object, should throw an error', () => {
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState('testKey', () => true);
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState('testKey', () => true, '');
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState('testKey', () => true, []);
  //     }).toThrowError(paramsErrorMessage);
  //     expect(() => {
  //       // @ts-ignore
  //       Acta.subscribeState('testKey', () => true, null);
  //     }).toThrowError(paramsErrorMessage);
  //   });

  //   test('When the initial value is an object containing a circular object, should return false', () => {
  //     const circularObject: { item?: object } = {};
  //     circularObject.item = circularObject;

  //     expect(
  //       Acta.subscribeState(
  //         'testKey',
  //         () => true,
  //         {} as IComponentWithID,
  //         circularObject
  //       )
  //     ).toBe(undefined);
  //   });
});
