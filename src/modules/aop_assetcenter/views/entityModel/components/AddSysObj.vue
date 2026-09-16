<template>
  <div>
    <el-dialog
      title="添加对象属性"
      :visible.sync="visible"
      class="add-sys-obj"
      width="70%"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="10vh"
      @close="close"
    >
      <div class="title-select" slot="title">
        <el-radio-group v-model="titleActive" size="small">
          <el-radio-button label="1">选择已有库表对象</el-radio-button>
          <el-radio-button label="2">新建库表对象</el-radio-button>
        </el-radio-group>
      </div>
      <div class="dialog-content">
        <div class="select-block" v-show="titleActive == '1'">
          <div class="search-form">
            <div class="left">
              <el-form
                ref="form"
                :model="searchForm"
                :inline="true"
                size="mini"
              >
                <el-form-item label="库表对象编码/名称:">
                  <el-input
                    v-model="searchForm.keyword"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属中心:">
                  <el-select
                    v-model="searchForm.projectId"
                    placeholder="请选择"
                    disabled
                  >
                    <el-option
                      :label="item.projectNm"
                      :value="item.projectId"
                      v-for="item in [project]"
                      :key="item.projectId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="right">
              <el-button type="primary" size="small" @click="search"
                >查询</el-button
              >
              <el-button size="small" @click="reset">重置</el-button>
            </div>
          </div>
          <el-table
            :data="objList"
            row-key="objId"
            v-loading="loading"
            style="width: 100%"
            :height="378"
            ref="objList"
            size="small"
            align="center"
            :stripe="false"
            highlight-current-row
            border
            :header-cell-style="{
              background: '#F5F5F8',
              color: '#333',
            }"
            @row-click="selectRow"
          >
            <el-table-column align="center" width="55" label="选择">
              <template slot-scope="scope">
                <el-radio :label="scope.row.objId" v-model="selectedObjId"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="objCd"
              label="库表对象编码"
            ></el-table-column>
            <el-table-column
              prop="objNm"
              label="库表对象名称"
            ></el-table-column>
            <el-table-column
              prop="bizDomainNm"
              label="业务域"
            ></el-table-column>
            <el-table-column
              prop="appCntrNm"
              label="所属中心"
            ></el-table-column>
            <el-table-column prop="attrs" label="属性"></el-table-column>
          </el-table>
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
        <div class="add-block" v-show="titleActive == '2'">
          <!-- 新建 -->
          <el-form ref="base" :model="formData" :rules="rules" size="small">
            <el-form-item label="对象名称" prop="objNm">
              <el-input
                maxLength="32"
                v-model.trim="formData.objNm"
                placeholder="请输入对象中文名称"
              />
            </el-form-item>
            <el-form-item label="编码" prop="objCd">
              <el-input
                maxLength="32"
                v-model.trim="formData.objCd"
                placeholder="字母、数字组合的编码，大写开头"
              />
            </el-form-item>
            <el-form-item label="对象类型" prop="objTpCd">
              <el-select
                placeholder="请选择对象类型"
                style="width: 100%"
                v-model="formData.objTpCd"
              >
                <el-option label="实体对象" value="00"></el-option>
                <el-option label="值对象" value="01"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属中心" prop="appCntrNo">
              <el-select
                placeholder="请选择所属中心"
                style="width: 100%"
                v-model="formData.appCntrNo"
                disabled
              >
                <el-option
                  :label="project && project.projectNm"
                  :value="project && project.projectId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="objClsCd">
              <el-select
                placeholder="请选择分类"
                style="width: 100%"
                v-model="formData.objClsCd"
                disabled
              >
                <el-option
                  :label="project && project.objClsNm"
                  :value="project && project.objClsCd"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="objDesc">
              <el-input
                maxLength="500"
                type="textarea"
                v-model.trim="formData.objDesc"
                placeholder="请输入描述"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="btn-group" slot="footer">
        <el-button size="medium" @click="close">取 消</el-button>
        <template v-if="titleActive == '1'">
          <el-button
            size="medium"
            type="primary"
            @click="confirm"
            :disabled="selectedObjId == ''"
            >确 定</el-button
          >
        </template>
        <template v-else>
          <el-button size="medium" type="primary" @click="confirmAdd"
            >确 定</el-button
          >
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  name: "AddSysObj",
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    project: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      titleActive: "1",
      loading: false,
      searchForm: {
        keyword: "",
        projectId: "",
      },
      formData: {
        objId: "",
        objNm: "",
        objCd: "",
        objTpCd: "00",
        appCntrNo: "",
        objClsCd: "",
        objDesc: "",
        status: "1",

        l5SysBizObjectAttributeDTOs: [],
        sysObjBizObjRelInfoListList: [],
        l5SysBizObjectRelDTOs: [],
        s6InfoList: [],
      },
      rules: {
        objNm: [
          { required: true, message: "请输入对象中文名称", trigger: "blur" },
        ],
        objCd: [
          {
            required: true,
            pattern: "^[A-Z]{1}([a-zA-Z0-9._]){0,32}$",
            message: "字母、数字组合的编码，大写开头",
            trigger: "blur",
          },
        ],
        objTpCd: [{ required: true }],
        appCntrNo: [{ required: true }],
        objClsCd: [{ required: true }],
      },
      currentPage: 1,
      turnPageShowNum: 10,
      total: 0,
      objList: [],
      selectedObjId: "",
      selectedObj: null,
    };
  },
  async mounted() {
    console.log("this.project", this.project);
    this.searchForm.projectId = this.project.projectId;
    this.formData.appCntrNo = this.project.projectId;
    this.formData.objClsCd = this.project.objClsCd;
    await this.reset();
  },
  methods: {
    selectRow(row) {
      this.selectedObjId = row.objId;
      this.selectedObj = row;
    },
    async search() {
      await this.queryObjList();
    },
    async reset() {
      this.searchForm.keyword = "";
      this.currentPage = 1;
      this.searchForm.projectId = this.project.projectId;
      await this.search();
    },
    // 查中心下的库表对象
    async queryObjList() {
      this.loading = true;
      const { l5SysBizObjectInfos, turnPageTotalNum } =
        await this.rpc.assetcenter.qryPageSysBizObjectInfoList({
          appCntrNo: this.project.projectId,
          objNm: this.searchForm.keyword,
          currentPage: this.currentPage,
          turnPageShowNum: this.turnPageShowNum,
        });
      this.objList = l5SysBizObjectInfos.map((i) => {
        let arr = i.l5SysBizObjectAttributeDTOs;
        let attrs = arr
          .map((a) => a.attrChiNm)
          .filter((a) => a)
          .join("、");
        return {
          ...i,
          bizDomainNm: i.bizDomainNm || this.project.bizDomainNm,
          appCntrNm: i.appCntrNm || this.project.projectNm,
          attrs: i.l5SysBizObjectAttributeDTOs.length ? attrs : "/",
        };
      });
      this.total = parseInt(turnPageTotalNum) || 0;
      this.loading = false;
    },
    async handleCurrentChange(val) {
      this.currentPage = val;
      await this.search();
    },
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("select", this.selectedObj);
    },
    confirmAdd() {
      this.$refs.base.validate(async (valid) => {
        if (valid) {
          let params = {
            ...this.formData,
            bizDomainNo: this.project.bizDomainNo,
            objClsNm: this.project.objClsNm,
            locationInfo: {
              belongId: this.project.projectId,
              belongType: "app",
              designType: "domain_model",
              nodeProps: ""
            },
          };
          const { objId } = await this.rpc.assetcenter.saveSysBizObjectInfo(
            params
          );
          const res = await this.rpc.assetcenter.qrySysBizObjectInfo({
            objId: objId,
          });
          this.$emit("select", res);
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.add-sys-obj {
  /deep/.el-dialog__body {
    padding: 20px !important;
  }
  /deep/.el-dialog__header {
    border-bottom: 1px solid #f5f5fa;
    padding: 12px 20px;
    background: #fafafc;

    .el-dialog__title {
      font-size: 16px;
      color: #000000;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bold;
      font-family: PingFangSC-Medium;
    }

    .el-dialog__headerbtn {
      top: 14px;
    }
  }

  .title-select {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .dialog-content {
    overflow: auto;
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
  }
  /deep/.el-dialog__footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #e7e7e7;
    padding: 16px !important;
  }
  .btn-group {
    text-align: center;
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

