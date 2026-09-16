<template>
  <div>
    <div class="m-navbar" v-if="nav || navTwo || navThree || navSer"></div>
    <!-- 隐藏dom用于存储默认信息 -->
    <div style="display: none;">
        <el-form
        ref="firstForm"
        :model="valueFlowData"
        class="formStyle"
        :rules="rules"
      >
        <el-form-item label="流程名称" prop="fnName">
          <el-input
            v-model="valueFlowData.fnName"
            placeholder="请输入流程名称"
          />
        </el-form-item>

        <el-form-item label="描述" prop="fnDesc">
          <el-input
            class="widthInput"
            type="textarea"
            v-model="valueFlowData.fnDesc"
            placeholder="请输入流程描述"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="m-navba" v-if="nav">
      <div class="m-title">流程</div>
      <el-form
        ref="firstForm"
        :model="valueFlowData"
        class="formStyle"
        :rules="rules"
      >
        <el-form-item label="流程名称" prop="fnName">
          <el-input
            v-model="valueFlowData.fnName"
            placeholder="请输入流程名称"
          />
        </el-form-item>

        <el-form-item label="描述" prop="fnDesc">
          <el-input
            class="widthInput"
            type="textarea"
            v-model="valueFlowData.fnDesc"
            placeholder="请输入流程描述"
          />
        </el-form-item>
      </el-form>

      <page-footer
        class="pageFooter"
        leftbtn="取消"
        rightbtn="确认"
        @handleLeft="cancel"
        @handleRight="sumbit"
      >
      </page-footer>
    </div>
    <!-- 接口 -->
    <div class="m-navba" v-if="navSer">
      <div class="m-title">接口</div>
      <el-form
        ref="serviceForm"
        :model="valueFlowData"
        class="formStyle"
        :rules="rules2"
      >
        <el-form-item label="接口名称" prop="fnName">
            <el-button type="text" size="small" @click.stop="change4bList('change')">更换接口</el-button>
          <el-input
            v-model="valueFlowData.fnName"
            disabled
            placeholder="请输入接口名称"
          />

        </el-form-item>

        <el-form-item label="描述" prop="fnDesc">
          <el-input
            class="widthInput"
            type="textarea"
            disabled
            v-model="valueFlowData.fnDesc"
            placeholder="请输入接口描述"
          />
        </el-form-item>
      </el-form>
      <page-footer
        class="pageFooter"
        leftbtn="取消"
        rightbtn="确认"
        @handleLeft="cancel"
        @handleRight="sumbit"
      >
      </page-footer>
      <!-- 添加接口 -->
      <Service4BDialog
            :visibleShow="visibleShowAdd"
            :dialogTitle="dialogTitle"
            :tableData="service4BList"
            :detailInfo="detailInfo"
            :formB="formA"
            :showType="showType"
            :key="'1'"
            @closeDialog="closeDialog"
            @changeItem="changeItem"
            name="service4BDialog"
        ></Service4BDialog>
    </div>
    <!-- 接口end -->
    <div class="m-navba" v-if="navTwo">
      <div class="m-title">泳道</div>
      <el-form
        ref="valueFlowForm"
        :model="valueFlowData"
        class="formStyle"
        :rules="rules"
      >
        <el-form-item label="泳道名称" prop="fnName">
          <el-input
            v-model="valueFlowData.fnName"
            placeholder="请输入泳道名称"
          />
        </el-form-item>
        <!-- <el-form-item label="泳道编码" prop="vsmName">
            <el-input
              placeholder="请输入泳道编码"
              v-model="valueFlowData.vsmName"
            />
          </el-form-item> -->
        <el-form-item label="描述" prop="fnDesc">
          <el-input
            class="widthInput"
            type="textarea"
            v-model="valueFlowData.fnDesc"
            placeholder="请输入泳道描述"
          />
        </el-form-item>
      </el-form>
      <page-footer
        class="pageFooter"
        leftbtn="取消"
        rightbtn="确认"
        @handleLeft="cancel"
        @handleRight="sumbit"
      >
      </page-footer>
    </div>
    <div class="m-navba" v-if="navThree">
      <div class="m-title">关系</div>
      <el-form
        ref="ligatureFlowForm"
        :model="valueFlowData"
        class="formStyle"
        :rules="condiRules"
      >
        <el-form-item label="描述" prop="fnrDesc">
          <el-input
            class="widthInput"
            type="textarea"
            v-model="valueFlowData.fnrDesc"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item
          v-if="valueFlowData.shape == 'ConditionConnection'"
          label="选择项"
          prop="seleType"
        >
          <el-select
            style="width: 328px"
            v-model="valueFlowData.seleType"
            placeholder="请选择"
          >
            <el-option label="YES" value="YES"></el-option>
            <el-option label="NO" value="NO"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <page-footer
        class="pageFooter"
        leftbtn="取消"
        rightbtn="确认"
        @handleLeft="cancel"
        @handleRight="sumbit"
      >
      </page-footer>
    </div>
  </div>
</template>
<script>
import PageFooter from "./../../bizWorks/components/detail_tabs/pageFooter";
import Table from "./../../bizWorks/components/detail_tabs/page_table";
import mixin from "@m/core/mixin";
import Service4BDialog from "./add_service.vue";
export default {
  mixins: [mixin],
  components: {
    PageFooter,
    Table,
    Service4BDialog,
    // Vditor
  },
  data() {
    return {
      nav: false,
      navTwo: false,
      navThree: false,
      navSer: false,
      valueFlowData: {},
      resolveMethod: "",
      rules: {
        fnName: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      rules2: {
        fnName: [{ required: true, message: "请选择接口", trigger: "blur" }],
      },
      condiRules: {
        seleType: [{ required: true, message: "请选择", trigger: "blur" }],
      },

      visibleShowAdd: false,
        dialogTitle:'',
        service4BList:[],
        formA:{},
        showType:'change',
        newNode:{},
    };
  },
  methods: {
    showNode(data) {
      Object.assign(this.$data, this.$options.data()); //重置data数据
      this.valueFlowData = data || { fnName: "", fnDesc: "" };
      if(data.fnClass=='20'){ // 接口编辑
        this.navSer = true;
      } else {
        this.nav = true;
      }
      return new Promise((resolve, reject) => {
        this.resolveMethod = resolve;
      });
    },
    showRegion(data) {
      Object.assign(this.$data, this.$options.data()); //重置data数据
      this.valueFlowData = data || { fnName: "", fnDesc: "" };
      this.navTwo = true;
      return new Promise((resolve, reject) => {
        this.resolveMethod = resolve;
      });
    },
    showEdge(data) {
      Object.assign(this.$data, this.$options.data()); //重置data数据
      this.valueFlowData = data || { fnName: "", fnDesc: "" };
      this.navThree = true;
      return new Promise((resolve, reject) => {
        this.resolveMethod = resolve;
      });
    },
    sumbit() {
      console.log("确认的编辑数据", this.valueFlowData);
      if (this.nav) {
        this.$refs.firstForm.validate((valid) => {
          if (valid) {
            this.resolveMethod(this.valueFlowData);
            this.nav = false;
          }
        });
      } else if (this.navSer) {
        this.$refs.serviceForm.validate((valid) => {
          if (valid) {
            this.resolveMethod(this.valueFlowData);
            this.navSer = false;
          }
        });
        // 更新节点dom
        if(this.showType=='20show'){
            this.$emit("saveDialog",'save',this.valueFlowData,this.newNode);
        }
      } else if (this.navTwo) {
        this.$refs.valueFlowForm.validate((valid) => {
          if (valid) {
            this.resolveMethod(this.valueFlowData);
            this.navTwo = false;
          }
        });
      } else {
        this.$refs.ligatureFlowForm.validate((valid) => {
          if (valid) {
            this.resolveMethod(this.valueFlowData);
            this.navThree = false;
          }
        });
      }
    },
    cancel() {
      this.nav = false;
      this.navTwo = false;
      this.navThree = false;
      this.navSer = false;
      this.resolveMethod();
      if(this.showType =='20show'){
            this.visibleShowAdd = false;
            this.$emit("cancelDialog",'cancle');
        }
    },
    changeItem(data){
        // 选择赋值
        this.$nextTick(()=>{
            this.valueFlowData.fnName= data.svcNm || '';
            this.valueFlowData.fnDesc = data.svcDesc || '';
            this.valueFlowData.fnSvcId = data.svcId || '';
            this.visibleShowAdd = false;
        })
    },
    clearShowNode(data) {
      Object.assign(this.$data, this.$options.data()); //重置data数据
      this.valueFlowData = data || { fnName: "", fnDesc: "" };
      return new Promise((resolve, reject) => {
        this.resolveMethod = resolve;
      });
    },
    putTextInfo(data){
        // 默认赋值
        console.log('处理隐藏式数据填充==>>',data.data)
        this.clearShowNode(data.data);
        let val = data.data.fnClass;
        let maps = {
            '00': '开始',
            '01': '结束',
            '02': '流程',
            '03': '判断',
        }
        this.nav = false; // 跳过弹窗直接走保存
        this.valueFlowData = {
            fnName: maps[val] || '',
            fnClass: val,
            fnId: data.data.fnId || '',
            fnCode: data.data.fnCode || '',
            fnDesc: data.data.fnDesc || '',
        }
        this.newNode = data.animation.cell;
        this.$refs.firstForm.validate((valid) => {
          if (valid) {
            this.resolveMethod(this.valueFlowData);
            this.nav = false;
          }
        });
        this.$emit("savePutText",'save',this.valueFlowData,this.newNode);
    },
    change4bList(val,node){
        // 选择接口
        this.service4BList= [];
        this.navSer = true;
        this.visibleShowAdd = true;
        this.dialogTitle = "选择接口";
        this.showType = val;
        if(val =='20show'){
            this.newNode = node.animation.cell
        }
    },
    // 多个弹窗关闭交互
    closeDialog(type){
        if(type=='change'){
            this.visibleShowAdd = false;
        }else if(type =='20show'){
            this.visibleShowAdd = false;
            this.$emit("cancelDialog",'cancle');
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
  z-index: 29;
}
/* 存放弹框内容 */
.m-navba {
  padding: 16px 24px 16px 24px;
  border-radius: 16px 0 0 16px;
  position: absolute;
  width: 368px;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 1000;
  max-height: 550px;
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
