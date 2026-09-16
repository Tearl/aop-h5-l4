/**
 * 设置会话存储 key=>value
 * @param {String} name 存储key
 * @param {String} value 存储值内容
 * @returns 
 */
 export function setSessionStorage (name, value) {
  return app.api.setSessionStorage(name, value)
}

/**
 * 获取会话存储内容
 * @param {String} name 存储key
 * @returns 
 */
export function getSessionStorage(name) {
  return app.api.getSessionStorage(name)
}

/**
 * 设置本地存储 key=>value
 * @param {String} name 存储key
 * @param {String} value 存储值内容
 * @param {Number} expires 存储超时时间
 * @returns 
 */
 export function setLocalStorage (name, value) {
  return app.api.setLocalStorage(name, value)
}

/**
 * 获取本地存储
 * @param {String} name 存储key
 * @returns 
 */
 export function getLocalStorage (name) {
  return app.api.getLocalStorage(name)
}
