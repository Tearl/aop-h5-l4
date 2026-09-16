<template>
    <el-dialog
        :title="dialogTitle"
        width="60%"
        append-to-body="true"
        :visible.sync="visibleShow"
        :before-close="handleClose"
        class="aop_techdesign_techdetail_dialog"
    >
        <div class="preview_dialog_table_list">
            <PageTable
                class="table_style"
                :table="tables"
                :data="tableData"
                key="connectList1"
                ref="tableRef1"
                rowK="tableData"
                @operate="operate"
                :show-overflow-tooltip="true"
            ></PageTable>
            <div class="dialog_btn">
                <el-button type="primary" @click="handleClose"
                    >确认</el-button
                >
            </div>
        </div>
    </el-dialog>
</template>
<script>
import PageTable from "@m/core/components/page_table";
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
export default {
    mixins: [mixin],
    components: {
        PageTable,
    },
    computed: {
        ...mapGetters(["userInfo"]),
        ...mapGetters(["systemId"]),
    },
    props: {
        visibleShow: {
            type: Boolean,
            default: false,
        },
        dialogTitle: {
            type: String,
            default: "Dialog",
        },
        formB: {
            type: Object,
            default: () => ({}),
        },
        tableData: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            tables: [
                {
                    prop: "componentTypeName",
                    label: "要点名称",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "componentType",
                    label: "要点类型",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "eventType",
                    label: "事件类型",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "d4iName",
                    label: "交互处理名称",
                    minWidth: "180",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "d4iDesc",
                    label: "交互处理描述",
                    minWidth: "180",
                    type: "text",
                    tooltip: true,
                },
                {
                    label: "操作",
                    type: "button",
                    fixed: 'right',
                    width: "100",
                    buttonList: [
                        {
                            desc: "删除",
                            operate: "del",
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        handleClose(type) {
            this.$emit("closeDialog",'eachClose');
        },
        operate(operation, data) {
            console.log('operation==,',operation,data)
            if(operation=='del'){//删除此条交易
                // console.log(this.formB,'信息')
                this.$confirm("确定要删除吗？", "", {
                    distinguishCancelAndClose: true,
                    center: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                })
                .then(() => {
                    this.delContlist(data)
                })
                .catch((action) => {
                    // this.$message({
                    //     type: "info",
                    //     message: "已取消删除",
                    // });
                });
            }
        },
        // 删除绑定接口
        async delContlist(val){
            const params = {
                apedirId: val.apedirId,
            }
            const res = await this.rpc.assetList.delConnectNew4BList(params)
            const params2 = {
                d4iType: '02', // 要素00 页面01
                interfaceId: this.formB.svcId, //交易接口ID
                name: "",// 接口名称
            }
            this.rpc.assetList.queryConnect4BtList(params2).then((res)=>{
                // console.log("查询返回关联的交互列表",res)
                this.$nextTick(()=>{
                    this.tableData = res.list;
                })
            }).catch((err)=>{
                // console.log(err)
            })
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_techdesign_techdetail_dialog {
    min-width: 640px;
    ::v-deep .el-dialog{
        border-radius:8px 8px;
    }
    .preview_dialog_table_list {
        width: 100%;
        h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
        }
        .dialog_btn {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0px;
            ::v-deep .el-button{
                height: 35px;
                text-align: center;
            }
        }
        .preview_dialog_table_list_flex {
            display: flex;
            margin-bottom: 10px !important;
            ::v-deep .el-table__cell {
                text-align: center !important;
                font-size: 12px !important;
                line-height: 1.5 !important;
            }
        }
        .preview_dialog_table_list_flex_end {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            ::v-deep .el-table__cell {
                text-align: center !important;
                font-size: 12px !important;
                line-height: 1.5 !important;
            }
        }
        .preview_dialog_table_list_item {
            margin-bottom: 2px !important;
            span {
                font-size: 12px !important;
                line-height: 1.5 !important;
            }
        }
    }
    ::v-deep .el-dialog__header {
        border-bottom: 1px solid #dedede;
        .el-dialog__headerbtn {
            width: 20px;
            height: 20px;
            text-align: center;
        }
    }
    .preview_content_table {
        margin: 16px 0 20px 0;
        color: #131313;
        padding-bottom: 5px;
        .preview_content_table_flex {
            display: flex;
            width: 100%;
            p {
                margin-top: 6px;
                color: $pri_ft_color;
                width: 50%;
                span {
                    color: #131313;
                }
            }
        }
    }
}
</style>
