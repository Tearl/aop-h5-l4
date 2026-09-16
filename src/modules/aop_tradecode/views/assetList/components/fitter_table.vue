<template>
    <div class="aop_developer_comps_page_tabs">
        <div v-if="tabType == 'A'">
            <div class="preview_content_table">
                <h3>基本信息</h3>
                <div class="preview_content_table_flex">
                    <p>
                        工程应用编码：
                        <span>{{ topInfo.appId }}</span>
                    </p>
                    <p>
                        工程应用名称：
                        <span>{{ topInfo.projectName }}</span>
                    </p>
                </div>
                <div class="preview_content_table_flex">
                    <p>
                        应用描述：
                        <span>{{ topInfo.appDesc }}</span>
                    </p>
                </div>
                <div class="preview_content_table_flex">
                    <p>
                        创建人：
                        <span>{{ topInfo.creatrNm }}</span>
                    </p>
                    <p>
                        创建时间：
                        <span>{{ topInfo.crtTm }}</span>
                    </p>
                </div>
                <div class="preview_content_table_flex">
                    <p>
                        最后修改人：
                        <span>{{ topInfo.updNm }}</span>
                    </p>
                    <p>
                        最后修改时间：
                        <span>{{ topInfo.updTm }}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import FormDialog from "./formDialog.vue";
export default {
    components: {
        FormDialog,
    },
    props: {
        tableListA: {
            type: Array,
            default: () => [],
        },
        tabType: {
            type: String,
            default: () => "",
        },
        topInfo: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            formSearch: {
                inputValue: "",
            },
        };
    },
    methods: {
        handleClick(e) {
            this.$emit("tabClick", e);
        },
        handleTabsEdit(e) {
            this.$emit("tabEdit", e);
        },
        listnameDetail(type, value) {
            console.log("交易名称跳转应用", type, value);
        },
        // 代码历史列表懒加载
        load(tree, treeNode, resolve) {
            setTimeout(() => {
                resolve([
                    {
                        id: 31,
                        name: "王小虎",
                        address: "上海市普陀区金沙江路 1519 弄",
                    },
                    {
                        id: 32,
                        name: "王小虎",
                        address: "上海市普陀区金沙江路 1519 弄",
                    },
                ]);
            }, 1000);
        },
    },
    created() {
        // this.getInfo(); // 查询基本详情
    },
    watch: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_comps_page_tabs {
    background-color: $base_white;
    width: 100%;
    margin-top:12px;
    h3 {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 36px;
    }
    .preview_content_table {
        padding: 16px 16px;
        background: #ffffff;
        color: #131313;
        max-height: calc(100vh - 364px);
        overflow-y: auto;
        h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
        }
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
    ::v-deep .el-tabs__nav-wrap::after {
        background-color: $base_white;
    }
    ::v-deep .el-dialog__footer {
        display: flex;
        justify-content: center;
    }
    .btn_el_pageNation {
        display: flex;
        justify-content: center;
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
