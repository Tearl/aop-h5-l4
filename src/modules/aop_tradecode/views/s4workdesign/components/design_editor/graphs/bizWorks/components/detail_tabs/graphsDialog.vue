<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <div class="m-navbar" v-if="navThree || navTwo || nav"></div>
    <transition name="nav">
      <div class="m-navba" id="right" v-if="navThree || navTwo || nav">
        <div class="resize" id="resize"></div>
        <div v-if="nav">
          <div class="m-title">
            {{ existCode == null ? "新建对象" : "编辑对象" }}
            <img
              class="closeDialog"
              src="@m/assets/images/icon_close.png"
              @click="cancel"
            />
          </div>
          <el-tabs
            id="tapId"
            class="tapStyles"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane name="first">
              <span slot="label" :class="{ errorRule: firstError == true }"
                >基本信息
                <i v-if="firstError == true" class="el-icon-warning-outline"></i
              ></span>

              <el-form
                ref="firstForm"
                :disabled="$route.query.action == 'preview'"
                :model="fromData"
                :rules="rules"
              >
                <el-form-item label="对象名称" prop="objName">
                  <el-input
                    maxLength="32"
                    v-model="fromData.objName"
                    placeholder="请输入对象中文名称"
                    @blur="updateCurObj"
                  />
                </el-form-item>
                <el-form-item label="编码" prop="objCode">
                  <el-input
                    maxLength="32"
                    placeholder="请输入对象英文名称"
                    :disabled="existCode"
                    v-model="fromData.objCode"
                    @blur="updateCurObj"
                  />
                </el-form-item>
                <el-form-item
                  label="对象类型"
                  style="margin-right: 0; position: relative"
                  prop="objType"
                >
                  <el-checkbox
                    style="position: absolute; right: 5px; top: 0"
                    :true-label="'0'"
                    :false-label="'1'"
                    v-model="fromData.objAggRoor"
                    >聚合根
                    <el-popover
                      placement="top-start"
                      width="470"
                      trigger="hover"
                      content="标记为聚合根的实体对象在生成代码时，将在repository层生成单对象的增删改查操作"
                    >
                      <i
                        slot="reference"
                        class="el-icon-warning-outline"
                      ></i> </el-popover
                  ></el-checkbox>
                  <el-select
                    placeholder="请选择对象类型"
                    style="width: 100%"
                    v-model="fromData.objType"
                  >
                    <el-option label="实体对象" value="00"></el-option>
                    <el-option label="值对象" value="01"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="分类" prop="objClass">
                  <el-select
                    style="width: 100%"
                    placeholder="请选择"
                    v-model="fromData.objClass"
                  >
                    <el-option
                      v-for="(item, index) in objClassList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      @click.native="fromData.objClassName = item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="objDesc">
                  <el-input
                    maxLength="500"
                    type="textarea"
                    v-model="fromData.objDesc"
                    class="widthInput"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="对象属性" name="second">
              <el-button
                v-if="$route.query.action != 'preview'"
                type="primary"
                class="right_button"
                size="medium"
                @click="
                  $refs.userDefinedRef.showDialog();
                  editStorage = fromData.attributeInfos;
                "
                >添加对象属性</el-button
              >
              <Table
                :table="columnList"
                :data="fromData.attributeInfos"
                height="calc(100vh - 240px)"
                @operate="operate"
              ></Table>
            </el-tab-pane>
            <!-- <el-tab-pane name="third">
            <span slot="label" :class="{ errorRule: thirdError == true }"
              >对象行为
              <i
                v-if="thirdError == true"
                slot="reference"
                class="el-icon-warning-outline"
              ></i
            ></span>
            <div class="activeBox">
              <div class="left-part">
                <div class="left-part-main">
                  <div class="left-part-main-head">
                    <el-button
                      size="mini"
                      icon="el-icon-plus"
                      @click="
                        fromData.objectBehaviorInfos.push({
                          obeId: '',
                          objId: '',
                          obeNo: '',
                          obeName: '',
                          obeDesc: '',
                          inputs: [],
                          outputs: [],
                        })
                      "
                      >添加对象行为</el-button
                    >
                  </div>
                </div>
                <div class="left-part-main-list">
                  <ul>
                    <li
                      v-for="(item, index) in fromData.objectBehaviorInfos"
                      :key="index"
                      :style="
                        abId != index &&
                        (!item.obeName || !item.obeNo) &&
                        thirdError
                          ? 'color:#d11211'
                          : ''
                      "
                      :class="{ active: abId == index }"
                    >
                      <p style="display: flex">
                        <img
                          style=""
                          :src="require('./images/icon_tip.png')"
                          alt=""
                        />
                        <span
                          style="width: 110px"
                          class="project-name"
                          @click="abId = index"
                          >{{ item.obeName || "未定义" }}</span
                        >
                        <i
                          class="el-icon-delete"
                          style="margin-top: 5px"
                          @click="deleteProject"
                          v-show="abId == index"
                        ></i>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                v-for="(item, index) in fromData.objectBehaviorInfos"
                :key="index"
              >
                <div class="right-part" v-show="abId == index">
                  <el-form ref="thirdForm" :rules="activeRules" :model="item">
                    <el-form-item label="对象行为" prop="obeName">
                      <el-input
                        v-model="item.obeName"
                        placeholder="请输入对象行为"
                      />
                    </el-form-item>
                    <el-form-item label="编码" prop="obeNo">
                      <el-input v-model="item.obeNo" placeholder="请输入编码" />
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input
                       class='widthInput'
                        type="textarea"
                        v-model="item.obeDesc"
                        placeholder="请输入描述"
                      />
                    </el-form-item>
                  </el-form>
                  <div class="table-title">
                    行为入参：
                    <el-button
                      type="primary"
                      class="right_button"
                      size="medium"
                      @click="
                        dialogVisiable = true;
                        editStorage = item.inputs;
                      "
                    >
                      <i class="el-icon-plus"></i>添加参数</el-button
                    >
                  </div>

                  <Table
                    :table="columnListSmall"
                    :data="item.inputs"
                    @operate="operateParams"
                  ></Table>

                  <div class="table-title">
                    行为出参：
                    <el-button
                      type="primary"
                      class="right_button"
                      size="medium"
                      @click="
                        dialogVisiable = true;
                        editStorage = item.outputs;
                      "
                    >
                      <i class="el-icon-plus"></i>添加参数</el-button
                    >
                  </div>
                  <Table
                    :table="columnListSmall"
                    :data="item.outputs"
                    @operate="operateParams"
                  ></Table>
                </div>
              </div>
            </div>
          </el-tab-pane> -->

            <el-tab-pane label="对象关系" name="fourth">
              <el-button
                v-if="$route.query.action != 'preview'"
                type="primary"
                class="right_button"
                size="medium"
                @click="addRelation"
                >添加领域对象关系操作</el-button
              >
              <Table
                :table="relationList"
                height="calc(100vh - 240px)"
                :data="fromData.objectRelInfos"
                @operate="operateRelation"
              ></Table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-else-if="navTwo">
          <div class="m-title">
            聚合
            <el-popover placement="top-start" width="470" trigger="hover">
              · 与聚合内对象产生关联，需要通过聚合根关联连接<br />
              · 聚合内需要先指定聚合根，聚合内有且仅有1个聚合根<br />
              · 新的对象加入“聚合”需要先与聚合根关联
              <i slot="reference" class="el-icon-warning-outline"></i>
            </el-popover>
          </div>
          <el-form ref="formName" :model="fromData" :rules="rules">
            <el-form-item label="名称" prop="objName">
              <el-input
                maxLength="32"
                v-model="fromData.objName"
                placeholder="请输入名称"
              />
            </el-form-item>
            <el-form-item label="编码" prop="objCode">
              <el-input
                maxLength="32"
                :disabled="existCode"
                v-model="fromData.objCode"
                placeholder="请输入编码"
              />
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker
                v-model="fromData.color"
                show-alpha
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-form-item>
            <el-form-item prop="desc" label="描述">
              <el-input
                maxLength="500"
                type="textarea"
                class="widthInput"
                v-model="fromData.objDesc"
                placeholder="请输入描述"
              />
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="navThree">
          <div class="m-title">
            领域对象关系
            <img
              class="closeDialog"
              src="@m/assets/images/icon_close.png"
              @click="cancel"
            />
          </div>
          <div style="padding-top: 16px">
            <ObjectRelation
              ref="ObjectRelation"
              :navThree="navThree"
              :fromData="fromData"
              :relationForm="relationForm"
              :rules="rules"
              :getNodesDatalist="getNodesDatalist"
            ></ObjectRelation>
          </div>
        </div>
        <page-footer
          v-if="$route.query.action != 'preview'"
          class="pageFooter"
          leftbtn="取消"
          rightbtn="确认"
          @handleLeft="cancel"
          @handleRight="sumbit"
        >
        </page-footer>
      </div>
    </transition>
    <!-- Form -->
    <PageDialog
      v-if="dialogFormVisible"
      :dialogTitle="`${dialogFormType}对象关系`"
      :dialogVisiable="dialogFormVisible"
      dialogWidth="720px"
      @closeDialog="dialogFormVisible = false"
    >
      <div slot="box" style="border-radius: 8px 8px 8px 8px">
        <ObjectRelation
          ref="ObjectRelation"
          :relationForm="relationForm"
          :fromData="fromData"
          :rules="rules"
          :getNodesDatalist="showNodesDatalist"
        ></ObjectRelation>
      </div>
      <div slot="footer">
        <el-button @click.native="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="relationSave">确定</el-button>
      </div>
    </PageDialog>
    <addUserDefined ref="userDefinedRef" @saveParams="tabsConfirm" />
    <PageDialog
      dialogTitle="编辑属性"
      v-if="dialogVisible"
      :dialogVisiable="dialogVisible"
      dialogWidth="720"
      @closeDialog="dialogVisible = false"
    >
      <div slot="box" style="margin: 0 43px 0 43px">
        <el-form :model="ruleForm" label-width="80px">
          <el-form-item label="属性名称" prop="dictryName">
            <el-input
              disabled
              v-model="ruleForm.dictryName"
              placeholder="请输入属性名称"
            />
          </el-form-item>
          <el-form-item label="属性规则" prop="dictryDesc">
            <el-input
              v-model="ruleForm.dictryDesc"
              maxLength="500"
              placeholder="请输入属性规则"
            />
          </el-form-item>
          <el-form-item label="属性规则" prop="dictryRule">
            <el-input
              class="widthInput"
              maxLength="500"
              type="textarea"
              v-model="ruleForm.dictryRule"
              placeholder="请输入属性规则"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click.native="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="handleSave">确定</el-button>
      </div>
    </PageDialog>
    <dictionaryDetail
      :detailValueVisible="detailValueVisible"
      :dictryId="detailDictryId"
    />
  </div>
</template>

<script>
import PageDialog from "./page_dialog";
import Table from "./page_table";
import { unduplicated } from "@m/utils/array";
import addUserDefined from "@m/core/components/page_big_data/addUserDefined";
import dictionaryDetail from "@m/core/components/page_big_data/dictionaryDetail";
import PageFooter from "./pageFooter";
import ObjectRelation from "./objectRelation.vue";

export default {
  objName: "App",
  inject: ["getEditor"],
  components: {
    addUserDefined,
    Table,
    PageDialog,
    PageFooter,
    dictionaryDetail,
    ObjectRelation,
    // HelloWorld,
  },
  data() {
    return {
      resolveMethod: "", //确认返回数据方法
      editStorage: "", //浅拷贝原数据
      editStorageIndex: 0,
      dialogVisiable: false, //元数据列表
      dialogVisible: false, //ling
      color: "#0062ff",
      activeName: "first",
      nav: false,
      navTwo: false,
      navThree: false,
      ruleForm: {},
      relationForm: {},
      firstError: false,
      thirdError: false,
      getNodesDatalist: [], //画布所有节点
      showNodesDatalist: [],
      existCode: false,
      detailValueVisible: false,
      detailDictryId: "",
      columnList: [
        {
          prop: "dictryName",
          label: "字段名称",
          //tooltip: true,
          type: "text",
          minWidth: "125",
        },
        {
          prop: "dictryNo",
          label: "编码",
          minWidth: "125",
          type: "text",
        },
        {
          prop: "dictryType",
          label: "数据类型",
          minWidth: "125",
          type: "text",
        },
        {
          prop: "dictryDesc",
          label: "描述说明",
          minWidth: "140",
          type: "text",
        },
      ],
      columnListSmall: [
        {
          prop: "dictryName",
          label: "字段名称",
          //tooltip: true,
          type: "text",
          minWidth: "90",
        },
        {
          prop: "dictryNo",
          label: "编码",
          minWidth: "90",
          type: "text",
        },
        {
          prop: "dictryType",
          label: "数据类型",
          minWidth: "90",
          type: "text",
        },
        {
          prop: "dictryDesc",
          label: "描述说明",
          minWidth: "115",
          type: "text",
        },

        {
          prop: "dictryRule",
          label: "规则",
          minWidth: "90",
          type: "text",
        },
        {
          prop: "required",
          label: "必填",
          minWidth: "50",
          type: "checkbox",
        },
        {
          label: "操作",
          minWidth: "100",
          type: "button",
          buttonList: [
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],
      relationList: [
        {
          prop: "obrName",
          label: "关系名称",
          //tooltip: true,
          type: "text",
          minWidth: "110",
        },
        {
          prop: "obrCode",
          label: "编码",
          minWidth: "100",
          type: "text",
        },
        {
          prop: "curObjName",
          label: "当前对象",
          minWidth: "110",
          type: "text",
        },
        {
          prop: "tgtObjName",
          label: "目标对象",
          minWidth: "110",
          type: "text",
        },
        {
          prop: "obrRelash",
          label: "关系类型",
          minWidth: "105",
          type: "text",
        },
        {
          prop: "relashMult",
          label: "关系重数",
          minWidth: "105",
          type: "text",
          filter: "actionValue",
        },
      ],
      objClassList: [
        { label: "用户", value: "1" },
        { label: "机构", value: "2" },
        { label: "渠道", value: "3" },
        { label: "产品", value: "4" },
        { label: "合约", value: "5" },
        { label: "系统", value: "6" },
      ],
      fromData: {},
      abId: "0",
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577",
      ],
      rules: {
        objName: [
          { required: true, message: "请输入对象中文名称", trigger: "blur" },
        ],
        obrName: [
          { required: true, message: "请输入关系名称", trigger: "blur" },
        ],
        objCode: [
          {
            required: true,
            pattern: "^[A-Z]{1}([a-zA-Z0-9._]){0,32}$",
            message: "字母、数字组合的编码，大写开头",
            trigger: "blur",
          },
        ],
        obrCode: [
          {
            required: true,
            pattern: "^[a-z]{1}([a-zA-Z0-9._]){0,32}$",
            message: "字母、数字组合的编码，小写开头",
            trigger: "blur",
          },
        ],
        objType: [
          { required: true, message: "请选择对象类型", trigger: "blur" },
        ],
        objClass: [{ required: true, message: "请选择分类", trigger: "blur" }],
      },
      activeRules: {
        obeName: [
          { required: true, message: "行为名称是必填字段", trigger: "blur" },
        ],
        obeNo: [
          {
            required: true,
            pattern: "^[a-z]{1}([a-zA-Z0-9._]){0,32}$",
            message: "字母、数字组合的编码，小写开头",
            trigger: "blur",
          },
        ],
      },
      timer: null,
      dialogFormVisible: false,
      objCode: "",
    };
  },
  created() {},
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    async sumbit() {
      console.log("转换", this.fromData);
      if (this.fromData?.color?.length > 0) {
        const color = this.fromData.color.split("rgba(")[1];
        this.fromData.color = color.split(",").splice(0, 3);
      }
      let rulesSuccess = false;
      if (this.nav) {
        this.$refs.firstForm.validate((valid) => {
          if (valid) {
            this.firstError = false;
          } else {
            this.firstError = true;
          }
        });
        // this.fromData.objectBehaviorInfos.map((item, index) => {
        //   this.$refs["thirdForm"][index].validate((valid) => {
        //     if (valid) {
        //       this.thirdError = false;
        //     } else {
        //       this.thirdError = true;
        //     }
        //   });
        // });
        // if (this.fromData.objectBehaviorInfos.length == 0) {
        //   this.thirdError = false;
        // }
        if (!this.firstError && !this.thirdError) {
          rulesSuccess = true;
        }
      } else if (this.navTwo) {
        this.$refs.formName.validate((valid) => {
          if (valid) {
            rulesSuccess = true;
          }
        });
      } else {
        this.relationSave();
        // rulesSuccess = true;
      }
      if (this.navTwo || this.nav) {
        this.getNodesDatalist.map((item) => {
          if (
            item.objCode == this.fromData.objCode &&
            item.objCode != this.objCode
          ) {
            this.$message.error("当前对象编码与其他对象重复");
            rulesSuccess = false;
          }
        });
        if (rulesSuccess) {
          this.nav = false;
          this.navTwo = false;
          this.resolveMethod(this.fromData);
        }
      }
      console.log("确认后的数据", this.fromData, this.relationForm);
    },
    //弹窗打开并回调
    show(data, dataType) {
      Object.assign(this.$data, this.$options.data()); //重置data数据
      console.log("传进来的数据", data, dataType);

      const { id, shape } = dataType;
      this.fromData = data;
      this.existCode = data.objCode
        ? data.objCode.includes("copy")
          ? false
          : true
        : null;
      this.objCode = data.objCode;
      if (dataType?.shape == "ConnectionRoot") {
        this.fromData.objAggRoor = "0";
      } else if (dataType?.shape == "ConnectionObject") {
        this.fromData.objType = "00";
      } else {
        this.fromData.objType = "01";
      }
      this.$nextTick(() => {
        this.dragControllerDiv();
      });
      if (this.$route.query.action == "preview") {
        this.columnList.push({
          label: "操作",
          type: "button",
          minWidth: "150",
          buttonList: [
            {
              desc: "查看",
              operate: "view",
            },
          ],
        });
      } else {
        this.columnList.push({
          label: "操作",
          type: "button",
          minWidth: "150",
          buttonList: [
            {
              desc: "查看",
              operate: "view",
            },
            {
              desc: "编辑",
              operate: "change",
            },
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        });
        this.relationList.push({
          label: "操作",
          type: "button",
          minWidth: "100",
          buttonList: [
            {
              desc: "编辑",
              operate: "change",
            },
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        });
      }
      return new Promise((resolve, reject) => {
        if (shape == "Collection") {
          this.navTwo = true;
          if (data.color && data.color[0]) {
            this.fromData.color = `rgba(${data.color[0]},${data.color[1]},${data.color[2]})`;
          }
        } else {
          this.nav = true;
        }
        // if (this.nav) {
        //   resolve("回调结果");
        //   // this.nav = false;
        // }
        this.resolveMethod = resolve;
        this.getNodesDatalist = this.getEditor().getNodesData();
      });
    },
    relation(data, tgtObjCode) {
      return new Promise((resolve, reject) => {
        Object.assign(this.$data, this.$options.data()); //重置data数据
        this.fromData = data;
        console.log("传进来的数据", data, tgtObjCode);
        this.getNodesDatalist = this.getEditor().getNodesData();
        let tgtRelation = this.fromData.objectRelInfos.find((item, index) => {
          this.editStorageIndex = index;
          return item.tgtObjCode == tgtObjCode;
        });
        //关系列表存在对应目标对象关系
        if (tgtRelation) {
          this.relationForm = tgtRelation;
          this.dialogFormType = "编辑";
        } else {
          this.getNodesData = this.getNodesDatalist.find(
            (item) => item?.objCode && item.objCode == tgtObjCode
          );
          this.relationForm = {
            curObjName: data.objName,
            curObjCode: data.objCode,
            tgtObjName: this.getNodesData?.objName,
            tgtObjCode: this.getNodesData?.objCode,
            obrCode: "",
          };
        }
        this.fromData = data;
        this.navThree = true;
        // if (this.nav) {
        //   resolve("回调结果");
        //   // this.nav = false;
        // }
        this.$nextTick(() => {
          this.dragControllerDiv();
        });
        this.resolveMethod = resolve;
      });
    },
    // deleteProject() {
    //   this.fromData.objectBehaviorInfos.splice(this.abId, 1);
    //   this.abId = 0;
    // },
    operate(operate, data, index) {
      if (operate == "delete") {
        this.$confirm("您确定删除当前属性吗？", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
          distinguishCancelAndClose: true,
        }).then(() => {
          this.fromData.attributeInfos.splice(index, 1);
        });
      } else if (operate == "change") {
        this.dialogVisible = true;
        this.editStorage = data;
        this.ruleForm = JSON.parse(JSON.stringify(this.editStorage));
      } else if (operate == "view") {
        this.detailDictryId = data.dictryId;
        this.detailValueVisible = true;
      }
    },
    operateParams(operate, data, index, tableData) {
      tableData.splice(index, 1);
    },
    operateRelation(operate, data, index) {
      if (operate == "delete") {
        this.$confirm("您确定删除当前关系吗？", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
          distinguishCancelAndClose: true,
        }).then(() => {
          this.fromData.objectRelInfos.splice(index, 1);
        });
      } else if (operate == "change") {
        this.dialogFormVisible = true;
        this.dialogFormType = "编辑";
        this.editStorageIndex = index;
        this.updateNodesList();
        this.relationForm = JSON.parse(JSON.stringify(data));
      }
    },
    addRelation() {
      this.dialogFormVisible = true;
      this.relationForm = {
        curObjName: this.fromData.objName,
        curObjCode: this.fromData.objCode,
        obrCode: "",
      };
      this.dialogFormType = "添加";
      this.updateNodesList();
    },
    updateNodesList() {
      this.showNodesDatalist = [];
      //添加和编辑关系不能选自己
      this.getNodesDatalist.map((item, index) => {
        if (
          (!this.fromData.objectRelInfos.find(
            (data) => data.tgtObjCode == item.objCode
          ) ||
            (this.dialogFormType == "编辑" &&
              item.objCode ==
                this.fromData.objectRelInfos[this.editStorageIndex]
                  ?.tgtObjCode)) &&
          item.objCode != this.objCode &&
          item.objCode &&
          item.objClassName
        ) {
          if (
            !item.objectRelInfos.find(
              (object) => object.tgtObjCode == this.objCode
            )
          ) {
            this.showNodesDatalist.push(item);
          }
        }
      });
      this.$forceUpdate();
    },
    cancel() {
      this.nav = false;
      this.navTwo = false;
      this.navThree = false;
      this.resolveMethod();
    },
    handleSave() {
      this.editStorage.dictryDesc = this.ruleForm.dictryDesc;
      this.editStorage.dictryRule = this.ruleForm.dictryRule;
      this.dialogVisible = false;
    },
    relationSave() {
      this.$refs.ObjectRelation?.$refs?.relationForm.validate((valid) => {
        if (
          !(
            (this.relationForm.obrRelash == "extends" ||
              this.relationForm.relashMult) &&
            this.relationForm.obrRelash &&
            this.relationForm.tgtObjName
          )
        ) {
          this.$refs.ObjectRelation.relationError = true;
          return;
        } else {
          this.$refs.ObjectRelation.relationError = false;
        }
        if (valid) {
          if (this.dialogFormType == "编辑") {
            this.$set(
              this.fromData.objectRelInfos,
              this.editStorageIndex,
              this.relationForm
            );
          } else {
            this.fromData.objectRelInfos.push(this.relationForm);
          }
          this.dialogFormVisible = false;
          if (this.navThree) {
            this.resolveMethod(this.fromData);
            this.navThree = false;
          }
        }
      });
    },
    tabsConfirm(item) {
      item.map((data) => {
        this.fromData.attributeInfos.push({
          dictryName: data.dictryNm,
          dictryNo: data.dictryNo,
          dictryType: data.dictryTyp,
          dictryDesc: data.dictryDescr || "/",
          dictryRule: data.dictryRule || "/",
          dictryId: data.dictryId,
        });
      });
      this.fromData.attributeInfos = unduplicated(
        this.fromData.attributeInfos,
        ["dictryId"]
      );
    },
    updateCurObj() {
      this.fromData.objectRelInfos.map((item) => {
        item.curObjCode = this.fromData.objCode;
        item.curObjName = this.fromData.objName;
      });
    },
    dragControllerDiv() {
      setTimeout(() => {
        let resize = document.getElementById("resize");
        let right = document.getElementById("right");
        resize.onmousedown = function (e) {
          const rightWidth = right.offsetWidth;
          let startX = e.clientX;
          document.onmousemove = function (e) {
            let endX = e.clientX;
            right.style.width = rightWidth - (endX - startX) + "px";
          };
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            resize.releaseCapture && resize.releaseCapture();
          };
          resize.setCapture && resize.setCapture();
          return false;
        };
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: PingFangSC-Regula;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
  padding: 0 24px 0 24px;
  position: absolute;
  width: 800px;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 1000;
}
.tapStyles {
  line-height: 40px;
}
.activeBox {
  height: calc(100vh - 170px);
  overflow-y: auto;
  width: 100%;
  border: 1px solid #c1c1c1;
  display: flex;
  .left-part {
    border-right: 1px solid #c1c1c1;
    .el-button--mini {
      font-size: 14px;
      color: #358aff;
      border-color: #358aff;
      font-weight: normal;
    }

    width: 160px;
    padding: 10px 0;

    background: #fff;
    margin-right: 16px;
    flex-shrink: 0;
    box-sizing: border-box;
    position: relative;
    .left-part-main-head {
      padding: 0 16px;
      h5 {
        font-size: 16px;
        font-weight: 500;
        color: #111111;
        margin-top: 10px;
      }
      .el-button {
        width: 100%;
      }
      .el-button,
      .el-input {
        margin-top: 10px;
      }
    }

    .left-part-main-list {
      padding: 0 10px;
      margin-top: 20px;

      &:empty {
        &:after {
          content: "暂无数据";
          display: block;
          color: #999;
          text-align: center;
        }
      }

      .el-icon-setting {
        display: none;
        font-size: 16px;
      }

      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px;
        margin-top: 4px;
        border-radius: 4px;
        img {
          width: 16px;
          height: 16px;
          margin: 5px 5px 0 0;
          cursor: pointer;
        }
        .project-name {
          display: inline-block;
          max-width: 72%;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
          white-space: nowrap;
        }

        span {
          cursor: pointer;
        }
        &.active {
          color: #358aff;
          background: #f0f5ff;
          .el-icon-setting {
            display: block !important;
          }
        }
      }
    }
  }
  .right-part {
    width: 575px;
    padding: 10px 0 0 0;
    flex: 1;
    flex-shrink: 0;
  }
}
#tapId {
  /deep/ .el-table {
    th {
      background: #fafafc;
      color: #333;
    }
    td {
      display: table-cell;
      vertical-align: top;
    }
    .el-table__header {
      background: #f2f3f5;
    }
  }
}
.m-title {
  padding: 16px 0 16px 0;
  box-shadow: 0px 0.5px 0px 0px rgba(231, 231, 238, 1);
  font-size: 16px;
  font-weight: 700;
  .closeDialog {
    height: 28px;
    width: 28px;
    float: right;
  }
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
::v-deep .widthInput .el-textarea__inner {
  min-height: 80px !important;
}
#resize {
  position: fixed;
  margin-left: -23px;
  width: 5px;
  height: 100%;
  cursor: w-resize;
  float: left;
}
</style>