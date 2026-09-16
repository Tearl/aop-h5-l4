import { proxy, proxyUrl } from './proxy'

export default {

    // D4工作台-产品列表-我负责的
    getD4MyCreatedList: proxy('AOP070201'),

    // /D4工作台-产品列表-我参与的
    getD4MyJoinList: proxy('AOP070202'),

    // D4工作台-待验收列表/验收列表
    getD4NoCheckList: proxy('AOP070207'),

    // D4工作台-产品设计-D4b设计-D4b产品列表
    getProductList: proxy('AOP070209'),

    // D4工作台-产品查看
    getProductDetail: proxy('MK050121'),

    // D4工作台-条数
    getTatolAll: proxy('AOP070222'),

    submitD4Accept: proxy("AOP070210"),//D4工作台-提交验收

    revokeD4Accept: proxy("AOP070221"),//D4工作台-撤销/重新提交

    getD4PermissUserInfo: proxy("AOP070205"),//D4工作台-产品权限-人员详情列表

    getD4bDesignList: proxy("AOP070209"),//D4工作台-产品设计-D4b设计-D4b设计

    getM3DesignList: proxy("AOP070223"),//D4工作台-产品设计-D4b设计-M3

    submitD4bNpCheckInfo: proxy("AOP070208"),////D4工作台-待验收列表-验收提交

    submitD4AdminInfo: proxy("AOP070212"),//D4工作台-提交验收

    getFunctionInfo: proxy("MK050124"),//D4工作台-M3||D4b查看功能

}