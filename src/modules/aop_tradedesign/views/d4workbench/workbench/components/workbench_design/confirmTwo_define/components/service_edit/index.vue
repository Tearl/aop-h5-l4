<template>
  <div class="aop_tradedesign_comps_d4editor_service_define_service_edit">
    <!-- 编辑基本信息 -->
    <div class="content_eidt">
      <el-form
        :rules="rules"
        :model="formData"
        ref="form"
        label-position="right"
        label-width="130px"
        class="edit_form"
      >
        <div class="form_info content_detail">
          <div class="content_header nav_title">D4b服务基本信息</div>
          <el-form-item label="服务名称" prop="svcNm">
            <el-input
              v-model="formData.svcNm"
              clearable
              placeholder="服务名称"
            />
          </el-form-item>
          <el-form-item label="服务编码" prop="svcCd">
            <el-input
              v-model="formData.svcCd"
              clearable
              placeholder="/example"
              disabled
            >
            </el-input>
            <div class="create_form_tips"></div>
          </el-form-item>
          <el-form-item label="内外标志" prop="inOutFlg">
            <el-radio v-model="formData.inOutFlg" label="0">内部标志</el-radio>
            <el-radio v-model="formData.inOutFlg" label="1">外部标志</el-radio>
          </el-form-item>
          <el-form-item label="版本号" prop="svcVersionNo">
            <div class="form_item_flex">
              <el-input
                v-model="formData.svcVersionNo"
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
          <el-form-item label="归属银行" prop="bkId" required>
            <el-select
              v-model="formData.bkId"
              placeholder="请选择归属银行"
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
          <el-form-item label="所属系统" prop="sysId" required>
            <!-- <span>{{ formData.arsName }}</span> -->
            <el-select
              v-model="formData.sysId"
              placeholder="请选择所属系统"
              @change="sysOptionsChange"
              disabled
            >
              <el-option
                v-for="item in sysList"
                :label="item.arsName"
                :key="item.arsId"
                :value="item.arsId"
              ></el-option>
            </el-select>
            <!-- <el-button
              icon="el-icon-plus"
              class="check_formater_btn"
              type="primary"
              @click="showDialog('system')"
              >新增服务系统</el-button
            > -->
          </el-form-item>
          <el-form-item label="所属分组" prop="groupId">
            <el-select
              v-model="formData.groupId"
              placeholder="请选择所属分组"
              clearable
              @change="changeApiGroup"
              disabled
            >
              <el-option
                v-for="item in apiGroupList"
                :label="item.sgName"
                :key="item.sgId"
                :value="item.sgId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="服务大类" class="no_before">
            <el-select
              v-model="formData.svcBigTpNo"
              placeholder="请选择服务大类"
              clearable
            >
              <el-option
                v-for="item in maxTypeNameList"
                :label="item.typeName"
                :key="item.bizId"
                :value="item.typeCode"
              ></el-option>
            </el-select>
            <el-button
              icon="el-icon-plus"
              class="check_formater_btn"
              type="primary"
              @click="showDialog('maxType')"
              >新增服务大类</el-button
            >
          </el-form-item>
          <el-form-item label="服务小类" class="no_before">
            <el-select
              v-model="formData.svcSmalTpNo"
              placeholder="请选择服务小类"
              clearable
            >
              <el-option
                v-for="item in minTypeNameList"
                :label="item.typeName"
                :key="item.bizId"
                :value="item.typeCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务类型">
            <span>D4b服务</span>
          </el-form-item>
          <el-form-item label="服务描述" prop="svcDesc">
            <el-input
              type="textarea"
              :rows="3"
              v-model="formData.svcDesc"
              clearable
              placeholder="请输入服务描述"
              :maxlength="length"
            />
            <!-- <PageEditor
              v-show="showEditor"
              ref="editorRef"
              :editorText="formData.svcDesc"
            ></PageEditor> -->
          </el-form-item>
          <el-form-item label="版本描述" prop="sersionDesc">
            <el-input
              type="textarea"
              :rows="3"
              v-model="formData.sersionDesc"
              clearable
              placeholder="请输入版本描述"
              :maxlength="length"
            />
          </el-form-item>
        </div>
        <div class="content_detail">
          <div class="content_header nav_title">业务规则</div>
          <el-form-item label="业务规则" prop="bizRule">
            <div class="rules_text">
              <CreateBizRule :pageType="pageType" ref="bizRuleRef">
              </CreateBizRule>
            </div>
          </el-form-item>
        </div>
        <div class="content_detail content_detail_params">
          <div class="content_header nav_title">参数配置</div>
          <Params
            ref="paramsRef"
            :detailInfo="detailInfo"
            :arsId="formData.sysId"
          ></Params>
        </div>
      </el-form>
      <PageFooter
        @handleConfirm="confirm"
        :confirmDisabled="isConfirm"
        :cancelLabel="''"
        :confirmLabel="'保存'"
      ></PageFooter>
    </div>
    <!-- 新增服务系统 -->
    <CreateSystem
      ref="createSystemRef"
      :dialogVisiable="systemVisible"
      :bkList="bkList"
      @updateSelect="updateSelect"
      @closeDialog="closeDialog"
    ></CreateSystem>

    <!-- 新增服务大类 -->
    <CreateServiceMaxType
      ref="createServiceMaxTypeRef"
      :dialogVisiable="maxTypeVisible"
      :sysId="formData.sysId"
      @updateSelect="updateSelect"
      @closeDialog="closeDialog"
    ></CreateServiceMaxType>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import CreateBizRule from "./biz_rule";
import Params from "../../../../workbench_public/params";
import PageFooter from "@m/core/components/page_footer";
import CreateSystem from "./create_system";
import CreateServiceMaxType from "./create_service_max_type";
import { reList, mixList } from "@m/utils/paramTree";
import { unduplicated } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    CreateBizRule,
    Params,
    PageFooter,
    CreateSystem,
    CreateServiceMaxType,
  },
  props: {
  },
  data() {
    return {
      pageType: "edit",
      // 基本信息列表
      formData: {
        svcNm: "", // API名称
        svcCd: "", // Api编号
        inOutFlg: "0", // 内外标志
        svcVersionNo: "", // API版本
        sysId: "", // 系统Id
        svcBigTpNo: "", // 服务大类
        svcSmalTpNo: "", // 服务小类
        svcTpCd: "", // 服务类型
        svcDesc: "", // API描述
        sersionDesc: "", // API版本描述
        bkId: "", // 归属银行
        groupId: "", // 所属分组
      },
      //基本信息绑定的验证规则
      rules: {
        svcNm: [
          { required: true, trigger: "blur", message: "请输入API名称" },
        ],
        svcCd: [
          { required: true, trigger: "blur", message: "请输入API编号" },
        ],
        inOutFlg: [
          { required: true, trigger: "blur", message: "请选择内外标志" },
        ],
        svcVersionNo: [
          { required: true, trigger: "blur", message: "请输入API版本号" },
        ],
        sysId: [{ required: true, trigger: "blur", message: "请输入系统id" }],
        svcBigTpNo: [
          { required: true, trigger: "change", message: "请选择服务大类" },
        ],
        svcSmalTpNo: [
          { required: true, trigger: "change", message: "请选择服务小类" },
        ],
        svcTpCd: [
          { required: true, trigger: "change", message: "请选择服务类型" },
        ],
        svcDesc: [
          { required: true, trigger: "blur", message: "请输入API描述" },
        ],
        sersionDesc: [
          { required: true, trigger: "change", message: "请输入API版本描述" },
        ],
        bkId: [
          { required: true, trigger: "change", message: "请选择归属银行" },
        ],
        groupId: [
          { required: true, trigger: "change", message: "请选择所属分组" },
        ],
      },
      // 导航栏参数
      breadcrumbs: [
        {
          label: "D4b管理",
          operate: "list",
        },
        {
          label: "编辑",
        },
      ],
      detailInfo: {},
      maxTypeNameList: [],
      minTypeNameList: [],
      sysList: [],
      systemVisible: false,
      maxTypeVisible: false,
      apiId: "",
      apiState: "",
      sysId: "",
      fnctId: "",
      pageType: "edit",
      bkList: [],
      apiGroupList: [],
      isConfirm: false
    };
  },
  methods: {
    confirm() {
      this.$refs.form.validate(async (valid) => {
        console.log("确认编辑", valid);
        if (!valid) return this.$message.error("基本信息输入有误或未填写");
        const businessRuleList = this.$refs.bizRuleRef.businessRuleList
        // if (businessRuleList.length == 0)
        //   return this.$message.error("请填写业务规则");
        const sendData = this.$refs.paramsRef.sendData;
        const receiveData = this.$refs.paramsRef.receiveData;
        // if (sendData.length == 0 || receiveData.length == 0)
        //   return this.$message.error("输入参数和输出参数不能为空");

        const i = this.getOnly(sendData);
        if (i.length > 0)
          return this.$message.error(
            "输入参数的参数key: " + i[0].paramKey + "不能重复!请检查"
          );
        const l = this.getOnly(receiveData);
        if (l.length > 0)
          return this.$message.error(
            "输出参数的参数key: " + l[0].paramKey + "不能重复，请检查"
          );
        //转一维数组
        let puApiParams = JSON.parse(
          JSON.stringify(
            mixList(sendData, "children").concat(
              mixList(receiveData, "children")
            )
          )
        );
        const listFlag = puApiParams.filter((item) => {return item.paramKey == "" || item.paramCName == ""})
        if(listFlag.length > 0) return this.$message.error("参数Key及参数名称不能为空！")

        if (puApiParams) {
          puApiParams.map((item, index) => {
            item.paramIndex = index;
          });
        }
        const lvl1TypeCodeId = this.maxTypeNameList.find(item => item.typeCode == this.formData.svcBigTpNo) && this.maxTypeNameList.find(item => item.typeCode == this.formData.svcBigTpNo).bizId || ""
        const lvl2TypeCodeId = this.minTypeNameList.find(item => item.typeCode == this.formData.svcSmalTpNo) && this.minTypeNameList.find(item => item.typeCode == this.formData.svcSmalTpNo).bizId || ""
        const arsNm = this.sysList.find(item => item.arsId == this.formData.sysId) && this.sysList.find(item => item.arsId == this.formData.sysId).arsName || ""
        const groupNm = this.apiGroupList.find(item => item.sgId == this.formData.groupId) && this.apiGroupList.find(item => item.sgId == this.formData.groupId).sgName || ""
        const params = {
          fnctId: this.fnctId,
          blngTyp: "0",
          blngtoTyp: "00",
          apiId: this.formData.svcId, // ApiID
          apiName: this.formData.svcNm, // API名称
          apiCode: this.formData.svcCd, // Api编号
          inOutFlg: this.formData.inOutFlg, // 内外标志
          apiVersion: this.formData.svcVersionNo, // API版本
          arsId: this.formData.sysId, // 系统Id
          arsNm, // 系统名称
          lvl1TypeCodeId, // 服务大类
          lvl2TypeCodeId, // 服务小类
          apiServiceType: this.formData.svcTpCd, // 服务类型
          apiDesc: this.formData.svcDesc, // API描述
          versionDesc: this.formData.sersionDesc, // API版本描述
          groupId: this.formData.groupId,
          groupNm,
          businessRuleList,
          // paramList: sendData.concat(receiveData),
          paramList: puApiParams
        }
        this.isConfirm = true
        await this.rpc.d4.editD4bService(params)
        this.$notify({
          title: "成功",
          message: "保存成功",
          duration: 2000,
          type: "success",
        });
        this.isConfirm = false
        this.$emit("setTopNavActive", "read")
        // this.$router.go(-1);
      });
    },
    // 提交
    async submit(puApiParams, sendData, receiveData) {
      let params = {};
      //添加排序序号
      if (puApiParams) {
        puApiParams.map((item, index) => {
          item.paramIndex = index;
        });
      }
      // for (let key in this.detailInfo) {
      //   if (key != "sendData" && key != "receiveData") {
      //     params[key] = this.detailInfo[key];
      //   }
      // }

      const res = await this.rpc.apimgmt.handleApiMod(params);
      this.$notify({
        title: "成功",
        message: "编辑API成功",
        duration: 2000,
        type: "success",
      });
      this.$emit("toApiInfo");
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
    showDialog(e) {
      console.log(e);
      if (e == "system") {
        this.systemVisible = true;
        this.$refs.createSystemRef.formData.bkId = this.formData.bkId
        this.$refs.createSystemRef.init()
      } else if (e == "maxType") {
        this.maxTypeVisible = true;
      }
    },
    closeDialog(e) {
      if (e == "system") {
        this.systemVisible = false;
      } else if (e == "maxType") {
        this.maxTypeVisible = false;
      }
    },
    updateSelect(e) {
      if (e == "system") {
        this.getSysList();
      } else if (e == "maxType") {
        this.getMaxTypeList();
      }
    },
    // 查询系统下面的大类下拉框
    async getMaxTypeList() {
      const params = {
        arsId: this.formData.sysId,
      };
      const res = await this.rpc.public.getTypeSelectList(params);
      this.maxTypeNameList = res.serviceCodeTypeList;
    },
    // 查询系统下面的小类下拉框
    async getMinTypeList() {
      const params = {
        arsId: "00000000",
      };
      const res = await this.rpc.public.getTypeSelectList(params);
      this.minTypeNameList = res.serviceCodeTypeList;
    },
    // 获取服务系统列表
    async getSysList() {
      const params = {
        bkId: this.formData.bkId,
        serviceTypeNm: "D4b服务",
        allShowStatus: "0",
      };
      const res = await this.rpc.public.getServiceSysList(params);
      this.sysList = res.sysList;
    },
    // 版本号增减点击
    iconClick(e) {
      this.$refs.form.validateField(["versNo"], (valid) => {
        if (!!valid) return;
        if (e == "add") {
          let list = this.formData.versNo.split(".");
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
          this.formData.versNo = n;
        } else {
          let list = this.formData.versNo.split(".");
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
          this.formData.versNo = n;
        }
      });
    },
    //获取银行
    async getBankList() {
      const res = await this.rpc.public.getBankList();
      this.bkList = res.bkList;
    },
    changeBank() {
      // this.getApiGroup();
      this.getSysList();
    },
    sysOptionsChange(arsId) {
      console.log("sysOptionsChange", arsId)
      this.formData.groupId = ""
      this.getApiGroup(arsId)
      // this.search()
    },
    //获取API分组
    async getApiGroup() {
      const params = {
        arsId: this.formData.sysId,
        serviceType: this.formData.svcTpCd
      };
      const res = await this.rpc.public.getApiGroupList(params);
      this.apiGroupList = res.apiGroupList;
      // this.formData.groupId = this.apiGroupList[0] && this.apiGroupList[0].sgId || ""
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
    setData(res) {
      this.formData = res
      this.$refs.bizRuleRef.businessRuleList = res.bizRuleList
      this.$refs.paramsRef.sendData = reList(res.puApiParams.filter((item) => item.paramDirection == 0));
      this.getNodeId(this.$refs.paramsRef.sendData)
      this.$refs.paramsRef.receiveData = reList(res.puApiParams.filter((item) => item.paramDirection == 1));
      this.getNodeId(this.$refs.paramsRef.receiveData)
    },
    // 遍历数组 重新排序
    getNodeId(arrs, id) {
      let i = 0;
      while (arrs[i]) {
        arrs[i].paramOrder = id ? id + "." + (i + 1) :  i + 1 + "";
        arrs[i].paramParentId = id ? id : "";
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.getNodeId(arrs[i].children, arrs[i].paramOrder);
        }
        i++;
      }
    },
    getData(e) {
      this.getMaxTypeList();
      this.getMinTypeList();
      this.getBankList();
      this.getSysList();
      this.getApiGroup();
    },
    init() {
      this.fnctId = this.$route.query.fnctId
      this.apiId = this.$route.query.apiId
      
    },
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4editor_service_define_service_edit {
  display: flex;
  flex: 1;
  overflow: auto;
  font-family: $font_regular;
  @include scrollbar;
  .content_eidt {
    // padding: 16px 24px;
    .content_detail {
      background: $base_white;
      padding: 20px 30px;
      margin-bottom: 16px;
    }
    .content_detail:last-child {
      margin-bottom: 0;
    }
    .content_header {
      font-family: $font_medium;
      font-size: 16px;
      color: $pri_ft_color;
      letter-spacing: 0;
      margin-bottom: 20px;
      font-weight: $font_weight_600;
    }
    .edit_form {
      @include form;
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
      .check_formater_btn {
        margin-left: 16px;
        @include normal_button_common;
      }
      .no_before {
        ::v-deep .el-form-item__label::before {
          content: "";
        }
      }
    }
    ::v-deep .table_style_ft th {
      color: $sec_ft_color;
    }
    ::v-deep .table_style th {
      line-height: 0;
    }
  }
}
</style>
