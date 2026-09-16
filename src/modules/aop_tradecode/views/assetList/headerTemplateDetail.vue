<template>
  <div class="aop_endentry_assetList_list_detail">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <el-container>
      <el-header style="height: auto" class="aop_endentry_assetList_list_detail_header">
          <div class="aop_endentry_assetList_list_detail_title">基本信息：</div>
          <div v-if="type === 'detail'">
            <div class="aop_endentry_assetList_list_detail_item">
              模板名称：<span >{{detailData.templateNm}}</span>
            </div>
            <div class="aop_endentry_assetList_list_detail_item">
              使用工程数：<span class="blue_text" @click="handleShow()">{{detailData.useAppNum}}</span>
            </div>
            <div class="aop_endentry_assetList_list_detail_item">
              业务域：<span>{{detailData.bizDomainNm}}</span>
            </div>
            <div>
              <div class="aop_endentry_assetList_list_detail_item" style="width: 500px;">
                模板描述：<span>{{detailData.templateDesc}}</span>
              </div>
            </div>
          </div>
          <div v-if="type === 'edit'">
            <div class="aop_endentry_assetList_list_detail_item">
              <span class="red">*</span>&nbsp;模板名称：<el-input style="width: 200px;"  size="small" v-model="detailData.templateNm"></el-input>
            </div>
            <div class="aop_endentry_assetList_list_detail_item">
              使用工程数：<span class="blue_text" @click="handleShow()">{{detailData.useAppNum}}</span>
            </div>
            <div class="aop_endentry_assetList_list_detail_item">
              业务域：<span>{{detailData.bizDomainNm}}</span>
            </div>
            <div>
              <div class="aop_endentry_assetList_list_detail_item" style="width: 100%;">
                &nbsp;&nbsp;模板描述：<el-input style=" flex: 1;" type="textarea"  size="small" v-model="detailData.templateDesc"></el-input>
              </div>
            </div>
          <el-button type="primary" size="small" class="save_btn" @click="saveData">保存</el-button>

          </div>

      </el-header>
      <el-main class="preview_main">
        <div class="wrap">
          <div class="warp_header">
            <div class="aop_endentry_assetList_list_detail_title">
              HTTP请求头：
            </div>
            <el-button type="primary" size="small" @click="handleShowDialog(httpParamList)" v-if="isEditor">从元数据添加</el-button>
          </div>
          <PageTable
            class="table_style"
            :table="tables"
            :data="httpParamList"
            :treeProps="{ children: 'paramList', hasChildren: 'hasChildren' }"
            @operate="operate"
            key="paramId"
            ref="dialogTableRef"
            rowK="paramId"
            :show-overflow-tooltip="true"
          ></PageTable>
        </div>
        <div class="wrap">
          <div class="warp_header">
            <div class="aop_endentry_assetList_list_detail_title">
              输入：
            </div>
            <el-button type="primary" size="small"  @click="handleShowDialog(inputParamList)" v-if="isEditor">从元数据添加</el-button>
          </div>
          <PageTable
            class="table_style"
            :table="tables"
            :data="inputParamList"
            :treeProps="{ children: 'paramList', hasChildren: 'hasChildren' }"
            @operate="operate"
            key="paramId"
            ref="dialogTableRef"
            rowK="paramId"
            :show-overflow-tooltip="true"
          ></PageTable>
        </div>

        <div class="wrap">
          <div class="warp_header">
            <div class="aop_endentry_assetList_list_detail_title">
              输出：
            </div>
            <el-button type="primary" size="small"  @click="handleShowDialog(outputParamList)" v-if="isEditor">从元数据添加</el-button>
          </div>
          <PageTable
            class="table_style"
            :table="tables"
            :data="outputParamList"
            :treeProps="{ children: 'paramList', hasChildren: 'hasChildren' }"
            @operate="operate"
            key="paramId"
            ref="dialogTableRef"
            rowK="paramId"
            :show-overflow-tooltip="true"
          ></PageTable>
        </div>
      </el-main>
    </el-container>
    <!-- <addUserDefined ref="addUserDefined" @saveParams="saveParams"></addUserDefined> -->
    <projectList ref="projectList"></projectList>
    <aopBusinessDatadict ref="aopBusinessDatadict" @selectConfirm="saveParams" />
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import PageHeader from "@m/core/components/page_header";
import PageTable from "@m/core/components/page_table_workgate";
import commonTableOperate from "./components/CommonTableOperate.vue";
import { setParamOrder } from "@m/utils/paramTree";
import projectList from "./components/projectList";

import addUserDefined from "@m/core/components/download_design/page_big_data/addUserDefined";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageTable,
    commonTableOperate,
    addUserDefined,
    projectList,
  },
  props: {},
  data() {
    return {
      treeData: [],

      //搜索条件
      formSearch: {
        labelIdNm: "",
        label1LvlClassCd: "",
        label2LvlClassCd: "",
        turnPageShowNum: 10,
        currentPage: 1,
      },
      createForm: {
        srcTemplateId: '',
        templateNm: '',
        templateDesc: '',
      },
      options: [
      ],
      showSearch: true,
      zoomSize: 1,
      // 右侧待选项的数据列表
      selectItemKeyList: [],
      selectedKey: [],
      toggleIndex: 0,
      tableColumnList: [],
      showSearchForm: true,
      tables: [
        {
          prop: "paramEngNm",
          label: "英文名称",
          minWidth: "250",
          type: "input",
          inputStyle: 'width: 150px;',
          // tooltip: true,
          disabled: (scope) => {
            return scope.row.disabled
          }

        },
        {
          prop: "paramChiNm",
          label: "中文名称",
          minWidth: "120",
          type: "input",
          tooltip: true,
          disabled: (scope) => {
            return scope.row.disabled
          }
        },
        {
          prop: "paramType",
          label: "值类型",
          minWidth: "110",
          type: "text",
          tooltip: true,
          disabled: (scope) => {
            return scope.row.disabled
          }
        },
        {
          prop: "paramMaxLength",
          label: "长度",
          minWidth: "150",
          type: "text",
          tooltip: true,
          disabled: (scope) => {
            return scope.row.disabled
          }
        },
        {
          prop: "paramMustFlg",
          label: "是否必输",
          minWidth: "170",
          type: "select",
          tooltip: true,
          selectVal: [
            { type: "是", value: "1" },
            { type: "否", value: "0" },
          ],
          disabled: (scope) => {
            return scope.row.defautlDisabled
          }
        },
        {
          prop: "paramDefaultVal",
          label: "默认值",
          minWidth: "100",
          type: "input",
          disabled: (scope) => {
            return scope.row.defautlDisabled
          }
        },
        {
          prop: "paramDesc",
          label: "描述",
          minWidth: "100",
          type: "input",
          tooltip: true,
          disabled: (scope) => {
            return scope.row.disabled
          }
        },
        {
          label: "操作",
          type: "button",
          fixed: "right",
          width: "250",
          buttonList: [
            {
              desc: "从元数据添加",
              operate: "add",
              relation(scope) {
                return (scope.row.paramType === 'List' || scope.row.paramType === 'Object') && scope.row.paramEngNm !== 'bodyData' && scope.row.paramEngNm !== 'bodyOutData';
              }
            },
            {
              desc: "删除",
              operate: "del",
              relation(scope) {
                return scope.row.addDisabled
              }
            },
            {
              desc: "添加对象",
              operate: "addObj",
              relation(scope) {
                return (scope.row.paramType === 'List' || scope.row.paramType === 'Object') && scope.row.paramEngNm !== 'bodyData' && scope.row.paramEngNm !== 'bodyOutData';
              }
            },
            {
              desc: "添加列表",
              operate: "addList",
              relation(scope) {
                return (scope.row.paramType === 'List' || scope.row.paramType === 'Object') && scope.row.paramEngNm !== 'bodyData' && scope.row.paramEngNm !== 'bodyOutData';
              }
            },
          ],
        },
      ],
      //列表数量
      turnPageTotalNum: 0,
      buttonList: [
        {
          name: "查看",
          color: "#358aff",
          type: "look",
          isDisabled: false,
        },
        {
          name: "编辑",
          color: "#358aff",
          type: "edit",
          isDisabled: false,
        },
        {
          name: "复制",
          color: "#358aff",
          type: "copy",
          isDisabled: false,
        },
        {
          name: "删除",
          color: "red",
          type: "del",
          isDisabled: false,
        },
      ],
      drawerTitle: "新增标签",
      drawShowType: "add",
      templateId: '',
      detailData: {},
      httpParamList: [],
      inputParamList: [],
      outputParamList: [],
      targetData: null,
      type: '',
      options: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    isEditor() {
      return this.type === 'edit'
    },
    breadcrumbs() {
      if (this.type === 'detail') {
        return [
          {
            label: "报文模板列表",
            operate: "list",
          },
          {
            label: "报文模板详情",
          },
        ];
      } else {
        return [
          {
            label: "报文模板列表",
            operate: "list",
          },
          {
            label: "报文模板编辑",
          },
        ];
      }

    },
  },
  methods: {
    async getOptions() {
      const res = await this.rpc.assetList.getBizAppList();
      console.log(this.options);
      // this.options = res.busiApplicationList
      // this.options = arr;
      // console.log()
      let arr = []
      for (let i = 0; i < res.busiApplicationList.length; i++) {
        const item = res.busiApplicationList[i];
        if (!arr.includes(item.bizDomainNo)) {
          this.options.push({
            label: item.bizDomainName,
            value: item.bizDomainNo,
          })
          arr.push(item.bizDomainNo)
        }
      }
      console.log(this.options, 'options')
      // this.options.forEach((item) => {
      //   item.label = item.bizAppName;
      //   item.value = item.bizDomainNo;
      // });
      
      // console.log(this.options, arr)
      // this.op;
    },
    async saveData() {
      const res1 = this.checkData(this.httpParamList)
      if (!res1) {
        return
      }
      const res2 = this.checkData(this.outputParamList)
      if (!res2) {
        return
      }
      const res3 = this.checkData(this.inputParamList)
      if (!res3) {
        return
      }
      // setParamOrder(arr, paramOrder, paramParentId = "", key = "paramOrder", childKey = "children") 
      this.setDataParent(this.httpParamList, false, '1')
      this.setDataParent(this.outputParamList, false, '3')
      this.setDataParent(this.inputParamList, false, '2')
      setParamOrder(this.httpParamList, '', '', "paramNode", "paramList", "paramParentNode")
      setParamOrder(this.outputParamList, '', '', "paramNode", "paramList", "paramParentNode")
      setParamOrder(this.inputParamList, '', '', "paramNode", "paramList", "paramParentNode")
      await this.rpc.assetList.commitMessageTemplateDetailInfo({
        ...this.detailData,
        inputParamList: this.inputParamList,
        outputParamList: this.outputParamList,
        httpParamList: this.httpParamList
      })
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
      this.getParamList()
    },
    isCheckRepetition(data, targetData) {
      for (let i = 0; i < data.length; i++) {
        const item1 = data[i];
        for (let j = 0; j < targetData.length; j++) {
          const item2 = targetData[j];
          if (item1.fieldKeyName === item2.paramEngNm) {
            return false
          }
        }
      }
      return true
    },
    checkData(data) {
      for (let i = 0; i < data.length; i++) {
        const item1 = data[i];
        if (!item1.paramEngNm) {
          this.$notify({
            title: "失败",
            message: "英文名称不能为空",
            duration: 2000,
            type: "error",
          });
          return false
        }
        if (!item1.paramChiNm) {
          this.$notify({
            title: "失败",
            message: "中文名称不能为空",
            duration: 2000,
            type: "error",
          });
          return false
        }
        if (item1.paramList && item1.paramList.length > 0) {
          const res =  this.checkData(item1.paramList)
          if (!res) {
            return res
          }
        }
      }
      return true
    },
    saveParams(sendData) {
      const data = sendData.data
      const res = this.isCheckRepetition(data, this.targetData)
      if (!res) {
        this.$confirm("出现重复选项，请重新选择", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
        })
        return
      }
      if (res) {
        const list = this.changeData(data)
        this.targetData.push(...list)
      }
    },
    changeData(data, status) {
      const list = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        // paramEngNm
        // paramChiNm
        // paramDesc
        // paramDefaultVal
        // paramDirectionCd
        // paramPositionCd
        // paramMustFlg
        // paramNode
        // paramParentNode
        // paramType
        // paramMaxLength
        // paramIndex
        const obj = {
          paramEngNm: item.fieldKeyName,
          paramChiNm: item.fieldName,
          paramDefaultVal: '',
          paramMustFlg: '0',
          paramType: item.fieldType,
          paramMaxLength: item.fieldLength,
          paramList: '',
          paramDesc: item.fieldBusiness,
          parent: this.targetData,
          disabled: true,
          paramId: item.fieldId,
          hasChildren: false,
        }
        list.push(obj)
      }
      return list
    },
    setDataParent(data, status = true, dircetion, index = 1) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (status) {
          item.parent = data
          item.disabled = true
        } else {
          item.paramDirectionCd = dircetion
          if (dircetion === '1') {
            item.paramPositionCd = dircetion
          } else {
            item.paramPositionCd = '2'
          }
          item.paramIndex = index
          index = index + 1
          item.parent = null
          item.disabled = true
          item.defautlDisabled = true
        }
        if (item.paramList && item.paramList.length) {
          index = this.setDataParent(item.paramList, status, dircetion, index)
        }
      }
      return index
    },
    handleShow() {
      this.$refs.projectList.showDialog(this.detailData.templateId)
    },
    handleShowDialog(data) {
      this.targetData = data
      this.$refs.aopBusinessDatadict.openDatadict({
        fieldSource: 'develop'
      })

      // this.showDialog()
    },
    async getParamList() {
      const res = await this.rpc.assetList.queryMessageTemplateParamList({
        templateId: this.templateId,
      })
      this.httpParamList = res.httpParamList
      this.inputParamList = res.inputParamList
      this.outputParamList = res.outputParamList
      if (this.inputParamList.length === 0) {
        this.inputParamList = [
          {
            paramEngNm: 'reqHeaderData',
            paramChiNm: '请求系统报文头',
            paramDefaultVal: '',
            paramMustFlg: '1',
            paramType: 'Object',
            paramMaxLength: '',
            paramList: [],
            paramDesc: '',
            parent: '',
            disabled: true,
            defautlDisabled: true,
            paramId: 1,
          },
          {
            paramEngNm: 'bodyData',
            paramChiNm: '请求体',
            paramDefaultVal: '',
            paramMustFlg: '1',
            paramType: 'Object',
            paramMaxLength: '',
            paramList: [],
            paramDesc: '',
            parent: '',
            disabled: true,
            defautlDisabled: true,
            paramId: 2,
            addDisabled: false,
          },
          {
            paramEngNm: 'channelData',
            paramChiNm: '渠道信息',
            paramDefaultVal: '',
            paramMustFlg: '1',
            paramType: 'Object',
            paramMaxLength: '',
            paramList: [],
            paramDesc: '',
            parent: '',
            disabled: true,
            defautlDisabled: true,
            paramId: 3,
          },
          {
            paramEngNm: 'securityData',
            paramChiNm: '安全信息',
            paramDefaultVal: '',
            paramMustFlg: '1',
            paramType: 'Object',
            paramMaxLength: '',
            paramList: [],
            paramDesc: '',
            parent: '',
            disabled: true,
            defautlDisabled: true,
            paramId: 4,
          },
          {
            paramEngNm: 'commonData',
            paramChiNm: '公共信息',
            paramDefaultVal: '',
            paramMustFlg: '1',
            paramType: 'Object',
            paramMaxLength: '',
            paramList: [],
            paramDesc: '',
            parent: '',
            disabled: true,
            defautlDisabled: true,
            paramId: 5,
          }
        ]
      }
      if (this.outputParamList.length === 0) {
        this.outputParamList = [
          {
            paramEngNm: 'resHeaderData',
            paramChiNm: '报文头',
            paramDefaultVal: '',
            paramMustFlg: '1',
            paramType: 'Object',
            paramMaxLength: '',
            paramList: [],
            paramDesc: '',
            parent: '',
            disabled: true,
            defautlDisabled: true,
            paramId: 1,
          },
          {
            paramEngNm: 'bodyOutData',
            paramChiNm: '请求体',
            paramDefaultVal: '',
            paramMustFlg: '1',
            paramType: 'Object',
            paramMaxLength: '',
            paramList: [],
            paramDesc: '',
            parent: '',
            disabled: true,
            defautlDisabled: true,
            paramId: 2,
            addDisabled: false,
          },
        ]
      }
      this.$nextTick((() => {
        this.setDataParent(this.httpParamList)
        this.setDataParent(this.inputParamList)
        this.setDataParent(this.outputParamList)
      }))
    },
    async getHeader() {
      const res = await this.rpc.assetList.queryMessageTemplateBaseInfo({
        templateId: this.templateId,
      })
      this.detailData = res
    },
    handleClose() {
      this.visibleShow = false
    },
    handleAdd() {
      this.visibleShow = true;
    },
    //commonTableOperate组件函数
    changeComlunTable(val) {
      this.selectedKey = val;
      this.selectItemKeyList = val;
    },
    // 顶部导航栏点击
    labelClick() {
      this.$router.push({
        path: "/aop_tradecode/assetALLList/headerTemplateManager",
      });
    },
    createId() {
      let paramId = "";
      const paramIdLength = 6;
      const random = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      for (let i = 0; i < paramIdLength; i++) {
        let indexId = Math.floor(Math.random() * 26);
        paramId += random[indexId];
      }
      return paramId;
    },
    operate(operation, data) {
      // return
      if (operation === 'add') {
        const target = data.paramList
        this.handleShowDialog(target)
      } else if (operation === 'del') {
        // con
        const parent = data.parent 
        console.log(parent, data)
        const index = parent.indexOf(data)
        parent.splice(index, 1)
      } else if (operation === 'addObj') {
        const parent = data.paramList
        const item = {
          paramEngNm: '',
          paramChiNm: '',
          paramDefaultVal: '',
          paramMustFlg: '0',
          paramType: 'Object',
          paramMaxLength: '',
          paramList: [],
          paramDesc: '',
          parent: parent,
          disabled: false,
          defautlDisabled: false,
          paramId: this.createId(),
          addDisabled: false,
        }
        parent.push(item)
      } else if (operation === 'addList') {
        const parent = data.paramList
        const item = {
          paramEngNm: '',
          paramChiNm: '',
          paramDefaultVal: '',
          paramMustFlg: '0',
          paramType: 'List',
          paramMaxLength: '',
          paramList: [],
          paramDesc: '',
          parent: parent,
          disabled: false,
          defautlDisabled: false,
          paramId: this.createId(),
          addDisabled: false,
        }
        parent.push(item)
      }
    },
    // 所有活动标签列表
  },
  created() {
    this.templateId = this.$route.query.templateId
    this.type = this.$route.query.type
    if (this.type === 'detail') {
      this.tables = [
        {
          prop: "paramEngNm",
          label: "英文名称",
          minWidth: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramChiNm",
          label: "中文名称",
          minWidth: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "值类型",
          minWidth: "110",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramMaxLength",
          label: "长度",
          minWidth: "150",
          type: "text",
          tooltip: true,
          operate: "useAppNum",
        },
        {
          prop: "paramMustFlg",
          label: "是否必输",
          minWidth: "170",
          type: "text",
          tooltip: true,
          selectVal: [
            { type: "是", value: "1" },
            { type: "否", value: "0" },
          ],
        },
        {
          prop: "paramDefaultVal",
          label: "默认值",
          minWidth: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "描述",
          minWidth: "100",
          type: "text",
          tooltip: true,
        },
      ]
    }
    this.getHeader()
    this.getOptions()

    this.getParamList()
  },
  mounted() {
    // this.queryLabelBaseInfoPageList(); // 查询标签列表
  },
  beforeDestroy() {
    this.treeData = [];
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
  watch: {},
  filters: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_endentry_assetList_list_detail {
  background-color: $base_white;
  width: 100%;
  position: relative;
  .aop_endentry_assetList_list_detail_header {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .save_btn {
    position: fixed;
    top: 165px;
    right: 30px;
    z-index: 100;
  }
  .aop_endentry_assetList_list_detail_title {
    font-size: 16px;
    color: #131313;
    letter-spacing: 0;
    font-weight: 600;
  }
  .aop_endentry_assetList_list_detail_item {
    font-size: 14px;
    color: #999;
    letter-spacing: 0;
    display: inline-block;
    display: inline-flex;
    align-items: center;
    width: 30%;
    margin-top: 8px;
    margin-bottom: 8px;

    .blue_text {
      color: #358aff;
      cursor: pointer;
    }
    span {
      color: #131313;
    }
    .red {
      color: #F56C6C;
    }
  }

  .el-container {
    width: 100%;
    // height: calc(100vh - 88px);
    overflow: hidden;
    background: #f5f5f5;
    padding: 12px 12px;
  }
  h3 {
    font-size: 16px;
    font-family: PingFangSC-Semibold;
    color: #111111;
    letter-spacing: 0;
    line-height: 24px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
  .dialog-btn-container {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  .el-header {
    background-color: #fff;
    margin-bottom: 10px;
    position: relative;
    .el-form {
      margin-top: 30px;
    }
    .demo-form-inline {
      width: 100%;
      margin: 16px 0px 0 0;
      background: #ffffff;
      .input_search_num {
        max-width: 150px;
        /deep/ .el-input__inner {
          input {
            min-width: 120px !important;
            max-width: 130px !important;
          }
        }
      }
      .input_search_select1 {
        /deep/ .el-form-item__content {
          input {
            min-width: 130px !important;
            max-width: 150px !important;
          }
        }
      }
      .input_search_select2 {
        /deep/ .el-form-item__content {
          input {
            min-width: 125px !important;
            max-width: 145px !important;
          }
        }
      }
      .input_search_name {
        max-width: 90px;
      }
      .input_search_time {
        max-width: 250px;
      }
      /deep/.el-date-editor .el-range-separator {
        min-width: 25px !important;
      }
      ::v-deep .el-button {
        min-width: 64px;
        height: 32px;
        font-size: 14px;
      }
    }
  }
  .preview_main {
    padding: 12px 24px 24px 24px;
    background: #ffffff;
    min-height: calc(100vh - 120px);
    position: relative;
    .homeMainHeader {
      height: auto;
      background-color: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0px;
      justify-content: space-between;
      margin-bottom: 12px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0;
      margin: 10px 0 21px 0;
      .right_btns {
        display: flex;
        .right_btns_item {
          margin-right: 10px;
        }
      }
      h3 {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 500;
      }
      /deep/.el-icon-search:before {
        font-size: 16px;
      }
      /deep/.el-icon-zoom-in:before {
        font-size: 16px;
      }
      /deep/.el-icon-zoom-out:before {
        font-size: 16px;
      }
    }
    .tabs_div::-webkit-scrollbar {
      display: none;
    }
    .wrap {
      width: 100%;
      background: #ffffff;
      margin-bottom: 16px;
      div {

      }
      .warp_header {
        margin-bottom: 16px;

        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  ::v-deep .el-drawer__header {
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
    font-family: PingFangSC-Semibold;
    color: #333333;
    letter-spacing: 0;
    font-weight: 600;
    padding: 14px 24px;
    margin-bottom: 0px;
  }
  ::v-deep .el-dialog {
    border-radius: 8px 8px;
  }
  ::v-deep .el-dialog__footer {
    display: flex;
    justify-content: center;
  }
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    line-height: 36px;
  }
  .preview_content_table {
    padding: 16px 16px;
    color: #131313;
    background-color: $base_white;
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 36px;
    }
    .orange {
      color: #ff9104;
      background: #fff4e5;
    }
    .green {
      color: #36d542;
      background: #e5ffe7;
    }
    .blue {
      color: #358aff;
      background: #f2f8ff;
    }
    .red {
      color: #fe4758;
      background: #ffeaec;
    }
    .span-tag {
      padding: 0px 8px;
      border-radius: 2px 2px;
      font-size: 14px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      font-family: PingFangSC-Regular;
    }
    .preview_content_table_flex {
      display: flex;
      width: 100%;
      font-size: 14px;
      p {
        margin-top: 6px;
        color: #999999;
        width: 50%;
        span {
          color: #333333;
        }
      }
    }
  }
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: $base_white;
  }
  ::v-deep .el-dialog__footer {
    display: flex;
    justify-content: center;
  }
  .btn_el_pageNation {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
  }
  .dialog-footer {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    .el-button {
      margin-right: 10px;
    }
  }
  .dialog-content-table {
    width: 100%;
    ::v-deep .el-dialog__body {
      padding: 20px 20px 0 20px !important;
      border-top: 1px solid #eee;
    }
    ::v-deep .el-button {
      min-width: 64px;
      height: 32px;
      font-size: 14px;
    }
    .top_title_tips {
      width: 100%;
      display: flex;
      align-items: center;
      background: #fef2dd;
      position: absolute;
      top: 54px;
      left: 0;
      padding: 16px 16px;
      span {
        font-size: 14px;
        color: #f5a623;
        line-height: 1;
        margin-left: 5px;
      }
    }
    h3 {
      color: $pri_ft_color;
      font-weight: 600;
      line-height: 36px;
    }
    ::v-deep .el-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      line-height: 30px;
      color: #ff9104;
    }
    .dialog-footer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog_table_title_top {
      width: 100%;
      display: flex;
      align-items: center;
      margin: 10px 0px;
    }
    .preview_content_table2 {
      display: flex;
      flex: 1;
      flex-direction: column;
      margin: 10px 0px;
      color: #131313;
      padding-bottom: 5px;
      .preview_content_table_flex {
        display: flex;
        width: 100%;
        text-align: left;
        p {
          color: #999999;
          font-size: 14px;
          width: 50%;
        }
        span {
          font-size: 14px;
          color: $pri_ft_color;
        }
      }
    }

    .left_dialog_table_content {
      width: 100%;
      h3 {
        margin-top: 10px;
      }
      .left_dialog_table_flex {
        width: 100%;
        display: flex;
        span {
          font-size: 14px;
          color: #999999;
        }
        span:last-child {
          font-size: 14px;
          color: #333333;
        }
      }
      .left_dialog_table_flex_end {
        width: 100%;
        margin-top: 14px;
        span {
          font-size: 14px;
          color: $pri_ft_color;
        }
        p {
          font-size: 14px;
          color: $pri_ft_color;
          span {
            font-size: 14px;
            color: #999999;
            margin-right: 5px;
          }
        }
      }
    }
  }
  .bg-red {
    //艳红
    background-color: #e54d42;
    color: #fff;
  }

  .bg-orange {
    //橘黄
    background-color: #f37b1d;
    color: #fff;
  }

  .bg-yellow {
    //亮黄
    background-color: #fbbd08;
    color: #333;
  }

  .bg-olive {
    // 橄榄绿
    background-color: #8dc63f;
    color: #fff;
  }

  .bg-green {
    // 森林绿
    background-color: #39b54a;
    color: #fff;
  }

  .bg-cyan {
    //天青
    background-color: #1cbbb4;
    color: #fff;
  }

  .bg-blue {
    // 海蓝
    background-color: #0081ff;
    color: #fff;
  }

  .bg-purple {
    // 葡萄紫
    background-color: #6739b6;
    color: #fff;
  }

  .bg-mauve {
    // 木槿紫
    background-color: #9c26b0;
    color: #fff;
  }

  .bg-pink {
    // 粉红
    background-color: #e03997;
    color: #fff;
  }

  .bg-brown {
    //土褐色
    background-color: #a5673f;
    color: #fff;
  }

  .bg-grey {
    // 青灰色
    background-color: #8799a3;
    color: #fff;
  }

  .bg-gray {
    // 浅灰色
    background-color: #f0f0f0;
    color: #666;
  }

  .bg-black {
    // 深黑
    background-color: #333;
    color: #fff;
  }

  .bg-white {
    // 雅白
    background-color: #fff;
    color: #666;
  }
}
</style>
