<template>
  <div class="aop_tradedesign_comps_design_attr_verify_graph_validate_code_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>校验图形验证码</div>
      </div>
      <div v-if="!isRead && !fourRAttrFlag" class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              组件名称：
            </div>
            <div class="attr_show_item_c">
              <el-input :disabled="!canSave" v-model="formData.actionDesc" size="mini"></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件描述：
            </div>
            <div class="attr_show_item_c textarea">
              <el-input
                maxlength="1000"
                show-word-limit
                autosize
                :disabled="!canSave"
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="组件描述"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              交易名称：
            </div>
            <div class="attr_show_item_c lh30">{{ currentServObj.apiName }}</div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              验证码：
            </div>
            <div class="attr_show_item_c">
              <span class="text_click" @click="showDialog('verificationCode')">
                {{ getDisplayText("verificationCode") }}
              </span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              获取验证码标识：
            </div>
            <div class="attr_show_item_c">
              <span class="text_click" @click="showDialog('uniqueKey')">
                {{ getDisplayText("uniqueKey") }}
              </span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              返回结果：
            </div>
            <div class="attr_show_item_c">
              <span class="text_click" @click="showDialog('responseResult')">
                {{ getDisplayText("responseResult") }}
              </span>
            </div>
          </div>
        </div>
        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">缓存数据结构</div>
              <!-- <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                @click="saveServiceCpnParams"
              >保存</el-button> -->
            </div>
          </div>
          
          <div class="attr_recive mb20">
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="tableData"
                :table="tableColumn"
                @operate="outputTargetOperate"
                @selectChange="outputTargetSelectChange"
              ></Table>
              <!-- <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                class="mt10"
                @click="addOutputTargetLine"
              >添加一行</el-button> -->
            </div>
            <div v-if="!isRead">
              <div class="tips_info" v-if="!canSave">
                <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isRead && !fourRAttrFlag" class="attr_btn">
          <el-button
            v-if="canSave"
              type="primary"
              size="small"
              @click="saveParams"
              class="right_button"
              >保存</el-button
            >
          </div>
      </div>
      <div v-else class="attr_box">
        <div class="attr_show read">
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              组件名称：<span class="attr_show_item_i">{{
                formData.actionDesc
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              组件描述：<span class="attr_show_item_i">{{
                formData.actionMsg
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              交易名称：<span class="attr_show_item_i">{{
                currentServObj.apiName
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              验证码位数：<span class="attr_show_item_i">{{
                formData.codeLength
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              验证码类型：<span class="attr_show_item_i">{{
                getDisplayText("codeType")
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              缓存策略：<span class="attr_show_item_i">{{
                getDisplayText("cacheStrategy")
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              返回图片：<span class="attr_show_item_i">{{
                getDisplayText("responsePicture")
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              返回缓存key：<span class="attr_show_item_i">{{
                getDisplayText("uniqueKey")
              }}</span>
            </div>
          </div>
        </div>
        <div class="transition_arrange read">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">缓存数据结构</div>
            </div>
          </div>
          
          <div class="attr_recive mb20">
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="tableData"
                :table="tableColumn"
                @operate="outputTargetOperate"
                @selectChange="outputTargetSelectChange"
              ></Table>
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                class="mt10"
                @click="addOutputTargetLine"
              >添加一行</el-button>
            </div>
          </div>
        </div>
      </div>
      
      <SelectSource
        ref="selectSourceRef"
        :currentServObj="currentServObj"
        @confirm="confirm"
      ></SelectSource>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import SelectSource from "./components/selectSource"

import {
  setSessionStorage,
} from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    Table,
    SelectSource,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    currentObj: {
      type: Object,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Boolean,
      default: () => false,
    },
    showTips: {
      type: Boolean,
      default: () => true,
    },
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
    currentParentCpnInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isNeedCheck: "",
      paramValueSelect: [],
      isEnumList: false,
      formData: {
        actionDesc: "",
        actionMsg: "",
        transactionName: "", // 交易名称
        codeLength: "", // 验证码位数
        codeType: "", // 验证码类型
        cacheStrategy: "", // 缓存策略
        responsePicture: "", // 返回图片
        uniqueKey: "" // 返回缓存Key
      },
      cacheStrategyOptions: [
        { lable: "Redis", value: "Redis"},
        { lable: "数据库", value: "数据库"},
      ],
      codeTypeOptions: [
        { lable: "纯数字", value: "纯数字"},
        { lable: "纯字母", value: "纯字母"},
        { lable: "字母+数字", value: "字母+数字"},
      ],
      // loopListOptions: [],
      paramList: [],
      currentObj: {},
      cpnData: {},
      inputParamsVisibleAtSetting: true,
      // 设置页签下的输入参数表格数据
      inputParamsListAtSetting: [],
      // 控制设置页签下的输出参数列表显示或隐藏
      outputParamsVisibleAtSetting: true,
      // 设置页签下的输出参数表格数据
      outputParamsListAtSetting: [],
      loopListVisibleAtSetting: true,
      // 设置页签下的输出参数表格数据
      loopListAtSetting: [],
      tempParamsListAtSetting: [],
      tableParamList: [],
      tableType: false,
      currentRow: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      tempDataList: [],
      chooseData: [],
      // 选择参数弹框
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
        // {
        //   type: "select",
        //   model: "clsfId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
        {
          type: "select",
          model: "dictType",
          placeholder: "参数类型",
          select: [
            { type: "String", value: "String" },
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
          ],
        },
      ],
      // 输入输出参数弹框的搜索表单
      formInline: {
        content: "",
        clsfId: "",
        dictType: "",
      },
      // 选择参数分页器
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 字典参数
      // 添加参数列表参数
      dictListTables: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramCName",
          label: "参数名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "参数值类型",
          width: "90",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramLength",
          label: "参数长度",
          width: "90",
          type: "text",
          tooltip: true,
        },
      ],
      // 输入输出参数弹框列表数据
      dictList: [],
      // 输入输出参数弹框选择类型下拉框数据
      dictGategList: [],
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
        // {
        //   type: "select",
        //   model: "clsfId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
        {
          type: "select",
          model: "dictType",
          placeholder: "参数类型",
          select: [
            { type: "String", value: "String" },
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
          ],
        },
      ],
      // 当前数据
      isData: {},
      selectionData: [],
      // 输入列表数据
      iInputList: [],
      // 输出列表数据
      iOutputList: [],
      // 循环集合数据
      iLoopList: [],
      // 临时参数列表数据
      iTempList: [],
      // 参数存放
      paramList: [],
      httpData: [],
      svcIdToSvcNm: {},
      transId: "",
      compositeIdMapToParamList: {},
      tableData: [],
      layoutActionList: [],
      bizDomainNo:""
    };
  },
  computed: {
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1
        ? "10"
        : "11";
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      return false
      // const _formData = JSON.parse(JSON.stringify(this.formData));
      // _formData.inputParamsListAtSetting = this.inputParamsListAtSetting;
      // console.log("数据", this.inputParamsListAtSetting);
      // _formData.outputParamsListAtSetting = this.outputParamsListAtSetting;
      // return (
      //   this.cpnParamsRecord != JSON.stringify(_formData) &&
      //   this.actionIdRecord == this.currentObj.actionId
      // );
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId && !this.fourRAttrFlag
    },
    loopListOptions() {
      const compositeId = this.formData.cacheStrategy
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const item = dataList.find(data => data.compositeId && data.compositeId == compositeId)
      if (item || compositeId == this.transId) {
        const paramList = this.compositeIdMapToParamList[compositeId]?.paramList || []
        return paramList.filter(param => param.paramType == "List").map(param => {
          param.label = param.paramCName
          param.value = this.packageParamKey(param, paramList)
          return param
        })
      } else {
        return []
      }
    },
    tableColumn() {
      if(this.canSave) {
        return [
          {
            prop: "paramKey",
            label: "参数Key",
            minWidth: "25%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramName",
            label: "参数名称",
            minWidth: "20%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramType",
            label: "参数类型",
            width: "70",
            // minWidth: "15%",
            type: "text",
            tooltip: true,
          },
          {
            // prop: "apSource", // 当前4b交易00 L5服务20
            prop: "actionId",
            label: "来源",
            minWidth: "30%",
            type: "simulantSelect",
            placeholder: "请选择",
            inputStyle: {
              cursor: "pointer",
            },
            filter: (scope) => {
              if (scope.row.actionId && this.svcIdToSvcNm[scope.row.actionId]) {
                return this.svcIdToSvcNm[scope.row.actionId]
              } else {
                return ""
              }
            },
          },
          {
            prop: "paraMapgNm",
            label: "来源值",
            minWidth: "30%",
            type: "simulantSelect",
            placeholder: "请选择",
            inputStyle: {
              cursor: "pointer",
            },
          },
          {
            prop: "isNeed",
            label: "是否必输",
            // minWidth: "15%",
            width: "70",
            type: "text",
            tooltip: true,
            align: "center",
            filter: "paraNed",
          },
          {
            // prop: "paraMapgNm",
            prop: "paramValue",
            label: "缺省值",
            width: "70",
            // minWidth: "15%",
            type: "text",
            align: "center",
          },
        ]
      } else {
        return [
          {
            prop: "paramKey",
            label: "参数Key",
            minWidth: "30%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramName",
            label: "参数名称",
            minWidth: "25%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramType",
            label: "参数类型",
            width: "70",
            // minWidth: "15%",
            type: "text",
            tooltip: true,
          },
          {
            // prop: "apSource", // 当前4b交易00 L5服务20
            prop: "actionId",
            label: "来源",
            minWidth: "25%",
            type: "text",
            tooltip: true,
            filter: (scope) => {
              if (scope.row.actionId && this.svcIdToSvcNm[scope.row.actionId]) {
                return this.svcIdToSvcNm[scope.row.actionId]
              } else {
                return ""
              }
            },
          },
          {
            prop: "paraMapgNm",
            label: "来源值",
            minWidth: "25%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "isNeed",
            label: "是否必输",
            // minWidth: "15%",
            width: "70",
            type: "text",
            tooltip: true,
            align: "center",
            filter: "paraNed",
          },
          {
            // prop: "paraMapgNm",
            prop: "paramValue",
            label: "缺省值",
            // minWidth: "15%",
            width: "70",
            type: "text",
            align: "center",
          },
        ]
      }
    },
  },
  inject: ["getDataList"],
  methods: {
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.init()
      this.currentObj = e;
      // this.loopListOptions = obj.puApiParams.filter((item) => item.paramDirection == 0 && ["List"].includes(item.paramType));
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
        await this.getServiceArrangeList(e)
        return;
      } else {
        const params = {
          d4StusCd: "1",
          blngtoTyp: this.blngtoTyp,
          compositeId: e.compositeId || "",
        };
        const res = await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = res;
        this.paramList = res.paramList;
        res.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        // 更新实时位置序号
        ["actionSeq", "actionFrntSeq", "actionPostSeq"].forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        })
        // if (this.formData.cacheStrategy == "") this.formData.cacheStrategy = this.transId
        // await this.updateCompositeIdMapToParamList()
        // const loopList = this.formData.loopList
        // if (loopList && loopList != this.transId) {
        //   this.formData.loopList = ""
        //   await this.updateCompositeIdMapToParamList()
        //   this.formData.loopList = loopList
        // }
        await this.getServiceArrangeList(e)
      }
      this.setCpnParamsRecord();
    },
    // 查询编排列表
    async getServiceArrangeList(e) {
      console.log("getServiceArrangeList", e, this.currentServObj)
      const res = await this.rpc.d4.getServiceArrangeList({
        svcId: this.transId,
        actionId: e.compositeId,
        // parentActionId: 
      })
      this.layoutActionList = res.layoutActionList
      const tfrCdtnCd = JSON.parse(res.layoutActionList[0]?.tfrCdtnCd || "[]")
      this.tableData = tfrCdtnCd.map(item => {
        return {
          actionId: item.actionNm == "当前4b交易" ? this.transId : item.actionId,
          actionNm: item.actionNm,
          paramKey: item.paramKey,
          paramNm: item.paramNm,
          paramType: item.paramType,
          condTyp: item.condTyp,
          paramValue: item.paramValue,
          actionPostSeq: item.actionPostSeq,
        }
      })
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    async saveParams() {
      if (!this.formData.actionDesc) {
        return this.$message.error("组件名称不能为空")
      } else if (!this.formData.verificationCode) {
        return this.$message.error("验证码不能为空")
      } else if (!this.formData.uniqueKey) {
        return this.$message.error("获取验证码标识不能为空")
      } else if (!this.formData.responseResult) {
        return this.$message.error("返回结果不能为空")
      }
      // console.log(this.currentServObj.puApiParams);
      // const input = this.inputParamsListAtSetting.map((item) => {
      //   item.paramName = item.paramCName;
      //   return item;
      // });
      // console.log("数据-saveParams", this.inputParamsListAtSetting);
      // const output = this.outputParamsListAtSetting.map((item) => {
      //   item.paramName = item.paramCName;
      //   return item;
      // });
      // const loopList = this.loopListAtSetting.map((item) => {
      //   item.paramName = item.paramCName;
      //   return item;
      // });
      // this.paramList = mixList(input, "children").concat(
      //   mixList(output, "children")
      // ).concat(mixList(loopList, "children"));
      const tfrCdtnCd = this.tableData.reduce((prev, item) => {
        prev.push({
          actionId: item.actionId,
          actionNm: item.actionNm,
          paramKey: item.paramKey,
          paramNm: item.paramNm,
          paramType: item.paramType,
          condTyp: item.condTyp,
          paramValue: item.paramValue,
          actionPostSeq: item.actionPostSeq,
        })
        return prev
      }, [])
      if (tfrCdtnCd.length) {
        const keyToErrorMessage = {
          actionId: "来源不能为空",
          paramKey: "返回字段不能为空",
          paramNm: "返回字段不能为空",
          condTyp: "对比关系不能为空",
          paramValue: "对比值不能为空",
          actionPostSeq: "后续顺序号不能为空",
        }
        for (let key in keyToErrorMessage) {
          if (tfrCdtnCd.some(item => !item[key])) return this.$message.error(keyToErrorMessage[key])
        }
      }
      tfrCdtnCd.forEach((item) => {
        if (item.actionNm == "当前4b交易") item.actionId = ""
      })
      const layoutServiceBeanList = {
        svcId: this.currentObj.actionOwnId,
        actionKey: "",
        actionId: this.currentObj.compositeId,
        actionNm: this.currentObj.actionName,
        actionTyp: "5",
        loSeqNo: "",
        frntLoSeqNo: "",
        postLoSeqNo: "",
        tranId: this.transId,
        tfrCdtnCd: JSON.stringify(tfrCdtnCd),
        layoutActionList: []
      }
      const confList = this.cpnData.confList || [];
      const _formData = JSON.parse(JSON.stringify(this.formData))
      // _formData.cacheStrategy = _formData.cacheStrategy == this.transId ? "" : _formData.cacheStrategy
      for (let i in _formData) {
        const target = confList.find((item) => item.confKey == i);
        if (target) {
          target.confValue = _formData[i];
        } else {
          confList.push({
            confKey: i,
            confValue: _formData[i],
            confId: "",
            confDescr: "",
            compositeId: this.currentObj?.compositeId || "",
          });
        }
      }
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.transId,
        paramList: [],
        confList,
        compositeId: this.currentObj?.compositeId || "",
      };
      const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params);
      params.compositeId = compositeId;
      this.setCpnParamsRecord();
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params, layoutServiceBeanList);
      // this.$emit("updateServiceArrangeList", layoutServiceBeanList);
      // this.$emit("toSave", true);
    },
    setCpnParamsRecord() {
      const _formData = JSON.parse(JSON.stringify(this.formData));
      _formData.inputParamsListAtSetting = this.inputParamsListAtSetting;
      _formData.outputParamsListAtSetting = this.outputParamsListAtSetting;
      this.cpnParamsRecord = JSON.stringify(_formData);
      this.actionIdRecord = this.currentObj.actionId;
      console.log("数据-setCpnParamsRecord", this.inputParamsListAtSetting);
      setSessionStorage("4R-paramsData", JSON.stringify(_formData));
    },
    getDisplayText(type) {
      if (type == "verificationCode") {
        const verificationCode = JSON.parse(this.formData.verificationCode || "{}")
        return verificationCode?.paramNm || "选择"
      } else if (type == "uniqueKey") {
        const uniqueKey = JSON.parse(this.formData.uniqueKey || "{}")
        return uniqueKey?.paramNm || "选择"
      } else if (type == "responseResult") {
        const responseResult = JSON.parse(this.formData.responseResult || "{}")
        return responseResult?.paramNm || "选择"
      }
    },
    async updateCompositeIdMapToParamList() {
      const compositeId = this.formData.cacheStrategy
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if (compositeId && apiId && !(this.compositeIdMapToParamList[compositeId]?.paramList?.length)) {
        const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
          d4StusCd: "1",
          blngtoTyp: "10",
          apiId: apiId,
          d4bApiId: this.transId,
          bizDomainNo:this.bizDomainNo
        })
        this.compositeIdMapToParamList[compositeId].paramList = res.paramList.filter((item) => item.paramDirection == 1)
      }
    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn.conf.find(item => item.name == name) || {}
    },
    // 输出目标-增加行
    addOutputTargetLine() {
      console.log("addOutputTargetLine", this.currentObj)
      const row = JSON.parse(JSON.stringify(this.layoutActionList[0] || {}))
      row.svcId = row.svcId || this.currentObj.svcId
      row.tranId = row.tranId || this.transId
      row.actionId = this.transId
      row.actionNm = "当前4b交易"
      row.postLoSeqNo = ""
      row.actionPostSeq = ""
      row.paramKey = ""
      row.paramNm = ""
      row.condTyp = "="
      row.paramValue = ""
      this.tableData.push(row)
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    outputTargetOperate(operation, data) {
      console.log("outputTargetOperate", operation, data)
      if (operation == "paramNm") {
        this.$refs.selectOutputFieldRef.showDialog(data, this.formData)
      } else if (operation == "actionPostSeq") {
        this.$refs.selectOutputPostSeqRef.showDialog(data)
      } else if (operation == "delete") {
        const index = this.tableData.indexOf(data)
        this.tableData.splice(index, 1)
      }
    },
    outputTargetSelectChange(row, prop) {
      console.log("outputTargetSelectChange", row, prop)
      if (prop == "paramNm") {
        const item = this.formData.paramList.find(item => item.paramCName == row.paramNm)
        row.paramKey = item.paramKey
      } else if (prop == "actionId") {
        row.paramKey = ""
        row.paramNm = ""
        row.actionNm = this.svcIdToSvcNm[row.actionId]
      }
    },
    setOutputTarget(type, target, obj) {
      console.log("setOutputTarget", type, target, obj, this.tableData.indexOf(target))
      if (type == "paramNm") {
        target.paramKey = obj.paramKey
        target.paramNm = obj.paramCName
        target.paramType = obj.paramType
        if (["List", "Object"].includes(target.paramType)) {
          target.paramValue = "null"
          target.condTyp = "="
        }
      } else if (type == "actionPostSeq") {
        target.actionPostSeq = obj.actionSeq
        target.postLoSeqNo = obj.actionSeq
      }
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    /**
     * @description: 把参数key组装成 parentKey.key的形式
     * @param {*} param 当前进行拼接的参数
     * @param {*} paramList 参数列表
     * @param {*} paramKey 累计拼接的paramKey
     * @return {*}
     */
    packageParamKey(param, paramList, paramKey = "") {
      const { paramOrder, paramParentId } = param
      if (paramOrder != paramParentId && paramParentId) {
        const _param = paramList.find(item => item.paramOrder == paramParentId)
        const _paramKey = `${param.paramKey}${paramKey ? "." : ""}${paramKey}`
        return this.packageParamKey(_param, paramList, _paramKey)
      } else {
        return `${param.paramKey}${paramKey ? "." : ""}${paramKey}`
      }
    },
    showDialog(type) {
      console.log("showDialog", type)
      if (!this.canSave) return
      this.$refs.selectSourceRef.showDialog(type, this.formData)
    },
    confirm(key, data) {
      console.log("confirm", key, data)
      this.formData[key] = JSON.stringify(data)
      this.formData = JSON.parse(JSON.stringify(this.formData))
    },
    init() {
      this.transId = this.$route.query.transId || this.$route.query.apiId
      // 在子流程时，使用currentParentCpnInfo中的主流程数据
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      let { apiName, puApiParams} = this.currentServObj
      puApiParams = puApiParams.filter((item) => item.paramDirection == 0)
      this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
          // const svcId = data.conf.find(item => item.name == "svcId").value
          const compositeId = data.compositeId
          if (!this.compositeIdMapToParamList[compositeId]) {
            prev[compositeId] = {
              svcId: data.actionOwnId,
              svcNm: data.actionName,
              paramList: [],
            }
          }
        }
        return prev
      }, {[this.transId]: { svcNm: "当前4b交易", svcId: this.transId, paramList: puApiParams}})
      // this.cacheStrategyOptions = Object.keys(this.compositeIdMapToParamList).reduce((prev, compositeId) => {
      //   prev.push({
      //     value: compositeId,
      //     label: this.compositeIdMapToParamList[compositeId]?.svcNm
      //   })
      //   return prev
      // }, [])
    },
  },
  created() {
    this.transId = this.$route.query.transId || this.$route.query.apiId
    this.svcIdToSvcNm = this.getDataList().reduce((prev, data) => {
      if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType)  && data.compositeId) {
        prev[data.compositeId] = data.actionName
      }
      return prev
    }, { [this.transId]: "当前4b交易" })
    this.bizDomainNo = this.$route.query.bizLineId || ""
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_design_attr_verify_graph_validate_code_attr {
  position: relative;
  height: 100%;
  .mt10 {
    margin-top: 10px;
  }
  .attr_main {
    height: 100%;
    ::v-deep .el-table__cell {
      padding: 8px 0;
      .cell {
        span {
          font-size: 12px;
        }
      }
    }
    ::v-deep tr {
      .cell {
        font-size: 12px;
        // padding: 0;
      }
    }
  }
  .attr_title {
    padding: 0px 20px;
    font-family: $font_medium;
    font-weight: 600;
    height: 44px;
    line-height: 44px;
    &.flex {
      display: flex;
      justify-content: space-between;
      .right_btn {
        color: $theme_color;
        cursor: pointer;
      }
    }
  }
  .attr_pre_title {
    // padding: 8px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .el-icon-arrow-down {
      cursor: pointer;
      &.hidden {
        transform: rotate(180deg);
      }
    }
    .attr_pre_title_b {
      color: $reg_ft_color;
      &.bold {
        font-weight: 600;
      }
    }
    .icon {
      cursor: pointer;
      background: #358aff;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 2px;
      font-weight: 400;
      color: #fff;
    }
  }
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: calc(100% - 47px);
    overflow-y: scroll;
    padding-bottom: 55px;
    &.mt10 {
      margin-top: 10px;
    }
  }
  .attr_show {
    padding: 20px 20px 0;
    overflow: hidden;
    // &.read {
    //   padding: 10px 20px;
    // }
    .attr_show_item {
      display: flex;
      margin-bottom: 10px;
      overflow: hidden;
      position: relative;
      font-size: 14px;
      &.flex {
        display: flex;
        .item_title {
          width: 80px;
          padding-right: 4px;
          padding-top: 4px;
          text-align: right;
          font-size: 12px;
          font-weight: $font_weight_600;
          &.required_fields {
            &::before {
              content: "*";
              color: $sec_danger_color;
              margin-right: 2px;
            }
          }
          &.w68 {
            width: 68px;
          }
        }
        .item_value {
          flex: 1;
          ::v-deep .el-textarea__inner {
            height: 80px;
          }
          &.select {
            ::v-deep .el-input--suffix {
              font-size: 12px;
            }
          }
          &.text {
            font-size: 12px;
            padding-top: 4px;
          }
        }
      }
      &.mb20 {
        margin-bottom: 20px;
      }
      &.pb20 {
        padding-bottom: 20px;
      }
      &.border_bottom {
        border-bottom: 1px solid #E7E7EE;
      }
      .attr_show_item_t {
        // width: 100%;
        // margin-right: 10px;
        // margin-bottom: 10px;
        padding: 5px 5px 0 0;
        // font-weight: $font_weight_600;
        white-space: nowrap;
        min-width: 120px;
        text-align: right;
        .attr_show_item_i {
          font-weight: 400;
          white-space: normal;
          word-break: break-all;
        }
        &.flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            width: 64px;
          }
          .content {
            flex: 1;
          }
          .right_btn {
            color: $theme_color;
            cursor: pointer;
          }
        }
        &.required {
          &::before {
            content: "*";
            color: red;
          }
        }
        &.textLeft {
          text-align: left;
        }
      }
      .attr_show_item_c {
        width: 100%;
        &.textarea {
          ::v-deep .el-textarea__inner {
            min-height: 60px !important;
          }
        }
        &.lh30 {
          line-height: 30px;
        }
        ::v-deep .el-select {
          width: 100%;
        }
        .text_click {
          cursor: pointer;
          color: $theme_color;
          line-height: 30px;
        }
      }
      .attr_show_item_b {
        position: absolute;
        right: 0;
        top: 0;
        ::v-deep .el-button {
          @include mini_button_common;
          height: 20px;
          &.el-button--default.is-plain {
            border-color: $sec_ft_color;
            color: $sec_ft_color;
            &:hover,
            &:focus {
              color: $sec_ft_color;
            }
          }
          &.el-button--danger.is-plain {
            border-color: $danger_color;
            &:hover,
            &:focus {
              color: $danger_color;
            }
          }
          &.el-button--primary {
            background-color: $theme_color;
            border-color: $theme_color;
          }
          &.is-plain {
            background-color: $base_white;
            &:hover,
            &:focus {
              color: $theme_color;
            }
          }
        }
        .el-icon-more {
          cursor: pointer;
        }
      }
    }
  }
  .attr_send {
    // padding: 8px 10px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .attr_recive {
    padding: 8px 20px;
    &.mb20 {
      margin-bottom: 20px;
    }
    .text_btn {
      color: $theme_color;
      cursor: pointer;
      font-size: 10px;
    }
  }
  .underLine {
    border-bottom: 1px solid $pri_br_color;
  }
  .attr_set_f {
    width: 68px;
    margin-right: 10px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ::v-deep .el-input--mini .el-input__inner {
      height: 24px;
    }
  }
  .attr_set_s {
    width: 116px;
    margin-right: 5px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .attr_set_ad {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    width: 16px;
    float: right;
    color: $reg_ft_color;
    cursor: pointer;
  }
  .attr_set_t {
    width: 16px;
    float: right;
    .key_action {
      font-size: 16px;
      height: 24px;
      line-height: 24px;
    }
    i {
      cursor: pointer;
    }
  }
  .attr_set_l {
    width: 186px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .key_title {
    padding: 0px 0px 8px;
    overflow: hidden;
    color: $sec_ft_color;
    display: flex;
    justify-content: space-between;
  }
  .key_list {
    overflow: hidden;
    .key_item {
      margin-bottom: 5px;
      overflow: hidden;
      .attr_set_f_ml {
        margin-left: 10px;
      }
      ::v-deep .el-input__inner {
        line-height: 28px;
        border: 1px solid $pri_br_color;
        border-radius: $theme_radius;
        height: 28px;
        color: $reg_ft_color;
        padding: 0 5px;
      }
    }
  }

  ::v-deep .el-input__inner {
    line-height: 32px;
    border: 1px solid $pri_br_color;
    border-radius: $theme_radius;
    height: 32px;
    color: $reg_ft_color;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  ::v-deep .el-table thead tr th {
    background-color: $table_bg_color;
  }
  .line_dialog_conf {
    .add_conf {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      display: flex;
      align-items: center;
      .add_conf_s {
        width: 90px;
      }
      .add_conf_t {
        width: 90px;
      }
      .add_conf_btn {
        // float: right;
        margin-left: auto;
      }
    }
    .add_condition {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      .add_condition_k {
        width: 110px;
        margin-right: 2px;
      }
      .add_condition_btn {
        cursor: pointer;
      }
      .hidden {
        visibility: hidden;
      }
    }
    .add_content {
      padding: 15px 20px;
      .add_content_t {
        margin-bottom: 15px;
        font-family: $font_medium;
      }
      .add_content_l {
        padding: 15px;
        background-color: $base_bg_color;
      }
    }
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
  .attr_tabs {
    display: flex;
    // justify-content: center;
    background-color: $base_white;
    width: 100%;
    border-bottom: 2px solid #dcdfe6;
    box-shadow: 0 1px 10px 0 #e7e7e7;
    // ::v-deep .el-tabs__active-bar {
    //   width: 50px !important;
    // }
    ::v-deep .el-tabs__nav-wrap::after {
      background-color: $base_white;
    }
    ::v-deep .el-tabs__header {
      margin: 0;
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        padding: 0 15px;
        font-family: $font_medium;
        letter-spacing: 0;
        min-width: 78px;
        text-align: center;
        &.is-active {
          font-weight: $font_weight_600;
        }
      }
    }
    ::v-deep .el-tabs__content {
      display: none;
    }
  }
  .form {
    width: 70%;
    margin: 24px auto;
  }
  .attr_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    width: calc(100% - 10px);
    padding: 10px;
    background: $base_white;
    z-index: 10;
    // border-left: 2px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    ::v-deep .el-button {
      @include normal_button_common;
      width: 112px;
      color: $reg_ft_color;
      background: $base_white;
      border: 1px solid $pri_br_color;
      &.el-button--primary {
        @include primary_button;
      }
    }
  }
  .service_edit_form {
    ::v-deep .el-form-item__label {
      font-size: 12px;
    }
  }
  .service_edit_form_info {
    margin-bottom: 16px;
    .el-form-item {
      margin-bottom: 8px;
    }
  }
  .rule_dialog {
    padding: 15px 24px;
    .rule_dialog_item {
      margin-bottom: 10px;
    }
  }
  .table ::v-deep .wraning_row {
    display: none;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .tips_info {
    margin-top: 10px;
  }
  .transition_arrange {
    ::v-deep .el-select__caret {
      color: #333;
      transform: rotateZ(0);
      &::before {
        content: "\e790"
      }
    }
    .tips_info {
      margin-top: 10px;
    }
    .attr_show {
      padding-top: 0px;
    }
    &.read {
      margin-top: 20px;
    }
  }
}
</style>
