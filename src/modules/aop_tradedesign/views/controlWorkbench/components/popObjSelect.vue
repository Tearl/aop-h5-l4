<template>
  <div>
    <el-dialog :visible.sync="visibleShow" width="80%" :before-close="handleClose" :append-to-body="true"
      class="aop_techdesign_techdetail_dialog">
      <template slot="title">
        <div style="
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          ">
          <el-radio-group v-model="addSource" size="medium">
            <el-radio-button label="first">选择已有库表对象</el-radio-button>
            <el-radio-button label="second">新建库表对象</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="main" v-if="addSource == 'first'">
        <div class="search">
          <div class="form">
            <el-form size="small" :model="formData" inline="true" ref="form">
              <el-form-item label="库表对象编码/名称：" label-width="150px">
                <el-input v-model="formData.objNm" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="分类：" label-width="80px">
                <el-select v-model="formData.objClsCd" placeholder="请选择分类">
                  <el-option v-for="item in optionsObjectType" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性：" label-width="80px">
                <el-input v-model="formData.attrNm" placeholder="请输入"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="btn">
            <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button size="small" plain @click="reset">重置</el-button>
          </div>
        </div>
        <div class="table_style">
          <el-table :data="tableData" ref="multipleTableTwo" @row-click="handleChangeTwo">
            <el-table-column width="55" align="center">
              <template slot-scope="scope">
                <el-radio v-model="currentRadioTwo" :label="scope.row"></el-radio>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="objCd" label="库表对象编码" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.objCd || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="objNm" label="库表对象名称" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.objNm || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="objClsNm" label="分类" min-width="60">
              <template slot-scope="scope">
                {{ scope.row.objClsNm || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="attributesStr" label="属性" min-width="160">
              <template slot-scope="scope">
                {{ scope.row.attributesStr || "/" }}
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="turnPageShowNum"
              layout="total, sizes, prev, pager, next, jumper" :total="turnPageTotalNum">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="main" style="padding: 40px" v-else>
        <el-form :model="secondFormData" ref="secondFormData" :rules="rules" label-width="90px">
          <el-form-item label="对象名称" prop="objName">
            <el-input v-model="secondFormData.objName" placeholder="请输入对象名称" />
          </el-form-item>
          <el-form-item label="编码" prop="objCode">
            <el-input v-model="secondFormData.objCode" placeholder="字母、数字组合的编码，大写开头" />
          </el-form-item>
          <el-form-item label="对象类型" placeholder="请选择对象类型" prop="objType" style="margin-right: 0; position: relative">
            <p style="display: flex; flex-direction: row; align-items: center">
              <el-select v-model="secondFormData.objType" placeholder="请选择对象类型" style="width: 100%">
                <el-option v-for="item in optionsObjectType1" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-checkbox style="margin-left: 20px" v-model="secondFormData.objAggRoor">聚合根</el-checkbox>
            </p>
          </el-form-item>
          <el-form-item label="所属业务域" prop="bizDomainNo">
            <el-select v-model="secondFormData.bizDomainNo" style="width: 100%" disabled>
              <el-option v-for="item in [currentBizDomain]" :key="item.bizDomainNo" :label="item.bizDomainName"
                :value="item.bizDomainNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属中心" prop="appCntrNo">
            <el-select v-model="secondFormData.appCntrNo" style="width: 100%" @change="handleAppCnt">
              <el-option v-for="item in centerList" :key="item.projectId" :label="item.projectNm"
                :value="item.projectId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="分类" prop="objClass">
            <el-select disabled v-model="secondFormData.objClass" collapse-tags style="width: 100%" placeholder="请选择分类">
              <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="描述" prop="objDesc">
            <el-input v-model="secondFormData.objDesc" placeholder="请输入描述" class="widthInput" type="textarea"
              :maxlength="500"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <div class="footer_btn">
          <el-button @click="handleClose" size="small">取 消</el-button>
          <el-button type="primary" :disabled="isDisabled && addSource == 'first'" size="small" @click.stop="confirm">确
            定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";

export default {
  mixins: [mixin],
  components: {
    Table,
  },
  props: {
    projectId: {
      type: String,
      default: () => "",
    },
    modulePeriod: {
      type: String,
      default: () => "",
    },
    bizDomain: {
      type: Object,
      default: () => { },
    },
  },
  // inject: {
  //   bizDomain: {
  //     from: "bizDomain",
  //     default: () => null,
  //   },
  // },
  data() {
    return {
      isDisabled: true,
      optionsObjectType: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "用户",
        },
        {
          value: "2",
          label: "机构",
        },
        {
          value: "3",
          label: "渠道",
        },
        {
          value: "4",
          label: "产品",
        },
        {
          value: "5",
          label: "合约",
        },
        {
          value: "6",
          label: "系统",
        },
        {
          value: "xj",
          label: "xj导入",
        },
      ],
      visibleShow: false,
      formData: {
        objNm: "",
        objClsCd: "",
        attrNm: "",
      },
      currentPage: 1,
      turnPageShowNum: 10,
      turnPageTotalNum: 0,
      currentRadioTwo: null,

      addSource: "first",

      secondFormData: {
        objName: "",
        objCode: "",
        objType: "00",
        objClass: "",
        objDesc: "",
        objAggRoor: false,
        bizDomainNo: "",
        appCntrNo: "",
      },
      optionsObjectType1: [
        {
          value: "00",
          label: "实体对象",
        },
        {
          value: "01",
          label: "值对象",
        },
      ],
      optionsType: [
        {
          value: "1",
          label: "用户",
        },
        {
          value: "2",
          label: "机构",
        },
        {
          value: "3",
          label: "渠道",
        },
        {
          value: "4",
          label: "产品",
        },
        {
          value: "5",
          label: "合约",
        },
        {
          value: "6",
          label: "系统",
        },
      ],
      rules: {
        objName: [
          {
            required: true,
            message: "请输入对象中文名称",
          },
        ],
        objCode: [
          {
            required: true,
            pattern: "^[A-Z]{1}([a-zA-Z0-9._]){0,}$",
            message: "字母、数字组合的编码，大写开头",
            trigger: "blur",
          },
        ],
        objType: [
          {
            required: true,
            message: "请选择对象类型",
          },
        ],
        objClass: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
        appCntrNo: [
          { required: true, message: "请选择所属中心", trigger: "change" },
        ],
      },
      currentBizDomain: {},
      centerList: [],
    };
  },

  async mounted() {
    this.currentBizDomain = this.bizDomain;
    this.secondFormData.bizDomainNo = this.currentBizDomain.bizDomainNo;
    // await this.queryL5ProjectGroupList();
    await this.queryAppAndBlgClsList();
  },
  methods: {
    //关闭弹窗
    handleClose() {
      if (this.addSource == "first") {
        this.setCurrentTwo({});
      }
      this.visibleShow = false;
    },
    //打开弹窗
    openDialog() {
      this.visibleShow = true;
      this.isDisabled = true;
      this.reset();
    },

    handleChangeTwo(row) {
      this.currentRadioTwo = row;
      this.isDisabled = false;
    },

    setCurrentTwo(row = {}) {
      this.$refs.multipleTableTwo.setCurrentRow(row);
    },

    //确定
    async confirm() {
      if (this.addSource == "first") {
        let tempList = this.tableData.filter(
          (item) => item.objCd == this.currentRadioTwo.objCd
        );

        this.$emit("selectData", tempList[0]);
        this.handleClose();
      } else {
        this.$refs.secondFormData.validate(async (valid) => {
          if (valid) {
            const { objId } =
              await this.rpc.controlWorkbench.saveSysBizObjectInfo({
                appCntrNo: this.secondFormData.appCntrNo,
                bizDomainNm: this.currentBizDomain.bizDomainName,
                bizDomainNo: this.secondFormData.bizDomainNo,
                l5SysBizObjectAttributeDTOs: [],
                l5SysBizObjectRelDTOs: [],
                objAggRoor: this.secondFormData.objAggRoor ? "01" : "00",
                objCd: this.secondFormData.objCode,
                objClsCd: this.secondFormData.objClass,
                objClsNm:
                  this.optionsType.filter(
                    (i) => i.value == this.secondFormData.objClass
                  )[0].label || "",
                objDesc: this.secondFormData.objDesc,
                objNm: this.secondFormData.objName,
                objTpCd: this.secondFormData.objType,
                status: "1",
              });
            const res = await this.rpc.controlWorkbench.qrySysBizObjectInfo({
              objId: objId,
            });
            this.$emit("selectData", res);
            this.handleClose();
          }
        });
      }
    },

    //查询模块列表
    async queryTableList() {
      let parmas = {
        currentPage: this.currentPage,
        turnPageShowNum: this.turnPageShowNum,

        ...this.formData,
      };
      const res =
        await this.rpc.controlWorkbench.qryPageSysBizObjectInfoListFilterAttr(
          parmas
        );

      this.tableData = res.l5SysBizObjectInfos.map((item) => {
        let temArr = [];
        item.l5SysBizObjectAttributeDTOs.length &&
          item.l5SysBizObjectAttributeDTOs.forEach((val) => {
            if (val.attrChiNm) {
              temArr.push(val.attrChiNm);
            }
          });
        return {
          ...item,
          attributesStr: temArr.join("、"),
        };
      });

      this.turnPageTotalNum = res.turnPageTotalNum;
      this.$forceUpdate();
    },

    search() {
      this.isDisabled = true;
      this.currentPage = 1;
      this.turnPageShowNum = 10;
      this.queryTableList();
    },
    reset() {
      this.isDisabled = true;
      this.currentRadioTwo = null;
      this.currentPage = 1;
      this.turnPageShowNum = 10;
      this.formData = {
        objNm: "",
        objClsCd: "",
        attrNm: "",
      };
      this.queryTableList();
    },
    handleCurrentChange(e) {
      this.isDisabled = true;
      this.currentRadioTwo = null;
      this.currentPage = e;
      this.queryTableList();
    },
    handleSizeChange(e) {
      this.isDisabled = true;
      this.currentRadioTwo = null;
      this.turnPageShowNum = e;
      this.queryTableList();
    },

    async queryL5ProjectGroupList() {
      const { l5ProjectGroupInfoList } =
        await this.rpc.controlWorkbench.queryL5ProjectGroupList({
          bizDomainNo: this.currentBizDomain.bizDomainNo,
          isDesApi: "1",
        });
      this.centerList = l5ProjectGroupInfoList;
      // console.log("l5ProjectGroupInfoList", l5ProjectGroupInfoList);
    },

    async queryAppAndBlgClsList() {
      const { queryAppAndBlgClsInfoList } = await this.rpc.controlWorkbench.queryAppAndBlgClsList({
        bizDomainNo: this.currentBizDomain.bizDomainNo,
        currentPage: 1,
        turnPageShowNum: 1000,
      })
      this.centerList = queryAppAndBlgClsInfoList;
      this.optionsType = queryAppAndBlgClsInfoList.map(item => ({
        label: item.objClsNm,
        value: item.objClsCd,
      }))
    },
    handleAppCnt() {
      let str = this.centerList.find(item => item.projectId == this.secondFormData.appCntrNo);
      if (str) {
        this.secondFormData.objClass = str.objClsCd
      }
    }
  },
  watch: {},
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
}

::v-deep .el-radio__label {
  display: none;
}

.main {
  height: 520px;
  flex: 1;
  overflow: hidden;

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
      margin-bottom: 10px;
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

    ::v-deep span.status {
      border-radius: 2px;
      border-radius: 2px;
      padding: 4px 6px;
      color: #e62c0c;
      background: #fff5f2;

      &[code="00"] {
        color: #fe4758;
        background: #ffeaec;
      }

      &[code="10"] {
        color: #ff9104;
        background: #fff4e5;
      }

      &[code="20"] {
        color: #fe4758;
        background: #ffeaec;
      }

      &[code="30"] {
        color: #36d542;
        background: #e5ffe7;
      }

      &[code="40"] {
        color: #ff9104;
        background: #ffeaec;
      }

      &[code="50"] {
        color: #36d542;
        background: #e5ffe7;
      }
    }
  }

  .footer {
    text-align: right;
    margin-top: 20px;
  }
}

.dialog-footer {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 24px;
  justify-content: center;

  .el-button {
    width: 112px;
    height: 40px;
    font-size: 16px;
  }
}

::v-deep .noneCheck {
  .el-checkbox__input {
    display: none;
  }
}

.show_conf {
  padding-bottom: 10px;
  position: relative;
  bottom: 0;
  left: 0;
  background: #fff;
  width: 100%;
  z-index: 9;
  border-bottom: 1px solid #e7e7e7;

  // overflow: hidden;
  .show_conf_title {
    text-align: left;
    margin-right: 10px;
    font-family: $font_medium;

    span {
      color: #358aff;
    }
  }

  .show_conf_content {
    text-align: left;
  }

  .show_conf_tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
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

  // button {
  //   width: 110px;
  //   height: $btn_large_h;
  // }
}
</style>