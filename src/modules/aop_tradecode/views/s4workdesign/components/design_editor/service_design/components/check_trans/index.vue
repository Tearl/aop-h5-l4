<template>
  <div class="aop_tradecode_comps_d4editor_service_define_check_dialog">
    <PageDialog :dialogWidth="'450px'" :dialogTitle="'校验结果'" :dialogVisiable="dialogVisible" @closeDialog="closeDialog"
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
                  <span class="text result" :class="(item.id =='5' || item.id =='9')?'waring':'failed'" v-if="item.checkFlg == '0'">{{(item.id=='5' || item.id=='9')?'警告':'失败'}}</span>
                  <span class="text result" :class="['success']" v-if="item.checkFlg == '1'">成功</span>
                </template>

                <template v-else>
                  <span class="text result_tips">{{ item.tips }}</span>
                </template>
              </div>
              <div class="right">
                <!-- v-if="item.checkFlg == 0 && item.finished" -->
                <el-button type="primary" size="mini" :disabled="item.checkFlg != '0'"
                  @click="showCheckDetail(item.id)">详情
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
        <div v-if="currentShowTitle == '0'">
          <div class="title">接口定义不能满足功能需求</div>
        </div>
        <div v-if="currentShowTitle == '1'">
          <div class="title">接口未至少绑定一个交互事件且绑定合理</div>
        </div>
        <div v-if="currentShowTitle == '2'">
          <div class="title">接口名称定义不合理</div>
        </div>
        <div v-if="currentShowTitle == '3'">
          <div class="title">接口编码定义不规范</div>
        </div>
        <div v-if="currentShowTitle == '4'">
          <div class="title">未被使用输入参数列表：</div>
          <Table class="table" :data="tranParamUsedResultList" :table="noStandarParamsColumn"></Table>
        </div>
        <div v-if="currentShowTitle == '5'">
          <div class="title">未被编排使用输入参数列表：</div>
          <Table class="table" :data="arrangeParamList" :table="noStandarParamsColumn"></Table>
        </div>
        <div v-if="currentShowTitle == '6'">
          <div class="title">未被赋值输出参数列表：</div>
          <Table class="table" :data="setParamList" :table="noStandarParamsColumn"></Table>
        </div>
        <div v-if="currentShowTitle == '7'">
          <div class="title">已设置来源值接口输出参数在来源方不存在列表：</div>
          <Table class="table" :data="sourceParamList" :table="noStandarParamsColumn"></Table>
        </div>
        <div v-if="currentShowTitle == '8'">
          <span class="title">组件参数输入未被完全赋值列表：</span>
          <Table class="table" :data="actionParamUsedResultList" :table="actionColumn" @operate="operate"></Table>
        </div>
        <div v-if="currentShowTitle == '9'">
          <span class="title">组件输出参数未被完全引用列表：</span>
          <Table class="table" :data="paramCheckList" :table="actionColumn" @operate="operate"></Table>
        </div>
        <div v-if="currentShowTitle == '10'">
          <span class="title">L5服务未被完全编排列表：</span>
          <Table class="table" :data="l5ParamList" :table="nol5serviceList"></Table>
        </div>
        <div v-if="currentShowTitle == '11'">
          <span class="title">已设置来源值组件输入参数在来源方不存在列表</span>
          <Table class="table" :data="tranParamSourceResultList" :table="actionColumn" @operate="operate"></Table>
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
        <Table class="table" :data="compsParamsList" :table="noStandarParamsColumn"></Table>
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
import Table from "@m/core/components/page_editor_table"

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
          title: "接口定义满足功能需求检测",
          tips: "",
          finished: false,
          case: false,
          id:"0",
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "接口绑定交互事件检测",
          tips: "",
          finished: false,
          case: false,
          id:"1",
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "接口名称定义检测",
          tips: "",
          finished: false,
          case: false,
          id:"2",
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "接口编码定义和规范检测",
          tips: "",
          finished: false,
          case: false,
          id:"3",
        },
        // {
        //   checkFlg: "",
        //   loadingIcon: require("@m/assets/images/icon_loading.png"),
        //   failIcon: require("@m/assets/images/icon_fail.png"),
        //   successIcon: require("@m/assets/images/icon_success.png"),
        //   title: "接口输入输出参数检测",
        //   tips: "",
        //   finished: false,
        //   case: false,
        //   id:"4",
        // },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/waring_icon.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "接口输入参数未被编排使用检测",
          tips: "",
          finished: false,
          case: false,
          id:"5",
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "接口输出参数未被完全赋值检测",
          tips: "",
          finished: false,
          case: false,
          id:"6",
        },
        //
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "接口输出参数来源检测",
          tips: "",
          finished: false,
          case: false,
          id:"7",
        },
        //
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "组件输入参数未被完全赋值检测",
          tips: "",
          finished: false,
          case: false,
          id:"8",
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/waring_icon.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "组件输出参数引用检测",
          tips: "",
          finished: false,
          case: false,
          id:"9",
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "L5服务未被完全编排检测",
          tips: "",
          finished: false,
          case: false,
          id:"10",
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "组件输入参数来源检测",
          tips: "",
          finished: false,
          case: false,
          id:"11",
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
          // operate: "actionDetail",
          type: "text"
          // type: function (row) {
          //   if (row.errorType == "1") {
          //     return "text"
          //   } else {
          //     return "textClick"
          //   }
          // }
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
      nol5serviceList: [
        {
          prop: "serviceId",
          label: "服务ID",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "serviceName",
          label: "服务名称",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
      ],
      dialogVisible: false,
      //接口列表
      tranParamUsedResultList: [],//未被使用输入参数列表：
      arrangeParamList:[], //未被编排使用输出参数列表：
      setParamList:[],  //未被赋值输出参数列表：
      sourceParamList:[], //已设置来源值接口输出参数在来源方不存在列表：
      l5ParamList:[], //L5服务未被完全编排列表：

      // 组件列表
      actionParamUsedResultList: [],//组件参数输入未被完全赋值列表：
      paramCheckList: [], //组件输出参数未被完全引用列表：
      tranParamSourceResultList: [],//参数来源

      //组件参数
      compsParamsList:[],

      actionDetailVisible: false,//已设置来源值组件输入参数在来源方不存在列表
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
      await setTimeout(() => {
        // 接口定义满足功能需求检测
        this.standardCheckData[0].checkFlg = data.baseDemandCheck
      }, 500)
      await setTimeout(() => {
        // 接口绑定交互事件检测
        this.standardCheckData[1].checkFlg = data.baseBindEventCheck
      }, 1000)
      await setTimeout(() => {
        // 接口名称定义检测
        this.standardCheckData[2].checkFlg = data.baseNameCheck
      }, 1500)
      await setTimeout(() => {
        // 接口编码定义和规范检测
        this.standardCheckData[3].checkFlg = data.baseCodeCheck
      }, 2000)
      await setTimeout(() => {
        // 接口输入输出参数检测
        this.tranParamUsedResultList = data.baseParamUsedResultList
        this.standardCheckData[4].checkFlg = data.baseParamUsedCheck
      }, 2500)
      await setTimeout(() => {
        // 接口输入参数未被编排使用检测
        this.arrangeParamList = data.txInputParamUsedInLayoutResultList
        this.standardCheckData[5].checkFlg = data.txInputParamUsedInLayoutCheck
      }, 3000)
      await setTimeout(() => {
        // 接口输出参数未被完全赋值检测
        this.setParamList = data.txOutputParamBeAssignResultList
        this.standardCheckData[6].checkFlg = data.txOutputParamBeAssignCheck
      }, 3500)
      await setTimeout(() => {
        // 接口输出参数来源检测
        this.sourceParamList = data.txOutputParamBeAssignResultList
        this.standardCheckData[7].checkFlg = data.txOutputParamSrcIdCheck
      }, 4000)


      await setTimeout(() => {
        // 组件输入参数未被完全赋值检测
        this.actionParamUsedResultList = data.actionIsNeedInputParamBeAssginResultList
        this.standardCheckData[8].checkFlg = data.actionIsNeedInputParamBeAssginCheck
      }, 4500)
      await setTimeout(() => {
        // 组件输出参数引用检测
        this.paramCheckList = data.actionOutputParamBeUserOneResultList
        this.standardCheckData[9].checkFlg = data.actionOutputParamBeUserOneCheck
      }, 5000)
      await setTimeout(() => {
        // L5服务未被完全编排检测
        this.l5ParamList = data.l5serviceBeUserInLayoutResultList
        this.standardCheckData[10].checkFlg = data.l5serviceBeUserInLayoutCheck
      }, 5500)
      await setTimeout(() => {
        // 组件输入参数来源检测
        this.tranParamSourceResultList = data.actionOutputParamSrcIdResultList
        this.standardCheckData[11].checkFlg = data.actionOutputParamSrcIdCheck
        this.checkEnd = true
        let flag = this.standardCheckData.filter(item => item.checkFlg != "1"  && (item.id != '5' && item.id != '9'))
        this.successFlag = flag.length ? false : true
      }, 6000)
    },
    operate(operation, data) {
      console.log("operation", operation, data)
      if (operation == "actionDetail") {
        this.actionDetailVisible = true
        this.compsParamsList = data.paramCheckList
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
@import "@m/assets/css/editorMixin.scss";

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
          &.waring{
            color: $warning_color;
          }
        }
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
