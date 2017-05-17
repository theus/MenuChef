/**
 *
 * @function setIF
 *
 * @description Verify determined condition and return passed value. If not, return default value
 * The condition don't need exist and don't break the program
 *
 * @param {val} String value @required
 * @param {condition} String condition to be analized @required
 * @param {defaultVal} String @default '' @optional
 *
 * @return val || defaultVal
 *
 */

export default function (val, condition, defaultVal = '') {
  try {
    if (condition && val) return val
  } catch (e) {}
  return defaultVal
}
