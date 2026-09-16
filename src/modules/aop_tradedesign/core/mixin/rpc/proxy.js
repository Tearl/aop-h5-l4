/**
 * 接口代理
 * @param {String} interfaceId 接口ID
 * @returns 
 */
export function proxy(interfaceId, proxyOptions = {}) {
  //  配置默认的options
  return (data = {}, options = {}) => {
    let config = Object.assign({}, proxyOptions, options)
    return app.api.rpc(interfaceId, data, config)
  }
}
/**
 * 接口地址代理
 * @param {String} interfaceId 接口ID
 * @returns 
 */
export function proxyUrl(interfaceId) {
  return (data = {}) => {
    return app.api.rpcurl(interfaceId, data)
  }
}