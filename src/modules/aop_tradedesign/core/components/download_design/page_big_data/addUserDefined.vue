<template>
  <div class="aop_tradedesign_download_design_comps_add_user_undefined">
    <PageDialog
      :dialogWidth="'70%'"
      :dialogTitle="'请选择元数据'"
      :dialogVisiable="addVisible"
      @closeDialog="handleCancel"
      class="add_dialog"
      :apTobody="true"
    >
      <div slot="box">
        <el-radio-group v-model="paramsDefault" class="radio_group">
          <el-radio-button label="choose">选择现有元数据</el-radio-button>
          <el-radio-button label="add">新增元数据</el-radio-button>
        </el-radio-group>

        <div class="add_dialog_conf1" v-show="paramsDefault == 'choose'">
          <div class="middle">
            <div class="right_table">
              <ServiceTop
                ref="formRef"
                :serviceForm="serviceForm"
                :form="searchRecord"
                class="search_conf"
                @enterSearch="goSearch"
              >
                <div slot="rightButton">
                  <el-button
                    type="primary"
                    size="small"
                    @click="goSearch"
                    class="right_button"
                    >搜索</el-button
                  >
                  <el-button
                    size="small"
                    @click="resetFields"
                    class="right_button"
                    >重置</el-button
                  >
                </div>
              </ServiceTop>
              <div class="content">
                <div class="table">
                  <TableHeader
                    title="参数列表"
                    :slotVisble="true"
                    :checkedColumns="checkedColumns"
                    :checkBoxGroup="checkBoxGroup"
                    @changeColumn="changeColumn"
                  >
                  </TableHeader>
                  <Table
                    class="table_style"
                    :data="dictList"
                    :table="dictListTables"
                    ref="dictListTableRef"
                    :rowK="'serialNumber'"
                    :tableType="'selection'"
                    :cellStyle="dictListCellStyle"
                    useType="dialog"
                    :reload="reload"
                    @select="checkSelect"
                    @selectAll="selectAll"
                  ></Table>
                  <!-- 分页器 -->
                  <PagePagination
                    @size-change="handleDicSizeChange"
                    @current-change="handleDicCurrentChange"
                    :pager="dicPager"
                  >
                  </PagePagination>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="add_dialog_conf1" v-if="paramsDefault == 'add'">
          <CreateData ref="createData"></CreateData>
        </div>
      </div>
      <div slot="footer">
        <div class="show_conf" v-show="paramsDefault == 'choose'">
          <div class="show_conf_title">
            已选择{{ tableData && tableData.length }}个：
          </div>
          <div class="show_conf_content">
            <el-tag
              v-for="(item, index) in tableData"
              :key="index"
              type="info"
              size="small"
              closable
              class="show_conf_tag"
              @close="delParamsTag(item, formInline.type)"
            >
              {{ item.dictryNm }}
            </el-tag>
          </div>
        </div>
        <div class="footer_btn">
          <el-button @click.native="handleCancel">取 消</el-button>
          <el-button type="primary" @click.native="saveParams">确定</el-button>
        </div>
      </div>
    </PageDialog>
    <!-- 添加子参数 -->
    <SelectFromData
      ref="selectFromDataRef"
      @addChildParams="addChildParams"
    ></SelectFromData>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import { setSerialNumber, unduplicated } from "@m/utils/array";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import TableHeader from "@m/core/components/page_table_header_filter";
import validate from "@m/utils/validate";
import SelectFromData from "./selectChildData";
import CreateData from './createData'
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTop,
    TableHeader,
    SelectFromData,
    CreateData,
  },
  props: {},
  data() {
    return {
      // 已选参数数组
      tableData: [],
      // 选择参数弹框
      addVisible: false,
      // 选择参数分页器
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      dictList: [],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名或描述",
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
        {
          type: "select",
          model: "attributeTyp",
          placeholder: "属性类型",
          select: [
            { value: "", type: "所有属性"},
            { value: "0", type: "普通属性"},
            { value: "1", type: "对象属性"},
            { value: "2", type: "枚举属性"},
            { value: "3", type: "列表属性"},
            { value: "4", type: "自定义属性"},
          ],
          filterable: true,
        },
        {
          type: "select",
          model: "paraType",
          placeholder: "参数类型",
          select: [
            { type: "String", value: "String" },
            { type: "File", value: "File" },
            { type: "List", value: "List" },
            { type: "boolean", value: "boolean" },
            { type: "char", value: "char" },
            { type: "int", value: "int" },
            { type: "byte", value: "byte" },
            { type: "short", value: "short" },
            { type: "long", value: "long" },
            { type: "float", value: "float" },
            { type: "double", value: "double" },
            { type: "Boolean", value: "Boolean" },
            { type: "Character", value: "Character" },
            { type: "Integer", value: "Integer" },
            { type: "Byte", value: "Byte" },
            { type: "Short", value: "Short" },
            { type: "Long", value: "Long" },
            { type: "Float", value: "Float" },
            { type: "Double", value: "Double" },
            { type: "BigDecimal", value: "BigDecimal" },
            { type: "Object", value: "Object" },
            { type: "Date", value: "Date" },
          ],
        },
      ],
      selectVal: [
        { type: "String", value: "String" },
        { type: "File", value: "File" },
        { type: "List", value: "List" },
        { type: "boolean", value: "boolean" },
        { type: "char", value: "char" },
        { type: "int", value: "int" },
        { type: "byte", value: "byte" },
        { type: "short", value: "short" },
        { type: "long", value: "long" },
        { type: "float", value: "float" },
        { type: "double", value: "double" },
        { type: "Boolean", value: "Boolean" },
        { type: "Character", value: "Character" },
        { type: "Integer", value: "Integer" },
        { type: "Byte", value: "Byte" },
        { type: "Short", value: "Short" },
        { type: "Long", value: "Long" },
        { type: "Float", value: "Float" },
        { type: "Double", value: "Double" },
        { type: "BigDecimal", value: "BigDecimal" },
        { type: "Object", value: "Object" },
        { type: "Date", value: "Date" },
      ],
      // 添加参数列表参数
      dictListTables: [
        {
          prop: "dictryNo",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
          isTrue: true,
        },
        {
          prop: "dictryNm",
          minWidth: "30%",
          label: "参数中文名称",
          type: "text",
          tooltip: true,
          isTrue: true,
        },
        {
          prop: "dictryDescr",
          label: "参数描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
          isTrue: true,
        },
        {
          prop: "attributeTypNm",
          label: "属性类型",
          minWidth: "20%",
          type: "text",
          tooltip: true,
          isTrue: true,
        },
        {
          prop: "dictryTyp",
          filter: "paraTyp",
          label: "参数类型",
          minWidth: "15%",
          align: "center",
          type: "text",
          isTrue: true,
        },
        {
          prop: "dictryLength",
          label: "最大长度",
          minWidth: "15%",
          align: "center",
          type: "text",
          isTrue: true,
        },
      ],
      // 输入输出参数弹框的搜索表单
      formInline: {
        paramName: "",
        type: "",
      },
      allFlagObj: {}, //存储全选的状态
      recordList: [],
      paramsDefault: "choose",
      // 表单数据
      formData: {
        dictryNo: "", // 参数名称
        dictryNm: "", // 参数中文名称
        dictryKeyWord: "", // 关键字
        dictryEnglishFullName: "", // 英文名字全称
        dictryDescr: "", // 参数描述
        dictryTyp: "String", // 参数类型
        dictryLength: "", // 最大长度
        dictryEnm: "",
        dataSubstnNo: "",
        // dictryGateg: "", //所属分类
      },
      //服务资产基本信息绑定的验证规则
      rules: {
        dictryNo: [
          {
            required: true,
            trigger: "blur",
            message: "请输入参数名称",
          },
          {
            required: true,
            trigger: "blur",
            validator: this.validator,
          },
        ],
        dictryNm: [
          {
            required: true,
            trigger: "blur",
            message: "请输入参数中文名称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入包含中文的字段名称",
            validator: validate.containChinese,
          },
        ],
        dictryKeyWord: [
          {
            required: true,
            trigger: "blur",
            message: "请输入关键字",
          },
        ],
        dictryEnglishFullName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入英文名字全称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入英文",
            validator: validate.isEnglish,
          },
        ],
        dictryTyp: [
          { required: true, trigger: "blur", message: "请选择字段类型" },
        ],
        dictryLength: [
          // { required: true, trigger: "blur", validator: this.validator },
          { required: true, trigger: "blur", message: "请输入最大长度" },
        ],
        // dictryGateg: [
        //   { required: true, trigger: "blur", message: "请选择所属分类" },
        // ],
      },
      dictGategList: [],
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        // paraGateg: "", // 所属分类
        attributeTyp:"", //属性类型
      },
      // 子参数列表
      iInputList: [],
      iInputListTable: [
        {
          prop: "dictryNo",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          minWidth: "30%",
          label: "参数中文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryDescr",
          label: "参数描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        // {
        //   prop: "dictryGategName",
        //   label: "所属分类",
        //   minWidth: "20%",
        //   type: "text",
        // },
        {
          prop: "dictryTyp",
          filter: "paraTyp",
          label: "参数类型",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryLength",
          label: "最大长度",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryRule",
          label: "验证规则",
          minWidth: "30%",
          type: "text",
          operate: "read",
          tooltip: true,
        },
        {
          label: "操作",
          type: "button",
          width: "50",
          buttonList: [
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],

      // 表格筛选信息
      checkedColumns: [
        "参数名称",
        "参数中文名称",
        "参数描述",
        "属性类型",
        "参数类型",
        "最大长度",
      ],
      checkBoxGroup: [
        { label: "参数名称" },
        { label: "参数中文名称", disabled: true },
        { label: "参数描述" },
        { label: "属性类型" },
        { label: "参数类型" },
        { label: "最大长度" },
      ],
      reload: 0,
      beltLine:""
    };
  },
  methods: {
    changeColumn(val) {
      this.checkedColumns = val;
      let tempArr = this.checkBoxGroup.filter((i) => !val.includes(i.label));
      let arr = tempArr.map((item) => {
        return item.label;
      });
      this.dictListTables.filter((i) => {
        if (arr.indexOf(i.label) != -1) {
          i.isTrue = false;
        } else {
          i.isTrue = true;
        }
      });
      ++this.reload;
    },
    operate(operation, data) {
      if (operation == "delete") {
        this.delParams(this.iInputList, data.serialNumber);
      }
    },
    filterType(data) {
      let arr = data.map((params) => {
        return {
          paramKey: params.dictryNo,
          paramCName: params.dictryNm,
          paramLength: params.dictryLength,
          paramValueType: params.dictryTyp,
          paramDesc: params.dictryDescr,
          paramId: params.dictryId,
          paramEnum: params.dictryEnum,
          children: params.children ? this.filterType(params.children) : [],
          isPush: params.isPush,
        };
      });
      return arr;
    },
    // 添加子参数
    addChildParams(data) {
      let arr = [...this.iInputList, ...data];
      arr = unduplicated(arr, ["dictryId"]);
      arr = setSerialNumber(arr, "", "children");
      this.iInputList = JSON.parse(JSON.stringify(arr));
      this.formData.children = this.iInputList;
    },
    // 获取所属分类列表
    async getTypeList() {
      const params = { turnPageShowNum: "0" };
      const res = await this.rpc.dictionary.getClassifyTypeList(params);
      this.dictGategList = res.serviceList;
      const selectList = res.serviceList.map((item) => ({
        type: item.clsfNm,
        value: item.clsfId,
      }));
      this.serviceForm.find((item) => item.model == "paraGateg").select =
        selectList;
    },
    // 添加子参数
    addSonParams() {
      this.$refs.selectFromDataRef.showDialog();
    },
    // 去除没有被选中的子参数
    filterChild(arr) {
      let data = arr.filter((item, index) => {
        if (item.isPush) {
          if (item.children?.length) {
            item.children = item.children.filter((ii) => {
              return ii.isPush;
            });
          }
        }
        if (item.children && item.children.length) {
          this.filterChild(item.children);
        }
        return item.isPush;
      });
      return data;
    },
    saveParams() {
      this.filterChild(this.tableData);
      if (this.paramsDefault == "add") {
        this.addParams(this.tableData);
      } else {
        let arr = this.filterType(this.tableData);
        this.$emit("saveParams", arr, true, "userDefined");
        this.handleCancel();
      }
    },
    async addParams(data) {
      const params = await this.$refs.createData.preservation()
      params.isPush = true;
      data.push(params);
      let arr = this.filterType(data);
      console.log("过滤后", params, arr);
      this.$emit("saveParams", arr, true, "userDefined");
      this.handleCancel();
    },
    // tableData数据选中表格中
    isTableData() {
      this.recordList = JSON.parse(JSON.stringify(this.tableData));
      if (this.tableData.length > 0) {
        this.compArr(this.tableData, this.dictList);
      }
    },
    // 对比当前页参数是否被选中过
    compArr(arr1, arr2) {
      arr1.forEach((item) => {
        arr2.forEach((data) => {
          if (item.dictryId == data.dictryId) {
            data.isPush = item.isPush;
            this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
              data,
              item.isPush ? true : false
            );
            if (item.children?.length) {
              this.compArr(item.children, data.children);
            }
          }
        });
      });
    },
    showDialog(e) {
      this.allFlagObj = new Map();
      this.formInline.type = e;
      this.beltLine = this.$route.query.bizLineId;
      this.addVisible = true;
      this.getList();
      // this.getTypeList(); //获取所属分类列表
    },

    // 搜索元数据
    goSearch() {
      this.dicPager.currentPage = "1";
      this.getList();
    },
    // 重置搜索元数据
    resetFields() {
      this.formInline.paramName = "";
      this.dicPager.currentPage = "1";
      this.$refs.formRef.resetFields();
      this.searchRecord = {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        // paraGateg: "", // 所属分类
        attributeTyp:"",  //属性类型
      };
    },
    handleDicSizeChange(e) {
      this.dicPager.turnPageShowNum = e;
      this.getList();
    },
    handleDicCurrentChange(e) {
      this.getList();
    },
    //元数据列表
    async getList() {
      const param = {
        ...this.searchRecord,
        currentPage: this.dicPager.currentPage + "",
        turnPageShowNum: this.dicPager.turnPageShowNum,
        beltLine:this.beltLine
      };
      const res = await this.rpc.dictionary.getDictionaryList(param);
      this.dictList = setSerialNumber(
        res.dictionariesInfoBoList,
        "",
        "children"
      );
      this.dicPager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    // 删除当前点击的参数
    delParamsTag(e) {
      let index = this.dictList.findIndex(
        (item) => item.dictryId == e.dictryId
      );
      // let index = -1
      this.dictList.forEach((item) => {
        if (item.dictryId == e.dictryId) {
          item.isPush = 0;
        }
      });
      if (index == -1) {
        this.recordList.forEach((item) => {
          if (item.dictryId == e.dictryId) {
            item.isPush = 0;
            this.tableData = this.tableData.filter(
              (it) => it.dictryId != e.dictryId
            );
          }
        });
      }
      if (index != -1) {
        this.tableData = this.tableData.filter(
          (it) => it.dictryId != e.dictryId
        );
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
      // console.log(e, "delParamsTag",index,this.tableData,this.recordList);
    },

    //全选
    selectAll(data) {
      const page = this.dicPager.currentPage;
      const apiId = "11";
      let allFlag = true;
      if (this.allFlagObj.has(page)) {
        const id = this.allFlagObj.get(page);
        allFlag = !id;
        this.allFlagObj.set(page, allFlag);
      } else {
        this.allFlagObj.set(page, allFlag);
      }
      this.checkChildren(this.dictList, allFlag);
      this.getId(this.dictList);
    },
    // 多选
    checkSelect(data, row) {
      row.isPush = row.isPush ? false : true;
      if (row.children.length) {
        // 将子参数全部选中
        this.checkFun(row.children, row.isPush);
      }
      if (row.isPush) {
        // 去找当前选中的参数是否存在父节点,选中父节点
        this.CheckParentFun(this.dictList, row.serialNumber);
      } else {
        // 清空父节点
        this.clearParentFun(this.dictList, row.serialNumber);
      }
      this.tableData = [];
      this.getId(this.dictList);
    },
    // 子节点全部取消父节点清空
    clearParentFun(table, serialNumber) {
      let i = serialNumber.lastIndexOf(".");
      let pid =
        serialNumber.indexOf(".") != "-1"
          ? serialNumber.substring(0, i)
          : serialNumber;
      table.forEach((element) => {
        if (element.serialNumber.indexOf(pid) !== -1) {
          if (element.serialNumber == serialNumber) {
            element.isPush = 0;
            this.clearRecord(this.recordList, element);
            this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
              element,
              false
            );
          } else if (element.children && element.children > 0) {
            this.clearParentFun(element.children, serialNumber);
            let arr = element.children.filter((elementb) => {
              return elementb.isPush;
            });
            if (!arr.length) {
              this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
                element,
                false
              );
            }
          }
        }
      });
    },
    // 递归选中
    checkFun(data, status) {
      data.forEach((element) => {
        element.isPush = status;
        this.clearRecord(this.recordList, element);
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          element,
          element.isPush ? true : false
        );
        if (element.children) {
          this.checkFun(element.children, element.isPush);
        }
      });
    },
    // 选中子节点
    checkChildren(data, flag) {
      data.forEach((item) => {
        item.isPush = flag;
        this.clearRecord(this.recordList, item);
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          item,
          flag
        );
        if (item.children.length) {
          this.checkChildren(item.children, flag);
        }
      });
    },
    // 父节点选中
    CheckParentFun(table, serialNumber) {
      let i = serialNumber.lastIndexOf(".");
      //如果传过来的序列号存在小数点，则删除最后一个小数点及后的数字，否则就是要当前序列号
      let pid =
        serialNumber.indexOf(".") != "-1"
          ? serialNumber.substring(0, i)
          : serialNumber;
      table.forEach((element) => {
        // 将当前参数序列号的最后一位截取掉，再和pid进行判断是否相符
        // 如果是子参数，找到父参数并选中父参数
        if (serialNumber.indexOf(".") === -1) {
          if (pid === element.serialNumber) {
            element.isPush = 1;
            this.clearRecord(this.recordList, element);
            this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
              element,
              true
            );
          }
        } else if (pid.includes(element.serialNumber)) {
          element.isPush = 1;
          this.clearRecord(this.recordList, element);
          this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
            element,
            true
          );
          // 如果当前参数的序列号存在小数点，则代表不是最初始的父参数
          let parentFlag = element.serialNumber.indexOf(".");
          // 如果子参数的父参数还存在父id，就继续往上找
          if (parentFlag == "-1") {
            this.CheckParentFun(element.children, serialNumber);
          }
        }
      });
    },
    // 清空记录
    clearRecord(data, e) {
      data.forEach((item) => {
        if (e.dictryId == item.dictryId) {
          item.isPush = e.isPush;
        } else if (item.children.length) {
          this.clearRecord(item.children, e);
        }
      });
    },
    clearAll(data) {
      data.forEach((item) => {
        item.isPush = 0;
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          item,
          false
        );
        if (item.children.length) {
          this.clearAll(item.children);
        }
      });
    },
    // 获取选中ID
    getId(data) {
      let arr = [];
      data.map((element) => {
        if (element.isPush) {
          let temp = this.recordList.filter(
            (item) => item.dictryId == element.dictryId
          );
          if (!temp.length) {
            arr.push(element);
          }
        }
      });
      let recordList = this.recordList.filter((item) => item.isPush);
      this.tableData = [...recordList, ...arr];
      // this.tableData = recordList;
    },
    // 删除报文参数
    delParams(arrs, id) {
      let i = 0;
      while (arrs[i]) {
        if (arrs[i].serialNumber == id) {
          arrs.splice(i, 1);
          let d = 0;
          if (id.indexOf(".") != -1) {
            d = id.substring(0, id.length - 1);
          }
          for (let i = 0; i < arrs.length; i++) {
            arrs[i].serialNumber = d + (i + 1) + "";
          }
          return;
        }
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.delParams(arrs[i].children, id);
        }
        i++;
      }
      // this.$emit("delF","delF");
    },

    // 关闭从元数据选择弹窗
    handleCancel(e) {
      console.log("handleCancel", e);
      this.addVisible = false;
      this.tableData = [];
      this.resetFields();
      // this.$refs.formData.resetFields();
      this.paramsDefault = "choose";
      this.iInputList = [];
      this.clearAll(this.dictList);
      this.formData = {
        dictryNo: "", // 参数名称
        dictryNm: "", // 参数中文名称
        dictryKeyWord: "", // 关键字
        dictryEnglishFullName: "", // 英文名字全称
        dictryDescr: "", // 参数描述
        dictryTyp: "String", // 参数类型
        dictryLength: "", // 最大长度
        dictryEnm: "",
        dataSubstnNo: "",
        // dictryGateg: "", //所属分类
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.aop_tradedesign_download_design_comps_add_user_undefined {
}

.add_dialog {
  overflow-y: scroll !important;

  ::v-deep .el-dialog__body {
    padding: 0;
    height: 60vh;
  }

  .add_dialog_conf1 {
    display: flex;
    width: 100%;
    padding: 22px 20px;

    .middle {
      width: 100%;

      .search_conf {
        padding: 0 24px;
      }

      .content {
        padding: 0 24px;
        // margin-top: 12px;
        background: #fff;
      }
    }
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
}

.radio_group {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e7e7e7;
  padding: 10px;
}

.edit_form {
  // @include form;
  /deep/ .el-input,
  /deep/ .el-textarea__inner {
    width: 700px;
  }

  /deep/ .el-textarea__inner {
    height: 80px;
  }

  ::v-deep .el-form-item__label {
    width: 140px !important;
  }

  ::v-deep .el-form-item__content {
    margin-left: 140px !important;
  }

  ::v-deep .el-form-item .el-form-item__label {
    color: #333333 !important;
    font-weight: 400 !important;
  }

  // ::v-deep .el-button {
  //   @include large_button_common;
  // }
  .no_before {
    ::v-deep .el-form-item__label::before {
      content: "";
    }
  }
}

.radio_group {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e7e7e7;
  padding: 10px;
}
</style>