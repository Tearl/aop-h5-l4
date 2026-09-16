<template>
  <div class="aop_tradecode_comps_d4bdesign_detail_list">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content trans_content">
          <span>接口名称：</span>
          <div class="input_content" v-if="!noTrans">
            <el-autocomplete
              size="mini"
              v-model="detailInfo.svcNm"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
              @change="handleChange"
              @focus="handleFocus"
              :trigger-on-focus="true"
              class="item"
              clearable
              ref="autocomplete"
              @clear="clickClearable"
              value-key="cnName"
              :debounce="0"
              :popper-append-to-body="false"
              popper-class="search-autocpmplete"
            >
              <template slot-scope="{ item }">
                <el-tooltip
                  effect="dark"
                  :content="item.cnName"
                  placement="top"
                >
                  <div class="default">
                    {{ item.cnName }}
                  </div>
                </el-tooltip>
              </template>
            </el-autocomplete>
          </div>
          <span class="content_info" v-else>{{ detailInfo.svcNm }}</span>
          <span class="fn12" v-show="!noTrans && showInterface">已存在相似接口（{{ number }}）个</span>
        </div>
        <div class="left_content">
          <span>归属业务域：</span>
          <span class="content_info">{{ detailInfo.beltLineNm }}</span>
        </div>

        <div class="left_content">
          <span>创建时间：</span>
          <span class="content_info">{{
            detailInfo.crtTm | crtTm_yyyyMMddhhmmss
          }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="left_content trans_content mgr">
          <span>接口编号：</span>
          <div class="input_content" v-if="!noTrans">
            <el-input
              size="mini"
              class="item"
              v-model="detailInfo.svcCd"
              placeholder=""
            ></el-input>
          </div>
          <span class="content_info" v-else>{{ detailInfo.svcCd }}</span>
        </div>
        <div class="right_content">
          <span>创建人：</span>
          <span class="content_info">{{ detailInfo.crtNm }}</span>
        </div>
      </div>
    </div>
    <div class="detail_list_bottom">
      <div class="bottom_content">
        <span class="desc">接口描述：</span>
        <el-input
          type="textarea"
          v-model="detailInfo.svcDesc"
          placeholder="请输入接口描述"
          maxlength="500"
          show-word-limit
          v-if="!noTrans"
        ></el-input>
        <span class="content_info" v-else>{{ detailInfo.svcDesc }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  components: {},
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    noTrans: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      number: 0,
      disabled: true,
      authId: "",
      fnctCd: "",
      beltLine: "",
      jobNo: "",
      noData: false,
      timeout: null,
      showInterface: false,
    };
  },
  methods: {
    search() {
      this.$emit("showRelatedTops");
    },
    /**
     * 远程调用建议列表
     */
    async querySearch(queryString, cb) {
      let results = [];
      this.noData = false;
      if (queryString == "") {
        cb(results);
      } else {
        results = (await this.getQryEnName(queryString)) || [];
        await this.getInterfaceNm(this.detailInfo.svcNm);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      }
    },
    /**
     * 选择接口名称
     */
    async handleSelect(item) {
      await this.getInterfaceNm(item.cnName);
      await this.getQryCnNameListByWord(item);
    },
    handleChange(item) {
      // console.log("=====", item);
      this.getInterfaceNm(item);
    },
    handleFocus() {
      // console.log("handleFocus");
      this.getInterfaceNm(this.detailInfo.svcNm);
    },
    /**
     * 接口编码
     */
    async getQryEnName(queryString) {
      let res = await this.rpc.newEditor.qryCnNameListByWord({
        cnName: queryString,
      });
      if (res.cnNameList?.length > 0) {
        return res.cnNameList;
      }
    },
    /**
     * 接口名称
     */
    async getQryCnNameListByWord(queryString) {
      let res = await this.rpc.newEditor.qryEnName({
        cnName: queryString.cnName,
      });
      this.$set(this.detailInfo, "svcCd", res.enName);
    },
    clickClearable() {
      this.$refs.autocomplete.activated = true;
    },
    async getInterfaceNm(data) {
      let params = {
        authId: this.authId,
        beltLine: this.beltLine,
        fnctId: this.$route.query.fnctId || '',
        jobNo: this.jobNo,
        pageFlg: "0",
        svcNm: data,
      };
      let res = await this.rpc.newEditor.getInterfaceList(params);
      this.showInterface = true;
      // console.log("data",data)
      this.number = data ? res.turnPageTotalNum : "0";
    },
  },
  created() {
    this.jobNo = this.$route.query.jobId;
    this.fnctCd = this.$route.query.fnctId;
    this.beltLine = this.$route.query.beltLine;
    this.authId = this.$route.query.authAstFnctInfoId;
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d4bdesign_detail_list {
  .content {
    display: flex;
    .detail_list_left,
    .detail_list_right {
      width: 50%;
    }

    .left_content,
    .right_content {
      margin-top: 16px;
      font-family: $font_regular;
      font-size: 14px;
      color: $sec_ft_color;
      letter-spacing: 0;
      .content_info {
        color: $pri_ft_color;
        &.cursor {
          color: $theme_color;
          cursor: pointer;
        }
      }
      .content_versNo {
        background: #f2f8ff;
        color: $theme_color;
      }
      .text_style {
        color: $theme_color;
        font-family: $font_regular;
        font-size: 14px;
        cursor: pointer;
      }
      .status {
        display: inline-block;
        text-align: center;
        line-height: 20px;
        padding: 0px 5px;
        &.unpublish {
          background: #dffff6;
          color: #2ddaac;
        }
        &.publishing {
          background: #fff4e5;
          color: #ff9104;
        }
        &.unchecked {
          background: #ffeaec;
          color: #fe4758;
        }
        &.finished {
          background: #f2f8ff;
          color: #358aff;
        }
      }
    }
    .input_content {
      width: 180px;
    }
  }
  .left_content {
    margin-right: 100px;
    // width: 100%;
  }
  .mgr {
    margin-right: 231px;
  }
  .fn12 {
    font-size: 12px;
    margin-left: 4px;
    background: #ffff00;
  }
  .item {
    flex: 1;
  }
  .btn_style {
    margin-left: 8px;
    background: #fff;
    color: #358aff;
    border: 0.5px solid #358aff;
    padding: 4px 6px;
    font-size: 12px;
  }
  .detail_list_bottom {
    margin-top: 24px;
    .bottom_content {
      border-top: 1px solid #e7e7ee;
      color: $sec_ft_color;
      padding: 16px 0;
      display: flex;
      .content_info {
        display: block;
        color: #333330;
        // line-height: 1;
        // margin-top: 16px;
      }
      span {
        min-width: 74px;
      }
      .desc {
        color: #333;
      }
      /deep/ .el-textarea__inner {
        height: 80px;
        margin-top: -5px;
        border-radius: 2px;
      }
    }
  }
  /deep/ .el-checkbox__label {
    color: #999;
  }
  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #999;
  }
  // ::v-deep .el-input__inner {
  //   width: 150px;
  // }
  .trans_content {
    margin-top: 10px !important;
    // display: inline-block;
    display: flex;
    align-items: center;
  }
  .trans_nm {
    display: inline-block;
    width: 12em;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    top: 6px;
  }
  .default {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
