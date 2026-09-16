import { proxy, proxyUrl } from '../proxy'

export default {
    // 接口服务变更列表
    queryServiceChangeList: proxy('authApplyWordServiceI/queryServiceChangeList'), //服务变更列表
    queryServiceChangeDetail: proxy("authApplyWordServiceI/queryServiceChangeDetail"), //服务变更详情
    updateAssetService: proxy("authApplyWordServiceI/updateAssetService"), //活动服务更新
    queryAssetTranChangeList: proxy("authApplyWordServiceI/queryAssetTranChangeList"), //活动交易变更列表
    queryTranChangeDetail: proxy("authApplyWordServiceI/queryTranChangeDetail"),   //4b交易变更详情
}

