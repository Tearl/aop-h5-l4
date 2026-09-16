<template>
    <div class="view_object">
        <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="基本信息" name="tab1"></el-tab-pane>
            <el-tab-pane label="对象属性" name="tab2"></el-tab-pane>
            <el-tab-pane label="对象关系" name="tab3"></el-tab-pane>
            <el-tab-pane label="对象行为" name="tab4"></el-tab-pane>
            <el-tab-pane label="映射库表对象" name="tab5"></el-tab-pane>
        </el-tabs>
        <!-- <div style="width: 100%; height: 1px; background: #e7e7ee"></div> -->
        <div class="demo-drawer__content" v-show="activeName == 'tab1'">
            <div class="body">
                <div class="objectInfo_main">
                    <div class="objectInfo_main_item" v-for="(item, index) in objectInfoData" :key="index">
                        <label>{{ item.label }}</label>
                        <span>{{ item.value }}</span>
                    </div>
                    <!-- <div class="objectInfo_main_item" v-for="(item, index) in objectInfoData" :key="index">
            <label>{{ item.label }}</label>
            <span>{{ item.value }}</span>
          </div> -->
                </div>
            </div>
        </div>
        <div class="demo-drawer__content" v-if="activeName == 'tab2'">
            <div class="body">
                <el-table :data="l5SysBizObjectAttributeDTOs">
                    <el-table-column prop="dictryName" label="字段名称" width="">
                    </el-table-column>
                    <el-table-column prop="dictryNo" label="编码" width="">
                    </el-table-column>
                    <el-table-column prop="dictryType" label="数据类型">
                    </el-table-column>
                    <el-table-column prop="dictryDesc" label="描述" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{
                                scope.row.dictryDesc.length > 0 ? scope.row.dictryDesc : "/"
                            }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="demo-drawer__content" v-if="activeName == 'tab3'">
            <div class="body content">
                <div class="obj-relation-content">
                    <el-table :data="relationTableData" style="width: 100%; margin-top: 14px">
                        <el-table-column prop="obrName" label="关系名称">
                        </el-table-column>
                        <el-table-column prop="obrCode" label="编码"> </el-table-column>
                        <el-table-column prop="curObjName" label="当前对象">
                        </el-table-column>
                        <el-table-column prop="tgtObjName" label="目标对象">
                        </el-table-column>
                        <el-table-column prop="obrRelash" label="关系类型">
                            <template slot-scope="scope">
                                {{ relationMap[scope.row.obrRelash] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="relashMult" label="关系重数">
                            <template slot-scope="scope">
                                {{ relashMultNameFun(scope.row.relashMult) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="demo-drawer__content" v-if="activeName == 'tab4'">
            <div class="body content">
                <div class="obj-relation-content behavior_box">
                    <div class="list_box">
                        <span v-for="(item, index) in source" :key="index" :class="{ active: tabActive == index }"
                            @click="tabActive = index">{{ item.name
                            }}</span>
                    </div>


                    <div style="flex: 1; border-left: 1px solid #e5e5e5;">
                        <div class="content_list">
                            <div class="card_title">
                                <span class="d_line"></span>
                                <span class="d_detail">基本信息</span>
                            </div>
                            <el-row>
                                <el-col :span="12">
                                    <div class="info_item">
                                        <span class="info_label">对象行为：</span>
                                        <span>{{ '/' }}</span>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="info_item">
                                        <span class="info_label">行为编码：</span>
                                        <span>{{ '/' }}</span>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <div class="info_item">
                                        <span class="info_label">描述：</span>
                                        <span>客户注册后保存用户注册信息</span>
                                    </div>
                                </el-col>

                            </el-row>
                            <div class="card_title">
                                <span class="d_line"></span>
                                <span class="d_detail">映射S6</span>
                            </div>
                        </div>
                        <div style="width: 100%; padding: 0 20px;">
                            <el-table :data="objectBehaviorInfos" style="width: 100%; margin-top: 14px">
                                <el-table-column prop="obeName" label="服务编码">
                                </el-table-column>
                                <el-table-column prop="obeNo" label="服务名称"> </el-table-column>
                                <el-table-column prop="obeDesc" label="服务状态"> </el-table-column>
                                <el-table-column prop="obeDesc" label="操作">
                                    <template slot-scope='scope'>
                                        <el-button type="text" @click="look(scope.row)">查看</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="demo-drawer__content" v-if="activeName == 'tab5'">
            <div class="body content">
                <div class="obj-relation-content">
                    <el-table :data="relationTableData" style="width: 100%; margin-top: 14px">
                        <el-table-column prop="obrName" label="库表对象编码">
                        </el-table-column>
                        <el-table-column prop="obrCode" label="库表对象名称"> </el-table-column>
                        <el-table-column prop="curObjName" label="分类">
                        </el-table-column>
                        <el-table-column prop="tgtObjName" label="属性">
                        </el-table-column>
                        <el-table-column prop="obrRelash" label="关系类型">
                            <template slot-scope="scope">
                                {{ relationMap[scope.row.obrRelash] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="relashMult" label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <el-drawer size='46%' title="S6服务详情" :visible.sync="S6DrawerVisible" direction="rtl" :wrapperClosable="false"
            @closed="closed">
            <S6Details :basicData="basicData" />
        </el-drawer>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import S6Details from "./S6Details.vue";
export default {
    mixins: [mixin],
    props: {
        title: {
            type: String,
            default: true,
        },
        value: {
            type: Boolean,
            default: () => false,
        },
        objectData: {
            type: Object,
            default: {},
        },
    },
    components: {
        S6Details
    },
    data() {
        return {
            activeName: "tab1",
            relationMap: {
                association: "关联",
                aggregation: "聚合",
                combination: "组合",
                extends: "继承",
            },
            objectInfoData: [
                {
                    label: "对象名称：",
                    value: "/",
                },
                {
                    label: "编码：",
                    value: "/",
                },
                {
                    label: "对象类型：",
                    value: "/",
                },
                {
                    label: "分类：",
                    value: "/",
                },

                {
                    label: "所属业务域：",
                    value: "/",
                },
                {
                    label: "所属中心：",
                    value: "/",
                },

                {
                    label: "更新人：",
                    value: "/",
                },
                {
                    label: "更新时间：",
                    value: "/",
                },
                {
                    label: "描述：",
                    value: "/",
                },
            ],
            tableData: [],

            objectActionRemark: "/",

            relationTableData: [],
            objectBehaviorInfos: [
                {
                    obeName: '新建客户信息',
                    obeNo: 'createCustomerInfo',
                    obeDesc: '客户注册后保存用户注册信息',

                },

            ],
            optionsRelation: [
                {
                    value: "association",
                    label: "关联",
                },
                {
                    value: "aggregation",
                    label: "聚合",
                },
                {
                    value: "combination",
                    label: "组合",
                },
                {
                    value: "extends",
                    label: "继承",
                },
            ],
            optionsNum: [
                {
                    value: "0-N",
                    label: "1:0..*",
                },
                {
                    value: "1-N",
                    label: "1:1..*",
                },
                {
                    value: "0-1",
                    label: "1:0..1",
                },
                {
                    value: "1-1",
                    label: "1:1",
                },
            ],
            optionsTypeMap: {
                1: "用户",
                2: "机构",
                3: "渠道",
                4: "产品",
                5: "合约",
                6: "系统",
            },
            source: [
                {
                    name: '新建客户信息',
                    code: 'createCustomerInfo'
                },
                {
                    name: '查询客户信息',
                    code: 'queryCustomerInfo'
                },
                {
                    name: '更新客户信息',
                    code: 'updateCustomerInfo'
                },
                {
                    name: '删除客户信息',
                    code: 'deleteCustomerInfo'
                }
            ],
            tabActive: 0,
            S6DrawerVisible: false,
            basicData: {}
        };
    },
    computed: {
        viewObjectVisible: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
    },
    created() {
        // this.qryObjBizObjectInfoV2();
    },
    methods: {
        async qryObjBizObjectInfoV2() {
            let res = await this.rpc.controlWorkbench.qryObjBizObjectInfoV2({
                objId: this.objectData.objId,
            });
            this.objectInfoData[0].value = res.objName;
            this.objectInfoData[1].value = res.objCode;
            this.objectInfoData[2].value =
                res.objType == "00" ? "实体对象" : "值对象";
            this.objectInfoData[3].value = this.optionsTypeMap[res.objClass];
            this.objectInfoData[4].value = res.updateUserName;
            this.objectInfoData[5].value = res.updateTime;
            this.objectInfoData[6].value = res.objDesc;

            this.l5SysBizObjectAttributeDTOs = res.attributeInfos;
            this.relationTableData = res.objectRelInfos;
            this.objectBehaviorInfos = res.objectBehaviorInfos;
        },

        relashMultNameFun(key) {
            const tmp = this.optionsNum.find((item) => item.value == key);
            return tmp?.label;
        },
        look() {
            this.S6DrawerVisible = true
        }
    },
};
</script>
<style lang="scss" scoped>
.view_object {
    width: 100%;

    ::v-deep .el-tabs {
        min-height: 48px;
        border-bottom: 2px solid #E7E7EE !important;

        .el-tabs__header {
            padding-left: 0px;
            background: #fff;
            margin: 0;
        }

        .el-tabs__nav {
            font-family: PingFangSC-Semibold;
        }

        .el-tabs__nav-wrap::after {
            background: #fff;
        }

        .el-tabs--top .el-tabs__item.is-top {
            font-size: 14px;
        }

        .el-tabs__content {
            position: static;
        }

        .el-tabs__item {
            height: 48px;
            line-height: 48px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            font-weight: 400;
        }

        .el-tabs__item.is-active {
            color: #358aff;
        }

        .el-tabs__item.is-active {
            outline-offset: 0 !important;
            box-shadow: none !important;
        }

        .el-tabs__item:hover {
            color: #358aff;
        }

        .el-tabs__active-bar {
            background-color: #358aff;
            height: 3px;
        }

        .is-disabled {
            cursor: not-allowed;

            &:hover {
                color: #c0c4cc;
            }
        }
    }

    .demo-drawer__content {
        height: 90%;

        .body {
            height: 100%;
            // padding: 0 20px;
            border-bottom: 1px solid #f7f7f9;
            margin-top: 20px;
        }
    }

    .obj-action-cont {
        display: flex;

        .obj-action-cont-itemList {
            width: 152px;

            .obj-action-cont-itemList-item {
                width: 144px;
                height: 34px;
                line-height: 34px;
                border-radius: 2px;
                font-size: 14px;
                margin-top: 8px;
                display: flex;
                justify-content: space-around;
                padding: 0 10px;

                .obj-action-cont-itemList-item-icon {
                    content: " ";
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background: url("~@m/assets/images/icon_移动@2x.png");
                    background-size: cover;
                    margin-top: 9px;
                }

                .obj-action-cont-itemList-item-name {
                    flex: 1;
                    margin-left: 6px;
                    width: 96px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .obj-action-cont-itemList-item-delete {
                    padding-top: 9px;
                }
            }

            .actived {
                background: #f0f5ff;
                color: #358aff;
            }
        }

        .obj-action-cont-item-cont {
            padding: 0 24px;
            border-left: 1px solid #dde0e4;
            flex: 1;
            margin-left: 8px;
        }
    }

    .obj-relation-content-tips {
        height: 32px;
        line-height: 32px;
        background: #fef2de;
        color: #f5a623;
        margin-bottom: 24px;

        p {
            padding-left: 20px;
        }
    }

    .objectInfo_main {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        // padding-bottom: 12px;
        background: #FAFAFC;
        padding: 20px 24px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        font-weight: 400;


        // border-bottom: 1px solid rgba(238, 240, 245, 1);
        .objectInfo_main_item {
            width: 50%;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            color: #333;
            // label {
            //     // color: #999;
            // }
        }
    }

    .objectInfo_remark {
        display: flex;
        overflow: hidden;
        // margin-top: 12px;
        font-size: 14px;
        // min-height: 36px;
        // line-height: 36px;
        color: #333;

        label {
            min-width: 42px;
        }

        div {
            min-height: 20px;
        }
    }

    .objectInfo_main_item_remark {

        // color: #999;
        span {
            color: #333;
        }
    }

    .objectAction_main_param {
        h5 {
            color: #333;
            font-weight: 600;
            margin-top: 24px;
        }
    }

    .jh {
        display: inline-block;
        width: 44px;
        height: 20px;
        line-height: 18px;
        font-size: 12px;
        border: 1px solid #358aff;
        text-align: center;
        border-radius: 2px;
        color: #358aff;
        margin-left: 8px;
    }

    ::v-deep.el-table .el-table__body tr {
        cursor: pointer;
    }

    ::v-deep.el-table th {
        background: #fafafc;
        font-size: 14px;
        color: #333333;
    }

    ::v-deep.el-table th .cell {
        padding-left: 24px;
        line-height: 23px;
    }

    ::v-deep.el-table td {
        padding: 11px 0;
        font-size: 14px;
        color: #666666;
        position: relative;
    }

    ::v-deep.el-table td .cell {
        padding-left: 24px;
        line-height: 23px;
    }


}

.behavior_box {
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;

    .list_box {
        width: 15%;
        display: flex;
        flex-direction: column;
        padding-right: 20px;

        span {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #e5e5e5;
            font-size: 14px;
            line-height: 42px;
            margin-bottom: 10px;
            cursor: pointer;

            &.active {
                border: 1px solid #358AFF;
                color: #358AFF;
            }
        }
    }

    .content_list {
        // flex: 1;
        padding: 0 20px;




        .card_title {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #333;
            margin-bottom: 24px;

            .d_line {
                display: inline-block;
                width: 3px;
                height: 14px;
                margin-right: 6px;
                background: #358AFF;
                flex-shrink: 0;
            }

            .d_detail {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #333333;
                letter-spacing: 0;
                font-weight: 500;
            }

            .card_desc_tips {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #999999;
                font-weight: 400;
                margin-left: 8px;
                line-height: 22px;
            }
        }

        .info_item {
            font-size: 14px;
            margin-bottom: 24px;

            .info_label {
                display: inline-block;
                width: 100px;
                text-align: right;
            }
        }
    }

    // .list_box {
    //     padding: 12px 24px;
    //     background: #F5F7FA;
    // }
}
</style>
