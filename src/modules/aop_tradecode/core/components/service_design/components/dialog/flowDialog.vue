<template>
  <div class="aop_tradecode_comps_flow">
    <PageDialog
      dialogTitle="业务规则流程图"
      :dialogVisiable="dialogVisible"
      dialogWidth="55%"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <div class="process_middle">
          <Process
            class="process_main"
            ref="process"
            :dataObj="dataObj"
            :isRead="true"
          >
          </Process>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </PageDialog>
    <DecisionList ref="decisionTreeCountRef"></DecisionList>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import Process from "@m/core/components/main_flow/comps";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Process,
  },
  props: {
    currentInterfaceObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      dataObj: {
        flow: [],
        position: "",
      },
    };
  },
  methods: {
    showDialog(data) {
      this.dialogVisible = true;
      // this.dataObj = {
      //   flow: [],
      //   position: "",
      // },
      this.$nextTick(() =>{
        this.dataObj = JSON.parse(JSON.stringify(data))
      })
    },
    closeDialog() {
      this.dialogVisible = false;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_flow {
  /deep/ .aop_tradecode_comps_page_dialog .el-dialog__body{
    max-height: 64vh;
  }
  .process_middle {
    background: $base_white;
    padding: 20px 0px;
    margin-bottom: 16px;
    height: 500px;
    // overflow: hidden;
    display: flex;
    flex-direction: column
  }
  .process_box {
    @include scrollbar;
    overflow-y: auto;
    overflow-x: auto;
  }

}
</style>
