// @ts-nocheck : test file
import Acta from '../src';

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
