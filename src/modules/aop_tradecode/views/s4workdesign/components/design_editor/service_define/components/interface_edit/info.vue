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
          <span class="fn12" v-show="!noTrans && showInterface">已存在相似接口（<span @click="showLiveTable" style="color:#358aff;cursor:pointer;">{{ number }}</span>）个</span>
        </div>
        <div class="right_content">
          <span>接口序号：</span>
          <span class="content_info" >{{ detailInfo.svcSeq }}</span>

        </div>
        <div class="right_content">
          <span>交易类型：</span>
          <span v-if="!noTrans">
            <el-select v-model="detailInfo.aiClass" placeholder="请选择" size="mini">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="cursor_click" @click="addLabel('01')">新增</span></span>
          <span v-else class="content_info">
            {{ detailInfo.aiClass }}
          </span>
        </div>

        <div class="right_content">
          <span>来源功能：</span>
          <span class="content_info">{{ detailInfo.srcFnctNm }}</span>
        </div>
        <div class="right_content">
          <span>创建时间：</span>
          <span class="content_info">{{ detailInfo.crtTm | crtTm_yyyyMMddhhmmss }}</span>
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
        <div class="left_content">
            <span>归属业务域：</span>
            <span class="content_info">{{ detailInfo.beltLineNm }}</span>
        </div>
        <div class="right_content">
          <span>标签：</span>
          <span class="content_info" v-if="noTrans">{{ aiLabel }}</span>
          <span v-if="!noTrans">
            <!-- hellow owrldl -->
              <el-select
                v-model="aiLabelList"
                multiple
                size="mini"
                style="margin-left: 20px;"
                placeholder="请选择">
                <el-option
                  v-for="item in aiLabelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span class="cursor_click" @click="addLabel('02')">新增</span>
          </span>
        </div>
        <div class="left_content">
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
    <!-- 展示相似接口 -->
    <el-dialog
        :title="'已存在相似接口列表'"
        width="80%"
        append-to-body="true"
        :visible.sync="visibleShowTable"
        :before-close="handleClose"
        class="service_dialog_table"
    >
        <div class="preview_dialog_table_list">
            <div style="background:#f5f5f5;width:100%;height:1px;margin-bottom:16px;"></div>
            <PageTable
                class="table_style"
                :table="tables"
                :data="tableData"
                key="connectList1"
                ref="tableRef1"
                rowK="tableData"
                @operate="operate"
                :show-overflow-tooltip="true"
            ></PageTable>
            <div style="background:#f5f5f5;width:100%;height:1px;margin-bottom:16px;"></div>
            <div class="dialog_bottom_btn" style="display: flex;justify-content: center;padding-top:12px;">
                <el-button type="primary" size="small" @click="visibleShowTable=false"
                    >关闭</el-button
                >
            </div>
        </div>
    </el-dialog>
    <el-dialog
      :title="addType === '01' ? '新增交易类型' : '新增标签'"
      :visible.sync="addVisible"
      width="30%"
    >
      <el-input v-model="labelName" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!labelName" @click="handleAddLabel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
import mixin from "@m/core/mixin";
import PageTable from "@m/core/components/page_table";
export default {
  mixins: [mixin],
  components: {
    PageTable,
  },
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
      aiClass: '',
      aiLabelList: [],
      aiLabelOptions:[],
      options: [],
      visibleShowTable:false,
      tableData:[],
      addVisible: false,
      labelName: '',
      addType: '',
      tables: [
            {
                prop: "svcId",
                label: "接口编号",
                minWidth: "150",
                type: "text",
                tooltip: true,
            },
            {
                prop: "svcSeq",
                label: "接口编码",
                minWidth: "150",
                type: "text",
                tooltip: true,
            },
            {
                prop: "svcNm",
                label: "接口名称",
                minWidth: "150",
                type: "text",
                tooltip: true,
            },
            {
                label: "操作",
                type: "button",
                fixed: 'right',
                width: "100",
                buttonList: [
                    {
                        desc: "查看",
                        operate: "look",
                    },
                ],
            },
        ],
    };
  },
  computed: {
    aiLabel() {
      const list = this.detailInfo.aiLabel?.split('&&')
      if (!list[0]) {
        return ''
      }
      return list?.join('、')
    }
  },
  watch: {
    aiLabelList() {
      this.detailInfo.aiLabelNew = this.aiLabelList.join(('&&'))
      console.log(this.detailInfo.aiLabelNew)
    },
    detailInfo() {
      const list = this.detailInfo.aiLabel?.split('&&')
      if (!list[0]) {
        this.aiLabelList = []
        return
      }
      this.aiLabelList = this.detailInfo.aiLabel?.split('&&').map((item) => {

        return item
      }) || [];
      console.log(this.aiLabelList, '11111111')
    },
  },
  methods: {
    async serachLabelOptions(type) {
      const res = await this.rpc.newEditor.queryInterfaceAttributeList({
        atrTpCd: type,
      })
      const intefaceAttributeInfoList = res.intefaceAttributeInfoList
      if (type == '01') {
        this.options = intefaceAttributeInfoList.map((item) => {
          return {
            label: item.atrNm,
            value: item.atrNm,
          }
        })
      } else {
        this.aiLabelOptions = intefaceAttributeInfoList.map((item) => {
          return {
            label: item.atrNm,
            value: item.atrNm,
          }
        })
      }
    },
    async handleAddLabel() {
      this.addVisible = false
      const res = await this.rpc.newEditor.addInterfaceAttribute({
        atrNm: this.labelName,
        atrTpCd: this.addType,
      })
      this.serachLabelOptions(this.addType)
      this.labelName = ""; //保存成功清空
      this.$notify({
        title: "成功",
        message: "新增成功",
        duration: 2000,
        type: "success",
      });
    },
    async addLabel(type) {
        this.labelName = ""; //开启时清空
      this.addVisible = true
      this.addType = type
    },
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
        fnctId: this.$route.query.fnctId,
        jobNo: this.jobNo,
        pageFlg: "0",
        svcNm: data,
      };
      let res = await this.rpc.newEditor.getInterfaceList(params);
      this.showInterface = true;
    //   console.log("data",data,res)
      this.number = data ? res.turnPageTotalNum : "0";
      this.tableData = res.apiInfoList || []
    },
    showLiveTable(){
        this.visibleShowTable = true;
    },
    handleClose(){
        this.visibleShowTable = false;
    },
    operate(type,data){
        if(type=='look'){
            window.open(
                `/aop-h5-sub/#/aop_tradecode/s4Design/interfaceDetail?apiId=${data.svcId}`,
                "_blank"
            );
        }
    }
  },
  created() {
    this.jobNo = this.$route.query.jobId;
    this.fnctCd = this.$route.query.fnctId;
    this.beltLine = this.$route.query.beltLine;
    this.authId = this.$route.query.authAstFnctInfoId;
    // this.aiLabelList =
    this.serachLabelOptions('01')
    this.serachLabelOptions('02')
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
    .cursor_click {
      color: $theme_color;
      cursor: pointer;
      display: inline-block;
      margin-left: 5px;
      font-size: 14px;
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
  .service_dialog_table{
    min-width: 640px;
    .preview_dialog_table_list {
        width: 100%;
        .dialog_bottom_btn {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0px;
            ::v-deep .el-button{
                height: 35px;
                text-align: center;
            }
        }
    }
  }
}
</style>
