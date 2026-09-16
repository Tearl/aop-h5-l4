<template>
  <div class="aop_tradedesign_comps_d4bdesign_detail_list">
    <div class="content">
      <el-form
        ref="formBasic"
        :rules="rules"
        :model="detailInfo"
        label-width="130px"
        
        class="edit_form"
      >
        <div v-if="serviceVisible">
          <el-form-item label="服务名称" prop="svcNm">
            <el-input v-model="detailInfo.svcNm"></el-input>
          </el-form-item>
          <el-form-item label="所属数据集" prop="dataSetNm">
            <span>{{ datasetInfo.dataSetNm }}</span>
            <!-- <el-select v-model="detailInfo.sssjj" placeholder="请选择所属数据集">
            </el-select> -->
          </el-form-item>
          <el-form-item label="服务描述">
            <el-input type="textarea" v-model="detailInfo.svcDesc"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="所属数据集" prop="dataSetNm">
            <span>{{ datasetInfo.dataSetNm }}</span>
            <!-- <el-select v-model="detailInfo.sssjj" placeholder="请选择所属数据集">
            </el-select> -->
          </el-form-item>
          <el-form-item label="服务名称" prop="svcNm">
            <el-input v-model="detailInfo.svcNm"></el-input>
          </el-form-item>
          <el-form-item label="服务编码" prop="svcCd">
            <el-input v-model="detailInfo.svcCd"></el-input>
          </el-form-item>
          <el-form-item label="服务版本" prop="svcVersionNo">
            <div class="form_item_flex">
              <el-input
                v-model="detailInfo.svcVersionNo"
                clearable
                placeholder="1.0.0"
              />

              <span class="icon_right">
                <i class="el-icon-caret-top" @click="iconClick('add')"></i>
                <i class="el-icon-caret-bottom" @click="iconClick('lose')"></i>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="服务描述">
            <el-input type="textarea" v-model="detailInfo.svcDesc"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
export default {
  components: {},
  props: {
    // 当前reqmentId对应的详情信息
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    // 关联服务资产列表
    relatedAssetsList: {
      type: Array,
      default: () => [],
    },
    reqmentId: {
      type: String,
      default: () => "",
    },
    isEdit: {
      type: Boolean,
      default: () => false,
    },
    serviceVisible: {
      type: Boolean,
      default: () => true,
    },
    basicData: {
      type: Object,
      default: () => ({}),
    },
    datasetInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    // 关联服务资产按钮
    showRelatedAssets() {
      this.$emit("showRelatedAssets");
    },
  },
  data() {
    return {
      dataInfo: {
        sssjj: "",
        svcNm: "",
        fwms: "",
        svcCd: "",
        svcVersionNo: "",
      },
      rules: {
        // sssjj: [
        //   { required: true, message: "请选择所属数据集", trigger: "change" },
        // ],
        svcNm: [{ required: true, message: "请输入服务名称", trigger: "blur" }],
        svcCd: [{ required: true, message: "请输入服务编码", trigger: "blur" }],
        svcVer: [
          { required: true, trigger: "blur", message: "请输入服务版本" },
        ],
      },
    };
  },
  methods:{
    // 版本号增减点击
    iconClick(e) {
      this.$refs.formBasic.validateField(["svcVer"], (valid) => {
        if (!!valid) return;
        if (e == "add") {
          let list = this.detailInfo.svcVersionNo.split(".");
          list[2] = Number(list[2]) + 1;
          if (list[2] > 9) {
            list[2] = 0;
            list[1] = Number(list[1]) + 1;
            if (list[1] > 9) {
              list[1] = 0;
              list[0] = Number(list[0]) + 1;
              if (list[0] > 9) return;
            }
          }
          let n = list.join(".");
          this.detailInfo.svcVersionNo = n;
        } else {
          let list = this.detailInfo.svcVersionNo.split(".");
          list[2] = Number(list[2]) - 1;
          if (list[2] < 0) {
            list[2] = 9;
            list[1] = Number(list[1]) - 1;
            if (list[1] < 0) {
              list[1] = 9;
              list[0] = Number(list[0]) - 1;
              if (list[0] < 1) return;
            }
          }
          let n = list.join(".");
          this.detailInfo.svcVersionNo = n;
        }
      });
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4bdesign_detail_list {
  .content {
    .edit_form {
      @include form;
      .header_title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #131313;
        letter-spacing: 0;
        margin-bottom: 20px;
        font-weight: 600;
      }
      /deep/ .el-input,
      /deep/ .el-textarea__inner {
        width: 400px;
      }
      .no_before {
        ::v-deep .el-form-item__label::before {
          content: "";
        }
      }
      .form_item_flex {
        display: flex;
        .icon_right {
          margin-left: 5px;
          display: flex;
          flex-flow: column;
          font-size: 21px;
          i {
            cursor: pointer;
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>
