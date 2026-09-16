<template>
  <div>
    <el-dialog :visible.sync="visibleShow" width="80%" :before-close="handleClose" :append-to-body="true"
      :close-on-click-modal="false" class="aop_techdesign_techdetail_dialog">
      <template slot="title">
        <div style="
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          ">
          <el-radio-group v-model="addSource" size="medium">
            <el-radio-button label="first">映射库表对象下</el-radio-button>
            <el-radio-button label="second">新建S6服务</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div class="main" v-if="addSource == 'first'">
        <div class="search">
          <div class="form">
            <el-form size="small" :model="formData" inline="true" ref="form">
              <el-form-item label="服务编码/名称：" label-width="150px">
                <el-input v-model="formData.objNm" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="业务域：" label-width="80px">
                <el-select v-model="formData.bizDomainNo" placeholder="请选择业务域" disabled>
                  <el-option v-for="item in [currentBizDomain]" :key="item.bizDomainNo" :label="item.bizDomainName"
                    :value="item.bizDomainNo"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="所属对象：" label-width="100px">
                <el-select v-model="formData.objId" placeholder="请选择" disabled>
                  <el-option v-for="item in [currentObj]" :key="item.objId" :label="item.objNm || item.objName"
                    :value="item.objId"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="btn">
            <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button size="small" plain @click="reset">重置</el-button>
          </div>
        </div>

        <!-- 表格 -->
        <div class="table_style">
          <el-table :data="infoList" ref="infoList" @row-click="select">
            <el-table-column width="55" align="center">
              <template slot-scope="scope">
                <el-radio v-model="selectedRow" :label="scope.row"></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="aiCode" label="服务编码" min-width="100">
            </el-table-column>
            <el-table-column prop="aiName" label="服务名称" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.aiName || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="objNm" label="所属对象" min-width="60">
              <template slot-scope="scope">
                {{ scope.row.objNm || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="aiCreateUsernm" label="更新人" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.aiCreateUsernm || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="aiCreateTime" label="更新时间" min-width="160">
              <template slot-scope="scope">
                {{ scope.row.aiCreateTime || "/" }}
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage"
              layout="total, prev, pager, next" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="main add-form" style="padding: 20px" v-else>
        <!-- 新建 -->
        <el-form :model="addForm" ref="addForm" :rules="rules" label-width="120px">
          <el-form-item label="业务域：">
            <el-select v-model="addForm.bizDomainNo" placeholder="请选择业务域" disabled>
              <el-option v-for="item in [currentBizDomain]" :key="item.bizDomainNo" :label="item.bizDomainName"
                :value="item.bizDomainNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属对象：">
            <el-select v-model="addForm.objId" placeholder="请选择" disabled>
              <el-option v-for="item in [currentObj]" :key="item.objId" :label="item.objNm || item.objName"
                :value="item.objId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="服务名称：" prop="aiName">
            <el-input v-model="addForm.aiName" placeholder="请输入服务名称" />
          </el-form-item>
          <el-form-item label="服务编码：" prop="aiCode">
            <el-input v-model="addForm.aiCode" placeholder="字母、数字组合的编码，小写开头" />
          </el-form-item>

          <el-form-item label="描述：" prop="aiDesc">
            <el-input v-model="addForm.aiDesc" placeholder="请输入描述" class="widthInput" type="textarea"
              :maxlength="500"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <div class="footer_btn">
          <el-button @click="handleClose" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click.stop="confirm" :disabled="isDisabled && addSource == 'first'">确
            定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import mixin from "@m/core/mixin";
import { getLocalStorage } from "@m/utils/localStorage.js";
export default {
  mixins: [mixin],
  props: {
    bizDomain: {},
    currentObj: {},
  },
  data() {
    return {
      visibleShow: false,
      addSource: "first",

      currentBizDomain: {},
      // currentObj: {},
      formData: {
        objNm: "",
        bizDomainNo: "",
        objId: "",
      },
      addForm: {
        bizDomainNo: "",
        objId: "",
        aiName: "",
        aiCode: "",
        aiDesc: "",
      },
      rules: {
        aiName: [
          {
            required: true,
            message: "请输入服务名称",
          },
        ],
        aiCode: [
          {
            required: true,
            pattern: "^[a-z]{1}([a-zA-Z0-9._]){0,}$",
            message: "字母、数字组合的编码，小写开头",
            trigger: "blur",
          },
        ]
      },
      currentPage: 1,
      total: 0,
      infoList: [],
      selectedRow: null,
      isDisabled: true,
    };
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init() {
      this.selectedRow = null;
      this.isDisabled = true;
      this.currentPage = 1;
      this.total = 0;
      this.infoList = [];
      this.currentBizDomain = this.bizDomain;
      this.formData.bizDomainNo = this.currentBizDomain.bizDomainNo;
      this.addForm.bizDomainNo = this.currentBizDomain.bizDomainNo;
      // const introduceInfo = localStorage.getItem("introduceInfo");
      // this.currentObj = JSON.parse(introduceInfo);
      // console.log("currentObj", this.currentObj);

      this.formData.objId = this.currentObj.objId;
      this.addForm.objId = this.currentObj.objId;

      await this.search();
    },
    async confirm() {
      if (this.addSource == "first") {
        // 映射库表对象下
        this.$emit("confirm", this.selectedRow);
        this.handleClose();
      } else {
        // 新建S6服务
        await this.saveS6ServiceInfo();
      }
      // this.handleClose();
    },
    select(row) {
      this.selectedRow = row;
      this.isDisabled = false;
    },
    async handleCurrentChange(e) {
      this.selectedRow = null;
      this.isDisabled = true;
      this.currentPage = e;
      await this.search();
    },
    handleClose() {
      this.visibleShow = false;
      this.selectedRow = null;
      this.isDisabled = true;
      this.currentPage = 1;
      this.total = 0;
      this.infoList = [];
      this.$emit("close");
    },
    async openDialog() {
      this.visibleShow = true;
      await this.init();
    },

    async saveS6ServiceInfo() {
      let userInfo = JSON.parse(getLocalStorage('_userInfo'));
      function formatCurrentTime() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          console.log("addForm", this.addForm);
          let pa = {
            aiCode: this.addForm.aiCode,
            aiDesc: this.addForm.aiDesc,
            aiName: this.addForm.aiName,
            beltLine: this.addForm.bizDomainNo,
            objId: this.addForm.objId,
            beltLineNm: this.currentBizDomain.bizDomainName,
            objNm: this.currentObj.objNm, // 所属对象
            aiModifyTime: formatCurrentTime(), // 修改时间
            aiModifyUserid: userInfo.cstNo, // 修改人ID
            aiModifyUsernm: userInfo.cstName, // 修改人名称

          };
          const { aiId } = await this.rpc.controlWorkbench.saveS6ServiceInfo(
            pa
          );
          // 新建成功
          this.$message.success("新建成功");
          const { infoList } = await this.rpc.controlWorkbench.qryS6ServiceInfoPage({
            beltLineNm: this.currentBizDomain.bizDomainName,
            objId: this.addForm.objId,
            aiNmOrCd: this.addForm.aiName,
          });
          this.$emit("confirm", {
            // ...pa,
            // aiId,
            ...infoList[0]
          });
          this.handleClose();
        } else {
          return false;
        }
      });
    },

    async search() {
      let params = {
        aiNmOrCd: this.formData.objNm,
        objId: this.formData.objId,
        beltLine: this.formData.bizDomainNo,
        currentPage: this.currentPage,
        turnPageShowNum: 10,
      };
      const { infoList, turnPageTotalNum } =
        await this.rpc.controlWorkbench.qryS6ServiceInfoPage(params);
      console.log("infoList???", infoList);
      this.infoList = infoList;
      this.total = turnPageTotalNum;
    },
    async reset() {
      this.formData.objNm = "";
      this.currentPage = 1;
      this.isDisabled = true;
      this.selectedRow = null;
      await this.search();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";

.aop_techdesign_techdetail_dialog {
  min-width: 640px;

  ::v-deep .el-dialog {
    border-radius: 4px 4px;
  }

  ::v-deep .el-dialog__body {
    padding: 0px !important;
    background-color: #ffffff;
  }

  ::v-deep .el-dialog__header {
    padding: 15px 20px 10px;
    background-color: #f2f2f2;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  ::v-deep .el-radio__label {
    display: none;
  }
}

.search {
  padding: 16px 20px 0 16px;
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
    // margin-bottom: 10px;
  }
}

.add-form {
  flex: 1;
  flex-wrap: wrap;

  ::v-deep .el-input,
  ::v-deep .el-select {
    // width: 180px;
    width: 100%;
  }

  ::v-deep .el-form-item__label {
    color: #000;
    font-family: PingFangSC-Regular;
  }

  ::v-deep .el-form-item--small.el-form-item {
    // margin-bottom: 10px;
  }
}

.table_style {
  @include scrollbar;
  height: calc(100% - 130px);
  overflow: auto;
  background-color: #fff;
  padding: 0 12px 12px;

  ::v-deep .el-table__header {
    color: #333;

    th {
      font-size: 14px;
      color: rgb(51, 51, 51);
      background: #f5f5f8;
      // border-bottom: none;
      padding: 10px 0;
    }
  }

  .table_sub {
    ::v-deep .el-table__header {
      display: none;
    }
  }
}

.footer {
  text-align: right;
  margin-top: 20px;
}

.footer_btn {
  padding-top: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .el-dialog__footer {
  border-top: 1px solid #e7e7e7;
  padding: 16px 24px;

  .el-button {
    width: 112px;
    height: 40px;
    font-size: 16px;
  }
}
</style>