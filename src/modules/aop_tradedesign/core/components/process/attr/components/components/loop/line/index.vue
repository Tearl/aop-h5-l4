<template>
  <div class="aop_tradedesign_comps_design_attr_line">
    <PageDialog
      :dialogTitle="'条件配置'"
      :dialogVisiable="dialogVisible"
      dialogWidth="700px"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <el-form
          :model="formData"
          :rules="rules"
          ref="form"
          label-position="right"
          label-width="127px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="参数来源:" prop="apSource">
              <el-select
                v-model="formData.apSource"
                placeholder="请选参数来源"
                filterable
                clearable
                @change="selectChange(formData, 'apSource')"
              >
                <el-option
                  v-for="item in apSourceOption"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="参数变量:"
              prop="paramCName"
              v-show="formData.apSource !== '40'"
              class="no_dropdown__empty"
            >
              <el-select
                ref="paramCNameSelect"
                v-model="formData.paramCName"
                placeholder="请选参数变量"
                filterable
                clearable
                @change="selectChange(formData, 'paramCName')"
                :popper-append-to-body="false"
                :class="{ ap_soure_50: formData.apSource == '50' }"
              >
                <!-- <el-option
                  v-for="item in paramCNameOption"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option> -->
                <el-option class="setstyle" disabled>
                  <el-tree
                    ref="paramCNameTreeRef"
                    :highlight-current="true"
                    :data="paramCNameTree"
                    :props="defaultProps"
                    :default-expanded-keys="defaultExpanded"
                    :current-node-key="currentKey"
                    :load="loadNode"
                    lazy
                    accordion
                    node-key="serialNumber"
                    :expand-on-click-node="false"
                  >
                    <div class="custom_tree_node" slot-scope="{ node, data }">
                      <div
                        :class="node.disabled ? 'disabled' : ''"
                        @click.stop="
                          handleNodeClick(data, node, 'paramCName')
                        "
                      >
                        {{ data.paramCName }}
                      </div>
                    </div>
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              label="参数值:"
              prop="paramValue"
              v-show="formData.apSource == '40'"
            >
              <el-input
                v-model="formData.paramValue"
                placeholder="请输入参数值"
                :class="{
                  ap_soure_40_null: formData.paramValue.toLowerCase() == 'null',
                }"
                :disabled="currentOtherParam.parent && currentOtherParam.parent.paramType == 'Object'"
              ></el-input>
            </el-form-item> -->
            <el-form-item
              label="参数值:"
              prop="paramValue"
              v-show="formData.apSource == '40'"
            >
              <el-input
                v-model="formData.paramValue"
                placeholder="请输入参数值"
                :class="{
                  ap_soure_40_null: formData.paramValue.toLowerCase() == 'null',
                }"
              ></el-input>
            </el-form-item>
            <el-form-item label="操作符:" prop="condTyp">
              <el-select
                v-model="formData.condTyp"
                placeholder="请选操作符"
                filterable
                clearable
              >
                <el-option
                  v-for="item in condTypOption"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参数来源:" prop="otherApSource">
              <el-select
                v-model="formData.otherApSource"
                placeholder="请选参数来源"
                filterable
                clearable
                @change="selectChange(formData, 'otherApSource')"
              >
                <el-option
                  v-for="item in otherApSourceOption"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="参数变量:"
              prop="otherParamCName"
              v-show="formData.otherApSource != '40'"
              class="no_dropdown__empty"
            >
              <el-select
                ref="otherParamCNameSelect"
                v-model="formData.otherParamCName"
                placeholder="请选参数变量"
                filterable
                clearable
                @change="selectChange(formData, 'otherParamCName')"
                :popper-append-to-body="false"
              >
                <!-- <el-option
                  v-for="item in otherParamCNameOption"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option> -->
                <el-option class="setstyle" disabled>
                  <el-tree
                    ref="otherParamCNameTreeRef"
                    :highlight-current="true"
                    :data="otherParamCNameTree"
                    :props="defaultProps"
                    :default-expanded-keys="defaultExpanded"
                    :current-node-key="currentKey"
                    :load="loadNode"
                    lazy
                    accordion
                    node-key="serialNumber"
                    :expand-on-click-node="false"
                  >
                    <div class="custom_tree_node" slot-scope="{ node, data }">
                      <div
                        :class="node.disabled ? 'disabled' : ''"
                        @click.stop="
                          handleNodeClick(data, node, 'otherParamCName')
                        "
                      >
                        {{ data.paramCName }}
                      </div>
                    </div>
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="参数属性:"
              prop="paramCName"
              v-show="currentOtherParam.paramType == 'List'"
            >
              <el-select
                v-model="formData.otherParamProperty"
                placeholder="请选参数属性"
                filterable
                clearable
              >
                <el-option
                  v-for="item in paramPropertyOption"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              label="参数值:"
              prop="otherParamValue"
              v-show="formData.otherApSource == '40'"
            >
              <el-input
                v-model="formData.otherParamValue"
                placeholder="请输入参数值"
                :class="{
                  ap_soure_40_null:
                    formData.otherParamValue.toLowerCase() == 'null',
                }"
                :disabled="currentParam.parent && currentParam.parent.paramType == 'Object'"
              ></el-input>
            </el-form-item> -->
            <el-form-item
              label="参数值:"
              prop="otherParamValue"
              v-show="formData.otherApSource == '40'"
            >
              <el-input
                v-model="formData.otherParamValue"
                placeholder="请输入参数值"
                :class="{
                  ap_soure_40_null:
                    formData.otherParamValue.toLowerCase() == 'null',
                }"
              ></el-input>
            </el-form-item>
            <el-form-item label="触发组件:" prop="triggerCpnName">
              <el-select
                v-model="formData.triggerCpnName"
                placeholder="请选触发组件"
                filterable
                clearable
              >
                <el-option
                  v-for="item in triggerCpnNameOption"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div class="condition_desc">
          <!-- 如果参数变量
          {{
            `${formData.paramCName} ${formData.condTyp} 参数变量 ${formData.otherParamCName}${formData.paramValue}`
          }}，则触发组件【{{ formData.triggerCpnName }}】 -->
          {{ getDescText(formData) }}
        </div>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveLineDialog">确 定</el-button>
      </span>
      >
    </PageDialog>

    <SelectDialog
      ref="selectDialogRef"
      :currentServObj="currentServObj"
      :isRead="isRead"
      :dataList="dataList"
    ></SelectDialog>

    <!-- 固定值参数类型选择 -->
    <SelectTypeDialog
      ref="selectTypeDialogRef"
      @getParamsType="getParamsType"
    ></SelectTypeDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import SelectDialog from "./components/select";
import SelectTypeDialog from "./components/select_type";
import { mixList, reList } from "@m/utils/paramTree";
import { unduplicated, setSerialNumber } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    SelectDialog,
    SelectTypeDialog,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      defaultProps: {
        label: "label",
        children: "children",
        isLeaf: "leaf",
        disabled(data, node) {
          return node.parent.data.paramType == "List";
        },
      },
      defaultExpanded: [], // 树形展示序号组,
      currentKey: "",
      currentParam: {},
      currentOtherParam: {},
      lineObj: {},
      dialogVisible: false,
      formData: {
        apSource: "00",
        paramCName: "",
        paramProperty: "",
        condTyp: "==",
        otherApSource: "00",
        otherParamCName: "",
        otherParamProperty: "",
        paramValue: "",
        otherParamValue: "",
        triggerCpnName: "",
        sourceId: "",
        targetId: "",
      },
      rules: {
        apSource: [
          { required: true, trigger: "change", message: "请选择参数来源" },
        ],
        paramCName: [
          { required: true, trigger: "change", message: "请选择参数变量" },
        ],
        condTyp: [
          { required: true, trigger: "change", message: "请选择操作符" },
        ],
        otherApSource: [
          { required: true, trigger: "change", message: "请选择参数来源" },
        ],
        otherParamCName: [
          // { required: true, trigger: "change", message: "请选择参数变量" },
          { required: true, trigger: "change", validator: this.validator },
        ],
        // paramValue: [
        //   { required: true, trigger: "blur", message: "请输入参数值" },
        // ],
        // otherParamValue: [
        //   { required: true, trigger: "blur", message: "请输入参数值" },
        // ],
        triggerCpnName: [
          { required: true, trigger: "change", message: "请选择触发组件" },
        ],
      },
      paramPropertyOption: [{ type: "长度", value: "length" }],
      tableType: false,
      tableParamList: [],
      dataList: [],
      currentObj: {},
      type: "",
    };
  },
  computed: {
    apSourceOption() {
      if (this.currentOtherParam?.parent?.paramType == "Object") {
        return [
          { type: "固定值", value: "40" },
        ]
      } else {
        return [
          { type: "服务输入参数", value: "00" },
          { type: "服务输出参数", value: "30" },
          { type: "服务临时参数", value: "10" },
          { type: "组件输出参数", value: "20" },
          { type: "固定值", value: "40" },
          { type: "实时变量", value: "50" },
        ]
      }
    },
    otherApSourceOption() {
      if (this.currentParam?.parent?.paramType == "Object") {
        return [
          { type: "固定值", value: "40" },
        ]
      } else {
        return [
          { type: "服务输入参数", value: "00" },
          { type: "服务输出参数", value: "30" },
          { type: "服务临时参数", value: "10" },
          { type: "组件输出参数", value: "20" },
          { type: "固定值", value: "40" },
          { type: "实时变量", value: "50" },
        ]
      }
    },
    condTypOption() {
      const parent = this.currentServObj.puApiParams.find(item => item.paramOrder == this.currentParam.paramParentId);
      const oParent = this.currentServObj.puApiParams.find(item => item.paramOrder == this.currentOtherParam.paramParentId);
      console.log("condTypOption", parent, oParent)
      if ((parent && parent.paramType == "Object") || (oParent && oParent.paramType == "Object")) {
        return [
          { type: "==", value: "==" },
          { type: "!=", value: "!=" },
        ]
      } else {
        return [
          { type: "==", value: "==" },
          { type: ">", value: ">" },
          { type: ">=", value: ">=" },
          { type: "<", value: "<" },
          { type: "<=", value: "<=" },
          { type: "!=", value: "!=" },
        ]
      }
    },
    paramCNameTree() {
      const row = this.formData;
      if (row.apSource == "00") {
        // 服务输入参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "0"
        );
        const treeData = p.map((item) => {
          item.label = item.paramCName;
          item.leaf = !(item.children?.length > 0);
          return item;
        }).filter(item => item.paramOrder.indexOf(".") == -1);
        return setSerialNumber(treeData);

      } else if (row.apSource == "30") {
        // 服务输出参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "1"
        );
        const treeData = p.map((item) => {
          item.label = item.paramCName;
          item.leaf = !(item.children?.length > 0);
          return item;
        }).filter(item => item.paramOrder.indexOf(".") == -1);
        return setSerialNumber(treeData);
      } else if (row.apSource == "10") {
        // 服务临时参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "3" && item.paramParentId
        );
        const treeData = p.map((item) => {
          item.label = item.paramCName;
          item.leaf = !(item.children?.length > 0);
          return item;
        }).filter(item => item.paramOrder.indexOf(".") == -1);
        return setSerialNumber(treeData);
      } else if (row.apSource == "20") {
        // 组件输出
        return [];
      } else if (row.apSource == "50") {
        // 实时变量
        const treeData = [
          { paramCName: "系统时间", label: "系统时间", leaf: true },
        ];
        return setSerialNumber(treeData);
      }
    },
    otherParamCNameTree() {
      const row = this.formData;
      if (row.otherApSource == "00") {
        // 服务输入参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "0"
        );
        const treeData = p.map((item) => {
          item.label = item.paramCName;
          item.leaf = !(item.children?.length > 0);
          return item;
        }).filter(item => item.paramOrder.indexOf(".") == -1);
        return setSerialNumber(treeData);

      } else if (row.otherApSource == "30") {
        // 服务输出参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "1"
        );
        const treeData = p.map((item) => {
          item.label = item.paramCName;
          item.leaf = !(item.children?.length > 0);
          return item;
        }).filter(item => item.paramOrder.indexOf(".") == -1);
        return setSerialNumber(treeData);
      } else if (row.otherApSource == "10") {
        // 服务临时参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "3" && item.paramParentId
        );
        const treeData = p.map((item) => {
          item.label = item.paramCName;
          item.leaf = !(item.children?.length > 0);
          return item;
        }).filter(item => item.paramOrder.indexOf(".") == -1);
        return setSerialNumber(treeData);
      } else if (row.otherApSource == "20") {
        // 组件输出
        return [];
      } else if (row.otherApSource == "50") {
        // 实时变量
        const treeData = [
          { paramCName: "系统时间", label: "系统时间", leaf: true },
        ];
        return setSerialNumber(treeData);
      }
    },
    paramCNameOption() {
      return this.tableType
        ? this.tableParamList
        : this.getParamKeySelectList(this.formData);
    },
    otherParamCNameOption() {
      return this.tableType
        ? this.tableParamList
        : this.getOtherParamKeySelectList(this.formData);
    },
    triggerCpnNameOption() {
      return this.dataList
        .filter((item) => item.actionId != this.currentObj.actionId)
        .map((item) => {
          return {
            type: item.actionName,
            value: item.actionName,
          };
        });
    },
  },
  inject: ["getDataList"],
  methods: {
    async validator(rule, value, callback) {
      if (rule.field == "otherParamCName") {
        if (this.formData.otherApSource == "40") {
          callback();
        } else if (!value) {
          callback("请选择参数变量");
        } else {
          callback();
        }
      }
    },
    getDescText(formData) {
      return `如果${
        formData.apSource == "40"
          ? "固定值" + formData.paramValue
          : "参数变量" + formData.paramCName
      } ${formData.condTyp} ${
        formData.otherApSource == "40"
          ? "固定值" + formData.otherParamValue
          : "参数变量" + formData.otherParamCName
      }，则循环结束，并触发组件【${formData.triggerCpnName}】`;
    },
    //获取子级
    async loadNode(node, resolve) {
      console.log("loadNode", node);
      this.resolve = resolve;
      if (node.level === 0) {
        return resolve(node.data);
      }
      if (node.level >= 1) {
        return resolve(node.data.children);
      }
    },
    handleNodeClick(data, node, type) {
      console.log("data, node", data, node);
      if (type == "paramCName") {
        this.currentKey = data.serialNumber;
        if (data.leaf || data.paramType == "List") {
          // 选择了List类型的参数或者叶子节点
          const parent = this.currentServObj.puApiParams.find(item => item.paramOrder == data.paramParentId);
          console.log("parent", parent)
          if (parent && parent.paramType == "List") return this.$refs.paramCNameSelect.blur();
          if(parent?.paramType == "Object") {
            // 选了Object的子参数
            this.$nextTick(() => {
              this.formData.otherApSource = "40"
              // this.formData.otherParamValue = "null"
            })
          }
          this.currentParam = data;
          if (parent) {
            this.currentParam.parent = JSON.parse(JSON.stringify(parent));
          }
          this.formData.paramCName = data.paramCName;
          this.$refs.paramCNameSelect.blur();
        } else {
          if (node.loaded) {
            // 已展开
            node.loaded = false;
            node.collapse();
          } else {
            // 未展开
            node.loaded = false;
            node.expand();
          }
        }
      } else {
        this.currentKey = data.serialNumber;
        if (data.leaf || data.paramType == "List") {
          // 选择了List类型的参数或者叶子节点
          const parent = this.currentServObj.puApiParams.find(item => item.paramOrder == data.paramParentId);
          console.log("parent", parent)
          if (parent && parent.paramType == "List") return this.$refs.otherParamCNameSelect.blur();
          if(parent?.paramType == "Object") {
            // 选了Object的子参数
            this.$nextTick(() => {
              this.formData.apSource = "40"
              // this.formData.paramValue = "null"
            })
          }
          this.currentOtherParam = data;
          if (parent) {
            this.currentOtherParam.parent = JSON.parse(JSON.stringify(parent));
          }
          this.formData.otherParamCName = data.paramCName;
          this.$refs.otherParamCNameSelect.blur();
        } else {
          if (node.loaded) {
            // 已展开
            node.loaded = false;
            node.collapse();
          } else {
            // 未展开
            node.loaded = false;
            node.expand();
          }
        }
      }
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.dialogVisible = false;
    },
    showDialog(type, data, currentObj) {
      console.log("showDialog", type, data, currentObj)
      this.type = type;
      if (type == "add") {
        console.log("新增条件", type, data, currentObj);
        // 新增
        this.dataList = this.getDataList();
        const _data = JSON.parse(JSON.stringify(data));
        this.formData = _data;
        this.formData.sourceId = currentObj.actionId
        this.currentObj = currentObj;
        this.dialogVisible = true;
      } else if (type == "edit") {
        // 修改
        console.log("修改条件", type, data, currentObj);
        const _data = JSON.parse(JSON.stringify(data));
        this.formData = _data;
        this.currentParam = _data.paramObj;
        this.currentOtherParam = _data.otherParamObj;
        this.currentObj = currentObj;
        this.dataList = this.getDataList();
        this.dialogVisible = true;
      }
    },
    saveLineDialog() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.formData.paramObj = this.currentParam
        this.formData.otherParamObj = this.currentOtherParam
        this.$emit(
          "saveLineDialog",
          JSON.parse(JSON.stringify(this.formData))
        );
        this.closeDialog();
      });
    },
    //获取操作符上面的
    getParamKeySelectList(row) {
      if (row.apSource == "00") {
        // 服务输入参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "0"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.apSource == "30") {
        // 服务输出参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "1"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.apSource == "10") {
        // 服务临时参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "3"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.apSource == "20") {
        // 组件输出
        return [];
      } else if (row.apSource == "50") {
        return [{ type: "系统时间", value: "系统时间" }];
      }
    },
    //获取操作符下面的参数
    getOtherParamKeySelectList(row) {
      if (row.otherApSource == "00") {
        // 服务输入参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "0"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.otherApSource == "30") {
        // 服务输出参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "1"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.otherApSource == "10") {
        // 服务临时参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "3"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.otherApSource == "20") {
        // 组件输出
        return [];
      }
    },
    selectChange(row, prop) {
      console.log("selectChange", row, prop);
      if (prop == "apSource") {
        // 参数来源下拉框变更时
        this.resetRow(this.formData, prop);
        if (row.apSource == "20") {
          this.$refs.selectDialogRef.showDialog(row, this.currentObj);
        }
        if (row.apSource == "40") {
          this.$refs.selectTypeDialogRef.showDialog(row, prop);
        }
      } else if (prop == "otherApSource") {
        // 参数来源下拉框变更时
        this.resetRow(this.formData, prop);
        if (row.otherApSource == "20") {
          this.$refs.selectDialogRef.showDialog(row, this.currentObj);
        }
        if (row.otherApSource == "40") {
          this.$refs.selectTypeDialogRef.showDialog(row, prop);
        }
      } else if (prop == "paramCName") {
        console.log("参数变量1改变");
        if (row.apSource == "20") {
          if (!row.paramCName) return;
          row.paramKey = row.paramCName;
          const list = this.tableParamList.filter((item) => {
            return item.paramKey == row.paramKey;
          });
          row.paramCName = `${row.actionName}.${list[0].paramCName}`;
          row.paramType = list[0].paramType;
          row.paramLength = list[0].paramLength;
        } else if (row.apSource == "50") {
        } else {
          if (!row.paramCName) return;
          row.paramKey = row.paramCName;
          const list = this.currentServObj.puApiParams.filter((item) => {
            return item.paramKey == row.paramKey;
          });
          console.log("list", list);
          row.paramCName = list[0].paramCName;
          row.paramType = list[0].paramType;
          row.paramLength = list[0].paramLength;
          if (
            row.paramType !== row.otherParamType &&
            row.paramType &&
            row.otherParamType
          ) {
            row.paramCName = row.paramType = row.paramKey = "";
            this.$message.error("类型必须保持一致，请重新选择");
          }
        }
      } else if (prop == "otherParamCName") {
        console.log("参数变量2改变");
        if (row.otherApSource == "20") {
          if (!row.otherParamCName) return;
          row.otherParamKey = row.otherParamCName;
          const list = this.tableParamList.filter((item) => {
            return item.paramKey == row.otherParamKey;
          });
          row.otherParamCName = `${row.actionName}.${list[0].paramCName}`;
          row.otherParamType = list[0].paramType;
          row.otherPparamLength = list[0].paramLength;
        } else if (row.apSource == "50") {
        } else {
          if (!row.otherParamCName) return;
          row.otherParamKey = row.otherParamCName;
          const list = this.currentServObj.puApiParams.filter((item) => {
            return item.paramKey == row.otherParamKey;
          });
          row.otherParamCName = list[0].paramCName;
          row.otherParamType = list[0].paramType;
          row.otherPparamLength = list[0].paramLength;
          if (
            row.paramType !== row.otherParamType &&
            row.otherParamType &&
            row.paramType
          ) {
            row.otherParamCName = row.otherParamType = row.otherParamKey = "";
            this.$message.error("类型必须保持一致，请重新选择");
          }
        }
      }
    },
    resetRow(row, prop) {
      if (prop == "apSource") {
        row.paramCName =
          row.condTyp =
          row.paramValue =
          row.otherParamCName =
          row.otherApSource =
            "";
        this.currentParam = {}
        this.currentOtherParam = {}
      } else if (prop == "otherApSource") {
        row.otherParamCName = "";
        this.currentParam = {}
        this.currentOtherParam = {}
      }
    },
    getParamsType(data) {
      console.log("选择的参数", data);
      if (data.paramsSource == "apSource") {
        this.formData.paramType = data.paramsType;
      } else if (data.paramsSource == "otherApSource") {
        this.formData.otherParamType = data.paramsType;
      }
    },
    init() {},
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
.aop_tradedesign_comps_design_attr_line {
  .edit_form {
    margin-top: 10px;
    @include form;
    .ap_soure_50 {
      ::v-deep .el-input__inner {
        border-color: $theme_color !important;
      }
    }
    .ap_soure_40_null {
      ::v-deep .el-input__inner {
        border-color: $theme_color !important;
      }
    }
    .no_dropdown__empty {
      ::v-deep .el-select-dropdown__empty {
        display: none !important;
      }
    }
    .setstyle {
      min-height: 200px !important;
      padding: 0 !important;
      margin: 0;
      overflow: auto;
      cursor: default !important;
      .custom_tree_node {
        position: relative;
        width: 100%;
        .disabled {
          color: #ccc;
        }
      }
    }
  }
  .condition_desc {
    padding-bottom: 20px;
    text-align: center;
  }
  .table_style ::v-deep .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
</style>
