<template>
  <div class="aop_tradedesign_comps_d4_download_design_commit_dialog">
    <PageDialog
      :dialogWidth="'65%'"
      :dialogTitle="'提交信息'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
      class="dialog_container"
    >
      <div slot="box">
        <div class="box_title">
          <span>{{ svcNm }}</span>
        </div>
        <!-- <Table
          class="table_style"
          :data="tableData"
          :table="tableColumn"
          :mergeArr="mergeArr"
          :mergeFlag="true"
          :mergeObj="mergeObj"
          @spanMethod="objectSpanMethod"
          @radioChange="radioChange"
        ></Table>-->
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%"
          :header-cell-style="tableHeaderCellStyle"
          :cell-style="setRowStyle"
        >
          <el-table-column
            v-for="item in tableColumn"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  item.type == 'text' && !scope.row[item.prop]
                "
                >/</span
              >
              <span
                v-if="
                  item.type == 'radioGroup' && scope.row[item.prop] == 'none'
                "
                >/</span
              >
              <el-radio-group
                v-else-if="item.type == 'radioGroup'"
                v-model="scope.row[item.prop]"
                @change="(e) => radioChange(e, scope.row)"
                :fill="scope.row[item.prop] == '00' ? '#36D542' : '#FE4758'"
              >
                <el-radio-button
                  v-for="ii in item.radioList"
                  :key="ii.value"
                  :label="ii.value"
                  >{{ ii.label }}</el-radio-button
                >
              </el-radio-group>
              <span v-else>{{
                getFilters(scope.row[item.prop], item.filter)
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click.native="closeDialog">取 消</el-button>
        <el-button type="primary" @click.native="confirm">确 定</el-button>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
  },
  props: {
    pageType: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      textareaValue: "",
      tableColumn: [
        {
          prop: "confirmType",
          label: "确认类别",
          width: "12%",
          type: "text",
        },
        {
          prop: "detailType",
          label: "确认明细",
          width: "30%",
          type: "text",
          filter: "detailType",
        },
        {
          prop: "svcName",
          label: "确认详情",
          width: "15%",
          type: "text",
        },
        {
          prop: "opinion",
          label: "客户意见",
          width: "30%",
          type: "text",
        },
        {
          prop: "passStatus",
          label: "确认状态",
          width: "20%",
          type: "radioGroup",
          align: "center",
          radioList: [
            {
              label: "通过",
              value: "00",
            },
            {
              label: "不通过",
              value: "01",
            },
          ],
        },
      ],
      tableData: [],
      mergeObj: {},
      mergeArr: ["confirmType", "detailType"], //, "detailType"
      svcNm: "",
      dataObj: {},
      L5servList: {},
    };
  },
  created() {},
  // ......
  methods: {
    showDialog(e) {
      this.svcNm = this.dataObj.funcNm;
      this.dialogVisible = true;
      this.dataObj = e;
      this.getL5serv().then(() => {
        this.getList();
      });
    },
    async getList() {
      const params = {
        rarId: this.dataObj.rarId,
        layoutId: this.dataObj.layoutId,
        compositeId: this.dataObj.compositeId,
        cpntId: this.dataObj.cpntId,
        eventId: this.dataObj.eventId,
        businessId: this.dataObj.businessId,
        // isolateWorkspace: this.dataObj.isolateWorkspace,
        // funcId: this.dataObj.funcId,
        // approvalType: this.pageType == "review" ? "00" : "01",
        // svcId: this.dataObj.apiId,
      };
      const res = await this.rpc.d4.getTransConfirm(params);
      let arr = res.questionRecordList;
      this.tableData = [
        {
          confirmType: "业务规则设计",
          passStatus: "00",
          detailType: "32",
          svcName: this.dataObj.businessName,
        },
        {
          confirmType: "业务规则设计",
          passStatus: "00",
          detailType: "33",
          svcName: this.dataObj.businessName,
        },
        {
          confirmType: "业务规则设计",
          passStatus: "00",
          detailType: "34",
          svcName: this.dataObj.businessName,
        },
      ];
      this.tableData = this.tableData.concat(this.L5servList);

      this.tableData.forEach((item) => {
        arr.forEach((ii) => {
          if (item.detailType == ii.detailType && ii.detailType != "35") {
            item.opinion = ii.opinion;
            if (!ii.opinion && !ii.passStatus) {
              item.passStatus = "00";
            } else if (!ii.passStatus) {
              item.passStatus = "01";
            } else {
              item.passStatus = ii.passStatus;
            }
          }
          if (ii.detailType == "35" && ii.svcId == item.svcId) {
            item.opinion = ii.opinion;
            if (!ii.opinion && !ii.passStatus) {
              item.passStatus = "00";
              item.opinion = ""
            } else if (!ii.passStatus) {
              item.passStatus = "01";
            } else {
              item.passStatus = ii.passStatus;
            }
          }
        });
      });
      this.getSpanArr(this.tableData);
    },
    async getL5serv() {
      const params = {
        apiId: this.dataObj.apiId,
        turnPageShowNum: 1000
      };
      const res = await this.rpc.d4.getAssociatedSelfServiceList(params);
      this.L5servList = res.apiInfoList;
      if (res.apiInfoList.length) {
        this.L5servList = res.apiInfoList.map((item) => {
          return {
            confirmType: "业务规则设计",
            passStatus: "00",
            detailType: "基于业务规则定义的规则处理是否正确",
            detailType: "35",
            svcId: item.apiId,
            svcName: item.apiName,
          }
        });
      } else {
        this.L5servList = [
          {
            confirmType: "业务规则设计",
            passStatus: "00",
            detailType: "35",
            svcName: "",
            passStatus: "none",
          },
        ];
      }
    },
    confirm() {
      this.$emit("confirmReview", this.tableData);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    init() {
      // this.getSpanArr(this.tableData);
    },
    // 单选
    radioChange(e, data) {},
    getSpanArr(data) {
      this.mergeArr.forEach((key, index1) => {
        let count = 0; // 用来记录需要合并行的起始位置
        this.mergeObj[key] = []; // 记录每一列的合并信息
        data.forEach((item, index) => {
          // index == 0表示数据为第一行，直接 push 一个 1
          if (index === 0) {
            this.mergeObj[key].push(1);
          } else {
            // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
            if (item[key] === data[index - 1][key]) {
              this.mergeObj[key][count] += 1;
              this.mergeObj[key].push(0);
            } else {
              // 如果当前行和上一行其值不相等
              count = index; // 记录当前位置
              this.mergeObj[key].push(1); // 重新push 一个 1
            }
          }
        });
      });
    },
    // 默认接受四个值 { 当前行的值, 当前列的值, 行的下标, 列的下标 }
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(
      //   "objectSpanMethod",
      //   this.mergeArr.indexOf(column.property),
      //   column.property
      // );
      // 判断列的属性
      if (this.mergeArr.indexOf(column.property) !== -1) {
        // console.log(
        //   "等于-1",
        //   this.mergeObj[column.property][rowIndex],
        //   rowIndex
        // );
        // 判断其值是不是为0
        if (this.mergeObj[column.property][rowIndex]) {
          return [this.mergeObj[column.property][rowIndex], 1];
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
    },
    // 过滤器
    getFilters(porp, filter) {
      if (!!filter) {
        return filters[filter](porp);
      } else {
        return porp;
      }
    },
    tableHeaderCellStyle() {
      return "background:  #F5F5F8; color: #111111;";
    },
    setRowStyle({row, column, rowIndex, columnIndex}) {
      if(rowIndex == 0 && columnIndex == 0) {
        return 'font-weight: 600;color: #333;'
      }
    }
  },
  mounted() {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.aop_tradedesign_comps_d4_download_design_commit_dialog {
  .submit_record_not_pass_content {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;

    .el-textarea {
      height: 180px;
    }
  }
  .box_title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: $font_weight_600;
    color: $reg_ft_color;
  }
  /deep/ .el-radio-button__inner {
    padding: 8px 16px;
  }
}
</style>
