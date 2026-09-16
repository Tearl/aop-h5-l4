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
          <span>交易名称：</span>
        </div>
        <Table
          class="table_style"
          :data="tableData"
          :table="tableColumn"
          :mergeArr="mergeArr"
          :mergeFlag="true"
          @spanMethod="objectSpanMethod"
        ></Table>
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
  props: {},
  data() {
    return {
      dialogVisible: false,
      textareaValue: "",
      tableColumn: [
        {
          prop: "time",
          label: "确认类别",
          width: "20%",
          type: "text",
        },
        {
          prop: "grade",
          label: "确认明细",
          width: "20%",
          type: "text",
        },
        {
          prop: "name",
          label: "确认结果",
          width: "20%",
          type: "text",
        },
        {
          prop: "subjects",
          label: "对应业务名称",
          width: "20%",
          type: "text",
        },
        {
          prop: "score",
          label: "客户意见",
          width: "30%",
          type: "input",
        },
      ],
      tableData: [
        {
          time: "2020-08-10",
          grade: "三年二班",
          name: "小明",
          subjects: "语文",
          score: 80,
        },
        {
          time: "2020-08-10",
          grade: "三年二班",
          name: "小明",
          subjects: "数学",
          score: 80,
        },
        {
          time: "2020-08-10",
          grade: "三年一班",
          name: "小雷",
          subjects: "语文",
          score: 70,
        },
        {
          time: "2020-08-10",
          grade: "三年一班",
          name: "小雷",
          subjects: "数学",
          score: 80,
        },
        {
          time: "2020-08-11",
          grade: "三年三班",
          name: "小花",
          subjects: "语文",
          score: 60,
        },
        {
          time: "2020-08-11",
          grade: "三年三班",
          name: "小花",
          subjects: "数学",
          score: 60,
        },
      ],
      mergeObj: {},
      mergeArr: ["time", "grade", "name", "subjects"],
    };
  },
  created() {},
  // ......
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.init();
    },
    async confirm() {
      this.closeDialog()
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    init() {
      this.getSpanArr(this.tableData);
    },
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
      // console.log("mergeArr", this.mergeArr, this.mergeObj);
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
          // console.log("合并了");
          return [this.mergeObj[column.property][rowIndex], 1];
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
    },
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
  }
}
</style>
