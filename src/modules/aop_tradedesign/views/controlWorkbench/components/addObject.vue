<template>
  <div>
    <!-- <el-drawer :title="title" :visible.sync="addKeyActVisible" class="workspace_common_drawer" direction="rtl"
      custom-class="demo-drawer" ref="drawer" :size="800" :wrapperClosable="false" @close="closeHandle"> -->
    <aop-public-tabs v-model="activeName">
      <el-tab-pane label="" name="tab1">
        <span slot="label" :class="{ errorRule: firstError == true }">基本信息
          <i v-if="firstError == true" class="el-icon-warning-outline"></i></span></el-tab-pane>
      <el-tab-pane label="对象属性" name="tab2"></el-tab-pane>
      <el-tab-pane label="对象关系" name="tab3"></el-tab-pane>
      <el-tab-pane label="对象行为" name="tab4"></el-tab-pane>
    </aop-public-tabs>
    <div style="width: 100%; height: 1px; background: #e7e7ee"></div>
    <div class="demo-drawer__content" v-show="activeName == 'tab1'">
      <div class="body">
        <el-form :model="formData" ref="formDataOne" :rules="rules" label-width="90px">
          <el-form-item label="对象名称" prop="objName">
            <el-input v-model="formData.objName" placeholder="请输入对象名称" />
          </el-form-item>
          <el-form-item label="编码" prop="objCode">
            <el-input v-model="formData.objCode" placeholder="字母、数字组合的编码，大写开头" />
          </el-form-item>
          <el-form-item label="对象类型" placeholder="请选择对象类型" prop="objType" style="margin-right: 0; position: relative">
            <el-select v-model="formData.objType" disabled placeholder="请选择对象类型" style="width: 100%">
              <el-option v-for="item in optionsObjectType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select> </el-form-item><el-form-item label="分类" prop="objClass">
            <el-select v-model="formData.objClass" collapse-tags style="width: 100%" placeholder="请选择分类"
              @change="handleChange2">
              <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="描述" prop="objDesc">
            <el-input v-model="formData.objDesc" placeholder="请输入描述" class="widthInput" type="textarea"
              :maxlength="500"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="demo-drawer__footer">
        <div class="btmWrap">
          <el-button @click="closeHandle">取 消</el-button>
          <el-button type="primary" @click.native="txtSaveSubmitForm">
            确 定</el-button>
        </div>
      </div>
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab2'">
      <div class="body">
        <el-button type="primary" size="medium" @click="addParamVisible(0)" class="btn" style="margin-bottom: 15px">
          <i class="el-icon-plus"></i>
          添加对象属性</el-button>
        <el-table :data="tableData">
          <el-table-column prop="dictryName" label="字段名称" width="">
            <template slot-scope="scope">
              <div style="display: flex">
                <span>{{ scope.row.dictryName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="dictryNo" label="编码" width="">
          </el-table-column>
          <el-table-column prop="dictryType" label="数据类型">
          </el-table-column>
          <!-- <el-table-column prop="attrDesc" label="描述说明">
            </el-table-column> -->
          <el-table-column prop="address" label="操作" min-width="60px" fixed="right">
            <template slot-scope="scope">
              <div class="button">
                <span @click="doOperate1('delete', scope.$index, scope.row)" class="OperateTextR">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="demo-drawer__footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="txtSaveSubmitForm">
          确 定</el-button>
      </div>
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab3'">
      <div class="obj-relation-content-tips">
        <p class="el-icon-warning">
          请选择目标对象，建立当前对象与其的业务关系。
        </p>
      </div>
      <div class="body content">
        <div class="obj-relation-content">
          <el-button type="primary" size="medium" class="el-icon-plus" @click="addObjRelationFun">添加对象关系</el-button>
          <el-table :data="relationTableData" :key="itemKey" style="width: 100%; margin-top: 14px">
            <el-table-column prop="objRelNm" label="关系名称">
            </el-table-column>
            <el-table-column prop="objRelCd" label="编码"> </el-table-column>
            <el-table-column prop="curObjName" label="当前对象">
            </el-table-column>
            <el-table-column prop="targetObjName" label="目标对象">
            </el-table-column>
            <el-table-column prop="obrRelashName" label="关系类型">
            </el-table-column>
            <el-table-column prop="relashMultName" label="关系重数">
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button @click="updateObjRelationFun(scope.$index, scope.row)" type="text">编辑</el-button>
                <el-button @click="
                  handleClickDeleteRelationFun(scope.$index, scope.row)
                  " type="text" style="color: #fe4758">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="demo-drawer__footer">
        <el-button @click="addKeyActVisible = false">取 消</el-button>
        <el-button type="primary" @click="txtSaveSubmitForm">确 定</el-button>
      </div>
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab4'">
      <div class="body">
        <el-button type="primary" size="medium" @click="addBehavior('', {})" class="btn" style="margin-bottom: 15px">
          <i class="el-icon-plus"></i>
          添加对象行为</el-button>
        <el-table :data="sideTabList">
          <el-table-column prop="obeNo" label="行为编码" width="">
          </el-table-column>
          <el-table-column prop="obeName" label="行为名称" width="">
          </el-table-column>
          <el-table-column prop="obeDesc" label="行为描述"> </el-table-column>
          <el-table-column prop="address" label="操作" min-width="60px" fixed="right">
            <template slot-scope="scope">
              <el-button @click="addBehavior(scope.$index, scope.row)" type="text">编辑</el-button>
              <el-button @click="deleteData(scope.$index, scope.row)" type="text" style="color: #fe4758">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="demo-drawer__footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="txtSaveSubmitForm">
          确 定</el-button>
      </div>
    </div>
    <!-- </el-drawer> -->
    <compStandard ref="compStandard" @confirm="addObjectAttrSubmit" />
    <analysisField ref="analysisField" @analysisConfirm="analysisConfirm" @close="closeHandle" />
    <!-- 添加对象关系弹窗 -->
    <el-dialog width="60%" :title="relationTitle" :visible.sync="dialogVisibleRelation" :close-on-click-modal="false"
      class="inner_cheetah_common_dialog">
      <div class="relationObjMain">
        <div class="relationObjMain-canvas">
          <div class="relationObjMain-obj">
            <div class="obj-infom obj1">
              {{ formData.objName }}（{{ formData.objCode }}）
            </div>
            <div class="obj-null"></div>
          </div>
          <div class="obj-line">
            <div class="obj-line-content"></div>
            <div class="obj-line-num">
              {{ relationshipNum.label }}
            </div>
          </div>
          <div class="relationObjMain-obj">
            <div class="obj-infom" :class="{
              obj1: relationshipObj.label,
              obj2: !relationshipObj.label,
            }">
              {{ relationshipObj.label
              }}{{
                relationshipObj.value ? "（" + relationshipObj.value + "）" : ""
              }}
            </div>
            <div class="obj-null"></div>
          </div>
        </div>
        <div class="relationObjMain-select">
          <div class="relationObjMain-select-content">
            <label>当前对象</label>
            <p>{{ formData.objName }}</p>
          </div>
          <div class="relationObjMain-select-content">
            <label>&nbsp;</label>
            <el-select v-model="relationshipVal" placeholder="请选择关联关系" size="small" style="width: 140px">
              <el-option v-for="item in optionsRelation" :key="item.value" :label="item.label" :value="item">
              </el-option>
            </el-select>
            <el-select v-model="relationshipNum" v-if="relationshipVal.value != 'extends'" placeholder="请选择关系重数"
              size="small" style="width: 140px; margin-top: 12px">
              <el-option v-for="item in optionsNum" :key="item.value" :label="item.label" :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="relationObjMain-select-content">
            <label>目标对象</label>
            <el-select v-model="relationshipObj" filterable placeholder="请选择目标对象" size="small" style="width: 140px">
              <el-option v-for="item in optionsObj" :key="item.value" :label="item.label" :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="relationObjMain-form">
          <el-form :model="relationForm" ref="relationForm" :rules="rules3" label-width="80px">
            <el-form-item label="关系名称" prop="objRelNm">
              <el-input disabled v-model="relationName" placeholder="请输入关系名称"></el-input>
            </el-form-item>
            <el-form-item label="编码" prop="objRelCd">
              <el-input disabled v-model="relationCode" placeholder="请输入编码"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="objRelDesc" type="textarea" row="2" placeholder="请输入描述" class="widthInput"
                :maxlength="500"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleObjectRelation">取 消</el-button>
        <el-button type="primary" @click="addObjectRelationSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <addServiceType @confirm="getGroupList" ref="serviceTypeLog"></addServiceType>
  </div>
</template>
<script>
import compStandard from "./compStandard";
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
import { unduplicated } from "@m/utils/array";
import PagePagination from "@m/core/components/page_pagination";
import ObjectNameInput from "./ObjectNameInput";
import analysisField from "./analysisField.vue";
import addServiceType from "./addServiceType.vue";

export default {
  mixins: [mixin],
  components: {
    Table,
    PagePagination,
    ObjectNameInput,
    analysisField,
    compStandard,
    addServiceType,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    newObjectId: {
      type: String,
    },
    value: {
      type: Boolean,
      default: () => false,
    },
    targetData: [],
    updateNode: {
      type: Function,
      default: () => { },
    },
    bizDomainNo: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      introduceInfo: {},
      imgUrlDelete: require("@m/assets/images/delete-light.png"),
      sideTabActive: -1,
      sideTabList: [],
      centeroptions: [], //任务中心数据
      editStorage: [], //浅拷贝原数据
      firstError: false,
      objDesign: "true",
      editDialogVisiable: false,
      activeName: "tab1", //默认显示tab1
      optiType: "",
      optiName: "",
      formData: {
        objName: "",
        objCode: "",
        objType: "00",
        objClass: "",
        objDesc: "",
      },

      optionsObjectType: [
        {
          value: "00",
          label: "实体对象",
        },
        {
          value: "01",
          label: "值对象",
        },
      ],
      optionsType: [
        {
          value: "1",
          label: "用户",
        },
        {
          value: "2",
          label: "机构",
        },
        {
          value: "3",
          label: "渠道",
        },
        {
          value: "4",
          label: "产品",
        },
        {
          value: "5",
          label: "合约",
        },
        {
          value: "6",
          label: "系统",
        },
      ],
      rules: {
        objName: [
          {
            required: true,
            message: "请输入对象中文名称",
          },
        ],
        objCode: [
          {
            required: true,
            pattern: "^[A-Z]{1}([a-zA-Z0-9._]){0,}$",
            message: "字母、数字组合的编码，大写开头",
            trigger: "blur",
          },
        ],
        objType: [
          {
            required: true,
            message: "请选择对象类型",
          },
        ],
        objClass: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
      },
      rules2: {
        obeName: [
          {
            required: true,
            message: "请输入对象行为",
          },
        ],
        obeNo: [
          {
            required: true,
            message: "请输入对象行为编码",
          },
        ],
      },

      rules3: {
        objRelNm: [
          {
            required: true,
            message: "请选择目标对象",
          },
        ],
        objRelCd: [
          {
            required: true,
            message: "请选择目标对象",
          },
        ],
      },
      rulesRelation: {
        objRelNm: [{ required: true }],
        objRelCd: [{ required: true }],
      },
      inputs: [],
      outputs: [],
      dialogVisibleRelation: false,
      objRelDesc: "",
      relationForm: {
        objRelNm: "",
        objRelCd: "",
        objRelDesc: "",
      },
      optionsRelation: [
        {
          value: "association",
          label: "关联",
        },
        {
          value: "aggregation",
          label: "聚合",
        },
        {
          value: "combination",
          label: "组合",
        },
        {
          value: "extends",
          label: "继承",
        },
      ],
      optionsNum: [
        {
          value: "0-N",
          label: "1:0..*",
        },
        {
          value: "1-N",
          label: "1:1..*",
        },
        {
          value: "0-1",
          label: "1:0..1",
        },
        {
          value: "1-1",
          label: "1:1",
        },
      ],
      optionsObj: [],
      relationshipVal: {},
      relationshipNum: {},
      relationshipObj: {},
      tableData: [],
      tableMetaData: [],

      objActionCurrent: 0,
      objActionCurrentData: {
        obeName: "",
        obeNo: "",
        obeDesc: "",
        inputs: [],
        outputs: [],
      },
      relationTableData: [],
      addObjAttrKey: "",
      editAttrData: {},
      editTitle: "编辑字段",
      relationTitle: "新建对象关系",
      relationFlag: "",
      relationIndex: "",
      itemKey: 0,
      checkList: {},
      updateIndx: "",
      hasDefaultMicroCenter: false,
      addKeyActVisible: false,
    };
  },

  watch: {
    value(v) {
      this.addKeyActVisible = v;
    },
  },

  computed: {
    relationName: {
      get() {
        this.relationForm.objRelNm = this.relationshipObj.label;
        return this.relationshipObj.label;
      },
      set(val) { },
    },
    relationCode: {
      get() {
        if (
          (this.relationshipNum.value ||
            this.relationshipVal.value == "extends") &&
          this.relationshipObj.value
        ) {
          const name = this.relationshipObj.value.replace(
            this.relationshipObj.value[0],
            this.relationshipObj.value[0].toLowerCase()
          );
          let code =
            name +
            ((this.relationshipNum.value == "0-N" ||
              this.relationshipNum.value == "1-N") &&
              this.relationshipVal.value != "extends"
              ? "list"
              : "");
          this.relationForm.objRelCd = code;
          return code;
        } else {
          this.relationForm.objRelCd = "";
          return "";
        }
      },
      set(val) { },
    },
  },

  created() {
    this.addKeyActVisible = this.value;
    // this.$nextTick(() => {
    //   this.$refs.analysisField.openDrawer({
    //     analysisFirst: true,
    //   });
    //   return;
    // });
  },
  methods: {
    analysisConfirm(info = {}) {
      this.introduceInfo = info;
      this.formData.objName = info.fieldName;
      this.formData.objDesc = info && info.info ? info.info.objDesc : '';
      this.formData.objClass = info?.info?.objClsCd === "xj" ? "" : info?.info?.objClsCd ?? "";
      this.optiName = info && info.info ? info.info.objClsNm : "";
      this.tableData = info?.info?.l5SysBizObjectAttributeDTOs
        ? info.info.l5SysBizObjectAttributeDTOs.map((item) => ({
          ...item,
          sourceSysType: "0",
          dictryId: item.objAttrId,
          dictryName: item.attrChiNm,
          dictryNo: item.attrEngNm,
          dictryType: item.attrTpCd,
        }))
        : [];
       this.$emit('handleClose', this.formData)
    },

    addBehavior(index = "", info = {}) {
      this.$refs.serviceTypeLog.show(info, index);
    },
    getGroupList(info = {}, index = "") {
      if (index !== "") {
        this.sideTabList[index] = info;
      } else {
        this.sideTabList.push(info);
      }
    },
    deleteData(index) {
      this.$confirm("确定删除当前对象行为？是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.sideTabList.splice(index, 1);
        })
        .catch(() => { });
    },

    closeHandle() {
      this.closeTrigger();
      this.updateNode();
     
    },

    closeTrigger() {
      this.addKeyActVisible = false;
      this.$emit("input", false);
    },

    itemInfo(key) {
      this.$set(this.$data, "objActionCurrent", key);
    },
    //元数据弹窗打开 添加参数
    addParamVisible(key) {
      this.$refs.compStandard.showDialog(this.introduceInfo);
    },

    handleClickDelete(index, key) {
      this.$confirm("确定删除当前属性？是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (key == "input") {
            this.objActionCurrentData.inputs.splice(index, 1);
            this.editStorage.splice(iattrTpCdndex, 1);
          } else {
            this.objActionCurrentData.outputs.splice(index, 1);
            this.editStorage.splice(index, 1);
          }
        })
        .catch(() => { });
    },

    /**
     * 对象属性保存
     */

    addObjectAttrSubmit(data) {
      let extractedData = data.map((item) => ({
        dictryName: item.fieldName,
        dictryNo: item.fieldKeyName,
        dictryId: item.fieldId,
        dictryType: item.fieldType,
        sourceSysType: "1",
        attrDesc: item.attrDesc,
        required: "",
      }));

      if (this.addObjAttrKey != 0) {
        extractedData.map((item) => {
          item.required = "0";
        });
      }
      this.tableData = unduplicated(
        [...this.tableData, ...extractedData],
        ["dictryId"]
      );
    },

    doOperate1(operate, index, info) {
      switch (operate) {
        case "delete":
          this.objPropertyDelete(index);
          break;
      }
    },
    objPropertyDelete(index) {
      this.$confirm("确定删除当前属性？是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.editStorage.splice(index, 1);
        })
        .catch(() => { });
    },

    handleChange2(value) {
      // 将选中的值传递给接口
      this.optiType = value;
      const selectedOption = this.optionsType.find(
        (option) => option.value === value
      );
      this.optiName = selectedOption ? selectedOption.label : "";
    },
    //点击确定校验基本信息、对象行为
    txtSaveSubmitForm() {
      let rulesSuccess = false;
      this.$refs.formDataOne.validate((valid) => {
        if (valid) {
          this.firstError = false;
        } else {
          this.firstError = true;
        }
      });

      if (!this.firstError) {
        rulesSuccess = true;
      }

      if (rulesSuccess) {
        let attributeInfos = this.tableData.map((item) => {
          return {
            ...item,
          };
        });
        let objectRelInfos = this.relationTableData.map((item) => {
          return {
            ...item,
            obrId: item.obrId,
            obrName: item.objRelNm,
            obrCode: item.objRelCd,
            curObjId: item.curObjId,
            curObjCode: item.curObjCd,
            tgtObjId: item.targetObjId,
            tgtObjCode: item.targetObjCd,
            obrDesc: item.objRelDesc,
            obrRelash: item.objRelTpCd,
            relashMult: item.bjRelEnum,
            tgtObjName: item.targetObjName,
          };
        });
        let objectBehaviorInfos = this.sideTabList.map((item) => {
          return {
            ...item,
          };
        });
        let query = {
          bizDomainNo: this.bizDomainNo,
          objName: this.formData.objName,
          objCode: this.formData.objCode,
          objType: this.formData.objType,
          objClass: this.formData.objClass,
          objDesc: this.formData.objDesc,
          objClassName: this.optiName,
          attributeInfos: attributeInfos,
          objectRelInfos: objectRelInfos,
          objectBehaviorInfos: objectBehaviorInfos,
        };

        const fn = () => {
          this.$notify({
            title: "成功",
            message: "新建成功",
            duration: 2000,
            type: "success",
          });
          this.$emit("confim");
          this.closeTrigger();
        };

        this.rpc.controlWorkbench.saveBizObjectInfoV2(query).then(() => {
          fn();
        });
      }
    },

    /**
     * 添加对象关系
     */
    addObjRelationFun() {
      let relationFlag = false;
      this.$refs.formDataOne.validate((valid) => {
        if (valid) {
          this.firstError = false;
          relationFlag = true;
        } else {
          this.firstError = true;
        }
      });
      if (!relationFlag) {
        this.$message({
          message: "对象基本信息为填写正确，请先完成",
          type: "warning",
        });
        return;
      }
      this.relationTitle = "新建对象关系";
      this.relationFlag = "add";
      this.relationshipVal = {};
      this.relationshipNum = {};
      this.relationshipObj = {};
      this.objRelDesc = "";
      this.selectOptions();
      this.dialogVisibleRelation = !this.dialogVisibleRelation;
    },
    async selectOptions(targetObjCd) {
      this.optionsObj = [];
      const data = await this.rpc.controlWorkbench.qryBizObjectV2InfoList({
        currentPage: 1,
        turnPageShowNum: 9999,
        bizDomainNo: this.bizDomainNo,
      });
      this.targetData = data.bizObjectLists;
      this.targetData.forEach((item) => {
        if (
          (!this.relationTableData.find(
            (data) => data.targetObjCd == item.objCode
          ) &&
            this.formData.objCode != item.objCode) ||
          item.objCode == targetObjCd
        ) {
          this.optionsObj.push({
            value: item.objCode,
            label: item.objName,
            objId: item.objId,
          });
        }
      });
    },
    updateObjRelationFun(index, data) {
      this.relationTitle = "编辑对象关系 ";
      this.relationFlag = "update";
      this.relationshipVal = {
        label: data.obrRelashName,
        value: data.objRelTpCd,
      };
      this.relationshipNum = {
        label: data.relashMultName,
        value: data.bjRelEnum,
      };
      this.relationshipObj = {
        label: data.targetObjName,
        value: data.targetObjCd,
        objId: data.targetObjId,
      };
      this.objRelDesc = data.objRelDesc;
      this.relationIndex = index;
      this.selectOptions(data.targetObjCd);
      this.dialogVisibleRelation = !this.dialogVisibleRelation;
    },
    handleClickDeleteRelationFun(index, data) {
      this.$confirm("确定删除当前关系？是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.relationTableData.splice(index, 1);
        })
        .catch(() => { });
    },
    addObjectRelationSubmit() {
      let tmpFlag = true;
      this.$refs.relationForm.validate((valid) => {
        if (valid) {
          tmpFlag = false;
        } else {
          tmpFlag = true;
        }
      });
      if (tmpFlag) {
        return;
      }
      //校验 name和code有没有
      let tmp = {
        obrId: "",
        objRelNm: this.relationName,
        objRelCd: this.relationCode,
        objRelDesc: this.objRelDesc,
        curObjId: "",
        curObjCd: this.formData.objCode,
        curObjName: this.formData.objName,
        targetObjId: this.relationshipObj.objId,
        targetObjCd: this.relationshipObj.value,
        targetObjName: this.relationshipObj.label,
        objRelTpCd: this.relationshipVal.value,
        obrRelashName: this.relationshipVal.label,
        bjRelEnum:
          this.relationshipVal.value != "extends"
            ? this.relationshipNum.value
            : "",
        relashMultName:
          this.relationshipVal.value != "extends"
            ? this.relationshipNum.label
            : "",
      };
      if (this.relationFlag == "add") {
        this.relationTableData.push(tmp);
      } else {
        this.relationTableData[this.relationIndex] = tmp;
      }
      this.itemKey++;
      this.cancleObjectRelation();
    },
    /**
     * 取消对象关系
     */
    cancleObjectRelation() {
      this.$refs.relationForm.resetFields();
      this.relationshipVal = {};
      this.relationshipNum = {};
      this.relationshipObj = {};
      this.dialogVisibleRelation = !this.dialogVisibleRelation;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.workspace_common_drawer {
  .el-form-item {
    margin-bottom: 18px;
  }

  .el-drawer__container {
    .el-drawer {
      .el-drawer__header {
        border-bottom: 1px solid rgba(238, 240, 245, 1);
        margin-bottom: 0px;
        padding: 16px 24px;
        text-align: left;

        span {
          font-family: PingFangSC-Semibold;
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          line-height: 16px;
          font-weight: 600;
        }
      }
    }
  }
}

::v-deep .el-tabs__header {
  position: relative !important;
  left: 0 !important;
}

.demo-drawer__content {
  height: 90%;

  .body {
    padding: 0 20px;
    margin-top: 20px;
    padding-bottom: 72px;
  }
}

.demo-drawer__footer {
  padding: 20px;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  position: absolute;
  text-align: center;
  bottom: 0;
  width: 100%;
  z-index: 10;
  background-color: #fff;
  height: 72px;
  border-top: 1px solid #e7e7e7;
}

.button {
  display: flex;
}

.OperateTextB {
  width: 28px;
  height: 16px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #358aff;
  letter-spacing: 0;
  line-height: 16px;
  font-weight: 400;
  cursor: pointer;
}

.OperateTextR {
  cursor: pointer;
  width: 28px;
  height: 16px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #fe4758;
  letter-spacing: 0;
  line-height: 16px;
  font-weight: 400;
}

.Text {
  width: 1px;
  height: 14px;
  background: #e9e9e9;
  margin: 0 6px;
}

.dialog_body {
  height: 90%;
  width: 100%;

  .hederBox {
    height: 64px;
    background: #ffffff;
    margin-bottom: 14px;
    display: flex;

    .main {
      flex: 1;
    }
  }

  .title {
    height: 22px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #111111;
    letter-spacing: 0;
    font-weight: 600;
    margin-bottom: 12px;
  }
}

.dialog_box {
  text-align: center;
  color: #999;
}

.dialog_footer {
  text-align: center;
}

.selectWide /deep/ .el-select__input {
  width: 180px;
  // padding-right: 0;
}

.listStyle {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #000000;
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 600;
}

// .selectAmount {
// }
.selectText {
  height: 28px;
  background: #f7f7f9;
  border-radius: 2px;
  margin-right: 5px;

  span {
    cursor: pointer;
  }
}

::v-deep .widthInput .el-input__inner {
  height: 80px;
  vertical-align: top;
}

.behavier-save {
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .inputBak .el-input__inner {
  background: #fafafc;
}

.obj-action-cont {
  display: flex;

  .obj-action-cont-itemList {
    width: 152px;

    .obj-action-cont-itemList-item {
      width: 144px;
      height: 34px;
      line-height: 34px;
      border-radius: 2px;
      font-size: 14px;
      margin-top: 8px;
      display: flex;
      justify-content: space-around;
      padding: 0 6px;

      .obj-action-cont-itemList-item-icon {
        content: " ";
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url("~@m/assets/images/icon_移动@2x.png");
        background-size: cover;
        margin-top: 9px;
      }

      .obj-action-cont-itemList-item-name {
        flex: 1;
        margin-left: 6px;
        width: 96px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .obj-action-cont-itemList-item-delete {
        padding-top: 9px;
      }
    }

    .actived {
      background: #f0f5ff;
      color: #358aff;
    }
  }

  .obj-action-cont-item-cont {
    padding: 0 24px;
    border-left: 1px solid #dde0e4;
    flex: 1;
    margin-left: 8px;
    overflow: scroll;
  }
}

::v-deep .el-dialog__header {
  background-color: #fafafc;
}

.searchMain {
  border-bottom: 1px solid #dde0e4;
}

.search-content {
  margin-top: 14px;
}

.search-content-title {
  display: flex;
  justify-content: space-between;

  span {
    color: #333333;
    font-size: 16px;
    line-height: 36px;
  }
}

.search-content-foot {
  margin-top: 14px;
}

.search-content-foot-check {
  color: #333333;
  height: 28px;
  line-height: 28px;

  .search-content-foot-check-content {
    display: flex;
    flex-wrap: wrap;
  }

  span {
    height: 28px;
    background: #f7f7f9;
    border-radius: 2px;
    padding: 0 6px;
    display: inline-block;
    margin-left: 3px;

    &:after {
      content: " ";
      display: inline-block;
      width: 16px;
      height: 16px;
      // background: url("~@m/assets/images/icon_关闭.png");
      background-size: cover;
      margin-left: 4px;
      vertical-align: middle;
    }
  }
}

.dialog-footer {
  text-align: center;
}

::v-deep .el-dialog__footer {
  border-top: 1px solid #e7e7ee;
}

.obj-relation-content-tips {
  height: 32px;
  line-height: 32px;
  background: #fef2de;
  color: #f5a623;
  margin-bottom: 24px;

  p {
    padding-left: 20px;
  }
}

.relationObjMain-canvas {
  display: flex;
  justify-content: space-between;

  .relationObjMain-obj {
    width: 200px;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 6px;
    height: 100px;
    overflow: hidden;

    .obj-infom {
      width: 200px;
      height: 56px;
      font-size: 14px;
      line-height: 56px;
      padding: 0 20px;
      color: #fff;
    }

    .obj1 {
      background: #358aff;
      color: #fff;
    }

    .obj2 {
      background: #d7d7d7;
    }

    .obj-null {
      width: 200px;
      height: 44px;
    }
  }

  .obj-line {
    position: relative;
    flex: auto;

    .obj-line-content {
      width: 100%;
      height: 2px;
      background-color: #b5b5bb;
      margin-top: 56px;
      position: relative;

      &:before {
        content: " ";
        width: 10px;
        height: 10px;
        border-radius: 10px;
        border: 1px solid #b5b5bb;
        position: absolute;
        top: -4px;
        background: #fff;
      }

      &:after {
        content: " ";
        width: 0;
        height: 0;
        border-left: 10px solid #b5b5bb;
        border-top: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
        position: absolute;
        right: -5px;
        top: -4px;
      }
    }

    .obj-line-num {
      position: absolute;
      font-size: 14px;
      text-align: center;
      width: 64px;
      height: 28px;
      line-height: 28px;
      border: 1px solid #b5b5bb;
      border-radius: 4px;
      top: 43px;
      left: calc(50% - 32px);
      background: #fff;
    }
  }
}

.relationObjMain-select {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-top: 12px;
  color: #666666;

  .relationObjMain-select-content {
    width: 200px;

    label {
      font-size: 14px;
      margin-bottom: 12px;
      display: block;
    }
  }
}

.relationObjMain-form {
  border-top: 1px solid #eef0f5;
  margin-top: 30px;
  padding-top: 12px;
}

.errorRule {
  color: #d11211;
}

::v-deep .widthInput .el-textarea__inner {
  min-height: 100px !important;
}

::v-deep .el-form-item__error {
  font-size: 14px !important;
}

.serviceList-wrapper {
  display: flex;
}

.serviceList-right {
  margin-top: 24px;
}

.aop_l5design_serviceList-left {
  border-right: 1px solid #ececec;
  margin-top: 16px;

  .tab-list {
    height: calc(100vh - 190px);
    overflow-y: auto;
    padding: 0px 8px;

    img {
      width: 16px;
    }

    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .normal_item {
    background: #fff;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    line-height: 16px;
    font-weight: 400;
    padding: 8px;
    margin-bottom: 6px;
    cursor: pointer;
  }

  .select_item {
    background: #f0f5ff;
    border-radius: 2px;
    color: #358aff;
    letter-spacing: 0;
    line-height: 16px;
    font-weight: 400;
  }
}
</style>
