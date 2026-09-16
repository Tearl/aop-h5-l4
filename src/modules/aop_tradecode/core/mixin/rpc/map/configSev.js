import { proxy } from '../proxy'

export default {
    // 新增cicd配置
    createCICDPipeline: proxy('developAppDeploy/createCICDPipeline'),
    // 查询初始化配置
    queryAppInitConfStuts: proxy('aopRunAppServiceI/queryAppInitConfStuts'),
    // 初始化git仓库
    createAppGitStroe: proxy('aopRunAppServiceI/createAppGitStroe'),
    // 初始化git基础分支
    createAppGitBaseBranch: proxy('aopRunAppServiceI/createAppGitBaseBranch'),
    // 初始化git仓库功能分支
    createAppGitFnctBranch: proxy('aopRunAppServiceI/createAppGitFnctBranch'),
    // 初始化配置申请提交
    submitAppConfApply: proxy('aopRunAppServiceI/submitAppConfApply'),
}

