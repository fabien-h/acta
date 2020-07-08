import Acta from '../src';

describe('Acta ensureActaID method', () => {
  test('Call the method without a context returns false. This is for debuging purpose for this internal method.', () => {
    // Try to call the method with no context
    // @ts-ignore : should error
    const id = Acta.ensureActaID();
    // Should return false
    expect(id).toBe(false);
  });

  test('Call the method with a context that already has an id returns false.', () => {
    // Try to call the method with no context
    // @ts-ignore : should error
    const id = Acta.ensureActaID({
      actaID: 'id',
    });
    // Should return false
    expect(id).toBe(false);
  });

  test(`Call the method with a conext should:
  - return ca valid id
  - increment the actaIDs lenght by one
  - set the new id in the context
  - push the new id in actaIDs array`, () => {
    const initialActaIDs = [...Acta.actaIDs];
    const context: {
      actaID?: string;
    } = {};

    // Call the method
    // @ts-ignore : should error
    const id = Acta.ensureActaID(context);

    // Test the id
    expect(id).toBe(`_${initialActaIDs.length}`);
    // Test the array length
    expect(Acta.actaIDs.length).toBe(initialActaIDs.length + 1);
    // The array should include the id
    expect(Acta.actaIDs.includes(id as string)).toBe(true);
    // The context should have the id
    expect(context.actaID).toBe(`_${initialActaIDs.length}`);
  });
});
