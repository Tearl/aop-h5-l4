<template>
  <div class="aop_tradecode_comps_d4editor_service_define_check_systemDesign_dialog">
    <PageDialog :dialogWidth="'450px'" :dialogTitle="'校验结果'" :dialogVisiable="dialogVisible" @closeDialog="closeDialog"
      class="dialog_container">
      <div slot="box">
        <div class="standar_check_dialog">
          <ul class="standar_check_list">
            <li v-for="(item, index) in standardCheckData" :key="index" class="list_item">
              <div class="left">
                <img class="test_record_icon" :src="item.checkFlg == '-1'
                  ? item.loadingIcon
                  : item.checkFlg == '1'
                    ? item.failIcon
                    : item.successIcon
                  " />
                <span class="text title">{{ item.title }}</span>
                <template v-if="!item.case">
                  <span class="text result" :class="['failed']" v-if="item.checkFlg == '1'">失败</span>
                  <span class="text result" :class="['success']" v-if="item.checkFlg == '0'">成功</span>
                </template>

                <template v-else>
                  <span class="text result_tips">{{ item.tips }}</span>
                </template>
              </div>
              <div class="right">
                <!-- v-if="item.checkFlg == 0 && item.finished" -->
                <el-button type="primary" size="mini" :disabled="item.checkFlg != '1' || item.id==3"
                  @click="showCheckDetail(item.id)">详情
                </el-button>
              </div>
            </li>
          </ul>
          <div v-show="successFlag && checkEnd" class="success_box">
            <img class="test_record_icon" :src="require('@m/assets/images/icon_success.png')" />
            <span style="color:#3fd6ae">校验通过请点确认提交设计</span>
          </div>
          <div v-show="!successFlag && checkEnd" class="success_box">
            <img class="test_record_icon" :src="require('@m/assets/images/icon_fail.png')" />
            <span style="color:#fe4758">所有检测项校验通过才能提交设计！</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="dialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click.stop="confirm" :disabled="!successFlag">确 定</el-button>
      </div>
    </PageDialog>
    <PageDialog :dialogWidth="'720px'" :dialogTitle="'详情'" :dialogVisiable="standardCheckDetailVisible"
      @closeDialog="standardCheckDetailVisible = false" class="detail_dialog">
      <div slot="box">
        <div v-if="currentShowTitle == '0'">
          <div class="title">功能流程图不存在</div>
        </div>
        <div v-if="currentShowTitle == '3'">
          <div class="title">功能流程图描述不存在</div>
        </div>
        <div v-if="currentShowTitle == '1'">
          <div class="title">接口未被功能流程图使用列表：</div>
          <Table class="table" :data="funFlowList" :table="funFlowColumn"></Table>
        </div>
        <div v-if="currentShowTitle == '2'">
          <div class="title">未被实现业务交易：</div>
          <Table class="table" :data="arrangeParamList" :table="noStandarParamsColumn"></Table>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="standardCheckDetailVisible = false">返 回</el-button>
        <!-- <el-button type="primary" @click="confirm">确 认</el-button> -->
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
          title: "功能流程图是否存在",
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
          title: "功能流程图是否已编写描述",
          tips: "",
          finished: false,
          case: false,
          id:"3",
        },
        {
          checkFlg: "",
          loadingIcon: require("@m/assets/images/icon_loading.png"),
          failIcon: require("@m/assets/images/icon_fail.png"),
          successIcon: require("@m/assets/images/icon_success.png"),
          title: "功能流程图是否充分使用接口",
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
          title: "业务交易是否充分实现",
          tips: "",
          finished: false,
          case: false,
          id:"2",
        },
      ],
      standardCheckDetailVisible: false,
      currentShowTitle: "",
      noStandarParamsColumn: [
        {
          prop: "txId",
          label: "交易ID",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "txNm",
          label: "交易名称",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
      ],
      funFlowColumn: [
        {
          prop: "ifId",
          label: "接口ID",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ifNm",
          label: "接口名称",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
      ],
      dialogVisible: false,
      //未被实现业务交易：
      arrangeParamList: [],

      //接口未被功能流程图使用列表：
      funFlowList: [],

      successFlag: false,
      checkEnd: true,
    }
  },
  methods: {
    showDialog(data) {
      this.checkEnd = false;
      this.dialogVisible = true;
      this.standardCheckData.forEach(item => item.checkFlg = "-1");
      this.showStandardCheckDialog(data);
    },
    async showStandardCheckDialog(data) {
      console.log("daraaa", data);
       // 0 流程图是否存在 1 流程描述是否存在 2 是否使用接口 3 业务交易是否有
       setTimeout(() => {
        // 功能流程图是否存在
        this.standardCheckData[0].checkFlg = data.fnctFlowChartExistCheckReltCd;
      }, 500)
      setTimeout(() => {
        // 功能流程图是否已编写描述
        this.standardCheckData[1].checkFlg = data.fnctFlowChartDescCheckReltCd;
      }, 1000)
      setTimeout(() => {
        // 功能流程图是否充分使用接口
        this.standardCheckData[2].checkFlg = data.fnctFlowChartFullUseIfCheckReltCd;
        this.funFlowList = data.unFullUseIfList;
      }, 1500)
      setTimeout(() => {
        // 业务交易是否充分实现
        this.standardCheckData[3].checkFlg = data.bizTradeFullAchCheckReltCd;
        this.arrangeParamList = data.unFullAchBizTradeList;
        this.checkEnd = true
        let flag = this.standardCheckData.filter(item => item.checkFlg != "0");
        this.successFlag = flag.length ? false : true;
      }, 2000)
      console.log()

    },
    showCheckDetail(title) {
      console.log("showCheckDetail", title);
      this.currentShowTitle = title;
      this.standardCheckDetailVisible = true;
    },
    async confirm() {
      // this.closeDialog();
      this.dialogVisible = false;
      this.$emit("checkSystemDesign")
    },
    closeDialog() {
      this.dialogVisible = false;
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

.aop_tradecode_comps_d4editor_service_define_check_systemDesign_dialog {
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
