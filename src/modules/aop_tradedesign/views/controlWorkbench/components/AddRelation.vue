<template>
  <div>
    <el-dialog :title="showType == 'add' ? '添加对象关系' : '编辑对象关系'" :visible.sync="visible"
      class="object-graph-relation-dialog" width="720px" :close-on-click-modal="false" top="10vh" @close="close">
      <div class="dialog-content" v-if="visible">
        <div class="top">
          <div :class="`object-box type${sourceObj.objType}`">
            <p>{{ sourceObj.objName }}（{{ sourceObj.objCode }}）</p>
          </div>

          <div class="connectLine">
            <div class="bwf-shared-obj-demo-relationship bwf-shared-obj-relationship-view-connect">
              <div class="bwf-shared-obj-demo-relationship-line" :style="marginLength">
                <svg class="bwf-shared-obj-demo-relationship-line-svg" version="1.1" xmlns="http://www.w3.org/2000/svg"
                  width="100%" height="12px">
                  <path d="M0 6 L500 6"></path>
                </svg>
              </div>
              <div v-if="relationForm.obrRelash != 'extends'" class="bwf-shared-obj-demo-relationship-multiplicity">
                {{ relationMap[relationForm.relashMult] || "" }}
              </div>
              <svg v-if="
                relationForm.obrRelash == 'combination' ||
                relationForm.obrRelash == 'aggregation'
              " class="bwf-shared-obj-demo-relationship-arrow bwf-shared-obj-demo-relationship-arrow-left"
                version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="12px">
                <path :style="`${relationForm.obrRelash == 'combination'
                    ? 'fill: currentColor;'
                    : ''
                  }`" class="bwf-shared-obj-demo-relationship-arrow-p" d="M0 6 L9 1 L18 6 L9 11 Z"></path>
              </svg>
              <svg v-if="relationForm.obrRelash == 'association'" class="bwf-shared-obj-demo-relationship-arrow"
                version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="12px">
                <path class="bwf-shared-obj-demo-relationship-arrow-p" d="M18 6 L0 6"></path>
                <path class="bwf-shared-obj-demo-relationship-arrow-p" d="M18 6 L8 2"></path>
                <path class="bwf-shared-obj-demo-relationship-arrow-p" d="M18 6 L8 10"></path>
              </svg>
              <svg v-if="relationForm.obrRelash == 'extends'" class="bwf-shared-obj-demo-relationship-arrow"
                version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="12px">
                <path class="bwf-shared-obj-demo-relationship-arrow-p" d="M0 6 L10 6 L10 2 L18 6 L10 10 L10 6 Z"></path>
              </svg>
            </div>
          </div>

          <div :class="`object-box type${targetObj.objType}`">
            <p v-if="targetObj.objCode">
              {{ targetObj.objName }}（{{ targetObj.objCode }}）
            </p>
          </div>
        </div>

        <div class="center">
          <p class="object-name" style="width: 200px">当前对象</p>
          <div class="relations-select">
            <el-select v-model="relationForm.obrRelash" width="128" placeholder="请选择关系" size="small"
              @change="relationForm.relashMult = ''">
              <template v-if="sourceObj.objType == '02'">
                <el-option v-for="item in relationArray" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </template>
              <template v-else>
                <el-option v-for="(item, index) in relationArray00" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </template>
            </el-select>

            <template v-if="relationForm.obrRelash == 'extends'" >
              <el-select v-model="relationForm.relashMult" style="padding-top: 8px" width="128" size="small" :key="relationForm.obrRelash"
                placeholder="请选择关系重数" @change="relaChange">
                <el-option v-for="item in versionArray_extends" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </template>
            <template v-if="relationForm.obrRelash == 'combination'">
              <el-select v-model="relationForm.relashMult" style="padding-top: 8px" width="128" size="small" :key="relationForm.obrRelash"
                placeholder="请选择关系重数" @change="relaChange"><el-option v-for="item in versionArray_combination"
                  :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
            <template v-if="relationForm.obrRelash == 'aggregation'">
              <el-select v-model="relationForm.relashMult" style="padding-top: 8px" width="128" size="small" :key="relationForm.obrRelash"
                placeholder="请选择关系重数" @change="relaChange">
                <el-option v-for="item in versionArray_aggregation" :key="item.value" :label="item.label"
                  :value="item.value"></el-option></el-select>
            </template>
          </div>
          <div class="target-obj">
            <p class="object-name">目标对象</p>
            <el-select :disabled="relationType == 'line'" filterable style="margin-top: 16px; width: 128px" size="small"
              @change="targetChange" v-model="targetObjObjId">
              <el-option v-for="item in targetObjList" :key="item.objId" :label="item.objName"
                :value="item.objId"></el-option></el-select>
          </div>
        </div>

        <el-form ref="base" :model="relationForm" :rules="rules" size="small">
          <el-form-item label="关系名称" prop="obrName">
            <el-input maxLength="80" v-model.trim="relationForm.obrName" placeholder="请输入关系名称" />
          </el-form-item>
          <el-form-item label="编码" prop="obrCode">
            <el-input maxLength="80" v-model.trim="relationForm.obrCode" placeholder="请输入编码" />
          </el-form-item>
          <el-form-item label="描述" prop="obrDesc">
            <el-input v-model.trim="relationForm.obrDesc" placeholder="请输入描述" />
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-group" slot="footer">
        <el-button size="medium" @click="close">取 消</el-button>
        <el-button size="medium" type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import _ from "lodash";
export default {
  mixins: [mixin],
  data() {
    return {
      visible: false,

      edge: null,
      showType: "add",
      sourceObj: null,
      targetObj: {
        objId: "",
        objType: "",
        objName: "",
        objCode: "",
      },
      targetObjObjId: "",
      relationType: "add",
      targetObjList: [],
      relationForm: {
        obrRelash: "",
        relashMult: "",
        obrName: "",
        obrCode: "",
        obrDesc: "",
        obrId: "",
        object1Multiplicity: "",
        object2Multiplicity: "",
      },
      rules: {
        obrName: [
          { required: true, message: "请输入关系名称", trigger: "blur" },
        ],
        obrCode: [
          {
            required: true,
            pattern: "[a-zA-Z]{1}[a-zA-Z0-9]{0,80}$",
            message: "字母、数字组合的编码，小写开头",
            trigger: "blur",
          },
        ],
      },
      relationArray: [
        { label: "聚合", value: "aggregation" },
        { label: "组合", value: "combination" },
        { label: "继承", value: "extends" },
      ],
      relationArray00: [
        { label: "组合", value: "combination" },
        { label: "继承", value: "extends" },
      ],
      versionArray_extends: [{ label: "1:1", value: "1-1" }],
      versionArray_aggregation: [
        { label: "0-N", value: "0-N" },
        { label: "0-1", value: "0-1" },
      ],
      versionArray_combination: [
        { label: "0-N", value: "0-N" },
        { label: "1-N", value: "1-N" },
        { label: "0-1", value: "0-1" },
        { label: "1-1", value: "1-1" },
      ],
      obrRelashNmMap: {
        association: "关联",
        aggregation: "聚合",
        combination: "组合",
        extends: "继承",
      },
      relationMap: {
        "0-N": "0-N",
        "1-N": "1-N",
        "0-1": "0-1",
        "1-1": "1-1",
      },
    };
  },
  computed: {},
  created() {
    this.initialData = _.cloneDeep(this.$data);
  },
  methods: {
    show(sourceObj, relation, targetObj, targetObjList, edge = null) {
      this.edge = edge;
      this.sourceObj = sourceObj;
      console.log(this.sourceObj, 'targetObj')
      this.targetObjList = targetObjList;
      if (targetObj) {
        this.targetObj = targetObj;
        this.targetObjObjId = targetObj.objId;
        this.relationForm.obrName = this.targetObj.objName;
        if (!relation) {
          this.relationType = "line";
        } else if (relation && !relation.obrId) {
          this.relationType = "edited";
        }
      }
      if (relation) {
        this.showType = "edit";
        const {
          obrRelash,
          object1Multiplicity,
          object2Multiplicity,
          obrName,
          obrCode,
          obrDesc,
          obrId,
        } = relation;
        this.relationForm = {
          obrRelash: obrRelash === 'association' ? '' : obrRelash,
          object1Multiplicity,
          object2Multiplicity,
          obrName,
          obrCode,
          obrDesc,
          obrId,
        };
        this.relationForm.relashMult = `${object1Multiplicity}-${object2Multiplicity}`;
        console.log(this.relationForm, 'this.relationForm')
      } else {
        this.showType = "add";
      }

      this.visible = true;
    },
    reset() {
      Object.assign(this.$data, _.cloneDeep(this.initialData));
    },
    close() {
      this.visible = false;
      this.$emit("close", this.edge);
      this.reset();
      this.$refs.base.clearValidate();
    },
    confirm() {
      this.$refs.base.validate((valid) => {
        if (valid) {
          if (!this.targetObj.objId)
            return this.$message.error("请选择目标对象");
          if (!this.relationForm.relashMult)
            return this.$message.error("请选择关系重数");

          let o1 = this.relationForm.relashMult.split("-")[0];
          let o2 = this.relationForm.relashMult.split("-")[1];
          this.relationForm = {
            ...this.relationForm,
            object1Multiplicity: o1,
            object2Multiplicity: o2,
            curObjCode: this.sourceObj.objCode,
            curObjId: this.sourceObj.objId || "",
            curObjName: this.sourceObj.objName || "",
            tgtObjCode: this.targetObj.objCode || "",
            tgtObjId: this.targetObj.objId || "",
            tgtObjName: this.targetObj.objName || "",
          };
          this.$emit(
            "relation",
            this.relationForm,
            this.edge,
            this.relationType
          );
          this.close();
        }
      });
    },
    targetChange(val) {
      let _targetObj = this.targetObjList.find((i) => i.objId == val);
      this.targetObj = _.cloneDeep(_targetObj);
      this.relationForm.obrName = this.targetObj.objName;
      this.relaChange();
    },
    relaChange() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
      if (["0-N", "1-N"].includes(this.relationForm.relashMult)) {
        this.relationForm.obrCode = this.targetObj.objCode + "list";
      } else if (["0-1", "1-1"].includes(this.relationForm.relashMult)) {
        this.relationForm.obrCode = this.targetObj.objCode;
      } else {
        this.relationForm.obrCode = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/mixin.scss";

.object-graph-relation-dialog {
  /deep/.el-dialog__header {
    border-bottom: 1px solid #f5f5fa;
    padding: 12px 20px;
    background: #fafafc;

    .el-dialog__title {
      font-size: 16px;
      color: #000000;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bold;
    }

    .el-dialog__headerbtn {
      top: 14px;
    }
  }

  /deep/.el-dialog__footer {
    @include flex(row, center, center);
    border-top: 1px solid #e7e7e7;
    padding: 16px !important;
  }

  .btn-group {
    text-align: center;
  }

  .dialog-content {
    max-height: 800px;
    min-height: 400px;
    overflow: auto;

    .center {
      display: flex;
      justify-content: center;
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 1px solid #c1c1c1;
      margin-bottom: 30px;

      .relations-select {
        width: 290px;
      }

      .target-obj {
        width: 200px;
      }
    }

    .top {
      display: flex;
      justify-content: center;
      padding-bottom: 16px;

      .object-box {
        margin-top: 8px;
        border: 1px solid #c1c1c1;
        width: 200px;
        height: 100px;
        border-radius: 4px;
        background-size: 100% 50%;
        background-position: left top;
        background-repeat: no-repeat;

        p {
          width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 600;
          margin: 12px 0 0 18px;
        }
      }

      .type01 {
        background-image: linear-gradient(to bottom, #3e3e3c, #3e3e3c);
      }

      .type02 {
        background-image: linear-gradient(to bottom, #0070d2, #0070d2);
      }

      .type00 {
        background-image: linear-gradient(to bottom, #04844b, #04844b);
      }

      .connectLine {
        width: 290px;
        margin-top: 50px;

        svg:not(:root) {
          overflow: hidden;
        }

        .bwf-shared-obj-relationship-view-connect {
          -ms-flex-positive: 0;
          flex-grow: 0;
          -ms-flex-negative: 0;
          flex-shrink: 0;
          padding-top: 16px;
          width: 290px;
        }

        .bwf-shared-obj-demo-relationship {
          display: inline-block;
          line-height: 24px;
          vertical-align: top;
          overflow: hidden;
          position: relative;
          color: #9aa4b1;
          min-width: 32px;
        }

        .bwf-shared-obj-demo-relationship-line-svg {
          position: absolute;
          overflow: hidden;
          left: 0;
          top: 0;
          stroke-width: 1.6px;
          stroke: currentColor;
        }

        .bwf-shared-obj-demo-relationship-line-left {
          margin-left: 17px;
        }

        .bwf-shared-obj-demo-relationship-line {
          position: absolute;
          overflow: hidden;
          height: 12px;
          right: 0;
          left: 0;
          top: calc(50% - 6px);
        }

        .bwf-shared-obj-demo-relationship-multiplicity {
          position: absolute;
          left: 50%;
          top: 50%;
          -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          width: 60px;
          height: 16px;
          line-height: 12px;
          color: #3e3e3c;
          background: #fff;
          border: 2px solid #9aa4b1;
          border-radius: 8px;
          overflow: hidden;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }

        .bwf-shared-obj-demo-relationship-arrow-left {
          left: 0;
        }

        .bwf-shared-obj-demo-relationship-arrow {
          position: absolute;
          overflow: hidden;
          width: 18px;
          height: 12px;
          top: calc(50% - 6px);
          right: 0;
        }

        .bwf-shared-obj-demo-relationship-arrow-p {
          stroke-width: 1.6px;
          stroke: currentColor;
          fill: transparent;
        }

        .bwf-shared-obj-demo-relationship-arrow {
          position: absolute;
          overflow: hidden;
          width: 18px;
          height: 12px;
          top: calc(50% - 6px);
          right: 0;
        }
      }
    }
  }
}
</style>