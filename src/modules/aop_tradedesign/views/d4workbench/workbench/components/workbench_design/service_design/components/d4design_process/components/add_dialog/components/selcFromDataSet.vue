<template>
  <div class="aop_service_comps_workbench_public_dialog_addParams">
    <!-- 从数据集中选择 -->
    <PageDialog
      dialogTitle="从数据集中选择"
      :dialogVisiable="dialogVisible"
      dialogWidth="90%"
      @closeDialog="closeDialog"
      :apTobody="true"
      class="dialog"
      :customClass="'customClass'"
    >
      <div slot="box">
        <div class="add_dialog_conf">
          <ServiceTop
            ref="formRef"
            :serviceForm="serviceForm"
            :form="form"
            class="search_conf"
          >
            <div slot="rightButton">
              <el-button
                type="primary"
                size="small"
                @click="goSearch"
                class="right_button"
                >搜索</el-button
              >
              <el-button size="small" @click="resetSearch" class="right_button"
                >重置</el-button
              >
            </div>
          </ServiceTop>
          <div class="data_set_info">
            <div class="header_title">数据集</div>
            <div class="content">
              <div class="detail_list_left">
                <div class="left_content">
                  <span>名称：</span>
                  <span class="content_info">{{ dataObj.dataSetNm }}</span>
                </div>
                <div class="left_content">
                  <span>所属册：</span>
                  <span class="content_info">{{ classifyObj[dataObj.classifyId] }}</span>
                </div>
              </div>
              <div class="detail_list_right">
                <div class="right_content">
                  <span>所属部：</span>
                  <span class="content_info">{{ dataObj.beltLine | beltLineType}}</span>
                </div>
              </div>
            </div>
            <div class="detail_list_bottom">
              <div class="bottom_content">
                <span>描述：</span>
                <span class="content_info">{{ dataObj.dataSetDesc }}</span>
              </div>
            </div>
          </div>
          <TabsContent
            ref="tabsRef"
            class="card_style"
            fourDesign="choose"
            :isShow="false"
            :widthChange="true"
            :fieldList="fieldList"
            :piecewiseList="piecewiseList"
            :L5serviceList="L5serviceList"
            :serviceTrue="false"
            :susStnCount="susStnCount"
            :fieldCount="fieldCount"
            @detailClick="detailClick"
            @dataChange="dataChange"
            @checkChange="checkChange"
            @reFresh="reFresh"
          ></TabsContent>
          <div class="show_conf">
            <div class="show_conf_title">
              已选择{{ tableData && tableData.length || 0 }}个：
            </div>
            <div class="show_conf_content">
              <el-tag
                v-for="(item, index) in tableData"
                :key="index"
                type="info"
                size="small"
                closable
                class="show_conf_tag"
                @close="delParamsTag(item)"
              >
                {{ item.dictNm }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="saveParams">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageDialog from "@m/core/components/page_dialog";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import TabsContent from "../../addServ/components/tabsContent";
import { unduplicated, setSerialNumber } from "@m/utils/array";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    ServiceTop,
    TabsContent,
  },
  props: {
    // 数据集信息
    dataObj: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        content: "",
        preciseQuery: "",
      },
      serviceForm: [
        {
          type: "input",
          labelText: "查字典:",
          model: "content",
          placeholder: "搜索字段名称、中文名、描述",
          style: {
            width: "260px",
          },
        },
        {
          type: "switch",
          model: "preciseQuery",
          label: "精确查询",
          activeValue: "1",
          inactiveValue: "0",
          style: {
            width: "260px",
          },
        },
      ],
      fieldList: [],
      piecewiseList: [],
      substnData: {},
      dataSetDataIdList: [],
      susStnCount: "0",
      fieldCount: "0",
      selectData: [],
      classifyObj:{
        "1":"C1 用户册",
        "2":"P1 机构册",
        "3":"C2 渠道册",
        "4":"P2 产品册",
        "5":"C3 合约册",
        "6":"S 系统册",
      }
    };
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.getSubsList();
    },
    reFresh(e, type) {
       if (type == "field") {
        this.getFieldList(e);
      } else if (type == "serv") {
        this.getServList(e);
      }
    },
    async getSubsList(e) {
      const params = {
        dataSetNo: this.dataObj.dataSetNo,
        currentPage: e,
        turnPageShowNum: "10",
      };
      const res = await this.rpc.dicmgmt.getSubStnList(params);
      if (e == 1 || !e) {
        this.piecewiseList = res.dataSubsectionList;
        this.susStnCount = res.turnPageTotalNum;
      } else {
        let arr = res.dataSubsectionList;
        this.piecewiseList = this.piecewiseList.concat(arr);
      }
      if (!res.dataSubsectionList.length) {
        this.substnData = {};
      } else {
        Object.assign(this.substnData, res.dataSubsectionList[0] || {});
        this.getFieldList();
      }
    },
    async getFieldList(e) {
      const params = {
        dataSubstnNo: this.substnData.dataSubstnNo,
        currentPage: e,
        turnPageShowNum: "10"
      };
      const res = await this.rpc.dicmgmt.getMyFieldList(params);
      if (e == 1 || !e) {
        this.fieldList = res.dataSetDataRelationList;
        this.fieldCount = res.turnPageTotalNum;
      } else {
        let fild = res.dataSetDataRelationList;
        this.fieldList = this.fieldList.concat(fild);
      }
      if(this.tableData.length) {
        this.tableData.forEach(item => {
          this.fieldList.forEach(ii=> {
            if(ii.dataSetDataId == item.dataSetDataId) {
              ii.checked = item.checked
            }
          })
        })
      }
    },
    checkChange(e) {
      this.dataSetDataIdList = e.map((item) => item.dataSetDataId);
      this.tableData = JSON.parse(JSON.stringify(e));
      this.tableData = unduplicated(this.tableData, "dictId");
      console.log("选中",this.tableData)
    },
    closeDialog() {
      this.dialogVisible = false;
      this.tableData = []
      this.fieldList= [],
      this.piecewiseList= [],
      this.$refs.tabsRef.initData()
    },
    delParamsTag(e) {
      this.tableData = this.tableData.filter((it) => it.dictId != e.dictId);
      this.$refs.tabsRef.checkData = JSON.parse(JSON.stringify(this.tableData));
      this.fieldList.forEach(item => {
        if(item.dictId == e.dictId) {
          item.checked = false
        }
      })
      this.$forceUpdate();
    },
    goSearch() {},
    resetSearch() {},
    handleCancel() {
      this.closeDialog();
    },
    saveParams() {
      if(!this.tableData.length) return this.$message.error("请选择字段");
      this.$emit("saveParams", this.tableData);
    },
    dataChange(item, e, type, data) {
      console.log(item, e, type, data, "dataChange");
      switch (type) {
        case "0":
          // console.log(item,index,e);
          break;
        case "1":
          Object.assign(this.substnData,item)
          this.fieldList= [],
          this.getFieldList();
          this.$refs.tabsRef.fieldStyle = "0"
          // console.log(item,index,e)
          break;
        case "2":
          // this.tableData = data;
          // console.log(item,index,e)
          break;
        case "3":
          // console.log(item,index,e)
          break;
      }
    },
    detailClick(item, e, type) {
      console.log(item, e, type, "详情");
      if (e == "1") {
        if (type == "read") {
          this.subsectionDiaglog("read");
        }
      } else if (e == "2") {
        if (type == "read") {
          this.addField("read", item);
        }
      }
    },
    delDataSetId(data) {
      this.dataSetDataIdList.splice(this.dataSetDataIdList.indexOf(data),1)
      console.log("删除id",this.dataSetDataIdList)
      // this.$forceUpdate()
    },
    //分段弹窗
    subsectionDiaglog(type) {
      if (type == "read") {
        this.$refs.subsectioDetailRef.showDialog(type);
      } else {
        this.$refs.subsectionRef.showDialog(type);
      }
    },
    //字段弹窗
    addField(type, item) {
      if (type == "edit") {
        this.$refs.addFieldRef.dictryId = item.id;
        this.$refs.addFieldRef.getDictionaryInfoById(item.id);
        this.$refs.addFieldRef.showFiledDialog();
      } else if (type == "read") {
        this.$refs.fieldDetailRef.showDialog(type);
      } else {
        this.$refs.addFieldRef.dictryId = "";
        this.$refs.addFieldRef.showFiledDialog();
      }
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_service_comps_workbench_public_dialog_addParams {
  .header_title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #131313;
    letter-spacing: 0;
    font-weight: 600;
  }
  .data_set_info {
    padding-left: 40px;
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
      }
    }
    .left_content {
      margin-right: 300px;
      width: 100%;
    }

    .detail_list_bottom {
      margin-top: 16px;
      .bottom_content {
        color: $sec_ft_color;
        // padding: 16px 0;
        margin-bottom: 16px;
        .content_info {
          color: $pri_ft_color;
        }
      }
    }
  }
  .card_style {
    padding-left: 40px;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
.customClass{
  .header_title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #131313;
    letter-spacing: 0;
    font-weight: 600;
  }
  .data_set_info {
    padding-left: 40px;
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
      }
    }
    .left_content {
      margin-right: 300px;
      width: 100%;
    }

    .detail_list_bottom {
      margin-top: 16px;
      .bottom_content {
        color: $sec_ft_color;
        // padding: 16px 0;
        margin-bottom: 16px;
        .content_info {
          color: $pri_ft_color;
        }
      }
    }
  }
  .card_style {
    padding-left: 40px;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>