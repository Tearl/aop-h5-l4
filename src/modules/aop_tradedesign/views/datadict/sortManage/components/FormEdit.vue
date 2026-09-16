<template>

    <div class="form_edit_common_wrap">
        <el-form label-position="top" :rules="rules" ref="ruleForm" :model="form" label-width="120px" size="small">
            <el-form-item :label="`上级分类：`" prop="preCategoryId" >
                <el-cascader
                    style="width: 100%"
                    v-model="form.preCategoryId"
                    clearable
                    :show-all-levels="false"
                    :props="{ value: 'categoryId', label: 'categoryName', checkStrictly: true, emitPath: false }"
                    :options="options">
                </el-cascader>
            </el-form-item>
            <el-form-item :label="`分类名称：`" prop="categoryName">
                <el-input v-model.trim="form.categoryName"></el-input>
            </el-form-item>
            <el-form-item label="是否底层：">
                <el-radio-group v-model="form.endFlag" @change="endFlagChange">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="`分类说明：`" prop="categoryDesc" v-if="form.endFlag == '1'">
                <el-input
                    type="textarea"
                    maxlength="255"
                    show-word-limit
                    placeholder="请输入分类说明"
                    v-model="form.categoryDesc">
                </el-input>
                <!-- <div class="editor-wrap">
                    <aopCommonDocEditor 
                        ref="docEditor"
                        :formMode="true"
                        :useDrawio="false"
                        :showTitle="false"
                        :showHeaderTree="false"
                        v-model="initValues"
                    />
                </div> -->
            </el-form-item>
        </el-form>
        <div class="btn_bottom">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],
    data() {
        return {
            form: {
                topicCode: '',
                categoryName: '',
                endFlag: '1',
                categoryDesc: '',
                preCategoryId: ''
            },
            initValues: {
                title: '',
                html: ''
            },
            rules: {
                categoryName: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                categoryDesc: [
                    { required: true, message: '请输入分类说明', trigger: 'blur' },
                ],
                endFlag: [
                    { required: true, message: '请选择是否底层', trigger: 'change' },
                ]
            },
            options: []
        }
    },
    props: {
        type: {
            type: String,
            default: ''
        },
        formInfo: {
            type: Object,
            default: () => {}
        },
        categoryList: {
            type: Array,
            default: () => []
        }
    },
    
    mounted() {
        this.options = this.categoryList || []
        console.log(this.options, 'options')
        if(this.type != 'add') {
            this.formInit()
        } else {
            this.formReset()
        }
    },
    methods: {
        formReset() {
            if(this.formInfo.categoryId) {
                const { categoryId, categoryName } = this.formInfo
                this.form.preCategoryId = categoryId
            }
        },
        formInit() {
            this.queryThemDetail()
        },
        endFlagChange() {
            
        },
        async queryThemDetail() {
            const {
                categoryId
            } = this.formInfo
            const { categoryName, categoryDesc, endFlag, preCategoryId } = await this.rpc.datadict.qryDataDictionaryCategoryDetail({categoryId})
            this.form = {
                categoryName,
                categoryId,
                endFlag,
                preCategoryId,
                categoryDesc
            }
        },
        cancel() {
            this.$emit('cancel')
        },
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                console.log(this.type)
                console.log(this.form.endFlag, 'this.form.endFlag---')
                if (valid) {
                    if(this.type == 'add') {
                        this.addCategory()
                    } else {
                        this.updateCategory()
                    }
                } else {
                    return false;
                }
            });
            
        },
        async addCategory() {
            const {
                categoryName,
                endFlag,
                categoryDesc,
                preCategoryId
            } = this.form
            
            await this.rpc.datadict.saveDataDictionaryCategory({
                categoryName,
                endFlag,
                preCategoryId,
                categoryDesc,
                topicCode: this.formInfo.topicCode
            })
            this.$notify({
                title: "成功",
                message: "新建成功",
                type: "success",
            });
            this.$emit('submit')
        },
        async updateCategory() {
            
            
            const {
                categoryName,
                endFlag,
                preCategoryId,
                categoryId,
                categoryDesc
            } = this.form
            await this.rpc.datadict.updateDataDictionaryCategory({
                categoryName,
                categoryId,
                endFlag,
                preCategoryId,
                categoryDesc,
                topicCode: this.formInfo.topicCode
            })
            this.$notify({
                title: "成功",
                message: "编辑成功",
                type: "success",
            });
            this.$emit('submit')
        }
    }
}
</script>
<style lang="scss" scoped>
    
    
</style>
<style lang="scss" scoped>
.form_edit_common_wrap {
    padding-bottom: 90px;
    /deep/.el-drawer__body {
        padding: 24px;
        
    }
    /deep/.el-drawer__header {
        font-size: 16px;
        color: #333333;
        font-weight: 600;
        margin: 0;
        padding: 16px 24px;
        box-shadow: inset 0px -0.5px 0px 0px rgba(220,224,228,1);;
    }
    
}
.btn_bottom {
    background: #FFFFFF;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 16px 0;
    position: absolute;
    bottom: 0px;
    right: 0px;
    z-index: 1001;
    box-shadow: inset 0px 1px 0px 0px rgba(245,245,250,1);
    .el-button{
        margin-left: 30px;
        width: 112px;
    }
}
.editor-wrap {
  width: 100%;
  height: calc(100vh - 300px);
  overflow-y: auto;
//   padding-bottom: 78px;
}
</style>