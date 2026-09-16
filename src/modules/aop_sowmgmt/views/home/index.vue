<template>
    <div class="sow-home">
        <div class="sow-home__toolbar">
            <SearchBar
                :value="searchForm"
                @search="handleSearch"
                @reset="handleReset"
            />
            <el-button type="primary" icon="el-icon-plus" @click="showCreate = true">
                新增SOW
            </el-button>
        </div>
        <SowTable
            :data="sowList"
            :total="sowTotal"
            :loading="sowLoading"
            :current-page="currentPage"
            :page-size="pageSize"
            @page-change="handlePageChange"
            @edit="handleEdit"
            @delete="handleDelete"
            @submit="handleSubmit"
            @view="handleView"
        />
        <CreateDrawer
            :visible.sync="showCreate"
            @created="handleCreated"
        />
        <DeleteDialog
            :visible.sync="showDelete"
            :sow-info="deleteTarget"
            @confirm="handleDeleteConfirm"
        />
        <SubmitDialog
            :visible.sync="showSubmit"
            :sow-info="submitTarget"
            @confirm="handleSubmitConfirm"
        />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import SearchBar from './components/SearchBar'
import SowTable from './components/SowTable'
import CreateDrawer from './components/CreateDrawer'
import DeleteDialog from './components/DeleteDialog'
import SubmitDialog from './components/SubmitDialog'

export default {
    name: 'SowHome',
    components: {
        SearchBar,
        SowTable,
        CreateDrawer,
        DeleteDialog,
        SubmitDialog
    },
    data() {
        return {
            searchForm: {
                name: '',
                sowId: '',
                relatedBiz: '',
                status: '',
                creator: '',
                expectEndTime: ''
            },
            currentPage: 1,
            pageSize: 10,
            showCreate: false,
            showDelete: false,
            showSubmit: false,
            deleteTarget: null,
            submitTarget: null
        }
    },
    computed: {
        ...mapState('sow', ['sowList', 'total', 'loading']),
        ...mapGetters('sow', ['sowTotal', 'sowLoading'])
    },
    created() {
        this.fetchList()
    },
    methods: {
        ...mapActions('sow', ['fetchSowList', 'searchSowList', 'deleteSowData', 'submitSowData']),
        async fetchList() {
            await this.fetchSowList({
                page: this.currentPage,
                pageSize: this.pageSize
            })
        },
        async handleSearch(form) {
            this.searchForm = { ...form }
            this.currentPage = 1
            await this.searchSowList({
                ...this.searchForm,
                page: 1,
                pageSize: this.pageSize
            })
        },
        async handleReset() {
            this.searchForm = {
                name: '',
                sowId: '',
                relatedBiz: '',
                status: '',
                creator: '',
                expectEndTime: ''
            }
            this.currentPage = 1
            await this.fetchList()
        },
        async handlePageChange(page) {
            this.currentPage = page
            const hasSearch = Object.values(this.searchForm).some(v => v)
            if (hasSearch) {
                await this.searchSowList({
                    ...this.searchForm,
                    page,
                    pageSize: this.pageSize
                })
            } else {
                await this.fetchSowList({
                    page,
                    pageSize: this.pageSize
                })
            }
        },
        handleEdit(row) {
            this.$router.push({ name: 'aopSowmgmtEdit', params: { id: row.id } })
        },
        handleDelete(row) {
            this.deleteTarget = row
            this.showDelete = true
        },
        async handleDeleteConfirm() {
            await this.deleteSowData(this.deleteTarget.id)
            this.showDelete = false
            this.deleteTarget = null
            this.$message.success('删除成功')
            this.fetchList()
        },
        handleSubmit(row) {
            this.submitTarget = row
            this.showSubmit = true
        },
        async handleSubmitConfirm() {
            await this.submitSowData(this.submitTarget.id)
            this.showSubmit = false
            this.submitTarget = null
            this.$message.success('提交完成')
            this.fetchList()
        },
        handleView(row) {
            this.$router.push({ name: 'aopSowmgmtView', params: { id: row.id } })
        },
        handleCreated() {
            this.showCreate = false
            this.fetchList()
        }
    }
}
</script>

<style scoped>
.sow-home {
    padding: 16px;
}
.sow-home__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}
</style>