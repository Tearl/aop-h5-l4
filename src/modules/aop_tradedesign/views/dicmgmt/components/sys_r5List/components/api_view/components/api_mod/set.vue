<template>
  <div class="aop_tradedesign_comps_apimgmt_api_mod_set">
    <div class="set_header">{{ type === "mod" ? "编辑API" : "复制API" }}</div>
    <el-form
      :model="formData"
      :rules="rules"
      class="create_form"
      ref="formData"
      label-width="120px"
    >
      <div class="create_form_info">
        <el-form-item label="API名称" prop="apiName">
          <el-input
            v-model="formData.apiName"
            clearable
            placeholder="请输入API名称"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="API编码" prop="apiCode">
          <el-input
            v-model="formData.apiCode"
            clearable
            placeholder="/example"
            disabled
          >
          </el-input>
          <div class="create_form_tips"></div>
        </el-form-item>
        <el-form-item label="API版本" prop="apiVersion">
          <div class="form_item_flex">
            <el-input
              v-model="formData.apiVersion"
              clearable
              placeholder="对外发布API版本号，如1.0.0"
              disabled
            />
            <!-- <span class="icon_right">
              <i class="el-icon-caret-top" @click="iconClick('add')"></i>
              <i class="el-icon-caret-bottom" @click="iconClick('lose')"></i>
            </span> -->
          </div>
        </el-form-item>
        <el-form-item label="归属用户" prop="bkId" required>
          <el-select
            v-model="formData.bkId"
            placeholder="请选择归属用户"
            clearable
            @change="changeBank"
            :disabled="type !== 'add'"
          >
            <el-option
              v-for="item in bkList"
              :label="item.bkNm"
              :key="item.bkId"
              :value="item.bkId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务资产" prop="apiGroupId">
          <el-select
            v-model="formData.apiGroupId"
            placeholder="请选择业务资产"
            clearable
            @change="changeApiGroup"
          >
            <el-option
              v-for="item in apiGroupList"
              :label="item.sgName"
              :key="item.sgId"
              :value="item.sgId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="API状态" prop="apiState">
          <el-select
            v-model="formData.apiState"
            placeholder="请选择API状态"
            clearable
            :disabled="formData.apiState === '2' || formData.apiState === '3'"
          >
            <el-option
              v-for="item in apiStateList"
              :label="item.v"
              :key="item.k"
              :value="item.k"
            ></el-option>
            <el-option
              v-if="formData.apiState === '2' || formData.apiState === '3'"
              v-for="item in apiStateDisList"
              :label="item.v"
              :key="item.k"
              :value="item.k"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务大类">
          <el-select
            v-model="formData.lvl1TypeCodeId"
            placeholder="请选择服务大类"
            clearable
          >
            <el-option
              v-for="item in maxTypeNameList"
              :label="item.typeName"
              :key="item.bizId"
              :value="item.bizId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务小类">
          <el-select
            v-model="formData.lvl2TypeCodeId"
            placeholder="请选择服务小类"
            clearable
          >
            <el-option
              v-for="item in minTypeNameList"
              :label="item.typeName"
              :key="item.bizId"
              :value="item.bizId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务应用" prop="arsId" required>
          <span>{{ formData.arsName }}</span>
        </el-form-item>
        <el-form-item label="通讯服务" prop="ssrId" required>
          <span>{{ formData.ssrName }}</span>
        </el-form-item>
        <el-form-item label="通讯报文格式" prop="formater" required>
          <span>{{ formData.formater }}</span>
          <el-button
            v-show="formData.formater !== ''"
            class="check_formater_btn"
            type="primary"
            @click="showDialog"
            >查看样例报文</el-button
          >
        </el-form-item>
        <el-form-item label="参与方" prop="apiServiceParticipater">
          <el-input
            v-model="formData.apiServiceParticipater"
            clearable
            placeholder="请输入参与方"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="服务类型" prop="apiServiceType">
          <el-select
            v-model="formData.apiServiceType"
            placeholder="请选择服务类型"
            clearable
            disabled
          >
            <el-option
              v-for="item in apiServiceTypeList"
              :label="item.v"
              :key="item.k"
              :value="item.k"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景">
          <el-select
            v-model="formData.apiSceneIdList"
            placeholder="场景"
            multiple
          >
            <el-option
              v-for="item in sceneIdList"
              :label="item.v"
              :key="item.k"
              :value="item.k"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="API作用" prop="apiDesc">
          <!-- <el-input
            type="textarea"
            :rows="3"
            v-model="formData.apiDesc"
            clearable
            placeholder="请输入API描述"
            :maxlength="length"
          /> -->
          <PageEditor
            v-show="showEditor"
            ref="editorRef"
            :editorText="formData.apiDesc"
          ></PageEditor>
        </el-form-item>
        <el-form-item label="流程图">
          <el-upload
            class="upload_file_btn"
            :action="actionUrl"
            :on-exceed="handleExceed"
            :on-success="handleImgSuccess"
            :file-list="uploadList"
            :auto-upload="true"
            :name="'uploadFile'"
            :show-file-list="false"
            :disabled="imgList.length > 0"
          >
            <div class="upload_body_btn">
              <el-button size="mini" type="primary" class="upload_button">
                <img
                  class="upload_button_plus"
                  :src="require('@m/assets/images/icon_add_back.png')"
                  alt=""
                />
                添加文件</el-button
              >
            </div>
          </el-upload>
          <div v-for="(item, i) in imgList" :key="item" class="ex_file">
            <div class="file">{{ item.path }}</div>
            <el-button
              icon="el-icon-close"
              class="close_btn"
              @click="delImg(i)"
            ></el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>

    <!-- 报文展示 -->
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="dialogTitle"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <div class="detail_content">
          <!-- 基本信息 -->
          <div class="content_header_title">报文信息</div>
          <div class="detail_row">
            <div class="left_row">
              <PageMockRow
                ref="testLeftRow"
                :title="'输入报文：'"
                :dataObj="requestStr"
                :theme="'vscode_theme'"
              ></PageMockRow>
            </div>
            <div class="left_row">
              <PageMockRow
                ref="testRightRow"
                :title="'输出报文：'"
                :dataObj="responseStr"
                :theme="'vscode_theme'"
              ></PageMockRow>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
import mixin from "@m/core/mixin";
import PageMockRow from "@m/core/components/page_mock_row";
import PageFooter from "@m/core/components/page_footer";
import PageDialog from "@m/core/components/page_dialog";
import PageEditor from "@m/core/components/page_editor";
export default {
  mixins: [mixin],
  components: {
    PageMockRow,
    PageFooter,
    PageDialog,
    PageEditor,
  },
  props: {
    type: {
      type: String,
      default: () => "add",
    },
  },
  data() {
    return {
      formData: {
        apiName: "", // 名称
        apiCode: "", // 编号
        apiVersion: "1.0.0", // 版本
        bkId: "", // 用户
        apiGroupId: "", // 资产
        arsId: "", // 服务应用
        arsName: "",
        ssrId: "", // 通讯服务
        ssrName: "",
        formater: "", // 报文格式
        apiDesc: "", // API描述
        apiServiceParticipater: "", // 参与方
        apiServiceType: "", // 服务类型
        apiSceneIdList: "", // 场景
        apiState: "0", // 状态
        lvl1TypeCodeId: "", // 大类
        lvl2TypeCodeId: "", // 大类
      },
      //基本信息绑定的验证规则
      rules: {
        apiName: [
          { required: true, trigger: "blur", message: "请输入API名称" },
        ],
        apiCode: [
          { required: true, trigger: "blur", message: "请输入API编码" },
        ],
        apiVersion: [
          { required: true, trigger: "blur", message: "请输入版本号" },
        ],
        apiGroupId: [
          { required: true, trigger: "change", message: "请选择业务资产" },
        ],
        apiServiceParticipater: [
          { required: true, trigger: "blur", message: "请输入参与方" },
        ],
        apiServiceType: [
          { required: true, trigger: "change", message: "请选择服务类型" },
        ],
        apiDesc: [
          { required: true, trigger: "blur", message: "请输入API描述" },
        ],
        apiState: [
          { required: true, trigger: "change", message: "请选择API状态" },
        ],
        // lvl1TypeCodeId: [
        //   { required: true, trigger: "change", message: "请选择服务大类" },
        // ],
        // lvl2TypeCodeId: [
        //   { required: true, trigger: "change", message: "请选择服务小类" },
        // ],
      },
      bkList: [],
      apiGroupList: [],
      apiServiceTypeList: [
        { v: "4B服务", k: "4B服务" },
        { v: "自有L5服务", k: "自有L5服务" },
        { v: "直连L5服务", k: "直连L5服务" },
      ],
      apiStateList: [
        { v: "已完成", k: "1" },
        { v: "未完成", k: "0" },
      ],
      apiStateDisList: [
        { v: "已下架", k: "3" },
        { v: "已上架", k: "2" },
      ],
      sceneIdList: [],

      dialogTitle: "样例报文",
      dialogVisiable: false,
      requestStr: "",
      responseStr: "",

      actionUrl: "",
      // 文件列表
      fileList: [],
      // IMG列表
      imgList: [],
      // 上传列表
      uploadList: [],

      showEditor: false,
      maxTypeNameList: [],
      minTypeNameList: []
    };
  },
  methods: {
    init() {
      this.actionUrl = this.rpc.file.pUp();
      this.getBankList();
    },
    // 取消
    cancel() {
      this.$router.go(-1);
    },
    //保存
    async save() {
      this.$refs.formData.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        this.$emit("saveChange", 1);
      });
    },
    //获取用户
    async getBankList() {
      const res = await this.rpc.public.getBankList();
      this.bkList = res.bkList;
    },
    //获取业务资产
    async getApiGroup() {
      const params = {
        arsId: this.formData.arsId,
        serviceType: this.formData.apiServiceType == "R4b服务" ? "4B服务" : (this.formData.apiServiceType == "R5自有服务" ? "自有L5服务" : this.formData.apiServiceType)
      };
      const res = await this.rpc.public.getApiGroupList(params);
      this.apiGroupList = res.apiGroupList;
    },
    //获取路由Path
    // async getPath() {
    //   const params = { apiPath: this.formData.apiCode };
    //   const res = await this.rpc.public.matchRouter(params);
    //   this.formData.apiRoutePath = res.matchPath;
    //   this.formData.routeName = res.routeName;
    // },
    //获取场景
    async getSceneIdList() {
      const params = {
        arsId: this.formData.arsId,
        serviceType: this.formData.apiServiceType
      };
      const res = await this.rpc.public.getSceneIdList(params);
      const list = res.sceneInfoList.map((item) => {
        item.v = item.sceneName;
        item.k = item.sceneId;
        return item;
      });
      this.sceneIdList = list;
    },
    changeBank() {
      this.getApiGroup();
    },
    changeApiGroup(e) {
      const res = this.apiGroupList.filter((item) => item.sgId == e)[0];
      this.formData.apiGroupName = res.sgName;
      this.formData.arsId = res.arsId;
      this.formData.arsName = res.arsName;
      this.formData.ssrId = res.srrId;
      this.formData.ssrName = res.srrName;
      this.formData.relySysName = res.arsName;
      this.formData.formater = res.msgFormater;
      this.requestStr = res.reqMsg;
      this.responseStr = res.respMsg;
    },
    async getMaxTypeList() {
      const params = {
        arsId: this.formData.arsId
      }
      const res = await this.rpc.apimgmt.getTypeSelectList(params);
      this.maxTypeNameList = res.serviceCodeTypeList
    },
    async getMinTypeList() {
      const params = {
        arsId: "00000000"
      }
      const res = await this.rpc.apimgmt.getTypeSelectList(params);
      this.minTypeNameList = res.serviceCodeTypeList
    },
    showDialog() {
      this.dialogVisiable = true;
    },
    closeDialog() {
      this.dialogVisiable = false;
    },
    // 版本号增减点击
    iconClick(e) {
      this.$refs.formData.validateField(["apiVersion"], (valid) => {
        if (valid) return;
        if (e == "add") {
          let list = this.formData.apiVersion.split(".");
          list[2] = Number(list[2]) + 1;
          if (list[2] > 9) {
            list[2] = 0;
            list[1] = Number(list[1]) + 1;
            if (list[1] > 9) {
              list[1] = 0;
              list[0] = Number(list[0]) + 1;
              if (list[0] > 9) return;
            }
          }
          let n = list.join(".");
          this.formData.apiVersion = n;
        } else {
          let list = this.formData.apiVersion.split(".");
          list[2] = Number(list[2]) - 1;
          if (list[2] < 0) {
            list[2] = 9;
            list[1] = Number(list[1]) - 1;
            if (list[1] < 0) {
              list[1] = 9;
              list[0] = Number(list[0]) - 1;
              if (list[0] < 1) return;
            }
          }
          let n = list.join(".");
          this.formData.apiVersion = n;
        }
      });
    },

    // img上传成功
    handleImgSuccess(response) {
      if (response.header.errorCode == "0") {
        this.$notify({
          title: "成功",
          message: "上传成功",
          duration: 2000,
          type: "success",
        });
        this.imgList.push({
          path: response.body.path,
        });
      } else {
        this.$message.error(response.header.errorMsg);
      }
    },
    delImg(e) {
      this.imgList.splice(e, 1);
    }
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_mod_set {
  .set_header {
    padding: 20px 30px 0;
    font-family: $font_medium;
    font-size: 16px;
    color: $pri_ft_color;
    letter-spacing: 0;
    font-weight: $font_weight_600;
  }
  .create_form {
    padding-top: 16px;
    @include form(".create_form_info");
    .create_form_tips {
      width: 500px;
      position: absolute;
      left: 420px;
      top: 0px;
      height: 40px;
      line-height: 40px;
      font-family: $font_regular;
      font-size: 12px;
      color: $sec_ft_color;
      letter-spacing: 0;
    }
  }
  .create_form_info {
    padding: 0px 30px 0;
    .upload_button_plus {
      display: block;
      height: 20px;
      width: 20px;
      margin: 0 auto;
      margin-bottom: 2px;
    }
    .ex_file {
      width: 100%;
      height: 40px;
      position: relative;
      .file {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .close_btn {
        color: $base_white;
        position: absolute;
        right: -16px;
        top: 8px;
        bottom: 0;
        border: 0;
        height: 16px;
        width: 16px;
        line-height: 16px;
        border-radius: 50%;
        background-color: rgba(51, 51, 51, 0.7);
        text-align: center;
        overflow: hidden;
        padding: 0;
      }
    }
    .upload_button {
      width: 80px;
      height: 80px;
      background-color: $base_bg_color;
      border: 1px solid $pri_br_color;
      color: $sec_ft_color;
    }
  }
  .detail_content {
    background: $base_white;
    margin-bottom: 20px;
    .detail_row {
      margin-top: 10px;
      .left_row {
        width: 100%;
        padding-top: 16px;
        position: relative;
        ::v-deep .el-textarea__inner {
          min-height: 600px !important;
        }
        ::v-deep .jv-code {
          min-height: 500px;
        }
      }
    }
    .content_header_title {
      font-family: $font_medium;
      font-size: 16px;
      color: $pri_ft_color;
      letter-spacing: 0;
      font-weight: $font_weight_600;
    }
  }
  .form_item_flex {
    display: flex;
    .icon_right {
      margin-left: 5px;
      display: flex;
      flex-flow: column;
      font-size: 21px;
      i {
        cursor: pointer;
        line-height: 20px;
      }
    }
  }
  .check_formater_btn {
    margin-left: 16px;
    @include normal_button_common;
  }
}
</style>
