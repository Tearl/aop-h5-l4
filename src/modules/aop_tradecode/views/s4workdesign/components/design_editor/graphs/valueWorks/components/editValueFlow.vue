<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <div class="m-navbar" v-if="nav || navTwo"></div>
    <transition name="nav">
      <div class="m-navba" v-if="nav">
        <div class="m-title">用户</div>
        <el-tabs
          id="tapId"
          class="tapStyles"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane label="关联活动" name="first">
            <span slot="label" :class="{ errorRule: firstError == true }"
              >基本信息
              <i v-if="firstError == true" class="el-icon-warning-outline"></i
            ></span>
            <el-form
              ref="firstForm"
              :model="valueFlowData"
              class="formStyle"
              :rules="rules"
            >
              <el-form-item label="分段名称" prop="segName">
                <el-input
                  v-model="valueFlowData.segName"
                  placeholder="请输入分段名称"
                />
              </el-form-item>
              <el-form-item label="编码" prop="segCode">
                <el-input
                  :disabled="segCodeIn"
                  placeholder="请输入编码"
                  v-model="valueFlowData.segCode"
                />
              </el-form-item>

              <el-form-item label="描述" prop="objDesc">
                <el-input
                  v-model="valueFlowData.segDesc"
                  placeholder="请输入描述"
                  class="widthInput"
                  type="textarea"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="关联活动" name="second">
            <Table
              tableType="index"
              :table="columnList"
              :data="activeDetail"
              @operate="operate"
            ></Table>
          </el-tab-pane>
        </el-tabs>
        <page-footer
          class="pageFooter"
          leftbtn="取消"
          rightbtn="确认"
          @handleLeft="nav = false"
          @handleRight="sumbit"
        >
        </page-footer>
      </div>
      <div class="m-navba" v-if="navTwo">
        <div class="m-title">价值流</div>
        <el-form
          ref="valueFlowForm"
          :model="valueFlowData"
          class="formStyle"
          :rules="rules"
        >
          <el-form-item label="价值流ID" prop="vsmId">
            <el-input
              disabled
              v-model="valueFlowData.vsmId"
              placeholder="请输入价值流ID"
            />
          </el-form-item>
          <el-form-item label="价值流名称" prop="vsmName">
            <el-input
              placeholder="请输入价值流名称"
              v-model="valueFlowData.vsmName"
            />
          </el-form-item>
          <el-form-item label="版本" prop="vsmVersion">
            <el-input
              v-model="valueFlowData.vsmVersion"
              placeholder="请输入版本"
            />
          </el-form-item>
          <el-form-item label="描述" prop="vsmDesc">
            <el-input
              v-model="valueFlowData.vsmDesc"
              placeholder="请输入价值流描述"
              class="widthInput"
              type="textarea"
            />
          </el-form-item>
        </el-form>
        <page-footer
          class="pageFooter"
          leftbtn="取消"
          rightbtn="确认"
          @handleLeft="navTwo = false"
          @handleRight="sumbit"
        >
        </page-footer>
      </div>
    </transition>
  </div>
</template>
<script>
import PageFooter from "./../../bizWorks/components/detail_tabs/pageFooter";
import Table from "./../../bizWorks/components/detail_tabs/page_table";
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  components: {
    PageFooter,
    Table,
    // Vditor
  },
  data() {
    return {
      nav: false,
      navTwo: false,
      activeName: "first",
      valueFlowData: {},
      resolveMethod: "",
      activeDetail: "",
      segCode: "",
      segName: "",
      segCodeIn: false,
      rules: {
        segName: [
          { required: true, message: "请输入关系名称", trigger: "blur" },
        ],
        vsmName: [
          { required: true, message: "请输入价值流名称", trigger: "blur" },
        ],
        vsmVersion: [
          { required: true, message: "请输入价值流版本", trigger: "blur" },
        ],
        segCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
      },

      columnList: [
        {
          prop: "moduleId",
          label: "所属模块",
          width: "120",
          type: "text",
        },
        {
          prop: "actName",
          label: "关键活动名称",
          width: "120",
          type: "text",
        },
        {
          prop: "actDesc",
          label: "活动描述",
          width: "160",
          type: "text",
        },
        {
          prop: "actParticipant",
          label: "参与者",
          width: "120",
          type: "text",
        },
        {
          prop: "actOperatedObject",
          label: "被操作对象",
          width: "120",
          type: "text",
        },
        {
          label: "操作",
          type: "button",
          buttonList: [
            {
              desc: "查看",
              operate: "look",
            },
          ],
        },
      ],
      columnListPower: [
        {
          prop: "name",
          label: "能力",
          width: "200",
          type: "text",
        },

        {
          prop: "name2",
          label: "能力描述",
          width: "300",
          type: "text",
        },

        {
          label: "操作",
          type: "button",
          buttonList: [
            {
              desc: "查看",
              operate: "look",
            },
          ],
        },
      ],
    };
  },
  methods: {
    show(data, typeData) {
      Object.assign(this.$data, this.$options.data()); //重置data数据
      //重置data数据
      if (data?.segId) {
        this.rpc.graph
          .qryKeyActivityByVsmList({ segId: data.segId })
          .then((res) => {
            this.activeDetail = res.keyActivityInfos;
          });
      }
      this.valueFlowData = data || {};
      if (typeData == "editFlow") {
        this.navTwo = true;
      } else {
        this.nav = true;
        this.segCodeIn = data?.segCode ? true : false;
        this.segCode = data?.segCode;
        this.segName = data?.segName;
      }
      return new Promise((resolve, reject) => {
        this.resolveMethod = resolve;
      });
    },
    sumbit() {
      if (this.nav) {
        this.$refs.firstForm.validate((valid) => {
          if (valid) {
            const nodeList = [].concat(this.$parent.Stager.node.box.data);
            nodeList.map((item) => {
              if (
                item.segCode == this.valueFlowData.segCode &&
                this.segCode != this.valueFlowData.segCode
              ) {
                this.$message.error("当前分段编码与其他分段重复");
                throw "";
              }
              if (
                item.segName == this.valueFlowData.segName &&
                this.segName != this.valueFlowData.segName
              ) {
                this.$message.error("当前分段名称与其他分段重复");
                throw "";
              }
            });
            this.resolveMethod(this.valueFlowData);
            this.nav = false;
          }
        });
      } else {
        this.$refs.valueFlowForm.validate((valid) => {
          if (valid) {
            this.resolveMethod(this.valueFlowData);
            this.navTwo = false;
          }
        });
      }
    },
    operate(operate, info) {
      if (operate == "look") {
        window.open(
          `${PUBLIC_PATH}drawio/?filename=${info.actId}&name=${
            info.actName
          }&addr=${
            info.bpdFileAddr ? info.bpdFileAddr + `?t=${Date.now()}` : ""
          }`
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#app {
  font-weight: 400;
  font-family: PingFangSC-Regula;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
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
  z-index: 2;
}
/* 存放弹框内容 */
.m-navba {
  padding: 16px 24px 16px 24px;
  border-radius: 16px 0 0 16px;
  position: absolute;
  width: 800px;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 1000;
}

#tapId {
  /deep/ .el-table {
    th {
      background: #fafafc;
      color: #333;
    }
    td {
      display: table-cell;
    }
    .el-table__header {
      background: #f2f3f5;
    }
  }
}
.m-title {
  font-size: 16px;
  font-weight: 600;
}

.table-title {
  margin-top: 24px;
  font-weight: 600;
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
::v-deep .widthInput .el-textarea__inner {
  min-height: 80px !important;
}
</style>