/**
 * Utility to check that the target is a plain object;
 */
export const isObject = (target: any): boolean => {
  /**
   * Check for:
   *  - undefined
   *  - null => would be an object type
   *  - false
   */
  if (!target) {
    return false;
  }

  /**
   * Check that the target is converted to an object
   * by the String constructor
   */
  if (String(target) !== '[object Object]') {
    return false;
  }

  // Probably an object
  return true;
};
