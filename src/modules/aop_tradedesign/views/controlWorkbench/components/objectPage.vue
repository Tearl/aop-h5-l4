<template>
    <div class="obj_detail_box">
        <!-- 基本信息 -->
        <div class="item_box info_box detail_box" v-if="activeTabs == '1'">
            <el-row>
                <el-col :span="12">
                    <div class="info_item">
                        <span class="info_label">对象名称：</span>
                        <span>{{ basicInfo.objName || '/' }}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="info_item">
                        <span class="info_label">编码：</span>
                        <span>{{ basicInfo.objCode || '/' }}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="info_item">
                        <span class="info_label">对象类型：</span>
                        <span>{{ basicInfo.objType == "00" ? "实体对象" : "值对象" || '/' }}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="info_item">
                        <span class="info_label">分类：</span>
                        <span>{{ optionsTypeMap[basicInfo.objClass] || '/' }}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="info_item">
                        <span class="info_label">创建人：</span>
                        <span>{{ basicInfo.userName || '/' }}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="info_item">
                        <span class="info_label">创建时间：</span>
                        <span>{{ basicInfo.createTime || '/' }}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="info_item" style="margin-bottom: 0;">
                        <span class="info_label">描述：</span>
                        <span>{{ basicInfo.objDesc || '/' }}</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 对象属性 -->
        <div class="item_box table_box" v-if="activeTabs == '2'">
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
                            scope.row.dictryDesc ? scope.row.dictryDesc : "/"
                        }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 对象关系 -->
        <div class="item_box table_box" v-if="activeTabs == '3'">
            <el-table :data="relationTableData">
                <el-table-column prop="obrName" label="关系名称">
                </el-table-column>
                <el-table-column prop="obrCode" label="编码"> </el-table-column>
                <el-table-column prop="curObjName" label="当前对象">
                </el-table-column>
                <el-table-column prop="tgtObjName" label="目标对象">
                    <template slot-scope="scope">
                        {{ scope.row.tgtObjName || '/' }}
                    </template>
                </el-table-column>
                <el-table-column prop="obrRelash" label="关系类型">
                    <template slot-scope="scope">
                        {{ formatTypeMap(scope.row.obrRelash) || '/' }}
                    </template>
                </el-table-column>
                <el-table-column prop="relashMult" label="关系重数">
                    <template slot-scope="scope">
                        {{ relashMultNameFun(scope.row.relashMult) || '/' }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 对象行为 -->
        <div class="item_box table_box " v-if="activeTabs == '4'">
            <div class="behavior_box" v-if="objectBehaviorInfos && objectBehaviorInfos.length > 0">
                <div class="list_box">
                    <div v-for="(item, index) in objectBehaviorInfos" :key="index"
                        :class="{ active: tabActive == index }" @click="clickTab(index)">
                        <!-- <span>
                            {{ item.obeName }}
                        </span> -->
                        <span class="apply_desc" v-if="item.approvalStatus == '01'">申请</span>
                        <el-tooltip class="item" effect="dark" :content="item.obeName" placement="top-start">
                            <span class="tag_name">
                                {{ item.obeName }}
                            </span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="content_list">
                    <div class="card_title">
                        <span class="d_line"></span>
                        <span class="d_detail">基本信息</span>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <div class="info_item">
                                <span class="info_label">对象行为：</span>
                                <span>{{ objectBehavior.obeName || '/' }}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="info_item">
                                <span class="info_label">行为编码：</span>
                                <span>{{ objectBehavior.obeNo || '/' }}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="info_item">
                                <span class="info_label">描述：</span>
                                <span>{{ objectBehavior.obeDesc || '/' }}</span>
                            </div>
                        </el-col>

                    </el-row>
                </div>
            </div>
            <el-empty v-else description="暂无数据" :image-size="100">
            </el-empty>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        activeTabs: {
            type: String,
            default: '1'
        },
        basicInfo: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            // activeTabs: 'info',
            baseInfo: {}, // 基本信息
            attrList: [], // 对象属性
            relationList: [], // 对象关系
            behaviorList: [], // 对象行为
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
            relationMap: {
                association: "关联",
                aggregation: "聚合",
                combination: "组合",
                extends: "继承",
            },
            // l5SysBizObjectAttributeDTOs: [],
            // relationTableData: [],
            // objectBehaviorInfos: [],
            objectBehavior: {}
        }
    },
    methods: {
        relashMultNameFun(key) {
            const tmp = this.optionsNum.find((item) => item.value == key);
            return tmp?.label;
        },
        clickTab(index) {
            this.tabActive = index;
            this.objectBehavior = this.objectBehaviorInfos[index];
        },
        formatTypeMap(type) {
            return this.relationMap[type] || '/'
        }
    },
    created() {
        // if (this.basicInfo.objectBehaviorInfos && this.basicInfo.objectBehaviorInfos.length > 0) {
        //     this.objectBehavior = this.basicInfo.objectBehaviorInfos[0];
        // }
    },
    watch: {
        basicInfo: {
            deep: true,
            handler(newVal) {
                if (newVal.objectBehaviorInfos && newVal.objectBehaviorInfos.length > 0) {
                    this.objectBehavior = newVal.objectBehaviorInfos[0];
                    this.tabActive = 0;
                }
            }
        }
    },
    computed: {
        l5SysBizObjectAttributeDTOs() {
            return this.basicInfo.attributeInfos || []
        },
        relationTableData() {
            return this.basicInfo.objectRelInfos || []
        },
        objectBehaviorInfos() {
            return this.basicInfo.objectBehaviorInfos || []
        },

    }

}

</script>
<style lang='scss' scoped>
.obj_detail_box {
    .detail_box {
        padding: 20px 24px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        font-weight: 400;
    }
}

.accept_tabs {
    width: 100%;
    margin-bottom: 12px;
    padding: 0 24px;

    ::v-deep .el-tabs__nav-wrap {
        margin: 0;
        line-height: 48px;
    }

    ::v-deep .el-tabs__item {
        height: 48px;
        line-height: 48px;
    }
}


.info_box {
    .info_item {
        margin-bottom: 24px;

        .info_label {
            display: inline-block;
            width: 100px;
            text-align: left;
        }
    }
}

.table_box {
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
        width: 20%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-right: 20px;
        overflow-y: auto;
        // box-sizing: border-box;

        div {
            display: flex;
            justify-content: center;
            align-items: center;
            // text-align: center;
            // flex-shrink: 1;
            border: 1px solid #e5e5e5;
            font-size: 14px;
            line-height: 36px;
            margin-bottom: 10px;
            cursor: pointer;
            width: 100%;
            // padding: 0 10px;

            .apply_desc {
                color: #67c23a;
                margin: 0 4px;
                white-space: nowrap;
                font-size: 12px;
                border: 1px solid #67c23a;
                line-height: normal;
                padding: 2px 4px;
            }

            .tag_name {
                min-width: 0;
                /* 防止内容撑开 */
                padding: 4px 8px;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
            }

            &.active {
                border: 1px solid #358AFF;
                color: #358AFF;
            }
        }
    }

    .content_list {
        flex: 1;
        padding: 0 20px;
        border-left: 1px solid #e5e5e5;

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