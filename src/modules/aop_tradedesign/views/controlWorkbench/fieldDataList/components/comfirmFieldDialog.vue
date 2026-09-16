<template>
    <el-dialog class="aop_tradedesign_comps_page_dialog" title="对比" :visible.sync="dialogVisiable" :width="dialogWidth"
        :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false">
        <template slot="title">
            <div class="dialog_title">
                <span>提交评审确认</span>
                <div class="tips_box">
                    <img src="../../assets/images/gantanhao.svg" alt="">
                    <span>完成确认后可提交评审结果</span>
                </div>
            </div>
        </template>
        <div class="dialog_box">
            <div class="box_header">
                <div class="box_l box_wrap">
                    <div class="comparison_box_title">
                        <span>申请字段</span>
                    </div>
                    <div class="info_card">
                        <div class="info_t">
                            <div class="left">{{ fieldInfo.fieldName || '/' }}</div>
                        </div>
                        <div class="info_t">
                            <div class="left_b">
                                申请人：{{ fieldInfo.createUserName || '/' }}
                            </div>
                            <div class="right_b">
                                申请时间：{{ fieldInfo.createTime || '/' }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card_title box_wrap">
                    <span class="d_line"></span>
                    <span class="d_detail">业务属性</span>
                </div>
                <div class="box_bottom">
                    <div class="table-left box_wrap_b">
                        <div class="list_box">
                            <div class="list_item">
                                <span class="title">字段名称</span>
                                <span class="desc desc_title">{{ fieldInfo.fieldName || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">别名</span>
                                <span class="desc desc_title">{{ fieldInfo.fieldAlias || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">申请来源</span>
                                <span class="desc desc_title">{{ applySourceOption[fieldInfo.fieldSource] || '/'  }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">字段定义</span>
                                <span class="desc desc_title">{{ fieldInfo.fieldBusiness || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">字段规则</span>
                                <span class="desc desc_title">{{ fieldInfo.fieldRule || '/' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card_title box_wrap">
                    <span class="d_line"></span>
                    <span class="d_detail">技术属性</span>
                </div>
                <div class="box_bottom">
                    <div class="table-left box_wrap_b">
                        <div class="list_box">
                            <div class="list_item">
                                <span class="title">字段类型</span>
                                <span class="desc desc_title">{{ fieldInfo.fieldType || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">字段长度</span>
                                <span class="desc desc_title">{{ fieldInfo.fieldLength || '/' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card_title box_wrap">
                    <span class="d_line"></span>
                    <span class="d_detail">枚举定义</span>
                </div>
                <div class="box_bottom">
                    <div class="table-left box_wrap_b" style="padding-bottom: 14px;">
                        <div class="list_box">
                            <div class="list_item">
                                <span class="desc-1 desc_title">枚举值</span>
                            </div>
                            <template v-if="fieldInfo.dataDictionaryEnumLists.length > 0">
                                <div class="list_item" v-for="(item, index) in fieldInfo.dataDictionaryEnumLists"
                                    :key="index">
                                    <span class="desc-1 desc_title">{{ item.enumValue || '/' }}</span>
                                </div>
                            </template>
                            <div class="list_item" v-else>
                                <span class="desc-1 desc_title">/</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box_center">
                <div class="box_r box_wrap">
                    <div class="comparison_box_title">
                        <span>选中字段</span>
                    </div>
                    <div class="info_card">
                        <div class="info_t">
                            <div class="left">{{ selectInfo.fieldName || '/' }}</div>
                            <div class="right_b">
                                <el-tag type="warning" v-if="selectInfo.fieldFlag == '2'">已贯标</el-tag>
                                <el-tag type="warning" v-if="selectInfo.fieldFlag == '1'">未贯标</el-tag>
                            </div>
                        </div>
                        <div class="info_t">
                            <div class="left_b">
                                审批人：{{ approveName || '/' }}
                            </div>
                            <div class="right_b">
                                审批时间：{{ approveTime || '/' }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card_title box_wrap">
                    <span class="d_line"></span>
                    <span class="d_detail">业务属性</span>
                </div>
                <div class="box_bottom">
                    <div class="table-left box_wrap_b">
                        <div class="list_box">
                            <div class="list_item">
                                <span class="title">字段名称</span>
                                <span class="desc desc_title">{{ selectInfo.fieldName || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">字段简称</span>
                                <span class="desc desc_title">{{ selectInfo.fieldKeyName || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">字段全称</span>
                                <span class="desc desc_title">{{ selectInfo.fieldFullName || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">别名</span>
                                <span class="desc desc_title">{{ selectInfo.fieldAlias || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">申请来源</span>
                                <span class="desc desc_title">{{ applySourceOption[selectInfo.fieldSource] || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">字段定义</span>
                                <span class="desc desc_title">{{ selectInfo.fieldBusiness || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">字段规则</span>
                                <span class="desc desc_title">{{ selectInfo.fieldRule || '/' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card_title box_wrap">
                    <span class="d_line"></span>
                    <span class="d_detail">技术属性</span>
                </div>
                <div class="box_bottom">
                    <div class="table-left box_wrap_b">
                        <div class="list_box">
                            <div class="list_item">
                                <span class="title">字段类型</span>
                                <span class="desc desc_title">{{ selectInfo.fieldType || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">字段主题</span>
                                <span class="desc desc_title">{{ selectInfo.topicName || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">标准分类</span>
                                <span class="desc desc_title">{{ selectInfo.categoryName || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">数据格式</span>
                                <span class="desc desc_title">{{ mapType[selectInfo.dataFormatType] }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">字段长度</span>
                                <span class="desc desc_title">{{ selectInfo.fieldLength || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">数据精度</span>
                                <span class="desc desc_title">{{ selectInfo.fieldScale || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">最小长度</span>
                                <span class="desc desc_title">{{ selectInfo.fieldLengthMin || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">最大长度</span>
                                <span class="desc desc_title">{{ selectInfo.fieldLengthMax || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">取值范围</span>
                                <span class="desc desc_title">{{ selectInfo.valueRange || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">主数据系统</span>
                                <span class="desc desc_title">{{ selectInfo.masterDataSystem || '/' }}</span>
                            </div>
                            <div class="list_item">
                                <span class="title">代码编码规则</span>
                                <span class="desc desc_title">{{ selectInfo.codeRule || '/' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card_title box_wrap">
                    <span class="d_line"></span>
                    <span class="d_detail">枚举定义</span>
                </div>
                <div class="box_bottom enum_box">
                    <el-table :data="selectInfo.dataDictionaryEnumLists" :header-cell-style="{
                        background: '#f5f5f8',
                        color: '#333333',
                    }">
                        <el-table-column prop="enumLabel" label="枚举标签">
                            <template slot-scope="scope">{{
                                scope.row.enumLabel || "/"
                                }}</template>
                        </el-table-column>
                        <el-table-column prop="enumValue" label="枚举值"></el-table-column>
                        <el-table-column prop="enumKey" label="枚举键值">
                            <template slot-scope="scope">{{
                                scope.row.enumKey || "/"
                                }}</template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog_footer">
            <slot name="footer">
                <el-button @click.native="handleClose">取 消</el-button>
                <el-button type="primary" @click.native="handleSave">确认提交</el-button>
            </slot>
        </span>
    </el-dialog>
</template>
<script>
import mixin from "@m/core/mixin";
import { getLocalStorage } from "@m/utils/localStorage.js";
export default {
    mixins: [mixin],
    props: {
        value: {
            type: Boolean,
            default: () => false,
        },
        dialogWidth: {
            type: String,
            default: () => "70%",
        },
        dialogTitle: {
            type: String,
            default: () => "新增数据字段审批处理详情",
        },
        apTobody: {
            type: Boolean,
            default: () => false,
        },
        modalAppendToBody: {
            type: Boolean,
            default: () => false,
        },
        customClass: {
            type: String,
            default: () => ""
        },
        footerShow: {
            type: Boolean,
            default: () => false
        },
        aplySrlNo: {
            type: String,
            default: () => "",
        },
        fieldInfo: {
            type: Object,
            default: () => { },
        },
        selectInfo: {
            type: Object,
            default: () => { },
        },
        type: {
            type: String,
            default: () => "0",
        },
        dataDictionaryEnumLists: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        dialogVisiable: {
            get() {
                return this.value;
            },

            set(val) {
                this.$emit("input", val);
            },
        },
    },
    components: {
    },
    data() {
        return {
            tableData1: [],
            tableData2: [],
            applySourceOption: {
                "develop": "开发工作台",
                "design": "业务模型",
                'common': "数据字典工作台",
                'test': "测试工作台",
                'framework': "架构设计工作台",
                'SYS_INIT': "SYS_INIT",
            },
            mapType: {
                a: "字母",
                n: "数字",
                an: "字母+数字",
                anc: "字母+数字+汉字",
                d: "日期",
                t: "时间",
                dt: "日期时间",
                m: "金额",
                p: "百分比",
            },
            serviceList: [],
            currentObjInfo: {},
            targetObjInfo: {},
            operateType: "",
            aprvlStusCd: "",
            approveName: "",
            approveTime: "",
        };

    },
    created() {
        this.getRoleFn()
        console.log(this.selectInfo,'selectInfo')
    },
    filters: {
        aplyTargetSourceMaps(val) {
            const maps = {
                '00': '处理设计',
                '01': '规则设计'
            }
            return maps[val] || val;
        },
        operateTypeMaps(val) {
            const maps = {
                '0': '新增',
                '1': '替换',
                '': '—'
            }
            return maps[val] || val;
        },
    },
    methods: {
        handleSave() {
            this.$emit("saveDialog", this.selectInfo);
        },

        handleClose() {
            this.dialogVisiable = false
        },

        handleObeLook() {
            this.$emit('handleObeLook', this.targetObjInfo)
        },

        handleServiceLook(row) {
            this.$emit('handleServiceLook', row.s6ServiceId)
        },
        getRoleFn() { //获取角色
            let userInfo = JSON.parse(getLocalStorage('_userInfo'));
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            this.approveName = userInfo.cstName
            this.approveTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.aop_tradedesign_comps_page_dialog {
    ::v-deep .el-dialog {
        border-radius: 8px;
    }

    ::v-deep .el-dialog__header {
        background-color: $base_bg_color;
        text-align: left;
        padding: 0 24px;
        height: 48px;
        line-height: 48px;
        // border-bottom: 1px solid #e7e7e7;
        background: $base_bg_color;
        box-shadow: inset 0 -1px 0 0 #e7e7e7;
        border-radius: 8px 8px 0 0;
        font-weight: $font_weight_600;

        .el-dialog__headerbtn {
            top: 12px;
        }

        .el-dialog__title {
            font-family: $font_medium;
            font-size: 16px;
            color: $pri_ft_color;
            letter-spacing: 0;
            line-height: 24px;
        }
    }

    ::v-deep .el-dialog__body {
        max-height: 68vh;
        overflow: auto;
        padding: 16px 24px;
    }

    ::v-deep .el-dialog__footer {
        border-top: 1px solid #e7e7e7;
        padding: 16px 24px;

        button {
            width: 110px;
            height: $btn_large_h;
        }
    }

    .dialog_title {
        display: flex;

        .tips_box {
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-weight: 500;
            color: #e98f36;

            img {
                width: 14px;
                height: 14px;
                margin-right: 4px;
            }
        }
    }

    .dialog_box {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .box_header {
            width: 48%;
            // display: flex;
            // justify-content: space-between;

            .info_card {
                background-color: #fff;
                border-radius: 4px;
                padding: 10px;

                .info_t {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;

                    &:last-child {
                        margin-bottom: 0;
                    }


                    .left {
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        color: #333333;
                        font-weight: 500;
                        margin-bottom: 10px;
                    }

                    .right {
                        width: 60%;

                        span {
                            display: inline-block;
                            box-sizing: border-box;
                            border-radius: 2px;
                            padding: 4px;
                            margin: 0 10px 6px 0;
                            background: #F5F5F5;
                            color: rgba(0, 0, 0, 0.65);
                            font-size: 10px;
                            border: 1px solid #D9D9D9;
                        }
                    }

                    .left_b {
                        font-family: PingFangSC-Regular;
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.65);
                        font-weight: 400;
                    }

                    .right_b {
                        width: 60%;
                        font-family: PingFangSC-Regular;
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.65);
                        font-weight: 400;
                    }

                }

            }

            .card_title {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #333;
                // margin: 24px 0;
                min-height: 30px;

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

                .tips {
                    margin-left: 20px;
                    color: #FE5161;
                    background: #FFEAEC;
                    border-color: #FE5161;
                    padding: 4px 8px;
                    border-radius: 4px;

                }
            }
        }

        .box_center {
            width: 48%;

            .card_title {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #333;
                // margin: 24px 0;
                min-height: 30px;

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

                .tips {
                    margin-left: 20px;
                    color: #FE5161;
                    background: #FFEAEC;
                    border-color: #FE5161;
                    padding: 4px 8px;
                    border-radius: 4px;

                }
            }

            .info_card {
                background-color: #fff;
                border-radius: 4px;
                padding: 10px;

                .info_t {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;

                    &:last-child {
                        margin-bottom: 0;
                    }


                    .left {
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        color: #333333;
                        font-weight: 500;
                        margin-bottom: 10px;
                    }

                    .right {
                        width: 60%;

                        span {
                            display: inline-block;
                            box-sizing: border-box;
                            border-radius: 2px;
                            padding: 4px;
                            margin: 0 10px 6px 0;
                            background: #F5F5F5;
                            color: rgba(0, 0, 0, 0.65);
                            font-size: 10px;
                            border: 1px solid #D9D9D9;
                        }
                    }

                    .left_b {
                        font-family: PingFangSC-Regular;
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.65);
                        font-weight: 400;
                    }

                    .right_b {
                        width: 60%;
                        font-family: PingFangSC-Regular;
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.65);
                        font-weight: 400;
                    }

                }

            }
        }

        .box_wrap {
            width: 100%;
            background-color: #f2f2f2;
            // border-radius: 4px;
            padding: 14px;
        }

        .card_title_wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .comparison_box_title {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #333333;
            font-weight: 500;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .box_bottom {
            display: flex;

            .table-left {
                // width: 43%;
                width: 100%;
                background-color: #f2f2f2;
            }

            .table-center {
                flex: 1;
                align-items: center;
                padding: 14px 0;
            }

            .table-right {
                // width: 43%;
                background-color: #f2f2f2;
            }

            .list_box {
                background-color: #fff;
                width: 100%;
                border: 1px solid #e7e7e7;
            }

            .list_item {
                font-size: 14px;
                line-height: 32px;
                display: flex;

                &:last-child {
                    span {
                        border-bottom: 0;
                    }

                }

                .title {
                    background-color: #fafafc;
                    border-right: 1px solid #e7e7e7;
                    width: 30%;
                    text-align: center;
                    border-bottom: 1px solid #e7e7e7;
                }

                .desc {
                    width: 70%;
                    padding-left: 8px;
                    border-bottom: 1px solid #e7e7e7;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .desc-1 {
                    width: 100%;
                    padding-left: 8px;
                    border-bottom: 1px solid #e7e7e7;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    text-align: center;
                }

            }

        }

        .enum_box {
            padding: 0 14px 14px;
            background-color: #f2f2f2;
        }

        .box_wrap_b {
            // width: 43%;
            padding: 0 14px;
        }
    }

    .dialog_footer {
        display: flex;
        justify-content: center;
    }
}
</style>