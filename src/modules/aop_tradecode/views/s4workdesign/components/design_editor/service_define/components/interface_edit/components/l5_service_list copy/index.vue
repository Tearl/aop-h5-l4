<template>
  <div
    class="aop_tradecode_download_design_transaction_edit_comps_l5_service"
  >
    <div class="flex_tab">
      <div class="content_header base_nav_title table_title">规则列表</div>
      <!-- <div class="btn" v-show="pageType != 'confirm' || showBtn || noTrans">
        <el-button
          type="primary"
          size="small"
          class="btn_style"
          icon="el-icon-plus"
          :disabled="noTrans"
          @click="handleGoTo(1, showBtn)"
          >编排</el-button
        >
      </div> -->
    </div>
    <div class="data_list">
      <el-table
        ref="refTable"
        class="table_style"
        :data="l5ServiceList"
        :row-key="'actionId'"
        :tree-props="{ children: 'layoutActionList' }"
        :span-method="spanMethod"
        border
      >
        <el-table-column
          v-for="(item, index) in l5ServiceTable"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="left"
          :show-overflow-tooltip="true"
          min-width="60"
        >
          <template slot-scope="scope">
            <span v-if="scope.row[item.prop] == ''">/</span>
            <span v-else-if="scope.column.property == 'actionTyp'">{{
              scope.row[item.prop] | actionType
            }}</span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
import filters from "@m/utils/filters";
export default {
  mixins: [mixin],
  components: {
    Table,
  },
  props: {
    pageType: {
      type: String,
      default: () => "",
    },
    noTrans: {
      type: Boolean,
      default: () => false,
    },
    showBtn: {
      type: Boolean,
      default: () => false,
    },
  },
  filters: {
    ...filters,
  },
  data() {
    return {
      l5ServiceList: [],
      l5ServiceTable: [
        {
          prop: "loSeqNo",
          label: "顺序号",
          type: "text",
          width: "120",
        },
        {
          prop: "actionTyp",
          label: "类型",
          type: "text",
          width: "120",
          // filter: actionType,
        },
        {
          prop: "actionNm",
          label: "名称",
          type: "text",
          width: "120",
        },
        {
          prop: "frntLoSeqNo",
          label: "前序顺序号",
          type: "text",
          operate: "fwmc",
          width: "180",
        },
        {
          prop: "source",
          label: "来源",
          type: "text",
          operate: "fwmc",
          width: "180",
        },
        {
          prop: "paramNm",
          label: "返回字段",
          type: "text",
          width: "100",
        },
        {
          prop: "condTyp",
          label: "对比关系",
          type: "text",
          width: "100",
        },
        {
          prop: "paramValue",
          label: "对比值",
          type: "text",
          width: "100",
        },
        {
          prop: "postLoSeqNo",
          label: "后续顺序号",
          type: "text",
          width: "100",
        },
      ],
      columnList: [
        "loSeqNo",
        "actionTyp",
        "actionNm",
        "frntLoSeqNo",
        "postLoSeqNo",
      ],
      mergeObj: {},
      mergeChildObj: [],
      mergeArr: [
        "loSeqNo",
        "actionTyp",
        "actionNm",
        "frntLoSeqNo",
        "postLoSeqNo",
      ],
      childData: [],
    };
  },
  inject: ["handleGoTo"],
  created() {},
  methods: {
    initData(apiId) {
      this.childData = [];
      this.l5ServiceList = [];
      this.childData.childLength = 0;
      this.getL5Serv(apiId);
    },
    // 获取L5服务列表
    async getL5Serv(apiId) {
      const params = {
        svcId: apiId,
      };
      const res = await this.rpc.newEditor.get4BServiceArrangeList(params);
      this.l5ServiceList = res.layoutActionList.reduce((pre, cur) => {
        if (cur.layoutActionList && cur.layoutActionList.length) {
          cur.layoutActionList = cur.layoutActionList.filter((item) => {
            return item.actionTyp != "0";
          });
        }
        if (cur.actionTyp != "0") {
          pre.push(cur);
        }
        return pre;
      }, []);
      this.getJsonData(this.l5ServiceList);
      this.dealData(this.l5ServiceList);
      this.setChild(this.l5ServiceList);
      this.getSpanArr(this.l5ServiceList);
    },
    // 存在相同id的组件，且有子参数，则只保留最后一个元素的子参数，其他为空
    setChild(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].layoutActionList?.length > 0) {
          for (let j = i + 1; j < data.length; j++) {
            if (data[i].actionId == data[j].actionId) {
              data[i].layoutActionList = [];
              break;
            }
          }
        }
      }
    },
    // 将tfrCdtnCd字段返回的时候解析为数组，并生成数据
    getJsonData(data) {
      const empty = "/";
      data.forEach((item) => {
        if (item.layoutActionList.length) {
          this.getJsonData(item.layoutActionList);
        }
        const tfrCdtnCd = JSON.parse(item.tfrCdtnCd || "[]");
        if (tfrCdtnCd.length) {
          item.paramKey = tfrCdtnCd[0].paramKey || empty;
          item.paramNm = tfrCdtnCd[0].paramNm || empty;
          item.condTyp = tfrCdtnCd[0].condTyp || empty;
          item.paramValue = tfrCdtnCd[0].paramValue || empty;
          item.postLoSeqNo = tfrCdtnCd[0].actionPostSeq || item.postLoSeqNo;
          item.source = tfrCdtnCd[0].actionNm || empty;
          for (let i = 1; i < tfrCdtnCd.length; i++) {
            let arr = JSON.parse(JSON.stringify(item));
            arr.paramKey = tfrCdtnCd[i].paramKey || empty;
            arr.paramNm = tfrCdtnCd[i].paramNm || empty;
            arr.condTyp = tfrCdtnCd[i].condTyp || empty;
            arr.paramValue = tfrCdtnCd[i].paramValue || empty;
            arr.postLoSeqNo = tfrCdtnCd[i].actionPostSeq || item.postLoSeqNo;
            arr.source = tfrCdtnCd[i].actionNm || empty;
            arr.tfrCdtnCd = "";
            data.push(arr);
          }
        } else {
          item.paramKey = empty;
          item.paramNm = empty;
          item.condTyp = empty;
          item.paramValue = empty;
          item.postLoSeqNo = item.postLoSeqNo;
          item.source = empty;
        }
        return item;
      });
    },
    //根据服务名称、后续位置进行排序
    dealData(data) {
      data.sort((a, b) => {
        let nameA = a.loSeqNo.toUpperCase();
        let nameB = b.loSeqNo.toUpperCase();
        let seqNoA = a.postLoSeqNo.toUpperCase();
        let seqNoB = b.postLoSeqNo.toUpperCase();
        if (nameA !== nameB) {
          return nameA < nameB ? -1 : 1;
        } else if (seqNoA !== seqNoB) {
          return seqNoA < seqNoB ? -1 : 1;
        }
      });
      data.forEach((item) => {
        if (item.layoutActionList) {
          this.dealData(item.layoutActionList);
        }
      });
    },
    // 获取需要合并的行列
    getSpanArr(data) {
      this.mergeArr.forEach((key, arrIndex) => {
        let pid = "";
        let count = 0;
        let childCount = 0;
        let sumChildList = [];
        this.mergeObj[key] = [];
        this.mergeChildObj[key] = [];
        data.forEach((item, index) => {
          if (!item.parentActionId) {
            if (index === 0) {
              this.mergeObj[key].push(1);
            } else if (
              arrIndex > 0 &&
              this.mergeObj[this.mergeArr[arrIndex - 1]][index] == 1
              //&&  (key == "postLoSeqNo" )
            ) {
              this.mergeObj[key].push(1);
            } else {
              // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
              if (
                item[key] === data[index - 1][key] &&
                item.actionId == data[index - 1].actionId
              ) {
                this.mergeObj[key][count] += 1;
                this.mergeObj[key].push(0);
              } else {
                count = index;
                this.mergeObj[key].push(1);
              }
            }
          }
          // 判断子参数
          if (item.layoutActionList.length) {
            item.layoutActionList.forEach((ii, index) => {
              if (index === 0 || pid != ii.parentActionId) {
                this.mergeChildObj[key].push(1);
              } else if (
                arrIndex > 0 &&
                this.mergeChildObj[this.mergeArr[arrIndex - 1]][index] == 1
                //&&  (key == "postLoSeqNo" )
              ) {
                // 判断当前列的前一列是否合并，如果没有则当前列也不合并
                this.mergeChildObj[key].push(1);
              } else {
                // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
                if (
                  ii[key] === item.layoutActionList[index - 1][key] &&
                  ii.actionId == item.layoutActionList[index - 1].actionId
                ) {
                  this.mergeChildObj[key][childCount] += 1;
                  this.mergeChildObj[key].push(0);
                } else {
                  childCount = childCount + index;
                  this.mergeChildObj[key].push(1);
                }
              }
              // 如果是多个组件的子参数，则需要+1位进行判断新的子参数
              if (index == item.layoutActionList.length - 1) {
                sumChildList.push({
                  actionId: item.actionId,
                  count: item.layoutActionList.length,
                });
                let sum = 0;
                sumChildList.forEach((iitem, index) => {
                  sum += iitem.count;
                  if (iitem.actionId == item.actionId) {
                    childCount = sum;
                  }
                  // console.log("id相同时", childCount,sum);
                });
              }
              pid = ii.parentActionId;
            });
          }
        });
      });
      console.log("result", this.mergeObj, this.mergeChildObj);
    },
    // 合并
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        this.mergeArr.indexOf(column.property) !== -1 &&
        !row.parentActionId
      ) {
        // 如果当前行存在子参数
        if (
          row.layoutActionList.length > 0 &&
          this.mergeObj[column.property][rowIndex - this.childData.childLength]
        ) {
          // console.log("当前行有子参数", row.actionNm,column.property,row.layoutActionList,this.mergeObj[column.property][rowIndex - this.childData.childLength])
          // 如果当前组件存在子参数，且没有记录过当前组件的子参数信息
          if (
            this.childData.findIndex((item) => item.actionId == row.actionId) ==
            "-1"
          ) {
            this.childData.push({
              actionId: row.actionId,
              childIndex: rowIndex,
              sumChildlength:
                row.layoutActionList.length + this.childData.childLength,
            });
            this.childData.childLength += row.layoutActionList.length;
            // console.log("记录当前子参数", this.childData)
          }
          let recordIndex = rowIndex;
          this.childData.map((item) => {
            if (item.childIndex < rowIndex) {
              recordIndex = rowIndex - item.sumChildlength;
            }
          });
          // console.log("渲染咯", rowIndex,this.childData,recordIndex,this.mergeObj[column.property],this.mergeObj[column.property][recordIndex],)
          return [this.mergeObj[column.property][recordIndex], 1];
        }
        // console.log("无子参数",rowIndex,this.childData,row.actionNm,column.property,"子参数",row.layoutActionList,this.mergeObj[column.property][rowIndex],this.mergeObj[column.property])
        let index = rowIndex;
        this.childData.map((item) => {
          if (item.childIndex < rowIndex) {
            index = rowIndex - item.sumChildlength;
          }
        });
        // console.log("更新长度",row.actionNm,column.property,rowIndex, index, this.childData,this.childData.childLength,this.mergeObj[column.property],this.mergeObj[column.property][index])
        if (this.mergeObj[column.property][index]) {
          // console.log("渲染行",this.mergeObj[column.property][index],this.mergeObj[column.property], index)
          return [this.mergeObj[column.property][index], 1];
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
      if (this.mergeArr.indexOf(column.property) !== -1 && row.parentActionId) {
        // 因为子参数渲染是从0行开始的，但是他当前的rowIndex为总行数的第几行，所以需要找到当前mergeChildObj内对应的子参数位置
        let template = [];
        this.l5ServiceList.map((item, index) => {
          if (item.actionId == row.parentActionId) {
            template.push(index);
          }
        });
        let childIndex = template[template.length - 1] + 1;
        if (this.mergeChildObj[column.property][rowIndex - childIndex]) {
          return [
            this.mergeChildObj[column.property][rowIndex - childIndex],
            1,
          ];
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
    },
    handelDetail() {
      this.$router.push({
        path: "/aop_tradecode/d4workbench/transEdit",
        query: {
          apiId: "19328199429459133117",
        },
      });
    },
    handelTransDetail() {
      this.$router.push({
        path: "/aop_tradecode/d4workbench/transDetail",
        query: {
          svcId: "19328199429459133117",
        },
      });
    },
    handelOneFirm() {
      this.$router.push({
        path: "/aop_tradecode/d4workbench/transConfirm",
        query: {
          isolateWorkspace: "FM-ZY0.6ZC-2023-000502",
          funcId: "FM-GN-2023-100924",
          funcName: "功能1",
          approvalType: "01",
          problemType: "03",
          layoutId: "FM-YS-2023-000128",
          layoutName: "ces1",
          cpntId: "1111",
          cpntName: "ces",
          apiId: "19328199429459133117",
          svcName: "测试",
          compositeId: "FM-YS-2023-000199",
          compositeName: "要素1",
          eventId: "111",
          eventName: "1",
          detailType: "32",
          opinion: "dfdf",
          passStatus: "00",
          rarId: "4544",
          modelVersion: "000005",
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";

.aop_tradecode_download_design_transaction_edit_comps_l5_service {
  .flex_tab {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .table_title {
      font-family: $font_medium;
      font-size: 16px;
      color: $reg_ft_color;
      letter-spacing: 0;
      line-height: 36px;
      font-weight: $font_weight_600;
    }

    .btn {
      .btn_style {
        // width: 68px;
        height: 36px;
        border-radius: 2px;
        font-size: 14px;
      }
    }
  }

  .data_list {
    ::v-deep .el-table tr {
      background: $base_white;
      color: $reg_ft_color;

      .cell {
        div {
          display: inline-block;
        }
      }
    }

    ::v-deep .el-table th {
      background: $base_bg_color;
      color: $reg_ft_color !important;
    }

    ::v-deep
      .el-table--enable-row-transition
      .el-table__body
      td.el-table__cell {
      height: 47px;
    }
  }
}
</style>