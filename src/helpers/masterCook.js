/**
 *
 * @function masterCook
 *
 * @description Add or remove automatically an array of classes in a Element
 *
 * @param {el} HTML Element @required
 * @param {classList} Array @required
 * @param {method} String add or remove @default add
 *
 * @return undefined
 *
 */

export default function (el, classList, method = 'add') {
  // if (!!el) cosole.error('masterCook needs an element to manage')
  // if (!!classList) cosole.error('masterCook needs a classList to work with element')

  for (let classe in classList) {
    let _classe = classList[classe]
    if (!!_classe) { // eslint-disable-line no-extra-boolean-cast
      try {
        el.classList[method](_classe)
      } catch (e) {
        console.warn(e)
      }
    }
  }
}
