<template>
  <div class="page">
    <PageDialog
      :dialogWidth="'720px'"
      :dialogTitle="'选择确认人员'"
      :dialogVisiable="dialogVisible"
      @closeDialog="handleClose"
      class="create_dialog"
      :apTobody="true"
    >
      <div slot="box">
        <div class="add_dialog_conf">
          <ServiceTop
            ref="formRef"
            :serviceForm="serviceForm"
            :form="formInline"
            class="search_conf"
          >
            <div slot="rightButton">
              <el-button
                type="primary"
                size="small"
                @click="goSearch"
                class="right_button"
                >搜索</el-button
              >
              <el-button size="small" @click="resetSearch" class="right_button"
                >重置</el-button
              >
            </div>
          </ServiceTop>
          <Table
            class="table_style"
            :data="tableData"
            :table="tableColumn"
            ref="tablePersonRef"
            :rowK="'userNo'"
            :tableType="'selection'"
            :cellStyle="dictListCellStyle"
            @selectionChange="handleSelectionChange"
          ></Table>
          <!-- 分页器 -->
          <PagePagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          >
          </PagePagination>
          <div class="show_conf">
            <div class="show_conf_title">
              已选择<span>{{ selectData && selectData.length }}</span
              >个：
            </div>
            <div class="show_conf_content">
              <el-tag
                v-for="(item, index) in selectData"
                :key="index"
                type="info"
                size="small"
                closable
                class="show_conf_tag"
                @close="delPersonTag(item)"
              >
                {{ item.userName }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="handleClose">取 消</el-button>
        <el-button type="primary" @click.native="savePerson">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import { unduplicated, setSerialNumber } from "@m/utils/array";
import {mapGetters} from "vuex"
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
    PagePagination,
    ServiceTop,
  },
  props: {},
  data() {
    return {
      dialogVisible: false,
      // 公共搜索
      serviceForm: [
        // {
        //   type: "select",
        //   model: "roleShrtNm",
        //   placeholder: "全部",
        //   labelText: "用户角色:",
        //   select: [
        //     { type: "全部", value: "" },
        //     { type: "自有L5研发订单长", value: "ZYL5YFADMIN" },
        //     { type: "T2设计", value: "T2ZCSJ" },
        //     { type: "T2订单长", value: "T2DDZ" },
        //   ],
        // },
        {
          type: "inputIcon",
          labelText: "用户姓名:",
          model: "userNo",
          placeholder: "请输入",
          iconShow:"text"
        },
        {
          type: "inputIcon",
          labelText: "手机号:",
          model: "userMobile",
          placeholder: "请输入",
        },
      ],
      // 搜索表单
      formInline: {
        roleShrtNm: "",
        userNo: "",
        userMobile: "",
      },
      tableData: [],
      tableColumn: [
        // {
        //   prop: "roleNameList",
        //   label: "角色",
        //   //   minWidth: "30%",
        //   type: "text",
        //   tooltip: true,
        // },
        {
          prop: "userName",
          label: "用户姓名",
          type: "text",
          width:"100",
          tooltip: true,
        },
        {
          prop: "userMobile",
          label: "手机号",
          type: "text",
          width:"150",
          tooltip: true,
        },
      ],
      // 选择参数分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      selectData: [],
      isRecord: false,
      selectionData: [],
      roleShrtNm:""
    };
  },
  created() {},
  mounted() {},
  computed:{
    ...mapGetters(['systemId', 'hasSystemPermission','userInfo']),
  },
  methods: {
    showDialog(data) {
      // this.selectData = [];
      this.roleShrtNm = data;
      this.dialogVisible = true;
      this.getPersonList();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    goSearch() {
      this.isRecord = true;
      this.getPersonList();
    },
    resetSearch() {
      this.formInline = {
         roleShrtNm: "",
         userNo: "",
         userMobile: "",
      }
      this.getPersonList();
    },
    //多选显示
    // dictListCellStyle({ row, column, rowIndex, columnIndex }) {
    //   if (row.dictNo !== "" && column.type === "selection") {
    //     return { visibility: "hidden" };
    //   }
    // },
    handleSelectionChange(data) {
      if (!this.isRecord && this.selectionData.length > data.length) {
        this.selectionData.forEach((item) => {
          if (data.indexOf(item) == -1) {
            this.selectData = this.selectData.filter(
              (it) => it.userNo != item.userNo
            );
          }
        });
      } else {
        this.selectData.push(...data);
        this.selectData = unduplicated(this.selectData, "userNo");
        // this.isRecord = false;
      }
      this.selectionData = data;
      this.isRecord = false;
      console.log(data, "handleSelectionChange");
    },
    handleSizeChange(turnPageShowNum) {
      this.isRecord = true;
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getPersonList();
    },
    handleCurrentChange() {
      this.isRecord = true;
      this.getPersonList();
    },
    delPersonTag(e) {
      const index = this.tableData.findIndex((item) => item.userNo == e.userNo);
      if (index == -1) {
        this.selectData = this.selectData.filter((it) => it.userNo != e.userNo);
      } else {
        this.$refs.tableRef.$refs.tableRef.toggleRowSelection(
          this.tableData[index],
          false
        );
      }
    },
    savePerson() {
      this.dialogVisible = false;
      this.$emit("checkPerson",this.selectData,"T2DDZ");
    },
    async getPersonList() {
      let brhIds = [];
      console.log(this.userInfo,"userInfo")
      brhIds.push(this.userInfo.custBrhId,this.userInfo.usrBrhId);
      const params = {
        currentPage:this.pager.currentPage,
        // pltfmFlg:this.systemId,
        roleShrtNm:this.roleShrtNm,
        turnPageShowNum:this.pager.turnPageShowNum,
        // type:"0",
        userMobile:this.formInline.userMobile,
        userName:this.formInline.userNo,
        userStt:"1",
        brhIds:brhIds
      };
      const res = await this.rpc.downloadDesign.getCustomerList(params);
      console.log(res,"res-------------")
      if(res.userList.length > 0){
        res.userList.map((item) =>{
          if(item.roleLists.length > 0){
            item.roleNameList = item.roleLists.map(m =>m.roleName).join(";")
          }
        })
      }
      this.tableData = JSON.parse(JSON.stringify(res.userList));
      this.pager.total = res.turnPageTotalNum;
      // this.tableData = res.roleList
      // this.pager.total = res.turnPageTotalNum;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.selectData.length > 0) {
        this.selectData.forEach((item) => {
          this.tableData.forEach((data) => {
            if (item.userNo == data.userNo) {
              this.isRecord = true;
              this.$refs.tablePersonRef.$refs.tableRef.toggleRowSelection(data);
            }
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.create_dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  ::v-deep .add_dialog_conf .el-form-item__label{
    width: 72px !important;
  }
  ::v-deep .add_dialog_conf .el-form .el-form-item .el-input{
    width: 90px !important;
  }
  .add_dialog_conf {
    padding: 15px 24px;
    .search_conf {
      padding: 0;
      margin: 0;
    }
    .show_conf {
      padding: 15px 24px;
      overflow: hidden;
      .show_conf_title {
        float: left;
        margin-right: 10px;
        font-family: $font_medium;
        span {
          color: #358aff;
        }
      }
      .show_conf_content {
        float: left;
      }
      .show_conf_tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
  .conf_dialog_conf {
    padding: 15px 24px;
    .search_conf {
      margin-bottom: 15px;
      .search_conf_f {
        width: 200px;
        ::v-deep .el-form-item__content {
          width: 100%;
        }
      }
      .search_conf_s {
        width: 90px;
      }
      .search_conf_btn {
        float: right;
      }
    }
  }
}
</style>
