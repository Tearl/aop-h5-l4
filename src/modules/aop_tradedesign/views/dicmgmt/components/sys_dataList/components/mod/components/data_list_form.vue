<template>
  <div class="aop_tradedesign_comps_dicmgmt_bussinessobj_form">
    <div class="create_content_wrapper">
      <div class="detail_content">
        <div class="content_header nav_title">
          {{ type === "add" ? "创建数据集" : "编辑数据集" }}
        </div>
        <el-form
          :model="formData"
          :rules="rules"
          class="service_create_form"
          ref="formData"
          label-width="130px"
        >
          <div class="service_create_form_info">
            <el-form-item label="数据集中文名称" prop="dataColletChiNm">
              <el-input
                v-model="formData.dataColletChiNm"
                clearable
                placeholder="请输入数据集中文名称"
                show-word-limit
              >
              </el-input>
            </el-form-item>

            <el-form-item label="数据集英文名称" prop="dataColletEngNm">
              <el-input
                v-model="formData.dataColletEngNm"
                clearable
                placeholder="请输入数据集英文名称"
                show-word-limit
              >
              </el-input>
            </el-form-item>

            <el-form-item label="数据集描述" prop="dataColletDescr">
              <el-input
                type="textarea"
                v-model="formData.dataColletDescr"
                clearable
                placeholder="请输入数据集描述"
              >
              </el-input>
            </el-form-item>

            <el-form-item
              label="数据列表"
              class="no_before"
            >
              <el-button
                class="add_params_button"
                icon="el-icon-plus"
                type="primary"
                @click="addDicParams"
                >从数据字典添加</el-button
              >
              <Table
                class="table_style"
                :data="dictInfos"
                :table="dictInfosTable"
                rowK="serialNumber"
                :cellStyle="dictListCellStyle"
                @operate="operate"
              ></Table>
              <!-- 分页器 -->
              <PagePagination
                class="page_pagination"
                v-if="type == 'mod'"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :pager="pager"
              >
              </PagePagination>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <DictionarySelect
      ref="dictionaryRef"
      :dialogVisible="dictionaryDialogVisible"
      :sysId="sysId"
      @closeDialog="dictionaryCloseDialog"
      @setDictChildList="setDictChildList"
    >
    </DictionarySelect>

  </div>
</template>
<script>
import Table from "@m/core/components/page_table";
import mixin from "@m/core/mixin";
import validate from "@m/utils/validate";
import DictionarySelect from "./dictionary_select";
import PagePagination from "@m/core/components/page_pagination";
import { unduplicated, setSerialNumber } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    Table,
    DictionarySelect,
    PagePagination
  },
  props: {
    type: {
      type: String,
      default: () => "add",
    },
    sysId: {
      type: String,
      default: () => ""
    },
    dataColletId: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      dictInfos: [],
      // 添加输入参数列表参数
      dictInfosTable: [
        {
          prop: "dictryId",
          label: "数据ID",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          minWidth: "20%",
          label: "数据名称",
          type: "text",
          tooltip: true,
        },
        {
          label: "操作",
          type: "button",
          width: "90",
          buttonList: [
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],
      // 列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 表单数据
      formData: {
        dataColletChiNm: "", // 参数中文名称
        dataColletEngNm: "",
        dataColletDescr: ""
      },
      //服务资产基本信息绑定的验证规则
      rules: {
        dataColletChiNm: [
          {
            required: true,
            trigger: "blur",
            message: "请输入数据集中文名称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入中文",
            validator: validate.containChinese,
          },
        ],
        dataColletEngNm: [
          {
            required: true,
            trigger: "blur",
            message: "请输入数据集英文名称",
          },
        ],
      },
      // 数据字典选择弹框
      dictionaryDialogVisible: false,
    };
  },
  methods: {
    operate(operation, data) {
      if (operation == "delete") {
        if(this.type == "add") {
          this.dictInfos = this.dictInfos.filter(
            (item) => item.dictryId != data.dictryId
          );
        } else {
          this.$confirm("确定要删除该数据字典吗？").then(async () => {
            const res = await this.rpc.systemmgmt.delDataDic({dataColletId: this.dataColletId, dictryId: data.dictryId})
            this.$notify({
              title: "成功",
              message: "删除成功",
              duration: 2000,
              type: "success",
            });
            this.getList()
          })
        }
      }
    },
    // 添加子参数
    addDicParams() {
      this.dictionaryDialogVisible = true;
    },
    // 数据字典选择弹框取消
    dictionaryCloseDialog() {
      this.dictionaryDialogVisible = false;
    },
    async setDictChildList(data) {
      if(this.type == "add") {
        data.forEach((item) => {
          if(item.dictryTyp == "List" || item.dictryTyp == "Object" && item.children && item.children.length > 0) {
            item.children.forEach((itemI) => {
              this.dictInfos.push(itemI)
            })
          } else {
            this.dictInfos.push(item)
          }
        })
        this.dictInfos = unduplicated(this.dictInfos, "dictryId");
      } else {
        let dictInfos = []
        data.forEach((item) => {
          if(item.dictryTyp == "List" || item.dictryTyp == "Object" && item.children && item.children.length > 0) {
            item.children.forEach((itemI) => {
              dictInfos.push({dictryId: itemI.dictryId})
            })
          } else {
            dictInfos.push({dictryId: item.dictryId})
          }
        })
        const params = {
          dataColletId: this.dataColletId,
          dictInfos: dictInfos
        }
        const res = await this.rpc.systemmgmt.addDataDic(params)
        this.$notify({
          title: "成功",
          message: "添加成功",
          duration: 2000,
          type: "success",
        });
        this.getList()
      }
    },
    async getDetail() {
      console.log(this.dataColletId);
      const res = await this.rpc.systemmgmt.getDataListDetail({dataColletId: this.dataColletId})
      this.formData = {
        dataColletChiNm: res.dataColletChiNm, 
        dataColletEngNm: res.dataColletEngNm,
        dataColletDescr: res.dataColletDescr,
        dataColletId: res.dataColletId
      }
    },
    async getList() {
      const params = {
        dataColletId: this.dataColletId,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      }
      const res = await this.rpc.systemmgmt.getDataListDetailList(params)
      this.dictInfos = res.dictInfos
      this.pager.total = res.turnPageTotalNum
    },
    // 每页条数改变时
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange(e) {
      this.getList();
    },
    //初始化
    init() {
      if(this.type == "mod") {
        this.getDetail()
        this.getList()
      }
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_bussinessobj_form {
  .create_content_wrapper {
    padding: 16px 24px;
    .detail_content {
      position: relative;
      background: $base_white;
      padding: 0 24px 24px;
      min-height: 78.5vh;
      .content_header {
        padding: 20px 30px 0;
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
      .service_create_form {
        margin-top: 32px;
        @include form(".service_create_form_info");
        .create_form_tips {
          width: 500px;
          position: absolute;
          left: 420px;
          top: 0px;
          height: 40px;
          line-height: 40px;
          font-family: $font_regular;
          font-size: 12px;
          color: $sec_ft_color;
          letter-spacing: 0;
        }
      }
      .service_create_form_info {
        padding: 0px 30px 0;
        .no_before ::v-deep.el-form-item__label::before {
          content: "";
        }
        .add_params_button {
          font-size: 14px;
          border-radius: 2px;
          cursor: pointer;
          padding: 0 8px;
          letter-spacing: 0;
          text-align: center;
          font-family: PingFangSC-Regular;
          height: 40px;
        }
        .page_pagination {
          ::v-deep .el-input {
            width: 100px;
          }
          ::v-deep .el-pagination__editor.el-input {
            width: 50px;
          }
          ::v-deep .el-input__inner {
            padding-left: 0;
          }
        } 
      }
    }
    .table_class {
      ::v-deep tr td {
        &:nth-child(1) {
          .cell {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .input_textarea {
    position: absolute;
    top: 20px;
    left: 30px;
    width: 1000px;
    height: 500px;
  }
  ::v-deep .table_style .el-radio__label {
    display: none;
  }

  .dialog {
    ::v-deep .service_top {
      padding: 0;
    }
  }
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;
  }
  .table_class ::v-deep.el-table tr {
    height: 75px;
  }
  .table_class ::v-deep.input_error .el-input__inner {
    border-color: #f56c6c;
  }
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
    ::v-deep .el-input__inner{
      width: 150px;
    }
    ::v-deep .el-input {
      width: 150px !important;
    }
  }
}
</style>
