/**
 *
 * @function setCssVar
 *
 * @description Try to set a CSS variable
 *
 * @param {variable} String variable @required
 * @param {value} String value @required
 *
 * @return null
 *
 */

export default function (variable, value) {
  try {
    document.documentElement.style.setProperty(variable, value)
  } catch (e) {
  	console.warn('MenuChef failed to change a CSS variable', e)
  }
}