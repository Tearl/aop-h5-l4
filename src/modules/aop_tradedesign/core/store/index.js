export default {
  state: {
    // 临时画布数据存放
    tempProcessObj: {
      flow: [],
      position: ""
    },
    // 是否使用临时数据
    isProcessTemp: false,
    // 搜索栏是否使用临时数据
    isSearchTemp: false,
    // 原子交互发布页面的临时数据
    tempAtomReleaseObj: {},
    // 数据字典列表搜索栏数据
    tempDictionaryObj: {},
    // 服务资产设计（开发）列表搜索栏数据
    tempAssetsObj: {},
    // 服务组件设计列表搜索栏数据
    tempCpnObj: {},
    // 领域组件设计列表搜索栏数据
    tempDomainObj: {},
    // 服务组件管理列表搜索栏数据
    tempCpnMangeObj: {},
    // D4工作台搜索栏数据
    tempD4WorkbenchObj: {},
    // D5工作台搜索栏数据
    tempD5WorkbenchObj: {},
    checkDataList: [],
    // 审批管理新增字段
    fieldObj: {}
  },
  mutations: {
    SAVETEMPPROCESSOBJ(state, value) {
      state.tempProcessObj = value
    },
    CHANGEPROCESSTEMP(state, value) {
      state.isProcessTemp = value
    },
    CHANGESEARCHTEMP(state, value) {
      state.isSearchTemp = value
    },
    SAVETEMPATOMRELEASEOBJ(state, value) {
      state.tempAtomReleaseObj = value
    },
    RESETTEMPATOMRELEASEOBJ(state) {
      state.tempAtomReleaseObj = {}
    },
    SAVETEMPDICTIONARYOBJ(state, value) {
      state.tempDictionaryObj = value
    },
    SAVETEMPASSETSOBJ(state, value) {
      state.tempAssetsObj = value
    },
    SAVETEMPCPNOBJ(state, value) {
      state.tempCpnObj = value
    },
    SAVETEMPDOMAINOBJ(state, value) {
      state.tempDomainObj = value
    },
    SAVETEMPCPNMANGEOBJ(state, value) {
      state.tempCpnMangeObj = value
    },
    SAVETEMPD4WORKBENCHOBJ(state, value) {
      state.tempD4WorkbenchObj = value
    },
    SAVETEMPD5WORKBENCHOBJ(state, value) {
      state.tempD5WorkbenchObj = value
    },
    EMPTYCHENCKDATALIST(state, value) {
      state.checkDataList = value
    },
    SAVEFIELDOBJ(state, value) {
      state.fieldObj = value
    },
  },
  actions: {
    saveTempProcessObj({ commit }, value) {
      commit("SAVETEMPPROCESSOBJ", value)
    },
    changeProcessTemp({ commit }, value) {
      commit("CHANGEPROCESSTEMP", value)
    },
    changeSearchTemp({ commit }, value) {
      commit("CHANGESEARCHTEMP", value)
    },
    saveTempAtomReleaseObj({ commit }, value) {
      commit("SAVETEMPATOMRELEASEOBJ", value)
    },
    resetTempAtomReleaseObj({ commit }) {
      commit("RESETTEMPATOMRELEASEOBJ")
    },
    saveTempDictionaryObj({ commit }, value) {
      commit("SAVETEMPDICTIONARYOBJ", value)
    },
    saveTempAssetsObj({ commit }, value) {
      commit("SAVETEMPASSETSOBJ", value)
    },
    saveTempCpnObj({ commit }, value) {
      commit("SAVETEMPCPNOBJ", value)
    },
    saveTempDomainObj({ commit }, value) {
      commit("SAVETEMPDOMAINOBJ", value)
    },
    saveTempCpnMangeObj({ commit }, value) {
      commit("SAVETEMPCPNMANGEOBJ", value)
    },
    saveTempD4WorkbenchObj({ commit }, value) {
      commit("SAVETEMPD4WORKBENCHOBJ", value)
    },
    saveTempD5WorkbenchObj({ commit }, value) {
      commit("SAVETEMPD5WORKBENCHOBJ", value)
    },
    saveFieldObj({ commit }, value) {
      commit("SAVEFIELDOBJ", value)
    },
  },
  getters: {}
}
