/**
 * @name: 
 * @description: 
 * @param {*} name
 * @param {*} value
 * @return {*}
 */
export function demo(name = 0, value = "") {
  return {
    name: name + 1,
    value: value + 2
  };
}
