<template>
    <div class="aop_components_object_name">
        <el-input
            v-bind="$attrs"
            v-on="$listeners"
            :placeholder="custom ? '请输入对象名称' : '请选择对象名称'"
            :readonly="!custom"
        />
        <el-button v-if="!custom" type="primary" @click="showSelectHandle">选择</el-button>
        <el-dialog
            title="选择对象"
            append-to-body
            width="840px"
            :visible.sync="dialogVisible"
        >
            <div class="dialog-body">
                <el-form
                    :model="formData"
                    ref="formData"
                    label-width="90px"
                    :inline="true"
                >
                    <el-form-item label="业务域" prop="bizDomainNo" required>
                        <el-select
                            v-model="formData.bizDomainNo"
                            placeholder="请选择"
                            @change="queryAffiliatedCenter"
                        >
                            <el-option
                                v-for="e in bizDomainList"
                                :key="e.value"
                                :label="e.label"
                                :value="e.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="应用中心" prop="appCenter">
                        <el-select
                            v-model="formData.appCenter"
                            placeholder="请选择应用中心"
                            clearable
                        >
                            <el-option
                                v-for="e in appCenterList"
                                :key="e.value"
                                :label="e.label"
                                :value="e.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
                <div
                    class="aop_components_object_name_search_table"
                    v-loading="loading"
                >
                    <el-table
                        ref="singleTable"
                        :data="tableData"
                        @current-change="handleCurrentChange"
                    >
                        <el-table-column width="50">
                            <template slot-scope="scope">
                                <el-radio
                                    :value="currentRow.code"
                                    :label="scope.row.code"
                                >{{ "" }}</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column
                            property="name"
                            label="对象名称"
                        />
                        <el-table-column
                            property="code"
                            label="编码"
                        />
                        <el-table-column
                            property="type"
                            label="对象类型"
                        />
                        <el-table-column
                            property="category"
                            label="分类"
                        />
                    </el-table>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSelectHandle"
                    >确定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";

const typeNameMap = {
    '00': '实体对象',
    '01': '值对象',
}

export default {
    mixins: [mixin],

    props: {
        custom: {
            type: Boolean,
            default: false,
        }
    },

    data() {
        return {
            timer: null,
            loading: false,
            dialogVisible: false,
            bizDomainList: [],
            appCenterList: [],
            formData: {
                bizDomainNo: "",
                appCenter: "",
            },
            currentRow: {},
            tableData: [],
        };
    },

    watch: {
        formData: {
            handler(v) {
                this.debounceSearchData();
            },

            deep: true,
        },
    },

    created() {
        const { domainNo, bizDomainName } = this.$route.query;
        this.getBizDomainData(bizDomainName, domainNo);
    },

    methods: {
        //获取业务域列表
        async getBizDomainData(name, type) {
            const list = await this.getBusinessAreaData(name, type);

            // 获取新建服务业务域&所属中心
            this.bizDomainList = list;
            const domainNo = list[0].value;
            this.formData.bizDomainNo = domainNo;

            this.queryAffiliatedCenter(domainNo);
        },

        //查询所属中心数据及应用服务数据
        async queryAffiliatedCenter(v) {
            const { domainNo, bizDomainNo } = this.$route.query;
            const list = await this.getBelongCenterData(
                v || domainNo || bizDomainNo,
                "1"
            );
            this.appCenterList = list;
            this.formData.appCenter = list[0].value;
        },

        showSelectHandle() {
            this.dialogVisible = true;
        },

        onSelectHandle() {
            this.$emit("input", this.currentRow.name);
            this.$emit("select", this.currentRow);
            this.dialogVisible = false;
        },

        searchData() {
            this.loading = true;
            const { appCenter, bizDomainNo } = this.formData;
            this.rpc.controlWorkbench.qryPageSysBizObjectInfoList({
                appCntrNo: appCenter,
                bizDomainNo,
                currentPage: 1,
                turnPageShowNum: 999,
            }).then((res) => {
                const list = res.l5SysBizObjectInfos.map((e) => {
                    return {
                        raw: e,
                        name: e.objNm,
                        code: e.objCd,
                        type: typeNameMap[e.objTpCd],
                        typeNo: e.objTpCd,
                        category: e.objClsNm,
                    }
                })
                this.tableData = list;
            }).finally(() => {
                this.loading = false;
            })
        },

        debounceSearchData() {
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.searchData();
                clearTimeout(this.timer);
            }, 100);
        },

        setCurrent(row) {
            this.$refs.singleTable.setCurrentRow(row);
        },

        handleCurrentChange(val) {
            this.currentRow = val || {};
        },
    },
};
</script>

<style lang="sass">
.aop_components_object_name {
    display: flex;
    align-items: center;
    gap: 8px;
}

.aop_components_object_name_search_table {

    .el-table__empty-block {
        min-height: 300px;
    }

    .el-table th.el-table__cell {
        background: #F5F5F8;
        font-weight: 500;
        color: #333;
        padding: 9px 0;
    }
}
</style>
