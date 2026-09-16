<template>
  <div class="enum-manage-edit">
    <div class="system-head" style="background-color: white">
      <div class="goBack">
        <img
          @click="goBack"
          class="back"
          src="@m/assets/images/icon_back.png"
          alt
        />
        <p style="color: #cecece">&nbsp;|&nbsp;</p>
        <p class="back-title">{{ title }}</p>
      </div>
    </div>

    <div class="enum-form">
      <el-card>
        <h2 slot="header">基本信息</h2>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="140px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="枚举名称:" prop="paramName">
                <el-input
                  v-model="formData.paramName"
                  placeholder="请输入枚举名称"
                  :disabled="['3'].includes(queryType)"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="枚举编码:" prop="paramCode">
                <el-input
                  v-model="formData.paramCode"
                  :disabled="['2', '3'].includes(queryType)"
                  placeholder="请输入枚举编码，例如：UserEnum"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
                            <el-form-item
                                label-width="16px"
                                style="color: #c0c4cc"
                            >
                                
                            </el-form-item>
                        </el-col> -->
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="归属系统:" prop="paramBelong">
                <el-select
                  v-model="formData.paramBelong"
                  placeholder="请选择归属系统"
                  :disabled="['3'].includes(queryType)"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.projectId"
                    :label="item.projectNm"
                    :value="item.projectId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

    <div class="enum-form">
      <el-card>
        <h2 slot="header">定义枚举值</h2>
        <el-button
          v-if="queryType !== '3'"
          slot="header"
          type="primary"
          size="small"
          @click="openDialog('1', {})"
          >新增</el-button
        >
        <div>
          <el-dialog
            :title="titleDialog"
            :visible.sync="dialogVisible"
            width="30%"
          >
            <el-form
              :model="formDialog"
              label-width="90px"
              :rules="rulesDialog"
              ref="formDialogRef"
            >
              <el-form-item label="枚举标签:" prop="paramDesc">
                <el-input
                  v-model="formDialog.paramDesc"
                  placeholder="请输入枚举标签"
                ></el-input>
              </el-form-item>
              <el-form-item label="枚举值:" prop="paramValue">
                <el-input
                  v-model="formDialog.paramValue"
                  placeholder="请输入枚举值"
                ></el-input>
              </el-form-item>
              <el-form-item label="枚举键值:" prop="paramKey">
                <el-input
                  v-model="formDialog.paramKey"
                  placeholder="请输入枚举键值"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancelDialog">取 消</el-button>
              <el-button
                type="primary"
                @click="titleDialog == '新增枚举值' ? addData() : changeData()"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </div>

        <el-table :data="tableData">
          <el-table-column prop="paramDesc" label="枚举标签"> </el-table-column>
          <el-table-column prop="paramValue" label="枚举编码">
          </el-table-column>
          <el-table-column prop="paramKey" label="枚举键值">
            <template slot-scope="scope">{{
              scope.row.paramKey || "/"
            }}</template>
          </el-table-column>
          <el-table-column v-if="queryType !== '3'" prop="handle" label="操作">
            <template slot-scope="scope">
              <span
                class="link"
                @click="openDialog('2', scope.row, scope.$index)"
                >编辑</span
              >
              <el-divider direction="vertical"></el-divider>
              <span
                class="link color-red"
                @click="doDel(scope.row, scope.$index)"
                >删除</span
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="enum-form">
      <el-card>
        <el-button v-if="queryType == '3'" type="primary" @click="goBack"
          >关闭</el-button
        >
        <el-button v-else type="primary" @click="addSave">保存</el-button>
      </el-card>
    </div>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      formData: {
        paramName: "",
        paramCode: "",
        paramBelong: "",
      },
      formDialog: {
        paramDesc: "",
        paramValue: "",
        paramKey: "",
      },
      rules: {
        paramName: [
          {
            required: true,
            message: "请输入枚举名称",
            trigger: "blur",
          },
        ],
        paramCode: [
          {
            required: true,
            message: "请输入枚举编码",
            trigger: "blur",
          },
        ],
        paramBelong: [
          {
            required: true,
            message: "请选择归属系统",
            trigger: "blur",
          },
        ],
      },

      rulesDialog: {
        paramDesc: [
          {
            required: true,
            message: "请输入枚举标签",
            trigger: "blur",
          },
        ],
        paramValue: [
          {
            required: true,
            message: "请输入枚举值",
            trigger: "blur",
          },
        ],
      },
      dataIndex: "",
      dialogVisible: false,
      titleDialog: "",
      queryType: "",
      tableData: [],
      options: [],
    };
  },
  computed: {
    title() {
      switch (this.$route.query.action) {
        case "edit":
          return "编辑枚举字典";
        case "look":
          return "查看枚举字典";
        case "add":
          return "新建枚举字典";
      }
    },
  },
  mounted() {
    this.queryType = this.$route.query.queryType;
    if (this.queryType != "1") {
      this.queryEnumParamDetail();
    }
    this.queryOwnL5ProjectPageList();
  },
  methods: {
    /**
     * 查询枚举详情
     */
    async queryEnumParamDetail() {
      const { detailList, enumBelong, enumCode, enumName } =
        await this.rpc.datadict.queryEnumParamDetail({
          enumCode: this.$route.query.enumCode,
        });
      this.tableData =
        detailList.map((e) => {
          return {
            paramDesc: e.enumLabel,
            paramKey: e.enumKey,
            paramValue: e.enumValue,
          };
        }) || [];
      this.formData = {
        paramName: enumName,
        paramCode: enumCode,
        paramBelong: enumBelong,
      };
    },
    async queryOwnL5ProjectPageList() {
      const { ownL5ProjectInfoList } =
        await this.rpc.datadict.queryOwnL5ProjectPageList({
          currentPage: 1,
          insvId: "03",
          turnPageShowNum: 9999,
        });
      this.options = ownL5ProjectInfoList || [];
      this.options.unshift({
        projectNm: "全部",
        projectId: "all",
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    async addSaveSubmit() {
      let arr = this.tableData.map((e) => {
        return {
          enumValue: e.paramValue,
          enumLabel: e.paramDesc,
          enumKey: e.paramKey,
        };
      });
      let params = {
        enumName: this.formData.paramName,
        enumCode: this.formData.paramCode,
        enumBelong: this.formData.paramBelong,
        detailList: arr,
      };
      await this.addEnumDictionary(params);
      this.$notify({
        title: "成功",
        message: "添加保存成功",
        duration: 2000,
        type: "success",
      });
      this.goBack();
    },
    async addEnumDictionary(params) {
      await this.rpc.datadict.addEnumDictionary(params);
    },

    async updateEnumParam(params) {
      await this.rpc.datadict.updateEnumParam(params);
    },
    async updateSaveSubmit() {
      let arr = this.tableData.map((e) => {
        return {
          enumValue: e.paramValue,
          enumLabel: e.paramDesc,
          enumKey: e.paramKey,
        };
      });
      let params = {
        enumName: this.formData.paramName,
        enumCode: this.formData.paramCode,
        enumBelong: this.formData.paramBelong,
        detailList: arr,
      };
      await this.updateEnumParam(params);
      this.$notify({
        title: "成功",
        message: "修改保存成功",
        duration: 2000,
        type: "success",
      });
      this.goBack();
    },
    submitForm(v) {
      if (v === "1") {
        return new Promise((res) => {
          this.$refs.formRef.validate((valid) => {
            res(valid);
          });
        });
      } else {
        return new Promise((res) => {
          this.$refs.formDialogRef.validate((valid) => {
            res(valid);
          });
        });
      }
    },
    async addSave() {
      // 1 添加   2 修改   3 查看
      if (!(await this.submitForm("1"))) return;
      if (this.queryType == "2") {
        await this.updateSaveSubmit();
      } else {
        if (this.tableData.length == 0) {
          this.$notify({
            title: "提示",
            message: "请增加定义枚举值后提交",
            duration: 2000,
            type: "info",
          });
          return;
        }

        await this.addSaveSubmit();
      }
    },
    emptyData(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = "";
        }
      }
    },
    openDialog(v, data, index) {
      this.dataIndex = index;
      this.titleDialog = v === "1" ? "新增枚举值" : "修改枚举值";
      this.dialogVisible = true;
      this.formDialog.paramDesc = data.paramDesc;
      this.formDialog.paramValue = data.paramValue;
      this.formDialog.paramKey = data.paramKey;
    },
    async addData() {
      if (!(await this.submitForm("2"))) return;
      this.tableData.push({ ...this.formDialog });
      this.dialogVisible = false;
      this.emptyData(this.formDialog);
    },

    async changeData() {
      if (!(await this.submitForm("2"))) return;
      this.tableData.forEach((item, index) => {
        if (index === this.dataIndex) {
          item.paramDesc = this.formDialog.paramDesc;
          item.paramValue = this.formDialog.paramValue;
          item.paramKey = this.formDialog.paramKey;
        }
      });
      this.dialogVisible = false;
    },

    cancelDialog() {
      this.dialogVisible = false;
    },

    async doDel(row, index) {
      await this.$confirm("您确定要删除该数据吗？", "温馨提示", {
        center: true,
        showClose: false,
      });

      if (!row?.increId) {
        this.tableData.splice(index, 1);
        this.$notify({
          title: "成功",
          message: "删除成功",
          duration: 2000,
          type: "success",
        });
        return;
      }

      await detailDeleteEnumData({
        increId: row.increId,
      });
      this.$notify({
        title: "成功",
        message: "删除成功",
        duration: 2000,
        type: "success",
      });
    },

    async init2() {
      if (["2", "3"].includes(queryType)) {
        const { detailList } = await this.rpc.datadict.queryEnumParamDetail({
          enumCode: this.formData.paramCode,
        });
        this.tableData = detailList || [];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.enum-manage-edit {
  /deep/.el-select {
    width: 100%;
  }

  /deep/.el-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .system-head {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .goBack {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 30px;
      span {
        font-family: MicrosoftYaHeiUI;
        font-weight: bold;
        font-size: 16px;
        letter-spacing: 0;
      }
      .back {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      .back-title {
        font-family: MicrosoftYaHeiUI-Bold;
        font-size: 17px;
        font-weight: bold;
        color: #333333;
      }
    }
  }
  .enum-form {
    padding: 20px 16px;
    text-align: center;

    h2 {
      font-size: 18px;
      font-weight: 600;
    }
  }
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
</style>
