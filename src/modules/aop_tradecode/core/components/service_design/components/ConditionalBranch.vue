<template>
  <div class="condition-builder" :data-sequence="sequence">
    <img class="close_icon" v-show="isComponent && compSeqNo != 0" src="@m/assets/images/icon_fail.png" @click="$emit('compDel', compSeqNo)" alt="">
    <div class="header">
      <div class="start-end-group">
        <div class="group">
          <label>起点组件：</label>
          <el-input disabled v-model="startGroup" v-if="fourRAttrFlag"></el-input>
          <el-select v-else class="select_width" v-model="startGroup" disabled placeholder="请选择起点组件">
            <el-option
              v-for="group in startGroups"
              :key="group.value"
              :label="group.label"
              :value="group.value"
            />
          </el-select>
        </div>
        <div class="group">
          <label>终点组件：</label>
          <el-input disabled v-model="endGroup" v-if="fourRAttrFlag"></el-input>
          <el-select v-else @change="endActionIdChange" v-model="endGroup" :disabled="compSeqNo == 0 && executeLength != 1 " placeholder="请选择终点组件">
            <el-option
              v-for="group in endGroups"
              :key="group.value"
              :label="group.label"
              :value="group.value"
            />
          </el-select>
          <!-- <el-cascader
            ref="compCascader"
            class="cascader-with-caret"
            @change="cascaderChange"
            v-model="endGroup"
            disabled
            :options="preOptions"
            :props="{ checkStrictly: true }"
          >
          </el-cascader> -->
        </div>
      </div>
    </div>

    <div class="condition-table">
      <div class="add-condition-group">
        <label>前提条件：</label>
        <el-button type="primary" @click="addConditionGroup"
        v-if="!isRead"
          >+ 添加条件组</el-button
        >
      </div>
      <el-table
        :data="conditions"
        border
        style="width: 100%"
        :span-method="tableSpan"
      >
        <el-table-column prop="groupId" label="条件组" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.groupId }}
          </template>
        </el-table-column>
        <el-table-column prop="actionId" label="来源" min-width="120">
          <template slot-scope="scope">
            <el-select :disbled="isRead" @change="targetSelectChange(scope.row, 'actionId')" v-model="scope.row.actionId" placeholder="请选择">
              <el-option
                v-for="source in startSources"
                :key="source.value"
                :label="source.label"
                :value="source.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="paramNm" label="来源值" min-width="120">
          <template slot-scope="scope">
            <span class="span_blue" @click="selectOperate('paramNm', scope.row, scope.$index)">{{scope.row.paramNm || "选择"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="condTyp" label="比较符" min-width="100">
          <template slot-scope="scope">
            <el-select :disbled="isRead" v-model="scope.row.condTyp" placeholder="请选择">
              <el-option
                v-for="operator in operators"
                :key="operator.value"
                :label="operator.label"
                :value="operator.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="paramValueSrcActionId" label="来源" min-width="120">
          <template slot-scope="scope">
            <el-select :disbled="isRead" @change="targetSelectChange(scope.row, 'paramValueSrcActionId')" v-model="scope.row.paramValueSrcActionId" placeholder="请选择">
              <el-option
                v-for="source in endSources"
                :key="source.value"
                :label="source.label"
                :value="source.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="paramValueNm" label="来源值" min-width="120">
          <template slot-scope="scope">
            <el-input @change="scope.row.paramValueNm = scope.row.paramValue" v-if="scope.row.paramValueSrcActionId == '10'" v-model="scope.row.paramValue"></el-input>
            <span v-else class="span_blue" @click="selectOperate('paramValue', scope.row, scope.$index)">{{scope.row.paramValueNm || "选择"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="groupOperator" label="关系符" min-width="100">
          <template slot-scope="scope">
            <el-select v-if="scope.$index !== conditions.length - 1" v-model="scope.row.groupOperator" placeholder="请选择" :disabled="scope.$index === conditions.length - 1">
              <el-option v-for="relation in relations" :key="relation.value" :label="relation.label" :value="relation.value"
              />
            </el-select>
            <span v-else>/</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200" v-if="!isRead">
          <template slot-scope="scope">
            <span class="action" @click="mergeConditionGroup(scope.$index)"
              >添加</span
            >
            <span class="action" @click="removeCondition(scope.$index)"
              >删除</span
            >
            <span
              class="action"
              @click="moveUp(scope.$index)"
              :class="{ disabled: isMoveUpDisabled(scope.row, scope.$index) }"
              >上移</span
            >
            <span
              class="action"
              @click="moveDown(scope.$index)"
              :class="{ disabled: isMoveDownDisabled(scope.row, scope.$index)  }"
              >下移</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="condition-description">
      
      <div>
        <label>条件描述：</label>
        <el-radio-group :disabled="isRead" v-model="relDescType" @change="relTypeChange">
          <el-radio label="0">系统默认</el-radio>
          <el-radio label="1">自定义</el-radio>
        </el-radio-group>
      </div>
      <el-input
        type="textarea"
        v-model="conditionDescription"
        :rows="3"
        class="condition_desc_width"
        placeholder="请输入条件描述"
        :disabled="isRead"
      ></el-input>
    </div>
  </div>
</template>

<script>
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId } from "@m/utils/normalData";
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  props: {
    currentCompInfo: {
        type: Object,
        default: () => {}
    },
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    baseBranchInfo: {
      type: Array,
      default: () => {},
    },
    /**
     * 组件编号
     */
    compSeqNo: {
      type: Number,
      default: null
    },
    sequence: {
      type: Number,
      default: null
    },
    /**
     * 是否是拖入点击组件编排
     */
    isComponent: {
      type: Boolean,
      default: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
    executeLength: {
      type: Number,
      default: 0
    },
    allSelections: Array
  },
  inject: ["getDataList", "setCurrentActionId"],
  data() {
    return {
      endGroup: '',
      relDescType: '0',
      operators: [
        { value: "=", label: "等于" },
        { value: "!=", label: "不等于" },
        { value: ">", label: "大于" },
        { value: ">=", label: "大于等于" },
        { value: "<", label: "小于" },
        { value: "<=", label: "小于等于" },
        { value: "contain", label: "包含" },
        { value: "uncontain", label: "不包含" }
      ],
      relations: [
        {
          label: '与',
          value: '&&'
        },
        {
          label: '或',
          value: '||'
        },
        {
          label: '与非',
          value: '&&!'
        },
        {
          label: '或非',
          value: '||!'
        },
      ],
      conditions: [],
      conditionDescription: '',
      previousSelection: '', // 记录上一次选择的终点
      calssList: [],
      errorList: [],
      classCd: '',
      errCd: '',
      errMsg: '',
      classNm: '',
      preOptions: [],
      firstSelect: false
    };
  },
  watch: {
    baseBranchInfo: {
      async handler(val) {
        console.log(val, 'val-----baseBranchInfo')
        // const treeStructure = await this.queryErrorMessageList()
        this.conditions = JSON.parse(val.executeConditionJson)
        this.relDescType = val.relDescType || '0'

        
        if(this.fourRAttrFlag) {
          this.endGroup = val.endActionNm
        } else {
          this.endGroup = val.endActionId ? val.endActionId  : ''
        }

        this.conditionDescription = val.relDesc ? val.relDesc : ''
      },
      deep: true
    },
    conditions: {
      handler(newData) {
        if(this.relDescType == '0') {
          this.conditionDescription = this.conditionDescriptionFormat(newData)
        }
        
      },
      deep: true
    }
  },
  computed: {

    // preOptions() {
    //   return this.getDataList().reduce((prev, data) => {
    //     const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
    //     prev.push({
    //       label: `${data.actionName}(${actionSeq})`,
    //       value: data.compositeId,
    //       leaf: true,
    //     })
    //     return prev
    //   }, [{label: '抛出异常', value: 'error',disabled: true}])
    // },

    startGroups() {
      return this.getDataList().filter(e => e.actionType != 'throwExceptionAction').reduce((prev, data) => {
        const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
        prev.push({
          label: `${data.actionName}(${actionSeq})`,
          value: data.compositeId
        })
        return prev
      }, [])
    },

    endGroups() {
      console.log(this.currentServObj, 'endGroups------')
      return this.getDataList().filter(e => e.actionType != 'throwExceptionAction' && e.compositeId != this.startGroup).reduce((prev, data) => {
        const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
        prev.push({
          label: `${data.actionName}(${actionSeq})`,
          value: data.compositeId,
        })
        return prev
      }, [])
      
    },

    startSources() {
      return this.getDataList().reduce((prev, data) => {
        if (sourceActionType.includes(data.actionType)  && data.compositeId) {
          const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
          prev.push({
            label: `${data.actionName}(${actionSeq})`,
            value: data.compositeId
          })
        }
        return prev
      }, [{ label: "当前4b交易", value: this.currentServObj?.svcId }])
    },

    endSources() {
      return this.getDataList().reduce((prev, data) => {
        if (sourceActionType.includes(data.actionType)  && data.compositeId) {
          const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
          prev.push({
            label: `${data.actionName}(${actionSeq})`,
            value: data.compositeId
          })
        }
        return prev
      }, [{ label: "当前4b交易", value: this.currentServObj?.svcId }, { label: '固定值', value: '10' }])
    },
    startGroup() {
      if(this.fourRAttrFlag) {
        return this.baseBranchInfo?.startActionNm
      } else {
        console.log(this.currentCompInfo,this.baseBranchInfo, 'this.currentCompInfo------')
        return this.baseBranchInfo?.startActionId ? this.baseBranchInfo?.startActionId : this.currentCompInfo?.compositeId
      }
      
    },

    svcIdToSvcNm() {
      return this.getDataList().reduce((prev, data) => {
        if (sourceActionType.includes(data.actionType)  && data.compositeId) {
          prev[data.compositeId] = data.actionName
        }
          return prev
        }, { [this.currentServObj?.svcId]: "当前4b交易" })
      }
      
  },
  async mounted() {
    
    this.initForm()
  },
  methods: {
    initForm() {
      console.log(this.baseBranchInfo, this.endGroups,this.getDataList(), 'this.baseBranchInfo')
      if(this.baseBranchInfo.executeConditionJson) {
        this.conditions = JSON.parse(this.baseBranchInfo.executeConditionJson)
      }
      
      this.relDescType = this.baseBranchInfo.relDescType || '0'

      
      if(this.fourRAttrFlag) {
          this.endGroup = this.baseBranchInfo.endActionNm
        } else {
          this.endGroup = this.baseBranchInfo.endActionId ? this.baseBranchInfo.endActionId  : ''
        }

      this.conditionDescription = this.baseBranchInfo.relDesc ? this.baseBranchInfo.relDesc : ''
    },


    relTypeChange() {
      if(this.relDescType == '0') {
        this.conditionDescription = this.conditionDescriptionFormat(this.conditions)
      } else {
        this.conditionDescription = this.baseBranchInfo.relDesc ? this.baseBranchInfo.relDesc : ''
      }
    },
    conditionDescriptionFormat(arr) {
      let resultString = '';
      // 记录上一个组的最后一个groupOperator
      let lastGroupOperator = '';

      // 先按groupId分组
      const grouped = arr.reduce((acc, item) => {
        const key = item.groupId;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});
      // 遍历每个groupId下的数据
      Object.keys(grouped).forEach(groupId => {
        const groupItems = grouped[groupId];
        let groupString = '';

        // 遍历groupId下的所有数据，拼接字符串
        groupItems.forEach((item, index) => {
          const paramNm = item.paramNm || 'null';  // 如果paramNm为空，替换为null
          const paramValueNm = item.paramValueNm || 'null';  // 如果paramValueNm为空，替换为null
          const actionNm = item.actionNm || 'null';  // 如果paramNm为空，替换为null
          const srcActionNm = item.srcActionNm || 'null';  // 如果paramValueNm为空，替换为null
          const str = `${actionNm}.${paramNm}${item.condTyp}${srcActionNm}.${paramValueNm}`;
          
          // 如果是第一个元素，则不加操作符
          if (index === 0) {
            groupString = str;
          } else {
            groupString += `${groupItems[index-1].groupOperator}${str}`;
          }
        });
        // 如果是第一个groupId的数据，则直接加入结果字符串
        if (resultString === '') {
          resultString = `(${groupString})`;
        } else {
          resultString += ` ${previousGroupOperator} (${groupString})`;
        }

        // 更新lastGroupOperator为当前组最后一项的groupOperator
        previousGroupOperator = groupItems[groupItems.length - 1].groupOperator;
        
      });

      return resultString;
    },
    dataOutput() {
      let targetInfo = this.getDataList().find(e => e.compositeId == this.endGroup)
      this.conditions.forEach((item, i) => {
        item.conditionId = i + 1
        if (item.actionId === this.currentServObj?.svcId) {
          item.paramKeySrcType = '00'
        } else {
          item.paramKeySrcType = '20'
        }
        const id = item.paramValueSrcActionId
        if (id === '10') {
          item.paramValueSrcType = '10'
        } else if (id === this.currentServObj?.svcId) {
          item.paramValueSrcType = '00'
        } else {
          item.paramValueSrcType = '20'
        }
      })
      if(this.conditions.length) {
        this.conditions[this.conditions.length-1].groupOperator = ''
      }
      let data = {
        startActionId: this.startGroup,
        endActionId: this.endGroup,
        relDesc: this.conditionDescription,
        relDescType: this.relDescType,
        endActionType: '00',
        executeConditionJson: JSON.stringify(this.conditions),
        relId: this.baseBranchInfo.relId,
        tranId: this.baseBranchInfo.tranId,
        sourceId: !this.isComponent ? this.baseBranchInfo.actionId : this.currentCompInfo.sourceId,
        targetId: targetInfo?.actionId,
      }
      
      return data
    },
    generateUniqueTimestamp() {
      const timestamp = Date.now();  // 当前的时间戳（毫秒）
      const randomNum = Math.floor(Math.random() * 1000);  // 随机生成一个 0-999 之间的数字
      
      // 返回组合后的唯一时间戳
      return `${timestamp}${randomNum}`;
    },
    addConditionGroup() {
      const newGroup = {
        groupId: String.fromCharCode(97 + this.conditions.length), // 自动生成组名 a, b, c...
        actionId: "",
        actionNm: "",
        actionPostSeq: "",
        condTyp: "=",
        paramValueSrcActionId: "",
        paramValueNm: "",
        paramValue: "",
        groupOperator: "&&",
        id: String.fromCharCode(97 + this.conditions.length) + new Date().getTime()
      };
      this.conditions.push(newGroup);
    },
    mergeConditionGroup(index) {
      // 当前行组名
      const currentGroup = this.conditions[index].groupId;

      // 新增条件行，组名与当前行一致
      const newCondition = {
        groupId: currentGroup,
        actionId: "",
        actionNm: "",
        actionPostSeq: "",
        condTyp: "=",
        paramValueSrcActionId: "",
        paramValueNm: "",
        paramValue: "",
        groupOperator: "&&",
        id: currentGroup + new Date().getTime()
      };

      // 在当前行之后插入
      this.conditions.splice(index + 1, 0, newCondition);
    },
    removeCondition(index) {
      this.conditions.splice(index, 1);
    },
    moveUp(index) {
      // const temp = this.conditions[index];
      // this.conditions.splice(index, 1);
      // this.conditions.splice(index - 1, 0, temp);
      const group = this.conditions[index];
      if (!this.isMoveUpDisabled(group, index)) {
        const temp = this.conditions[index];
        this.conditions.splice(index, 1);
        this.conditions.splice(index - 1, 0, temp);
      }
    },
    moveDown(index) {
      // const temp = this.conditions[index];
      // this.conditions.splice(index, 1);
      // this.conditions.splice(index + 1, 0, temp);
      const group = this.conditions[index];
      if (!this.isMoveDownDisabled(group, index)) {
        const temp = this.conditions[index];
        this.conditions.splice(index, 1);
        this.conditions.splice(index + 1, 0, temp);
      }
    },
    isMoveUpDisabled(group, index) {
      console.log(this.conditions, 'conditions------')
      // 检查组内是否只有一条数据，且该数据是第一条
      const groupCount = this.getGroupCount(group.groupId);
      if(index == 0) {
        return true
      } else {
        return groupCount > 1 && index === this.conditions.findIndex(item => item.groupId === group.groupId); // 组内多条数据，且是第一条
      }
      
    },
    isMoveDownDisabled(group, index) {
      // 检查组内是否只有一条数据，且该数据是最后一条
      const groupCount = this.getGroupCount(group.groupId);
      if(index == this.conditions.length -1) {
        return true
      } else {
        return groupCount > 1 && index === groupCount // 组内多条数据，且是最后一条
      }
      
    },
    isFirstInGroup(group, index) {
      // 判断是否为组的第一条数据
      return this.conditions.findIndex(item => item.groupId === group) === index;
    },
    isLastInGroup(group, index) {
      // 判断是否为组的最后一条数据
      return this.conditions.lastIndexOf(this.conditions.find(item => item.groupId === group)) === index;
    },
    getGroupCount(group) {
    // 获取该组的所有条目数量
    return this.conditions.filter(item => item.groupId === group).length;
  },
    tableSpan({ row, column, rowIndex, columnIndex }) {
      // 对 "条件组" 列进行合并
      if (column.property === "groupId") {
        // 查找相同组的开始索引
        const group = row.groupId;
        const startIndex = this.conditions.findIndex(
          (item) => item.groupId === group
        );

        // 计算当前组的长度
        const groupLength = this.conditions.filter(
          (item) => item.groupId === group
        ).length;

        // 只在组的第一行显示组名，其余行隐藏
        if (rowIndex === startIndex) {
          return { rowspan: groupLength, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
    },
    selectOperate(operate, scope, index) {
      if(operate == 'paramNm' && !scope.actionId) {
        this.$message.error('请先选择来源！')
        return
      }
      if(operate == 'paramValue' && !scope.paramValueSrcActionId) {
        this.$message.error('请先选择来源！')
        return
      }
      this.$emit('operate', operate, scope, index)
    },
    targetSelectChange(row, prop) {
      if (prop == "paramNm") {
        const item = this.formData.paramList.find(item => item.paramCName == row.paramNm)
        // const tfrCdtnCd = JSON.parse(row.tfrCdtnCd || "{}")
        // tfrCdtnCd.paramKey = item.paramKey
        // tfrCdtnCd.paramNm = item.paramCName
        // row.tfrCdtnCd = JSON.stringify(tfrCdtnCd)
        row.paramKey = item.paramKey
      } else if (prop == "actionId") {
        // const tfrCdtnCd = JSON.parse(row.tfrCdtnCd || "{}")
        // tfrCdtnCd.paramKey = ""
        // tfrCdtnCd.paramNm = ""
        // tfrCdtnCd.actionId = ""
        // row.tfrCdtnCd = JSON.stringify(tfrCdtnCd)
        row.paramKey = ""
        row.paramNm = ""
        row.actionNm = this.svcIdToSvcNm[row.actionId]
      } else if (prop == "paramValueSrcActionId") {
        row.paramValue = ''
        row.paramValueNm = ''
        row.srcActionNm = this.svcIdToSvcNm[row.paramValueSrcActionId]
        if (row.paramValueSrcActionId === '10') {
          row.srcActionNm = '固定值'
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.condition-builder {
  padding: 20px;
  margin: 24px 20px;
  font-family: Arial, sans-serif;
  border: 1px solid #ebeef5;
  position: relative;

  /deep/ .el-select__caret {
    color: #333;
    transform: rotateZ(0);
    &::before {
      content: "\e790"
    }
  }

  .close_icon {
    position: absolute;
    right: -12px;
    top: -12px;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}

.condition-builder::before {
    content: attr(data-sequence); /* 动态获取序号 */
    position: absolute;
    top: -10px; /* 使文本在边框上方 */
    left: 50%;
    transform: translateX(-50%); /* 水平居中 */
    background-color: #fff; /* 设置背景色，使文本不被边框覆盖 */
    padding: 0 5px; /* 设置背景颜色的内边距，形成文本框效果 */
  }
.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.start-end-group {
  display: flex;
  align-items: center;
  gap: 20px;
}
.group label {
  font-size: 14px;
  font-weight: normal;
  margin-right: 10px;
}
.condition-table {
  margin-bottom: 20px;

  .add-condition-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  

  
}
.condition-description {
  margin-top: 20px;

  .condition_desc_width {
    margin-top: 12px;
  }
}
textarea {
  width: 100%;
  resize: none;
}
button {
  margin: 0 5px;
}
.action {
  margin-right: 10px;
  cursor: pointer;
  color: #409eff;
  text-decoration: underline;
}
.action.disabled {
  color: #ccc;
  cursor: not-allowed;
  text-decoration: none;
}

/deep/.el-input__suffix {
  top: -5px;
}


.span_blue {
  color: #409eff;
  cursor: pointer;
}
.select_width {
  width: 200px;
}
.cascader-with-caret {
  position: relative;
  width: 200px;
  height: 32px;
  line-height: 32px;

  /deep/.el-icon-arrow-down:before { 
    display: none;
  }
  /deep/ .el-input--suffix {
    height: 32px;
  }

}
 
.cascader-with-caret:after {
  content: '';
  position: absolute;
  right: 10px; /* 调整位置 */
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;  /* 透明边框 */
  border-right: 5px solid transparent; /* 透明边框 */
  border-top: 6px solid black;  /* 实心的粗箭头 */
}
</style>
