<template>
  <div class="aop_tradedesign_dic_page_my_dic">
    <SideBar :statusList="statusList" @tabChange="tabChange"></SideBar>
    <div class="content">
      <div class="search">
        <SearchTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          v-if="showSearch"
        >
          <div slot="rightButton">
            <el-button
              type="primary"
              size="small"
              @click="search"
              class="right_button"
              >搜索</el-button
            >
            <el-button size="small" @click="reset" class="right_button"
              >重置</el-button
            >
          </div>
        </SearchTop>
        <!-- 评审箱 -->
        <div class="review_tabs" v-if="active == '01' || active == '02'">
          <el-tabs v-model="activeTabs" @tab-click="handleClick">
            <el-tab-pane
              :label="`待评审（${noCheckedCount || 0}）`"
              name="unreview"
            ></el-tab-pane>
            <el-tab-pane
              :label="`评审驳回（${checkedCount || 0}）`"
              name="review"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 登记箱 -->
        <div class="accept_tabs" v-if="active == '03' || active == '20'">
          <el-tabs v-model="activeTabs" @tab-click="handleClick">
            <el-tab-pane
              :label="`待登记（${noRegisterCount || 0}）`"
              name="unaccept"
            ></el-tab-pane>
            <el-tab-pane
              :label="`已登记（${registerCount || 0}）`"
              name="accepted"
            ></el-tab-pane>
          </el-tabs>
        </div>

        <DicList
          ref="dicListRef"
          :active="active"
          :flag="flag"
          :activeTabs="activeTabs"
          @changeSearch="changeSearch"
          @getCount="getCount"
          @getViewCount="getViewCount"
          @getTotal="getTotal"
        ></DicList>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import SearchTop from "@m/core/components/page_search_top";
import SideBar from "./components/sideBar";
import DicList from "./components/my_dic_list";
export default {
  mixins: [mixin],
  components: {
    SideBar,
    SearchTop,
    DicList,
  },
  computed: {
    // serviceForm() {
    //   if (this.active == "all") {
    //     return [
    //       {
    //         type: "input",
    //         model: "content",
    //         placeholder:
    //           "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
    //         labelText: "关键字:",
    //       },
    //       {
    //         type: "switch",
    //         model: "preciseQuery",
    //         label: "精确查询",
    //         activeValue: "1",
    //         inactiveValue: "0",
    //         style: {
    //           width: "260px",
    //         },
    //       },
    //       // {
    //       //   type: "select",
    //       //   model: "beltLine",
    //       //   placeholder: "请选择",
    //       //   labelText: "所属部:",
    //       //   select: [
    //       //     { value: "0", type: "对公" },
    //       //     { value: "1", type: "对私" },
    //       //     { value: "2", type: "营销" },
    //       //   ],
    //       // },
    //       {
    //         type: "select",
    //         model: "beltLine",
    //         placeholder: "请选择",
    //         labelText: "所属域:",
    //         select:[]
    //       },
    //       {
    //         type: "select",
    //         model: "classifyId",
    //         placeholder: "请选择",
    //         labelText: "分类:",
    //         select: [
    //           { value: "", type: "全部" },
    //           { value: "1", type: "C1 用户册" },
    //           { value: "2", type: "P1 机构册" },
    //           { value: "3", type: "C2 渠道册" },
    //           { value: "4", type: "P2 产品册" },
    //           { value: "5", type: "C3 合约册" },
    //           { value: "6", type: "S 系统册" },
    //         ],
    //       },
    //       {
    //         type: "select",
    //         model: "status",
    //         placeholder: "请选择",
    //         labelText: "状态:",
    //         select: [
    //           { value: "", type: "全部" },
    //           { value: "00", type: "设计中" },
    //           { value: "01", type: "待评审" },
    //           { value: "02", type: "评审驳回" },
    //           { value: "03", type: "待登记" },
    //           { value: "20", type: "已登记" },
    //         ],
    //       },
    //     ];
    //   } else {
    //     return [
    //       {
    //         type: "input",
    //         model: "content",
    //         placeholder:
    //           "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
    //         labelText: "关键字:",
    //       },
    //       {
    //         type: "switch",
    //         model: "preciseQuery",
    //         label: "精确查询",
    //         activeValue: "1",
    //         inactiveValue: "0",
    //         style: {
    //           width: "260px",
    //         },
    //       },
    //       // {
    //       //   type: "select",
    //       //   model: "beltLine",
    //       //   placeholder: "请选择",
    //       //   labelText: "所属部:",
    //       //   select: [
    //       //     { value: "0", type: "对公" },
    //       //     { value: "1", type: "对私" },
    //       //     { value: "2", type: "营销" },
    //       //   ],
    //       // },
    //       {
    //         type: "select",
    //         model: "beltLine",
    //         placeholder: "请选择",
    //         labelText: "所属域:",
    //         select: []
    //       },
    //       {
    //         type: "select",
    //         model: "classifyId",
    //         placeholder: "请选择",
    //         labelText: "分类:",
    //         select: [
    //           { value: "", type: "全部" },
    //           { value: "1", type: "C1 用户册" },
    //           { value: "2", type: "P1 机构册" },
    //           { value: "3", type: "C2 渠道册" },
    //           { value: "4", type: "P2 产品册" },
    //           { value: "5", type: "C3 合约册" },
    //           { value: "6", type: "S 系统册" },
    //         ],
    //       },
    //     ];
    //   }
    // },
  },
  data() {
    return {
      statusList: [
        //  设计状态：00-设计中、01-待评审、02-评审驳回、03-待登记、20-已登记
        {
          statusName: "我的字典",
          statusNumber: "0",
          status: "all",
          type: "all",
          id: "0",
        },
        {
          statusName: "草稿箱",
          statusNumber: "0",
          status: "00",
          type: "draft",
          id: "1",
        },
        {
          statusName: "评审箱",
          statusNumber: "0",
          status: "01",
          type: "unreview",
          id: "2",
        },
        {
          statusName: "登记箱",
          statusNumber: "0",
          status: "03",
          type: "unaccept",
          id: "3",
        },
      ],
      // 搜索条件
      form: {
        content: "",
        preciseQuery: "",
        beltLine: "",
        classifyId: "",
        status: "",
      },
      active: "all", // all-我的字典 01-草稿箱 02-评审箱 03-登记箱
      activeTabs: null, //  unaccept-待登记 accepted-已登记 unreview-待评审 review-已评审
      showSearch: true,
      checkedCount: "0",
      noCheckedCount: "0",
      noRegisterCount: "0",
      registerCount: "0",
      departmentList: [],
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder:
            "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
          labelText: "关键字:",
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
        // {
        //   type: "select",
        //   model: "beltLine",
        //   placeholder: "请选择",
        //   labelText: "所属部:",
        //   select: [
        //     { value: "0", type: "对公" },
        //     { value: "1", type: "对私" },
        //     { value: "2", type: "营销" },
        //   ],
        // },
        {
          type: "select",
          model: "beltLine",
          placeholder: "请选择",
          labelText: "所属域:",
          select: [],
        },
        {
          type: "select",
          model: "classifyId",
          placeholder: "请选择",
          labelText: "分类:",
          select: [
            { value: "", type: "全部" },
            { value: "1", type: "用户" },
            { value: "2", type: "机构" },
            { value: "3", type: "渠道" },
            { value: "4", type: "产品" },
            { value: "5", type: "合约" },
            { value: "6", type: "系统" },
          ],
        },
      ],
      flag:false
    };
  },
  methods: {
    init() {
      this.getCount();
      this.tabChange();
      this.queryBizDomainList();
      if (this.active == "all") {
        this.serviceForm = [
          {
            type: "input",
            model: "content",
            placeholder:
              "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
            labelText: "关键字:",
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
          // {
          //   type: "select",
          //   model: "beltLine",
          //   placeholder: "请选择",
          //   labelText: "所属部:",
          //   select: [
          //     { value: "0", type: "对公" },
          //     { value: "1", type: "对私" },
          //     { value: "2", type: "营销" },
          //   ],
          // },
          {
            type: "select",
            model: "beltLine",
            placeholder: "请选择",
            labelText: "所属域:",
            select: [],
          },
          {
            type: "select",
            model: "classifyId",
            placeholder: "请选择",
            labelText: "分类:",
            select: [
              { value: "", type: "全部" },
              { value: "1", type: "用户" },
              { value: "2", type: "机构" },
              { value: "3", type: "渠道" },
              { value: "4", type: "产品" },
              { value: "5", type: "合约" },
              { value: "6", type: "系统" },
            ],
          },
          {
            type: "select",
            model: "status",
            placeholder: "请选择",
            labelText: "状态:",
            select: [
              { value: "", type: "全部" },
              { value: "00", type: "设计中" },
              { value: "01", type: "待评审" },
              { value: "02", type: "评审驳回" },
              { value: "03", type: "待登记" },
              { value: "20", type: "已登记" },
            ],
          },
        ];
      } else {
        this.serviceForm = [
          {
            type: "input",
            model: "content",
            placeholder:
              "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
            labelText: "关键字:",
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
          // {
          //   type: "select",
          //   model: "beltLine",
          //   placeholder: "请选择",
          //   labelText: "所属部:",
          //   select: [
          //     { value: "0", type: "对公" },
          //     { value: "1", type: "对私" },
          //     { value: "2", type: "营销" },
          //   ],
          // },
          {
            type: "select",
            model: "beltLine",
            placeholder: "请选择",
            labelText: "所属域:",
            select: [],
          },
          {
            type: "select",
            model: "classifyId",
            placeholder: "请选择",
            labelText: "分类:",
            select: [
              { value: "", type: "全部" },
              { value: "1", type: "用户" },
              { value: "2", type: "机构" },
              { value: "3", type: "渠道" },
              { value: "4", type: "产品" },
              { value: "5", type: "合约" },
              { value: "6", type: "系统" },
            ],
          },
          // {
          //   type: "select",
          //   model: "status",
          //   placeholder: "请选择",
          //   labelText: "状态:",
          //   select: [
          //     { value: "", type: "全部" },
          //     { value: "00", type: "设计中" },
          //     { value: "01", type: "待评审" },
          //     { value: "02", type: "评审驳回" },
          //     { value: "03", type: "待登记" },
          //     { value: "20", type: "已登记" },
          //   ],
          // },
        ];
      }
    },
    async queryBizDomainList() {
      const res = await this.rpc.downloadDesign.queryBizDomainList();
      if (res.businessDomainLists.length > 0) {
        res.businessDomainLists.map((item) => {
          this.departmentList.push({
            value: item.bizDomainNo,
            type: item.bizDomainName,
          });
        });
        this.serviceForm[2].select = this.departmentList;
        console.log(this.serviceForm, this.departmentList, "123");
      }
      // this.departmentList = res.businessDomainLists;
      // console.log(departmentList,"departmentListdepartmentList")
    },
    async getCount() {
      const res = await this.rpc.dicmgmt.getDataSetCount();
      this.statusList[0].statusNumber = res.totalNum;
      this.statusList[1].statusNumber = res.designNum;
      this.statusList[2].statusNumber = res.reviewNum;
      this.statusList[3].statusNumber = res.registerNum;
    },
    changeSearch() {
      this.showSearch = !this.showSearch;
    },
    search() {
      this.$refs.dicListRef.form = this.form;
      this.$refs.dicListRef.getDicList();
    },
    reset() {
      this.$refs.dicListRef.page = "1";
      this.$refs.formRef.resetFields();
    },
    getTotal(data, e) {
      if (e == "01") {
        this.noCheckedCount = data;
      } else if (e == "02") {
        this.checkedCount = data;
      } else if (e == "03") {
        this.noRegisterCount = data;
      } else if (e == "20") {
        this.registerCount = data;
      }
    },
    getViewCount(e) {
      console.log("getViewCount", e, this.active);
      if (this.active == "01" || this.active == "02" || this.active == "02") {
        if (e == "01") {
          this.$nextTick(() => {
            this.$refs.dicListRef.getDicList("02").then(() => {
              this.$refs.dicListRef.getDicList("01");
              // this.$forceUpdate()
            });
          });
        } else if (e == "02") {
          this.$nextTick(() => {
            this.$refs.dicListRef.getDicList("01").then(() => {
              this.$refs.dicListRef.getDicList("02");
              // this.$forceUpdate()
            });
          });
        } else if (e.status == "03") {
          this.$nextTick(() => {
            this.$refs.dicListRef.getDicList("20");
            this.$refs.dicListRef.getDicList("03");
          });
        }
      }
    },
    tabChange(e) {
      this.reset();
      // this.$refs.dicListRef.reset()
      console.log("e", e, this.active);
      if (!e) {
        this.active = "all";
        this.$nextTick(() => {
          this.$refs.dicListRef.getDicList();
        });
        this.serviceForm = [
          {
            type: "input",
            model: "content",
            placeholder:
              "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
            labelText: "关键字:",
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
          // {
          //   type: "select",
          //   model: "beltLine",
          //   placeholder: "请选择",
          //   labelText: "所属部:",
          //   select: [
          //     { value: "0", type: "对公" },
          //     { value: "1", type: "对私" },
          //     { value: "2", type: "营销" },
          //   ],
          // },
          {
            type: "select",
            model: "beltLine",
            placeholder: "请选择",
            labelText: "所属域:",
            select: [],
          },
          {
            type: "select",
            model: "classifyId",
            placeholder: "请选择",
            labelText: "分类:",
            select: [
              { value: "", type: "全部" },
              { value: "1", type: "用户" },
              { value: "2", type: "机构" },
              { value: "3", type: "渠道" },
              { value: "4", type: "产品" },
              { value: "5", type: "合约" },
              { value: "6", type: "系统" },
            ],
          },
          {
            type: "select",
            model: "status",
            placeholder: "请选择",
            labelText: "状态:",
            select: [
              { value: "", type: "全部" },
              { value: "00", type: "设计中" },
              { value: "01", type: "待评审" },
              { value: "02", type: "评审驳回" },
              { value: "03", type: "待登记" },
              { value: "20", type: "已登记" },
            ],
          },
        ];
      } else {
        //当前点击页签判断
        this.active = e.status;
        this.activeTabs = e.type;
        if (e.status == "01") {
          this.$nextTick(() => {
            this.$refs.dicListRef.getDicList("02").then(() => {
              this.$refs.dicListRef.getDicList("01");
              // this.$forceUpdate()
            });
          });
        } else if (e.status == "03") {
          this.$nextTick(() => {
            this.activeTabs = "accepted"
            this.$refs.dicListRef.getDicList("20");
            // this.$refs.dicListRef.getDicList("03");
          });
        } else {
          this.$nextTick(() => {
            this.$refs.dicListRef.getDicList();
          });
        }
        if (this.active == "all") {
          this.serviceForm = [
            {
              type: "input",
              model: "content",
              placeholder:
                "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
              labelText: "关键字:",
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
            // {
            //   type: "select",
            //   model: "beltLine",
            //   placeholder: "请选择",
            //   labelText: "所属部:",
            //   select: [
            //     { value: "0", type: "对公" },
            //     { value: "1", type: "对私" },
            //     { value: "2", type: "营销" },
            //   ],
            // },
            {
              type: "select",
              model: "beltLine",
              placeholder: "请选择",
              labelText: "所属域:",
              select: [],
            },
            {
              type: "select",
              model: "classifyId",
              placeholder: "请选择",
              labelText: "分类:",
              select: [
                { value: "", type: "全部" },
                { value: "1", type: "用户" },
                { value: "2", type: "机构" },
                { value: "3", type: "渠道" },
                { value: "4", type: "产品" },
                { value: "5", type: "合约" },
                { value: "6", type: "系统" },
              ],
            },
            {
              type: "select",
              model: "status",
              placeholder: "请选择",
              labelText: "状态:",
              select: [
                { value: "", type: "全部" },
                { value: "00", type: "设计中" },
                { value: "01", type: "待评审" },
                { value: "02", type: "评审驳回" },
                { value: "03", type: "待登记" },
                { value: "20", type: "已登记" },
              ],
            },
          ];
          this.serviceForm[2].select = this.departmentList;
        } else {
          this.serviceForm = [
            {
              type: "input",
              model: "content",
              placeholder:
                "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
              labelText: "关键字:",
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
            // {
            //   type: "select",
            //   model: "beltLine",
            //   placeholder: "请选择",
            //   labelText: "所属部:",
            //   select: [
            //     { value: "0", type: "对公" },
            //     { value: "1", type: "对私" },
            //     { value: "2", type: "营销" },
            //   ],
            // },
            {
              type: "select",
              model: "beltLine",
              placeholder: "请选择",
              labelText: "所属域:",
              select: [],
            },
            {
              type: "select",
              model: "classifyId",
              placeholder: "请选择",
              labelText: "分类:",
              select: [
                { value: "", type: "全部" },
                { value: "1", type: "用户" },
                { value: "2", type: "机构" },
                { value: "3", type: "渠道" },
                { value: "4", type: "产品" },
                { value: "5", type: "合约" },
                { value: "6", type: "系统" },
              ],
            },
            // {
            //   type: "select",
            //   model: "status",
            //   placeholder: "请选择",
            //   labelText: "状态:",
            //   select: [
            //     { value: "", type: "全部" },
            //     { value: "00", type: "设计中" },
            //     { value: "01", type: "待评审" },
            //     { value: "02", type: "评审驳回" },
            //     { value: "03", type: "待登记" },
            //     { value: "20", type: "已登记" },
            //   ],
            // },
          ];
          this.serviceForm[2].select = this.departmentList;
        }
      }
    },
    handleClick(e) {
      switch (e.name) {
        case "unaccept":
          this.activeTabs = "unaccept";
          this.active = "03";
          this.flag = false;
          break;
        case "accepted":
          this.activeTabs = "accepted";
          this.active = "20";
          this.flag = true;
          break;
        case "unreview":
          this.activeTabs = "unreview";
          this.active = "01";
          this.flag = false;
          break;
        case "review":
          this.activeTabs = "review";
          this.active = "02";
          this.flag = false;
          break;
        default:
          break;
      }
      this.$nextTick(() => {
        this.$refs.dicListRef.getDicList();
        // this.count = this.$refs.dicListRef.total
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.aop_tradedesign_dic_page_my_dic {
  display: flex;
  .content {
    margin: 16px 16px 0 0;
    width: calc(100% - 200px);
    /deep/ .serivce_top_left {
      width: 100%;
    }
  }
  .accept_tabs,
  .review_tabs {
    background: #ffffff;
    margin-bottom: 12px;
    padding: 0 24px;
    /deep/ .el-tabs__nav-wrap {
      margin: 0;
      line-height: 40px;
    }
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__nav-wrap::after {
      height: 0px;
      background-color: none;
    }
    /deep/ .el-tabs__item {
      height: 56px;
      line-height: 56px;
    }
  }
}
</style>
