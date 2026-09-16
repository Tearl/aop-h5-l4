<template>
    <el-dialog
        title="导入历史模块"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_historyVersionChoseModuleDialog"
        :visible.sync="dialogVisible"
        width="1000px"
        :close-on-click-modal="false"
    >
        <div class="flex">
            <div class="comps_aside">
                <h1>{{moduleInfo.moduleName}}</h1>
                <div class="comps_aside_content">
                    <el-tree
                        ref="treeDom"
                        class="treeClass"
                        :data="treeData"
                        :show-checkbox="showCheckbox"
                        :check-strictly="true"
                        node-key="id"
                        default-expand-all
                        indent=10
                        @node-click="handleNodeClick"
                        @check-change="nodeCheckboxed"
                        :expand-on-click-node="true"
                        icon-class="el-icon-arrow-right"
                        current-node-key="0.0"
                        >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span class="label_span" :title="node.label">{{ node.label}}</span>
                            <!-- <img @click="doOperate('module-info')" v-show="currentIndex == data.id && data.id != '0' " src="../assets/icon_look_h.png" class="icon_split" alt=""> -->
                        </span>
                    </el-tree>

                </div>
            </div>
            <div class="right_main" v-if="treeData[0].children.length > 0">

                <div class="create-content-wrapper">
                    <el-tabs v-model="activeName" @tab-click="tabClick">
                        <el-tab-pane label="价值流矩阵" name="0">
                        </el-tab-pane>
                        <el-tab-pane label="功能列表" name="1">
                        </el-tab-pane>
                    </el-tabs>
                </div>

                <component v-bind:is="currentTabComponent" :moduleInfos="moduleInfos"></component>
            </div>

            <div class="right_main" v-else>
                <div class="empty">
                    <div class="empty_main">
                        <img src="../../assets/page.png" alt="">
                        <span class="desc">暂无数据</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="inner_cheetah_common_btns_area" slot="footer">
            <el-button @click="dialogVisible = false" :disabled="buttonDisabled">取 消</el-button>
            <el-button type="primary" @click="submitForm" :disabled="buttonDisabled">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import lookd1ModuleFuncList from '../moduleInfo/historyFuncList.vue'
import lookmoduleStreamMatrix from '../appInfo/moduleMatrix.vue'
import lookmoduleDataSet from '../moduleInfo/moduleDataSet.vue'
import lookmoduleServiceSet from '../moduleInfo/moduleServiceSet.vue'
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],

    props: {
        value: {
            type: Boolean,
            default: false,
        },
        moduleInfo: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        
    },

    data() {
        return {
            buttonDisabled: false,
            activeName: '0',
            treeData:[
                {
                    label: '',
                    id: '0',
                    children: []
                }
            ],
            currentTabComponent: '',
            showCheckbox: true,
            moduleInfos: {},
            checkedData: {}
        };
    },

    created() {
        this.initData()
    },

    mounted() {
        this.currentTabComponent = this.mapCrrrentComponent(this.activeName)
    },

    methods: {
        submitForm() {
            
            if(JSON.stringify(this.checkedData) === "{}") {
                this.$message.error('请选择历史版本！')
            } else {
                this.rpc.d1workspace.historyVersionChose({
                    isolateWorkspace: this.moduleInfo.isolateWorkspace,
                    moduleId: this.moduleInfo.appModuleId,
                    moduleVersion: this.moduleInfo.appModuleVersion,
                    aaiId: this.moduleInfo.appId,
                    aaiVersion: this.moduleInfo.appVersion,
                    historyModuleId: this.checkedData.moduleId,
                    historyModuleVersion: this.checkedData.moduleVersion,
                }).then(res => {
                    this.$emit('output')
                    this.dialogVisible = false
                })
                
            }
        },
        tabClick() {
            this.currentTabComponent = this.mapCrrrentComponent(this.activeName)
        },
        mapCrrrentComponent(index) {
            
            switch(index) {
                case '0': return lookmoduleStreamMatrix
                case '1': return lookd1ModuleFuncList
            }
        },
        handleNodeClick(data, node) {
            if(node.level == 2) {
                const { moduleVersion, moduleId } = data
                this.moduleInfos = {
                    moduleId,
                    moduleVersion
                }
            }
            
        },

        nodeCheckboxed(data, checked) {
            console.log(data, checked, '---000000')
            if(checked) {
                this.checkedData = data
            } else {
                this.checkedData = {}
            }
        },

        async initData() {
            const { dataList } = await this.rpc.d1workspace.moduleHistoryVersion({
                moduleId: this.moduleInfo.appModuleId
            })
            let formatList = dataList.map((item, index) => {
                return {
                    label: item.moduleVersion,
                    id: `0.${index}`,
                    ...item
                }
            })
            
            this.treeData[0].children = formatList
            this.treeData[0].id = "0"
            this.treeData[0].label = '模块版本列表'
            this.treeData[0].disabled = true
            if(formatList.length == 0) {
                this.showCheckbox = false
            }else {
                const { moduleVersion, moduleId } = formatList[0]
                this.moduleInfos = {
                    moduleId,
                    moduleVersion
                }
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
.inner_cheetah_comps_historyVersionChoseModuleDialog {
    /deep/.el-dialog {
        background: #F5F5F8;
    }
    /deep/.el-dialog__body {
        padding: 12px;
    }
    /deep/.el-dialog__footer {
        background: #FFF;
    }
}
</style>
<style lang="scss" scoped>
.inner_cheetah_comps_historyVersionChoseModuleDialog {
    // background: #F5F5F8;
    .flex {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        // min-height: calc(100vh - 179px);

        .comps_aside {
            width: 186px;
            background: #fff;
            border-radius: 2px;
            // min-height: calc(100vh - 179px);

            h1 {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #111111;
                margin: 14px 0 0 18px;
            }

            .appInfo_content {
                display: flex;
                align-items: center;
                margin: 12px 6px;
                padding: 9px 14px;
                background: #F0F5FF;
                cursor: pointer;

                .label_span {
                    width: 90%;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    color: #358AFF;
                }

                .icon_split {
                    width: 20px;
                    height: 20px;
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
                            height: 18px;
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
        // padding: 12px;
        // background: #fff;
        // min-height: calc(100vh - 179px);

        .appInfo_operate_block {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: #FFF;
            margin-bottom: 12px;

            .appInfo_operate_block_left {
                display: flex;
                align-items: center;

                h1 {
                    font-family: PingFangSC-Semibold;
                    font-size: 16px;
                    color: #000000;
                    letter-spacing: 0;
                    margin-right: 4px;
                }
                .version_span {
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #999999;
                    margin-right: 12px;
                }
                .status_span {
                    
                    border-radius: 2px;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    padding: 0 4px;
                }
                .status_01 {
                    color: #ff9104;
                    background: #fff4e5;
                    border: 0.5px solid rgba(255,145,4,1);
                }
                .status_02 {
                    color: #2ddaac;
                    background: #dffff6;
                }
                .aailabel_span {
                    color: #358aff;
                    background: #e7f1ff;
                    border: 0.5px solid rgba(53,138,255,1);
                    font-size: 12px;
                    padding: 0 4px;
                    margin-left: 8px;
                }
                .count_span {
                    font-size: 12px;
                    color: rgba(0,0,0,0.65);
                    background: #F5F5F5;
                    border: 0.5px solid rgba(217,217,217,1);
                    font-size: 12px;
                    padding: 0 4px;
                    margin-left: 8px;
                }
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


        .create-content-wrapper {
            background: #FFFFFF;
            margin-bottom: 12px;
            padding: 0 24px;

            /deep/.el-tabs__header {
                margin: 0;
            }
            /deep/.el-tabs__nav-wrap::after {
                height: 0px;
            }
            /deep/.el-tabs__item {
                height: 56px;
                line-height:56px;
            }
        }
        /deep/.el-tabs__item {
            box-shadow: none !important;
        }
    }

    /deep/.el-checkbox__input.is-disabled{
        display: none;
    }
}
</style>
