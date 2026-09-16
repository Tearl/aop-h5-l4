<template>
    <el-dialog
        title="选择服务"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_serviceChosedialog"
        :visible.sync="dialogVisible"
        width="720px"
        :close-on-click-modal="false"
    >

        <div class="application_config_relevance_system">
            <div class="comp-lib-search-line">
                <el-form
                    :model="formData"
                    ref="formData"
                    class="comp-lib-search-form"
                    size="small"
                    :inline="true"
                >
                    <el-form-item
                        label="服务编号:"
                        prop="userName"
                    >
                        <el-input
                            v-model="formData.userName"
                            class="comp-lib-search-form_input_width"
                            placeholder="请输入模块名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="服务名称:"
                        prop="userName"
                    >
                        <el-input
                            v-model="formData.userName"
                            class="comp-lib-search-form_input_width"
                            placeholder="请输入模块名称"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="page_productlist_btns">
                    <el-button
                        class="page_productlist_btn"
                        type="primary"
                        @click="queryFormSubmit"
                    >查 询</el-button>
                    <el-button
                        class="page_productlist_btn"
                        @click="resetQuerySubmit"
                    >重 置</el-button>
                </div>
            </div>

            <div class="application_config_relevance_system_table">
                <el-table class="D2_workspace_common_table" :data="list" @selection-change="handleSelectionChange" ref="multipleTable">
                    <el-table-column
                        type="selection"
                        fixed
                        width="52"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="服务编号"
                        prop="serviceNo"
                        width="140"
                    ></el-table-column>
                    <el-table-column
                        label="服务名称"
                        prop="serviceName"
                        width="100"
                    ></el-table-column>
                    <el-table-column
                        label="服务ID"
                        prop="serviceId"
                        width="90"
                    ></el-table-column>
                    <el-table-column
                        label="服务版本"
                        prop="serviceVersion"
                        width="100"
                    ></el-table-column>
                    <el-table-column
                        label="服务描述"
                        prop="serviceDesc"
                    ></el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
        <div
            class="inner_cheetah_common_pagination"
            v-if="list.length != 0"
        >
            <el-pagination
                @size-change="pageSizeChange"
                @current-change="currentPageChange"
                :current-page.sync="curPage"
                :pager-count="5"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="curPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="parseInt(turnPageTotalNum)"
                :background="true"
            >
            </el-pagination>
        </div>
        </div>
        <div class="inner_cheetah_common_btns_area" slot="footer">
            <el-button @click="dialogVisible = false" :disabled="buttonDisabled">取 消</el-button>
            <el-button type="primary" @click="submitForm" :disabled="buttonDisabled">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],

    props: {
        value: {
            type: Boolean,
            default: false,
        },

        funcInfo: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        return {
            funcLabelList:[],
            busnissList: [],
            list: [
                {
                    serviceId: '000002',
                    serviceNo: '/D51250000003',
                    serviceVersion: '1.0.0',
                    serviceName: '新增服务A',
                    serviceDesc: '这里是一段模块描述…'
                },
                {
                    serviceId: '000002',
                    serviceNo: '/D51250000003',
                    serviceVersion: '1.0.0',
                    serviceName: '新增服务A',
                    serviceDesc: '这里是一段模块描述…'
                },
                {
                    serviceId: '000002',
                    serviceNo: '/D51250000003',
                    serviceVersion: '1.0.0',
                    serviceName: '新增服务A',
                    serviceDesc: '这里是一段模块描述…'
                }

            ],
            componentLibInfo: {},
            formData: {
                userName: '',
                userMobile: ''
            },
            curPageSize: '10',
            curPage: '1',
            turnPageTotalNum: 7,
            multipleSelection: []
        };
    },

    created() {
        this.initForm()
        // this.queryFuncList()
    },

    methods: {

        async queryFuncList() {
            const { userList, turnPageTotalNum } = await this.rpc.d2layoutworkspace.choseUserList({orderType: '1024',currentPage: this.curPage,turnPageShowNum: this.curPageSize, ...this.formData})
            this.list = userList || []
            this.turnPageTotalNum = turnPageTotalNum
        },

        
        queryFormSubmit() {
            this.curPageSize = '10'
            this.curPage = '1'
            this.queryFuncList()
        },
        resetQuerySubmit() {
            this.$refs.formData.resetFields()
            this.curPageSize = '10'
            this.curPage = '1'
            this.queryFuncList()
        },
        /**
        * 功能列表分页
        */
        pageSizeChange(val) {
            this.curPageSize = val;
            this.queryFuncList();
        },
        currentPageChange(val) {
            this.curPage = val;
            this.queryFuncList();
        },
        handleSelectionChange(val) {
            console.log(val, 'val00-----')
            this.multipleSelection = val
            // if (val.length > 1) {
            //     this.$refs.multipleTable.clearSelection();
            //     this.$refs.multipleTable.toggleRowSelection(val.pop());
            // }
        },
        submitForm() {
            this.dialogVisible = false
            // if(this.multipleSelection.length == 0) {
            //     this.$message.warning('您还未选择设计人员')
            // } else {
            //     this.$emit('output', this.multipleSelection)
            //     this.dialogVisible = false
                
            // }
        },
        initForm() {
            this.operationType =
                this.funcInfo.operationType;
                console.log(this.funcInfo, 'this.funcInfo---------')
        },
        doOperate(operate, scope) {
            switch(operate) {
                case 'look':
                    this.$router.push({ path: '/aop_asset/functionalAssets/detail', query: {admiId: scope.admiId,funcType: 'look' } })
                    break
            }
        }
    },

    computed: {
        dialogVisible: {
            get() {
                return this.value;
            },

            set(val) {
                this.$emit("input", val);
            },
        },
    },
};
</script>
<style lang="scss">
@import "../../assets/public.scss";
</style>
<style lang="scss" scoped>
.inner_cheetah_comps_serviceChosedialog {
    .application_config_relevance_system {
        .comp-lib-search {
            margin: 14px 7px 0 7px;
            padding: 24px;
            background: #ffffff;

            &.comp-lib-search-container {
                padding-bottom: 10px;
            }

            &.comp-lib-table-container {
                padding-top: 0px;
            }
        }
        .comp-lib-search-line {
            display: flex;
            align-items: flex-start;
        }

        .page_productlist_btn {
            width: 64px;
            height: 34px;
            padding: 0;
        }

        .comp-lib-search-form {
            display: flex;
            flex-wrap: wrap;
            width: 85%;
        }

        .comp-lib-search-form_input_width {
            width: 135px;
        }

        .page_productlist_btns {
            width: 25%;
            text-align: right;
        }
    }
}
</style>

