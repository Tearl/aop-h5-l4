<template>
    <div class="service_list_new">
        <div class="flex">

            <div class="right_main">

                <!-- 搜索区域 -->
                <div class="common_search_form">
                    <el-form :inline="true" size="small" label-position="right">
                        <el-row class="search_bottom">
                            <el-col :span="20">
                                <el-form-item label="服务编号：">
                                    <el-input placeholder="请输入" v-model="formData.svcNo" class="search_form_input_width"></el-input>
                                </el-form-item>
                                <el-form-item label="服务名称：">
                                    <el-input placeholder="请输入" v-model="formData.svcNm" class="search_form_input_width"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <div class="form_btn">
                                    <el-button size="small" type="primary" @click="listQr">查询</el-button>
                                    <el-button size="small" @click="reset">重置</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <div class="data_set_table_main">
                    <div class="data_set_list_title">
                        <el-button  icon="el-icon-plus" type="primary" size="small" @click="doOperate('add')">新建</el-button>
                    </div>

                    <div class="data_set_list_table">
                        <el-table class="data_set_common_table" :data="list">
                            <el-table-column label="服务编号" prop="apiCode"></el-table-column>
                            <el-table-column label="服务名称" prop="apiName"></el-table-column>
                            <el-table-column label="服务ID" prop="apiId"></el-table-column>
                            <el-table-column label="服务版本" prop="version">
                                <template slot-scope="scope">
                                    <span>{{scope.row.version || '/'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="服务描述" prop="apiDesc">
                                <template slot-scope="scope">
                                    <span>{{scope.row.apiDesc || '/'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                            >
                                <template slot-scope="scope">
                                    <div class="scope-opera-detail">
                                        <div
                                            class="color-blue"
                                            @click="jumpTo(scope.row)"
                                        >
                                            编辑
                                        </div>
                                        <div
                                            class="color-blue"
                                            @click="setDataDel(scope.row)"
                                        >
                                            删除
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>

                        <!-- 分页器 -->
                        <div class="pagination" v-if="list.length > 0 && total > 10">
                            <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="page"
                                :page-sizes="[10, 20, 30, 40, 50]"
                                :page-size="pageNum"
                                layout="total,prev, pager, next, sizes, jumper"
                                :total="total"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <service-info-dialog 
            v-if="serviceInfoDialogVirble"
            v-model="serviceInfoDialogVirble"
            :serviceInfo="serviceInfo"
            @output="listQr"
        />
    </div>
</template>

<script>
import serviceInfoDialog from '../dialog/ServiceInfoDialog.vue'
import mixin from "@m/core/mixin";
export default {

    mixins: [mixin],

    inject: ['action', 'appInfo'],

    components: {
        serviceInfoDialog
    },
    props: {
        scvInfo: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            currentIndex: '',
            treeData: [],
            formData: {
                dataSetCgyDesc: '',
                dataSetNum: ''
            },
            list: [],
            serviceInfoDialogVirble: false,
            page: '1',
            pageNum: '10',
            total: 0,
        }
    },

    created() {
        this.listQr()
    },

    watch: {
        'scvInfo.dataSetNo': {
            handler() {
                this.listQr()
            }
        }
    },

    methods: {
        handleSizeChange(e) {
            this.pageNum = e
            this.listQr()
        },
        handleCurrentChange(e) {
            this.page = e
            this.listQr()
        },
        async listQr() {
            const { apiInfoList, turnPageTotalNum } = await this.rpc.d1interation.queryServiceList({
                // blgAppNo: this.appInfo.aaiId,
                // appVerNo: this.appInfo.aaiVersion,
                // authId: this.appInfo.isolateWorkspace,
                dataSetNo: this.scvInfo.dataSetNo,
                svcNo: this.formData.svcNo,
                svcNm: this.formData.svcNm,
                currentPage: this.page,
                turnPageShowNum: this.pageNum,
            })
            this.list = apiInfoList || []
            this.total = turnPageTotalNum 
        },
        setDataDel(scope) {
            this.$confirm("确定删除该条服务吗？", "温馨提示").then(
                (res) => {
                    this.rpc.d1interation.delServiceData({
                        // blgAppNo: this.appInfo.aaiId,
                        // appVerNo: this.appInfo.aaiVersion,
                        // authId: this.appInfo.isolateWorkspace,
                        apiId: scope.apiId,

                    }).then(res => {
                        this.$notify({
                            title: "成功",
                            message: "删除成功",
                            duration: 2000,
                            type: "success"
                        });
                        this.listQr()
                    })
                }
            );
        },
        handleNodeClick(data) {
            this.currentIndex = data.id
        },

        querySetDataTableList() {},

        reset() {},

        doOperate(operate, scope) {
            switch(operate) {
                case 'add':
                    this.serviceInfoDialogVirble = true
                    this.serviceInfo = {
                        operationType: '0',
                        ...this.scvInfo
                    }
                    break
            }
        },
        jumpTo(data) {
            window.open(
                `/aop-h5-editor/#/aop_workgate/apimgmt/apiServs?apiId=${data.apiId}&pageType=D1&type=edit`
            );
        }
    }
}
</script>

<style lang="scss" scoped>
.service_list_new {
    .flex {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        min-height: calc(100vh - 179px);

        .comps_aside {
            width: 178px;
            background: #fff;
            border-radius: 2px;

            .aside_title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px;
                box-shadow: 0px 0.5px 0px 0px rgba(232,232,232,1);
                h1 {
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #333333;
                }
                img {
                    width: 14px;
                    height: 14px;
                }
            }


            .comps_aside_content {
                
                padding: 6px 8px;
                /deep/.treeClass{
                    .el-tree-node.is-current>.el-tree-node__content{
                    background: #F0F5FF;
                    color: #358AFF;
                    }
                    .el-tree-node__content {
                        margin: 3px 0;
                        height: 34px;
                        padding-left: 6px;
                    }
                    .el-tree-node__content:hover {
                        background-color: #F7F7F9;
                    }
                    .custom-tree-node {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 90%;

                        .label_span {
                            width: 90%;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            margin-left: 6px;
                        }

                        .icon_split {
                            width: 16px;
                            height: 16px;
                        }

                    }
                    .is-leaf {
                        display: none;
                    }
                    
                }

                .comps_aside_item {
                    display: flex;
                    align-items: center;
                    height: 34px;
                    padding: 9px 8px;
                    cursor: pointer;
                    margin-bottom: 6px;

                    img {
                        width: 16px;
                        height: 16px;
                        margin-right: 4px;
                    }

                    span {
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #333333;
                    }
                }

                .aside_item_active {
                    background: #F0F5FF;
                    border-radius: 2px;

                    span {
                        color: #358AFF;
                    }
                }
            }
        }
    }

    .right_main {
        flex:1;
        height: 100%;
        overflow: hidden;
        min-height: calc(100vh - 179px);

        .common_search_form {
            background: #FFFFFF;
            padding: 16px 24px;
            padding-bottom: 0;
            margin-bottom: 12px;

            .el-form-item--small.el-form-item {
                margin-bottom: 16px;
            }
            .form_btn {
                text-align: right;
            }

            .search_form_input_width {
                width: 180px;
            }
            // /deep/.el-date-editor--datetimerange.el-input__inner {
            //     width: 456px;
            // }
        }

        .data_set_table_main {
            margin-top: 12px;
            background: #FFF;
            // min-height: calc(100vh - 340px);
            

            .data_set_list_title {
                // display: flex;
                // align-items: center;
                padding: 20px 24px;
            }

            .data_set_list_table {
                padding: 0 24px;
                min-height: calc(100vh - 179px);
                /deep/.data_set_common_table {
                    padding-bottom: 24px;
                    
                    &.el-table .el-table__body tr{
                        cursor: pointer;
                    }

                    &.el-table th{
                        background: #FAFAFC;
                        font-size: 14px;
                        color: #333333;
                    }
                    
                    &.el-table th .cell{
                        padding-left: 24px;
                        line-height: 23px;
                    }

                    &.el-table td{
                        padding: 11px 0;
                        font-size: 14px;
                        color: #666666;
                        position: relative;
                    }

                    &.el-table td .cell{
                        padding-left: 24px;
                        line-height: 23px;
                    }

                    .scope-opera-detail {
                        display: flex;
                        align-items: center;
                    }
                    .color-blue,
                    .color-blue-blue,
                    .color-red {
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #358aff;
                        letter-spacing: 0;
                        display: flex;
                        cursor: pointer;
                        margin-right: 8px;
                    }
                    .color-red {
                        color: #fe5161;
                    }
                }
            }
            .pagination {
                text-align: right;
                padding: 12px 0;
            }
        }

        .empty {
            justify-content: center;
            display: flex;
            padding-top: 125px;
            background: #FFF;
            height: calc(100vh - 180px);

            .empty_main {
                width: 340px;
                text-align: center;
                img {
                    width: 200px;
                    height: 130px;
                }
                .desc {
                    display: block;
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #999999;
                    margin-bottom: 32px;
                }
            }
        }
    }
}
</style>