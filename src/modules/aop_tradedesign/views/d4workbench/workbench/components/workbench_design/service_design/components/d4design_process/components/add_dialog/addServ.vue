<template>
  <div class="aop_service_dic_cmps_data_set_form_serv_Info">
    <PageDialog
      :dialogWidth="'80%'"
      :dialogVisiable="addVisible"
      :dialogTitle="servTitle"
      @closeDialog="closeDataDialog"
      :apTobody="true"
      :customClass="'customClass'"
    >
      <div slot="box">
        <div class="basic">
          <el-form
            ref="formRef"
            :model="servForm"
            :rules="rules"
            label-width="130px"
            class="edit_form"
          >
            <div class="header_title">基本信息</div>
            <el-form-item label="所属数据集" prop="">
              <span>{{ infoData.dataSetNm }}</span>
            </el-form-item>
            <el-form-item label="服务类型" prop="svcTyp">
              <el-radio-group
                v-model="servForm.svcTyp"
                @change="radioChange"
                :disabled="editFlag"
              >
                <el-radio label="D5自有服务">自有服务</el-radio>
                <el-radio label="D5直连服务">直连服务</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="服务名称" prop="svcNm">
              <el-input
                placeholder="请输入服务名称"
                v-model="servForm.svcNm"
              ></el-input>
            </el-form-item>
            <el-form-item label="服务编码" prop="svcNo">
              <el-input
                placeholder="请输入服务编码"
                v-model="servForm.svcNo"
              ></el-input>
            </el-form-item>
            <el-form-item label="服务版本" prop="svcVer">
              <div class="form_item_flex">
                <el-input
                  v-model="servForm.svcVer"
                  clearable
                  placeholder="1.0.0"
                />

                <span class="icon_right">
                  <i class="el-icon-caret-top" @click="iconClick('add')"></i>
                  <i
                    class="el-icon-caret-bottom"
                    @click="iconClick('lose')"
                  ></i>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="参与方" prop="apiServiceParticipater">
              <el-input
                placeholder="请输入参与方"
                v-model="servForm.apiServiceParticipater"
              ></el-input>
            </el-form-item>
            <el-form-item label="服务作用" prop="svcDesc">
              <el-input
                type="textarea"
                :rows="3"
                v-model="servForm.svcDesc"
                clearable
                placeholder="请输入服务作用"
                :maxlength="length"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="params">
          <Params ref="paramsRef" :dataObj="infoData"></Params>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeDataDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import Params from "./components/params";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import { mixList, reList } from "@m/utils/paramTree";
import { getSessionStorage } from "@m/utils/localStorage.js";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Params,
  },
  props: {
    // 数据集信息
    // infoData: {
    //   type: String,
    //   default: () => {},
    // },
    editFlag: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      servForm: {
        svcTyp: "D5自有服务",
        svcNm: "",
        svcNo: "",
        svcVer: "1.0.0",
        apiServiceParticipater: "",
        svcDesc: "",
      },
      rules: {
        svcTyp: [
          { required: true, trigger: "blur", message: "请选择服务类型" },
        ],
        svcNm: [{ required: true, trigger: "blur", message: "请输入服务名称" }],
        svcNo: [{ required: true, trigger: "blur", message: "请输入服务编码" }],
        svcVer: [
          { required: true, trigger: "blur", message: "请输入服务版本" },
        ],
        apiServiceParticipater: [
          { required: true, trigger: "blur", message: "请输入参与方" },
        ],
        svcDesc: [
          { required: true, trigger: "blur", message: "请输入服务作用" },
        ],
      },
      //选择数据字典参数弹窗
      addVisible: false,
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        {
          type: "select",
          model: "paraType",
          placeholder: "参数值类型",
          select: [
            { type: "String", value: "String" },
            { type: "File", value: "File" },
            { type: "List", value: "List" },
            { type: "boolean", value: "boolean" },
            { type: "char", value: "char" },
            { type: "int", value: "int" },
            { type: "byte", value: "byte" },
            { type: "short", value: "short" },
            { type: "long", value: "long" },
            { type: "float", value: "float" },
            { type: "double", value: "double" },
            { type: "Boolean", value: "Boolean" },
            { type: "Character", value: "Character" },
            { type: "Integer", value: "Integer" },
            { type: "Byte", value: "Byte" },
            { type: "Short", value: "Short" },
            { type: "Long", value: "Long" },
            { type: "Float", value: "Float" },
            { type: "Double", value: "Double" },
            { type: "BigDecimal", value: "BigDecimal" },
            { type: "Object", value: "Object" },
            { type: "Date", value: "Date" },
          ],
        },
      ],
      // 当前数据
      dataObj: {},
      dataSetNm: "",
      groupId: "",
      arsId: "",
      servTitle: "添加服务",
      addVisible: false,
      infoData: {},
    };
  },
  methods: {
    init() {},
    radioChange(e) {
      this.$emit("radioChange", e);
    },

    // 版本号增减点击
    iconClick(e) {
      this.$refs.formRef.validateField(["svcVer"], (valid) => {
        if (!!valid) return;
        if (e == "add") {
          let list = this.servForm.svcVer.split(".");
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
          this.servForm.svcVer = n;
        } else {
          let list = this.servForm.svcVer.split(".");
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
          this.servForm.svcVer = n;
        }
      });
    },
    resetForm() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
      this.searchRecord = {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        paraGateg: "", // 所属分类
      };
    },
    showDialog(type, data) {
      this.addVisible = true;
      if (type == "editData") {
        this.servTitle = "编辑服务";
        // this.getMyDataSetDetail(data);
      } else {
        this.servTitle = "添加服务";
        this.getSysId();
        // this.getDetail();
        console.log("添加数据集");
        // this.dataSetForm.classifyId = data.dataSetNo
      }
    },
    closeDataDialog() {
      this.$refs.formRef.resetFields();
      this.addVisible = false;
    },
    radioChange(e) {
      this.getSysId();
      // this.getDetail();
    },
    //根据服务类型查服务id
    async getSysId() {
        const params = {
          apiServiceType: this.servForm.svcTyp,
        };
        console.log("类型", params,);
        const res = await this.rpc.dicmgmt.getSysId(params);
        console.log("res", res,);
        this.arsId = res.arsId;
        this.groupId = res.groupId;
        this.getDetail();
    },
    //新增时获取输入输出参数模板
    async getDetail(e) {
      let params = {};
      if (e == "change") {
        const tempObj = this.templateList.filter(
          (item) => item.templateNm == "IFP3.X报文"
        );
        console.log("tempObj", tempObj);
        params = {
          templateCode: tempObj[0].templateCode,
        };
      } else {
        params = {
          arsId: this.arsId,
        };
      }
      const res = await this.rpc.dicmgmt.getHeaderInfo(params);
      if (!res.paramList.length && e != "change") {
        this.getTempData();
      }
      console.log("数据", res);
      // 处理输入参数
      const sendData = res.paramList.filter((item) => {
        return item.paramPosition != "2" && item.paramDirection == "0";
      });
      console.log(sendData,'sendData')
      this.$refs.paramsRef.sendData = reList(
        sendData,
        "paramParentId",
        "paramOrder"
      );

      // 处理输出参数
      const receiveData = res.paramList.filter((item) => {
        return item.paramPosition != "2" && item.paramDirection == "1";
      });
      this.$refs.paramsRef.receiveData = reList(
        receiveData,
        "paramParentId",
        "paramOrder"
      );
    },
    async getTempData() {
      const res = await this.rpc.dicmgmt.getFormatList();
      this.templateList = res.templates;
      this.getDetail("change");
    },
    confirm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        if (!this.$refs.paramsRef.$refs.dataSetRef.dataSetDataIdList.length)
          return this.$message.error("请从数据集中选择字段");
        //去重
        const i = this.getOnly(this.$refs.paramsRef.sendData);
        if (i.length > 0)
          return this.$message.error(
            "输入参数的参数key: " + i[0].paramKey + "不能重复!请检查"
          );
        const l = this.getOnly(this.$refs.paramsRef.receiveData);
        if (l.length > 0)
          return this.$message.error(
            "输出参数的参数key: " + l[0].paramKey + "不能重复，请检查"
          );

        //转一维数组
        let puApiParams = JSON.parse(
          JSON.stringify(
            mixList(this.$refs.paramsRef.sendData, "children").concat(
              mixList(this.$refs.paramsRef.receiveData, "children")
            )
          )
        );
        const listFlag = puApiParams.filter((item) => {
          return item.paramKey == "" || item.paramCName == "";
        });
        if (listFlag.length > 0)
          return this.$message.error("参数Key及参数名称不能为空！");

        //传参
        const params = {
          ...this.servForm,
          apiGroupId: this.groupId,
          arsId: this.arsId,
          dataSetDataIdList:
            this.$refs.paramsRef.$refs.dataSetRef.dataSetDataIdList,
          puApiParams: puApiParams,
        };
        const api = this.servTitle == "编辑服务" ? "editL5Serv" : "addL5Serv";
        console.log("确认", params, puApiParams,api);
        const res = await this.rpc.dicmgmtDefine[api](params);
        this.$notify({
          title: "成功",
          message: "成功",
          duration: 2000,
          type: "success",
        });
        this.closeDataDialog();
        this.$emit("confirmComplete")
        // this.handleCancel();
      });
    },
    getOnly(arrs, operate) {
      if (operate == "only") {
        let list = unduplicated(arrs, "paramKey");
        if (list.length == arrs.length) return [];
        return arrs.filter((item) => list.indexOf(item) == -1);
      } else {
        const list = mixList(arrs, "children");
        const data = unduplicated(list, "paramParentId");
        let i = [];
        console.log("data", data);
        data.forEach((item) => {
          const l = list.filter((it) => it.paramParentId == item.paramParentId);
          const f = this.getOnly(l, "only");
          if (f.length > 0) {
            i = f;
          }
        });
        return i;
      }
    },
  },
  created() {
    // this.init();
    this.infoData = this.$route.query
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_service_dic_cmps_data_set_form_serv_Info {
  .edit_form {
    @include form;
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #131313;
      letter-spacing: 0;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .tips {
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
    ::v-deep .el-button {
      @include large_button_common;
    }
    /deep/ .el-input {
      width: 400px;
    }
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
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
}
.customClass {
  .edit_form {
    @include form;
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #131313;
      letter-spacing: 0;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .tips {
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
    ::v-deep .el-button {
      @include large_button_common;
    }
    /deep/ .el-input {
      width: 400px;
    }
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
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
}
</style>
