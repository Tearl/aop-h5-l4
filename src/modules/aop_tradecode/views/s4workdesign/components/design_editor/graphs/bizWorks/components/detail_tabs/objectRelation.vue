<template>
  <div>
    <div style="display: flex; padding-bottom: 16px">
      <div
        :class="`objectBox ${
          fromData.objAggRoor == '0'
            ? 'blue'
            : fromData.objType == '01'
            ? 'gray'
            : 'green'
        }`"
      >
        <p>
          {{ relationForm.curObjName
          }}{{ relationForm.curObjCode ? ` (${relationForm.curObjCode})` : "" }}
        </p>
      </div>
      <div class="connectLine">
        <div
          class="bwf-shared-obj-demo-relationship bwf-shared-obj-relationship-view-connect"
        >
          <div
            class="bwf-shared-obj-demo-relationship-line"
            :style="marginLength"
          >
            <svg
              class="bwf-shared-obj-demo-relationship-line-svg"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="12px"
            >
              <path d="M0 6 L500 6"></path>
            </svg>
          </div>
          <div
            v-if="relationForm.obrRelash != 'extends'"
            class="bwf-shared-obj-demo-relationship-multiplicity"
          >
            {{ relationForm.relashMult | actionValue }}
          </div>
          <svg
            v-if="
              relationForm.obrRelash == 'combination' ||
              relationForm.obrRelash == 'aggregation'
            "
            class="bwf-shared-obj-demo-relationship-arrow bwf-shared-obj-demo-relationship-arrow-left"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            height="12px"
          >
            <path
              :style="`${
                relationForm.obrRelash == 'combination'
                  ? 'fill: currentColor;'
                  : ''
              }`"
              class="bwf-shared-obj-demo-relationship-arrow-p"
              d="M0 6 L9 1 L18 6 L9 11 Z"
            ></path>
          </svg>
          <svg
            v-if="relationForm.obrRelash == 'association'"
            class="bwf-shared-obj-demo-relationship-arrow"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            height="12px"
          >
            <path
              class="bwf-shared-obj-demo-relationship-arrow-p"
              d="M18 6 L0 6"
            ></path>
            <path
              class="bwf-shared-obj-demo-relationship-arrow-p"
              d="M18 6 L8 2"
            ></path>
            <path
              class="bwf-shared-obj-demo-relationship-arrow-p"
              d="M18 6 L8 10"
            ></path>
          </svg>
          <svg
            v-if="relationForm.obrRelash == 'extends'"
            class="bwf-shared-obj-demo-relationship-arrow"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            height="12px"
          >
            <path
              class="bwf-shared-obj-demo-relationship-arrow-p"
              d="M0 6 L10 6 L10 2 L18 6 L10 10 L10 6 Z"
            ></path>
          </svg>
        </div>
      </div>
      <div
        :class="`objectBox ${
          objectTarget.objAggRoor == '0'
            ? 'blue'
            : objectTarget.objType == '01'
            ? 'gray'
            : 'green'
        }`"
      >
        <p>
          {{ relationForm.tgtObjName
          }}{{ relationForm.tgtObjCode ? ` (${relationForm.tgtObjCode})` : "" }}
        </p>
      </div>
    </div>
    <div style="display: flex; text-align: center; padding-bottom: 30px">
      <p class="objectText" style="width: 200px">当前对象</p>
      <div style="width: 290px">
        <el-select
          v-model="relationForm.obrRelash"
          width="128"
          placeholder="请选择关联关系"
        >
          <el-option
            v-for="item in relationArray"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-select
          v-if="relationForm.obrRelash != 'extends'"
          v-model="relationForm.relashMult"
          style="padding-top: 8px"
          width="128"
          placeholder="请选择关系重数"
        >
          <el-option
            v-for="item in versionArray"
            :key="item.id"
            :label="item.label"
            :value="item.value"
            @click.native="selectVersionArray(item.value)"
          ></el-option
        ></el-select>
        <div style="height: 16px">
          <p
            v-if="
              relationError &&
              !(
                (relationForm.obrRelash == 'extends' ||
                  relationForm.relashMult) &&
                relationForm.obrRelash &&
                relationForm.tgtObjName
              )
            "
            style="color: #f56c6c"
          >
            请输入必填项
          </p>
        </div>
      </div>
      <div style="width: 200px">
        <p class="objectText">目标对象</p>
        <el-select
          :disabled="navThree"
          v-model="relationForm.tgtObjCode"
          style="margin-top: 16px; width: 128px"
        >
          <el-option
            v-for="(item, index) in getNodesDatalist"
            :key="index"
            :label="item.objName"
            :value="item.objCode"
            @click.native="selectRelation(item)"
          ></el-option
        ></el-select>
      </div>
    </div>

    <el-form
      ref="relationForm"
      :model="relationForm"
      :rules="rules"
      style="border-top: 1px solid #c1c1c1; padding-top: 20px"
    >
      <el-form-item label="关系名称" prop="obrName">
        <el-input
          maxLength="32"
          v-model="relationForm.obrName"
          placeholder="请输入关系名称"
        />
      </el-form-item>
      <el-form-item label="编码" prop="obrCode">
        <el-input
          maxLength="32"
          v-model="relationForm.obrCode"
          placeholder="请输入编码"
        />
      </el-form-item>
      <el-form-item label="描述" prop="obrDesc">
        <el-input
          maxLength="500"
          v-model="relationForm.obrDesc"
          placeholder="请输入描述"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import filters from "./page_table/filters";
export default {
  props: {
    navThree: {
      type: Boolean,
      default: false,
    },
    fromData: {
      type: Object,
      default: {},
    },
    relationForm: {
      type: Object,
      default: {},
    },
    rules: {
      type: Array,
      default: [],
    },
    getNodesDatalist: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      relationError: false,
      relationArray: [
        { label: "关联", value: "association" },
        { label: "聚合", value: "aggregation" },
        { label: "组合", value: "combination" },
        { label: "继承", value: "extends" },
      ],
      versionArray: [
        { label: "1:0..*", value: "0-N" },
        { label: "1:1..*", value: "1-N" },
        { label: "1:0..1", value: "0-1" },
        { label: "1:1", value: "1-1" },
      ],
      objectTarget: "",
    };
  },
  mounted() {
    if (this.relationForm.tgtObjCode) {
      this.objectTarget = this.getNodesDatalist.find(
        (item) => item.objCode == this.relationForm.tgtObjCode
      );
      this.relationForm.tgtObjId = this.objectTarget?.objId;
      if (!this.relationForm.obrName && this.relationForm.tgtObjCode) {
        this.$set(this.relationForm, "obrName", this.objectTarget.objName);
      }
    }
  },
  computed: {
    marginLength() {
      return this.relationForm.obrRelash == "aggregation"
        ? "margin-left: 17px;"
        : this.relationForm.obrRelash == "extends"
        ? "margin-right: 17px;"
        : "";
    },
  },
  filters: {
    ...filters,
  },
  methods: {
    selectRelation(item) {
      this.objectTarget = item;
      this.relationForm.tgtObjName = item.objName;
      this.relationForm.obrName = item.objName;
      this.relationForm.tgtObjCode = item.objCode;
      this.relationForm.tgtObjId = item.objId;
      this.selectVersionArray(this.relationForm.relashMult);
    },
    selectVersionArray(item) {
      if (item == "0-N" || item == "1-N") {
        this.relationForm.obrCode =
          `${
            this.relationForm.tgtObjCode?.charAt(0).toLowerCase() +
            this.relationForm.tgtObjCode?.slice(1)
          }list` || "";
      } else {
        this.relationForm.obrCode =
          this.relationForm.tgtObjCode?.charAt(0).toLowerCase() +
            this.relationForm.tgtObjCode?.slice(1) || "";
      }
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.objectBox {
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
.gray {
  background-image: linear-gradient(to bottom, #3e3e3c, #3e3e3c);
}
.blue {
  background-image: linear-gradient(to bottom, #0070d2, #0070d2);
}
.green {
  background-image: linear-gradient(to bottom, #04844b, #04844b);
}
.objectText {
  line-height: 17px;
  color: #838388;
}
</style>
