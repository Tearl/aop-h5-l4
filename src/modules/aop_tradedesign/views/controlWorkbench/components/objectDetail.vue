<template>
    <div class="obj_detail_box">
        <div class="accept_tabs">
            <el-tabs v-model="activeTabs" @tab-click="handleAttrClick">
                <el-tab-pane label="基本信息" name="info"></el-tab-pane>
                <el-tab-pane label="对象属性" name="attr"></el-tab-pane>
                <el-tab-pane label="对象关系" name="relation"></el-tab-pane>
                <el-tab-pane label="S6服务" name="behavior"></el-tab-pane>
                <el-tab-pane label="映射业务对象" name="mapObj"></el-tab-pane>
            </el-tabs>
        </div>
        <!-- 基本信息 -->
        <div class="item_box info_box" v-if="activeTabs == 'info'">
            <div class="info_item">
                <span class="info_label">对象名称：</span>
                <span>{{ baseInfo.name || '/' }}</span>
            </div>
            <div class="info_item">
                <span class="info_label">编码：</span>
                <span>{{ baseInfo.code || '/' }}</span>
            </div>
            <div class="info_item">
                <span class="info_label">对象类型：</span>
                <span>{{ baseInfo.objType || '/' }}</span>
            </div>
            <div class="info_item">
                <span class="info_label">分类：</span>
                <span>{{ baseInfo.sort || '/' }}</span>
            </div>
            <div class="info_item">
                <span class="info_label">描述：</span>
                <span>{{ baseInfo.desc || '/' }}</span>
            </div>
            <div class="info_item">
                <span class="info_label">更新人：</span>
                <span>{{ baseInfo.updateUser || '/' }}</span>
            </div>
            <div class="info_item">
                <span class="info_label">更新时间：</span>
                <span>{{ baseInfo.updateTime || '/' }}</span>
            </div>
        </div>
        <!-- 对象属性 -->
        <div class="item_box table_box" v-if="activeTabs == 'attr'">
            <el-table :data="attrList">
                <el-table-column prop="rootName" label="字段名称" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="编码" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="数据类型" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="描述" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 对象关系 -->
        <div class="item_box table_box" v-if="activeTabs == 'relation'">
            <el-table :data="relationList">
                <el-table-column prop="rootName" label="关系名称" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="编码" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="当前对象" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="目标对象" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="关系类型" min-width="120" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="关系重数" min-width="120" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- S6服务 -->
        <div class="item_box table_box" v-if="activeTabs == 'behavior'">
            <el-table :data="serviceList">
                <el-table-column prop="rootName" label="服务编码" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="服务名称" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="服务描述" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="relashMult" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="check(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!---映射业务对象-->
        <div class="item_box table_box" v-if="activeTabs == 'mapObj'">
            <el-table :data="serviceList">
                <el-table-column prop="rootName" label="业务对象编码" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="业务对象名称" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="分类" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rootName" label="属性" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rootName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="relashMult" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="check(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- S6服务详情 -->
        <el-drawer size='46%' title="S6服务详情" :visible.sync="S6DrawerVisible" direction="rtl" :append-to-body="true" :wrapperClosable="false"
            @closed="closed">
            <S6Details :basicData="basicData" />
        </el-drawer>
    </div>
</template>

<script>
import S6Details from "./S6Details.vue";

export default {
    props: {

    },
    components: {
        S6Details,
    },
    data() {
        return {
            activeTabs: 'info',
            baseInfo: {}, // 基本信息
            attrList: [], // 对象属性
            relationList: [], // 对象关系
            basicData: {},
            S6DrawerVisible: false,
            serviceList: [
                {
                    rootName: '服务1',
                    rootName: '服务1',
                    rootName: '服务1',
                },

            ], // S6服务
        }
    },
    methods: {
        // 查看S6服务详情
        check(row) {
            // this.basicData = row;
            this.S6DrawerVisible = true;
        },

    },
}

</script>
<style lang='scss' scoped>
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

.item_box {
    padding: 0 24px;
}

.info_box {
    .info_item {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        font-weight: 400;
        margin-bottom: 20px;

        .info_label {
            display: inline-block;
            width: 100px;
            text-align: right;
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
</style>