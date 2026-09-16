<template>
  <div class="aop_tradecode_comps_d4editor_service_define_check_dialog">
    <PageDialog :dialogWidth="'32%'" :dialogTitle="'校验结果'" :dialogVisiable="dialogVisible" @closeDialog="closeDialog"
      class="dialog_container">
      <div slot="box">
        <div class="standar_check_dialog">
          <ul class="standar_check_list">
            <li v-for="(item, index) in standardCheckData" :key="index" class="list_item">
              <div class="left">
                <img class="test_record_icon" :src="item.checkFlg == '-1'
                  ? item.loadingIcon
                  : item.checkFlg == '0'
                    ? item.failIcon
                    : item.successIcon
                  " />
                <span class="text title">{{ item.title }}</span>
                <template v-if="!item.case">
                  <span class="text result" :class="['failed']" v-if="item.checkFlg == '0'">失败</span>
                  <span class="text result" :class="['success']" v-if="item.checkFlg == '1'">成功</span>
                </template>

                <template v-else>
                  <span class="text result_tips">{{ item.tips }}</span>
                </template>
              </div>
              <div class="right">
                <!-- v-if="item.checkFlg == 0 && item.finished" -->
                <el-button type="primary" size="mini" :disabled="item.checkFlg != '0'"
                  @click="showCheckDetail(item.title)">详情
                </el-button>
              </div>
            </li>
          </ul>
          <div v-show="successFlag && checkEnd" class="success_box">
            <img class="test_record_icon" :src="require('@m/assets/images/icon_success.png')" />
            <span>校验通过</span>
          </div>
          <div v-show="!successFlag && checkEnd" class="success_box">
            <img class="test_record_icon" :src="require('@m/assets/images/icon_fail.png')" />
            <span>校验失败</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click.native="confirm">确 定</el-button>
      </div>
    </PageDialog>
    <PageDialog :dialogWidth="'720px'" :dialogTitle="'详情'" :dialogVisiable="standardCheckDetailVisible"
      @closeDialog="standardCheckDetailVisible = false" class="detail_dialog">
      <div slot="box">
        <div v-if="currentShowTitle == '交易(4B)编排图形检测'">
          <div class="title">当前交易未被编排</div>
        </div>
        <div v-if="currentShowTitle == '交易(4B)参数引用检测'">
          <div class="title">未引用参数</div>
          <Table class="table" :data="tranParamUsedResultList" :table="noStandarParamsColumn"></Table>
        </div>
        <div v-if="currentShowTitle == '服务(L5)参数引用检测'">
          <span class="title">组件列表：</span>
          <Table class="table" :data="actionParamUsedResultList" :table="actionColumn" @operate="operate"></Table>
          <div class="tips">
            <span>主流程内的组件名称格式：服务名称(位置序号)<br>子流程内的组件名称格式：服务名称(父组件位置序号-位置序号)</span>
            <span></span>
          </div>
        </div>
        <div v-if="currentShowTitle == '交易(4B)输出参数来源检测'">
          <div class="title">未引用参数来源列表</div>
          <Table class="table" :data="tranParamSourceResultList" :table="noStandarParamsColumn"></Table>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="standardCheckDetailVisible = false">确 定</el-button>
      </div>
    </PageDialog>
    <PageDialog
      :dialogWidth="'720px'"
      :dialogTitle="'组件参数详情'"
      :dialogVisiable="actionDetailVisible"
      @closeDialog="actionDetailVisible = false"
      class="detail_dialog"
    >
      <div slot="box">
        <div class="title">组件未引用参数</div>
        <Table class="table" :data="paramCheckList" :table="noStandarParamsColumn"></Table>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="actionDetailVisible = false">确 定</el-button>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin"
import filters from "@m/utils/filters"
import PageDialog from "@m/core/components/page_dialog"
import Table from "@m/core/components/page_table"

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
  },
  props: {
  },
  data() {
    return {
      standardCheckData: [
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "交易(4B)编排图形检测",
          tips: "",
          finished: false,
          case: false,
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "交易(4B)参数引用检测",
          tips: "",
          finished: false,
          case: false,
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "服务(L5)参数引用检测",
          tips: "",
          finished: false,
          case: false,
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "交易(4B)输出参数来源检测",
          tips: "",
          finished: false,
          case: false,
        },
      ],
      standardCheckDetailVisible: false,
      currentShowTitle: "",
      noStandarParamsColumn: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramName",
          label: "参数名称",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
      ],
      actionColumn: [
        {
          prop: "actionName",
          label: "组件名称",
          minWidth: "50%",
          type: "text",
          tooltip: true,
          operate: "actionDetail",
          type: function (row) {
            if (row.errorType == "1") {
              return "text"
            } else {
              return "textClick"
            }
          }
        },
        {
          prop: "errorType",
          label: "错误类型",
          minWidth: "50%",
          type: "text",
          tooltip: true,
          filter: "actionErrorType",
        }
      ],
      dialogVisible: false,
      tranParamUsedResultList: [],//未引用参数列表
      actionParamUsedResultList: [],//组件列表
      paramCheckList: [], //组件未引用参数列表
      tranParamSourceResultList: [],//参数来源
      actionDetailVisible: false,//组件未引用参数详情
      successFlag: "",
      checkEnd: false,
    }
  },
  methods: {
    showDialog(data) {
      this.checkEnd = false
      this.dialogVisible = true
      this.standardCheckData.forEach(item => item.checkFlg = "-1")
      this.showStandardCheckDialog(data)
    },
    async showStandardCheckDialog(data) {
      console.log("daraaa", data)
      setTimeout(() => {
        // 交易编排检测
        this.standardCheckData[0].checkFlg = data.layoutCheck
      }, 0)
      setTimeout(() => {
        // 参数检测
        this.tranParamUsedResultList = data.tranParamUsedResultList
        this.standardCheckData[1].checkFlg = data.tranParamUsedCheck
      }, 500)
      setTimeout(() => {
        // 组件参数检测
        this.actionParamUsedResultList = data.actionParamUsedResultList
        this.standardCheckData[2].checkFlg = data.actionParamUsedCheck
      }, 1000)
      setTimeout(() => {
        // 参数来源检测
        this.tranParamSourceResultList = data.tranParamSourceResultList
        this.standardCheckData[3].checkFlg = data.tranParamSourceCheck
        this.checkEnd = true
        let flag = this.standardCheckData.filter(item => item.checkFlg != "1")
        this.successFlag = flag.length ? false : true
      }, 1500)
    },
    operate(operation, data) {
      console.log("operation", operation, data)
      if (operation == "actionDetail") {
        this.actionDetailVisible = true
        this.paramCheckList = data.paramCheckList
      }
    },
    showCheckDetail(title) {
      console.log("showCheckDetail", title)
      this.currentShowTitle = title
      this.standardCheckDetailVisible = true
    },
    async confirm() {
      this.closeDialog()
    },
    closeDialog() {
      this.dialogVisible = false
    }
  },
  created() {
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.aop_tradecode_comps_d4editor_service_define_check_dialog {
  .standar_check_dialog {
    display: flex;
    justify-content: center;
    flex-direction: column;

    .standar_check_list {
      .list_item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;

        .text {
          margin-right: 10px;
        }

        .title {
          display: inline-block;
          width: 200px;
          margin-right: 10px;
          font-weight: 600;
        }

        .result {
          margin-right: 10px;

          &.failed {
            color: $danger_color;
          }

          &.success {
            color: $success_color;
          }
        }

        .result_tips {}
      }
    }

    .tips_info {
      text-align: center;
      font-weight: 600;
    }

    .case_tips {
      .case_content {
        display: inline-block;
        margin-left: 180px;
        margin-top: 12px;
        max-width: 500px;
      }

      .btn_style {
        position: absolute;
        right: 32px;
        top: 254px;
      }
    }

    .case_content {
      // display: inline-block;
      margin-left: 138px;
      margin-top: 12px;
      max-width: 500px;
      display: flex;
    }

    .btn_style {
      position: absolute;
      right: 32px;
      top: 254px;
    }

    .execute {
      width: 90px;
    }
  }

  .test_record_icon {
    width: 20px;
    height: 20px;
    vertical-align: sub;
  }

  .success_box {
    text-align: center;
  }

  .tips {
    padding: 10px;
    // background-color: #fdf6ec;
    // border-color: #faecd8;
    color: #e6a23c;
  }
}
</style>
