import { proxy, proxyUrl } from './proxy'

export default {

    // 左侧栏数据集菜单树
    queryDataSetTreeData: proxy('AOP060141'),

    // 新增数据集
    createDataSet: proxy('AOP060142'),

    // 查询数据集
    queryDataSet: proxy('AOP060138'),

    // 编辑数据集
    modifyDataSet: proxy('AOP060122'),

    // 删除数据集
    delDataSet: proxy('AOP060123'),

    // 新增数据分段
    createDataSubstn: proxy('AOP060125'),

    // 编辑数据分段
    modifyDataSubstn: proxy('AOP060126'),

    // 删除数据分段
    delDataSubstn: proxy('AOP060127'),

    // 查询数据分段
    queryDataSubstn: proxy('AOP060139'),

    // 数据分段列表
    queryDataSubstnList: proxy('AOP060124'),

    // 左侧栏数据集菜单树
    queryServiceDataTree: proxy('AOP060143'),

    // 服务集列表
    queryServiceList: proxy('AOP060144'),

    // 服务集创建
    createServiceData: proxy('AOP060145'),
    
    // 服务集关联删除
    delServiceData: proxy('AOP060147'),

    // 数据集数据列表
    dataSetDataList: proxy('AOP060146'),

    // 新增数据集数据
    createDataSetData: proxy('AOP060129'),

    // 数据集数据查询
    queryDataSetData: proxy('AOP060130'),

    // 数据集修改数据
    modifyDataSetData: proxy('AOP060131'),

    // 删除数据集数据
    delDataSetData: proxy('AOP060132'),

    // 数据集下服务列表
    dataSetServiceList: proxy('AOP060136')
}