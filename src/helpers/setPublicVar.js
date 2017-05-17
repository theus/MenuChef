/**
 *
 * @function setPublicVar
 *
 * @description Set readonly public variable to a object
 *
 * @param {obj} Object destination @required
 * @param {location} Object source @required
 * @param {variable} String source variable @required
 * @param {variableLocation} String if source variable isn't the same name
 *
 * @return Object.defineProperty
 *
 */

export default function (obj, location, variable, variableLocation = variable) {
  if (obj['hasOwnProperty'](variable)) delete obj[variable]
  return Object.defineProperty(obj, variable, {
    configurable: true,
    get () {
      return location[variableLocation]
    },
    set (val) {
      console.warn(`${obj.name}.${variable} is readonly`)
    }
  })
}
