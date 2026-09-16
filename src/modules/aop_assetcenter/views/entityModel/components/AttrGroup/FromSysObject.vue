<template>
  <div class="from-sys-object">
    <div class="objects-block">
      <div class="title-block">
        <span>映射库表对象</span>
      </div>
      <div class="search-input">
        <el-input
          placeholder="搜索"
          v-model="keyword"
          size="mini"
          clearable
          @clear="searchObject"
          @change="searchObject"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchObject"
          ></el-button>
        </el-input>
      </div>

      <div class="object-list">
        <div
          class="object-item"
          :class="{ active: selectObject && selectObject.objId === item.objId }"
          v-for="(item, index) in objectList"
          :key="index"
        >
          <el-checkbox
            v-model="item.checked"
            :indeterminate="item.isIndeterminate"
            @change="handleCheckboxChange($event, item)"
          ></el-checkbox>
          <div class="obj-name" @click="changeObject(item)">
            {{ item.objNm }}
          </div>
        </div>
      </div>
    </div>
    <div class="table-block">
      <div class="title-block">
        <span>选择字段</span>
      </div>
      <div class="info-block">
        <div class="search-form">
          <div class="left">
            <el-form ref="form" :model="searchForm" :inline="true" size="mini">
              <el-form-item label="关键字:">
                <el-input
                  v-model="searchForm.keyword"
                  placeholder="请输入"
                  clearable
                  @change="searchAttr"
                ></el-input>
              </el-form-item>
              <el-form-item label="字段类型:">
                <el-select
                  v-model="searchForm.fieldType"
                  placeholder="请选择字段类型"
                  clearable
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="item in fieldTypeOption"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="right">
            <el-button type="primary" size="small" @click="searchAttr"
              >查询</el-button
            >
            <el-button size="small" @click="reset">重置</el-button>
          </div>
        </div>

        <el-table
          :key="selectObject ? selectObject.objId : 'no-select'"
          :data="infoList"
          row-key="attrEngNm"
          v-loading="loading"
          style="width: 100%"
          :max-height="378"
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
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column prop="attrEngNm" label="字段简称">
            <template slot-scope="scope">
              {{ scope.row.attrEngNm || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="attrChiNm" label="字段名称">
            <template slot-scope="scope">
              {{ scope.row.attrChiNm || "/" }}
            </template>
          </el-table-column>

          <el-table-column prop="attrTpCd" label="字段类型">
            <template slot-scope="scope">
              {{ scope.row.attrTpCd || "/" }}
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click="viewAttr(scope.row)"
                type="text"
                size="mini"
                style="color: #358aff"
                >查看</el-button
              >
            </template>
          </el-table-column> -->
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
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  props: {
    ids: {
      type: Array,
      default: () => [],
    },
    origin: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      keyword: "",

      objectList: [],
      originalList: [],
      selectObject: null,

      searchForm: {
        keyword: "",
        fieldType: "",
      },
      fieldTypeOption: [],
      currentPage: 1,
      turnPageShowNum: 10,
      total: 0,
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
  watch: {
    origin: {
      immediate: true,
      handler(v) {
        this.resetChecked(v);
      },
    },
  },
  async mounted() {
    await this.getObjectList();
  },
  methods: {
    searchObject() {
      if (this.keyword.trim() === "") {
        this.objectList = this.originalList;
      } else {
        this.objectList = this.originalList.filter(
          (item) =>
            item.objNm.includes(this.keyword.trim()) ||
            item.objCd.includes(this.keyword.trim())
        );
      }
    },
    async changeObject(item) {
      console.log("item", item);
      this.selectObject = item;
      await this.reset();
    },
    async getObjectList() {
      if (this.ids.length === 0) {
        return;
      }
      const { l5SysBizObjectInfos } =
        await this.rpc.assetcenter.qrySysBizObjectInfoList({
          l5ObjIds: this.ids.map((i) => i.objId),
        });
      this.originalList = l5SysBizObjectInfos.map((item) => ({
        ...item,
        checked: false,
        isIndeterminate: false,
      }));
      this.objectList = [...this.originalList];
      this.selectObject = this.objectList.length ? this.objectList[0] : null;
      console.log("objectList", this.objectList);
      await this.reset();
    },
    async searchAttr() {
      this.loading = true;
      if (!this.selectObject) {
        this.loading = false;
        this.infoList = [];
        this.total = 0;
        return;
      }
      const { turnPageTotalNum, infoList } =
        await this.rpc.assetcenter.qrySysBizObjAttributeList({
          objIds: [this.selectObject.objId],
          fieldNm: this.searchForm.keyword,
          fieldType: this.searchForm.fieldType,
          currentPage: this.currentPage,
          pageSize: this.turnPageShowNum,
        });
      this.infoList = infoList;
      this.total = parseInt(turnPageTotalNum);
      this.loading = false;
      this.resetChecked(this.origin);
    },
    async reset() {
      this.searchForm = {
        keyword: "",
        fieldType: "",
      };
      this.currentPage = 1;
      this.total = 0;
      await this.searchAttr();
    },
    selectRow(selection, row) {
      if (this.isAdd(row, selection)) {
        this.$emit("changeSingle", row, "add");
      } else {
        this.$emit("changeSingle", row, "remove");
      }

      if (selection.length == 0) {
        this.objectList.forEach((item) => {
          if (item.objId === this.selectObject.objId) {
            item.checked = false;
            item.isIndeterminate = false;
          }
        });
      }
      if (selection.length == this.infoList.length) {
        this.objectList.forEach((item) => {
          if (item.objId === this.selectObject.objId) {
            item.checked = true;
            item.isIndeterminate = false;
          }
        });
      }
      if (selection.length > 0 && selection.length < this.infoList.length) {
        this.objectList.forEach((item) => {
          if (item.objId === this.selectObject.objId) {
            item.isIndeterminate = true;
          }
        });
      }
    },
    selectAll(selection) {
      if (selection.length == 0) {
        this.$emit("changeAll", this.infoList, "remove");
        this.objectList.forEach((item) => {
          if (item.objId === this.selectObject.objId) {
            item.checked = false;
            item.isIndeterminate = false;
          }
        });
      } else {
        this.$emit("changeAll", selection, "add");
        this.objectList.forEach((item) => {
          if (item.objId === this.selectObject.objId) {
            item.checked = true;
            item.isIndeterminate = false;
          }
        });
      }
    },
    handleSelectionChange(v) {
      this.selectedList = v;
    },
    toggleRow(row) {
      let _row = this.selectedList.filter((i) => i.attrEngNm == row.attrEngNm);
      if (_row.length) {
        this.$refs.infoList.toggleRowSelection(_row[0]);
        this.selectRow(this.selectedList, _row[0]);
      }
    },
    viewAttr(row) {
      //
    },
    async handleCurrentChange(v) {
      this.currentPage = v;
      await this.searchAttr();
    },
    isAdd(obj, array) {
      return (
        array.find((item) => item.attrEngNm === obj.attrEngNm) !== undefined
      );
    },
    resetChecked(v) {
      this.infoList.forEach((item) => {
        item.checked = v.some((orig) => orig.attrEngNm === item.attrEngNm);
      });
      this.$nextTick(() => {
        if (this.$refs.infoList) {
          this.infoList.forEach((row) => {
            this.$refs.infoList.toggleRowSelection(row, row.checked);
          });
        }
      });
    },
    async handleCheckboxChange(e, v) {
      const { infoList } = await this.rpc.assetcenter.qrySysBizObjAttributeList(
        {
          objIds: [v.objId],
          fieldNm: "",
          fieldType: "",
          currentPage: 1,
          pageSize: 999,
        }
      );
      if (e) {
        this.$emit("changeAll", infoList, "add");
      } else {
        this.$emit("changeAll", infoList, "remove");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/mixin.scss";
.from-sys-object {
  width: 100%;
  height: 540px;
  overflow: scroll;
  padding-bottom: 20px;
  @include flex(row, flex-start, center);
  .objects-block {
    width: 200px;
    height: 100%;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    @include flex(column, flex-start, center);
    .title-block {
      height: 30px;
      line-height: 30px;
      background: #f6f6f6;
      padding-left: 6px;
      font-weight: 600;
      width: 100%;
    }
    .search-input {
      padding: 6px;
    }
    .object-list {
      width: 100%;
      flex: 1;
      overflow: auto;
      padding: 0 6px;
      .object-item {
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        margin-bottom: 6px;
        padding: 0 6px;
        @include flex(row, flex-start, center);
        border-radius: 4px;
        .el-checkbox {
          margin-right: 6px;
          @include flex(column, center, center);
        }
        .obj-name {
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover {
          background: #f6f6f6;
        }
      }
      .active {
        background: #f6f6f6;
      }
    }
  }

  .table-block {
    flex: 1;
    height: 100%;
    margin-left: 12px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    @include flex(column, flex-start, center);
    .title-block {
      height: 30px;
      line-height: 30px;
      background: #f6f6f6;
      padding-left: 6px;
      font-weight: 600;
      width: 100%;
    }
    .info-block {
      flex: 1;
      width: 100%;
      overflow: auto;
      padding: 6px;
      .search-form {
        @include flex(row, space-between, flex-start);
        .left {
          flex: 1;
        }
        .right {
          @include flex(row, flex-end, center);
        }
      }
    }
  }
}
</style>

