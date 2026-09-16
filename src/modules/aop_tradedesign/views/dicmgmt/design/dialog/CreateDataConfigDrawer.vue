<template>
    <el-drawer
        :title="drawerTitle"
        custom-class="create_data_config_drawer"
        :size="520"
        :visible.sync="drawer"
        :direction="direction"
        :modal-append-to-body="false"
        :before-close="handleClose">

        <div class="gray_line"></div>
        
        <div class="package_version_create_info">
            

            <el-form :model="formData" ref="formData" :rules="rules" label-position="top" class="comps_package_version_createdialog_form">

                <el-form-item
                        label="数据分段"
                    >
                        <el-input
                            disabled
                            size="small"
                            v-model="formData.p1"
                            class="form_first_all_input_width"
                        />
                    </el-form-item>
                <div class="form_first_all">
                    <el-form-item
                        label="数据名称"
                        prop="p2"
                    >
                        <!-- <el-input
                            readonly
                            size="small"
                            v-model="formData.p2"
                            class="form_first_all_input_width"
                            @click="lebDataDictionDialogVirble = true"
                        /> -->
                        <div class="chose_leb_data">{{formData.p2}}
                            <img v-if="this.operationType != '2'" @click="choseDataDivict" src="../../assets/input_edit.png" alt="">
                        </div>
                    </el-form-item>
                    <el-form-item
                        label="数据英文"
                    >
                        <el-input
                            disabled
                            size="small"
                            v-model="formData.p3"
                        />
                    </el-form-item>
                </div>
                <el-form-item
                    label="数据样例"
                >
                    <el-input
                        :disabled="operationType == '2'"
                        type="textarea"
                        placeholder="请输入"
                        v-model="formData.dataExample"
                    />
                </el-form-item>
                <el-form-item
                    label="枚举值"
                >
                    <el-input
                        :disabled="operationType == '2'"
                        type="textarea"
                        placeholder="请输入"
                        v-model="formData.dataEnum"
                    />
                </el-form-item>
                <el-form-item
                    label="数据创建"
                >
                    <el-input
                        :disabled="operationType == '2'"
                        type="textarea"
                        placeholder="请输入"
                        v-model="formData.dataCreation"
                    />
                </el-form-item>
                <el-form-item
                    label="数据应用"
                >
                    <el-input
                        :disabled="operationType == '2'"
                        type="textarea"
                        placeholder="请输入"
                        v-model="formData.dataApp"
                    />
                </el-form-item>
                <el-form-item
                    label="数据说明"
                >
                    <el-input
                        :disabled="operationType == '2'"
                        type="textarea"
                        placeholder="请输入"
                        v-model="formData.dataDesc"
                    />
                </el-form-item>
                <el-form-item
                    label="应用场景"
                >
                    <el-input
                        :disabled="operationType == '2'"
                        type="textarea"
                        placeholder="请输入"
                        v-model="formData.appScene"
                    />
                </el-form-item>

                <el-form-item label="关联服务" v-if="serviceList.length > 0">
                    <!-- <div @click="serviceChoseDialogVirble = true" class="release_service">
                        <img src="../../assets/icon_add.png" alt="">
                        <span>关联服务</span>
                    </div> -->
                    <div class="service_list">
                        <div class="service_list_item" v-for="item in serviceList" :key="item.apiId">
                            <span>{{item.apiNm}}</span>
                        </div>
                    </div>
                </el-form-item>
            </el-form>

            <div
                class="inner_cheetah_common_btns_area"
                slot="footer"
                v-if="operationType != '2'"
            >
                <el-button
                    @click="drawer = false"
                    :disabled="buttonDisabled"
                >取 消</el-button>
                <el-button
                    type="primary"
                    @click="submitForm"
                    :disabled="buttonDisabled"
                >确 定</el-button>
            </div>
        </div>


        <service-chose-dialog 
            v-if="serviceChoseDialogVirble"
            v-model="serviceChoseDialogVirble"
        />

        <leb-data-diction-dialog 
            v-if="lebDataDictionDialogVirble"
            v-model="lebDataDictionDialogVirble"
            @output="output"
        />
    </el-drawer>
    
</template>

<script>
import serviceChoseDialog from './ServiceChoseDialog.vue'
import lebDataDictionDialog from './LebDataDictionDialog.vue'
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],
    components: {
        serviceChoseDialog,
        lebDataDictionDialog
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        configDrawerInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {

        drawer: {
            get() {
                return this.value;
            },

            set(val) {
                this.$emit("input", val);
            },
        },

        drawerTitle() {
            switch (this.operationType) {
                case '2':
                    return '数据查看'
                case '1':
                    return '数据编辑'
                case '0':
                    return '数据配置'
            }
        }
    },
    data() {
        
        return {
            direction: 'rtl',
            formData: {
                p1: '数据分段名称',
                p2: '',
                p3: '',
                dataExample: '',
                dataEnum: '',
                dataCreation: '',
                dataApp: '',
                dataDesc: '',
                appScene: ''
            },
            rules: {
                p2: [
                    {
                        required: true,
                        message: "请选择数据名称",
                        trigger: "change",
                    },
                ],
            },
            serviceList: [],
            operationType: '',
            serviceChoseDialogVirble: false,
            lebDataDictionDialogVirble: false
        };
    },
    created() {
        this.initForm()
    },
    methods: {
        initForm() {
            this.operationType = this.configDrawerInfo.operationType
            this.formData.p1 = this.configDrawerInfo.dataSubstnNm
            this.formData.dataSubstnNo = this.configDrawerInfo.dataSubstnNo
            this.formData.dataSetNo = this.configDrawerInfo.dataSetNo
            if(this.operationType != '0') {
                this.formData.dataSetDataId = this.configDrawerInfo.dataSetDataId
                this.queryDataSubInfo()
                
            } else {
                this.queryDataSetServiceList()
            }
        },

        output(model) {
            this.formData.p2 = model.list[0].name
            this.formData.p3 = model.list[0].key
            this.formData.dictId = model.list[0].id
            this.formData.dataEnum = model.list[0].dictryEnum
            console.log(model, 'model-------')
            this.lebDataDictionDialogVirble = false
        },

        handleClose(done) {
            done();
        },

        choseDataDivict() {
            if(this.operationType != '2') {
                this.lebDataDictionDialogVirble = true
            }
        },

        submitForm() {
            
            
            this.$refs.formData.validate((valid) => {

                if (!valid) return;

                if (this.operationType == "0") {
                    //新增操作
                    this.createDataInfo();
                } else if (this.operationType == "1") {
                    //修改
                    this.modifyDataInfo();
                }
                
            })
        },
        modifyDataInfo() {
            const { dataSetDataId, dictId, dataExample, dataEnum, dataCreation, dataApp, dataDesc, appScene } = this.formData
            this.rpc.d1interation.modifyDataSetData({
                dictId, dataExample, dataEnum, dataCreation, dataApp, dataDesc, appScene, dataSetDataId
            }).then(res => {
                this.$notify({
                    title: "成功",
                    message: "编辑成功",
                    duration: 2000,
                    type: "success"
                });
                this.$emit('dataConfig')
                this.drawer = false
            })
        },
        createDataInfo() {
            const { dataSetNo, dataSubstnNo, dictId, dataExample, dataEnum, dataCreation, dataApp, dataDesc, appScene } = this.formData
            this.rpc.d1interation.createDataSetData({
                dataSetNo, dataSubstnNo, dictId, dataExample, dataEnum, dataCreation, dataApp, dataDesc, appScene
            }).then(res => {
                this.$notify({
                    title: "成功",
                    message: "创建成功",
                    duration: 2000,
                    type: "success"
                });
                this.$emit('dataConfig', res.dataSetDataId)
                this.drawer = false
            })
        },

        async queryDataSubInfo() {
            const { dataSubstnNm, dataSetDataId, dictNm, dictNo, dataSetNo, dataSubstnNo, dictId, dataExample, dataEnum, dataCreation, dataApp, dataDesc, appScene, apiInfoList } = await this.rpc.d1interation.queryDataSetData({
                dataSetDataId: this.formData.dataSetDataId
            })
            this.formData = {
                p1: dataSubstnNm,
                p2: dictNm,
                p3: dictNo,
                dataSetNo, dataSubstnNo, dictId, dataExample, dataEnum, dataCreation, dataApp, dataDesc, appScene,
                dataSetDataId
            }
            this.serviceList = apiInfoList || []
    
        },

        // 查询数据集下服务列表
        async queryDataSetServiceList() {
            const { apiInfoList } = await this.rpc.d1interation.dataSetServiceList({
                dataSetNo: this.formData.dataSetNo
            })
            this.serviceList = apiInfoList || []
        }

    }
}
</script>

<style lang="scss">
.create_data_config_drawer {

    .el-drawer__header {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
    }

    .gray_line {
        height: 0.5px;
        width: 100%;
        background:#E7E7EE;
        position: absolute;
        top: 60px;
    }

    .package_version_create_info {
        padding:  0 24px;
        h1 {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #111111;
            letter-spacing: 0;
        }
        .info_cell {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 28px;
            .info_cell_item {
                width: 50%;
                margin-top: 16px;
                .label {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #999999;
                    letter-spacing: 0;
                }
                .label_value {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #151500;
                    letter-spacing: 0;
                }
            }
        }

        .comps_package_version_createdialog_form {
            .el-form-item__label {
                line-height: 0;
                padding-bottom: 12px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #333333;
                letter-spacing: 0;
            }
            .el-checkbox__input.is-checked+.el-checkbox__label {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #333333;
                letter-spacing: 0;
            }

            .form_first_all {
                display: flex;
                justify-content: space-between;

                .form_first_all_input_width {
                    width: 216px;
                }
                .chose_leb_data {
                    width: 216px;
                    height: 32px;
                    border: 1px solid #E4E7ED;
                    cursor: pointer;
                    margin-top: 5px;
                    border-radius: 4px;
                    line-height: 32px;
                    padding: 0 8px;
                    color: #358AFF;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    img {
                        // background: #358AFF;
                        position: absolute;
                        width: 18px;
                        height: 18px;
                        right: 8px;
                        top: 12px;
                    }
                }
            }
            .service_list {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                .service_list_item {
                    background: #F7F7F9;
                    border-radius: 2px;
                    padding: 0px 6px;
                    margin-right: 8px;

                    span {
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #333333;
                        letter-spacing: 0;
                    }
                }
            }
            .release_service {
                width: 465px;
                height: 32px;
                opacity: 0.25;
                border: 1px dashed rgba(0,0,0,1);
                border-radius: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 32px;
                cursor: pointer;

                img {
                    width: 14px;
                    height: 14px;
                }
                span {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #333333;
                }
            }
        }
        
    }

    .inner_cheetah_common_btns_area {
        padding-bottom: 16px;
    }
}
</style>