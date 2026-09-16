<template>
    <div class="dataSet_list_new">
        <div class="flex">

            <div class="comps_aside">
                
                <div class="aside_title">
                    <h1>数据分段</h1>
                    <img @click="doOperate('subLevelAdd')" src="../../assets/add_page.png" class="icon_split" alt="">
                </div>

                <div class="comps_aside_content">
                    <el-tree
                        ref="treeDom"
                        class="treeClass"
                        :data="treeData"
                        node-key="id"
                        default-expand-all
                        indent=10
                        @node-click="handleNodeClick"
                        :expand-on-click-node="false"
                        icon-class="el-icon-arrow-right"
                        :current-node-key="currentIndex"
                        >
                        <span class="custom-tree-node" slot-scope="{ data, node }">
                            <span :class="['label_span']" :title="node.label">{{dataTypeMap[data.dataSubstnAttr]}}{{ node.label}}</span>
                            <el-popover
                                placement="bottom"
                                width="106"
                                popper-class="popover_10001"
                                trigger="hover">

                                <div class="operate_btns">
                                    <span @click="doOperate('subLevelEdit', data)">编辑</span>
                                    <span @click="doOperate('subLevelDel', data)">删除</span>
                                </div>
                                <img slot="reference" v-show="currentIndex == data.id && node.level == 1 " src="../../assets/icon_split.png" class="icon_split" alt="">
                            </el-popover>
                        </span>
                    </el-tree>

                </div>
            </div>

            <div class="right_main">

                <!-- 搜索区域 -->
                <div class="common_search_form" v-show="showSearch">
                    <el-form :inline="true" size="small" label-position="right">
                        <el-row class="search_bottom">
                            <el-col :span="20">
                                <el-form-item label="数据名称：">
                                    <el-input placeholder="请输入" v-model="formData.dictNm" class="search_form_input_width"></el-input>
                                </el-form-item>
                                
                                <el-form-item label="创建时间：">
                                    <el-date-picker
                                        v-model="formData.searchDate"
                                        type="datetimerange"
                                        value-format="yyyyMMddHHmmss"
                                        range-separator="至"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间">
                                    </el-date-picker>
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
                        <el-button v-if="treeData.length > 0" icon="el-icon-plus" type="primary" size="small" @click="doOperate('add')">新建数据</el-button>
                        <h1 v-else>数据列表</h1>

                        <common-table-operate @btnClick="btnClick" :btnList="btnList" />
                    </div>

                    <div class="data_set_list_table">
                        <el-table class="data_set_common_table" :data="list" :stripe="hasRowLine?true:false">
                            <el-table-column label="数据名称" prop="dictNm"></el-table-column>
                            <el-table-column label="数据样例" prop="dataExample"></el-table-column>
                            <el-table-column label="枚举值" prop="dataEnum"></el-table-column>
                            <el-table-column label="数据说明" prop="dataDesc">
                                <template slot-scope="scope">
                                    <span>{{scope.row.dataDesc || '/'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                            >
                                <template slot-scope="scope">
                                    <div class="scope-opera-detail">
                                        <div
                                            class="color-blue"
                                            @click="doOperate('look', scope.row)"
                                        >
                                            查看
                                        </div>
                                        <div
                                            class="color-blue"
                                            @click="doOperate('edit', scope.row)"
                                        >
                                            编辑
                                        </div>
                                        <div
                                            class="color-blue"
                                            @click="doOperate('del', scope.row)"
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
        
        <create-data-config-drawer 
            v-if="createDataConfigDrawerVirble"
            v-model="createDataConfigDrawerVirble"
            :configDrawerInfo="configDrawerInfo"
            @dataConfig="dataConfig"
        />

        <data-sublevel-dialog 
            v-if="dataSublevelDialogVirble"
            v-model="dataSublevelDialogVirble"
            :dataSetInfo="dataSetInfo"
            @output="dataInit"
        />
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import createDataConfigDrawer from '../dialog/CreateDataConfigDrawer.vue'
import dataSublevelDialog from '../dialog/DataSublevelDialog.vue'
import commonTableOperate from '../../components/CommonTableOperate.vue'
export default {
    mixins: [mixin],
    inject: ['action', 'appInfo'],
    components: {
        createDataConfigDrawer,
        dataSublevelDialog,
        commonTableOperate
    },
    props: {
        parentInfo: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            currentIndex: '',
            treeData: [],
            formData: {
                dictNm: '',
                searchDate: []
            },
            list: [],
            createDataConfigDrawerVirble: false,
            dataSublevelDialogVirble: false,
            dataSetInfo: {},
            showSearch: false,
            hasRowLine: false,
            btnList: [
                {
                    defaultIcon: require('../..//assets/common_search.png'),
                    activeIcon: require('../..//assets/common_search_h.png'),
                    hasActive: false,
                    isPop: false
                },
                {
                    defaultIcon: require('../../assets/common_line.png'),
                    activeIcon: require('../../assets/common_line_h.png'),
                    hasActive: false,
                    isPop: false
                }
            ],
            dataTypeMap: {
                '01': "[1.1]",
                '02': "[1.N]"
            },
            configDrawerInfo: {},
            dataSubstnNo: '',
            page: '1',
            pageNum: '10',
            total: 0,
        }
    },

    created() {
        this.dataInit()
        // await this.queryDataSetList()
        // this.listQr()
    },

    watch: {
        "parentInfo.dataSetNo": {
            handler() {
                this.dataInit()
            }
        }
    },

    methods: {
        handleNodeClick(data) {
            this.currentIndex = data.id
            this.configDrawerInfo.dataSubstnNo = data.dataSubstnNo
            this.configDrawerInfo.dataSubstnNm = data.dataSubstnNm
            this.listQr()
        },

        dataConfig() {
            this.dataInit()
        },

        async dataInit() {
            const { dataSubstnList } = await this.rpc.d1interation.queryDataSubstnList({
                blgDataSetNo: this.parentInfo.dataSetNo
            })
            let list = dataSubstnList.map((item, i) => {
                return {
                    label: item.dataSubstnNm,
                    id: i,
                    ...item
                }
            })
            this.treeData = list
            if(list.length > 0) {
                this.configDrawerInfo.dataSubstnNo = list[0].dataSubstnNo
                this.configDrawerInfo.dataSubstnNm = list[0].dataSubstnNm
                
                this.$nextTick(() => {
                    this.currentIndex = list[0].id
                    this.$refs.treeDom.setCurrentKey(this.currentIndex)
                })

                this.listQr()
            } else {
                this.configDrawerInfo = {}
                this.list = []
            }
            
        },

        async queryDataSetList() {
            
            // const list = [
            //     {
            //         label: '[1,1] 基本信息1',
            //         id: '0'
            //     },
            //     {
            //         label: '[1,N] 数据分段2',
            //         id: '1'
            //     },
            //     {
            //         label: '[1,1] 注册信息3',
            //         id: '2'
            //     }
            // ]
            
        },

        handleSizeChange(e) {
            this.pageNum = e
            this.listQr()
        },
        handleCurrentChange(e) {
            this.page = e
            this.listQr()
        },

        async listQr() {
            const { dataList } = await this.rpc.d1interation.dataSetDataList({
                currentPage: this.page,
                turnPageShowNum: this.pageNum,
                dataSubstnNo: this.configDrawerInfo.dataSubstnNo,
                dictNm: this.formData.dictNm,
                crtStrtTm: this.formData.searchDate[0],
                crtEndTm: this.formData.searchDate[1],
                // blgAppNo: this.appInfo.aaiId,
                // appVerNo: this.appInfo.aaiVersion,
                // authId: this.appInfo.isolateWorkspace,
            })
            this.list = dataList || []
            
        },

        btnClick(val) {
            switch (val) {
                case 0:
                    this.showSearch = !this.showSearch
                    break
                case 1:
                    this.hasRowLine = !this.hasRowLine
                    break
            }
        },

        reset() {
            this.formData = {
                searchDate: [],
                dictNm: ''
            }
            this.listQr()
        },

        doOperate(operate, scope) {
            switch(operate) {
                case 'add':
                    this.createDataConfigDrawerVirble = true
                    this.configDrawerInfo.operationType = '0'
                    this.configDrawerInfo.dataSetNo = this.parentInfo.dataSetNo
                    break
                case 'subLevelAdd':
                    this.dataSublevelDialogVirble = true
                    this.dataSetInfo = {
                        operationType: '0',
                        blgDataSetNo: this.parentInfo.dataSetNo
                    }
                    break
                case 'subLevelDel':
                    this.$confirm("确定删除该条数据分段吗？", "温馨提示").then(
                        (res) => {
                            this.rpc.d1interation.delDataSubstn({
                                dataSubstnNo: scope.dataSubstnNo
                            }).then(res => {
                                this.$notify({
                                    title: "成功",
                                    message: "删除成功",
                                    duration: 2000,
                                    type: "success"
                                });
                                this.dataInit()
                            })
                        }
                    );
                    break
                case 'subLevelEdit':
                    this.dataSublevelDialogVirble = true
                    this.dataSetInfo = {
                        operationType: '1',
                        dataSubstnNo: scope.dataSubstnNo,
                        blgDataSetNo: this.parentInfo.dataSetNo
                    }
                    break
                case 'edit':
                    this.createDataConfigDrawerVirble = true
                    this.configDrawerInfo.operationType = '1'
                    this.configDrawerInfo.dataSetNo = this.parentInfo.dataSetNo
                    this.configDrawerInfo.dataSetDataId = scope.dataSetDataId
                    break
                case 'look':
                    this.createDataConfigDrawerVirble = true
                    this.configDrawerInfo.operationType = '2'
                    this.configDrawerInfo.dataSetNo = this.parentInfo.dataSetNo
                    this.configDrawerInfo.dataSetDataId = scope.dataSetDataId
                    break
                case 'del':
                    this.$confirm("确定删除该条数据吗？", "温馨提示").then(
                        (res) => {
                            this.rpc.d1interation.delDataSetData({
                                dataSetDataId: scope.dataSetDataId
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
            }
        }
    }
}
</script>
<style lang="scss">
.popover_10001 {
    width: 100px;
    background: #FFF;
    box-shadow: 0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05);
    padding: 0;

    &.el-tooltip__popper.is-light {
        border: none;
    }
    .operate_btns {
        span {
            display: block;
            height: 36px;line-height: 36px;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            cursor: pointer;

            &:hover {
                color: #3489FE;
            }

            &:last-child {
                &:hover {
                    background: #FFF;
                    color: #FF5D5F;
                }
            }
        }
        
    }
}
</style>
<style lang="scss" scoped>
.dataSet_list_new {
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
                    cursor: pointer;
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
                        line-height: 14px;

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
        margin-left: 12px;
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
                width: 140px;
            }
            // /deep/.el-date-editor--datetimerange.el-input__inner {
            //     width: 456px;
            // }
        }

        .data_set_table_main {
            // margin-top: 12px;
            background: #FFF;
            // min-height: calc(100vh - 340px);
            

            .data_set_list_title {
                padding: 20px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #FFFFFF;
                h1 {
                    font-family: PingFangSC-Medium;
                    font-size: 16px;
                    color: #111111;
                    letter-spacing: 0;
                }
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