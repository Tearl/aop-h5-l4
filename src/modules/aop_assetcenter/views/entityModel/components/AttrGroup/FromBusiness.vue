<template>
  <div class="from-business" v-loading="objLoading">
    <div class="objects-block">
      <div class="title-block">
        <span>业务对象列表</span>
      </div>
      <div class="select-entry">
        <el-select
          v-model="bizDomainNo"
          placeholder="请选择业务域"
          size="mini"
          @change="changeBizDomain"
        >
          <el-option
            :label="item.bizDomainName"
            :value="item.bizDomainNo"
            v-for="item in bizDomainList"
            :key="item.bizDomainNo"
          ></el-option>
        </el-select>
        <el-select
          v-model="projectId"
          placeholder="请选择中心"
          size="mini"
          @change="changeCenter"
        >
          <el-option
            :label="item.projectNm"
            :value="item.projectId"
            v-for="item in centerList"
            :key="item.projectId"
          ></el-option>
        </el-select>
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
            {{ item.objName }}
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
          row-key="dictryNo"
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
          <el-table-column prop="dictryNo" label="字段简称">
            <template slot-scope="scope">
              {{ scope.row.dictryNo || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="dictryName" label="字段名称">
            <template slot-scope="scope">
              {{ scope.row.dictryName || "/" }}
            </template>
          </el-table-column>

          <el-table-column prop="dictryType" label="字段类型">
            <template slot-scope="scope">
              {{ scope.row.dictryType || "/" }}
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
  name: "FromBusiness",
  mixins: [mixin],
  props: {
    origin: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      objLoading: false,
      bizDomainList: [{ bizDomainNo: "", bizDomainName: "全部" }],
      centerList: [{ projectId: "", projectNm: "全部" }],
      bizDomainNo: "",
      projectId: "",

      keyword: "",
      objectList: [],
      originalList: [],
      selectObject: null,

      searchForm: {
        keyword: "",
        fieldType: "",
      },

      loading: false,
      fieldTypeOption: [],
      currentPage: 1,
      turnPageShowNum: 10,
      total: 0,
      infoList: [],

      selectedList: [],

      allObjectList: [],
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
    await this.queryBizDomainList();
    await this.qryBizObjectBaseList();
    this.allObjectList = JSON.parse(JSON.stringify(this.originalList));
  },
  methods: {
    async handleCheckboxChange(e, v) {
      const { infoList } = await this.rpc.assetcenter.qryBizObjAbePageByObjId({
        objId: v.objId,
        fieldNm: "",
        fieldType: "",
        currentPage: 1,
        turnPageShowNum: 999,
      });
      if (e) {
        this.$emit("changeAll", infoList, "add");
        this.allObjectList.forEach((i) => {
          if (i.objId === v.objId) {
            i.checked = true;
            i.isIndeterminate = false;
          }
        });
      } else {
        this.$emit("changeAll", infoList, "remove");
        this.allObjectList.forEach((i) => {
          if (i.objId === v.objId) {
            i.checked = false;
            i.isIndeterminate = false;
          }
        });
      }
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
            this.allObjectList.forEach((i) => {
              if (i.objId === this.selectObject.objId) {
                i.checked = false;
                i.isIndeterminate = false;
              }
            });
          }
        });
      }
      if (selection.length == this.infoList.length) {
        this.objectList.forEach((item) => {
          if (item.objId === this.selectObject.objId) {
            item.checked = true;
            item.isIndeterminate = false;
            this.allObjectList.forEach((i) => {
              if (i.objId === this.selectObject.objId) {
                i.checked = true;
                i.isIndeterminate = false;
              }
            });
          }
        });
      }
      if (selection.length > 0 && selection.length < this.infoList.length) {
        this.objectList.forEach((item) => {
          if (item.objId === this.selectObject.objId) {
            item.isIndeterminate = true;
            item.checked = false;
            this.allObjectList.forEach((i) => {
              if (i.objId === this.selectObject.objId) {
                i.isIndeterminate = true;
                i.checked = false;
              }
            });
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
            this.allObjectList.forEach((i) => {
              if (i.objId === this.selectObject.objId) {
                i.checked = false;
                i.isIndeterminate = false;
              }
            });
          }
        });
      } else {
        this.$emit("changeAll", selection, "add");
        this.objectList.forEach((item) => {
          if (item.objId === this.selectObject.objId) {
            item.checked = true;
            item.isIndeterminate = false;
            this.allObjectList.forEach((i) => {
              if (i.objId === this.selectObject.objId) {
                i.checked = true;
                i.isIndeterminate = false;
              }
            });
          }
        });
      }
    },
    resetChecked(v) {
      this.infoList.forEach((item) => {
        item.checked = v.some((orig) => orig.attrEngNm === item.dictryNo);
      });
      this.$nextTick(() => {
        if (this.$refs.infoList) {
          this.infoList.forEach((row) => {
            this.$refs.infoList.toggleRowSelection(row, row.checked);
          });
        }
      });
    },
    handleSelectionChange(v) {
      this.selectedList = v;
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
        await this.rpc.assetcenter.qryBizObjAbePageByObjId({
          objId: this.selectObject.objId,
          fieldNm: this.searchForm.keyword,
          fieldType: this.searchForm.fieldType,
          currentPage: this.currentPage,
          turnPageShowNum: this.turnPageShowNum,
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
    async queryBizDomainList() {
      const { businessDomainLists } =
        await this.rpc.assetcenter.queryBizDomainList();
      this.bizDomainList = this.bizDomainList.concat(businessDomainLists);
    },
    async changeBizDomain() {
      this.projectId = "";
      await this.queryCenterList();
      await this.qryBizObjectBaseList();
    },
    async queryCenterList() {
      this.centerList = [{ projectId: "", projectNm: "全部" }];
      if (!this.bizDomainNo) return;
      const { queryAppAndBlgClsInfoList } =
        await this.rpc.assetcenter.queryOwnL5ProjectPageList({
          bizDomainNo: this.bizDomainNo,
          currentPage: 1,
          turnPageShowNum: 1000,
        });
      this.centerList = this.centerList.concat(queryAppAndBlgClsInfoList);
    },
    async changeCenter() {
      // 查业务列表
      await this.qryBizObjectBaseList();
    },
    async qryBizObjectBaseList() {
      this.objLoading = true;
      const { infoList } = await this.rpc.assetcenter.qryBizObjectBaseList({
        applicationNo: this.projectId,
        bizDomainNo: this.bizDomainNo,
      });
      let _step = [...this.allObjectList];

      this.objectList = infoList.map((item) => {
        return {
          ...item,
          checked: _step.some((i) => i.objId === item.objId && i.checked),
          isIndeterminate: _step.some(
            (i) => i.objId === item.objId && i.isIndeterminate
          ),
        };
      });
      this.objLoading = false;
      this.originalList = [...this.objectList];
      this.selectObject = this.objectList.length ? this.objectList[0] : null;
      await this.reset();
    },
    searchObject() {
      if (this.keyword.trim() === "") {
        this.objectList = [...this.originalList];
      } else {
        this.objectList = this.originalList.filter((item) =>
          item.objName.includes(this.keyword.trim())
        );
      }
    },
    async changeObject(item) {
      this.selectObject = item;
      await this.reset();
    },
    async handleCurrentChange(val) {
      this.currentPage = val;
      await this.searchAttr();
    },
    isAdd(obj, array) {
      return array.find((item) => item.dictryNo === obj.dictryNo) !== undefined;
    },
    viewAttr(row) {},
    toggleRow(row) {
      let _row = this.selectedList.filter((i) => i.dictryNo == row.attrEngNm);
      if (_row.length) {
        this.$refs.infoList.toggleRowSelection(_row[0]);
        this.selectRow(this.selectedList, _row[0]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/mixin.scss";
.from-business {
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
    .select-entry {
      width: 100%;
      padding: 6px 6px 0 6px;
      @include flex(row, flex-start, center);
      // 第一个选择框间距
      .el-select:first-child {
        margin-right: 6px;
      }
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

