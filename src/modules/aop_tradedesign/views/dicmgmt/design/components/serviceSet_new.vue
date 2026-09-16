<template>
    <div class="service_set_new">
        <div class="flex">
            <div class="comps_aside">
                <div class="tree_search">
                    <el-input
                        class="module_search"
                        size="mini"
                        placeholder="搜索名称"
                        prefix-icon="el-icon-search"
                        v-model="filterText"
                    ></el-input>
                </div>
                <div class="comps_aside_content">
                    <el-tree
                        ref="treeDom"
                        class="treeClass"
                        :data="treeData"
                        node-key="id"
                        default-expand-all
                        :filter-node-method="filterNode"
                        indent=10
                        @node-click="handleNodeClick"
                        :expand-on-click-node="false"
                        icon-class="el-icon-arrow-right"
                        :current-node-key="currentIndex"
                        >
                        <span class="custom-tree-node" slot-scope="{ data, node }">
                            <span :class="['label_span', `label_span_${node.level}`]" :title="node.label">{{ node.label}}</span>
                            
                             <el-popover
                                placement="bottom"
                                width="106"
                                popper-class="popover_1000"
                                trigger="click">

                                <div class="operate_btns">
                                    <span @click="doOperate('dataSetEdit', data)">编辑</span>
                                    <span @click="doOperate('dataSetDel', data)">删除</span>
                                </div>
                                <img slot="reference" v-show="currentIndex == data.id && node.level == 2 " src="../../assets/icon_split.png" class="icon_split" alt="">
                            </el-popover>
                            <img @click="doOperate('dataSetAdd', data)" v-show="currentIndex == data.id && node.level == 1 && data.id != '-1'" src="../../assets/add_page.png" class="icon_split" alt="">
                        </span>
                    </el-tree>

                </div>
            </div>
            <div class="right_main">

                <service-list-all v-if="isServiceSetAll" />
                <component :scvInfo="scvInfo" v-else v-bind:is="currentTabComponent"></component>
            </div>

            <!-- <div class="right_main" v-else>
                <div class="empty">
                    <div class="empty_main">
                        <img src="../assets/page.png" alt="">
                        <span class="desc">暂无数据</span>
                    </div>
                </div>
            </div> -->
        </div>

        <data-set-info-dialog 
            v-if="dataSetInfoDialogVirble"
            v-model="dataSetInfoDialogVirble"
            :dataSetInfo="dataSetInfo"
            @output="dataSetOutput"
        />

    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import serviceList from './serviceList.vue'
import serviceListAll from './serviceListAll.vue'
import dataSetInfoDialog from '../dialog/DatasetInfoDialog.vue'
export default {

    mixins: [mixin],

    inject: ['action', 'appInfo'],

    components: {
        serviceList,
        serviceListAll,
        dataSetInfoDialog
    },

    data() {
        return {
            isServiceSetAll: true,
            treeData:[],
            currentIndex: '',
            dataSetIndex: '1',
            tabDesc: '产品数据集主要描述产品信息、销售信息和金融特征信息，用于在渠道上呈现金融产品信息，此处不实现金融产品的核算..',
            currentTabComponent: '',
            moduleInfo: {},
            titleInfo: {},
            dataSetInfo: {},
            scvInfo: {},
            filterText: '',
            dataSetInfoDialogVirble: false
        }
    },
    created() {
        this.queryDataSetTreeList()
        this.currentTabComponent = serviceList
    },
    watch: {
      filterText(val) {
        this.$refs.treeDom.filter(val);
      }
    },
    mounted() {},
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        dataSetOutput() {
            this.queryDataSetTreeList()
        },
        handleNodeClick(data,node){
            console.log(data, node, '0-------')
            this.currentIndex = data.id
            if(node.level == 2) {
                this.isServiceSetAll = false
                this.currentTabComponent = serviceList
                this.scvInfo = data
            }
            if(data.id == '-1') {
                this.isServiceSetAll = true
                this.currentTabComponent = ''
            }
        },

        doOperate(operate, data) {
            switch(operate) {
                case 'dataSetAdd':
                    this.dataSetInfoDialogVirble = true
                    this.dataSetInfo = {
                        operationType: '0',
                        classifyId: data.classifyId
                    }
                    break
                case 'dataSetEdit':
                    this.dataSetInfoDialogVirble = true
                    this.dataSetInfo = {
                        operationType: '1',
                        dataSetNo: data.dataSetNo
                    }
                    break
                case 'dataSetDel': 
                    this.$confirm("确定删除该条数据集吗？", "温馨提示").then(
                        (res) => {
                            this.rpc.d1interation.delDataSet({
                                dataSetNo: data.dataSetNo
                            }).then(res => {
                                this.$notify({
                                    title: "成功",
                                    message: "删除成功",
                                    duration: 2000,
                                    type: "success"
                                });
                                this.queryDataSetTreeData()
                            })
                        }
                    );
                    break
            }
        },

        // 处理tree数据
        formatDataSetTree(data) {
            data.forEach((item, i) => {
                item.id = i
                item.label = `${item.classifyNm}(${item.dataSetSum})`

                if(item.dataSetList && item.dataSetList.length > 0) {
                    item.children = item.dataSetList
                    item.children.forEach((info, j) => {
                        info.id = `${i} + ${j}`
                        info.label = info.dataSetNm
                        info.classifyId = item.classifyId
                        info.classifyNm = item.classifyNm
                        info.classifyNoInitial = item.classifyNoInitial
                    })
                }
            })
            return data
        },

        async queryDataSetTreeList() {
            const { dataSetClassifyList, dataSetSum } = await this.rpc.d1interation.queryServiceDataTree({
                dataSetNm: '',
                // blgAppNo: this.appInfo.aaiId,
                // appVerNo: this.appInfo.aaiVersion,
                // authId: this.appInfo.isolateWorkspace
            })

            let list = this.formatDataSetTree(dataSetClassifyList)

            list.unshift( {
                label: `全部(${dataSetSum})`,
                id: '-1'
            })
            this.treeData = list
            this.$nextTick(() => {
                this.currentIndex = '-1'
                this.$refs.treeDom.setCurrentKey('-1')
            })
        },

        async queryD1ModuleList() {
            const { dataList } = await this.rpc.d1workspace.d1ModuleList({ 
                aaiId: this.appInfo.aaiId,
                aaiVersion: this.appInfo.aaiVersion,
                isolateWorkspace: this.appInfo.isolateWorkspace,
                type: '01',
                currentPage: this.page, //当前页
                turnPageShowNum: '9999', //当前页数量
            })
            let formatList = dataList.map((item, index) => {
                return {
                    label: item.moduleName,
                    id: `0.${index}`,
                    ...item
                }
            })
            
            this.treeData[0].children = formatList
            this.treeData[0].id = "0"
            this.treeData[0].label = this.appInfo.aaiName
            if(dataList.length > 0) {
                this.currentIndex = '0.0'
                const { moduleId, moduleVersion, moduleName, moduleLableName, moduleStatus, countNum } = dataList[0]
                this.moduleInfo = {
                    appModuleId: moduleId,
                    appModuleVersion: moduleVersion,
                    appId: this.appInfo.aaiId, appVersion: this.appInfo.aaiVersion, isolateWorkspace: this.appInfo.isolateWorkspace, aaiName: this.appInfo.aaiName, moduleName
                }
                this.titleInfo = {
                    title: moduleName,
                    version: moduleVersion,
                    label: moduleLableName,
                    status: moduleStatus,
                    countNum: countNum
                }
            }
            
        },
    }
}
</script>
<style lang="scss">
.d1Design_operate_more {
    width: 100px;
    background: #FFF;
    box-shadow: 0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05);

    &.el-tooltip__popper.is-light {
        border: none;
    }
    .operate_more_btn {
        // height: 110px;
        span {
            display: block;
            height: 36px;line-height: 36px;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            cursor: pointer;

            &:hover {
                background: #E7F1FF;
                color: #3489FE;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
    .service_set_new {
        .flex {
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            min-height: calc(100vh - 179px);

            .comps_aside {
                width: 200px;
                background: #fff;
                border-radius: 2px;

                .tree_search {
                    padding: 14px 8px 0 8px;

                    .module_search {
                        border-radius: 2px;
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
                        }
                        .el-tree-node__content:hover {
                            background-color: #F7F7F9;
                        }
                        .custom-tree-node {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            width: 80%;

                            .label_span {
                                width: 90%;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                            }

                            .label_span_1 {
                                font-size: 16px;
                                // color: #333333;
                            }
                            .label_span_0 {
                                font-size: 14px;
                                color: #333333;
                            }

                            .icon_split {
                                width: 16px;
                                height: 16px;
                            }

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

            .current_tab_change {
                padding: 16px 24px;
                background: #FFF;
                margin-bottom: 12px;

                .tab_desc {
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #999999;
                    display: block;
                    margin-top: 6px;
                }
            }
        }
}
</style>