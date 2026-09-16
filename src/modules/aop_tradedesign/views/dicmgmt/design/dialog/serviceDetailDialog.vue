<template>
    <el-dialog
        title="查看服务详情"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_servicedetaildialog"
        :visible.sync="dialogVisible"
        width="1000px"
        :close-on-click-modal="false"
    >
        <div class="submit_record_not_pass_content">
            <div class="service_info">
                <h1>服务基础信息</h1>
                <div class="info">
                    <div class="info_cell">
                        <span class="label">服务编号：</span>
                         <span class="label_value">{{serviceInfo.apiCode}}</span>
                    </div>
                    <div class="info_cell">
                        <span class="label">服务ID：</span>
                         <span class="label_value">{{serviceInfo.apiId}}</span>
                    </div>
                     <div class="info_cell">
                        <span class="label">服务名称：</span>
                         <span class="label_value">{{serviceInfo.apiName}}</span>
                    </div>
                    <div class="info_cell" v-show="from !== 'd2'">
                        <span class="label">服务数据集：</span>
                         <span class="label_value">{{serviceInfo.dataSetNm}}</span>
                    </div>
                    <div class="info_cell">
                        <span class="label">服务描述：</span>
                         <span class="label_value">{{serviceInfo.apiDesc}}</span>
                    </div>
                </div>
            </div>
            <div class="cut_line"></div>

            <div class="table_content">
                <h1>输入输出</h1>
                <div class="input">
                    <h1>入参</h1>
                    <el-table class="common_table" row-key="id" :data="serviceInfo.inParams" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column label="参数名" prop="two"></el-table-column>
                        <el-table-column label="英文" prop="paramKey"></el-table-column>
                        <el-table-column width="150" label="是否必填" prop="isNeed">
                            <template slot-scope="scope">
                                <span>{{scope.row.isNeed == '1' ? '必填':'非必填'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" prop="three"></el-table-column>
                        <el-table-column width="100" label="长度" prop="paramLength"></el-table-column>
                    </el-table>
                </div>
                <div class="input">
                    <h1>出参</h1>
                    <el-table class="common_table" row-key="id" :data="serviceInfo.outParams" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column label="参数名" prop="two"></el-table-column>
                        <el-table-column label="英文" prop="paramKey"></el-table-column>
                        <el-table-column width="150" label="是否必填" prop="isNeed">
                            <template slot-scope="scope">
                                <span>{{scope.row.isNeed == '1' ? '必填':'非必填'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" prop="three"></el-table-column>
                        <el-table-column width="100" label="长度" prop="paramLength"></el-table-column>
                    </el-table>
                </div>
                <h1 v-show="from !== 'd2'">业务规则</h1>
                <el-table class="common_table" :data="serviceInfo.ifpBusinessRuleList" v-show="from !== 'd2'">
                    <el-table-column label="规则编号(R+3位编号)" min-width="20" prop="briBsnruleCode"></el-table-column>
                    <el-table-column show-overflow-tooltip label="规则名称" min-width="20" prop="briRuleNm"></el-table-column>
                    <el-table-column show-overflow-tooltip label="业务规则" min-width="60" prop="briBsnruleNature"></el-table-column>
                </el-table>
            </div>
        </div>

    </el-dialog>
</template>
<script>
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],

    props: {
        from: {
            type:String,
            default:''
        },
        value: {
            type: Boolean,
            default: false,
        },
        apiId: {
            type:String,
            default: ''
        }
    },

    computed: {
        
    },

    data() {
        return {
            serviceInfo: {}
        };
    },

    mounted() {
        this.queryServiceDetail()
    },

    methods: {
        async queryServiceDetail() {
            const { apiId, apiCode, apiName, apiDesc, ifpBusinessRuleList, puApiParams, dataSetNm } = await this.rpc.d1workspace.d1ServiceApiDetail({
                apiId: this.apiId
            })
            let inParams = this.groupTree(puApiParams.filter(item => item.paramDirection == '0') || [])
            let outParams = this.groupTree(puApiParams.filter(item => item.paramDirection == '1') || [])
            console.log(inParams, outParams, '111000----------')
            this.serviceInfo = {
                apiId, apiCode, apiName, apiDesc, ifpBusinessRuleList, inParams, outParams,
                dataSetNm
            }
        },

        groupTree(arr) {
            let treeArr = []
            let treeItem = {}
            var typetokey = {
                'List':'数组',
                'Object':'对象',
                'Float':'数字',
                'Boolean':'布尔',
                'String':'字符串'
            }
            for(let item of arr){
                treeItem[item.paramOrder] = item
                
            }
            for(let key in treeItem) {
                let parentId = treeItem[key].paramParentId
                if(parentId !== '') {
                if(!treeItem[parentId].children) {
                    treeItem[parentId].children = []
                }
                treeItem[key].one = treeItem[key].paramKey
                treeItem[key].two = treeItem[key].paramCName
                treeItem[key].three = typetokey[treeItem[key].paramValueType]
                treeItem[key].four = treeItem[key].isFilter == '1' ? '是' : '否'
                treeItem[key].five = treeItem[key].paramDesc
                treeItem[key].id = treeItem[key].paramOrder
                treeItem[key].children = []
                treeItem[parentId].children.push(treeItem[key])
                }else {
                treeItem[key].one = treeItem[key].paramKey
                treeItem[key].two = treeItem[key].paramCName
                treeItem[key].three = typetokey[treeItem[key].paramValueType]
                treeItem[key].four = treeItem[key].isFilter == '1' ? '是' : '否'
                treeItem[key].five = treeItem[key].paramDesc
                treeItem[key].id = treeItem[key].paramOrder
                treeItem[key].children = []
                treeArr.push(treeItem[key])
                }
            }
            console.log(treeArr, 'treeArr----')
            return treeArr
        },

        // 处理tree数据
        // paramsFormatToTreeData(list) {
        //     let arr = []
        //     list.forEach(el => {
        //         if(el.paramParentId == '') {
        //             el.children = []
        //             arr.push(el)
                    
        //         } else if()
        //     })
        // }
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
<style lang="scss">
.inner_cheetah_comps_servicedetaildialog {
    
}
</style>
<style lang="scss">
.inner_cheetah_comps_servicedetaildialog {
    .submit_record_not_pass_content {
        
        .service_info {
            h1 {
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #111111;
                margin-bottom: 12px;
            }

            .info {
                display: flex;
                flex-wrap: wrap;
                padding: 8px 0;
                .info_cell {
                    width: 50%;
                    margin-bottom: 16px;

                    .label {
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #999999;
                    }
                    .label_value {
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #333330;
                    }
                }
            }
            
        }

        .cut_line {
            width: 952px;
            height: 1px;
            background: #E7E7EE;
        }
        .table_content {
            h1 {
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #111111;
                margin: 24px 0 20px 0;
            }
            .input, .output {
                h1 {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #111111;
                    margin-bottom: 16px;
                }

                
            }
        }
    }
    .common_table {
                    

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
    }
}
</style>
