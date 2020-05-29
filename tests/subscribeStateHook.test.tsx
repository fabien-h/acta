// @ts-nocheck
import Acta from '../src';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import renderer, { ReactTestRenderer } from 'react-test-renderer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import App, { setHookValueInActa, ACTA_KEY_FOR_STATE_HOOK } from './testApp';

const paramsErrorMessage = `Acta.useActaState params =>
[0]: string,
[1]: optionnal, string | number | object | boolean | null | undefined`;

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

    // Get the base number of subscribtions for the state
    const subscribtionCount = Object.keys(
      Acta.states[ACTA_KEY_FOR_STATE_HOOK].subscribtions
    ).length;

    // Unmount the functionnal component
    renderer.act(() => {
      app.root
        .findByProps({ id: 'unmountFunctionalComponent' })
        .props.onClick();
    });

    // Subs count should have decreased by one
    expect(
      Object.keys(Acta.states[ACTA_KEY_FOR_STATE_HOOK].subscribtions).length
    ).toBe(subscribtionCount - 1);
  });

  /**
   * Errors management
   */
  test('When the stateKey param is not a valid string, should throw an error', () => {
    expect(() => {
      Acta.useActaState(null);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      Acta.useActaState([]);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      Acta.useActaState({});
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      Acta.useActaState(() => true);
    }).toThrowError(paramsErrorMessage);
  });
});
