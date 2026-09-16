import { listSows, searchSows, createSow, updateSow, deleteSow, submitSow, getSowDetail, importSowItems } from '../../api/sow'

const state = {
    sowList: [],
    total: 0,
    loading: false,
    currentSow: null,
    editLoading: false,
    viewLoading: false
}

const mutations = {
    SET_SOW_LIST(state, { list, total }) {
        state.sowList = list
        state.total = total
    },
    SET_LOADING(state, loading) {
        state.loading = loading
    },
    SET_CURRENT_SOW(state, sow) {
        state.currentSow = sow
    },
    SET_EDIT_LOADING(state, loading) {
        state.editLoading = loading
    },
    SET_VIEW_LOADING(state, loading) {
        state.viewLoading = loading
    }
}

const actions = {
    async fetchSowList({ commit }, params) {
        commit('SET_LOADING', true)
        try {
            const res = await listSows(params)
            commit('SET_SOW_LIST', { list: res.list || [], total: res.total || 0 })
            return res
        } finally {
            commit('SET_LOADING', false)
        }
    },
    async searchSowList({ commit }, params) {
        commit('SET_LOADING', true)
        try {
            const res = await searchSows(params)
            commit('SET_SOW_LIST', { list: res.list || [], total: res.total || 0 })
            return res
        } finally {
            commit('SET_LOADING', false)
        }
    },
    async createSowData({ commit }, data) {
        const res = await createSow(data)
        return res
    },
    async updateSowData({ commit }, { id, data }) {
        commit('SET_EDIT_LOADING', true)
        try {
            const res = await updateSow(id, data)
            return res
        } finally {
            commit('SET_EDIT_LOADING', false)
        }
    },
    async deleteSowData({ commit }, id) {
        const res = await deleteSow(id)
        return res
    },
    async submitSowData({ commit }, id) {
        const res = await submitSow(id)
        return res
    },
    async fetchSowDetail({ commit }, id) {
        commit('SET_VIEW_LOADING', true)
        try {
            const res = await getSowDetail(id)
            commit('SET_CURRENT_SOW', res)
            return res
        } finally {
            commit('SET_VIEW_LOADING', false)
        }
    },
    async importSowItemsData({ commit }, { id, data }) {
        const res = await importSowItems(id, data)
        return res
    }
}

const getters = {
    sowList: state => state.sowList,
    sowTotal: state => state.total,
    sowLoading: state => state.loading,
    currentSow: state => state.currentSow,
    editLoading: state => state.editLoading,
    viewLoading: state => state.viewLoading
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}