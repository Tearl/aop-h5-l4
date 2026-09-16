<template>
    <div
        class="aop_tradecode_page_d4workbench_workbench_design"
        :key="$route.fullPath"
    >
        <!-- S4系统设计 -->
        <S4Design
            v-if="
                currentActive == '0' ||
                currentActive == '1' ||
                currentActive == '2'
            "
            @handleGoTo="handleGoTo"
            :pageType="pageType"
            :fnctId="fnctId"
            :fnctCd="fnctCd"
            :currentActive="currentActive"
            :apiId="apiId"
            :admiId="admiId"
            :jobNo="jobNo"
            :modelVersion="modelVersion"
            :authAppDtlId="authAppDtlId"
            :detailType="detailType"
            :transAppInfo="transAppInfo"
        ></S4Design>

        <!-- S4系统设计后半部分 -->
        <ServiceDesign
            ref="designRef"
            v-if="currentActive == '3' && detailType != 'upload'"
            @handleGoTo="handleGoTo"
            :currentActive="currentActive"
            :pageType="pageType"
            :fnctId="fnctId"
            :fnctCd="fnctCd"
            :authId="authId"
            :jobNo="jobNo"
            :apiId="apiId"
            :svcId="svcId"
            :authAppDtlId="authAppDtlId"
            :detailType="detailType"
            :transAppInfo="transAppInfo"
        ></ServiceDesign>
        <!-- 服务设计 -->
        <Code
            v-if="currentActive == '4'"
            @handleGoTo="handleGoTo"
            :asideActive="currentActive"
            :transAppInfo="transAppInfo"
        ></Code>
        <!-- 消息提醒 -->
        <MessageInfo
            v-if="showMessage"
            :info="messageInfo"
            :tabType="'2'"
            @closeMessage="closeMessage"
        ></MessageInfo>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import ServiceDesign from "@m/core/components/service_design";
import S4Design from "./components/design_editor/service_define";
import Code from "../workbench/components/design_editor/code";
import MessageInfo from "@m/core/components/message_box";

export default {
    mixins: [mixin],
    components: {
        ServiceDesign,
        S4Design,
        Code,
        MessageInfo,
    },
    data() {
        // d2Url = `${window.origin}/#/aop_tradecode/d4workbench/home`;
        return {
            currentActive: "1", // 默认业务交易
            pageType: "",
            fnctId: "", // 功能ID
            fnctCd: "", //功能编号
            apiId: "", // 服务ID
            authAppDtlId: "", //工作台ID
            admiId: "", //工作台ID
            modelVersion: "", //工作台版本号
            pageMode: "", //只读服务定义
            jobNo: "", //作业号
            authId: "", //授权码
            svcId: "", //交易ID

            showMessage: false,
            messageInfo: {},
            transAppInfo: {},
        };
    },
    methods: {
        handleGoTo(e, data) {
            this.currentActive = e;
        },
        //初始化
        init(query) {
            this.pageType = query.pageType;
            this.apiId = query.apiId;
            this.fnctId = query.fnctId;
            this.fnctCd = query.fnctCd || "FM-GN-2022-100882";
            this.authId = query.authId || "FM-ZY0.5ZC-2022-001682";
            this.jobNo = query.jobNo;
            this.currentActive = query.active || "1";
            this.authAppDtlId = query.authAppDtlId;
            this.admiId = query.admiId;
            this.modelVersion = query.modelVersion;
            this.detailType = query.detailType;
            this.pageMode = query.pageMode || "";
            this.svcId = query.transId;
            this.queryLastMessage();
            this.getProjectInfo();
            console.log("init==========>");
        },
        async getProjectInfo(trans) {
            const data = {
                examId: this.$route.query.examId, // 授权作业Id
                fnctId: this.$route.query.fnctId,
            };
            const res = await this.rpc.assetList.queryApplicationFunctionList(
                data
            );
            console.log("交易工程==", res);
            this.transAppInfo = {
                appId: res.transAppId,
                appNm: res.transAppNm,
                appTypeCd: res.transAppCd,
            };
        },
        /**
         * 查询消息提醒
         */
        async queryLastMessage() {
            const params = {
                fnctId: this.$route.query.fnctId || "",
                msgTpCd: "01", // 消息类型代码:01-S4设计提醒
            };
            let res = await this.rpc.s4design.queryLastMessage(params);
            // console.log(res,'消息查询成功')
            if (!res || !res.msgId) {
                return;
            }
            this.messageInfo = res;
            this.showMessage = true;
        },
        /**
         * 读取消息提醒
         */
        async readMessage(info) {
            const params = {
                msgId: info.msgId || "", // 消息id
            };
            const res = await this.rpc.s4design.readMessage(params);
            // console.log(res,'消息读取成功')
            if (res) {
            }
        },
        closeMessage(type, info) {
            if (type == "2") {
                this.showMessage = false;
                this.readMessage(info);
            }
        },
        // 跑批存量功能的接口编排截图
        async START_INTERFACE_SCREENSHOT() {
            // 1. 获取所有功能列表，循环遍历功能列表
            // 2. 读取缓存数据，判断当前循环项的功能是否已经处理
            // 3. 处理过的跳过，未处理的处理，然后记录该功能id
            console.log("==============数据跑批开始================");

            // 获取全量功能列表
            const { functionWorkInfoList } =
                await this.rpc.s4design.queryFunctionWorkInfoPageList({
                    bizAppNo: "",
                    bizDomainNo: "",
                    currentPage: 1,
                    examId: "",
                    fnctNoNm: "",
                    fnctStsCd: "",
                    modNo: "",
                    turnPageShowNum: 9999,
                });
            console.log(`==========全量功能: ${functionWorkInfoList.length}`);

            for (let func of functionWorkInfoList) {
                let storage_funcs =
                    JSON.parse(
                        localStorage.getItem("START_INTERFACE_SCREENSHOT_FUNCS")
                    ) || [];
                if (storage_funcs.includes(func.fnctId)) {
                    // 处理过了，跳过
                } else {
                    // 处理当前 func
                    const query = {
                        active: 3, // 接口设计3，流程设计0
                        beltLine: func.bizDomainNo,
                        bizAppNo: func.bizAppNo,
                        fnctId: func.fnctId,
                        examId: func.examId,
                        pageMode: "s4design",
                    };
                    this.$router.replace({
                        path: this.$route.path,
                        query: query,
                    });
                    this.init(query);
                    await new Promise((resolve) =>
                        setTimeout(resolve, 1000 * 30)
                    );
                    const btn = document.getElementById("interface_save_btn");
                    if (btn) {
                        btn.click();
                        // 处理完成，写入缓存
                        storage_funcs.push(func.fnctId);
                        localStorage.setItem(
                            "START_INTERFACE_SCREENSHOT_FUNCS",
                            JSON.stringify(storage_funcs)
                        );
                    } else {
                        // 再等5秒
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000 * 5)
                        );
                        const try_again =
                            document.getElementById("interface_save_btn");
                        if (try_again) {
                            try_again.click();
                            // 处理完成，写入缓存
                            storage_funcs.push(func.fnctId);
                            localStorage.setItem(
                                "START_INTERFACE_SCREENSHOT_FUNCS",
                                JSON.stringify(storage_funcs)
                            );
                        }
                    }
                    let _temp = JSON.parse(
                        localStorage.getItem("START_INTERFACE_SCREENSHOT_FUNCS")
                    ) || [];
                    console.log(`==========已完成: ${_temp.length} / ${functionWorkInfoList.length}`);
                    await new Promise((resolve) =>
                        setTimeout(resolve, 1000 * 5)
                    );
                }
            }
            console.log(
                "==========已完成🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻"
            );
        },
        async START_FLOW_SCREENSHOT() {
            // 1. 获取所有功能列表，循环遍历功能列表
            // 2. 读取缓存数据，判断当前循环项的功能是否已经处理
            // 3. 处理过的跳过，未处理的处理，然后记录该功能id
            console.log("==============数据跑批开始================");

            // 获取全量功能列表
            const { functionWorkInfoList } =
                await this.rpc.s4design.queryFunctionWorkInfoPageList({
                    bizAppNo: "",
                    bizDomainNo: "",
                    currentPage: 1,
                    examId: "",
                    fnctNoNm: "",
                    fnctStsCd: "",
                    modNo: "",
                    turnPageShowNum: 9999,
                });
            console.log(`==========全量功能: ${functionWorkInfoList.length}`);

            for (let func of functionWorkInfoList) {
                let storage_funcs =
                    JSON.parse(
                        localStorage.getItem("START_FLOW_SCREENSHOT_FUNCS")
                    ) || [];
                if (storage_funcs.includes(func.fnctId)) {
                    // 处理过了，跳过
                } else {
                    // 处理当前 func
                    const query = {
                        active: '0', // 接口设计3，流程设计0
                        beltLine: func.bizDomainNo,
                        bizAppNo: func.bizAppNo,
                        fnctId: func.fnctId,
                        examId: func.examId,
                        pageMode: "s4design",
                    };
                    this.$router.replace({
                        path: this.$route.path,
                        query: query,
                    });
                    this.init(query);
                    await new Promise((resolve) =>
                        setTimeout(resolve, 1000 * 30)
                    );
                    const btn = document.getElementById("service_save_btn");
                    if (btn) {
                        btn.click();
                        // 处理完成，写入缓存
                        storage_funcs.push(func.fnctId);
                        localStorage.setItem(
                            "START_FLOW_SCREENSHOT_FUNCS",
                            JSON.stringify(storage_funcs)
                        );
                    } else {
                        // 再等5秒
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000 * 5)
                        );
                        const try_again =
                            document.getElementById("service_save_btn");
                        if (try_again) {
                            try_again.click();
                            // 处理完成，写入缓存
                            storage_funcs.push(func.fnctId);
                            localStorage.setItem(
                                "START_FLOW_SCREENSHOT_FUNCS",
                                JSON.stringify(storage_funcs)
                            );
                        }
                    }

                    let _temp = JSON.parse(
                        localStorage.getItem("START_FLOW_SCREENSHOT_FUNCS")
                    ) || [];
                    console.log(`==========已完成: ${_temp.length} / ${functionWorkInfoList.length}`);

                    await new Promise((resolve) =>
                        setTimeout(resolve, 1000 * 5)
                    );
                }
            }
            console.log(
                "==========已完成🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻"
            );
        },
    },
    created() {
        const query = this.$route.query;
        this.init(query);
    },
    mounted() {
        window.START_INTERFACE_SCREENSHOT = this.START_INTERFACE_SCREENSHOT;
        window.START_FLOW_SCREENSHOT = this.START_FLOW_SCREENSHOT;
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_page_d4workbench_workbench_design {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .design_container {
        display: flex;
        width: 100%;
        overflow: hidden;
        .design_container_aside {
            flex: 0 0 40px;
        }
        .design_container_process {
            flex: 1;
            width: 0;
            .process_contain_box {
                width: 100%;
                height: calc(100vh - 48px);
                display: flex;
                overflow: hidden;
                .process_container {
                    width: 100%;
                    height: 100%;
                    margin: 0 auto;
                    display: flex;
                    font-family: $font_regular;
                    overflow: hidden;
                    ::v-deep .el-input__inner {
                        border: 1px solid $pri_br_color;
                        border-radius: $theme_radius;
                    }
                    .process_left {
                        background: $base_white;
                        flex: 0 0 240px;
                        border-right: 1px solid $pri_br_color;
                    }
                    .process_right {
                        background: $base_white;
                        flex: 0 0 300px;
                        // flex: 0 0 260px;
                        border-left: 1px solid $pri_br_color;
                    }
                    .process_main {
                        background: $base_white;
                        display: inline-block;
                        margin: 0px 24px;
                        margin-top: 88px;
                        .process_divMb {
                            margin-bottom: 2px;
                        }
                    }
                    .process_middle {
                        background-color: $base_white;
                        flex: 1;
                        overflow: auto;
                        position: relative;
                        .create_container {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            .el-icon-plus {
                                font-size: 60px;
                            }
                        }
                    }
                }
            }
            .params_contain_box {
                width: 100%;
                height: calc(100vh - 48px);
                background-color: $base_white;
                overflow: auto;
            }
        }
    }
    .newService_dialog {
        .el-select {
            width: 100%;
        }
        ::v-deep .el-form-item__label {
            color: $reg_ft_color;
            font-weight: $font_weight_600;
        }
    }
    .params_contain_box {
        width: 100%;
        height: 100%;
        height: calc(100vh - 48px);
        background-color: $base_white;
        overflow: auto;
    }
    .info_container_main {
        background-color: $base_white;
        .info_container_fr {
            ::v-deep .search_bar {
                width: 500px;
                margin: 0 auto;
            }
            padding: 16px 24px;
        }
    }
    .steps_box {
        background-color: $base_white;
        padding: 0px 100px;
        width: 100%;
        ::v-deep .el-step__head.is-finish {
            color: $base_white;
            border-color: #358aff;
            .el-step__icon.is-text {
                background-color: #358aff;
            }
        }
        ::v-deep .el-step__head.is-process {
            color: #333;
            border-color: #f8f8f8;
            .el-step__icon.is-text {
                background-color: #f8f8f8;
                .el-step__icon-inner {
                    font-weight: normal;
                }
            }
        }
        ::v-deep .el-step__title.is-process {
            font-weight: normal;
            font-size: 12px;
        }
        ::v-deep .el-step__title.is-finish {
            color: #303133;
            font-size: 12px;
        }
    }
    .form_box {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        ::v-deep .el-textarea__inner {
            width: 400px;
        }
        .el-input,
        .el-select {
            width: 400px;
        }
    }
    .form_item_flex {
        display: flex;
        .icon_right {
            margin-left: 5px;
            display: flex;
            flex-flow: column;
            font-size: 21px;
            i {
                cursor: pointer;
                line-height: 20px;
            }
        }
    }
    .d2Info_dialog {
        ::v-deep .el-dialog {
            margin-top: 5vh !important;
        }
        .iframe_content {
            width: 100%;
            height: 1200px;
        }
    }
    
}
</style>
