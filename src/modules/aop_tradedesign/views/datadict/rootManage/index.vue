<template>
  <div class="datadict_root_manage">
    <div class="table_content">
      <!-- 表格查询 -->
      <div class="search">
        <div class="form">
          <el-form size="small" :model="formData" inline="true" ref="form">
            <el-form-item label="词根名称/简称/全称：" label-width="160px">
              <el-input
                v-model="formData.rootName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="词根类别：" label-width="120px">
              <el-select
                placeholder="请选择词根类别"
                v-model="formData.rootType"
                clearable
                class="w150p"
              >
                <el-option label="基本词" value="01"></el-option>
                <el-option label="类词" value="02"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="类别阈值："
              label-width="120px"
              v-if="formData.rootType == '02'"
            >
              <el-select
                placeholder="请选择类别阈值"
                v-model="formData.rootTypeThreshold"
                clearable
                class="w150p"
              >
                <el-option
                  v-for="(item, index) in mapRootTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="词根来源："
              :label-width="formData.rootType == '02' ? '160px' : '120px'"
            >
              <el-select
                v-model="formData.rootSource"
                placeholder="请选择词根来源"
                clearable
              >
                <el-option
                  v-for="(item, index) in rootSourceList"
                  :label="item.value"
                  :value="item.key"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="创建人："
              props="createUserName"
              :label-width="formData.rootType == '02' ? '120px' : '160px'"
            >
              <el-input
                class="w150p"
                v-model="formData.createUserName"
                placeholder="请输入"
                clearable
                maxlength="30"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="创建时间："
              size="mini"
              :label-width="formData.rootType == '02' ? '160px' : '120px'"
            >
              <el-date-picker
                v-model="formData.beginTime"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 180px"
                placeholder="开始时间"
              >
              </el-date-picker>
              至
              <el-date-picker
                v-model="formData.endTime"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 180px"
                placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">
          <el-button type="primary" size="small" @click="search"
            >查询</el-button
          >
          <el-button size="small" plain @click="reset">重置</el-button>
        </div>
      </div>

      <div class="table_box">
        <div class="table_box_operate">
          <el-button
            @click="doOperate('add')"
            size="medium"
            icon="el-icon-plus"
            type="primary"
            >新建词根</el-button
          >
        </div>
      </div>
      <div class="table">
        <el-table :data="list" :height="scrollHeight">
          <el-table-column prop="rootName" label="词根名称">
            <template slot-scope="scope">
              <span>{{ scope.row.rootName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rootFullName" min-width="120px" label="全称">
            <template slot-scope="scope">
              <span>{{ scope.row.rootFullName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rootShortName" label="简称" min-width="80px">
            <template slot-scope="scope">
              <span>{{ scope.row.rootShortName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rootType" label="词根类别" min-width="80px">
            <template slot-scope="scope">
              <span>{{ rootTypeMaps[scope.row.rootType] || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="rootTypeThreshold"
            label="类词域值"
            min-width="80px"
          >
            <template slot-scope="scope">
              <span>{{
                rootTypeThresholdMaps[scope.row.rootTypeThreshold] || "/"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rootSource" label="词根来源" min-width="80px">
            <template slot-scope="scope">
              <span>{{ scope.row.rootSource || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createUserName"
            label="创建人"
            min-width="80px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createUserName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120px">
            <template slot-scope="scope">
              <span class="link" @click="doOperate('look', scope.row)"
                >查看</span
              >
              <el-divider direction="vertical"></el-divider>
              <span class="link" @click="doOperate('edit', scope.row)"
                >编辑</span
              >
              <el-divider direction="vertical"></el-divider>
              <span class="color-red" @click="doOperate('delete', scope.row)"
                >删除</span
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="footer" v-if="list.length">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="turnPageShowNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="turnPageTotalNum"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <handleWordRoots ref="handleWordRoots" @success="output" />
    <rootDetailDrawer
      v-if="rootDetailDrawerVisible"
      v-model="rootDetailDrawerVisible"
      :rootId="rootId"
    />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import handleWordRoots from "@m/views/datadict/components/manageControl/handleWordRoots";
import rootDetailDrawer from "./components/RootDetailDrawer";
import { rootTypeOption, rootTypeThresholdOption } from "@m/utils/commonData";
export default {
  mixins: [mixin],
  components: {
    handleWordRoots,
    rootDetailDrawer,
  },
  data() {
    return {
      formData: {
        rootName: "",
        rootType: "",
        rootSource: "",
        rootTypeThreshold: "",
        createUserName: "",
        beginTime: "",
        endTime: "",
      },
      list: [],
      currentPage: 1,
      turnPageShowNum: 10,
      turnPageTotalNum: 0,
      // 词根类别
      rootTypeOption: [],
      rootTypeMaps: {
        "01": "基本词",
        "02": "类词",
      },
      mapRootTypeList: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "编码类",
          value: "01",
        },
        {
          label: "数值类",
          value: "02",
        },
        {
          label: "文本类",
          value: "03",
        },
        {
          label: "比例类",
          value: "04",
        },
        {
          label: "代码类",
          value: "05",
        },
        {
          label: "金额类",
          value: "06",
        },
        {
          label: "日期类",
          value: "07",
        },
        {
          label: "标志类",
          value: "08",
        },
        {
          label: "时间类",
          value: "09",
        },
        {
          label: "日期时间类",
          value: "10",
        },
      ],
      // 类别阈值
      rootTypeThresholdOption: [],
      rootTypeThresholdMaps: {
        "01": "编码类",
        "02": "数值类",
        "03": "文本类",
        "04": "比例类",
        "05": "代码类",
        "06": "金额类",
        "07": "日期类",
        "08": "标志类",
        "09": "时间类",
        10: "日期时间类",
      },
      rootId: "",
      rootDetailDrawerVisible: false,
      scrollHeight: "",
      rootSourceList: [],
    };
  },
  mounted() {
    this.rootTypeOption = rootTypeOption;
    this.salcTableHeight();
    this.listQr();
    this.qryRootSourceList();
  },
  methods: {
    /**
     * 计算表格滚动高度
     */
    salcTableHeight() {
      let clientHeight = window.document.documentElement.clientHeight;
      let scrollHeight = clientHeight - 304;
      this.scrollHeight = scrollHeight;
    },
    async qryRootSourceList() {
      const res = await this.rpc.datadict.qryRootSourceList();
      this.rootSourceList = res.rootSourceList.map((item) => {
        return {
          key: item.rootSource,
          value: item.rootSource,
        };
      });
      this.rootSourceList.unshift({ key: "", value: "全部" });
    },
    async listQr() {
      const { infoList, totalNum } =
        await this.rpc.datadict.qryDataDictionaryRootList({
          ...this.formData,
          currentPage: this.currentPage,
          turnPageShowNum: this.turnPageShowNum,
        });
      this.list = infoList || [];
      this.turnPageTotalNum = totalNum;
    },

    // 切换每页条数
    handleSizeChange(val) {
      this.turnPageShowNum = val;
      this.currentPage = 1;
      this.listQr();
    },

    // 切换页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.listQr();
    },

    output() {
      this.listQr();
    },
    search() {
      this.turnPageShowNum = 10;
      this.currentPage = 1;
      this.listQr();
    },
    reset() {
      this.formData = {
        rootName: "",
        rootType: "",
        rootSource: "",
        rootTypeThreshold: "",
        createUserName: "",
        beginTime: "",
        endTime: "",
      };
      this.listQr();
    },
    doOperate(operate, scope) {
      switch (operate) {
        case "add":
          this.$refs.handleWordRoots.openDrawer();
          break;
        case "edit":
          this.$refs.handleWordRoots.openDrawer("edit", scope.rootId);
          break;
        case "look":
          this.rootId = scope.rootId;
          this.rootDetailDrawerVisible = true;
          break;
        case "delete":
          this.$confirm("是否确定删除此词根?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
            await this.rpc.datadict.delDataDictionaryRoot({
              rootId: scope.rootId,
            });
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
            });
            this.listQr();
          });

          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.datadict_root_manage {
  padding: 12px;
  height: 100%;
  // overflow: hidden;
}
.search {
  padding: 16px 20px 4px 20px;
  background-color: #fff;
  display: flex;
  margin-bottom: 12px;
}
.form {
  flex: 1;
  flex-wrap: wrap;
  ::v-deep .el-input,
  ::v-deep .el-select {
    width: 180px;
  }

  ::v-deep .el-form-item__label {
    color: #000;
    font-family: PingFangSC-Regular;
  }

  ::v-deep .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
}
.table_box {
  background: #ffffff;
  margin-top: 12px;
  padding: 14px 24px;
}
.table {
  /deep/.el-table .el-table__body tr {
    cursor: pointer;
  }

  /deep/.el-table th {
    background: #fafafc;
    font-size: 14px;
    color: #333333;
  }

  /deep/.el-table th .cell {
    padding-left: 24px;
    line-height: 23px;
  }

  /deep/.el-table td {
    padding: 11px 0;
    font-size: 14px;
    color: #666666;
    position: relative;
  }

  /deep/.el-table td .cell {
    padding-left: 24px;
    line-height: 23px;
  }
  .link {
    cursor: pointer;
    font-size: 14px;
    color: #358aff;
  }
  .color-red {
    color: #e62c0c;
  }
}
.footer {
  text-align: right;
  margin-top: 20px;
}
</style>