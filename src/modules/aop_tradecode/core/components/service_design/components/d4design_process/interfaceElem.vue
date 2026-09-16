<template>
    <div class="aop_tradecode_comps_d4design_process_elem">
        <div class="elem_title">
            <!-- <span class="bold_text">接口信息</span> -->
            <span class="tag red" v-if="currentObj.addState == '0'"
                >设计中</span
            >
            <span class="tag blue" v-if="currentObj.addState == '2'"
                >已登记</span
            >
            <span class="tag completed" v-if="currentObj.addState == '1'"
                >已完成</span
            >
            <el-select
                v-model="currentInterfaceId"
                placeholder="请选择"
                size="mini"
                @change="interfaceChange"
            >
                <el-option
                    v-for="item in apiInfoList"
                    :key="item.svcId"
                    :label="item.svcNm"
                    :value="item.svcId"
                >
                    <div
                        style="
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
                            align-items: center;
                        "
                    >
                        <span class="select-tag red" v-if="item.addState == '0'"
                            >设计中</span
                        >
                        <span class="select-tag blue" v-if="item.addState == '2'"
                            >已登记</span
                        >
                        <span
                            class="select-tag completed"
                            v-if="item.addState == '1'"
                            >已完成</span
                        >
                        <span>{{ item.svcNm }}</span>
                    </div>
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { setSessionStorage, getSessionStorage } from "@m/utils/localStorage";
export default {
    mixins: [mixin],
    name: "elem",
    components: {},
    props: {
        dataObj: {
            type: Object,
            default: () => ({}),
        },
        fnctId: {
            type: String,
            default: () => "",
        },
        fnctCd: {
            type: String,
            default: () => "",
        },
        authId: {
            type: String,
            default: () => "",
        },
        jobNo: {
            type: String,
            default: () => "",
        },
        authAppDtlId: {
            type: String,
            default: () => "",
        },
        currentServObj: {
            type: Object,
            default: () => ({}),
        },
        detailType: {
            type: String,
            default: () => "",
        },
        fourRAttrFlag: {
            type: Boolean,
            default: () => false,
        },
        currentApiId: {
            type: String,
            default: () => "",
        },
        svcId: {
            type: String,
            default: () => "",
        },
        currentParentCpnInfo: {
            type: Object,
            default: () => ({}),
        },
        // 阅读模式
        isRead: {
            type: Boolean,
            default: () => false,
        },
        disabled: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            data: [],
            //服务组件数据列表
            cpntList: [],
            // 服务组件名称搜索
            cpntNm: "",
            // 所属应用下拉框
            appList: [],
            // 所属应用id
            aaId: "",
            d4bOptions: [], // D4b下拉选择框
            currentD4bService: "", // 当前选中的D4b服务

            // 业务规则栏当前选中页签
            ruletabsActive: "业务规则",
            // 业务规则栏当前视图
            ruletabsView: 0,
            // 服务栏当前选中页签
            serviceActive: "服务列表",
            // 当前选中业务规则
            currentRule: "余额查询规则",
            d4bSvcList: [],
            sysOptions: [],
            apiGroupOptions: [],

            defaultOpeneds: [0], // 树形展示序号组
            d4bApiList: [], // d4b服务列表
            d5LinkApiList: [], // 直连服务列表
            d5SelfApiList: [], // 自有服务列表
            d4bServiceList: [], //

            relatedServiceList: [],
            currentD4bObj: {},
            defaultActive: "服务编排组件",
            // d4b服务名称搜索
            d4bNm: "",
            currentRelatedServiceObj: {},
            servId: "",
            //作业太网关跳转页面需要的参数
            relySys: "",
            groupId: "",
            releaseFlag: "",
            apiServiceType: "",
            pageMode: "",
            type: "",
            data_view: true,
            data_view: true,
            modelName: "",
            apiInfoList: [],
            currentObj: {},
            jobNo: "", //作业号
            fnctCd: "", //功能编号
            beltLine: "", //业务域
            authId: "", //授权编号
            authAstFnctInfoId: "",
        };
    },
    inject: ["getDataList"],
    watch: {
        apiInfoList() {
            const svcId = getSessionStorage("svcId");
            const e = this.apiInfoList.find((item) => {
                return item.svcId === svcId;
            });
            if (e) {
                this.currentInterfaceId = e.svcId;
                this.interfaceChange(e.svcId);
            }
        },
    },
    methods: {
        //初始化
        init() {
            this.orderId = this.$route.query.orderId;
            this.jobNo = this.$route.query.jobId;
            this.fnctCd = this.$route.query.fnctId;
            this.beltLine = this.$route.query.beltLine;
            this.authId = this.$route.query.authAstFnctInfoId;
            this.authAstFnctInfoId = this.$route.query.authAstFnctInfoId;
        },

        async getInterfaceList() {
            // if (!this.currentD4bObj.svcId) return
            const params = {
                pageFlg: "0", //分页标志：0-不分页；1-分页
                jobNo: this.jobNo, //作业号
                fnctId: this.fnctCd, //功能编号   FM-ZC-2023-000663
                beltLine: this.beltLine, //业务域   FM-YWY-2022-000001
                authId: this.authAstFnctInfoId, //授权编号  FM-AFJI-2023041100001273
            };
            const params1 = {
                jobNo: this.jobNo,
                fnctCd: this.fnctCd,
                beltLine: this.beltLine,
                authId: this.authAstFnctInfoId,
                currentPage: "1",
                turnPageShowNum: "99999",
            };
            const res = await this.rpc.newEditor.getInterfaceList(params);
            const res1 = await this.rpc.changeList.queryAssetTranChangeList(
                params1
            );
            if (res.apiInfoList?.length > 0) {
                this.apiInfoList = res.apiInfoList.map((item) => {
                    item.apiName = item.svcNm;
                    item.apiId = item.svcId;
                    item.addState = item.svcSts;
                    let sameItem =
                        res1?.assetTranChangeList?.length > 0 &&
                        res1.assetTranChangeList.find(
                            (findItem) => findItem.svcId == item.svcId
                        );
                    if (sameItem) item.changeTp = sameItem.changeTp;
                    else item.changeTp = "";
                    return item;
                });
                this.currentObj = res.apiInfoList[0];
                this.currentInterfaceId = this.currentObj.svcId;
                this.$emit("interfaceClick", this.currentObj);
            }
        },
        interfaceChange(id) {
            if (this.disabled) {
                this.$message.error("请退出循环组件内部");
                return;
            }
            console.log("sb", id);

            this.currentObj = this.apiInfoList.filter((i) => i.svcId == id)[0];
            this.$nextTick(() => {
                setSessionStorage("svcId", this.currentObj.svcId);
                this.$emit("interfaceClick", this.currentObj);
            });
        },
    },
    created() {
        this.init();
        this.getInterfaceList();
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";

/deep/ .select-tag {
            min-width: 47px;
            padding: 0px 5px;
            text-align: center;
            vertical-align: middle;
            font-size: 12px;
            height: 18px;
            line-height: 18px !important;
            margin-right: 4px;
            &.blue {
                color: #ffffff;
                background: #70b603;
            }
            &.red {
                color: #ffffff;
                background: #f59a23;
            }
            &.origin {
                color: #ff9104;
                border: 1px solid #ff9104;
            }
            &.yellow {
                color: #f7ecc2;
                border: 1px solid #f7ecc2;
            }
            &.completed {
                background: #409eff;
                color: #ffffff;
            }
        }
.aop_tradecode_comps_d4design_process_elem {
    /deep/ .el-select__caret {
        color: #333;
        transform: rotateZ(0);
        &::before {
        content: "\e790"
        }
    }
    // max-width: 240px;
    // max-width: 290px;
    user-select: none;
    .elem_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44px;
        padding: 0 8px;
        // padding-right: 0;
        // box-shadow: 0 1px 0.5px 0 #e7e7ee;
        border-bottom: 1px solid #e7e7e7;
        width: 100%;
        /deep/ .el-input__inner {
            padding: 0 8px;
            color: #000;
        }
        .tag {
            min-width: 34px;
            padding: 0px 0px;
            // transform: scale(0.8);
            text-align: center;
            font-size: 10px;
            &.blue {
                color: #ffffff;
                background: #70b603;
            }
            &.red {
                color: #ffffff;
                background: #f59a23;
            }
            &.origin {
                color: #ff9104;
                border: 1px solid #ff9104;
            }
            &.yellow {
                color: #f7ecc2;
                border: 1px solid #f7ecc2;
            }
            &.completed {
                background: #409eff;
                color: #ffffff;
            }
        }
        /deep/.el-input__inner {
            border: none !important;
        }
    }
    .bold_text {
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .bold_text_list {
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        // color: #111111;
        letter-spacing: 0;
    }
    .elem_box {
        height: 100%;
        display: flex;
        flex-direction: column;
        .el_menu_div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 70%;
            height: 20px;
            line-height: 20px;
            color: #000;
        }
        .underLine {
            border-bottom: 1px solid $pri_br_color;
        }
    }
    .elem_item {
        // flex: 1;
        max-height: 50%;
        font-size: 12px;
        .elem_item_title {
            // background: #f7f7f7;
            // width: 240px;
            height: 35px !important;
            &.text {
                display: flex;
                align-items: center;
                padding-left: 10px;
                height: 50px;
                border-top: 1px solid #dcdfe6;
                border-bottom: 1px solid #dcdfe6;
                user-select: none;
                box-shadow: 0 1px 10px 0 #e7e7e7;
                font-weight: $font_weight_600;
                // &.no_border_top {
                //   border-top: none;
                // }
            }
            &.tabs {
                display: flex;
                // justify-content: space-around;
                // border-bottom: 2px solid #dcdfe6;
                user-select: none;
                // ::v-deep .el-tabs__active-bar {
                //   width: 50px !important;
                // }
                // box-shadow: 0 1px 10px 0 #e7e7e7;
                ::v-deep .el-tabs__nav-wrap::after {
                    background-color: $base_white;
                }
                ::v-deep .el-tabs__header {
                    margin: 0;
                    .el-tabs__item {
                        height: 50px;
                        line-height: 50px;
                        font-size: 12px;
                        padding: 0 15px;
                        font-family: $font_medium;
                        letter-spacing: 0;
                        border-bottom: 1px solid #dcdfe6;
                        &.is-active {
                            font-weight: $font_weight_600;
                        }
                    }
                }
                ::v-deep .el-tabs__content {
                    display: none;
                }
            }
            &.flex {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 44px;
                padding: 0 16px;
                .el-icon-plus {
                    font-size: 16px;
                    color: #3b3b3b;
                    cursor: pointer;
                }
            }
            .icon_area {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .item {
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                    cursor: pointer;
                }
                &.mw20 {
                    min-width: 20px;
                }
            }
        }
        .elem_item_content {
            @include scrollbar;
            // height: calc(100% - 50px);
            height: calc(100vh - 147px);
            overflow-y: auto;
            transition-duration: 0.5s;
            // &.padding {
            //   padding: 8px 10px;
            // }
            &:nth-child(-n + 2) {
                min-height: 150px;
            }
            .elem_search,
            .elem_select {
                padding: 8px 10px;
                overflow: hidden;
                &.flex {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .add_icon {
                        margin-left: 10px;
                        cursor: pointer;
                        &.hidden {
                            visibility: hidden;
                        }
                    }
                }
                ::v-deep .el-select {
                    width: 100%;
                }
            }
            .elem_search_sel {
                float: left;
                ::v-deep .el-input__inner {
                    width: 100%;
                    height: 28px;
                }
                ::v-deep .el-input__icon {
                    line-height: 28px !important;
                }
                .el-icon-search {
                    line-height: 28px;
                }
            }
            .elem_tips {
                display: none;
                position: absolute;
                border-radius: $theme_radius;
                padding: 10px 5px;
                z-index: 2000;
                font-size: 12px;
                line-height: 1.2;
                word-wrap: break-word;
                background-color: $theme_color;
                color: $base_white;
                width: 192px;
                left: 80px;
                top: 70px;
            }
            .api_info_list {
                // margin-top: 8px;
                .list_item {
                    font-size: 12px;
                    // margin-bottom: 6px;
                    // white-space: nowrap;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    cursor: pointer;
                    padding: 0 16px;
                    user-select: none;
                    height: 34px;
                    &:hover,
                    &.active {
                        background: #f7f7f9;
                        .left .service_name {
                            color: $theme_color;
                            // font-weight: 600;
                        }
                    }
                    .text_area {
                        display: flex;
                        align-items: center;
                        flex: 1;
                        .icon {
                            width: 16px;
                            height: 16px;
                            border: 1px solid #e7e7ee;
                            border-radius: 2px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-right: 4px;
                            .center {
                                display: inline-block;
                                width: 10px;
                                height: 10px;
                                border-radius: 2px;
                                &.blue {
                                    background: $theme_color;
                                }
                                &.origin {
                                    background: #ff9104;
                                }
                                &.green {
                                    background: #36d542;
                                }
                                &.purple {
                                    background: #8080ff;
                                }
                                &.grey {
                                    background: #f1f1f1;
                                }
                            }
                        }
                        .content {
                            font-family: PingFangSC-Semibold;
                            font-size: 14px;
                            color: #111111;
                            letter-spacing: 0;
                        }
                        .flex_container_icon {
                            height: 16px;
                            vertical-align: top;
                            margin-left: 20px;
                            margin-right: 4px;
                        }
                        .list_item_title {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            max-width: 120px;
                            height: 20px;
                            // padding: 0 10px;
                            line-height: 20px;
                            color: #000;
                            cursor: pointer;
                            font-size: 13px;
                            &.r4b {
                                max-width: 170px;
                            }
                        }
                        .list_item_tag {
                            font-size: 12px;
                            padding: 0 3px;
                            border-radius: $theme_radius;
                            // margin-right: 4px;
                            transform: scale(0.7);
                            height: 20px;
                            line-height: 20px;
                            text-align: center;
                            &.design {
                                color: #fff;
                                background: #358aff;
                                &.hidden {
                                    visibility: hidden;
                                }
                            }
                            &.released {
                                color: $base_white;
                                background: #2ddaac;
                            }
                            &.outside,
                            &.inside {
                                color: #ff934b;
                                background: #fff4e5;
                                font-size: 14px;
                            }
                            &.new {
                                color: #fe6f79;
                                background: #ffeaec;
                                display: inline-block;
                                width: 42px;
                                font-size: 14px;
                            }
                        }
                    }
                    &:hover {
                        .list_item_icon {
                            &.delete {
                                display: inline-block;
                            }
                        }
                    }
                    .list_item_icon {
                        &.delete {
                            display: none;
                            // color: $danger_color;
                            cursor: pointer;
                        }
                    }
                    .icon_area {
                        font-size: 13px;
                    }
                }
            }
            .elem_list {
                .elem_list_item {
                    margin-bottom: 8px;
                    &.function_info_button {
                        text-align: center;
                    }
                    .title {
                        font-weight: $font_weight_600;
                        display: inline-block;
                        text-align: right;
                        width: 70px;
                    }
                }
            }
            .view_mode {
                text-align: right;
                margin-bottom: 8px;
            }
            .text_button {
                color: $theme_color;
                cursor: pointer;
            }
        }
        &.hidden {
            .elem_item_title {
                background: $base_white;
            }
        }
    }
    .el-menu {
        // 隐藏滚动条
        // &::-webkit-scrollbar {
        //   width: 0 !important;
        // }
        // height: calc(100vh - 190px);
        overflow-y: auto;
        border: 0px;
        ::v-deep .el-submenu__title {
            height: 40px;
            line-height: 40px;
            font-weight: $font_weight_600;
            font-family: PingFangSC-Regular;
            font-size: 12px;
        }
        .el_menu_img {
            width: 9.95px;
            height: 9.98px;
            margin-right: 20px;
            margin-top: 4px;
        }
        ::v-deep .el-submenu__title:hover {
            background-color: #fff;
        }
        ::v-deep .el-menu-item-group__title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #333333;
            letter-spacing: 0;
            cursor: pointer;
            user-select: none;
        }
    }
    .fade-enter-active {
        transition: all 0.2s ease;
    }
    .fade-leave-active {
        transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .fade-enter,
    .fade-leave-to {
        transform: translateY(-5px);
        opacity: 0;
    }
    .api_info_list {
        .api_info_list_item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 34px;
            padding: 0 16px;
            &:hover {
                background: #f7f7f9;
                .right {
                    .el-icon-delete-solid {
                        visibility: visible;
                    }
                    .el-icon-edit-outline {
                        visibility: visible;
                    }
                }
            }
            &.active {
                background: #eaf1ff;
                color: #358aff;
                .text_area .list_item_title {
                    color: $theme_color;
                    font-weight: 600;
                }
            }
            .left {
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
                .icon {
                    width: 16px;
                    height: 16px;
                    border: 1px solid #e7e7ee;
                    border-radius: 2px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .center {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        border-radius: 2px;
                        &.blue {
                            background: $theme_color;
                        }
                        &.origin {
                            background: #ff9104;
                        }
                        &.yellow {
                            background: #f7ecc2;
                        }
                    }
                }
                .service_name {
                    margin-left: 4px;
                    overflow: hidden;
                    //   text-overflow: ellipsis;
                    white-space: nowrap;
                    // max-width: 120px;
                    max-width: 110px;
                }
                .tag {
                    min-width: 47px;
                    padding: 0px 5px;
                    // transform: scale(0.8);
                    text-align: center;
                    &.blue {
                        color: #ffffff;
                        background: #70b603;
                    }
                    &.red {
                        color: #ffffff;
                        background: #f59a23;
                    }
                    &.origin {
                        color: #ff9104;
                        border: 1px solid #ff9104;
                    }
                    &.yellow {
                        color: #f7ecc2;
                        border: 1px solid #f7ecc2;
                    }
                    &.completed {
                        background: #409eff;
                        color: #ffffff;
                    }
                }
            }
            .right {
                .el-icon-delete-solid {
                    font-size: 14px;
                    color: $theme_color;
                    cursor: pointer;
                    visibility: hidden;
                }
                .el-icon-edit-outline {
                    font-size: 14px;
                    color: $theme_color;
                    cursor: pointer;
                    visibility: hidden;
                }
            }
            &.changeColor {
                background: #f9d9dd;
            }
            &.upgradesColor {
                background: #fef0de;
            }
            &.disabledColor {
                opacity: 0.5;
            }
        }
    }
}
</style>
