<template>
  <div class="aop_tradecode_comps_d4design_process_elem">
    <div class="elem_title">
      <span class="bold_text">{{ modelName }}</span>
    </div>
    <div class="elem_box">
      <div
        class="elem_item"
        v-if="data_view"
        :class="{ hidden: !elemItemStatus[0].visible }"
        :style="{
          maxHeight: getElemItemMaxHeight(0),
          minHeight: getElemItemMinHeight(0),
        }"
      >
        <div
          class="elem_item_title flex"
          :class="{ no_border_top: !elemItemStatus[0].visible }"
          @dblclick="handleDblclick('0')"
        >
          <span class="bold_text">接口列表</span>
        </div>
        <transition name="fade">
          <div
            class="elem_item_content padding"
            v-show="elemItemStatus[0].visible"
          >
            <ul class="api_info_list">
              <li
                v-for="item in apiInfoList"
                :class="{
                  active: currentObj.apiId == item.apiId,
                  changeColor: item.changeTp == '1',
                  upgradesColor: item.changeTp == '2',
                }"
                :key="item"
                class="api_info_list_item"
                @click="interfaceClick(item)"
              >
                <div class="left">
                  <span class="tag red" v-if="item.addState == '0'"
                    >设计中</span
                  >
                  <span class="tag blue" v-if="item.addState == '2'"
                    >已登记</span
                  >
                  <span class="tag completed" v-if="item.addState == '1'"
                    >已完成</span
                  >
                  <!-- <div v-if="!item.isShow" class="service_name">
                    {{ item.apiName }}
                  </div> -->
                  <div class="service_name bold_text_list">
                      {{ item.svcNm }}
                    </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.svcNm"
                    placement="top"
                    v-if="item.svcNm.length > 8"
                  >
                    <div class="service_name bold_text_list">
                      ...
                    </div>
                  </el-tooltip>
                </div>
                <!-- <div v-if="!isRead" class="right"></div> -->
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { unduplicated } from "@m/utils/array";

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
      // 控制菜单状态的数组
      elemItemStatus: [
        {
          visible: true,
          isFixed: true,
          fixedOnUrl: require("@m/assets/images/icon_fixed_on.png"),
          fixedOffUrl: require("@m/assets/images/icon_fixed_off.png"),
          maxHeight: "calc(65% - 50px)",
          minHeight: "calc(65% - 50px)",
        },
        // {
        //   visible: true,
        //   isFixed: true,
        //   fixedOnUrl: require('@m/assets/images/icon_fixed_on.png'),
        //   fixedOffUrl: require('@m/assets/images/icon_fixed_off.png'),
        //   viewMode: "detail"
        // },
        {
          visible: true,
          isFixed: true,
          fixedOnUrl: require("@m/assets/images/icon_fixed_on.png"),
          fixedOffUrl: require("@m/assets/images/icon_fixed_off.png"),
          maxHeight: "35%",
          minHeight: "35%",
        },
      ],

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
      // 业务规则下拉选择框
      ruleOptions: [
        { label: "余额查询规则", value: "余额查询规则", type: "文本" },
        { label: "票据签收规则", value: "票据签收规则", type: "服务调用" },
      ],
      d4bSvcList: [],

      d4bSearchForm: {
        apiName: "",
        system: "",
        groupId: "",
      },
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
      // 跳转确认框的配置信息
      confirmOptions: {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存",
        cancelButtonText: "不保存",
      },
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
  methods: {
    addService() {
      console.log("接口设计--添加服务");
      // this.$emit("addService")
    },
    search() {
      this.getD4bServiceList();
    },
    async showServInfo(e) {
      console.log("showServInfo", e);
      const params = {
        apiId: e.svcId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        dsgnFlg: "0",
        // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
      };
      let res = await this.rpc.d4.getServiceDesignDetail(params);
      console.log("");
      this.$emit("showServInfo", res);
    },
    handleTabsClick(e) {
      console.log(e);
      if (e.name == "D4b服务") {
      } else if (e.name == "自有服务") {
      }
    },
    imgClick(e) {
      const item = { data: { actionOwnId: e.cpntId } };
      this.$emit("imgClick", item);
    },
    //初始化
    init() {
      this.orderId = this.$route.query.orderId;
      this.jobNo = this.$route.query.jobId;
      this.fnctCd = this.$route.query.fnctId;
      this.beltLine = this.$route.query.beltLine;
      this.authId = this.$route.query.authAstFnctInfoId;
      this.modelName = this.$route.query.modelName;
      this.authAstFnctInfoId = this.$route.query.authAstFnctInfoId;
    },
    async getD4bServiceList() {
      // 上后端设计
      if (this.detailType == "download" || this.detailType == "upload") {
        const params = {
          authId: this.authId,
          fnctCd: this.fnctCd,
          jobNo: this.jobNo,
          svcNm: this.d4bNm,
        };
        const res = await this.rpc.d4.getFuncServList(params);
        this.d4bSvcList = res.bottomApiInfoList;
        this.d4bOptions = res.bottomApiInfoList.filter(
          (item) => item.dsgnFlg == "1"
        );
        if (this.d4bOptions.length == 0) {
          this.currentD4bObj = {};
          this.currentD4bService = "";
          return;
        }
        this.currentD4bService =
          this.$route.query.apiId || res.bottomApiInfoList[0].svcId;
        this.currentD4bObj = this.d4bOptions.find(
          (item) => item.svcId == this.currentD4bService
        );
        if (!this.currentD4bObj) {
          this.currentD4bObj = res.d4bSvcList[0];
          this.currentD4bService = this.currentD4bObj.svcId;
        }
        this.d4bOptionsChange(false);
      } else {
        //模块授权
        const params = {
          authAppDtlId: this.fnctId,
          qryCntnt: this.d4bNm,
          funcCd: this.fnctCd,
        };
        //工作台授权
        const data = {
          authAppDtlId: this.authAppDtlId,
          qryCntnt: this.d4bNm,
        };
        const api =
          this.detailType == "workbench"
            ? "getModD4bServiceList"
            : "getFnctD4bServiceList";
        const res = await this.rpc.d4[api](
          this.detailType == "workbench" ? data : params
        );
        this.d4bOptions = res.d4bSvcList.filter((item) => item.dsgnFlg == "1");
        if (this.d4bOptions.length == 0) {
          this.currentD4bObj = {};
          this.currentD4bService = "";
          return;
        }
        this.currentD4bService =
          this.$route.query.apiId || res.d4bSvcList[0].svcId;
        this.currentD4bObj = this.d4bOptions.find(
          (item) => item.svcId == this.currentD4bService
        );
        if (!this.currentD4bObj) {
          this.currentD4bObj = res.d4bSvcList[0];
          this.currentD4bService = this.currentD4bObj.svcId;
        }
        this.d4bOptionsChange(false);
      }
    },
    // D4b下拉选择框变更
    d4bOptionsChange(e) {
      if (e) return;
      this.currentD4bObj =
        this.d4bOptions.find((item) => item.svcId == this.currentD4bService) ||
        {};
      // this.getD4bRelatedServiceList();
      this.servId = this.currentD4bObj.svcId;
      console.log("d4bOptionsChange", this.currentD4bObj);
      this.$emit("d4bOptionsChange", this.currentD4bObj);
      // this.currentD4bService = e
    },
    async getD4bRelatedServiceList() {
      const params = {
        fnctId: this.fnctId,
        svcId: this.currentD4bObj.svcId,
        svcStsCd: this.currentD4bObj.svcRlsFlg,
        dsgnFlg: this.currentD4bObj.dsgnFlg,
      };
      const res = await this.rpc.d4.getD4bRelatedServiceList(params);
      this.relatedServiceList = res.apiList;
    },
    //鼠标按下的时候触发
    pickOne(i, ev, type) {
      console.log(i, ev);
      if (type == "baseCpn") {
        // if (this.pageMode == "read") return;
        // if (this.saveDisabled) return;
        // if (i.type == "loopAction" && !this.currentServObj?.puApiParams?.some((item) => item.paramDirection == 0 && ["List"].includes(item.paramType))) {
        //   return this.$message.error("当前交易的输入参数中缺少List类型参数，无法使用循环组件")
        // }
        // 判断是否存在重名
        const _item = JSON.parse(JSON.stringify(i));
        const dataList = this.getDataList();
        const list = dataList.filter(
          (dataListItem) =>
            dataListItem.actionName == i.cpntNm &&
            dataListItem.actionType == i.type
        );
        if (list.length > 0) {
          console.log("_item", i);
          const num =
            dataList.filter((dataListItem) => dataListItem.actionType == i.type)
              .length + 1;
          _item.conf.find(
            (e) => e.name == "actionDesc"
          ).value = `${_item.cpntNm}${num}`;
        }
        this.$emit("pickElemEvent", { ev, item: _item });
      } else {
        res = this.sysTrans(i);
        this.$emit("pickElemEvent", { ev, item: res });
      }
    },
    initData() {
      const aaNameList = unduplicated(this.cpntList, "aaName");
      aaNameList.forEach((item) => {
        this.data.push({ name: item.aaName, list: [] });
      });
      this.data.forEach((i) => {
        this.cpntList.forEach((item, index) => {
          if (i.name == item.aaName) {
            i.list.push({ name: item.grpgNm, list: [] });
          }
        });
        i.list = unduplicated(i.list, "name");
      });
      this.data.forEach((i) => {
        this.cpntList.forEach((item, index) => {
          if (i.name == item.aaName) {
            i.list.forEach((j) => {
              if (j.name == item.grpgNm) {
                j.list.push(item);
              }
            });
          }
        });
      });
    },
    // 组件结构改造
    sysTrans(e) {
      console.log("sysTrans", e);
      const obj = {
        D4b服务: "D4bAction",
        D5自有服务: "D5SelfAction",
        D5直连服务: "D5LinkAction",
      };
      const res = {
        cpntId: e.svcId,
        cpntNm: e.svcNm,
        id: "executeFlowAction",
        paramList: [],
        referId: "executeFlowAction",
        // type: "D4bAction",
        type: obj[e.svcTpCd],
        icon: "el-icon-plus",
        color: "$theme_color",
        conf: [
          // ...e.conf,
          {
            name: "actionDesc",
            value: e.svcNm,
          },
          {
            name: "svcId",
            value: e.svcId,
          },
          {
            name: "svcNo",
            value: e.svcNo,
          },
          {
            name: "svcTpCd",
            value: e.svcTpCd,
          },
          {
            name: "sysNm",
            value: e.sysNm,
          },
          {
            name: "actionSeq",
            value: "",
          },
          {
            name: "actionFrntSeq",
            value: "",
          },
          {
            name: "actionPostSeq",
            value: "",
          },
        ],
        paramList: e.paramList || [],
      };
      return res;
    },
    // 双击左侧菜单标题栏时触发
    handleDblclick(i) {
      if (this.elemItemStatus[i].isFixed) return;
      this.elemItemStatus.forEach((item, index) => {
        if (index == i) {
          if (!item.isFixed) item.visible = !item.visible;
        } else {
          if (!item.isFixed) item.visible = false;
        }
      });
      // if (index == 0) this.elemItemStatus[0].visible = !this.elemItemStatus[0].visible
      // if (index == 1) this.elemItemStatus[1].visible = !this.elemItemStatus[1].visible
      console.log("handleDblclick", i);
    },
    // 点击固定按钮
    fixedIconClick(i) {
      console.log("fixedIconClick");
      this.$set(
        this.elemItemStatus[i],
        "isFixed",
        !this.elemItemStatus[i].isFixed
      );
      // this.elemItemStatus[i].isFixed = !this.elemItemStatus[i].isFixed
      // this.$forceUpdate
    },
    // 点击查看按钮时触发
    showD2InfoDialog() {
      this.$emit("showD2InfoDialog");
    },
    // 点击删除按钮时触发
    handleDelete() {
      this.$confirm("确认删除此服务？")
        .then(() => {
          console.log("确定");
        })
        .catch(() => {
          console.log("取消");
        });
    },
    handleservClick(tab, e) {
      if (this.$parent.hasChangeProcess) {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            this.$emit("toSave", false);
            this.servClick(tab, e);
          })
          .catch(() => {
            this.servClick(tab, e);
          });
      } else {
        this.servClick(tab, e);
      }
    },
    servClick(tab, e) {
      if (tab == "功能视图") {
        console.log("功能视图点击", e, this.currentD4bService);
        this.currentD4bService = e.svcId;
        this.d4bOptionsChange(false);
      } else {
        console.log("结构视图点击", e);
        this.currentRelatedServiceObj = e;
        this.$emit("servClick", e);
      }
    },
    // 获取菜单项展开后的最大高度
    getElemItemMaxHeight(i) {
      return this.elemItemStatus[i].maxHeight;
      // const visibleCount = this.elemItemStatus.reduce((prev, item) => {
      //   return item.visible ? prev + 1 : prev;
      // }, 0);

      // if (this.elemItemStatus[i].visible) {
      //   return visibleCount == 1
      //     ? `calc(${100 / visibleCount}% - ${
      //         (this.elemItemStatus.length - 1) * 50
      //       }px)`
      //     : `${100 / visibleCount}%`;
      // } else {
      //   return "50px";
      // }
    },
    // 获取菜单项展开后的最小高度
    getElemItemMinHeight(i) {
      return this.elemItemStatus[i].minHeight;
    },
    // 切换视图模式
    changeViewMode() {
      console.log("changeViewMode");
      this.elemItemStatus[1].viewMode =
        this.elemItemStatus[1].viewMode == "detail" ? "list" : "detail";
    },
    showRuleInfo() {
      console.log("showRuleInfo");
    },
    handleDataView() {
      this.$emit("handleDataView", true, "数据视图列表");
    },
    async getInterfaceList() {
      // if (!this.currentD4bObj.svcId) return
      const params = {
        pageFlg: "0", //分页标志：0-不分页；1-分页
        jobNo: this.jobNo, //作业号
        fnctCd: this.fnctCd, //功能编号   FM-ZC-2023-000663
        beltLine: this.beltLine, //业务域   FM-YWY-2022-000001
        authId: this.authAstFnctInfoId, //授权编号  FM-AFJI-2023041100001273
      };
      const params1 = {
        jobNo: this.jobNo,
        fnctId: this.$route.query.fnctId || '',
        beltLine: this.beltLine,
        authId: this.authAstFnctInfoId,
        currentPage:"1",
        turnPageShowNum:"99999"
      }
      const res = await this.rpc.newEditor.getInterfaceList(params);
      const res1 = await this.rpc.changeList.queryAssetTranChangeList(params1);
      if (res.apiInfoList?.length > 0) {
        this.apiInfoList = res.apiInfoList.map((item) =>{
          item.apiName = item.svcNm;
          item.apiId = item.svcId;
          item.addState = item.svcSts;
          let sameItem = res1?.assetTranChangeList?.length > 0 && res1.assetTranChangeList.find(findItem =>findItem.svcId == item.svcId)
          if(sameItem) item.changeTp = sameItem.changeTp
          else item.changeTp = ""
          return item
        })
        this.currentObj = res.apiInfoList[0];
        this.interfaceClick(this.currentObj);
      }
    },
    interfaceClick(item) {
      this.currentObj = item;
      this.$emit("interfaceClick", item);
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
.aop_tradecode_comps_d4design_process_elem {
  // max-width: 240px;
  // max-width: 290px;
  user-select: none;
  .elem_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 44px;
    padding: 0 16px;
    box-shadow: 0 1px 0.5px 0 #e7e7ee;
    max-width: 192px;
    &.top_shadow {
      box-shadow: 0 -1px 0.5px 0 #e7e7ee;
    }
    ::v-deep .el-button {
      @include mini_button_common;
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
    }
  }
}
</style>
