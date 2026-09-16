<template>
    <div class="aop_endentry_assetList_list_viewConfig">
        <!-- <CheckFunction></CheckFunction> -->
        <ReviewContent />
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
// import CheckFunction from './components/design_editor/BusinessRules/checkFunction'
import ReviewContent from './components/design_editor/BusinessRules/ReviewContent/index.vue'
export default {
    mixins: [mixin],
    components: {
        PageHeader,
        // CheckFunction,
        ReviewContent
    },
    data() {
        return {
        };
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_endentry_assetList_list_viewConfig {
    ::v-deep .el-dialog {
        border-radius: 8px 8px;
    }
    .preview_container {
        display: flex;
        width: 100%;
        flex-direction: column;
        padding: 0 16px;
        width: 100%;
        margin-top:12px;
        .top_header_display_flex {
            width: 100%;
            display: flex;
            background: #ffffff;
            align-items: center;
            margin-bottom: 12px;
            .preview_content_block {
                padding: 16px 16px;
                background: $base_white;
                display: flex;
                flex-direction: column;
                .preview_content_table_flex_bottom {
                    display: flex;
                    width: 100%;
                    margin-top: 5px;
                    p {
                        color: $pri_ft_color;
                        font-size: 12px;
                    }
                    span {
                        font-size: 12px;
                        color: #999999;
                    }
                }
                .preview_content_table {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    margin: 0px 20px;
                    color: #131313;
                    padding-bottom: 5px;
                    .preview_content_table_flex {
                        display: flex;
                        width: 100%;
                        margin-top: 5px;
                        p {
                            color: $pri_ft_color;
                            font-size: 12px;
                        }
                        span {
                            font-size: 12px;
                            color: #999999;
                        }
                    }
                    .preview_content_table_flex1 {
                        display: flex;
                        width: 100%;
                        align-items: center;
                        .top_flex {
                            display: flex;
                            align-items: center;
                            p {
                                color: $pri_ft_color;
                                font-weight: 600;
                                margin-right: 8px;
                                font-size: 16px;
                            }
                            span {
                                margin-right: 6px;
                            }
                            .gray {
                                color: #555555;
                                background: #f5f5f5;
                                padding: 2px 5px;
                                border-radius: 2px 2px;
                                border: 1px solid #d9d9d9;
                                font-size: 12px;
                            }
                            .orange {
                                color: #ff9104;
                                background: #fff4e5;
                                padding: 2px 5px;
                                border-radius: 2px 2px;
                                border: 1px solid #ff9104;
                                font-size: 12px;
                            }
                        }
                    }
                }
                .preview_content_table2 {
                    margin: 16px 0 20px 0;
                    color: #131313;
                    padding: 5px 24px 5px 24px;
                    p {
                        margin-top: 10px;
                        color: $pri_ft_color;
                        span {
                            color: #131313;
                        }
                        .span_link {
                            color: rgb(2, 151, 215) !important;
                            cursor: pointer !important;
                        }
                    }
                    .imgUrl {
                        display: flex;
                    }
                }
                .preview_content_title_big {
                    font-family: $font_medium;
                    font-size: 14px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    color: #ffffff;
                    width: 60px;
                    height: 60px;
                    border-radius: 8px 8px;
                    background: #358aff;
                    letter-spacing: 0;
                    font-weight: $font_weight_600;
                    margin-bottom: 10px;
                }
                .preview_content_title {
                    font-family: $font_medium;
                    font-size: 16px;
                    color: $pri_ft_color;
                    letter-spacing: 0;
                    font-weight: $font_weight_600;
                    margin-top: 0;
                }
                .preview_content_line {
                    width: 100%;
                    border-top: 0px;
                    border-left: 0px;
                    border-right: 0px;
                    border-bottom: #131313 1px dashed;
                }
            }
        }
        .detailTab {
            width: 100%;
            background: #ffffff;
        }
    }
    .preview_main {
        width: 100%;
        padding: 0px 16px;
        .preview_content_table_wrap {
            color: #131313;
            padding-bottom: 5px;
            background: #ffffff;
            padding: 16px 16px;
            max-height: calc(100vh - 316px);
            min-height: calc(100vh - 316px);
            overflow-y: auto;
            ::v-deep .el-tabs__nav-wrap::after {
                background: #ffffff;
            }
            ::v-deep .el-tabs__active-bar {
                min-width: 56px !important;
            }
            h3 {
                font-size: 14px;
                font-weight: 600;
                color: #333333;
                line-height: 36px;
            }
            .preview_content_table_flex {
                display: flex;
                width: 100%;
                padding:10px 0;
                p {
                    color: #333333;
                    font-size: 14px;
                    width: 50%;
                    ::v-deep .el-radio {
                        margin-right: 5px;
                    }
                    span {
                        color: #333333;
                        font-size: 14px;
                        margin-right: 5px;
                    }
                }
            }
            .table_list{
                ::v-deep .el-table__expand-icon {
                    .el-icon-arrow-right:before {
                        content: '\e791' !important;
                        font-size: 16px;
                    }
                }
            }
            ::v-deep .el-table__expand-icon {
                .el-icon-arrow-right:before {
                    content: '\e791' !important;
                    font-size: 16px;
                }
            }
        }
        .preview_content_table_wrap2 {
            color: #131313;
            padding-bottom: 5px;
            background: #ffffff;
            max-height: calc(100vh - 340px);
            overflow-y: auto;
            ::v-deep .el-tabs__nav-wrap::after {
                background: #ffffff;
            }
            ::v-deep .el-tabs__active-bar {
                min-width: 56px !important;
            }
            h3 {
                font-size: 14px;
                font-weight: 600;
                color: #333333;
                line-height: 36px;
                padding: 0px 24px;
            }
            .header_bot_line {
                width: 100%;
                height: 1px;
                background: #e5e5e5;
            }
            .preview_content_table_flex {
                display: flex;
                width: 100%;
                padding: 16px 24px;
                p {
                    margin-top: 6px;
                    color: #999999;
                    font-size: 14px;
                    width: 50%;
                    ::v-deep .el-radio {
                        margin-right: 5px;
                    }
                    span {
                        color: #333333;
                        font-size: 14px;
                        margin-right: 5px;
                    }
                }
            }
        }
        h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
        }
        .btn_el_pageNation {
            display: flex;
            justify-content: center;
            padding: 16px 0;
        }
        .radio_group_line_top {
            display: flex;
            .dialog_table_title_top {
                width: 100%;
                display: flex;
                align-items: center;
                margin: 10px 0px;
            }
        }
    }
    .lowCodeDown {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 10px 0;
        span {
            color: red;
            font-size: 13px;
            margin-left: 5px;
        }
    }
    .demo-form-inline {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .topinfo_p {
        color: #999999;
        font-size: 14px;
        margin-bottom: 10px;
        .red {
            color: #fe4758;
            background: #f5f5f5;
            padding: 2px 5px;
            border-radius: 2px 2px;
            border: 1px solid #fe4758;
            font-size: 12px;
        }
        .green {
            color: #36d542;
            background: #f5f5f5;
            padding: 2px 5px;
            border-radius: 2px 2px;
            border: 1px solid #36d542;
            font-size: 12px;
        }
        .right_text {
            font-size: 14px;
            color: #333333;
        }
    }
    .noneState{
        border: 0.5px solid rgba(254, 71, 88, 1);
        border-radius: 2px;
        color: #fe4758;
        font-size:13px;
        padding: 0px 4px;
    }
    .succeedState {
        border: 0.5px solid rgba(54, 213, 66, 1);
        border-radius: 2px;
        color: #36d542;
        font-size:13px;
        padding: 0px 4px;
    }
}
</style>
