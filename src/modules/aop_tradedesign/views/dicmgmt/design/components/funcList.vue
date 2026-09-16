<template>
    <div class="d1_module_func_list_new">
        <!-- 搜索区域 -->
        <div class="d2_common_search_form" v-if="showSearch">
            <el-form :inline="true" size="small" label-position="right">
                <el-row class="search_bottom">
                    <el-col :span="20">
                        <el-form-item label="功能名称/ID：">
                            <el-input placeholder="请输入" v-model="formData.modelName" class="search_form_input_width"></el-input>
                        </el-form-item>
                        
                        
                        <el-form-item label="功能标签：">
                            <el-select v-model="formData.abiLabel" class="search_form_input_width">
                                <el-option
                                    v-for="item in functionOptions"
                                    :key="item.enumKey"
                                    :label="item.enumValue"
                                    :value="item.enumKey"
                                >
                                </el-option>
                            </el-select>   
                        </el-form-item>
                        <el-form-item label="创建人：">
                            <el-input placeholder="请输入" v-model="formData.qryUser" class="search_form_input_width"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <div class="form_btn">
                            <el-button size="small" type="primary" @click="queryModuleFuncList">查询</el-button>
                            <el-button size="small" @click="reset">重置</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div class="D2_workspace_table_list">
            <div class="table_operate">
                <div>
                    <el-button  icon="el-icon-plus" type="primary" size="small" @click="doOperate('func-create')">创建</el-button>
                    <el-button  icon="el-icon-download" type="warning" size="small" @click="doOperate('func-import')">导入</el-button>
                    <!-- <el-button  icon="el-icon-upload2" type="success" size="small">导出</el-button> -->
                </div>
                
                <common-table-operate :btnList="btnList" @btnClick="btnClick" />
            </div>

            <div class="table_main" :style="{paddingBottom: '4px', marginTop: changeView ? '12px' : '', background: !changeView ? '#FFFFFF' : '', overflowY: 'scroll'}">
                <!-- 表格展示 -->
                <el-table  
                    v-loading.lock="fullscreenLoading"
                    style="width: 100%" :stripe="hasRowLine?true:false" :data="list" class="D2_workspace_common_table" v-if="!changeView">
                    <el-table-column
                        label="功能名称"
                        prop="modelName"
                        min-width="100"
                        show-overflow-tooltip
                    >
                        <!-- <template slot-scope="scope">
                            <span @click="doOperate('module-info', scope.row)" class="blue_span">{{scope.row.modelName}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column
                        label="功能版本"
                        prop="modelVersion"
                        
                    ></el-table-column>
                    <el-table-column
                        label="功能标签"
                        prop="abiLabelName"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.abiLabelName
                                ? JSON.parse(scope.row.abiLabelName).join("；")
                                : "/"}}
                            </span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="gmtCreate" label="创建时间" min-width="130">
                    </el-table-column>
                    <el-table-column prop="userName" label="创建人">
                    </el-table-column>
                        
                    <el-table-column
                        label="操作"
                        width="230"
                    >
                        <template slot-scope="scope">
                            <div class="scope-opera-detail">
                                <div
                                    class="color-blue"
                                    @click="doOperate('func-info', scope.row)"
                                    
                                >
                                    查看
                                </div>
                                <div
                                    class="color-blue"
                                    @click="doOperate('func-edit', scope.row)"
                                    
                                >
                                    编辑
                                </div>
                                <div
                                    class="color-blue, color-blue-blue"
                                    @click="doOperate('func-del', scope.row)"
                                    
                                >
                                    删除
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 图表展示 -->
                <div class="application_manage_list_card" v-else v-loading.lock="fullscreenLoading">
                    <div
                        class="application_manage_list_card_item"
                        v-for="item in list"
                        :key="item"
                    >
                        <div class="application_manage_list_card_item_top">
                            <img
                                :src="item.modelLogo"
                                alt=""
                            >
                            <div class="application_manage_list_card_item_top_desc">
                                <div class="title_and_version">
                                    <h1>{{item.modelName}}</h1>
                                    <span>{{item.modelVersion}}</span>
                                </div>
                                
                                <div
                                    class="application_manage_list_card_item_platform"
                                >
                                    <span v-for="info in JSON.parse(item.abiLabelName).slice(0, 3)" :key="info">{{info}}</span>
                                    <!-- <span>{{item.funcNum}}个功能</span> -->
                                </div>
                            </div>
                        </div>
                        <div :title="item.modelDesc" class="application_manage_list_card_item_all_desc">
                            {{item.modelDesc}}
                        </div>
                        <div class="application_manage_list_card_item_create_desc">
                            <div>
                                <span>创建人：</span>
                                <span>{{item.userName}}</span>
                            </div>
                            <div>
                                <span>创建时间：</span>
                                <span>{{item.gmtCreate}}</span>
                            </div>
                        </div>
                        <div class="application_manage_list_card_item_bottom">

                                <span @click="doOperate('func-info', item)">查看</span>
                                <span @click="doOperate('func-edit', item)">编辑</span>
                                <span @click="doOperate('func-del', item)">删除</span>
                        </div>
                    </div>
                </div>

                <!-- 分页器 -->
                <div class="pagination" v-if="list.length > 0 && total > 10">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="page"
                        :page-sizes="[15, 30, 45,60,90]"
                        :page-size="pageNum"
                        layout="total,prev, pager, next, sizes, jumper"
                        :total="total"
                    >
                    </el-pagination>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import commonTableOperate from '../../components/CommonTableOperate.vue'
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],
    components: {
        commonTableOperate
    },
    inject: [ 'moduleInfo'],
    data() {
        return {
            showSearch: false,
            changeView: false,
            hasRowLine: false,
            page: '1',
            pageNum: '10',
            total: 0,
            formData: {
                modelName: '',
                modelCycleStatus: '',
                abiLabel: '',
                qryUser: ''
            },
            list: [
            ],
            modelCycleStatusNm: {
                '001': '生产中',
                '002': '待验收'
            },
            btnList: [
                {
                    defaultIcon: require('../../assets/common_search.png'),
                    activeIcon: require('../../assets/common_search_h.png'),
                    hasActive: false,
                    isPop: false
                },
                {
                    defaultIcon: require('../../assets/common_list.png'),
                    activeIcon: require('../../assets/common_list_h.png'),
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
            functionOptions: [],
            fullscreenLoading: false
        }
    },
    mounted() {
        console.log(this.moduleInfo, 'moduleInfo----')
        this.quertEnumType()
        this.queryModuleFuncList()
    },
    methods: {
        reset() {
            this.formData = {
                modelName: '',
                modelCycleStatus: '',
                abiLabel: '',
                qryUser: ''
            }
            this.queryModuleFuncList()
        },

        //查询渠道列表
        async quertEnumType() {
            const { aopEnumInfoListList } =
                await this.rpc.d1workspace.quertEnumType();
            //功能标签列表
            this.functionOptions = aopEnumInfoListList.filter(
                (item) => item.enumType === "functionLabel"
            );
        },

        async queryModuleFuncList() {
            this.fullscreenLoading = true
            const { infoList, turnPageTotalNum } = await this.rpc.d1workspace.d1ModuleFuncList({
                modelName: this.formData.modelName,
                abiLabel: this.formData.abiLabel,
                appModuleId: 'FM-MOD-2022-001507',
                appModuleVersion: '1.0',
                appId: 'FM-APP-2022-001530',
                appVersion: '1.0',
                isolateWorkspace: 'FM-SJD1MOD-2022-001244',
                qryUser: this.formData.qryUser
            })
            this.fullscreenLoading = false
            this.list = infoList || []
            this.total = turnPageTotalNum
        },

        btnClick(val) {
            switch (val) {
                case 0:
                    this.showSearch = !this.showSearch
                    break
                case 1:
                    this.changeView = !this.changeView
                    break
                case 2:
                    this.hasRowLine = !this.hasRowLine
                    break
            }
        },

        doOperate(operate, scope) {
            switch(operate) {
                case 'func-info':
                    this.$router.push({ path: '/aop_enddesign/d1interation/funcInfo', query: {
                        admiId: scope.admiId,
                        modelVersion: scope.modelVersion
                    } })
                    break
                case 'func-del':
                    this.$confirm("确定删除该功能吗？", "温馨提示").then(
                            (res) => {
                                this.rpc.d1workspace.delD1func({
                                    admiId: scope.admiId,
                                    modelVersion: scope.modelVersion
                                }).then(res => {
                                    this.$notify({
                                        title: "成功",
                                        message: "编辑成功",
                                        duration: 2000,
                                        type: "success",
                                    });
                                    this.queryModuleFuncList()
                                })
                            }
                        );
                    break
                case 'func-import':
                    this.$router.push({ path: '/aop_enddesign/d1interation/importFuncFile', query: {
                        // appModuleId: this.moduleInfo.appModuleId,
                        // appModuleVersion: this.moduleInfo.appModuleVersion,
                        // appId: this.moduleInfo.appId,
                        // appVersion: this.moduleInfo.appVersion,
                        // isolateWorkspace: this.moduleInfo.isolateWorkspace,
                    } })
                    break
                case 'func-create':
                    this.$router.push({ path: '/aop_enddesign/d1interation/funcCreate', query: { 
                        
                        operationType: '0',
                        // appModuleId: this.moduleInfo.appModuleId,
                        // appModuleVersion: this.moduleInfo.appModuleVersion,
                        // appId: this.moduleInfo.appId,
                        // appVersion: this.moduleInfo.appVersion,
                        // isolateWorkspace: this.moduleInfo.isolateWorkspace,
                        // aaiName: this.moduleInfo.aaiName,
                        // moduleName: this.moduleInfo.moduleName
                    } })
                    break
                case 'func-edit':
                    this.$router.push({ path: '/aop_enddesign/d1interation/funcCreate', query: { 
                        
                        operationType: '1',
                        appModuleId: this.moduleInfo.appModuleId,
                        appModuleVersion: this.moduleInfo.appModuleVersion,
                        appId: this.moduleInfo.appId,
                        appVersion: this.moduleInfo.appVersion,
                        isolateWorkspace: this.moduleInfo.isolateWorkspace,
                        aaiName: this.moduleInfo.aaiName,
                        moduleName: this.moduleInfo.moduleName,
                        admiId: scope.admiId,
                        modelVersion: scope.modelVersion,
                        tag: 'editor'
                    } })
                    break
            }
        }
    }
}
</script>

<style lang="scss">
.d1_module_func_list_new {
    // padding: 0 12px;
    .d2_common_search_form {
        background: #FFFFFF;
        padding: 16px;
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
    }

    .D2_workspace_table_list {

        .table_main {
            min-height: calc(100vh - 245px);
        }

        .table_operate {
            padding: 16px;
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
            .el-button--warning {
                background-color: #FF9104;
                border-color: #FF9104;
            }
        }
        .D2_workspace_common_table {
            padding: 0 16px;
            padding-bottom: 12px;

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

            .blue_span {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #358AFF;
                letter-spacing: 0;
                margin-right: 10px;
            }
            .del_span {
                
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #ff5f5f;
                letter-spacing: 0;
            }

            .scope-model-status {
                padding: 4px 7px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                letter-spacing: 0;
                border-radius: 2px;
            }
            
            .status_001 {
                color: #ff9104;
                background: #fff4e5;
            }
            .status_002 {
                color: #2ddaac;
                background: #dffff6;
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
            }
            .color-red {
                color: #fe5161;
            }
            .color-blue::after {
                margin: 0 5px;
                content: "|";
                color: #e9e9e9;
            }
            
            .color-blue-blue::after {
                content: "";
            }
        }

        .application_manage_list_card {
            display: grid;
            grid-template-columns:32% 32% 32%;
            justify-items: center;
            grid-gap: 12px 2%;

            .application_manage_list_card_item {
                width: 100%;
                // height: 172px;
                background: #ffffff;
                border-radius: 4px;
                cursor: pointer;
                position: relative;
                border: 1px solid rgba(230,230,230,1);

                &:hover {
                    box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.12);
                }

                .application_manage_list_card_item_top {
                    display: flex;
                    align-items: flex-start;
                    padding: 27px 16px 12px 16px;
                    position: relative;
                    cursor: pointer;

                    img {
                        width: 48px;
                        height: 48px;
                        margin-right: 16px;
                    }
                    .application_manage_list_card_item_top_desc {
                        height: 48px;
                        margin-bottom: 10px;
                        width: 82%;

                        .title_and_version {
                            display: flex;
                            align-items: center;
                            margin-bottom: 5px;
                        }

                        h1 {
                            font-family: PingFangSC-Medium;
                            font-size: 16px;
                            color: #333333;
                            line-height: 20px;
                            height: 20px;
                            margin-right: 8px;
                            max-width: 80%;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        span {
                            font-family: PingFangSC-Regular;
                            font-size: 12px;
                            color: #999999;
                        }
                        .application_manage_list_card_item_platform {
                            display: flex;
                            align-items: center;

                            span {
                                display: block;
                                padding: 0 4px;
                                background: #F5F5F5;
                                border-radius: 2px;
                                font-family: PingFangSC-Regular;
                                font-size: 12px;
                                color: rgba(0,0,0,0.65);
                                margin-right: 6px;
                                max-width: 30%;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                            }

                            .app_publish {
                                color: #358aff;
                                background: #e7f1ff;
                            }
                        }
                    }
                    .status-label {
                        width: 44px;
                        height: 20px;
                        text-align: center;
                        line-height: 20px;
                        position: absolute;
                        border-radius: 4px 0 4px 0;
                        font-size: 12px;
                        right: 0;
                        top: 0;
                    }
                    .status_01 {
                        background: #ffeaec;
                        color: #fe5161;
                    }
                    .status_02 {
                        color: #ff9104;
                        background: #fff4e5;
                    }
                    .status_03 {
                        color: #2ddaac;
                        background: #dffff6;
                    }
                    .status_04 {
                        background: #f2f8ff;
                        color: #358aff;
                    }
                    .status_-1 {
                        background: #f3f3f3;
                        color: #999999;
                    }
                }

                .application_manage_list_card_item_all_desc {
                    padding: 0 16px;
                    width: 100%;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #999999;
                    margin-bottom: 4px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    
                }

                .application_manage_list_card_item_create_desc {
                    display: flex;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #999999;
                    // padding: 14px 0px;
                    // margin: 4px 0 12px 0;
                    // box-shadow: inset 0 0.5px 0 0 #e9e9e9;
                    margin: 0 16px;
                    margin-bottom: 16px;
                    div:first-child {
                        margin-right: 16px;
                    }
                }

                .application_manage_list_card_item_bottom {
                    background: #f7f9fa;
                    box-shadow: inset 0 1px 0 0 #e9e9e9;
                    padding: 16px 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    span {
                        display: block;
                        width: 33.33%;
                        height: 16px;
                        text-align: center;
                        border-right: 1px solid #e8e8e8;
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #358aff;
                        cursor: pointer;

                        &:last-child {
                            border: none;
                        }
                    }
                    .btn_del {
                        &:hover {
                            color: #ff5f5f;
                        }
                    }
                    .width_50 {
                        width: 50%;
                    }
                }
            }
            .status_span {
                position: absolute;
                top: 0;right: 0;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                letter-spacing: 0;
                padding: 0 4px;
            }
            .status_001 {
                color: #FF9104;
                background: #FFF4E5;
            }
            .status_002 {
                color: #36D542;
                background: #E5FFE7;
            }
        }
        .pagination {
            padding: 12px;
            text-align: right;
        }
    }
}
</style>