<template>
  <div
    class="aop_tradedesign_comps_d4design_process_tools"
  >
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
      <div class="tips" v-if="pageMode != 'read'">
        <el-tag size="small" type="danger" v-show="designerFlg == 1"
          >当前是{{ designerDesc }}正在设计中，您稍后再试</el-tag
        >
        <el-tag size="small" type="warning" v-show="designerFlg != 1"
          >请选择图形，然后直接拖入画布
        </el-tag>
        <!-- <el-button
          v-show="designerFlg == 0"
          type="primary"
          size="mini"
          class="design_btn"
          @click="startDesign"
          >开始设计</el-button
        >-->
        <div class="btn_style">
          <el-button type="primary" v-show="fourRAttrFlag" size="mini" @click="toServ"
            >返回</el-button
          >
          <el-button
            v-show="designerFlg == 2"
            type="primary"
            size="mini"
            class="primary_btn"
            @click="toSave"
            >保存</el-button
          >
        </div>
        <!-- <span v-show="designerFlg == 1" class="designer_tips">
          当前是{{designerDesc}}正在设计中，您稍后再试
        </span> -->
      </div>
      <!-- <div class="btn_box" v-show="fourRAttrFlag">
        <div class="list_item_box " @click="toServ">
          <div class="list_item_box_i" draggable="true">
            <img :src="require('@m/assets/images/tools/icon_t_back.png')" />
            <p>返回</p>
          </div>
        </div>
        <div class="list_item_box btn_box_left" @click="toSave">
          <div class="list_item_box_i" draggable="true">
            <img :src="require('@m/assets/images/tools/icon_t_back.png')" />
            <p>保存</p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    saveDisabled: {
      type: Boolean,
      default: () => false,
    },
    pageMode: {
      type: String,
      default: () => "",
    },
    designerFlg: {
      type: String,
      default: () => "",
    },
    designerDesc: {
      type: String,
      default: () => "",
    },
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      //基础服务组件数据列表
      // toolsList: [
      //   {
      //     cpntId: "",
      //     cpntNm: "input",
      //     id: "inputAction",
      //     paramList: [],
      //     referId: "inputAction",
      //     type: "inputAction",
      //     iconUrl: require("@m/assets/images/tools/input.png"),
      //     conf: [
      //       {
      //         name: "actionDesc",
      //         value: "input",
      //       },
      //       {
      //         name: "actionMsg",
      //         value: "",
      //       },
      //     ],
      //   },
      //   {
      //     cpntId: "",
      //     cpntNm: "规则处理",
      //     id: "ruleAction",
      //     paramList: [],
      //     referId: "ruleAction",
      //     type: "ruleAction",
      //     iconUrl: require("@m/assets/images/tools/rule_treating.png"),
      //     conf: [
      //       {
      //         name: "actionDesc",
      //         value: "规则处理",
      //       },
      //       {
      //         name: "actionMsg",
      //         value: "",
      //       },
      //     ],
      //   },
      //   // {
      //   //   cpntId: "",
      //   //   cpntNm: "数据处理",
      //   //   id: "dataDealAction",
      //   //   paramList: [],
      //   //   referId: "dataDealAction",
      //   //   type: "dataDealAction",
      //   //   iconUrl: require("@m/assets/images/tools/data_treating.png"),
      //   //   conf: [
      //   //     {
      //   //       name: "actionDesc",
      //   //       value: "数据处理",
      //   //     },
      //   //     {
      //   //       name: "actionMsg",
      //   //       value: "",
      //   //     },
      //   //   ],
      //   // },
      //   // {
      //   //   cpntId: "",
      //   //   cpntNm: "数据集",
      //   //   id: "dataListAction",
      //   //   paramList: [],
      //   //   referId: "dataListAction",
      //   //   type: "dataListAction",
      //   //   iconUrl: require("@m/assets/images/tools/icon_t_sq.png"),
      //   //   conf: [
      //   //     {
      //   //       name: "actionDesc",
      //   //       value: "数据集",
      //   //     },
      //   //     {
      //   //       name: "actionMsg",
      //   //       value: "数据集描述",
      //   //     },
      //   //     {
      //   //       name: "dataListId",
      //   //       value: "数据集id",
      //   //     },
      //   //     {
      //   //       name: "dataListNm",
      //   //       value: "数据集名称",
      //   //     },
      //   //   ],
      //   // },
      //   {
      //     cpntId: "",
      //     cpntNm: "条件组件",
      //     id: "judgeAction",
      //     paramList: [],
      //     referId: "judgeAction",
      //     type: "judgeAction",
      //     iconUrl: require("@m/assets/images/tools/judge.png"),
      //     color: "$theme_color",
      //     conf: [
      //       {
      //         name: "actionDesc",
      //         value: "条件组件",
      //       },
      //       {
      //         name: "actionMsg",
      //         value: "",
      //       },
      //       {
      //         name: "paramList",
      //         value: "[]",
      //       },
      //     ],
      //   },
      //   {
      //     cpntId: "",
      //     cpntNm: "循环组件",
      //     id: "loopAction",
      //     paramList: [],
      //     referId: "loopAction",
      //     type: "loopAction",
      //     iconUrl: require("@m/assets/images/tools/circulation.png"),
      //     conf: [
      //       {
      //         name: "actionDesc",
      //         value: "循环组件",
      //       },
      //       {
      //         name: "actionMsg",
      //         value: "",
      //       },
      //     ],
      //   },
      //   {
      //     cpntId: "",
      //     cpntNm: "异常处理",
      //     id: "throwExceptionAction",
      //     paramList: [],
      //     referId: "throwExceptionAction",
      //     type: "throwExceptionAction",
      //     iconUrl: require("@m/assets/images/tools/icon_t_er.png"),
      //     color: "$theme_color",
      //     conf: [
      //       {
      //         name: "actionDesc",
      //         value: "异常处理",
      //       },
      //       {
      //         name: "actionMsg",
      //         value: "",
      //       },
      //       {
      //         name: "errorMsg",
      //         value: "错误信息",
      //       },
      //       {
      //         name: "errorCode",
      //         value: "错误码",
      //       },
      //     ],
      //   },
      //   {
      //     cpntId: "",
      //     cpntNm: "4R",
      //     id: "4RAction",
      //     paramList: [],
      //     referId: "4RAction",
      //     type: "4RAction",
      //     iconUrl: require("@m/assets/images/tools/icon_t_4r.png"),
      //     conf: [
      //       {
      //         name: "actionDesc",
      //         value: "4R",
      //       },
      //       {
      //         name: "actionMsg",
      //         value: "",
      //       },
      //     ],
      //   },
      //   {
      //     cpntId: "",
      //     cpntNm: "output",
      //     id: "outputAction",
      //     paramList: [],
      //     referId: "outputAction",
      //     type: "outputAction",
      //     iconUrl: require("@m/assets/images/tools/output.png"),
      //     conf: [
      //       {
      //         name: "actionDesc",
      //         value: "output",
      //       },
      //       {
      //         name: "actionMsg",
      //         value: "",
      //       },
      //     ],
      //   },
      //   // {
      //   //   cpntId: "",
      //   //   cpntNm: "创建D5需求",
      //   //   id: "newD5Action",
      //   //   paramList: [],
      //   //   referId: "newD5Action",
      //   //   type: "newD5Action",
      //   //   iconUrl: require("@m/assets/images/tools/R5_new_icon.png"),
      //   //   conf: [
      //   //     {
      //   //       name: "actionDesc",
      //   //       value: "创建D5需求",
      //   //     },
      //   //     {
      //   //       name: "svcId",
      //   //       value: "",
      //   //     },
      //   //     {
      //   //       name: "svcNo",
      //   //       value: "/服务编号",
      //   //     },
      //   //     {
      //   //       name: "svcTpCd",
      //   //       value: "D5自有服务",
      //   //     },
      //   //     {
      //   //       name: "sysNm",
      //   //       value: "领域名",
      //   //     },
      //   //   ],
      //   // },
      // ],
    };
  },
  inject: ["getDataList"],
  methods: {
    //鼠标按下的时候触发
    pickOne(ev, item) {
      if (this.pageMode == "read") return;
      if (this.saveDisabled) return;
      // 判断是否存在重名
      const _item = JSON.parse(JSON.stringify(item));
      const dataList = this.getDataList();
      const list = dataList.filter(
        (dataListItem) =>
          dataListItem.actionName == item.cpntNm &&
          dataListItem.actionType == item.type
      );
      if (list.length > 0) {
        console.log("_item", _item);
        const num =
          dataList.filter(
            (dataListItem) => dataListItem.actionType == item.type
          ).length + 1;
        _item.conf.find(
          (e) => e.name == "actionDesc"
        ).value = `${_item.cpntNm}${num}`;
      }
      this.$emit("pickElemEvent", { ev, item: _item });
    },
    // startDesign() {
    //   this.$emit("startDesign");
    // },
    // completeDesign() {
    //   this.$emit("completeDesign");
    // },
    toSave() {
      this.$emit("toSave");
    },
    toServ() {
      this.$emit("toServ");
    },
  },
  computed: {
    toolsList() {
      if (this.fourRAttrFlag) {
        return [
          {
            cpntId: "",
            cpntNm: "input",
            id: "inputAction",
            paramList: [],
            referId: "inputAction",
            type: "inputAction",
            iconUrl: require("@m/assets/images/tools/input.png"),
            conf: [
              {
                name: "actionDesc",
                value: "input",
              },
              {
                name: "actionMsg",
                value: "",
              },
            ],
          },
          {
            cpntId: "",
            cpntNm: "数据处理",
            id: "dataDealAction",
            paramList: [],
            referId: "dataDealAction",
            type: "dataDealAction",
            iconUrl: require("@m/assets/images/tools/data_treating.png"),
            conf: [
              {
                name: "actionDesc",
                value: "数据处理",
              },
              {
                name: "actionMsg",
                value: "",
              },
            ],
          },
          // {
          //   cpntId: "",
          //   cpntNm: "规则处理",
          //   id: "ruleAction",
          //   paramList: [],
          //   referId: "ruleAction",
          //   type: "ruleAction",
          //   iconUrl: require("@m/assets/images/tools/rule_treating.png"),
          //   conf: [
          //     {
          //       name: "actionDesc",
          //       value: "规则处理",
          //     },
          //     {
          //       name: "actionMsg",
          //       value: "",
          //     },
          //   ],
          // },
          {
            cpntId: "",
            cpntNm: "条件组件",
            id: "judgeAction",
            paramList: [],
            referId: "judgeAction",
            type: "judgeAction",
            iconUrl: require("@m/assets/images/tools/judge.png"),
            color: "$theme_color",
            conf: [
              {
                name: "actionDesc",
                value: "条件组件",
              },
              {
                name: "actionMsg",
                value: "",
              },
              {
                name: "paramList",
                value: "[]",
              },
            ],
          },
          {
            cpntId: "",
            cpntNm: "循环组件",
            id: "loopAction",
            paramList: [],
            referId: "loopAction",
            type: "loopAction",
            iconUrl: require("@m/assets/images/tools/circulation.png"),
            conf: [
              {
                name: "actionDesc",
                value: "循环组件",
              },
              {
                name: "actionMsg",
                value: "",
              },
            ],
          },
          {
            cpntId: "",
            cpntNm: "异常处理",
            id: "throwExceptionAction",
            paramList: [],
            referId: "throwExceptionAction",
            type: "throwExceptionAction",
            iconUrl: require("@m/assets/images/tools/icon_t_er.png"),
            color: "$theme_color",
            conf: [
              {
                name: "actionDesc",
                value: "异常处理",
              },
              {
                name: "actionMsg",
                value: "",
              },
              {
                name: "errorMsg",
                value: "错误信息",
              },
              {
                name: "errorCode",
                value: "错误码",
              },
            ],
          },
          // {
          //   cpntId: "",
          //   cpntNm: "4R",
          //   id: "4RAction",
          //   paramList: [],
          //   referId: "4RAction",
          //   type: "4RAction",
          //   iconUrl: require("@m/assets/images/tools/icon_t_4r.png"),
          //   conf: [
          //     {
          //       name: "actionDesc",
          //       value: "4R",
          //     },
          //     {
          //       name: "actionMsg",
          //       value: "",
          //     },
          //   ],
          // },
          {
            cpntId: "",
            cpntNm: "output",
            id: "outputAction",
            paramList: [],
            referId: "outputAction",
            type: "outputAction",
            iconUrl: require("@m/assets/images/tools/output.png"),
            conf: [
              {
                name: "actionDesc",
                value: "output",
              },
              {
                name: "actionMsg",
                value: "",
              },
            ],
          },
        ];
      } else {
        return [
          {
            cpntId: "",
            cpntNm: "input",
            id: "inputAction",
            paramList: [],
            referId: "inputAction",
            type: "inputAction",
            iconUrl: require("@m/assets/images/tools/input.png"),
            conf: [
              {
                name: "actionDesc",
                value: `${this.currentServObj.apiName || "input"}`,
              },
              {
                name: "actionMsg",
                value: "",
              },
              {
                name: "actionSeq",
                value: "R0000",
              },
            ],
          },
          // {
          //   cpntId: "",
          //   cpntNm: "规则处理",
          //   id: "ruleAction",
          //   paramList: [],
          //   referId: "ruleAction",
          //   type: "ruleAction",
          //   iconUrl: require("@m/assets/images/tools/rule_treating.png"),
          //   conf: [
          //     {
          //       name: "actionDesc",
          //       value: "规则处理",
          //     },
          //     {
          //       name: "actionMsg",
          //       value: "",
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
          //   iconUrl: require("@m/assets/images/tools/judge.png"),
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
          //     {
          //       name: "paramList",
          //       value: "[]",
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
          //   iconUrl: require("@m/assets/images/tools/circulation.png"),
          //   conf: [
          //     {
          //       name: "actionDesc",
          //       value: "循环组件",
          //     },
          //     {
          //       name: "actionMsg",
          //       value: "",
          //     },
          //   ],
          // },
          // {
          //   cpntId: "",
          //   cpntNm: "异常处理",
          //   id: "throwExceptionAction",
          //   paramList: [],
          //   referId: "throwExceptionAction",
          //   type: "throwExceptionAction",
          //   iconUrl: require("@m/assets/images/tools/icon_t_er.png"),
          //   color: "$theme_color",
          //   conf: [
          //     {
          //       name: "actionDesc",
          //       value: "异常处理",
          //     },
          //     {
          //       name: "actionMsg",
          //       value: "",
          //     },
          //     {
          //       name: "errorMsg",
          //       value: "错误信息",
          //     },
          //     {
          //       name: "errorCode",
          //       value: "错误码",
          //     },
          //   ],
          // },
          // {
          //   cpntId: "",
          //   cpntNm: "4R组件",
          //   id: "4RAction",
          //   paramList: [],
          //   referId: "4RAction",
          //   type: "4RAction",
          //   iconUrl: require("@m/assets/images/tools/icon_t_4r.png"),
          //   conf: [
          //     {
          //       name: "actionDesc",
          //       value: "4R组件",
          //     },
          //     {
          //       name: "actionMsg",
          //       value: "",
          //     },
          //   ],
          // },
          {
            cpntId: "",
            cpntNm: "output",
            id: "outputAction",
            paramList: [],
            referId: "outputAction",
            type: "outputAction",
            iconUrl: require("@m/assets/images/tools/output.png"),
            conf: [
              {
                name: "actionDesc",
                value: "output",
              },
              {
                name: "actionMsg",
                value: "",
              },
              {
                name: "actionSeq",
                value: "",
              },
            ],
          },
        ];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4design_process_tools {
  padding: 8px 24px 0;
  overflow: hidden;
  // margin-bottom: 7px;
  position: fixed;
  z-index: 10;
  height: 50px;
  background: $base_white;
  .tools_list {
    display: flex;
    position: relative;
    user-select: none;
    height: 100%;
    .tips {
      transition: none;
      padding: 8px 0px;
      // left: 330px;
      // top: -7px;
      // position: absolute;
      min-width: 250px;
      flex: 1;
      display: flex;
      justify-content: space-between;
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
        // overflow: hidden;
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
  .design_btn {
    margin-left: 10px;
  }
  .designer_tips {
    color: $danger_color;
    position: absolute;
    right: -20px;
  }
  .btn_box {
    position: absolute;
    right: -40px;
  }
  .btn_box_left {
    margin-left: -15px;
  }
}

.fourR_style {
  height: 85px;
}
</style>