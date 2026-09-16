<template>
  <div class="aop_tradedesign_comps_dictionary_process_elem">
    <div class="elem_box">
      <div
        class="elem_item"
        :class="{ hidden: !elemItemStatus[0].visible }"
        :style="{
          maxHeight: getElemItemMaxHeight(0),
          minHeight: getElemItemMinHeight(0),
        }"
      >
        <!-- <div class="elem_item_title tabs" @dblclick="handleDblclick('0')">
          <el-tabs v-model="defaultActive" @tab-click="tabClick">
            <el-tab-pane label="服务列表" name="服务列表"></el-tab-pane>
            <el-tab-pane label="数据集" name="数据集"></el-tab-pane>
          </el-tabs>
          <div class="icon_area" v-if="elemItemStatus[0].visible">
            <el-tooltip
              @click.native="fixedIconClick('0')"
              class="item"
              effect="dark"
              :content="elemItemStatus[0].isFixed ? '取消固定' : '固定'"
              placement="top"
            >
              <img
                :src="
                  elemItemStatus[0].isFixed
                    ? elemItemStatus[0].fixedOnUrl
                    : elemItemStatus[0].fixedOffUrl
                "
              />
            </el-tooltip>
          </div>
        </div>-->
        <transition name="fade">
          <template v-if="defaultActive == '服务列表'">
            <div class="elem_item_content">
              <div class="title">服务列表</div>
              <div class="elem_search flex">
                <el-input
                  v-model="d4bNm"
                  clearable
                  placeholder="输入名称"
                  size="small"
                  class="elem_search_sel"
                  @keyup.enter.native="search"
                >
                  <i class="el-icon-search" slot="prefix" @click="search"></i>
                </el-input>
              </div>
              <div class="service_list_content">
                <div class="content" v-if="d4bSvcList.length > 0">
                  <div
                    class="list_item"
                    :class="{ active: currentD4bObj.apiId == item.apiId }"
                    v-for="item in d4bSvcList"
                    :key="item.apiId"
                    @click="d4bServClick(item)"
                  >
                    <div class="text_area">
                      <span class="list_item_tag new">新增</span>
                      <!-- <span v-if="item.apiState == 1" class="list_item_tag released">已入库</span>
                      <span v-if="item.apiState == 2" class="list_item_tag released">变更</span> -->
                      <!-- <el-tooltip effect="dark" :content="item.apiName" placement="top"> -->
                        <span class="list_item_title">{{ item.apiName }}</span>
                      <!-- </el-tooltip> -->
                    </div>
                    <div class="icon_area">
                      <!-- <el-tooltip effect="dark" :content="'服务确认'" placement="top"> -->
                        <!-- <i
                          class="el-icon-document-checked"
                          :class="{ active: currentD4bObj.apiId == item.apiId }"
                          @click.stop="serviceConfirm(item)"
                        ></i> -->
                        <!-- <span class="confirm_text" :class="{ active: currentD4bObj.apiId == item.apiId }">服务确认</span> -->
                        <el-button type="primary" class="confirm_text" @click.stop="serviceConfirm(item)">服务确认</el-button>
                      <!-- </el-tooltip> -->
                    </div>
                  </div>
                </div>
                <div v-else class="no_data">
                  <span>暂无数据</span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="defaultActive == '服务列表11'">
            <div class="elem_item_content" v-show="elemItemStatus[0].visible">
              <div class="elem_search flex">
                <el-input
                  v-model="d4bNm"
                  clearable
                  placeholder="输入名称"
                  size="small"
                  class="elem_search_sel"
                  @keyup.enter.native="search"
                >
                  <i class="el-icon-search" slot="prefix" @click="search"></i>
                </el-input>
                <!-- <span
                  v-if="!noEdit"
                  class="add_icon"
                  :class="{ hidden: defaultActive !== '服务列表' }"
                  @click="showCreateDialog"
                >
                  <i class="el-icon-plus"></i>
                </span>-->
              </div>

              <ul class="service_menu_list">
                <li
                  class="list_item"
                  :class="{ active: currentD4bObj.l5SvcId == item.l5SvcId }"
                  v-for="item in d4bSvcList"
                  :key="item.l5SvcId"
                  @click="d4bServClick(item)"
                >
                  <div class="text_area">
                    <!-- <span
                      class="list_item_tag design"
                      :class="{hidden: item.dsgnFlg == 0}">新增
                    </span>-->
                    <!-- <span v-if="item.dsgnFlg == 1" class="list_item_tag new"
                      >新增
                    </span>
                    <span
                      v-if="item.dsgnFlg == 0 && item.svcRlsFlg == 1"
                      class="list_item_tag released"
                      >已登记</span
                    >-->
                    <span v-if="item.statusCd == 0" class="list_item_tag new">新增</span>
                    <span v-if="item.statusCd == 1" class="list_item_tag released">已入库</span>
                    <span v-if="item.statusCd == 2" class="list_item_tag released">变更</span>
                    <span class="list_item_title">{{ item.l5SvcNm }}</span>
                    <!-- <span
                      v-if="item.dsgnFlg == 1 && item.svcRlsFlg == 1"
                      class="list_item_tag released"
                      >已登记</span
                    >
                    <span v-if="item.svcRlsFlg == 0" class="list_item_tag new">new</span>
                    <span
                      v-if="item.inOutFlg == 1"
                      class="list_item_tag outside"
                      >外</span
                    >
                    <span v-else class="list_item_tag inside">内</span>-->
                  </div>
                  <div class="icon_area">
                    <el-tooltip effect="dark" :content="'服务确认'" placement="top">
                      <i class="el-icon-edit" @click.stop="handleEdit(item)"></i>
                    </el-tooltip>
                    <!-- <el-tooltip effect="dark" :content="'删除'" placement="top">
                      <i
                        class="el-icon-delete list_item_icon delete"
                        @click.stop="handleDelete(item)"
                      ></i>
                    </el-tooltip>-->
                  </div>
                  <!-- <div class="version">
                    <span @click.stop="serviceConfirm(item)" class="text">服务确认</span>
                  </div>-->
                </li>
              </ul>
            </div>
          </template>
          <template v-if="defaultActive == '需求列表'">
            <div class="elem_item_content" v-show="elemItemStatus[0].visible">
              <div class="elem_search flex">
                <el-input
                  v-model="r4bNm"
                  clearable
                  placeholder="输入名称或编号"
                  size="small"
                  class="elem_search_sel"
                  @keyup.enter.native="search('r4b')"
                >
                  <i class="el-icon-search" slot="prefix" @click="search('r4b')"></i>
                </el-input>
              </div>

              <ul class="service_menu_list">
                <li
                  class="list_item"
                  :class="{ active: currentR4bObj.svcId == item.svcId }"
                  v-for="item in r4bSvcList"
                  :key="item.svcId"
                  @click="r4bServClick(item)"
                >
                  <div class="text_area">
                    <span v-if="item.bindFlg == 1" class="list_item_tag released">已实现</span>
                    <span class="list_item_tag danger" v-else>未实现</span>
                    <span class="list_item_title r4b">{{ item.svcNm }}</span>
                  </div>
                  <div class="icon_area" v-if="!noEdit">
                    <el-tooltip
                      v-if="item.bindFlg == 0"
                      effect="dark"
                      :content="'关联'"
                      placement="top"
                    >
                      <i
                        class="el-icon-connection list_item_icon delete"
                        @click.stop="connect(item)"
                      ></i>
                    </el-tooltip>
                    <el-tooltip v-else effect="dark" :content="'取消关联'" placement="top">
                      <i
                        class="el-icon-link list_item_icon delete"
                        @click.stop="cancelConnect(item)"
                      ></i>
                    </el-tooltip>
                  </div>
                  <!-- <span class="list_item_tag delete" @click.stop="connect">关联</span>
                  <span class="list_item_tag delete" @click.stop="cancelConnect">取消关联</span>-->
                </li>
              </ul>
            </div>
          </template>
          <template v-if="defaultActive == '数据集'">
            <div class="elem_item_content" v-show="elemItemStatus[0].visible">
              <div class="elem_search flex">
                <el-input
                  v-model="dataNm"
                  clearable
                  placeholder="输入名称"
                  size="small"
                  class="elem_search_sel"
                  @keyup.enter.native="search('dataNm')"
                >
                  <i class="el-icon-search" slot="prefix" @click="search('dataNm')"></i>
                </el-input>
              </div>
              <div class="table_list">
                <el-tree
                  :data="menuDatasetList"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                  :default-expanded-keys="defaultExpandedKeys"
                  :current-node-key="currentNodeKey"
                  node-key="dataSetNo"
                  ref="menuDatasetRef"
                  class="siderbar_menu"
                >
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div class="left">
                      <div class="status" v-if="node.level !== 1">
                        <el-tag
                          :type="data.statusCd == '0' ? 'danger' : data.statusCd =='1'? 'success': 'info'"
                        >{{ data.statusCd == "0" ? "新增" : data.statusCd == '1'? "已入库": "变更" }}</el-tag>
                      </div>
                      <div
                        class="tree_label"
                        :title="node.label"
                        :class="{
                          active: currentDatasetObj.dataSetNo == data.dataSetNo,
                        }"
                      >{{ `${node.label}` }}</div>
                      <span v-if="node.level == 1">
                        {{
                        `（${data.number}）`
                        }}
                      </span>
                    </div>
                    <div class="right">
                      <span v-if="node.level == 1" class="op">
                        <!-- <i
                          class="el-icon-plus"
                          @click.stop="treeClick('addData',node, data)"
                        ></i>-->
                      </span>
                      <!-- <span v-else class="op">
                        <i
                          class="el-icon-edit"
                          @click.stop="treeClick('editData',node, data)"
                        ></i>
                        <i
                          class="el-icon-delete"
                          @click.stop="treeClick('deleteData',node, data)"
                        ></i>
                      </span>-->
                    </div>
                  </div>
                </el-tree>
              </div>
            </div>
          </template>
        </transition>
      </div>
    </div>

    <!-- 关联D4b服务弹窗 -->
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="'关联D4b服务'"
      :dialogVisiable="connectVisible"
      @closeDialog="closeDialog"
      class="d2Info_dialog"
    >
      <div slot="box">
        <div class="info_container_fr">
          <Table
            ref="tableRef"
            class="table"
            :data="d4bSvcList"
            :table="tableColumn"
            :radioModel="currentRadio"
            @operate="operate"
            @radioChange="radioChange"
          ></Table>

          <!-- 分页器 -->
          <PagePagination
            class="pn_style"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          ></PagePagination>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="connectConfirm">确认关联</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import SearchTop from "@m/core/components/page_search_top"; // 头部搜索栏
import Table from "@m/core/components/page_table";

import { unduplicated } from "@m/utils/array";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  name: "elem",
  components: {
    PageDialog,
    SearchTop,
    Table
  },
  props: {
    dataObj: {
      type: Object,
      default: () => ({})
    },
    currentD4bObj: {
      type: Object,
      default: () => ({})
    },
    currentR4bObj: {
      type: Object,
      default: () => ({})
    },
    fnctInfo: {
      type: Object,
      default: () => ({})
    },
    d4bSvcList: {
      type: Array,
      default: () => []
    },
    r4bSvcList: {
      type: Array,
      default: () => []
    },
    fnctId: {
      type: String,
      default: () => ""
    },
    pageMode: {
      type: String,
      default: () => ""
    },
    detailType: {
      type: String,
      default: () => ""
    },
    workInfo: {
      type: Object,
      default: () => ({})
    },
    currentDatasetObj: {
      type: Object,
      default: () => ({})
    },
    fnctCd: {
      type: String,
      default: () => ""
    },
    authId: {
      type: String,
      default: () => ""
    },
    admiId: {
      type: String,
      default: () => ""
    },
    isolateWorkspace: {
      type: String,
      default: () => ""
    },
    competitorId: {
      type: String,
      default: () => ""
    },
    bizLineId: {
      type: String,
      default: () => ""
    },
    jobId: {
      type: String,
      default: () => ""
    },
  },
  data() {
    return {
      data: [],
      //服务组件数据列表
      cpntList: [],
      //基础服务组件数据列表
      toolsList: [
        {
          cpntId: "",
          cpntNm: "创建组件",
          id: "newAction",
          paramList: [],
          referId: "newAction",
          type: "newAction",
          icon: "el-icon-plus",
          color: "$theme_color",
          conf: [
            {
              name: "actionDesc",
              value: "创建组件"
            }
          ]
        },
        {
          cpntId: "",
          cpntNm: "开始",
          id: "startAction",
          paramList: [],
          referId: "startAction",
          type: "startAction",
          icon: "el-icon-cloudy",
          conf: [
            {
              name: "actionDesc",
              value: "开始"
            }
          ]
        },
        {
          cpntId: "",
          cpntNm: "结束",
          id: "endAction",
          paramList: [],
          referId: "endAction",
          type: "endAction",
          icon: "el-icon-cloudy",
          conf: [
            {
              name: "actionDesc",
              value: "结束"
            }
          ]
        }
      ],
      // 服务组件名称搜索
      cpntNm: "",
      // d4b服务名称搜索
      d4bNm: "",
      // r4b服务名称搜索
      r4bNm: "",
      // 所属应用下拉框
      appList: [],
      // 所属应用id
      aaId: "",
      defaultActive: "服务列表",
      // 控制菜单状态的数组
      elemItemStatus: [
        {
          visible: true,
          isFixed: true,
          fixedOnUrl: require("@m/assets/images/icon_fixed_on.png"),
          fixedOffUrl: require("@m/assets/images/icon_fixed_off.png"),
          maxHeight: "55%",
          minHeight: "55%"
        },
        {
          visible: true,
          isFixed: true,
          fixedOnUrl: require("@m/assets/images/icon_fixed_on.png"),
          fixedOffUrl: require("@m/assets/images/icon_fixed_off.png"),
          maxHeight: "45%",
          minHeight: "45%"
        }
      ],
      connectVisible: false,
      //头部搜索
      searchForm: [
        {
          type: "input",
          model: "apiName",
          placeholder: "搜索服务名称",
          style: {
            width: "400px"
          }
        }
      ],
      // 搜索条件
      form: {
        apiName: "" // 名称
      },
      d4bApiList: [],
      // 列表参数
      tableColumn: [
        {
          prop: "svcId",
          width: "45",
          type: "radio",
          tooltip: false
        },
        {
          prop: "svcId",
          label: "D4b服务ID",
          minWidth: "20%",
          type: "text",
          tooltip: true
        },
        {
          prop: "svcNm",
          label: "D4b服务名称",
          minWidth: "20%",
          type: "text",
          tooltip: true
        }
        // {
        //   prop: "apiDesc",
        //   label: "D4b服务描述",
        //   minWidth: "25%",
        //   type: "text",
        //   tooltip: true,
        // },
        // {
        //   prop: "apiGroupName",
        //   label: "D4b服务分组",
        //   minWidth: "25%",
        //   type: "text",
        //   tooltip: true,
        // },
        // {
        //   prop: "apiState",
        //   label: "服务状态",
        //   width: "90",
        //   filter: "cpnStusCd",
        //   type: "textClassList",
        //   align: "center",
        //   textClassList: [
        //     { class: "unpublish status", val: "01" },
        //     { class: "publishing status", val: "02" },
        //     { class: "unchecked status", val: "03" },
        //     { class: "finished status", val: "04" },
        //   ],
        // },
      ],
      // 分页器参数
      pager: { currentPage: "1", turnPageShowNum: "10", total: 0 },
      currentRadio: "",
      currentD4bSvcId: "",
      // currentR4bObj: {},
      timer: "",
      isEdit: false,
      dataNm: "",
      menuDatasetList: [
        {
          dataSetNo: "1",
          dataSetNm: "测试1",
          number: "2",
          children: [
            {
              dataSetNo: "FM-SJJ-111025",
              dataSetNm: "测试2",
              status: "1"
            },
            {
              dataSetNo: "FM-SJJ-110731",
              dataSetNm: "产品数据集8",
              status: "0"
            }
          ]
        }
      ],
      currentKey: "",
      defaultExpanded: "",
      defaultProps: {
        label: "dataSetNm",
        children: "dataSetList"
      },
      defaultExpandedKeys: [],
      currentNodeKey: ""
    };
  },
  computed: {
    noEdit() {
      return this.pageMode == "read";
    }
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      console.log("detailType", this.detailType);
      // this.getData();
      // this.getApp();getFunctionInfog
      // this.getD4bServiceList();
      // this.getFunctionInfo();
    },
    operate(operation, data) {},
    dialogSearch() {
      Object.assign(this.searchForm, this.form);
      this.pager.currentPage = "1";
      this.getD4bServiceSelectList();
    },
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum + "";
      this.getD4bServiceSelectList();
    },
    handleCurrentChange() {
      this.getD4bServiceSelectList();
    },
    connect(e) {
      console.log(e);
      this.connectVisible = true;
      this.currentR4bObj = e;
      this.getD4bServiceSelectList();
    },
    async getD4bServiceSelectList() {
      // const params = {
      //   apiName: this.searchForm.apiName,
      //   apiServiceType: "D4b服务",
      //   bkId: "69573898205943214251",
      //   currentPage: "1",
      //   turnPageShowNum: "10",
      // }
      // console.log(res)
      // const res = await this.rpc.public.getApiManageList(params)
      // this.d4bApiList = res.apiList
    },
    radioChange(e) {
      console.log(e);
      this.currentRadio = e;
    },
    async connectConfirm() {
      if (!this.currentRadio)
        return this.$message.error("请选择对应的服务进行关联");
      const params = {
        d4ServId: this.currentRadio,
        r4ServId: this.currentR4bObj.svcId,
        fnctId: this.fnctId
      };
      const res = await this.rpc.d4.associateD4bWithR4b(params);
      this.$notify({
        title: "成功",
        message: "关联成功",
        duration: 2000,
        type: "success"
      });
      this.$emit("getR4bServiceList");
      this.closeDialog();
    },
    cancelConnect(e) {
      console.log(e);
      this.$confirm("请确认是否要取消关联").then(async () => {
        const params = {
          // d4bSvcId: this.currentRadio,
          r4ServId: e.svcId,
          fnctId: this.fnctId
        };
        const res = await this.rpc.d4.disassociateD4bWithR4b(params);
        // const res = await this.rpc.d4.disassociateFunctionWithD4bService(params)
        this.$notify({
          title: "成功",
          message: "取消关联成功",
          duration: 2000,
          type: "success"
        });
        this.$emit("getR4bServiceList");
        this.closeDialog();
      });
    },
    closeDialog() {
      this.connectVisible = false;
      this.currentR4bObj = {};
      this.currentRadio = "";
    },
    // 功能详情查询
    async getFunctionInfo() {
      const parmas = {
        fnctId: this.fnctId
      };
      const res = await this.rpc.d4.getFunctionInfo(parmas);
      this.fnctInfo = res;
    },
    async getD4bServiceList() {
      this.$emit("getD4bServiceList");
    },
    //鼠标按下的时候触发
    pickOne(i, ev) {
      res = this.sysTrans(i);
      this.$emit("pickElemEvent", { ev, item: res });
    },
    search(e) {
      console.log(this.d4bSvcList);
      if (e == "r4b") {
        this.$emit("getR4bServiceList", this.r4bNm);
        // this.getR4bServiceList()
      } else if (e == "dataNm") {
        this.getDataSetList();
        // this.$emit("getDataSetList", this.dataNm);
      } else {
        // console.log(this.d4bNm);
        this.$emit("getD4bServiceList", this.d4bNm);
        // this.getData();
      }
    },
    d4bServClick(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.currentD4bSvcId = e.apiId;
        this.$emit("d4bServClick", e);
      }, 300);
    },
    r4bServClick(e) {
      this.currentR4bObj = e;
      this.$emit("r4bServClick", e);
    },
    //获取全部组件列表数据
    async getData() {
      const params = {
        aaId: this.aaId,
        cpntNm: this.cpntNm
      };
      const { cpntList } = await this.rpc.cpn.getServiceCpnData(params);
      this.cpntList = cpntList;
      console.log("cpntList", this.cpntList);
      if (this.cpntList.length > 0) {
        this.data = [];
        this.initData();
      } else {
        this.data = [];
      }
    },
    initData() {
      const aaNameList = unduplicated(this.cpntList, "aaName");
      aaNameList.forEach(item => {
        this.data.push({ name: item.aaName, list: [] });
      });
      this.data.forEach(i => {
        this.cpntList.forEach((item, index) => {
          if (i.name == item.aaName) {
            i.list.push({ name: item.grpgNm, list: [] });
          }
        });
        i.list = unduplicated(i.list, "name");
      });
      this.data.forEach(i => {
        this.cpntList.forEach((item, index) => {
          if (i.name == item.aaName) {
            i.list.forEach(j => {
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
      const res = {
        cpntId: e.cpntId,
        cpntNm: e.cpntNm,
        id: "executeFlowAction",
        paramList: [],
        referId: "executeFlowAction",
        type: "executeFlowAction",
        icon: "el-icon-plus",
        color: "$theme_color",
        conf: [
          ...e.conf,
          {
            name: "actionDesc",
            value: e.cpntNm
          }
        ],
        paramList: e.paramList
      };
      return res;
    },
    //获取所属应用数据
    async getApp() {
      const res = await this.rpc.cpn.getApplyList();
      this.appList = res.appList;
    },
    // 显示创建D4b服务对话框
    showCreateDialog() {
      this.$emit("showCreateDialog");
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
    handleDelete(e) {
      this.$confirm("确认删除此服务？").then(async () => {
        console.log(e);
        const params = {
          fnctId: this.fnctId,
          svcId: e.svcId
        };
        const res = await this.rpc.d4.disassociateFunctionWithD4bService(
          params
        );
        this.$notify({
          title: "成功",
          message: "取消关联成功",
          duration: 2000,
          type: "success"
        });
        this.getD4bServiceList();
      });
    },
    // 点击编辑按钮时触发
    handleEdit(e) {
      this.defaultActive = "服务列表";
      this.isEdit = !this.isEdit;
      this.$emit("handleEdit", e, this.isEdit);
    },
    // 获取菜单项展开后的最大高度
    getElemItemMaxHeight(i) {
      if (this.elemItemStatus[i].maxHeight) {
        return this.elemItemStatus[i].maxHeight;
      } else {
        const visibleCount = this.elemItemStatus.reduce((prev, item) => {
          return item.visible ? prev + 1 : prev;
        }, 0);

        if (this.elemItemStatus[i].visible) {
          return visibleCount == 1
            ? `calc(${100 / visibleCount}% - ${(this.elemItemStatus.length -
                1) *
                50}px)`
            : `${100 / visibleCount}%`;
        } else {
          return "50px";
        }
      }
    },
    // 获取菜单项展开后的最小高度
    getElemItemMinHeight(i) {
      return this.elemItemStatus[i].minHeight;
    },
    tabClick(e) {
      if (e.name == "数据集") {
        this.getDataSetList();
      }
      this.$emit("elemTabClick", e.name);
    },
    loadNode() {},
    handleExpandClick() {},
    handleNodeClick(node, data) {
      console.log("aaa");
      this.$emit("handleDataSet", node, data);
    },
    treeClick(type, node, data) {
      // console.log(type,data);
      this.$emit("treeClick", type, node, data);
    },
    async getDataSetList() {
      const params = {
        dataSetNm: this.dataNm || "",
        fnctCd: this.fnctCd,
        authCd: this.authId
      };
      const res = await this.rpc.dicmgmtDefine.getDataSetList(params);
      if (res.classificationList.length > 0) {
        res.classificationList.map(itemClassf => {
          itemClassf.dataSetNm = itemClassf.classification;
          itemClassf.dataSetNo = itemClassf.classificationId;
          itemClassf.number = itemClassf.dataSetList.length;
        });
        this.menuDatasetList = res.classificationList;
        this.defaultExpandedKeys.push(
          this.menuDatasetList[0].dataSetList[0].dataSetNo
        );
        console.log(this.menuDatasetList[0], "this.menuDatasetList[0]");
        this.currentNodeKey = this.menuDatasetList[0].dataSetList[0].dataSetNo;
        this.$refs.menuDatasetRef.getCurrentKey(
          this.menuDatasetList[0].dataSetList[0].dataSetNo
        );
        console.log(this.currentNodeKey, "this.currentNodeKey");
      } else {
        this.menuDatasetList = [];
      }
    },
    serviceConfirm(data) {
      // console.log("serviceConfirm",data);
      this.$emit("serviceConfirm", data);
    }
  },
  filters: {
    ...filters
  },
  watch: {
    defaultExpandedKeys(val) {
      if (val) {
        this.$nextTick(() => {
          document
            .querySelector(".el-tree-node__children .el-tree-node__content")
            .click();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dictionary_process_elem {
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
        width: 100%;
        border-bottom: 2px solid #dcdfe6;
        user-select: none;
        // ::v-deep .el-tabs__active-bar {
        //   width: 50px !important;
        // }
        box-shadow: 0 1px 10px 0 #e7e7e7;
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
            &.is-active {
              font-weight: $font_weight_600;
            }
          }
        }
        ::v-deep .el-tabs__content {
          display: none;
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
      }
    }
    .elem_item_content {
      @include scrollbar;
      height: calc(100% - 50px);
      overflow-y: auto;
      transition-duration: 0.5s;
      // padding: 8px 10px;
      min-height: 200px;
      .title {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #111111;
        letter-spacing: 0;
        padding: 16px;
      }
      .elem_search {
        padding: 8px 10px;
        overflow: hidden;
        &.flex {
          display: flex;
          justify-content: center;
          align-items: center;
          .add_icon {
            margin-left: 5px;
            cursor: pointer;
            .el-icon-plus {
              color: $theme_color;
              font-weight: $font_weight_600;
              font-size: 28px;
            }
            &.hidden {
              visibility: hidden;
            }
          }
        }
      }
      .elem_search_sel {
        float: left;
        ::v-deep .el-input__inner {
          width: 210px;
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
      .service_menu_list {
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
          padding: 4px 6px;
          &:hover,
          &.active {
            background: #eaf1ff;
            .text_area .list_item_title {
              color: $theme_color;
              font-weight: 600;
            }
          }
          .text_area {
            display: flex;
            .icon {
              margin-right: 4px;
            }
            .list_item_title {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              // padding: 0 10px;
              max-width: 120px;
              height: 20px;
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
              &.danger {
                color: #fe6f79;
                background: #ffeaec;
                font-weight: 600;
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
        .version {
          margin-right: 10px;
          .text {
            color: $theme_color;
          }
        }
      }
      .service_list_content {
        // margin-top: 8px;
        .content {
          padding: 4px 6px;
        }
        .list_item {
          font-size: 12px;
          // margin-bottom: 6px;
          // white-space: nowrap;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          cursor: pointer;
          margin-bottom: 6px;
          height: 34px;
          &:hover,
          &.active {
            background: #eaf1ff;
            .text_area .list_item_title {
              color: $theme_color;
              font-weight: 600;
            }
          }
          .text_area {
            display: flex;
            .icon {
              margin-right: 4px;
            }
            .list_item_title {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              // padding: 0 10px;
              max-width: 110px;
              height: 20px;
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
              &.danger {
                color: #fe6f79;
                background: #ffeaec;
                font-weight: 600;
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
            margin-right: 10px;
            ::v-deep .el-tooltip .el-icon-document-checked {
              &.active {
                background: #358aff;
              }
            }
            .el-icon-document-checked{
              color: $theme_color;
            }
            .confirm_text{
              font-size: 12px;
              padding: 3px 4px;
              border-radius: 5px;
              // border: 0.5px solid #358AFF;
              // color: #358AFF;
            }
          }
        }
        .version {
          margin-right: 10px;
          .text {
            color: $theme_color;
          }
        }
        .no_data{
          display: flex;
          justify-content: center;
          align-items: center;
          color: #999;
          margin-top: 30px;
          font-size: 14px;
        }
      }
      .function_info {
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        height: 100%;
        li {
          margin-bottom: 8px;
          font-weight: $font_weight_600;
          &.function_info_button {
            text-align: center;
            margin-top: auto;
          }
          span {
            font-weight: 400;
          }
        }
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
  .logo {
    width: 10%;
  }
  .siderbar_menu {
    /deep/ .el-tree-node {
      padding: 4px 0;
      &:focus {
        > .el-tree-node__content {
          background-color: #f0fbff;
        }
      }
    }
    /deep/ .el-tree-node.is-current {
      > .el-tree-node__content {
        background-color: #f0fbff;
      }
    }
    /deep/ .el-tree-node__content {
      height: 27px;
      position: relative;
      padding-left: 0px !important;
      &:focus {
        background-color: #f0fbff;
      }
      &:active {
        background-color: #f0fbff;
      }
      &:visited {
        background-color: #f0fbff;
      }
      &:hover {
        background-color: #f0fbff;
      }
    }
    /deep/ .el-tag {
      height: 17px;
      line-height: 17px;
    }
    .custom-tree-node {
      display: flex;
      justify-content: space-between;
      width: 220px;
    }
    .tree_label {
      // display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // width: 80%;
      margin-left: 3px;
      &.active {
        background: #eaf1ff;
        color: $theme_color;
        font-weight: 600;
      }
      // flex: 1;
    }
    .left {
      display: flex;
      flex: 1;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    /deep/.el-tag {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
    }
  }
}
</style>