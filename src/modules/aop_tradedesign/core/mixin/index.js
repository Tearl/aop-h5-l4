import rpc from "./rpc"

export default {

  created() {
    // 挂载rpc到vue实例
    this.rpc = rpc
  }
}