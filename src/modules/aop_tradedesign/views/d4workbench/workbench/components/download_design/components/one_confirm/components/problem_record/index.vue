<template>
  <div class="aop_tradedesign_comps_d4_download_design_probelm_record">
    <PageDialog
      :dialogWidth="'43%'"
      :dialogTitle="'问题记录'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
      class="dialog_container"
    >
      <div slot="box">
        <div class="box_title">{{ title }}</div>
        <div class="box_content">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in recordList"
              :key="index"
              color="#358aff"
            >
              {{ item.label }}
              <el-input
                type="textarea"
                placeholder="请输入您的意见"
                v-model="item.option"
                :disabled="pageType == 'look'"
                maxlength="1000"
                show-word-limit
              ></el-input>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div slot="footer">
        <div v-if="dataObj.type == 'look'">
          <el-button @click.native="closeDialog">关闭</el-button>
        </div>
        <div v-else>
          <el-button @click.native="closeDialog">取 消</el-button>
          <el-button type="primary" @click.native="confirm">确 定</el-button>
        </div>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
  },
  props: {
    chooseType: {
      type: String,
      default: () => "serv",
    },
    funcNm: {
      type: String,
      default: () => "功能名称",
    },
    dataObj: {
      type: Object,
      default: () => {},
    },
    pageType: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      recordList: [
        {
          label: "基于业务规则形成的业务主流程是否正确",
          type: "32",
          option: "",
          passStatus: "",
        },
        {
          label: "基于业务规则定义的分支逻辑是否正确",
          type: "33",
          option: "",
          passStatus: "",
        },
        {
          label: "基于分支逻辑形成的业务处理链路是否齐备",
          type: "34",
          option: "",
          passStatus: "",
        },
        {
          label: "基于业务规则定义的规则处理是否正确",
          type: "35",
          option: "",
          passStatus: "",
        },
      ],
      title: "",
      pageType: "",
    };
  },
  created() {},
  // ......
  methods: {
    showDialog(e,type) {
      console.log("e", e);
      this.pageType = type
      this.dialogVisible = true;
      if (this.chooseType == "serv") {
        // 点击的是服务的问题记录
        this.title = e + "-业务流程";
        this.recordList = [
          {
            label: "基于业务规则形成的业务主流程是否正确",
            type: "32",
            option: "",
            passStatus: "",
          },
          {
            label: "基于业务规则定义的分支逻辑是否正确",
            type: "33",
            option: "",
            passStatus: "",
          },
          {
            label: "基于分支逻辑形成的业务处理链路是否齐备",
            type: "34",
            option: "",
            passStatus: "",
          },
        ];
      } else {
        // 点击的是组件的问题记录
        this.title = e;
        this.recordList = [
          {
            label: "基于业务规则定义的规则处理是否正确",
            type: "35",
            option: "",
            passStatus: "",
          },
        ];
      }
      this.getDetail();
    },
    async getDetail() {
      const params = {
        // isolateWorkspace: this.dataObj.isolateWorkspace,
        // funcId: this.dataObj.funcId,
        // approvalType: this.pageType == "review" ? "00" : "01",
        layoutId: this.dataObj.layoutId,
        cpntId: this.dataObj.cpntId,
        eventId: this.dataObj.eventId,
        compositeId: this.dataObj.compositeId,
        svcId: this.dataObj.svcId || "",
        rarId: this.dataObj.rarId,
        problemType: "",
        businessId: this.dataObj.businessId || "",
      };
      const res = await this.rpc.d4.getProblemRecord(params);
      res.questionRecordList.map((item) => {
        this.recordList.forEach((data) => {
          if (data.type == item.detailType) {
            data.option = item.opinion;
          }
        });
      });
    },
    confirm() {
      this.$emit("confirmProblem", this.recordList);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
  mounted() {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.aop_tradedesign_comps_d4_download_design_probelm_record {
  /deep/ .el-dialog__body {
    margin-right: 26px;
  }
  .submit_record_not_pass_content {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;

    .el-textarea {
      height: 180px;
    }
  }
  .box_title {
    margin-bottom: 24px;
    font-size: 16px;
    font-weight: $font_weight_600;
    color: $reg_ft_color;
  }
  .box_content {
    /deep/ .el-textarea__inner {
      height: 80px;
      margin-top: 10px;
      border-radius: 2px;
    }
    /deep/ .el-timeline-item__tail {
      top: 4px;
    }
    /deep/ .el-timeline-item__node--normal {
      left: 1px;
      top: 4px;
      width: 8px;
      height: 8px;
    }
  }
}
</style>
