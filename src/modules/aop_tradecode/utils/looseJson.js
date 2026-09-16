/**
 * @param {*} str
 */
export function looseJsonParse(str) {
  return Function('"use strict";return (' + str + ')')()
}