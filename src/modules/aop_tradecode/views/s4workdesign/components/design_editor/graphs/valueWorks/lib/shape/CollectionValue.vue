<template>
  <div class="Collection">
    <div
      class="m-title"
      style="margin-bottom: 9px"
      @click="editFlowName('editFlow')"
    >
      {{ info.vsmName }}<i v-if="info.save" class="el-icon-edit"></i>
    </div>
    <svg
      style="fill: #bbdefb; position: relative; color: #ffffff"
      :width="myDivWidth"
      height="114"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :d="`M0 0  L57 57 L0 114 L${myDivWidth - 57} 114 L${myDivWidth} 57 L${
          myDivWidth - 57
        } 0`"
      ></path>
      <foreignObject x="0" y="0" :width="myDivWidth" height="114">
        <div
          style="
            display: flex;
            justify-content: flex-start;
            margin-left: 128px;
            position: absolute;
          "
          id="setDiv"
          xmlns="http://www.w3.org/1999/xhtml"
        >
          <div
            style="cursor: pointer"
            v-for="(item, index) in fromDataList"
            :key="index"
          >
            <div class="tools">
              <div v-if="abId == index">
                <span @click="editor(item, index)">
                  <i class="el-icon-edit"></i>
                </span>
                |
                <span @click="deleteNode(index)">
                  <i class="el-icon-delete"></i
                ></span>
              </div>
            </div>
            <div class="edit">
              <i
                v-if="info.save"
                class="el-icon-circle-plus-outline"
                @click="addLocal('last', index)"
              ></i>
              <i
                v-if="info.save"
                class="el-icon-circle-plus-outline"
                @click="addLocal('next', index)"
              ></i>
              <div @click="selectNode(index)">
                <div class="svgText subsection">
                  <p>
                    {{ item.segName || "填写" }}
                  </p>
                  <div v-if="item.actNum">
                    {{ `${item.actNum} 活动` }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </foreignObject>
    </svg>
  </div>
</template>
<script>
import mixins from "./mixins";
export default {
  name: "CollectionValue",
  mixins,
  data() {
    return {
      myDivWidth: 920,
      abId: null,
      info: "",
      flowName: "",
      fromDataList: [],
    };
  },

  watch: {
    fromDataList() {
      this.changeNode();
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.Collection {
  .tools {
    height: 20px;
    text-align: right;
    margin-right: 15px;
    margin-bottom: 2px;
    div {
      background-color: #358aff;
      padding: 1px 5px 0 5px;
      display: inline-block;
      border-radius: 3px;
      font-size: 12px;
    }
  }
  .svgText {
    text-align: center;
    overflow: visible;
    margin-right: -20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    p {
      width: 100%;
      padding: 0 40px;
      min-width: 185px;
      white-space: nowrap;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .subsection {
    min-width: 185px;
    height: 70px;
    background-color: #1a77d2;
    clip-path: polygon(
      0px 0px,
      35px 35px,
      0px 70px,
      calc(100% - 35px) 70px,
      100% 35px,
      calc(100% - 35px) 0px,
      0px 0px
    );
  }
  .m-title {
    font-size: 16px;
    font-weight: 600;
  }

  .edit {
    position: relative;
    i:nth-child(1) {
      visibility: hidden;
      padding: 23px 0 0 20px;
      z-index: 10;
      position: absolute;
      left: 10px;
      font-size: 24px;
    }
    i:nth-child(2) {
      visibility: hidden;
      position: absolute;
      right: 0px;
      top: 23px;
      font-size: 24px;
      z-index: 10;
    }
    &:hover {
      & > i.el-icon-circle-plus-outline {
        visibility: visible;
      }
    }
  }
}
</style>