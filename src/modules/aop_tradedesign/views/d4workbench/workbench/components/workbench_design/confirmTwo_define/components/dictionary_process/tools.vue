<template>
  <div class="aop_tradedesign_comps_dictionary_process_tools">
    <div class="tools_list">
      <div class="list">
        <div class="list_item">
          <div class="list_item_list">
            <div
              class="list_item_box"
              v-for="item in toolsList"
              :key="item.id"
              @mousedown="pickOne($event, item)"
            >
              <div class="list_item_box_i" draggable="true">
                <img :src="item.iconUrl" />
              </div>
              <p>{{ item.cpntNm }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="tips">
        <el-tag size="small" type="warning"
          >请选择图形，然后直接拖入画布</el-tag
        >
      </div> -->
      <div class="btn_style">
        <el-button
          type="primary"
          v-show="fourRAttrFlag"
          size="mini"
          @click="toServ"
          >返回</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      //基础服务组件数据列表
      toolsList: [
        // {
        //   cpntId: "",
        //   cpntNm: "创建服务组件",
        //   id: "newAction",
        //   paramList: [],
        //   referId: "newAction",
        //   type: "newAction",
        //   iconUrl: require("@m/assets/images/tools/icon_t_n.png"),
        //   conf: [
        //     {
        //       name: "actionDesc",
        //       value: "创建服务组件",
        //     },
        //   ],
        // },
        // {
        //   cpntId: "",
        //   cpntNm: "input",
        //   id: "inputAction",
        //   paramList: [],
        //   referId: "inputAction",
        //   type: "inputAction",
        //   iconUrl: require("@m/assets/images/tools/icon_t_s.png"),
        //   conf: [
        //     {
        //       name: "actionDesc",
        //       value: "input",
        //     },
        //   ],
        // },
        // {
        //   cpntId: "",
        //   cpntNm: "循环组件",
        //   id: "loopAction",
        //   paramList: [],
        //   referId: "loopAction",
        //   type: "loopAction",
        //   iconUrl: require("@m/assets/images/tools/icon_t_s.png"),
        //   conf: [
        //     {
        //       name: "actionDesc",
        //       value: "循环组件",
        //     },
        //   ],
        // },
        // {
        //   cpntId: "",
        //   cpntNm: "条件组件",
        //   id: "judgeAction",
        //   paramList: [],
        //   referId: "judgeAction",
        //   type: "judgeAction",
        //   iconUrl: require("@m/assets/images/tools/icon_t_j.png"),
        //   color: "$theme_color",
        //   conf: [
        //     {
        //       name: "actionDesc",
        //       value: "条件组件",
        //     },
        //     {
        //       name: "actionMsg",
        //       value: "",
        //     },
        //   ],
        // },
        // {
        //   cpntId: "",
        //   cpntNm: "规则",
        //   id: "ruleAction",
        //   paramList: [],
        //   referId: "ruleAction",
        //   type: "ruleAction",
        //   iconUrl: require("@m/assets/images/tools/icon_t_n.png"),
        //   conf: [
        //     {
        //       name: "actionDesc",
        //       value: "规则",
        //     },
        //     {
        //       name: "errorCodeFieldName",
        //       value: "",
        //     },
        //     {
        //       name: "errorCodeMappingFieldName",
        //       value: "",
        //     },
        //     {
        //       name: "errorMsgFieldName",
        //       value: "",
        //     },
        //   ],
        // },
        // {
        //   cpntId: "",
        //   cpntNm: "output",
        //   id: "outputAction",
        //   paramList: [],
        //   referId: "outputAction",
        //   type: "outputAction",
        //   iconUrl: require("@m/assets/images/tools/icon_t_s.png"),
        //   conf: [
        //     {
        //       name: "actionDesc",
        //       value: "output",
        //     },
        //   ],
        // },
      ],
    };
  },
  methods: {
    //鼠标按下的时候触发
    pickOne(ev, item) {
      console.log("11111", ev, item);
      this.$emit("pickElemEvent", {
        ev,
        item: JSON.parse(JSON.stringify(item)),
      });
    },
    toServ() {
      this.$emit("toServ");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dictionary_process_tools {
  padding: 8px 24px 0;
  overflow: hidden;
  // margin-bottom: 7px;
  position: fixed;
  z-index: 10;
  height: 50px;
  background: $base_white;
  .tools_list {
    position: relative;
    user-select: none;
    height: 100%;
    .tips {
      padding: 8px 0px;
      left: 230px;
      top: 0;
      position: absolute;
    }
    .list {
      .list_item_box {
        width: 40px;
        height: 40px;
        float: left;
        position: relative;
        text-align: center;
        cursor: pointer;
        margin-right: 16px;
        user-select: none;
        p {
          position: absolute;
          bottom: -4px;
          left: -5px;
          right: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 12px;
          text-align: center;
          width: 50px;
        }
        .list_item_box_i {
          height: 40px;
          width: 100%;
          pointer-events: none;
        }
      }
    }
  }
  .btn_style {
    position: absolute;
    right: -20px;
    .primary_btn {
      margin-left: 0;
    }
    /deep/ .el-button--mini {
      border-radius: 0;
    }
  }
}
</style>