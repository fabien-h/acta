// @ts-nocheck
import Acta from '../src';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import React from 'react';
// import renderer, { ReactTestRenderer } from 'react-test-renderer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import App, { setHookValueInActa, ACTA_KEY_FOR_STATE_HOOK } from './testApp';

const paramsErrorMessage = `Acta.useActaEvent params =>
[0]: string,
[1]: function`;

describe('Acta useActaEvent hook test', () => {
  /**
   * Errors management
   */
  test('When the eventKey param is not a valid string, should throw an error', () => {
    expect(() => {
      Acta.useActaEvent(null);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      Acta.useActaEvent([]);
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      Acta.useActaEvent({});
    }).toThrowError(paramsErrorMessage);
    expect(() => {
      Acta.useActaEvent(() => true);
    }).toThrowError(paramsErrorMessage);
  });
});
