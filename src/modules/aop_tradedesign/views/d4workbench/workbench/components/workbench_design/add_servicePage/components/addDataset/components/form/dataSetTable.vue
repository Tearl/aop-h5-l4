<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_base_info">
    <!-- <div class="header_title">数据项维护</div> -->
    <div class="content">
      <div class="header">
        <div class="header_title">分段列表</div>
        <div class="btn_sub">
          <el-button icon="el-icon-plus" type="primary" @click="openSub"
            >新增分段</el-button
          >
        </div>
      </div>

      <!-- <TableHeader :btnList="btnListSub" @btnClick="handleBtnSubClik"></TableHeader> -->
      <el-table
        ref="table"
        stripe
        fit
        highlight-current-row
        :data="tableData"
        style="width: 100%"
        class="table_expand"
        :expand-row-keys="expandKeys"
        row-key="dataSubstnNo"
        @expand-change="handleExpandChange"
        @cell-click="expandChangeFn"
      >
        <el-table-column type="expand" width="25">
          <template slot-scope="{ row }" v-if="row.fieldList">
            <!-- <TableHeader title="分段名称-数据字段" :btnList="btnList" @btnClick="handleBtnClik"></TableHeader> -->
            <!-- <div class="table_op">
              <div class="header_title">分段名称-数据字段</div>
              <div class="btn">
                <el-button type="primary" size="small" @click="openField(row)"
                  >新增字段</el-button
                >
              </div>
            </div> -->
            <el-table
              ref="myChildTable"
              :data="row.fieldList"
              :show-header="true"
              tooltip-effect="dark"
              style="width: 100%"
              class="table_child tc"
            >
              <!-- <el-table-column width="80" label="序号" prop="moduleNumber">
              </el-table-column> -->
              <el-table-column
                min-width="290"
                label="英文名称"
                prop="dictNo"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                min-width="120"
                label="字段名称"
                prop="dictNm"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span class="text" @click.stop="fieldDetail(scope.row)">{{
                    scope.row.dictNm
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="120"
                label="字段描述"
                prop="dataDesc"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <!-- <el-table-column
                min-width="120"
                label="字段描述"
                prop="dictNm"
                :show-overflow-tooltip="true"
              ></el-table-column> -->
              <el-table-column
                label="状态"
                prop="statusCd"
                align="center"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span :class="getColor(scope.row.statusCd)" class="status">{{
                    dataObj[scope.row.statusCd]
                  }}</span>
                  <!-- <el-tag
                    :type="
                      scope.row.statusCd == '0'
                        ? 'danger'
                        : scope.row.statusCd == '1'
                        ? 'warning'
                        : 'success'
                    "
                    >{{
                      scope.row.statusCd == "0"
                        ? "新增"
                        : scope.row.statusCd == "1"
                        ? "变更"
                        : "已登记"
                    }}</el-tag
                  > -->
                </template>
              </el-table-column>
              <el-table-column
                min-width="120"
                label="创建时间"
                prop="crtTm"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.crtTm | crtTm_yyyyMMddhhmmss }}</span>
                </template>
              </el-table-column>
              <el-table-column width="170" label="操作">
                <template slot-scope="check">
                  <span  v-if="check.row.statusCd == '0'">
                    <!-- <span class="blue mr5 pointer" @click.stop="operateEdit('field', check.row)">编辑</span> -->
                    <span class="blue mr5 pointer" @click.stop="operateFn('field', check.row)">删除</span>
                  </span>
                  <span v-else>/</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="分段编号"
          prop="dataSubstnNo"
          align="center"
          min-width="240"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="分段名称"
          prop="dataSubstnNm"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span class="text" @click.stop="gotoSubDetail(scope.row)">{{
              scope.row.dataSubstnNm
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="定义分段"
          prop="dataSubstnNm"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="分段关系"
          prop="dataSubstnAttr"
          align="center"
          min-width="170"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ relationObj[scope.row.dataSubstnAttr] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="statusCd"
          align="center"
          min-width="120"
        >
          <template slot-scope="scope">
            <!-- <el-tag :type="scope.row.statusCd == '0' ? 'danger' : scope.row.statusCd == '1'? 'warning':'success'">{{
              scope.row.statusCd == "0" ? "新增" :scope.row.statusCd == '1'?"变更": "已登记"
            }}</el-tag> -->
            <span :class="getColor(scope.row.statusCd)" class="status">{{
              dataObj[scope.row.statusCd]
            }}</span>
            <!-- <span class="add" v-if="scope.row.statusCd == '0'">{{dataObj[scope.row.statusCd]}}</span> -->
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="crtTm"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.crtTm | crtTm_yyyyMMddhhmmss }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="170">
          <template #default="scope">
            <!-- <template slot-scope="check"> -->
            <span class="blue mr5 pointer" @click.stop="openField(scope.row)"
              >新增字段</span
            >
            <!-- <span
              class="blue mr5 pointer"
              v-if="scope.row.statusCd == '0'"
              @click.stop="operateEdit('sub', scope.row)"
              >编辑</span
            > -->
            <span
              class="blue mr5 pointer"
              v-if="scope.row.statusCd == '0'"
              @click.stop="operateFn('sub', scope.row)"
              >删除</span
            >
            <!-- </template> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddSub
      ref="addSubRef"
      :infoData="infoData"
      @confirmSub="confirmSub"
    ></AddSub>
    <AddField
      ref="addFieldRef"
      :datasetInfo="infoData"
      :subObj="fieldObj"
      @confirmField="confirmField"
    ></AddField>
    <SubDetail ref="subDetailRef" @fieldDetail="fieldDetail"></SubDetail>
    <FieldDetail ref="fieldDetailRef"></FieldDetail>
    <EditSub ref="editSubRef" @confirmSub="confirmSub" :infoData="infoData"></EditSub>
    <EditField ref=editFieldRef :datasetInfo="infoData" :subObj="fieldObj" @confirmField="confirmField"></EditField>
    
    <!-- 从元数据选择 -->
    <UserDefinedParams
      ref="userDefinedRef"
      @saveParams="confirmField"
    ></UserDefinedParams>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import TableHeader from "@m/core/components/page_table_header";
import AddField from "../dialog/addField";
import AddSub from "../dialog/addSub";
import SubDetail from "../dialog/subDetail";
import FieldDetail from "../dialog/fieldDetail";
import EditSub from "../dialog/editSub";
import EditField from "../dialog/editField";
import UserDefinedParams from "../dialog/addUserDefined";

export default {
  mixins: [mixin],
  components: {
    TableHeader,
    AddSub,
    AddField,
    SubDetail,
    FieldDetail,
    EditSub,
    EditField,
    UserDefinedParams
  },
  props: {
    type: {
      type: String,
      default: "read",
    },
    infoData: {
      type: Object,
      default: {},
    },
  },
  computed: {},
  data() {
    return {
      dataSetForm: {
        dataSetNm: "",
        dataSetDesc: "",
        classifyId: "",
        beltLine: "",
      },
      rules: {
        dataSetNm: [
          { required: true, trigger: "blur", message: "请输入数据集名称" },
        ],
        beltLine: [{ required: true, trigger: "blur", message: "请选择部" }],
        classifyId: [{ required: true, trigger: "blur", message: "请选择册" }],
      },
      //所属部下拉框
      departmentList: [
        { value: "0", label: "对公" },
        { value: "1", label: "对私" },
        { value: "2", label: "营销" },
      ],
      relationObj: {
        "01": "1:1",
        "02": "1:N",
      },
      //所属册下拉框
      volumeList: [
        { name: "1", label: "C1 用户册" },
        { name: "2", label: "P1 机构册" },
        { name: "3", label: "C2 渠道册" },
        { name: "4", label: "P2 产品册" },
        { name: "5", label: "C3 合约册" },
        { name: "6", label: "S 系统册" },
      ],
      //按钮列表
      btnListSub: [
        {
          name: "新增分段",
          value: "addSub",
          type: "primary",
          imgSrc: "",
          iconClass: "",
        },
      ],
      btnList1: [
        {
          name: "新增字段",
          value: "addSub",
          type: "primary",
          imgSrc: "",
          iconClass: "",
        },
      ],
      tableData: [],
      expandKeys: [],
      fieldObj: {},
      dataObj: {
        0: "新增",
        1: "已登记",
        2: "变更",
      },
      isChildren: false,
      useL5:false,
      tempList:[]
    };
  },
  mounted() {
    // this.init();
  },
  methods: {
    init() {
      this.tempList = new Map();
      this.getSubList();
    },
    openSub() {
      // console.log("openSub");
      this.$refs.addSubRef.showDialog();
    },
    openField(e) {
      this.fieldObj = e;
      e.dataSetNm = this.infoData.dataSetNm
      console.log(e, "openField",this.infoData.dataSetNo,this.infoData);
      this.$nextTick(() => {
        // 从元数据选择
        this.$refs.userDefinedRef.showDialog(e);
        // this.$refs.addFieldRef.showFiledDialog(e);
      });
    },
    getColor(color) {
      if (color == "0") {
        return "add";
      } else if (color == "1") {
        return "register";
      } else {
        return "other";
      }
    },
    operateFn(e, data) {
      console.log(e, data, "删除");
      if (e == "field") {
        this.delField(data);
      } else if (e == "sub") {
        this.delSub(data);
      }
    },
    async delSub(data) {
      let isChildren = await this.getFiledDel(data);
      // console.log(isChildren, "isChildren", data.fieldList.length > 0);
      if ((data.fieldList && data.fieldList.length > 0) || !isChildren) {
        return this.$message.error("当前分段下有字段不能删除该分段");
        // console.log("有子类")
      } else {
        this.$confirm("是否删除该分段").then(async () => {
          const params = {
            dataSubstnNo: data.dataSubstnNo,
          };
          const res = await this.rpc.dicmgmt.delSubStn(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getSubList();
        });
        // this.expandKeys = this.tempList.filter(item =>item !== data.dataSubstnNo) ;
        this.expandKeys = this.expandKeys.filter(item =>item !== data.dataSubstnNo)
        if(this.tempList.has(data.dataSubstnNo)){
          this.tempList.delete(data.dataSubstnNo)
        }
        console.log("删除==》",this.expandKeys)
        // console.log("无子类")
      }
    },
    async delField(data) {
      let delFiled = await this.checkSerUser(data);
      console.log("delFiled",delFiled)
      let titleDel = delFiled ? "该字段已被L5服务使用，是否删除该字段":"该字段未被L5服务使用，是否删除该字段"
      this.$confirm(`${titleDel}`).then(async () => {
        const params = {
          dataSetDataId: data.dataSetDataId,
        };
        const res = await this.rpc.dicmgmt.delMyField(params);
        this.$notify({
          title: "成功",
          message: "删除成功",
          duration: 2000,
          type: "success",
        });
        // this.getSubList();
        this.getFiledList(data);
        // this.getFieldList();
      });
    },
    async checkSerUser(data){
      const params = {
        dataSetDataId: data.dataSetDataId,
      };
      const res = await this.rpc.downloadDesign.checkSerUser(params);
      // console.log(res,'res');
      if(res.checkResult == "0"){
        return false
      }else{
        return true
      }
    },
    async getFiledDel(data) {
      const params = {
        dataSubstnNo: data.dataSubstnNo,
        turnPageShowNum: "9999",
      };
      const res = await this.rpc.dicmgmt.getMyFieldList(params);
      if (
        res.dataSetDataRelationList &&
        res.dataSetDataRelationList.length > 0
      ) {
        return false;
        // this.isChildren = false;
      } else {
        // this.isChildren = true;
        return true;
      }
    },
    async getSubList() {
      const params = {
        dataSetNo: this.infoData.dataSetNo,
        turnPageShowNum: "9999",
      };
      const res = await this.rpc.dicmgmt.getSubStnList(params);
      if (res.dataSubsectionList.length > 0) {
        res.dataSubsectionList.map((item) => {
          item.fieldList = [];
          item.expand = false;
        });
      }

      this.tableData = res.dataSubsectionList;
      this.tableData.map((item,index) =>{
        if(this.tempList.has(item.dataSubstnNo)){
          item.fieldList = this.tempList.get(item.dataSubstnNo)
        }
      })
    },
    async handleExpandChange(data, arr) {
      let flagData = arr.some(item =>item.dataSubstnNo == data.dataSubstnNo)
      if(flagData){
          const params = {
          dataSubstnNo: data.dataSubstnNo,
          turnPageShowNum: "9999",
        };
        const res = await this.rpc.dicmgmt.getMyFieldList(params);
        // this.tempList.set(data.dataSubstnNo,res.dataSetDataRelationList)
        this.expandKeys.push(data.dataSubstnNo);
        data.fieldList = res.dataSetDataRelationList;
      }else{
        this.expandKeys = arr.map((item) =>item.dataSubstnNo)
      }
      if(arr.length > 0){
        arr.map((item) =>{
          if(!this.tempList.has(item.dataSubstnNo)){
            this.tempList.set(item.dataSubstnNo,item.fieldList)
          }
        })
        this.expandKeys = this.expandKeys.filter((item,index) => this.expandKeys.indexOf(item) === index )
        // console.log(this.tempList,"345")
        // console.log(this.expandKeys,"5555")
      }else{
        this.expandKeys.length = 0;
        // console.log(this.expandKeys,"3333")
      }
      this.expandKeys = this.expandKeys.filter((item,index) => this.expandKeys.indexOf(item) === index )
    },
    async getFiledList(data) {
      const params = {
        dataSubstnNo: data.dataSubstnNo,
        turnPageShowNum: "9999",
      };
      const res = await this.rpc.dicmgmt.getMyFieldList(params);
      this.$nextTick(() => {
        this.tableData.map((item, index) => {
          if (data.dataSubstnNo == item.dataSubstnNo) {
            this.tableData[index].fieldList = res.dataSetDataRelationList;
            // if(this.tempList.has(data.dataSubstnNo)){
              this.tempList.set(data.dataSubstnNo,res.dataSetDataRelationList)
            // }
          }
        });
      });

      data.fieldList = res.dataSetDataRelationList;
    },
    expandChangeFn() {},
    confirmSub() {
      this.getSubList();
    },
    saveParams(data) {
      let tempData = data
      this.confirmField(tempData)
    },
    confirmField(dataObj) {
      let fieldsObj ={}
      console.log("确定后",dataObj)
      if(dataObj.dataSubstnNo == this.fieldObj.dataSubstnNo){
        Object.assign(fieldsObj,this.fieldObj)
        this.expandKeys.push(this.fieldObj.dataSubstnNo)
      }else{
        Object.assign(fieldsObj,dataObj)
        this.expandKeys.push(dataObj.dataSubstnNo)
      }
      this.expandKeys = this.expandKeys.filter((item,index) => this.expandKeys.indexOf(item) === index )
      this.getFiledList(fieldsObj);
    },
    gotoSubDetail(data) {
      // console.log("跳转分段详情");
      this.$refs.subDetailRef.showDialog(data);
    },
    fieldDetail(data) {
      this.$refs.fieldDetailRef.showDialog(data);
    },
    operateEdit(type,data){
      console.log(type,data,"operateEdit")
      if(type == "sub"){
        this.$refs.editSubRef.showDialog(data)
      }else{
        this.$refs.editFieldRef.showFiledDialog(data)
      }
    }

  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_data_set_form_base_info {
  ::v-deep .status {
    display: inline-block;
    text-align: center;
    height: 20px;
    line-height: 20px;
    padding: 0 4px;
    &.add {
      color: #ff5f5f;
      border: 0.1px solid #fe4758;
      // background: #ffefee;
    }
    &.register {
      color: #36d542;
      border: 0.1px solid #36d542;
    }
    &.other {
      color: #ff9104;
      border: 0.1px solid #fe4758;
    }
  }
  //重置table样式 解决fixed列错行
  /deep/.define_table {
    .el-table {
      th.el-table__cell {
        height: 48px;
      }
      .el-table__cell {
        .cell {
          line-height: 20px;
        }
      }
    }
  }
  //table 有展开箭头的列
  /deep/.table_expand {
    th,
    td {
      border-width: 1px 0;
    }
    th {
      color: #333333;
      // background-color: #fafafc;
      background-color: #f5f5f8;
      font-size: 14px !important;
      font-family: PingFangSC-Medium;
    }
    .text {
      color: #358aff;
      cursor: pointer;
    }
    .el-table__expand-column {
      border: 0;
      width: 20px;
      .cell {
        padding-right: 0;
      }
    }
    .el-table__header th:nth-child(2) {
      padding-right: 25px;
      text-align: center;
    }
    .icon_down {
      transition: all 0.1s;
    }
    .expanded {
      .icon_down {
        transform: rotate(180deg);
      }
    }
  }
  /deep/.table_expand_box {
    // position: relative;
    // padding-left: 12px;
    // .el-icon-caret-right {
    //   position: absolute;
    //   top: 1px;
    //   left: -5px;
    // }
  }
  /deep/ .el-table__row.expanded {
    .el-icon-caret-right {
      transform: rotate(90deg);
    }
  }
  //自定义 table extend
  /deep/.el-table__cell.el-table__expanded-cell {
    padding: 0;
  }
  /deep/.table_extend_header {
    height: 40px;
    line-height: 40px;
    background: #ebeef5;
    text-align: center;
  }
  /deep/.table_extend_body {
    padding: 12px 0;
    text-align: center;
  }
  /deep/.row-expand-cover {
    .el-table__expand-icon {
      display: none;
    }
  }
  /deep/.el-table.table_child:not(.table_child_border) {
    //子table
    .el-table__header-wrapper th,
    .el-table__fixed-header-wrapper th {
      background: #f5f5f8 !important;
      padding: 8px 0;
      // font-weight: normal;
      // color: #666;
      border-width: 0 0 1px;
      color: #333333;
      font-size: 12px !important;
      font-family: PingFangSC-Medium;
    }
    .el-table__body-wrapper td {
      color: #666;
      border-width: 0 0 1px;
    }
  }
  /deep/.table_child.tc th,
  /deep/.table_child.tc td {
    text-align: center;
  }
  .status_span {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    letter-spacing: 0;
    padding: 4px 16px;
    margin-left: 12px;
  }
  .status_0 {
    color: #ff5f5f;
    background: #ffefee;
  }
  .status_1 {
    color: #36d542;
    background: #e5ffe7;
  }
  .status_2 {
    color: #ff9104;
    background: #fff4e5;
  }
  .table_op {
    margin: 10px 0px;
    display: flex;
    justify-content: space-between;
  }

  .blue {
    color: #358aff;
  }
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #000000;
      letter-spacing: 0;
    }
  }
  .pointer {
    cursor: pointer;
  }
  .mr5 {
    margin-right: 5px;
  }
}
</style>