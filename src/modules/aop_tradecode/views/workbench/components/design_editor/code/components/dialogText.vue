<template>
  <div class="aop_code_deployt_text">
    <el-dialog
      :title="status ? '应用日志' : '运行日志'"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="hideDialog"
    >
      <div class="aop_cod_deployt_text_container">
        <el-tabs
          v-if="status"
          v-model="activeName"
          class="aop_cod_deployt_text_tab"
        >
          <el-tab-pane label="部署日志" name="first"></el-tab-pane>
          <el-tab-pane label="运行日志" name="second"></el-tab-pane>
        </el-tabs>
        <div class="aop_cod_deployt_text_termil" ref="scrollData">
          <img
            v-if="!logText"
            :src="require('@m/assets/images/spinner.gif')"
            alt=""
          />
          <div v-html="logText"></div>
        </div>
        <div class="controll-play" :class="classText">
          <el-tooltip
            effect="dark"
            placement="top"
            :content="!playStatus ? '实时日志' : '暂停日志'"
          >
            <i :class="iconClassText" @click="handleClick()"></i>
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" content="刷新">
            <i class="el-icon-refresh-right down-load" @click="updateContent()"></i>
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" content="下载日志">
            <i class="el-icon-bottom" v-if="status" @click="downClick()"></i>
          </el-tooltip>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="hideDialog()">关闭</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>  
<script>
import { Loading } from "element-ui";
export default {
  name: "",
  props: {
    deployText: {
      default: "",
      type: String,
    },
    runtimeText: {
      default: "",
      type: String,
    },
    status: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    // deploy:部署日志;runtime:运行日志
    return {
      dialogVisible: false,
      activeName: "first",
      loading: false,
      playStatus: false,
      disabled: false,
    };
  },
  watch: {
    runtimeText() {
      this.$nextTick(() => {
        this.$refs.scrollData?.scrollTo(0, 100000);
      });
    },
    activeName() {
      this.playStatus = false
      this.$emit('endFetch')
      this.$emit("updateContent", this.activeName);
    },
    deployText() {
      this.$nextTick(() => {
        this.$refs.scrollData?.scrollTo(0, 100000);
      });
    },
    loading() {
      if (!this.loading) {
        this.$emit("endFetch");
      }
    },
  },
  computed: {
    iconClassText() {
      if (!this.status) {
        if (!this.playStatus) {
          return "white-color el-icon-video-play";
        } else {
          return "el-icon-video-pause";
        }
      }
      if (!this.playStatus) {
        if (!this.disabled) {
          return `gray-color el-icon-video-play`;
        }
        return "white-color el-icon-video-play";
      } else {
        return "el-icon-video-pause";
      }
    },
    classText() {
      if (!this.status) {
        return "top-icon";
      }
    },
    logText() {
      if (!this.status) {
        return this.runtimeText;
      }
      if (this.activeName === "first") {
        return this.deployText;
      } else {
        return this.runtimeText;
      }
    },
  },
  methods: {
    resetDev() {
      this.$emit("resetDev");
    },
    handleClick() {
      if (!this.loading || !this.status) {
        console.log('player')
        if (!this.playStatus) {
          this.$emit("updateText", this.activeName);
        } else {
          this.$emit("endFetch");
        }
        this.playStatus = !this.playStatus;
      }
    },
    submitForm() {},
    showCircle(status) {
      this.loading = status;
      this.disabled = !status
    },
    showDialog(activeName = "first") {
      this.activeName = activeName;
      this.loading = false,
      this.playStatus = false,
      this.disabled = false,
      this.dialogVisible = true;
      console.log(this.dialogVisible, "dddddd");
    },
    hideDialog() {
      this.$emit("hideClose");
      this.dialogVisible = false;
    },
    downClick() {
      this.$emit("downLoad", this.activeName);
    },
    updateContent() {
      this.$emit('updateContent', this.activeName)
    }
  },
};
</script>
<style lang="scss" scoped>
.aop_code_deployt_text {
  /deep/ .el-dialog__body {
    padding-top: 10px;
  }
  .aop_cod_deployt_text_container {
    display: flex;
    flex-direction: column;
    height: 60vh;
  }
  .aop_cod_deployt_text_termil {
    overflow-y: scroll;
    position: relative;
    padding: 10px;
    background: #000;
    color: #fff;
    height: 100%;
    img {
      width: 40px;

    }
  }
  .aop_cod_deployt_text_tab {
  }

  /deep/ .el-tabs__item {
    border: none !important;
  }
  /deep/ .el-dialog__body {
    padding-bottom: 0px;
  }
  /deep/ .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 10px;
  }
  .controll-play {
    position: absolute;
    top: 120px;
    
    right: 40px;
    background: rgb(56, 57, 90);
    padding: 5px;
    border-radius: 10px;
    display: flex;
    // width: 70px;
    i {
      color: #dddddd;
      font-size: 20px;
      cursor: pointer;
      // margin-left: 10px;
    }
    .down-load {
      margin-left: 5px;
      margin-right: 5px;
    }
    i:hover {
      // background: #fff;
    }
    .gray-color {
      color: #999;
    }
    .white-color {
      color: #dddddd !important;
    }
  }
  .top-icon {
    top: 80px !important;
  }
}
</style>