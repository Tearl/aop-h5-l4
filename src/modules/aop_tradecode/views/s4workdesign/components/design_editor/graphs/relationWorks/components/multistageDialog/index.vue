<template>
  <div>
    <div class="m-navbar" v-if="nav || navTwo || navThree"></div>
    <div class="m-navba" id="right" v-if="nav || navTwo || navThree">
      <div class="resize" id="resize"></div>
      <div v-if="nav">
        <div class="m-title">
          {{ flowPathType | flowTypeName }}
          <img
            class="closeDialog"
            src="@m/assets/images/icon_close.png"
            @click="cancel"
          />
        </div>
        <el-tabs
          id="tapId"
          class="tapStyles"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane name="first">
            <span slot="label" :class="{ errorRule: firstError == true }"
              >基本信息
              <i v-if="firstError == true" class="el-icon-warning-outline"></i
            ></span>
            <el-form
              :disabled="action == 'view'"
              ref="valueFlowForm"
              :model="valueFlowData"
              :rules="rules"
            >
              <el-form-item label="ID" v-if="action == 'view'" prop="fnName">
                <el-input v-model="valueFlowData.fnId" />
              </el-form-item>
              <el-form-item label="名称" prop="fnName">
                <el-input
                  maxLength="32"
                  v-model="valueFlowData.fnName"
                  placeholder="请输入名称"
                />
              </el-form-item>
              <el-form-item label="描述" prop="fnDesc">
                <el-input
                  maxLength="500"
                  class="widthInput"
                  type="textarea"
                  v-model="valueFlowData.fnDesc"
                  placeholder="请输入描述"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            v-if="
              flowPathType == '3' || flowPathType == '4' || flowPathType == '5'
            "
            name="second"
          >
            <span slot="label">凭证 </span>
            <el-button
              v-if="action == 'edit'"
              type="primary"
              class="right_button"
              size="medium"
              @click="dialogVisiable = true"
              ><img
                class="iconStyle"
                src="@m/assets/images/icon_select.png"
              />选择</el-button
            >
            <Table
              :table="voucherColumn"
              :data="valueFlowData.vouchers"
              :height="
                action == 'edit' ? 'calc(100vh - 250px)' : 'calc(100vh - 200px)'
              "
              @operate="vouOperate"
            ></Table>
          </el-tab-pane>
          <el-tab-pane v-if="flowPathType == '5'" name="third">
            <span slot="label">参与者 </span>
            <el-button
              v-if="action == 'edit'"
              type="primary"
              class="right_button"
              size="medium"
              @click="dialogVisiable = true"
              ><img
                class="iconStyle"
                src="@m/assets/images/icon_select.png"
              />选择</el-button
            >
            <Table
              :table="columnList"
              :height="
                action == 'edit' ? 'calc(100vh - 250px)' : 'calc(100vh - 200px)'
              "
              :data="valueFlowData.participants"
              @operate="operate"
            ></Table>
          </el-tab-pane>
          <el-tab-pane
            v-if="flowPathType == '4' || flowPathType == '5'"
            name="fourth"
          >
            <span slot="label">业务规则 </span>
            <el-button
              v-if="action == 'edit' && flowPathType == '5'"
              type="primary"
              class="right_button"
              size="medium"
              @click="operateRule('add')"
              ><i class="el-icon-plus"></i>新建规则</el-button
            >
            <Table
              tableType="index"
              :table="flowPathType == '4' ? fourthBusinessRules : businessRules"
              :height="
                action == 'edit' && flowPathType == '5'
                  ? 'calc(100vh - 250px)'
                  : 'calc(100vh - 200px)'
              "
              :data="valueFlowData.rules"
              @operate="operateRule"
            ></Table>
          </el-tab-pane>
          <el-tab-pane
            v-if="
              flowPathType == '3' || flowPathType == '4' || flowPathType == '5'
            "
            name="fifth"
          >
            <span slot="label">业务对象 </span>
            <div class="tableStyle">
              <el-button
                v-if="action == 'edit' && flowPathType == '5'"
                type="primary"
                class="right_button"
                size="medium"
                @click="dialogVisiable = true"
                ><img
                  class="iconStyle"
                  src="@m/assets/images/icon_select.png"
                />选择</el-button
              >
              <el-button
                v-if="action == 'edit' && flowPathType == '5'"
                type="primary"
                class="right_button"
                size="medium"
                @click="pushObjDesign()"
                ><img
                  class="iconStyle"
                  src="@m/assets/images/icon_whiteLook.png"
                />对象关系设计</el-button
              >
              <el-button
                v-else
                type="primary"
                class="right_button"
                size="medium"
                @click="pushObjDesign('preview')"
                ><img
                  class="iconStyle"
                  src="@m/assets/images/icon_whiteLook.png"
                />查看对象关系</el-button
              >
              <Table
                :table="columnList"
                :data="showObjectlist"
                height="calc(100vh - 320px)"
                @operate="operate"
              ></Table>
              <PagePagination
                @size-change="paginationChange"
                @current-change="changeShowObject"
                :pager="pager"
              >
              </PagePagination>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="flowPathType != '5'" name="sixth">
            <span slot="label">关联流程 </span>
            <Table
              :table="flowPathList"
              :data="flowList"
              height="
               calc(100vh - 200px)
              "
              @operate="flowPathOperate"
            ></Table>
          </el-tab-pane>
        </el-tabs>
        <div
          v-if="flowPathType == '3' && $parent.nodeSumbit"
          class="aop_client_footer pageFooter"
        >
          <button class="save" @click="confirmNode">节点确认</button>
        </div>
      </div>
      <div v-if="navTwo">
        <div class="m-title">
          泳道（竖向）<img
            class="closeDialog"
            src="@m/assets/images/icon_close.png"
            @click="cancel"
          />
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane name="first">
            <span slot="label" :class="{ errorRule: firstError == true }"
              >基本信息
              <i v-if="firstError == true" class="el-icon-warning-outline"></i
            ></span>
            <el-form
              :disabled="action == 'view'"
              ref="valueFlowForm"
              :model="valueFlowData"
              :rules="rules"
            >
              <el-form-item label="ID" v-if="action == 'view'" prop="fnName">
                <el-input v-model="valueFlowData.fnId" />
              </el-form-item>
              <el-form-item label="名称" prop="fnName">
                <el-input
                  maxLength="32"
                  v-model="valueFlowData.fnName"
                  placeholder="请输入名称"
                />
              </el-form-item>
              <el-form-item label="描述" prop="fnDesc">
                <el-input
                  maxLength="500"
                  class="widthInput"
                  type="textarea"
                  v-model="valueFlowData.fnDesc"
                  placeholder="请输入描述"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="navThree">
        <div class="m-title">
          关系
          <img
            class="closeDialog"
            src="@m/assets/images/icon_close.png"
            @click="cancel"
          />
        </div>
        <el-form ref="valueFlowForm" :model="valueFlowData" class="formStyle">
          <el-form-item label="名称" prop="fnrName">
            <el-input
              maxLength="50"
              v-model="valueFlowData.fnrName"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item label="描述" prop="fnrDesc">
            <el-input
              maxLength="500"
              class="widthInput"
              type="textarea"
              v-model="valueFlowData.fnrDesc"
              placeholder="请输入描述"
            />
          </el-form-item>
          <el-form-item prop="remove">
            <el-checkbox v-model="valueFlowData.remove">是否删除</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <page-footer
        v-if="action == 'edit'"
        class="pageFooter"
        leftbtn="取消"
        rightbtn="确认"
        @handleLeft="cancel"
        @handleRight="sumbit"
      >
      </page-footer>
    </div>
    <SelectDialog
      v-if="dialogVisiable"
      ref="searchSelect"
      :activeName="activeName"
      :dialogVisiable="dialogVisiable"
      :voucherVisiable="voucherVisiable"
      @tabsCanel="dialogVisiable = false"
      @tabsConfirm="selectConfirm"
    ></SelectDialog>
    <EditVoucherDialog
      v-if="voucherVisiable"
      :dialogVisiable="voucherVisiable"
      ref="searchData"
      :action="operateAction"
      :voucherData="vouchers"
      @tabsCanel="voucherVisiable = false"
      @tabsConfirm="tabsConfirm"
    ></EditVoucherDialog>
    <viewObject
      title="对象详情"
      v-model="viewObjectVisible"
      :objectData="objectData"
      v-if="viewObjectVisible"
    >
    </viewObject>
    <addObject
      title="新建对象"
      :targetData="targetData"
      v-model="addObjectVisible"
      v-if="addObjectVisible"
    >
    </addObject>
    <editObject
      title="编辑对象"
      v-model="editObjectVisible"
      :targetData="targetData"
      :objId="objectData.objId"
      v-if="editObjectVisible"
    >
    </editObject>
    <PageDialog
      dialogWidth="600px"
      dialogTitle="新建/编辑业务规则"
      :dialogVisiable="ruleVisiable"
      @closeDialog="ruleVisiable = false"
      :clickModal="false"
    >
      <div slot="box">
        <el-form
          style="margin-top: 12px"
          :disabled="action == 'view'"
          ref="ruleForm"
          :model="flowRules"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="业务规则：" prop="ruleDesc">
            <el-input
              class="widthInput"
              maxLength="500"
              type="textarea"
              v-model="flowRules.ruleDesc"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click.native="ruleVisiable = false">取 消</el-button>
        <el-button type="primary" @click.native="ruleSumbit">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import PageFooter from "./../../../bizWorks/components/detail_tabs/pageFooter";
import Table from "./../../../bizWorks/components/detail_tabs/page_table";
import PagePagination from "@m/core/components/page_pagination";
import viewObject from "@m/core/components/Drawer/viewObject";
import editObject from "@m/core/components/Drawer/editObject";
import addObject from "@m/core/components/Drawer/addObject";
import mixin from "@m/core/mixin";
import SelectDialog from "./selectDialog.vue";
import PageDialog from "./../../../bizWorks/components/detail_tabs/page_dialog";
import EditVoucherDialog from "./editVoucherDialog.vue";
import _ from "lodash";
export default {
  mixins: [mixin],
  inject: ["confirmNodeFn"],
  components: {
    PageFooter,
    Table,
    EditVoucherDialog,
    SelectDialog,
    PagePagination,
    viewObject,
    editObject,
    addObject,
    PageDialog,
    // Vditor
  },
  data() {
    return {
      nav: false,
      navTwo: false,
      navThree: false,
      ruleVisiable: false,
      viewObjectVisible: false,
      editObjectVisible: false,
      addObjectVisible: false,
      targetData: [],
      objectData: {},
      dialogVisiable: false,
      showObjectlist: [],
      voucherVisiable: false,
      valueFlowData: {},
      activeName: "first",
      action: "edit",
      operateAction: "view",
      editIndex: "",
      flowPathType: "1",
      resolveMethod: "",
      firstError: false,
      flowRules: {},
      flowList: [],
      vouchers: { voucherDataInfoList: [] },
      rules: {
        fnName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        ruleDesc: [
          { required: true, message: "请输入业务规则", trigger: "blur" },
        ],
      },
      voucherColumn: [
        {
          prop: "voucherName",
          label: "凭证名称",
          //tooltip: true,
          type: "text",
          minWidth: "150",
        },
        {
          prop: "voId",
          label: "凭证ID",
          minWidth: "150",
          type: "text",
        },
        {
          prop: "voucherType",
          filter: "voucherType",
          label: "凭证类型",
          minWidth: "150",
          type: "text",
        },
        {
          prop: "voucherDesc",
          label: "凭证描述",
          minWidth: "150",
          type: "text",
        },
      ],
      columnList: [
        {
          prop: "objName",
          label: "对象名称",
          //tooltip: true,
          type: "text",
          minWidth: "150",
        },
        {
          prop: "objCode",
          label: "编码",
          minWidth: "150",
          type: "text",
        },
        {
          prop: "objType",
          filter: "objType",
          label: "对象类型",
          minWidth: "150",
          type: "text",
        },
        {
          prop: "objClass",
          filter: "objClass",
          label: "分类",
          minWidth: "150",
          type: "text",
        },
      ],
      flowPathList: [
        {
          prop: "fcId",
          label: "流程ID",
          //tooltip: true,
          type: "text",
          minWidth: "150",
        },
        {
          prop: "fcName",
          label: "流程名称",
          minWidth: "150",
          type: "text",
        },
        {
          prop: "fcLevel",
          filter: "fcLevel",
          label: "流程类型",
          minWidth: "150",
          type: "text",
        },
        {
          prop: "fcVersion",
          label: "版本",
          minWidth: "150",
          type: "text",
        },
        {
          label: "操作",
          type: "button",
          minWidth: "80",
          buttonList: [
            {
              desc: "查看",
              operate: "view",
            },
          ],
        },
      ],
      businessRules: [
        {
          prop: "ruleDesc",
          label: "规则描述",
          minWidth: 200,
          type: "text",
        },
      ],
      fourthBusinessRules: [
        {
          prop: "sourceName",
          label: "来源",
          minWidth: "150",
          type: "text",
        },

        {
          prop: "ruleDesc",
          minWidth: "200",
          label: "规则描述",
          type: "text",
        },
      ],
      pager: {
        // 字段选择表格页码信息
        turnPageShowNum: 10,
        currentPage: 1,
        total: 0,
      },
    };
  },
  mounted() {
    console.log("路由数据", this.$route.query);
  },
  methods: {
    show(shape, data) {
      console.log("形状数据", shape?.shape, shape, data);
      Object.assign(this.$data, this.$options.data()); //重置data数据
      if (Object.keys(data).length == 0) {
        this.valueFlowData = {
          vouchers: [],
          rules: [],
          objects: [],
          participants: [],
        };
      } else {
        this.valueFlowData = _.cloneDeep(data);
      }
      if (shape.preview) {
        this.action = "view";
      } else {
        this.businessRules.push({
          label: "操作",
          minWidth: "100",
          type: "button",
          buttonList: [
            {
              desc: "编辑",
              operate: "edit",
            },
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        });
      }
      const userId = this.$store.state.userInfo.cstNo;
      const action = this.action;
      this.voucherColumn.push({
        label: "操作",
        type: "button",
        minWidth: "150",
        buttonList: [
          {
            desc: "编辑",
            operate: "edit",
            relation: function (scope) {
              return scope.row.createUserId == userId && action == "edit";
            },
          },
          {
            desc: "查看",
            operate: "view",
          },
          {
            desc: "删除",
            operate: "delete",
            relation: function (scope) {
              return action == "edit";
            },
          },
        ],
      });
      this.columnList.push({
        label: "操作",
        type: "button",
        minWidth: "150",
        buttonList: [
          {
            desc: "编辑",
            operate: "edit",
            relation: function (scope) {
              return (
                (scope.row.createUserId == userId ||
                  scope.row.userId == userId) &&
                action == "edit"
              );
            },
          },
          {
            desc: "查看",
            operate: "view",
          },
          {
            desc: "删除",
            operate: "delete",
            relation: function (scope) {
              return action == "edit";
            },
          },
        ],
      });
      this.flowPathType = shape.shape.charAt(shape.shape.length - 1);
      if (this.flowPathType == "e") {
        this.navThree = true;
      } else {
        if (this.flowPathType == "n") {
          this.navTwo = true;
        } else {
          this.nav = true;
        }
        if (!data.fnId) {
          this.rpc.graph
            .getFlowNodeCode({ taskId: this.$route.query.taskId })
            .then((res) => {
              this.valueFlowData.fnId = res.nodeCode;
            });
        } else if (this.nav) {
          if (this.flowPathType != "5") {
            this.rpc.graph.qryFlowList({ fnId: data.fnId }).then((res) => {
              this.flowList = res.flowChartInfos;
            });
          }
          if (!this.recordEditFnId()) {
            if (
              this.flowPathType == "3" ||
              this.flowPathType == "4" ||
              this.flowPathType == "5"
            ) {
              this.qryVoucherByNodeList();
              this.qryBizObjectListV2("object");
              this.qryBizObjectListV2("participant");
            }
            if (this.flowPathType == "4" || this.flowPathType == "5") {
              this.qryBizRuleInfoListV2();
            }
          } else {
            this.changeShowObject();
          }
        }
      }
      this.$nextTick(() => {
        this.dragControllerDiv();
      });
      return new Promise((resolve, reject) => {
        this.resolveMethod = resolve;
      });
    },

    sumbit() {
      console.log("确认的数据", this.valueFlowData);
      if (this.navTwo) {
        this.$refs.valueFlowForm.validate((valid) => {
          if (valid) {
            this.resolveMethod(this.valueFlowData);
            this.navTwo = false;
          }
        });
      } else {
        this.$refs.valueFlowForm.validate((valid) => {
          if (valid) {
            this.resolveMethod(this.valueFlowData);
            if (!this.recordEditFnId()) {
              this.$parent.editedFnId.push(this.valueFlowData.fnId);
            }
            this.nav = false;
            this.navThree = false;
          } else {
            this.firstError = true;
          }
        });
      }
    },
    cancel() {
      this.nav = false;
      this.navTwo = false;
      this.navThree = false;
      this.resolveMethod();
    },
    paginationChange(val) {
      this.pager.turnPageShowNum = val;
      this.pager.currentPage = 1;
      this.changeShowObject();
    },
    pushObjDesign(data) {
      const objIdList = this.valueFlowData.objects.map((item) => {
        return item.objId;
      });
      window.sessionStorage.setItem("objIdList", JSON.stringify(objIdList));
      let link = this.$router.resolve({
        path: "/aop_businessd1/graphs/bizWorks",
        query: {
          baiId: this.$route.query.taskId,
          bizDomainNo: this.$route.query.bizDomainNo,
          action: data,
          fnId: this.valueFlowData.fnId,
          objList: true,
        },
      });
      window.open(link.href, "_blank");
    },
    vouOperate(operate, data, index) {
      if (operate == "edit") {
        this.operateAction = "edit";
        this.editIndex = index;
        this.vouchers = _.cloneDeep(data);
        this.voucherVisiable = true;
      } else if (operate == "view") {
        this.operateAction = "view";
        this.vouchers = data;
        this.voucherVisiable = true;
      } else {
        this.valueFlowData.vouchers.splice(index, 1);
      }
    },
    operateRule(operate, data, index) {
      if (operate == "edit") {
        this.flowRules = _.cloneDeep(data);
        this.operateAction = "edit";
        this.editIndex = index;
        this.ruleVisiable = true;
      } else if (operate == "add") {
        this.flowRules = {};
        this.ruleVisiable = true;
        this.operateAction = "add";
      } else {
        this.valueFlowData.rules.splice(index, 1);
      }
    },
    flowPathOperate(operate, data) {
      const query = data;
      const locaHref = window.location.href;
      if (locaHref.includes("aop_businessd1/process/processDesc")) {
        this.$router.push({ path: this.$route.path, query });
        this.nav = false;
        this.navTwo = false;
      } else if (locaHref.includes("aop_businessmodel/busmodel")) {
        //该组件全局异步引用到aop_businessmodel包，导致跳转aop_businessd1都空白需刷新
        let link = this.$router.resolve({
          path: "/aop_businessd1/process/processDesc",
          query,
        });
        window.location.href = link.href;
        window.location.reload();
      } else {
        this.$router.push({
          path: "/aop_businessd1/process/processDesc",
          query,
        });
      }
    },
    selectConfirm(data) {
      if (this.activeName == "second") {
        this.valueFlowData.vouchers = this.removeDp(
          this.valueFlowData.vouchers,
          data
        );
      } else if (this.activeName == "third") {
        if (this.navTwo) {
          this.valueFlowData.participants = data;
        } else {
          this.valueFlowData.participants = this.removeDp(
            this.valueFlowData.participants,
            data
          );
        }
      } else {
        this.valueFlowData.objects = this.removeDp(
          this.valueFlowData.objects,
          data
        );
        this.changeShowObject();
      }
      this.dialogVisiable = false;
    },
    removeDp(arr1, arr2) {
      let arr = arr1.concat(arr2);
      let obj = {};
      let newArray = arr.reduce((pre, cur) => {
        if (!obj[cur.objId || cur.voId]) {
          obj[cur.objId || cur.voId] = true;
          pre.push(cur);
        }
        return pre;
      }, []);
      return newArray;
    },
    tabsConfirm(data) {
      if (
        this.operateAction == "add" ||
        (this.operateAction == "edit" && this.dialogVisiable)
      ) {
        this.$refs.searchSelect.search();
      } else {
        this.$set(this.valueFlowData.vouchers, this.editIndex, data);
      }
      this.voucherVisiable = false;
    },
    ruleSumbit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.operateAction == "edit") {
            this.$set(this.valueFlowData.rules, this.editIndex, this.flowRules);
          } else {
            this.valueFlowData.rules.push(this.flowRules);
          }
          this.ruleVisiable = false;
        }
      });
    },
    operate(operate, data, index) {
      switch (operate) {
        case "view":
          this.objectData = data;
          this.viewObjectVisible = true;
          break;
        case "edit":
          this.objectData = data;
          this.editIndex = index;
          this.editObjectVisible = true;
          break;
        case "delete":
          if (this.activeName == "fifth") {
            let index = this.valueFlowData.objects.findIndex((item) => {
              return item.objId === data.objId;
            });
            this.valueFlowData.objects.splice(index, 1);
            this.changeShowObject();
          } else {
            let index = this.valueFlowData.participants.findIndex((item) => {
              return item.objId === data.objId;
            });
            this.valueFlowData.participants.splice(index, 1);
          }
          break;
      }
    },
    getObjList(data) {
      if (this.dialogVisiable) {
        this.$refs.searchSelect.search();
      } else {
        data.userId = this.$store.state.userInfo.cstNo;
        if (this.activeName == "fifth") {
          this.$set(this.valueFlowData.objects, this.editIndex, data);
        } else {
          this.$set(this.valueFlowData.participants, this.editIndex, data);
        }
      }
    },
    qryVoucherByNodeList() {
      this.rpc.graph
        .qryVoucherByNodeList({ fnId: this.valueFlowData.fnId })
        .then((res) => {
          this.valueFlowData.vouchers = res.voucherInfoList;
        });
    },
    qryBizObjectListV2(type) {
      this.rpc.graph
        .qryBizObjectListV2({
          taskId: this.$route.query.taskId,
          fnId: this.valueFlowData.fnId,
          relType: type,
          currentPage: 1,
          turnPageShowNum: 9999,
        })
        .then((res) => {
          if (type == "object") {
            this.valueFlowData.objects = res.objectInfos;
            this.changeShowObject();
          } else {
            this.valueFlowData.participants = res.objectInfos;
          }
        });
    },
    qryBizRuleInfoListV2() {
      this.rpc.graph
        .qryBizRuleInfoListV2({
          taskId: this.$route.query.taskId,
          fnId: this.valueFlowData.fnId,
          currentPage: "1",
          turnPageShowNum: "9999",
        })
        .then((res) => {
          this.valueFlowData.rules = res.ruleList;
        });
    },
    changeShowObject() {
      this.pager.total = this.valueFlowData.objects.length;
      this.showObjectlist = this.valueFlowData.objects.slice(
        (this.pager.currentPage - 1) * this.pager.turnPageShowNum,
        this.pager.currentPage * this.pager.turnPageShowNum
      );
    },
    confirmNode() {
      this.confirmNodeFn({
        fcId: this.valueFlowData.fcId,
        nodeId: this.valueFlowData.fnId,
        nodeName: this.valueFlowData.fnName,
      });
    },
    recordEditFnId() {
      //若用户已编辑未保存则不用查接口
      return this.$parent.editedFnId.find((item) => {
        return item == this.valueFlowData.fnId;
      });
    },
    dragControllerDiv() {
      let resize = document.getElementById("resize");
      let right = document.getElementById("right");
      resize.onmousedown = function (e) {
        const rightWidth = right.offsetWidth;
        let startX = e.clientX;
        document.onmousemove = function (e) {
          let endX = e.clientX;
          right.style.width = rightWidth - (endX - startX) + "px";
        };
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
          resize.releaseCapture && resize.releaseCapture();
        };
        resize.setCapture && resize.setCapture();
        return false;
      };
    },
    L4toL5() {
      return window.location.href.includes("L4toL5");
    },
  },
  filters: {
    flowTypeName(val) {
      switch (val) {
        case "1":
          return "分类";
        case "2":
          return "产品";
        case "3":
          return "活动";
        case "4":
          return "步骤";
        case "5":
          return "操作";
        default:
          return val;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tapStyles {
  padding-top: 8px;
}
/* 遮罩层 */
.m-navbar {
  position: fixed;
  left: -3px;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 499;
}
/* 存放弹框内容 */
.m-navba {
  font-weight: 400;
  padding: 16px 24px;
  position: fixed;
  width: 800px;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 500;
  .iconStyle {
    height: 16px;
    margin-right: 5px;
    margin-bottom: -3px;
  }
}
.m-title {
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0px 0.5px 0px 0px rgba(231, 231, 238, 1);
  padding-bottom: 16px;
  .closeDialog {
    height: 28px;
    width: 28px;
    float: right;
  }
}

.formStyle {
  margin-top: 12px;
}
.nav-leave {
  /* 定义 出场动画的 起始状态 */
  /* 只停留一帧 */
  transform: translateX(0px);
}
.nav-leave-active {
  /* 定义 出场动画 过程 */
  transition: all 0.4s ease;
}
.nav-leave-to {
  /* 定义 出场动画 结束状态（即：该动画要达到的目标状态） */
  transform: translateX(600px);
}
/* 定义  入场动画 */
.nav-enter {
  /* 定义 入场动画 的起始状态 */
  transform: translateX(600px);
}
.nav-enter-active {
  /* 定义 入场动画 过程 */
  transition: all 0.4s ease;
}
.nav-enter-to {
  /* 定义 入场动画 过程 */
  /* 只停留一帧 */
  transform: translateX(0px);
}

.pageFooter {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.right_button {
  margin-bottom: 14px;
}
.errorRule {
  color: #d11211;
}
.svgBack {
  background: url('data:image/svg xml;charset=utf-8, <svg version="1.1" xmlns="http://www.w3.org/2000/svg"');
}
.svgText {
  color: #ffffff;
  p {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }
}
.aop_client_footer {
  background: #fff;
  text-align: center;
  padding: 16px;
  box-shadow: 10px 1px 10px 0 #e7e7e7;
  z-index: 10;
  .save {
    width: 112px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dde0e4;
    border-radius: 2px;
    background: #fff;
    color: #323c41;
    margin-right: 24px;
    cursor: pointer;
  }
  .save {
    background: #fe4758;
    border: 1px solid #fe4758;
    color: #fff;
  }
}
::v-deep .widthInput .el-textarea__inner {
  min-height: 80px !important;
}
.el-icon-plus {
  margin-right: 5px;
}
#resize {
  position: relative;
  margin-left: -23px;
  width: 5px;
  height: 100%;
  cursor: w-resize;
  float: left;
}
</style>