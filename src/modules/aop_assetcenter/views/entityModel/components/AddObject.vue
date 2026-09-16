<template>
  <div class="add-object-drawer">
    <el-drawer
      :title="showType == 'add' ? '新建对象' : '编辑对象'"
      :visible.sync="isShow"
      size="800px"
      :wrapperClosable="false"
      :before-close="handleClose"
    >
      <div class="drawer-content" v-loading="loading">
        <el-tabs v-model="activeTab" class="fixed-tab">
          <el-tab-pane label="" name="1">
            <span slot="label" :style="{ color: tabError1 ? '#f56c6c' : '' }">
              基本信息<i
                v-if="tabError1"
                class="el-icon-warning-outline"
                style="margin-left: 4px"
              ></i>
            </span>
            <el-form ref="base" :model="formData" :rules="rules" size="small">
              <el-form-item label="对象名称" prop="objName">
                <el-input
                  maxLength="32"
                  v-model.trim="formData.objName"
                  placeholder="请输入对象中文名称"
                />
              </el-form-item>
              <el-form-item label="编码" prop="objCode">
                <el-input
                  maxLength="32"
                  v-model.trim="formData.objCode"
                  placeholder="字母、数字组合的编码，大写开头"
                />
              </el-form-item>
              <el-form-item label="对象类型" prop="objType">
                <el-select
                  placeholder="请选择对象类型"
                  style="width: 100%"
                  v-model="formData.objType"
                  disabled
                >
                  <el-option label="实体对象" value="00"></el-option>
                  <el-option label="值对象" value="01"></el-option>
                  <el-option label="聚合根对象" value="02"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属业务域" prop="bizDomainNo">
                <el-select
                  placeholder="请选择所属业务域"
                  style="width: 100%"
                  v-model="formData.bizDomainNo"
                  disabled
                >
                  <el-option
                    :label="project && project.bizDomainNm"
                    :value="project && project.bizDomainNo"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属中心" prop="applicationNo">
                <el-select
                  placeholder="请选择所属中心"
                  style="width: 100%"
                  v-model="formData.applicationNo"
                  disabled
                >
                  <el-option
                    :label="project && project.projectNm"
                    :value="project && project.projectId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分类" prop="objClass">
                <el-select
                  placeholder="请先选择中心"
                  style="width: 100%"
                  v-model="formData.objClass"
                  disabled
                >
                  <el-option
                    :label="project && project.objClsNm"
                    :value="project && project.objClsCd"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述" prop="objDesc">
                <el-input
                  maxLength="500"
                  type="textarea"
                  v-model.trim="formData.objDesc"
                  placeholder="请输入描述"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="对象属性" name="2">
            <p
              style="
                display: flex;
                justify-content: flex-start;
                align-items: center;
              "
            >
              <el-input
                maxLength="32"
                v-model.trim="attrInput"
                placeholder="请输入字段名称或编码"
                clearable
                size="small"
                style="width: 180px; margin-right: 12px"
                @clear="attributeInfos_filter = formData.attributeInfos"
              />
              <el-button type="primary" size="small" @click="searchAttr"
                >搜索</el-button
              >
              <el-button type="primary" size="small" @click="addAttributes"
                >添加对象属性</el-button
              >
            </p>
            <el-table
              :data="attributeInfos_filter"
              style="width: 100%; margin: 12px 0"
              size="small"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="dictryName"
                label="字段名称"
              ></el-table-column>
              <el-table-column prop="dictryNo" label="编码"></el-table-column>
              <el-table-column
                prop="dictryType"
                label="数据类型"
              ></el-table-column>
              <el-table-column prop="dictryDesc" label="描述">
                <template slot-scope="scope">
                  <span>{{ scope.row.dictryDesc || "/" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80px" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    style="color: #f56c6c"
                    type="text"
                    @click="deleteAttr(scope.$index)"
                    size="small"
                    >删除</el-button
                  >
                </template></el-table-column
              >
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            label="对象关系"
            name="3"
            v-if="formData.objType != '01'"
          >
            <el-button type="primary" size="small" @click="addRel"
              >添加对象关系</el-button
            >
            <el-table
              :data="formData.objectRelInfos"
              style="width: 100%; margin: 12px 0"
              size="small"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="obrName"
                label="关系名称"
              ></el-table-column>
              <el-table-column prop="obrCode" label="编码"></el-table-column>
              <el-table-column
                prop="curObjName"
                label="当前对象"
              ></el-table-column>
              <el-table-column
                prop="tgtObjName"
                label="目标对象"
              ></el-table-column>
              <el-table-column prop="obrRelash" label="关系类型">
                <template slot-scope="scope">
                  <span>{{ objRelTpCdNmMap[scope.row.obrRelash] || "/" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="relashMult" label="关系重数">
                <template slot-scope="scope">
                  <span>{{ formatRelation(scope.row) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="110px" fixed="right">
                <template slot-scope="scope">
                  <template v-if="scope.row.relConvert">
                    <span>/</span>
                  </template>
                  <template v-else>
                    <template v-if="isTgtInCurrentCenter(scope.row.tgtObjId)">
                      <el-button
                        type="text"
                        @click="editRel(scope.row)"
                        size="small"
                        >编辑</el-button
                      >
                      <el-divider direction="vertical" />
                    </template>
                    <el-button
                      style="color: #f56c6c"
                      type="text"
                      @click="deleteRel(scope.$index)"
                      size="small"
                      >删除</el-button
                    >
                  </template>
                </template></el-table-column
              >
            </el-table>
          </el-tab-pane>
          <template v-if="showType == 'edit'">
            <el-tab-pane
              label="对象行为"
              name="4"
              v-if="formData.objType != '01'"
            >
              <div class="behaviors">
                <div class="left-btns">
                  <el-button
                    type="primary"
                    size="small"
                    @click="addBehavior"
                    style="width: 100%"
                    >添加对象行为</el-button
                  >
                  <el-button
                    :type="
                      editBehaviorForm && index == editBehaviorForm.formIndex
                        ? 'primary'
                        : ''
                    "
                    size="small"
                    plain
                    v-for="(be, index) in formData.objectBehaviorInfos"
                    @click="selectBeh(be, index)"
                    :key="index"
                  >
                    {{ be.obeName }}
                  </el-button>
                </div>
                <div class="right-info" v-if="editBehaviorForm">
                  <div class="info-title">
                    <span class="title">基本信息</span>
                    <div>
                      <el-button type="primary" size="mini" @click="confirmBeh"
                        >确定</el-button
                      >
                      <el-button type="danger" size="mini" @click="deleteBeh"
                        >删除</el-button
                      >
                    </div>
                  </div>

                  <el-form
                    ref="be_base"
                    :model="editBehaviorForm"
                    :rules="editBehaviorFormRules"
                    size="small"
                  >
                    <el-form-item label="行为名称" prop="obeName">
                      <el-input
                        maxLength="32"
                        v-model.trim="editBehaviorForm.obeName"
                        placeholder="请输入行为名称"
                      />
                    </el-form-item>
                    <el-form-item label="行为编码" prop="obeNo">
                      <el-input
                        maxLength="32"
                        v-model.trim="editBehaviorForm.obeNo"
                        placeholder="字母、数字组合的编码，小写开头"
                      />
                    </el-form-item>
                    <el-form-item label="描述" prop="obeDesc">
                      <el-input
                        maxLength="500"
                        type="textarea"
                        v-model.trim="editBehaviorForm.obeDesc"
                        placeholder="请输入描述"
                      />
                    </el-form-item>
                    <div class="title2">
                      <span class="title">映射S6服务</span>
                    </div>
                    <el-form-item
                      label="选择S6服务"
                      prop="s6ApiId"
                      label-width="100px"
                    >
                      <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="selectS6Dialog"
                        >选择</el-button
                      >
                    </el-form-item>
                    <el-table
                      :data="editBehaviorForm.s6InfoArr"
                      style="width: 100%; margin: 12px 0"
                      size="small"
                      align="center"
                      :stripe="false"
                      border
                      :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                      }"
                    >
                      <el-table-column
                        prop="aiCode"
                        label="服务编码"
                      ></el-table-column>
                      <el-table-column
                        prop="aiName"
                        label="服务名称"
                      ></el-table-column>
                      <el-table-column prop="aiState" label="服务状态">
                        <span>/</span>
                      </el-table-column>
                      <el-table-column label="操作" width="110px" fixed="right">
                        <template slot-scope="scope">
                          <el-button
                            type="text"
                            @click="viewS6(scope.row)"
                            size="small"
                            >查看</el-button
                          >
                          <el-divider direction="vertical" />
                          <el-button
                            style="color: #f56c6c"
                            type="text"
                            @click="deleteS6(scope.$index)"
                            size="small"
                            >删除</el-button
                          >
                        </template></el-table-column
                      >
                    </el-table>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
          </template>
          <el-tab-pane label="映射库表对象" name="5">
            <template v-if="formData.objType == '00'">
              <el-button
                type="primary"
                size="small"
                @click="addSysObjVisible = true"
                >选择库表对象</el-button
              >
            </template>
            <!-- sysObjList -->
            <el-table
              :data="formatSysObjList(formData.sysObjList)"
              style="width: 100%; margin: 12px 0"
              size="small"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="objCd"
                label="库表对象编码"
              ></el-table-column>
              <el-table-column
                prop="objNm"
                label="库表对象名称"
              ></el-table-column>
              <el-table-column
                prop="bizDomainNm"
                label="业务域"
              ></el-table-column>
              <el-table-column
                prop="appCntrNm"
                label="所属中心"
              ></el-table-column>
              <el-table-column prop="objClsNm" label="分类"></el-table-column>
              <el-table-column prop="attrs" label="属性"></el-table-column>
              <el-table-column label="操作" width="120px" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="designSysObj(scope.row)"
                    size="small"
                    >设计</el-button
                  >
                  <template v-if="formData.objType == '00'">
                    <el-divider direction="vertical" />
                    <el-button
                      style="color: #f56c6c"
                      type="text"
                      @click="deleteSysObj(scope.$index)"
                      size="small"
                      >删除</el-button
                    >
                  </template>
                </template></el-table-column
              >
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="bottom-btns">
        <el-button size="medium" @click="handleClose">取 消</el-button>
        <el-button size="medium" type="primary" @click="confirm"
          >确 定</el-button
        >
      </div>
    </el-drawer>

    <AddAttr
      ref="addAttr"
      :visible="addAttrVisible"
      :sysObjList="formData.sysObjList"
      v-if="addAttrVisible"
      @close="addAttrVisible = false"
      @confirm="selectedAttr"
    />

    <AddRelation ref="addRelDialog" @relation="optRelation" />

    <AddSysObj
      v-if="addSysObjVisible"
      :visible="addSysObjVisible"
      :project="project"
      @close="addSysObjVisible = false"
      @select="selectSysObj"
    />

    <SelectS6
      v-if="selectS6Visible"
      :visible="selectS6Visible"
      :formData="formData"
      :project="project"
      @select="selectS6Info"
      @close="selectS6Visible = false"
    />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import AddAttr from "./AddAttr.vue";
import AddRelation from "./AddRelation.vue";
import AddSysObj from "./AddSysObj.vue";
import SelectS6 from "./SelectS6.vue";
import _ from "lodash";
export default {
  mixins: [mixin],
  props: {
    project: {
      type: Object,
      default: () => {},
    },
    designType: {
      type: String,
      default: "domain_model", // domain_model 产品域模型 product_model 产品模型
    },
    treeNodeData: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    AddAttr,
    AddRelation,
    AddSysObj,
    SelectS6,
  },
  data() {
    return {
      loading: false,

      node: null,
      isShow: false,
      activeTab: "1",
      tabError1: false,

      addAttrVisible: false,
      addSysObjVisible: false,

      showType: "add",
      currentObject: null,
      position: null,

      formData: {
        objId: "",
        objName: "",
        objCode: "",
        objType: "00",
        applicationNo: "",
        bizDomainNo: "",
        objClass: "",
        objDesc: "",
        approvalStatus: "00",

        attributeInfos: [], // 对象属性
        objectRelInfos: [], // 对象关系
        objectBehaviorInfos: [], // 对象行为
        sysObjList: [], // 映射库表对象
      },
      attributeInfos_filter: [],
      editBehaviorForm: null,
      editBehaviorFormRules: {
        obeName: [
          { required: true, message: "请输入对象中文名称", trigger: "blur" },
        ],
        obeNo: [
          {
            required: true,
            pattern: "^[a-z]{1}([a-zA-Z0-9._]){0,32}$",
            message: "字母、数字组合的编码，小写开头",
            trigger: "blur",
          },
        ],
        s6ApiId: [{ required: true, message: "请选择S6服务" }],
      },
      behaviorForm: {
        obeName: "未定义",
        obeNo: "",
        objId: "",
        obeDesc: "",
        s6ApiId: "",
        s6Info: null,
        s6InfoArr: [],
        approvalStatus: "00",
      },
      rules: {
        objName: [
          { required: true, message: "请输入对象中文名称", trigger: "blur" },
        ],
        objCode: [
          {
            required: true,
            pattern: "^[A-Z]{1}([a-zA-Z0-9._]){0,32}$",
            message: "字母、数字组合的编码，大写开头",
            trigger: "blur",
          },
        ],
        objType: [{ required: true, trigger: "change" }],
        applicationNo: [{ required: true, trigger: "change" }],
        bizDomainNo: [{ required: true, trigger: "change" }],
        objClass: [{ required: true, trigger: "change" }],
      },
      selectS6Visible: false,
      objRelTpCdNmMap: {
        association: "关联",
        aggregation: "聚合",
        combination: "组合",
        extends: "继承",
      },

      objList: [],

      relationMap: {
        "0-N": "1:0..*",
        "1-N": "1:1..*",
        "0-1": "1:0..1",
        "1-1": "1:1",
        "N-0": "1:1",
        "N-1": "1:1",
        "1-0": "1:0..1",
      },

      attrInput: "",
    };
  },
  methods: {
    searchAttr() {
      const keyword = (this.attrInput || "").trim().toLowerCase();
      if (!keyword) {
        this.attributeInfos_filter = [...this.formData.attributeInfos];
        return;
      }
      this.attributeInfos_filter = this.formData.attributeInfos.filter(
        (item) => {
          const dictryName = (item.dictryName || "").toLowerCase();
          const dictryNo = (item.dictryNo || "").toLowerCase();
          return dictryName.includes(keyword) || dictryNo.includes(keyword);
        }
      );
    },

    formatRelation(row) {
      if (row.object1Multiplicity && row.object2Multiplicity) {
        return this.relationMap[
          `${row.object1Multiplicity}-${row.object2Multiplicity}`
        ];
      }
      return "/";
    },
    isTgtInCurrentCenter(objId) {
      return _.some(this.objList, (i) => i.objId == objId);
    },
    async show(node) {
      this.node = node;
      this.position = node.position();
      let nodeData = node.getData();
      this.formData.applicationNo = this.project.projectId;
      this.formData.bizDomainNo = this.project.bizDomainNo;
      this.formData.objClass = this.project.objClsCd;
      this.isShow = true;
      if (nodeData.isNew) {
        this.showType = "add";
        this.currentObject = null;
      } else {
        this.showType = "edit";
        this.loading = true;
        this.currentObject = nodeData;
        const res = await this.rpc.assetcenter.qryBizObjectInfoV2({
          objId: nodeData.objId,
          belongId:
                this.designType == "domain_model"
                  ? this.project.projectId
                  : this.treeNodeData.id,
              belongType:
                this.designType == "domain_model"
                  ? "app"
                  : this.formatBelongType(this.treeNodeData),
              designType: this.designType,
        });
        this.formData = { ...res, sysObjList: [] };
        this.formData.applicationNo = this.project.projectId;
        this.formData.bizDomainNo = this.project.bizDomainNo;
        this.formData.objClass = this.project.objClsCd;
        this.loading = false;
        if (this.formData.objectBehaviorInfos.length) {
          this.selectBeh(this.formData.objectBehaviorInfos[0], 0);
        }

        if (this.formData.l5ObjIds.length) {
          const ps = this.formData.l5ObjIds.map((id) => {
            return this.rpc.assetcenter.qrySysBizObjectInfo({
              objId: id,
            });
          });
          const results = await Promise.all(ps);
          this.formData.sysObjList = results;
        }
      }

      this.attributeInfos_filter = this.formData.attributeInfos;
      this.formData.objType = nodeData.objType;

      let list = window.localStorage.getItem("obj_list_in_center_business");
      if (list) {
        this.objList = JSON.parse(list);
      }

      this.$refs.base && this.$refs.base.clearValidate();
    },
    handleClose() {
      this.isShow = false;
      this.resetForm();
      if (this.showType == "add") {
        this.$emit("cancel", this.node);
      }
    },
    resetForm() {
      this.formData = {
        objId: "",
        objName: "",
        objCode: "",
        objType: "00",
        applicationNo: "",
        bizDomainNo: "",
        objClass: "",
        objDesc: "",
        approvalStatus: "00",
        attributeInfos: [], // 对象属性

        objectRelInfos: [], // 对象关系
        objectBehaviorInfos: [], // 对象行为
        sysObjList: [], // 映射库表对象
      };
      this.attributeInfos_filter = [];
      this.activeTab = "1";
      this.currentObject = null;
      this.tabError1 = false;
      this.$refs.base && this.$refs.base.resetFields();
    },

    addBehavior() {
      this.formData.objectBehaviorInfos.unshift(this.behaviorForm);
    },
    selectBeh(item, index) {
      this.editBehaviorForm = {
        ...item,
        s6InfoArr: item.s6Info ? [item.s6Info] : [],
        formIndex: index,
      };
      this.$refs.be_base && this.$refs.be_base.clearValidate();
    },
    deleteBeh() {
      this.$confirm("确定删除当前对象?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formData.objectBehaviorInfos.splice(
            this.editBehaviorForm.formIndex,
            1
          );
          this.editBehaviorForm = null;
        })
        .catch(() => {});
    },
    selectS6Dialog() {
      if (this.formData.sysObjList.length) {
        this.selectS6Visible = true;
      } else {
        if (this.formData.objType == "00") {
          this.$confirm("请先映射库表对象", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.activeTab = "5";
            })
            .catch(() => {});
        } else if (this.formData.objType == "02") {
          if (this.formData.objectRelInfos.length) {
            this.selectS6Visible = true;
          } else {
            this.$confirm("请先添加对象关系", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.activeTab = "3";
              })
              .catch(() => {});
          }
        }
      }
    },
    confirmBeh() {
      this.$refs.be_base.validate(async (valid) => {
        if (valid) {
          this.$set(
            this.formData.objectBehaviorInfos,
            this.editBehaviorForm.formIndex,
            this.editBehaviorForm
          );
        }
      });
    },
    viewS6(row) {
      window.open(
        `/aop-h5-sub/#/aop_l5design/application/serviceS6BaseInfo?apiId=${row.aiId}&bizDomainNo=${row.beltLine}&currentType=S5&mode=view`,
        "_blank"
      );
    },
    deleteS6() {
      this.$confirm("确定删除当前S6服务", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.editBehaviorForm.s6ApiId = "";
          this.editBehaviorForm.s6InfoArr = [];
          this.editBehaviorForm.s6Info = null;
        })
        .catch(() => {});
    },
    selectS6Info(obj) {
      this.editBehaviorForm.s6ApiId = obj.selectedId;
      this.editBehaviorForm.s6Info = obj.info;
      this.editBehaviorForm.s6InfoArr = [obj.info];
      this.selectS6Visible = false;
    },
    addAttributes() {
      this.addAttrVisible = true;
    },
    deleteAttr(index) {
      this.$confirm("确定删除当前属性?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let obj = this.attributeInfos_filter[index];
          this.attributeInfos_filter.splice(index, 1);
          const targetIndex = this.formData.attributeInfos.findIndex((item) => {
            return item && item.dictryNo === obj.dictryNo;
          });
          if (targetIndex !== -1) {
            this.formData.attributeInfos.splice(targetIndex, 1);
          }
        })
        .catch(() => {});
    },
    selectedAttr(selection) {
      let _data = selection.map((item) => ({
        dictryName: item.attrChiNm,
        dictryNo: item.attrEngNm,
        dictryId: item.objAttrId,
        dictryType: item.attrTpCd,
        required: "",
      }));
      this.formData.attributeInfos = this.uniq(
        [...this.formData.attributeInfos, ..._data],
        ["dictryNo"]
      );
      this.attributeInfos_filter = this.formData.attributeInfos;
      this.attrInput = "";
      this.addAttrVisible = false;
    },
    uniq(arr, key) {
      if (arr.length == 0 || !arr) return [];
      const keys = [];
      return arr.filter((item) =>
        keys.indexOf(item[key]) == -1 ? keys.push(item[key]) : false
      );
    },
    addRel() {
      this.$refs.base.validate(async (valid) => {
        if (valid) {
          let relList = this.formData.objectRelInfos.map((i) => {
            return {
              ...i,
              objId: i.tgtObjId,
            };
          });
          let all = this.objList.filter(
            (i) => i.objType == "00" || i.objType == "01"
          );
          let targetObjList = _.differenceBy(
            all,
            [this.formData, ...relList],
            "objId"
          );
          this.$refs.addRelDialog.show(
            this.formData,
            null,
            null,
            targetObjList
          );
        } else {
          this.tabError1 = true;
          this.activeTab = "1";
        }
      });
    },
    editRel(row) {
      let all = this.objList.filter(
        (i) => i.objType == "00" || i.objType == "01"
      );
      let targetObj = null;
      targetObj = all.filter((i) => i.objId == row.tgtObjId)[0];
      let targetObjList = _.differenceBy(all, [this.formData], "objId");
      this.$refs.addRelDialog.show(
        this.formData,
        row,
        targetObj,
        targetObjList
      );
    },
    deleteRel(index) {
      this.$confirm("确定删除当前对象关系?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formData.objectRelInfos.splice(index, 1);
        })
        .catch(() => {});
    },
    optRelation(relation, edge, relationType) {
      if (relation.obrId || relationType == "edited") {
        const index = this.formData.objectRelInfos.findIndex(
          (item) => item.obrId === relation.obrId
        );
        if (index !== -1) {
          this.$set(this.formData.objectRelInfos, index, relation);
        }
      } else {
        this.formData.objectRelInfos.push(relation);
      }
    },
    selectSysObj(row) {
      // 实体对象，替换
      this.formData.sysObjList = [row];
      this.addSysObjVisible = false;
    },
    deleteSysObj(index) {
      this.$confirm("确定删除当前映射库表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formData.sysObjList.splice(index, 1);
        })
        .catch(() => {});
    },
    designSysObj(row) {
      window.open(
        `/aop-h5-sub/#/aop_businessmold2/modelDesign/objectGraphDesign?projectId=${row.appCntrNo}&bizDomainNo=${row.bizDomainNo}&objId=${row.objId}`,
        "_blank"
      );
    },
    formatSysObjList(arr) {
      return arr.map((i) => {
        let arr = i.l5SysBizObjectAttributeDTOs;
        let attrs = arr
          .map((a) => a.attrChiNm)
          .filter((a) => a)
          .join("、");
        return {
          ...i,
          bizDomainNm: i.bizDomainNm || this.project.bizDomainNm,
          appCntrNm: i.appCntrNm || this.project.projectNm,
          attrs: i.l5SysBizObjectAttributeDTOs.length ? attrs : "/",
        };
      });
    },
    async confirm() {
      this.$refs.base.validate(async (valid) => {
        if (valid) {
          this.tabError1 = false;
          if (this.formData.objType == "02") {
            if (
              !_.some(
                this.formData.objectRelInfos,
                (i) => i.obrRelash == "aggregation"
              )
            ) {
              this.$message.error("聚合根对象必须包含聚合关系");
              this.activeTab = "3";
              return;
            }
          }

          let l5ObjId = "";
          if (this.formData.objType == "00") {
            if (this.formData.sysObjList.length) {
              l5ObjId = this.formData.sysObjList[0].objId;
            }
          }
          let objectRelInfos = this.formData.objectRelInfos.map((i) => {
            return {
              ...i,
              belongId:
                this.designType == "domain_model"
                  ? this.project.projectId
                  : this.treeNodeData.id,
              belongType:
                this.designType == "domain_model"
                  ? "app"
                  : this.formatBelongType(this.treeNodeData),
              designType: this.designType,
            };
          });
          this.formData.objectRelInfos = objectRelInfos;
          let params = {
            ...this.formData,
            bizDomainNo: this.project.bizDomainNo,
            applicationNo: this.project.projectId,
            objClassName: this.project.objClsNm,
            locationInfo: {
              belongId:
                this.designType == "domain_model"
                  ? this.project.projectId
                  : this.treeNodeData.id,
              belongType:
                this.designType == "domain_model"
                  ? "app"
                  : this.formatBelongType(this.treeNodeData),
              designType: this.designType,
              nodeProps: JSON.stringify({ position: this.position }),
            },
            l5ObjId,
          };
          const { objId, aggregationBaseInfo } =
            await this.rpc.assetcenter.saveBizObjectInfoV2(params);
          let aggObjs = this.formData.objectRelInfos.filter(
            (i) => i.obrRelash == "aggregation"
          );

          if (
            this.formData.objType == "02" &&
            aggObjs.length &&
            aggregationBaseInfo
          ) {
            await this.rpc.assetcenter.saveAggregationBizObjRel({
              aggregationId: aggregationBaseInfo.aggregationId,
              objIds: aggObjs.map((i) => i.tgtObjId),
            });
          }

          if (this.showType == "add") {
            this.$emit("add", this.node, objId, aggregationBaseInfo);
            this.$message.success("添加成功!");
          } else {
            this.$emit("update", this.node);
            this.$message.success("修改成功!");
          }

          this.isShow = false;
          this.resetForm();
        } else {
          this.tabError1 = true;
          this.activeTab = "1";
        }
      });
    },
    formatBelongType(data) {
      let map = {
        "00": "product_tree",
        "01": "product",
        "02": "business",
        "03": "process",
        "04": "ctr_point",
        "05": "settlement",
      };
      return map[data.dataType] || "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/mixin.scss";
/deep/ .el-drawer__header {
  margin: 0;
  padding: 12px;
  color: #333;
  font-weight: 700;
  border-bottom: 1px solid #e2e2e2;
}
/deep/ .el-drawer__body {
  padding: 12px 12px 0 12px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
  .bottom-btns {
    height: 60px;
    border-top: 1px solid #e7e7e7;
    @include flex(row, center, center);
    .el-button {
      margin: 0 12px;
    }
  }
  .drawer-content {
    flex: 1;
    overflow: hidden;
    .fixed-tab {
      display: flex;
      flex-direction: column;
      height: 100%;
      .el-tabs__header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: #fff;
        margin: 0 !important;
        border-bottom: 1px solid #e6e6e6;
      }
      .el-tabs__content {
        flex: 1;
        overflow-y: auto;
        padding: 12px 0;
      }
    }
    .el-tabs {
      .el-tabs__content {
        .el-tab-pane {
          height: 100%;
          .behaviors {
            @include flex(row, space-between, flex-start);
            height: 100%;
            .left-btns {
              @include flex(column, flex-start, center);
              width: 140px;
              height: 100%;
              overflow-y: scroll;
              .el-button {
                margin-left: 0 !important;
                width: 100%;
                margin-bottom: 12px;

                @include flex(row, center, center);
                padding: 8px 0 !important;
                span {
                  width: 116px;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: normal;
                  line-height: 1.2;
                }
              }
            }
            .right-info {
              flex: 1;
              padding-left: 12px;
              margin-left: 12px;
              border-left: 1px solid #e5e5e5;
              .info-title {
                @include flex(row, space-between, center);
                margin-bottom: 12px;
              }
              .title2 {
                display: flex;
                margin: 24px 0 12px 0;
              }
              .title {
                font-size: 14px;
                font-weight: 600;
              }
              .title::before {
                content: "";
                display: inline-block;
                width: 4px;
                height: 10px;
                margin-right: 2px;
                background-color: #358aff;
              }
            }
          }
        }
      }
    }
  }
}
</style>

