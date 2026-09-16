<template>
  <div>
    <div class="m-navba" v-if="dialogVisiable">
      <div class="m-title">
        {{
          action == "edit"
            ? "编辑凭证"
            : action == "add"
            ? "新建凭证"
            : "查看凭证"
        }}
      </div>
      <div slot="box" class="aop_asset_interfaceManagement__component_tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="first">
            <span slot="label">基本信息 </span>
            <el-form
              v-if="action == 'edit' || action == 'add'"
              style="margin-top: 12px"
              :disabled="action == 'view'"
              ref="valueFlowForm"
              :model="voucherData"
              :rules="rules"
              label-width="100px"
            >
              <el-form-item label="凭证名称：" prop="voucherName">
                <el-input
                  maxLength="50"
                  v-model="voucherData.voucherName"
                  placeholder="请输入凭证名称"
                />
              </el-form-item>
              <el-form-item label="凭证类型：" prop="voucherType">
                <el-select
                  :disabled="$parent.flowPathType != '5'"
                  style="width: 100%"
                  v-model="voucherData.voucherType"
                  placeholder="请输入凭证类型"
                >
                  <el-option label="业务凭证" value="00"></el-option>
                  <el-option label="系统凭证" value="01"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述：" prop="voucherDesc">
                <el-input
                  maxLength="500"
                  class="widthInput"
                  type="textarea"
                  v-model="voucherData.voucherDesc"
                  placeholder="请输入描述"
                />
              </el-form-item>
            </el-form>
            <div v-else>
              <ul>
                <li>凭证ID:{{ voucherData.voId }}</li>
                <li>凭证名称：{{ voucherData.voucherName }}</li>
                <li>
                  凭证类型：{{
                    voucherData.voucherType == "00" ? "业务凭证" : "系统凭证"
                  }}
                </li>
                <li>更新人：{{ voucherData.createUserName }}</li>
                <li>更新时间：{{ voucherData.createTime }}</li>
                <li>描述：{{ voucherData.voucherDesc }}</li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label">凭证数据 </span>
            <el-button
              v-if="action == 'edit' || action == 'add'"
              type="primary"
              size="medium"
              @click="(tabsVisiable = true), $refs.userDefinedRef.showDialog()"
              >新增凭证数据</el-button
            >
            <Table
              style="margin-top: 12px"
              ref="dictryTable"
              :height="
                action != 'view' ? 'calc(100vh - 250px)' : 'calc(100vh - 200px)'
              "
              :tableLoading="tableLoading"
              :table="columnList"
              :data="voucherData.voucherDataInfoList"
              @operate="operate"
            ></Table>
          </el-tab-pane>
        </el-tabs>
        <page-footer
          v-if="action == 'view'"
          class="pageFooter"
          leftbtn="关闭"
          @handleLeft="tabsCanel"
        >
        </page-footer>
        <page-footer
          v-else
          class="pageFooter"
          leftbtn="取消"
          rightbtn="确认"
          @handleLeft="tabsCanel"
          @handleRight="sumbit"
        >
        </page-footer>
        <addUserDefined
          ref="userDefinedRef"
          @saveParams="tabsConfirm"
          :editStorage="voucherData.voucherDataInfoList"
        />
        <dictionaryDetail
          :detailValueVisible="detailValueVisible"
          :dictryId="detailDictryId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { unduplicated } from "@m/utils/array";
import Table from "./../../../bizWorks/components/detail_tabs/page_table"; // 公共表格组件
import addUserDefined from "@m/core/components/page_big_data/addUserDefined";
import dictionaryDetail from "@m/core/components/page_big_data/dictionaryDetail";
import PageFooter from "./../../../bizWorks/components/detail_tabs/pageFooter";
import PageDialog from "./../../../bizWorks/components/detail_tabs/page_dialog";
import SearchTop from "./../../../bizWorks/components/detail_tabs/page_search_top";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    SearchTop,
    PageFooter,
    addUserDefined,
    dictionaryDetail,
  },
  props: {
    dialogVisiable: {
      //表格列表列头
      default: () => false,
      type: Boolean,
    },

    action: {
      default: "view",
      type: String,
    },
    voucherData: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
      tabsVisiable: false,
      activeName: "first",
      tableLoading: false, // 字段选择表格是否加载
      detailValueVisible: false, //详情弹框
      detailDictryId: "",
      columnList: [
        // 字段选择表格列表参数
        {
          prop: "dictryName",
          label: "字段名称",
          mnWidth: "120px",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNo",
          minWidth: "120px",
          label: "编码",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryType",
          label: "数据类型",
          minWidth: "120px",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryDesc",
          label: "描述说明",
          minWidth: "130px",
          type: "text",
          tooltip: true,
        },
      ],
      rules: {
        voucherName: [
          { required: true, message: "请输入凭证名称", trigger: "blur" },
        ],
        voucherType: [
          { required: true, message: "请选择凭证类型", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 重置事件
    reset() {
      this.searchForm = {
        //获取参数类型列表提交参数
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊

        attributeTyp: "", //属性类型
        paraType: "", // 类型
      };
    },
    // 弹窗取消事件
    tabsCanel() {
      this.$emit("tabsCanel");
    },
    // 弹窗确定事件
    tabsConfirm(data) {
      data.map((item) => {
        this.voucherData.voucherDataInfoList.push({
          dictryId: item.dictryId,
          dictryNo: item.dictryNo,
          dictryName: item.dictryNm,
          dictryType: item.dictryTyp,
          dictryDesc: item.dictryDescr,
        });
      });
      this.voucherData.voucherDataInfoList = unduplicated(
        this.voucherData.voucherDataInfoList,
        ["dictryId"]
      );
      this.tabsVisiable = false;
    },

    operate(operation, data, index) {
      if (operation == "delete") {
        this.voucherData.voucherDataInfoList.splice(index, 1);
      }
      if (operation == "view") {
        this.detailDictryId = data.dictryId;
        this.detailValueVisible = true;
      }
    },
    sumbit() {
      this.$refs.valueFlowForm.validate((valid) => {
        if (valid) {
          if (this.action == "add") {
            this.rpc.graph
              .insertVoucher({
                taskId: this.$route.query.taskId,
                ...this.voucherData,
              })
              .then((res) => {
                this.$notify({
                  title: "成功",
                  message: "新建成功",
                  duration: 2000,
                  type: "success",
                });
                this.$emit("tabsConfirm");
              });
          } else if (this.action == "edit") {
            this.rpc.graph
              .updateVoucher({
                taskId: this.$route.query.taskId,
                ...this.voucherData,
              })
              .then((res) => {
                this.$notify({
                  title: "成功",
                  message: "编辑成功",
                  duration: 2000,
                  type: "success",
                });
                this.$emit("tabsConfirm", this.voucherData);
              });
          } else {
            this.$emit("tabsConfirm", this.voucherData);
          }
        }
      });
    },
    //元数据取消选择
    deleteCheck(key) {},
  },
  operate(operate, data, index) {
    this.voucherData.voucherDataInfoList.splice(index, 1);
  },
  created() {
    if (this.voucherData.voId) {
      this.rpc.graph
        .getVoucherInfo({
          voId: this.voucherData.voId,
        })
        .then((res) => {
          this.voucherData = res;
        });
    }
    this.$nextTick(() => {
      if (this.action == "add") {
        this.$set(
          this.voucherData,
          "voucherType",
          this.$parent.flowPathType == "5" ? "01" : "00"
        );
      }
      const action = this.action;
      this.columnList.push({
        label: "操作",
        type: "button",
        minWidth: "120px",
        buttonList: [
          {
            desc: "查看",
            operate: "view",
          },
          {
            desc: "删除",
            operate: "delete",
            relation: function (scope) {
              return action != "view";
            },
          },
        ],
      });
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.tapStyles {
  padding-top: 8px;
}

/* 存放弹框内容 */
.m-navba {
  font-weight: 400;
  padding: 16px 24px;
  position: fixed;
  width: 950px;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 510;
}

.m-title {
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0px 0.5px 0px 0px rgba(231, 231, 238, 1);
  padding-bottom: 16px;
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
.aop_asset_interfaceManagement__component_tabs {
  .title {
    font-weight: bold;
    font-size: 1.2em;
    padding-bottom: 16px;
    color: #333333;
  }
  .el-input {
    display: inline-block;
  }
  li {
    height: 44px;
  }
}
::v-deep .widthInput .el-textarea__inner {
  min-height: 80px !important;
}
</style>
