/**
 * SOW 管理 API — 基于 app.api.rpc 的接口代理
 * 接口 ID 需与后端注册的一致，此处为占位 ID，请按实际接口文档替换
 */

function proxy(interfaceId) {
    return (data = {}, options = {}) => {
        return app.api.rpc(interfaceId, data, options)
    }
}

/** 获取SOW列表 */
export const listSows = proxy('aop.sowmgmt.listSows')

/** 搜索筛选SOW */
export const searchSows = proxy('aop.sowmgmt.searchSows')

/** 创建SOW */
export const createSow = proxy('aop.sowmgmt.createSow')

/** 更新SOW基本信息 */
export const updateSow = proxy('aop.sowmgmt.updateSow')

/** 删除SOW */
export const deleteSow = proxy('aop.sowmgmt.deleteSow')

/** 提交完成SOW */
export const submitSow = proxy('aop.sowmgmt.submitSow')

/** 获取SOW详情 */
export const getSowDetail = proxy('aop.sowmgmt.getSowDetail')

/** 导入SOW清单 */
export const importSowItems = proxy('aop.sowmgmt.importSowItems')

/** 获取SOW清单列表 */
export const getSowItems = proxy('aop.sowmgmt.getSowItems')

/** 编辑SOW清单功能项 */
export const updateSowItem = proxy('aop.sowmgmt.updateSowItem')

/** 删除SOW清单功能项 */
export const deleteSowItem = proxy('aop.sowmgmt.deleteSowItem')