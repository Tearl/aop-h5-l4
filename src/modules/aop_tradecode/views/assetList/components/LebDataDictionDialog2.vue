<template>
    <el-dialog title="请选择数据" class="leb_common_dialog leb_datadictionary_dialog"
        :visible.sync="dialogVisible" :append-to-body="true" width="1000px" :close-on-click-modal="false">
        <div class="leb_filter">
            <el-form ref="form" :model="formData" :inline="true" class="leb_filter_form" label-width="90px"> 
                <div>
                    <el-form-item class="leb_formitem" label="" prop="name">
                        <el-input v-model="formData.name" placeholder="参数名称、中文名、英文名或描述" :clearable="true"/>
                    </el-form-item>
                    <el-form-item class="leb_formitem" label="" prop="type">
                        <el-select v-model="formData.type" placeholder="参数类型" :clearable="true">
                            <el-option v-for="(typeInfo, index) in iTypeList" :key="index"
                                :value="typeInfo.type" :label="typeInfo.value"/>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item class="leb_formitem">
                    <el-button type="primary" @click="queryDictList()">查询</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="leb_body">
            <el-table :data="iDictList" class="leb_common_table" row-key="id"
                ref="dict" :tree-props="{children: 'children'}" :cell-class-name="renderCellClass"
                @expand-change="changeExpand">
                <el-table-column min-width="8%">
                    <template slot-scope="scope">
                        <el-radio
                          v-model="radio1"
                          :label="scope.row.key">
                          <span></span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="key" label="英文名" min-width="25%" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span :style="getTableIndent(scope.row)"></span>
                        <div class="el-table__expand-icon"
                            v-if="scope.row.children && scope.row.children.length"
                            :class="{' el-table__expand-icon--expanded': fieldExpandMap[scope.row.id]}"
                            @click="$refs.dict.toggleRowExpansion(scope.row);">
                            <i class="el-icon-arrow-right"></i>
                        </div>
                        <span>{{scope.row.key}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="中文名" min-width="25%" :show-overflow-tooltip="true"/>
                <el-table-column prop="type" label="变量数据类型" min-width="15%"/>
                <el-table-column prop="dictryLength" label="参数长度" min-width="15%"/>
                <el-table-column prop="desc" label="描述" min-width="25%" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.desc || '/'}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="leb_common_pagination">
                <el-pagination
                    @size-change="turnPage(0, $event)"
                    @current-change="turnPage(1, $event)"
                    :current-page.sync="currentPage"
                    :pager-count="5"
                    :page-sizes="[5, 10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="parseInt(turnPageTotalNum)"
                    :background="true"
                >
                </el-pagination>
            </div>
        </div>
        <div class="leb_common_btns_area" slot="footer">
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
            default: false
        },

        data: {
            type: Object,
            default () {
                return {}
            }
        },
        splitFirst:{
          type:String,
          default:''
        }
    },

    data () {
        return {
            radio1:[],
            iDictList: [],
            iSelectList: [],
            fieldExpandMap: {},
            disabledMap: {},
            formData: {
                name: '',
                type: ''
            },
            defaultType: 'string',
            typeMaps: {
                'String': 'string',
                'File': 'string',
                'List': 'array',
                'boolean': 'boolean',
                'char': 'string',
                'int': 'number',
                'byte': 'number',
                'short': 'number',
                'long': 'number',
                'float': 'number',
                'double': 'number',
                'Boolean': 'boolean',
                'Character': 'string',
                'Integer': 'number',
                'Byte': 'number',
                'Short': 'number',
                'Long': 'number',
                'Float': 'number',
                'Double': 'number',
                'BigDecimal': 'number',
                'Object': 'object',
                'Date': 'string'
            },
            iTypeList: [
                { type: "String", value: "String" },
                { type: "File", value: "File" },
                { type: "List", value: "List" },
                { type: "boolean", value: "boolean" },
                { type: "char", value: "char" },
                { type: "int", value: "int" },
                { type: "byte", value: "byte" },
                { type: "short", value: "short" },
                { type: "long", value: "long" },
                { type: "float", value: "float" },
                { type: "double", value: "double" },
                { type: "Boolean", value: "Boolean" },
                { type: "Character", value: "Character" },
                { type: "Integer", value: "Integer" },
                { type: "Byte", value: "Byte" },
                { type: "Short", value: "Short" },
                { type: "Long", value: "Long" },
                { type: "Float", value: "Float" },
                { type: "Double", value: "Double" },
                { type: "BigDecimal", value: "BigDecimal" },
                { type: "Object", value: "Object" },
                { type: "Date", value: "Date" }
            ],
            currentPage: 1,
            pageSize: 10,
            turnPageTotalNum: 0
        }
    },

    created () {
        this.initForm()
    },

    methods: {
        /**
         * 初始化表单
         */
        initForm () {
          if(this.splitFirst){
            this.formData.name=this.splitFirst;
          }
          let list = this.data.list || []
          this.disabledMap = list.reduce((retObj, info) => {
              retObj[info.key] = true
              return retObj
          }, {})
          this.queryDictList()
        },

        /**
         * 查询数据字典列表
         */
        queryDictList (type) {
            if(type == 1){
                this.currentPage = 1
            }
            this.rpc.assetList.queryDataDictionary({
                content: this.formData.name,
                currentPage: this.currentPage,
                paraType: this.formData.type,
                turnPageShowNum: this.pageSize
            }).then(res => {
                // 转义接口数据与编辑器约定数据结构
                let list = this.resolveDictList(res.list, null)
                this.iDictList = list || []
                this.turnPageTotalNum = parseInt(res.turnPageTotalNum, 10)
            })
        },

        // 处理数据字典列表
        resolveDictList(list = [], parent) {
            return list.map(dictInfo => {
                let dict = {
                    id: dictInfo.dataSetNo,
                    parent: parent,
                    key: dictInfo.dataFieldNo,
                    name: dictInfo.dataFieldNm,
                    type: dictInfo.fieldType,
                    desc: dictInfo.fieldDesc,
                    dictryLength:dictInfo.fieldLength,
                    children: []
                }
                dict.children = this.resolveDictList(dictInfo.children || [], dict)
                return dict
            })
        },
        

        /**
         * 分页器变化处理
         * @param {Number} type 0 每页显示条数变化  1 当前页变化
         * @param {String} content 数据
         */
        turnPage(type, content) {
            if (type == 0) {
                this.pageSize = content
                this.queryDictList(1)
            } else {
                this.queryDictList()
            }
        },

        /**
         * 重置表单
         */
        resetForm () {
          this.formData.name="";
          this.formData.type="";
        },

        /**
         * 提交表单数据
         */
        submitForm () {
          if(this.radio1.length>0){
            this.dialogVisible = false
            this.$emit('output', this.radio1)
          }else{
            this.$message({
              message: '请选择一条数据',
              type: 'warning'
            })
          }
          
        },


        /**
         * 选中状态改变
         * @param {Object} 行数据
         * @param {Boolean} checked 是否选中
         */
        // changeCheck (row, checked) {
        //     let index = this.iSelectList.findIndex(info => info.key == row.key)

        //     if(checked){
        //         index == -1 &&this.iSelectList.splice(index, 0, row)
        //     }else{
        //         index > -1 && this.iSelectList.splice(index, 1)
        //     }
        // },

        /**
         * 获取表格列缩进
         * @param {Object} row 行数据
         */
        getTableIndent (row) {
            let level = 0
            let temprow = row.parent
            while(temprow){
                level += 1
                temprow = temprow.parent
            }
            return `padding-left: ${level*32}px`
        },

        /**
         * 渲染列单元样式类
         * @param {Object} row 行数据信息
         * @param {Object} column 列数据信息
         * @param {Number} rowIndex 行序列号
         * @param {Number} columnIndex 列序列号
         */
        renderCellClass ({row, column, rowIndex, columnIndex}) {
            if(columnIndex == 0){
                return 'leb_datadictionary_dialog_column'
            }
        },

        /**
         * 伸缩改变
         * @param {Object} row
         * @param {Object} expanded 是否展开
         */
        changeExpand (row, expanded) {
            this.$set(this.fieldExpandMap, row.id, expanded)
        },
    },
 
    computed: {

        /**
         * 是否全选
         */
        bAllSelect () {
            let list = this.iDictList
            let len = list.length

            if(len === 0) return false

            for(let i = 0; i < len; i++){
                if(!this.selectDictMap[list[i].key]){
                    return false
                }
            }

            return true
        },

        /**
         * 选中数据域映射
         */
        selectDictMap () {
            return this.iSelectList.reduce((retObj, dict) => {
                retObj[dict.key] = true
                return retObj
            }, {})
        },

        dialogVisible: {
            get () {
                return this.value
            },

            set (val) {
                this.$emit('input', val)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.leb_datadictionary_dialog{

    /deep/ .el-dialog .el-dialog__body{
        height: 670px;
        padding: 0;
        display: flex;
        flex-direction: column;
    }

    /deep/ .leb_datadictionary_dialog_column{

        .el-table__expand-icon{
            display: none;
        }
    }

    .leb_filter{
        padding: 10px 24px;
        flex: 0 0 auto;
    }

    .leb_filter_form{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .leb_formitem{
        margin-bottom: 0;

        /deep/ .el-form-item__label{
            color: rgba(0,0,0,0.85);
            padding: 0;
            font-weight: normal;
        }

        /deep/ .el-input__inner{
            height: 32px;
            line-height: 32px;
            width: 265px;
        }

        /deep/ .el-select .el-input__inner{
            width: 140px;
        }

        /deep/ .el-button{
            padding: 8px 18px;
            border-radius: 2px;
            color: #333333;
        }

        /deep/ .el-button--primary{
            color: #FFFFFF;
            background-color: #358AFF;
            border-color: #358AFF;
        }
    }

    .leb_body{
        overflow-y: auto;
        padding: 0 24px;
        height: 100%;

        /deep/ .el-table__expand-icon{
            margin-right: 0;
            position: relative;
            left: -4px;
        }
    }
}
.leb_common_dialog{

    .el-dialog{
        border-radius: 8px;
        overflow: hidden;
    }
    
    .el-dialog__header{
        border-bottom: 1px solid #F5F5FA;
        padding: 12px 20px;
        background: #FAFAFC;

        .el-dialog__title{
            font-size: 16px;
            color: #323C41;
            letter-spacing: 0;
            line-height: 24px;
            font-weight: bold;
        }

        .el-dialog__headerbtn{
            top: 14px;
        }
    }

    .el-dialog__body{
        padding: 24px;
    }

    .el-dialog__footer{
        border-top: 1px solid #F5F5FA;
        padding: 15.5px 20px;
    }
}
.leb_common_pagination {
    margin: 24px 0;
    display: flex;
    justify-content: flex-end;

    .el-pagination.is-background .el-pager li:not(.disabled).active{
        background-color: #358AFF;
    }
}

.leb_common_btns_area {
    text-align: center;

    .el-button{
        width: 112px;
        height: 40px;
        font-size: 14px;
        color: #323C41;
        letter-spacing: 1px;
        text-align: center;
        line-height: 20px;
        border-radius: 2px;
        padding: 0;

        &+.el-button{
            margin-left: 24px;
        }

        &.el-button--primary{
            color: #FFF;
            background-color: #358AFF;
            border-color: #358AFF;
            background: #358AFF;
        }
    }
}

/deep/.leb_common_table{

    /deep/.el-table__header,
    .el-table__body,
    .el-table__empty-block{
        width: 100% !important;
    }

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
</style>