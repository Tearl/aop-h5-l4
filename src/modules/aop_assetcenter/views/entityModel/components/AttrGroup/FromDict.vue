<template>
  <div class="attr-from-dict">
    <div class="search-form">
      <div class="left">
        <el-form ref="form" :model="searchForm" :inline="true" size="mini">
          <el-form-item label="关键字:">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="字段类型:">
            <el-select
              v-model="searchForm.fieldType"
              placeholder="请选择字段类型"
              clearable
              @change="changeType"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in fieldTypeOption"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="精准查询:">
            <el-switch v-model="searchForm.likeFlag"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </div>

    <p style="margin-bottom: 12px">
      <el-button type="primary" size="small" @click="newAttr"
        >新增字段</el-button
      >
    </p>
    <el-table
      :data="infoList"
      row-key="fieldKeyName"
      v-loading="loading"
      style="width: 100%"
      ref="infoList"
      size="small"
      align="center"
      :stripe="false"
      border
      :header-cell-style="{
        background: '#F5F5F8',
        color: '#333',
      }"
      @select="selectRow"
      @select-all="selectAll"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true">
      </el-table-column>
      <el-table-column prop="fieldKeyName" label="字段简称">
        <template slot-scope="scope">
          {{ scope.row.fieldKeyName || "/" }}
        </template>
      </el-table-column>
      <el-table-column prop="fieldName" label="字段名称">
        <template slot-scope="scope">
          {{ scope.row.fieldName || "/" }}
        </template>
      </el-table-column>

      <el-table-column prop="fieldBusiness" label="业务定义">
        <template slot-scope="scope">
          {{ scope.row.fieldBusiness || "/" }}
        </template>
      </el-table-column>
      <el-table-column prop="fieldRule" label="业务规则">
        <template slot-scope="scope">
          {{ scope.row.fieldRule || "/" }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="total"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],

  data() {
    return {
      searchForm: {
        keyword: "",
        fieldType: "",
        likeFlag: false,
      },
      fieldTypeOption: [],
      currentPage: 1,
      turnPageShowNum: 10,
      total: 0,
      loading: false,

      infoList: [],
      selectedList: [],
    };
  },
  created() {
    this.fieldTypeOption = [
      "String",
      "Short",
      "Integer",
      "Long",
      "Float",
      "Double",
      "BigDecimal",
      "Byte",
      "Character",
      "File",
      "Date",
      "LocalDate",
      "LocalTime",
      "LocalDateTime",
      "Boolean",
    ].map((i) => {
      return {
        label: i,
        value: i,
      };
    });
  },
  async mounted() {
    await this.reset();
  },
  methods: {
    async search() {
      await this.dataDictionaryFieldListQuery();
    },
    async reset() {
      this.searchForm.likeFlag = false;
      this.searchForm.fieldType = "";
      this.searchForm.keyword = "";
      this.currentPage = 1;
      this.turnPageShowNum = 10;
      await this.search();
    },
    async handleCurrentChange(v) {
      this.currentPage = v;
      await this.search();
    },
    async dataDictionaryFieldListQuery() {
      this.loading = true;
      const { dictionaryFiledLists, turnPageTotalNum } =
        await this.rpc.assetcenter.dataDictionaryFieldListQuery({
          queryType: "3",
          likeFlag: this.searchForm.likeFlag ? "0" : "1",
          fieldType: this.searchForm.fieldType,
          fieldName: this.searchForm.keyword,
          currentPage: this.currentPage,
          turnPageShowNum: this.turnPageShowNum,
          fieldFlag: "2",
        });
      this.total = turnPageTotalNum;
      this.infoList = dictionaryFiledLists;
      this.loading = false;
    },
    selectRow(selection, row) {
      if (this.isAdd(row, selection)) {
        this.$emit("changeSingle", row, "add");
      } else {
        this.$emit("changeSingle", row, "remove");
      }
    },
    selectAll(selection) {
      if (selection.length == 0) {
        this.$emit("changeAll", this.infoList, "remove");
      } else {
        this.$emit("changeAll", selection, "add");
      }
    },
    handleSelectionChange(v) {
      this.selectedList = v;
    },
    toggleRow(row) {
      let _row = this.selectedList.filter((i) => i.fieldKeyName == row.attrEngNm);
      if (_row.length) {
        this.$refs.infoList.toggleRowSelection(_row[0]);
      }
    },
    newAttr() {
      window.open(
        "/aop-h5/#/aop_tradedesign/datadict/dataFieldManage",
        "_blank"
      );
    },
    isAdd(obj, array) {
      return array.find((item) => item.dictryId === obj.dictryId) !== undefined;
    },
    async changeType() {
      this.currentPage = 1;
      await this.search();
    },
  },
};
</script>

<style lang="scss" scoped>
.attr-from-dict {
  height: 540px;
  overflow: scroll;
  padding-bottom: 20px;
  .search-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 12px;
    .left {
      flex: 1;
    }
    .right {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .selected-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    .num {
      font-weight: bold;
    }
    .list-block {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      flex: 1;
      .el-tag {
        margin-right: 6px;
        margin-bottom: 6px;
      }
    }
  }

  /deep/.el-pagination {
    padding: 0 !important;
    margin: 12px 0;
    text-align: right;
    .btn-next {
      margin-right: 0;
    }
  }
}
</style>

