<template>
    <div class="aop_developer_comps_page_tabs">
        <div>
            <el-form
                :inline="true"
                :model="formSearch"
                class="demo-form-inline"
            >
                <el-form-item label="交互处理名称：" size="small">
                    <el-input
                        v-model="formSearch.txNm"
                        placeholder="请输入"
                        class="list-input_search"
                    ></el-input>
                </el-form-item>
                <el-form-item label="接口ID：" size="small">
                    <el-input
                        v-model="formSearch.txCd"
                        placeholder="请输入"
                        class="list-input_search"
                    ></el-input>
                </el-form-item>
                <el-form-item size="small" style="float: right">
                    <el-button
                        type="primary"
                        size="small"
                        @click="searchSubmit('A')"
                        >查询</el-button
                    >
                    <el-button size="small" plain @click="resetSearch"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
            <div class="preview_content_table">
                <PageTable
                    class="table_style"
                    ref="radioTableRef"
                    :table="tables"
                    :data="tableA"
                    rowK="bussiness"
                    :tableType="'selection'"
                    @operate="operate"
                    @selectionChange="checkList"
                    :show-overflow-tooltip="true"
                ></PageTable>
                <el-pagination
                    class="btn_el_pageNation"
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    medium
                    background
                    :current-page="currentPage1"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize1"
                    layout="total, prev, pager, next,sizes, jumper"
                    :total="total1"
                >
                </el-pagination>
            </div>
            <!-- 绑定删除 -->
            <el-dialog title="绑定接口列表"
                append-to-body="true"
                :before-close="handleClose"
                class="wrap_content_dialog"
                :visible.sync="showCodeDialog">
                <PageTable
                    class="table_style"
                    ref="radioTableRef2"
                    :table="tables2"
                    :data="gridData"
                    rowK="bussiness"
                    @operate="operate"
                    @textClick="textClick"
                    :show-overflow-tooltip="true"
                ></PageTable>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import PageTable from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
export default {
    mixins: [mixin],
    components: {
        PageTable,
        PagePagination,
    },
    computed: {
        ...mapGetters(["userInfo"]),
        ...mapGetters(["systemId"]),
    },
    props: {
        tableA: {
            type: Array,
            default: () => [],
        },
        formSearch: {
            type: Object,
            default: () => {},
        },
        pageSize1: {
            type: String,
            default: () => "10",
        },
        currentPage1: {
            type: String,
            default: () => "1",
        },
        total1: {
            type: Number,
            default: () => 0,
        },
        rightCheckList: {
            type: Array,
            default: () => [],
        },
        oldrightCheckList: {
            type: Array,
            default: () => [],
        },
        contentShow: {
            type: Boolean,
            default: false,
        },
        removerightCheckList: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            showCodeDialog: false,
            tables: [
                {
                    prop: "componentName",
                    label: "要点名称",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "componentTypeName",
                    label: "要点类型",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "eventName",
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
                            desc: "查看",
                            operate: "look",
                        },
                    ],
                },
            ],
            gridData:[],
            tables2: [
                {
                    prop: "apiId",
                    label: "接口编号",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "apiName",
                    label: "接口名称",
                    minWidth: "150",
                    type: "textClick",
                    tooltip: true,
                    operate:"txNmClick"
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
        async getContList(value) {
            this.gridData = []
            const params = {
                d4iType: "01", // 00要素 01页面
                d4iId: value.id,
            }
            const res = await this.rpc.assetList.queryConnect4BServicetList(params)
            this.gridData = res.list || [];
        },
        operate(operation, data) {
            if(operation=='look'){
                this.showCodeDialog = true;
                // 查询绑定接口列表
                this.getContList(data);
            }
            if(operation=='del'){
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
            if(operation=='txNmClick'){
                // console.log('信息',data)
                window.open(
                    `/aop-h5-sub/#/aop_tradecode/editorDesign/interfaceDetail?apiId=${data.apiId}&fnctId=${this.$route.query.fnctId}`,
                    "_blank"
                );
            }
        },
        // 删除绑定接口
        async delContlist(val){
            // apedirId //删除Id
            const params = {
                apedirId: val.apedirId,
            }
            const res = await this.rpc.assetList.delConnectNew4BList(params)
            // console.log('删除结果',res)
            this.getContList(val);
        },
        // 弹窗搜索
        searchSubmit(type) {
            this.$emit("searchSubmit", type);
        },
        // 重置搜
        resetSearch(type) {
            this.$emit("resetSearch", type);
        },
        handleSizeChange1(val) {
            this.$emit("handleSizeChange1", val);
        },
        handleCurrentChange1(val) {
            this.$emit("handleCurrentChange1", val);
        },
        // 列表多选
        checkList(e) {
            e.forEach((ele,index)=>{
                this.rightCheckList.forEach((obj)=>{
                    if (obj.d4iId == ele.d4iId) { //已选中过
                        console.log("已勾选的有重复==",obj)
                        this.$message({
                            type: "warning",
                            message: "已选择的交互事件有重复，请重新选择",
                        });
                        this.$nextTick(()=>{
                            this.$refs.radioTableRef.toggleRowSelection(ele,false);
                        })
                        return
                    }
                })
                this.oldrightCheckList.forEach((item)=>{
                    if (item.d4iId == ele.d4iId) { //已选中过
                        console.log("已绑定的和勾选的有重复==",item)
                        this.$message({
                            type: "warning",
                            message: "该交互事件已被绑定，请重新选择",
                        });
                        this.$nextTick(()=>{
                            this.$refs.radioTableRef.toggleRowSelection(ele,false);
                        })
                        return
                    }
                })
            })
            this.$emit("checkList", e);
        },
    },
    created() {
        // this.getInfo(); // 查询基本详情
    },
    watch: {
        "tableA": {
            handler(newVal, oldVal) {
                if(!newVal){return}
                this.$nextTick(()=>{
                    this.$refs.radioTableRef.clearSelection();
                })
                let list = newVal;
                // 已选的交互不能再次提交 ，故而只展示不勾选
                // list.forEach((ele)=>{
                //     this.rightCheckList.forEach((item)=>{
                //         if (item.componentId == ele.componentId) {
                //             this.$nextTick(()=>{
                //                 this.$refs.radioTableRef.toggleRowSelection(
                //                     ele,
                //                     true
                //                 );
                //             })
                //         } else {
                //         }
                //     })
                // })
                this.$nextTick(()=>{
                    this.tableA = list
                })
            },
            deep: true,
            immediate: true,
        },
        "removerightCheckList": {
            handler(newVal, oldVal) {
                if(!newVal){return}
                if(this.rightCheckList.length==0){
                    this.$nextTick(()=>{
                        this.$refs.radioTableRef.clearSelection();
                    })
                    return;
                }
                this.$nextTick(()=>{
                    this.$refs.radioTableRef.toggleRowSelection(newVal,false);
                })
            },
            deep: true,
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_comps_page_tabs {
    width: 100%;
    max-height: calc(100vh - 320px);
    min-height: calc(100vh - 320px);
    ::v-deep .el-dialog {
        border-radius: 8px 8px;
    }
    .preview_content_table {
        padding: 16px 16px;
        background: #ffffff;
        color: #131313;
        max-height: calc(100vh - 400px);
        overflow: scroll;
        width: 100%;
        h3 {
            font-size: 16px;
            font-family: PingFangSC-Semibold;
            color: #111111;
            letter-spacing: 0;
            line-height: 24px;
            font-weight: 600;
            margin-bottom:16px;
            display: flex;
            align-items: center;
            span{
                text-align: center;
                cursor: pointer;
                font-size: 12px;
                line-height: 22px;
                letter-spacing: 0;
                margin-left:8px;
                color: #999999;
                font-weight: 400;
            }
        }
        .label_p{
            color:#358aff;
            cursor: pointer;
        }
    }
    .demo-form-inline {
        width: 100%;
        margin: 12px 0px;
        padding: 16px 0 0 16px;
        background: #ffffff;
        border-radius:4px;
        ::v-deep .el-form-item__content {
            input {
                min-width: 140px;
            }
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
                min-width: 140px;
            }
        }
        ::v-deep .el-button {
            min-width: 64px;
            height: 32px;
            font-size: 14px;
        }
    }
    h3 {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 36px;
    }
    ::v-deep .el-tabs__nav-wrap::after {
        background-color: $base_white;
    }
    ::v-deep .el-dialog__footer {
        display: flex;
        justify-content: center;
    }
    .btn_el_pageNation {
        display: flex;
        justify-content: flex-end;
        padding: 16px 0;
    }
    .dialog-footer {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        .el-button {
            margin-right: 10px;
        }
    }
    ::v-deep .el-tabs__header {
        margin: 0;
        .el-tabs__item {
            height: 72px;
            padding: 0 30px;
            line-height: 72px;
            font-size: 16px;
            font-family: $font_medium;
            letter-spacing: 0;
            font-weight: $font_weight_600;
        }
    }
    ::v-deep .el-tabs__content {
        display: none;
    }
}
</style>
