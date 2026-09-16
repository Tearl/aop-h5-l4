<template>
  <div class="aop_tradedesign_comps_dictionary_process_attr">
    <!-- 服务信息 -->
    <div class="attr_main" v-if="showType == 'service'">
      <div class="attr_tabs">
        <el-tabs v-model="serviceActive" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in tabsList"
            :label="item.v"
            :name="item.k"
            :key="index"
          ></el-tab-pane>
        </el-tabs>
      </div>

      <!-- 设置 -->
      <div class="attr_box" v-show="serviceActive == 'setting'">
        <div class="attr_send">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">输入参数</div>
            <i
              class="el-icon-arrow-down"
              :class="{hidden: inputParamsVisibleAtSetting}"
              @click="changeInputParamsVisible"
            >
            </i>
          </div>
          <div class="attr_show_item_c" v-show="inputParamsVisibleAtSetting">
            <Table
              class="table"
              :data="inputParamsListAtSetting"
              :table="inputParamsColumnAtSetting"
              @selectChange="selectChange"
            ></Table>
          </div>
        </div>
        <div class="attr_recive">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">输出参数</div>
            <i
              class="el-icon-arrow-down"
              :class="{hidden: outputParamsVisibleAtSetting}"
              @click="changeOutputParamsVisible"
            >
            </i>
          </div>
          <div class="attr_show_item_c" v-show="outputParamsVisibleAtSetting">
            <Table
              class="table"
              :data="outputParamsListAtSetting"
              :table="outputParamsColumnAtSetting"
            ></Table>
          </div>
        </div>
      </div>
      <!-- D4b服务信息 -->
      <div class="attr_box" v-show="serviceActive == 'd4b'">
        <div class="attr_show underLine">
          <div class="attr_show_item flex">
            <div class="item_title w96">D4b服务名称：</div>
            <div class="item_value text">交易快照查询</div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w96">D4b服务编码：</div>
            <div class="item_value text">/tanrferQuery</div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w96">D4b服务描述：</div>
            <div class="item_value text">交易快照查询描述</div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w96">服务类型：</div>
            <div class="item_value text">D4b服务</div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w96">版本号：</div>
            <div class="item_value text">1.0.0</div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w96">所属系统：</div>
            <div class="item_value text">交易查询</div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w96">服务大类：</div>
            <div class="item_value text">交易</div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w96">服务小类：</div>
            <div class="item_value text">查询</div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w96">版本描述：</div>
            <div class="item_value text">版本描述</div>
          </div>
          <div class="attr_show_item flex mb20">
            <div class="item_title w96">功能关键字：</div>
            <div class="item_value text">交易 快照 查询</div>
          </div>
          
          <div class="attr_show_item mb20">
            <div class="attr_show_item_t">输入参数</div>
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('input')"></i>
            </div>
            <div class="attr_show_item_c">
              <Table
                v-show="showAllInputParams"
                class="table"
                :data="inputParamsList"
                :table="inputParamsColumn"
              ></Table>
              <Table
                v-show="!showAllInputParams"
                class="table"
                :data="inputParamsList"
                :table="getPartInputParamsColumn(inputParamsColumn)"
              ></Table>
            </div>
          </div>

          <div class="attr_show_item mb20">
            <div class="attr_show_item_t">输出参数</div>
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('output')"></i>
            </div>
            <div class="attr_show_item_c">
              <Table
                v-show="showAllOutputParams"
                class="table"
                :data="outputParamsList"
                :table="outputParamsColumn"
              ></Table>
              <Table
                v-show="!showAllOutputParams"
                class="table"
                :data="outputParamsList"
                :table="getPartOutputParamsColumn(inputParamsColumn)"
              ></Table>
            </div>
          </div>

          <div class="attr_show_item mb20">
            <div class="attr_show_item_t">业务规则</div>
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="businessRuleList"
                :table="businessRuleColumn"
                @operate="businessRuleOperate"
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 需求信息 -->
    <div class="attr_main" v-if="showType == 'demand'">
      <div class="attr_title underLine">
        <div>需求信息</div>
      </div>
      <div class="attr_box">
        <div class="attr_show underLine">
          <div class="attr_show_item flex">
            <div class="item_title w96">服务接口名称：</div>
            <el-select
              size="mini"
              v-model="currentR4b"
              placeholder="请选择">
              <el-option
                v-for="item in r4bSvcList"
                :key="item.svcId"
                :label="item.svcNm"
                :value="item.svcId">
              </el-option>
            </el-select>
            <!-- <div class="item_value text">票据签收</div> -->
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w96">接口号：</div>
            <div class="item_value text">10065</div>
          </div>
          <div class="attr_show_item flex mb20">
            <div class="item_title w96">服务接口描述：</div>
            <div class="item_value text">票据签收</div>
          </div>

          <div class="attr_show_item mb20">
            <div class="attr_pre_title">
              <div class="attr_show_item_t">输入参数</div>
              <i
                class="el-icon-arrow-down"
                :class="{hidden: inputParamsVisibleAtSetting}"
                @click="changeInputParamsVisible"
              >
              </i>
            </div>
            <div class="attr_show_item_c" v-show="inputParamsVisibleAtSetting">
              <Table
                class="table"
                :data="inputParamsListAtSetting"
                :table="inputParamsColumnAtDemand"
                @selectChange="selectChange"
              ></Table>
            </div>
          </div>

          <div class="attr_show_item mb20">
            <div class="attr_pre_title">
              <div class="attr_show_item_t">输出参数</div>
              <i
                class="el-icon-arrow-down"
                :class="{hidden: outputParamsVisibleAtSetting}"
                @click="changeOutputParamsVisible"
              >
              </i>
            </div>
            <div class="attr_show_item_c" v-show="outputParamsVisibleAtSetting">
              <Table
                class="table"
                :data="outputParamsListAtSetting"
                :table="outputParamsColumnAtDemand"
              ></Table>
            </div>
          </div>

          <div class="attr_show_item mb20">
            <div class="attr_show_item_t">业务规则</div>
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="businessRuleList"
                :table="businessRuleColumn"
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="attr_main" v-if="showType == 'd4bInfo'">
      <div class="attr_tabs">
        <el-tabs v-model="d4bActive" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in d4bInfoTabsList"
            :label="item.v"
            :name="item.k"
            :key="index"
          ></el-tab-pane>
        </el-tabs>
      </div>

      <!-- 设置 -->
      <div class="attr_box" v-show="d4bActive == 'setting'">
        <div class="attr_send underLine">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">输入参数</div>
            <i
              class="el-icon-arrow-down"
              :class="{hidden: inputParamsVisibleAtSetting}"
              @click="changeInputParamsVisible"
            >
            </i>
          </div>
          <div class="attr_show_item_c" v-show="inputParamsVisibleAtSetting">
            <Table
              class="table"
              :data="inputParamsListAtSetting"
              :table="inputParamsColumnAtSetting"
              @selectChange="selectChange"
            ></Table>
          </div>
        </div>
        <div class="attr_recive">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">输出参数</div>
            <i
              class="el-icon-arrow-down"
              :class="{hidden: outputParamsVisibleAtSetting}"
              @click="changeOutputParamsVisible"
            >
            </i>
          </div>
          <div class="attr_show_item_c" v-show="outputParamsVisibleAtSetting">
            <Table
              class="table"
              :data="outputParamsListAtSetting"
              :table="outputParamsColumnAtSetting"
            ></Table>
          </div>
        </div>
      </div>

      <!-- D4b服务信息 -->
      <div class="attr_box" v-show="d4bActive == 'd4b'">
        <div class="attr_show underLine">
          <el-form
            :model="formData"
            :rules="rules"
            class="service_edit_form"
            ref="formData"
            label-width="90px"
          >
            <div class="service_edit_form_info">
              <el-form-item label="D4b服务名称" prop="servNm">
                <el-input
                  size="mini"
                  v-model="formData.servNm"
                  clearable
                  placeholder="请输入服务资产名称"
                  :disabled="pageMode == 'read'"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <el-form-item label="D4b服务ID" prop="servNo">
                <el-input
                  size="mini"
                  v-model="formData.servNo"
                  clearable
                  maxlength="100"
                  placeholder="请输入服务资产ID"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item label="D4b服务描述" prop="servDescr">
                <el-input
                  size="mini"
                  type="textarea"
                  :rows="4"
                  maxlength="150"
                  placeholder="请输入服务资产描述"
                  v-model="formData.servDescr"
                  clearable
                  show-word-limit
                >
                </el-input>
              </el-form-item>

              <el-form-item label="服务类型" prop="bizTypeId">
                <el-select
                  size="mini"
                  v-model="formData.bizTypeId"
                  :placeholder="请选择业务类型"
                  clearable
                  disabled
                >
                  <el-option
                    v-for="item in businessList"
                    :label="item.biztypeNm"
                    :key="item.biztypeId"
                    :value="item.biztypeId"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="版本号" prop="versNo">
                <div class="form_item_flex">
                  <el-input
                    size="mini"
                    v-model="formData.versNo"
                    clearable
                    placeholder="请输入版本号，例如1.0.0"
                  />
                </div>
              </el-form-item>

              <el-form-item label="版本描述" prop="versDescr">
                <el-input
                  size="mini"
                  type="textarea"
                  :rows="3"
                  v-model="formData.versDescr"
                  clearable
                  placeholder="请输入版本描述"
                />
              </el-form-item>

              <el-form-item label="功能关键字" prop="funcKeyword">
                <el-input
                  size="mini"
                  type="textarea"
                  :rows="3"
                  v-model="formData.funcKeyword"
                  clearable
                  placeholder="请输入功能关键字"
                />
              </el-form-item>
            </div>
          </el-form>

          <div class="attr_show_item mb20">
            <div class="attr_show_item_t">输入参数</div>
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('input')"></i>
            </div>
            <div class="attr_show_item_c">
              <Table
                v-show="showAllInputParams"
                class="table"
                :data="inputParamsList"
                :table="inputParamsColumn"
              ></Table>
              <Table
                v-show="!showAllInputParams"
                class="table"
                :data="inputParamsList"
                :table="getPartInputParamsColumn(inputParamsColumn)"
              ></Table>
            </div>
          </div>

          <div class="attr_show_item mb20">
            <div class="attr_show_item_t">输出参数</div>
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('output')"></i>
            </div>
            <div class="attr_show_item_c">
              <Table
                v-show="showAllOutputParams"
                class="table"
                :data="outputParamsList"
                :table="outputParamsColumn"
              ></Table>
              <Table
                v-show="!showAllOutputParams"
                class="table"
                :data="outputParamsList"
                :table="getPartOutputParamsColumn(inputParamsColumn)"
              ></Table>
            </div>
          </div>

          <div class="attr_show_item mb20">
            <div class="attr_show_item_t">业务规则</div>
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="businessRuleList"
                :table="businessRuleColumn"
                @operate="businessRuleOperate"
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="attr_main" v-if="showType == 'attr'">
      <!-- 组件参数 -->
      <div class="attr_title underLine">
        <div>{{ currentObj.actionName }}</div>
      </div>
      <div
        class="attr_box"
        v-if="currentObj.actionType == 'inputAction'">
        <div class="attr_send underLine">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">数据输入</div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="attr_innerTable"
              :data="sData"
              :table="sDataColumn"
              :rowK="'serialNumber'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
          <!-- <div class="attr_pre_title">
            <div class="attr_show_item_t">输入参数</div>
            <i
              class="el-icon-arrow-down"
              :class="{hidden: inputParamsVisibleAtSetting}"
              @click="changeInputParamsVisible"
            >
            </i>
          </div>
          <div class="attr_show_item_c" v-show="inputParamsVisibleAtSetting">
            <Table
              class="table"
              :data="inputParamsListAtSetting"
              :table="inputParamsColumnAtDemand"
              @selectChange="selectChange"
            ></Table>
          </div> -->
        </div>
        <!-- <div class="attr_recive">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">数据输出</div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="attr_innerTable"
              :data="rData"
              :table="rDataColumn"
              :rowK="'serialNumber'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
        </div> -->
      </div>
      <!-- <div
        class="attr_box"
        v-if="currentObj.actionType != 'startAction' && currentObj.actionType != 'endAction'">
        <div class="attr_send underLine">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">数据输入</div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="attr_innerTable"
              :data="sData"
              :table="sDataColumn"
              :rowK="'serialNumber'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
        </div>
        <div class="attr_recive">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">数据输出</div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="attr_innerTable"
              :data="rData"
              :table="rDataColumn"
              :rowK="'serialNumber'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
        </div>
      </div> -->
    </div>

    <div class="attr_main" v-if="showType == 'line'">
      <!-- 线条条件 -->
      <div class="attr_title underLine flex">
        <div>条件配置</div>
      </div>
      <div class="attr_box">
        <div class="attr_show underLine">
          <div class="attr_show_item">
            <div class="attr_show_item_t flex">
              <span class="title">优先级</span>
              <el-select
                :disabled="isRead"
                class="content"
                v-model="lineForm.condPrit"
                placeholder="优先级"
                size="small"
                @focus="handleCondPritFocus"
                @change="handleCondPritChange(currentLineObj, $event)"
              >
                <!-- <el-option label="优先级" value=""></el-option> -->
                <el-option
                  v-for="(item, index) in condLevel"
                  :disabled="item.disabled"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <el-tag size="small" type="warning">数字越小，优先级越高</el-tag>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t flex">
              <span class="title">条件描述</span>
              <el-input :disabled="isRead" class="content" v-model="currentLineObj.condition.desc" @blur="saveLine(false)"></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t flex">
              <div>条件配置</div>
              <span v-if="!isRead" class="right_btn" @click="showLine">编辑</span>
            </div>
            <el-input :value="getConditionDesc()" type="textarea" disabled placeholder=""></el-input>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误信息映射组件 -->
    <div class="attr_main set_error_msg" v-if="showType == 'setErrorMsgAction'">
      <div class="attr_title underLine">
        <div>错误信息映射</div>
      </div>
      <div class="attr_box">
        <div class="attr_show underLine">
          <div class="attr_show_item">
            <div class="attr_show_item_t">名称</div>
            <div class="attr_show_item_c">
              <el-input
                v-model="setErrorMsgData.actionDesc"
                size="mini"
                readonly
              ></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              <div>赋值</div>
            </div>
            <div class="attr_show_item_b">
              <el-button type="primary" size="small" @click="addsetErrorMsg"
                >添加</el-button
              >
            </div>
            <div class="attr_show_item_c">
              <Table
                class="attr_innerTable"
                :data="setErrorMsgList"
                :table="setErrorMsgtableColumn"
                @operate="setErrorMsgoperate"
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 规则组件 -->
    <div class="attr_main set_error_msg" v-if="showType == 'ruleAction'">
      <div class="attr_title underLine">
        <div>规则组件</div>
      </div>
      <div class="attr_box">
        <div class="attr_show underLine">
          <div class="attr_show_item flex">
            <div class="item_title required_fields">规则名称</div>
            <div class="item_value">
              <el-input
                v-model="ruleItemMsgData.name"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title required_fields">规则类型</div>
            <div class="item_value select">
              <el-select v-model="ruleItemMsgData.type" placeholder="请选择">
                <el-option
                  v-for="(item, index) in ruleTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title required_fields">规则描述</div>
            <div class="item_value">
              <el-input
                type="textarea"
                v-model="ruleItemMsgData.desc"
                size="mini"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <!-- <div
      class="attr_btn"
    >
      <el-button
        type="primary"
        size="small"
        @click="saveAction"
        class="right_button"
        >保存</el-button
      >
    </div> -->
    <!-- 条件配置 -->
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="'编辑条件配置'"
      :dialogVisiable="lineVisible"
      @closeDialog="cancelLine"
      class="newService_dialog"
    >
      <div slot="box">
        <div class="line_dialog_conf">
          <el-form :inline="true" :model="lineForm" class="add_conf">
            <span>已配置条件数：{{changeList.length}}</span>
            <el-form-item class="add_conf_btn">
              <el-button
                type="primary"
                @click="addLine"
                size="small"
                icon="el-icon-plus"
                >增加条件</el-button
              >
            </el-form-item>
          </el-form>
          <div class="add_condition">
            <el-form
              :inline="true"
              v-for="(item, index) in changeList"
              :key="index"
            >
              <el-form-item label="" class="add_condition_k" :class="{hidden: index == 0}">
                <el-select
                  v-model="item.mtchMode"
                  clearable
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    v-for="(item, index) in condAndOrOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" class="add_condition_k">
                <el-select
                  v-model="item.sorcParaTyp"
                  placeholder="请选择"
                  size="mini"
                >
                  <!-- <el-option label="值" value="01"></el-option> -->
                  <el-option label="参数" value="00"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label=""
                class="add_condition_k"
                v-if="item.sorcParaTyp == '01'"
              >
                <el-input
                  v-model="item.sorcParaVal"
                  clearable
                  placeholder="请输入"
                  size="mini"
                  @input="handleConditionInput(item, 's')"
                ></el-input>
              </el-form-item>
              <el-form-item
                label=""
                class="add_condition_k"
                v-if="item.sorcParaTyp == '00'"
              >
                <el-select
                  v-model="item.sorcParaVal"
                  clearable
                  placeholder="请选择"
                  size="mini"
                  @change="handleConditionSelect(item, 's')"
                >
                  <el-option
                    v-for="(e, index) in dicArray"
                    :label="e.paraNm"
                    :value="e.paraNo"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" class="add_condition_k">
                <el-select
                  v-model="item.condTyp"
                  clearable
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option
                    v-for="(item, index) in condOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" class="add_condition_k">
                <el-select
                  v-model="item.trgtParaTyp"
                  clearable
                  placeholder="请选择"
                  size="mini"
                  @change="handleTrgtParaTypChange(item)"
                >
                  <el-option label="值" value="01"></el-option>
                  <el-option label="选择参数" value="00"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label=""
                class="add_condition_k"
                v-if="item.trgtParaTyp == '01'"
              >
                <el-input
                  v-model="item.trgtParaVal"
                  clearable
                  placeholder="请输入"
                  size="mini"
                  @input="handleConditionInput(item, 't')"
                ></el-input>
              </el-form-item>
              <el-form-item
                label=""
                class="add_condition_k"
                v-if="item.trgtParaTyp == '00'"
              >
                <el-select
                  v-model="item.trgtParaVal"
                  clearable
                  placeholder="请选择"
                  size="mini"
                  @change="handleConditionSelect(item, 't')"
                >
                  <el-option
                    v-for="(e, index) in dicArray"
                    :label="e.paraNm"
                    :value="e.paraNo"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" class="add_condition_btn">
                <i
                  class="el-icon-delete-solid key_action"
                  @click="innerDelLine(index)"
                ></i>
              </el-form-item>
            </el-form>
          </div>

          <!-- <div class="add_content">
            <div class="add_content_t">条件描述</div>
            <el-form :inline="true">
              <el-input type="textarea" v-model="lineForm.desc" placeholder=""></el-input>
            </el-form>
          </div> -->
        </div>
      </div>
      <div slot="footer">
        <el-button @click="cancelLine">取 消</el-button>
        <el-button type="primary" @click="saveLine">确 定</el-button>
      </div>
    </PageDialog>

    <!-- 错误信息映射 -->
    <PageDialog
      dialogTitle="错误信息映射"
      :dialogVisiable="setErrorMsgVisible"
      dialogWidth="56.3%"
      @closeDialog="setErrorMsgcloseDialog"
    >
      <div slot="box">
        <el-form
          :model="setErrorMsgform"
          :rules="setErrorMsgformRules"
          ref="setErrorMsgformRef"
          label-width="120px"
          class="form"
        >
          <el-form-item label="源错误码" prop="errorCodeFieldName">
            <el-input v-model="setErrorMsgform.errorCodeFieldName" placeholder="请输入源错误码"></el-input>
          </el-form-item>
          <el-form-item label="映射错误码" prop="errorCodeMappingFieldName">
            <el-input v-model="setErrorMsgform.errorCodeMappingFieldName" placeholder="请输入映射错误码"></el-input>
          </el-form-item>
          <el-form-item label="映射错误信息" prop="errorMsgFieldName">
            <el-input v-model="setErrorMsgform.errorMsgFieldName" placeholder="请输入映射错误信息"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="setErrorMsgcloseDialog">取 消</el-button>
        <el-button type="primary" @click="setErrorMsgconfirm">确 定</el-button>
      </span>
      >
    </PageDialog>

    <!-- 规则详情 -->
    <PageDialog
      dialogTitle="规则详情"
      :dialogVisiable="ruleVisible"
      dialogWidth="56.3%"
      @closeDialog="ruleMsgCloseDialog"
    >
      <div slot="box" class="rule_dialog">
        <div class="rule_dialog_item">
          <span class="title">服务ID：</span>
          <span class="content">10000121</span>
        </div>
        <div class="rule_dialog_item">
          <span class="title">服务名称：</span>
          <span class="content">余额查询</span>
        </div>
        <div class="rule_dialog_item">
          <span class="title">规则描述：</span>
          <span class="content">余额查询的描述余额查询的描述余额查询的描述</span>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="ruleMsgCloseDialog">取 消</el-button>
        <el-button type="primary" @click="ruleMsgCloseDialog">确 定</el-button>
      </span>
      >
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table";
import PageDialog from "@m/core/components/page_dialog";
import { array2nested, setSerialNumber } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
  },
  name: "attr",
  props: {
    dicArray: {
      type: Array,
      default: () => [],
    },
    // 阅读模式
    isRead: {
      type: Boolean,
      default: () => false,
    },
    r4bSvcList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 输入数据
      sData: [],
      sDataColumn: [
        {
          prop: "paraNo",
          label: "参数名",
          minWidth: "60%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paraNm",
          label: "参数中文名",
          minWidth: "40%",
          type: "text",
          tooltip: true,
        },
      ],
      // 输出数据
      rData: [],
      rDataColumn: [
        {
          prop: "paraNo",
          label: "参数名",
          minWidth: "60%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paraNm",
          label: "参数中文名",
          minWidth: "40%",
          type: "text",
          tooltip: true,
        },
      ],
      bData: [
        { paraNm: "手续费", paraDescr: "手续费服务是否...", isNeed: "0" },
      ],
      //组件数据
      currentObj: {},
      // 画布数据
      dataObj: {
        servNm: "",
        servNo: "",
      },
      //当前对象
      currentLineObj: {},
      //判断类型
      showType: "d4bInfo",
      // 编辑表单
      form: {},
      //编辑条件配置 默认条件和优先级的数据
      lineForm: {
        deltCondFlg: "1",
        condPrit: "1",
        condList: [],
        desc: "",
      },
      //增加条件数据
      condList: [],
      changeList: [], //正在改变线条的存储
      //控制编辑条件配置显示或隐藏
      lineVisible: false,
      //编辑条件配置 选项
      condAndOrOptions: [
        { value: "AND", label: "并且" },
        { value: "or", label: "或" },
      ],
      //编辑条件配置 值的数据
      condLevel: [
        { value: "1", label: "1", disabled: false },
      ],
      //编辑条件配置 判断条件
      condOptions: [
        { label: "大于", value: ">" },
        { label: "大于等于", value: ">=" },
        { label: "等于", value: "==" },
        { label: "小于", value: "<" },
        { label: "小于等于", value: "<=" },
        { label: "不等于", value: "!=" },
      ],
      //tab切换
      tabsList: [
        { v: "设置", k: "setting" },
        { v: "服务信息", k: "d4b" },
        // { v: "需求信息", k: "demand" },
      ],
      serviceActive: "setting",
      d4bInfoTabsList: [
        { v: "设置", k: "setting" },
        { v: "D4b服务信息", k: "d4b" },
      ],
      d4bActive: "setting",
      // 错误信息映射
      setErrorMsgData: {
        actionDesc: "",
        errorCodeFieldName: "",
        errorCodeMappingFieldName: "",
        errorMsgFieldName: "",
      },
      // 错误信息映射列表
      setErrorMsgList: [],
      // 错误信息映射列表参数
      setErrorMsgtableColumn: [
        {
          prop: "errorCodeFieldName",
          label: "源错误码",
          minWidth: "23%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "errorCodeMappingFieldName",
          label: "映射错误码",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "errorMsgFieldName",
          label: "映射错误信息",
          minWidth: "35%",
          type: "text",
          tooltip: true,
        },
        {
          label: "操作",
          minWidth: "12%",
          type: "button",
          buttonList: [
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
      setErrorMsgVisible: false,
      setErrorMsgform: {
        errorCodeFieldName: "",
        errorCodeMappingFieldName: "",
        errorMsgFieldName: "",
      },
      setErrorMsgformRules: {
        errorCodeFieldName: [{ required: true, message: "请输入源错误码", trigger: "blur" }],
        // errorCodeMappingFieldName: [{ required: true, message: "请输入映射错误码", trigger: "blur" }],
        errorMsgFieldName: [{ required: true, message: "请输入映射错误信息", trigger: "blur" }],
      },
      // 规则类型选项
      ruleTypeOptions: [
        { value: "文本", label: "文本" },
        { value: "赋值", label: "赋值" },
        { value: "判断", label: "判断" },
        { value: "服务调用", label: "服务调用" },
      ],
      // 规则组件
      ruleItemMsgData: {
        name: "",
        type: "",
        desc: "",
      },
      // 输入参数表格列
      inputParamsColumn: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "20%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "paramNm",
          label: "参数中文名称",
          minWidth: "35%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "参数类型",
          minWidth: "25%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "required",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          align: "center",
          tooltip: true,
        }
      ],
      // 输入参数表格数据
      inputParamsList: [
        {paramKey: "acctTp", paramNm: "账号类型", paramType: "String", required: "是"}
      ],
      // 设置页签下的输入参数表格列
      inputParamsColumnAtSetting: [
        {
          prop: "paramNm",
          label: "中文名称",
          minWidth: "25%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "required",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "paramSource",
          label: "数据来源",
          minWidth: "30%",
          type: "text",
          size: "mini",
          align: "center",
          tooltip: true,
        },
        {
          prop: "paramSourceValue",
          label: "来源值",
          minWidth: "25%",
          type: "text",
          size: "mini",
          align: "center",
          tooltip: true,
        },
      ],
      // 设置页签下的输入参数表格数据
      inputParamsListAtSetting: [
        {paramKey: "acctTp", paramNm: "账号类型", required: "是", paramSource: "固定值", paramSourceValue: "枚举值"},
        {paramKey: "acctNm", paramNm: "账号名", required: "是", paramSource: "输入参数", paramSourceValue: "示例值"}
      ],
      // 设置页签下的输出参数表格列
      outputParamsColumnAtSetting: [
        {
          prop: "paramNm",
          label: "中文名称",
          minWidth: "30%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "required",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          align: "center",
          tooltip: true,
        }
      ],
      // 设置页签下的输出参数表格数据
      outputParamsListAtSetting: [
        {paramKey: "acctTp", paramNm: "账号类型", required: "是", paramSource: "固定值", paramSourceValue: "枚举值"},
        {paramKey: "acctNm", paramNm: "账号名", required: "是", paramSource: "输入参数", paramSourceValue: "示例值"}
      ],
      // 是否显示完整输入参数
      showAllInputParams: false,
      // 输出参数表格列
      outputParamsColumn: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "20%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "paramNm",
          label: "参数中文名称",
          minWidth: "35%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "参数类型",
          minWidth: "25%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "required",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          align: "center",
          tooltip: true,
        }
      ],
      // 输出参数表格数据
      outputParamsList: [
        {paramKey: "acctTp", paramNm: "账号类型", paramType: "String", required: "是"}
      ],
      // 是否显示完整输chu参数
      showAllOutputParams: false,
      // 业务规则表格列
      // businessRuleColumn: [
      //   {
      //     prop: "ruleNm",
      //     label: "规则名称",
      //     minWidth: "35%",
      //     type: "text",
      //     align: "center",
      //     tooltip: true,
      //   },
      //   {
      //     prop: "ruleType",
      //     label: "规则类型",
      //     minWidth: "25%",
      //     type: "text",
      //     align: "center",
      //     tooltip: true,
      //   },
      //   {
      //     prop: "ruleDesc",
      //     label: "规则描述",
      //     minWidth: "20%",
      //     type: "textClick",
      //     align: "center",
      //     tooltip: true,
      //   }
      // ],
      // 业务规则表格数据
      businessRuleList: [
        {ruleNm: "账号类型", ruleType: "String", ruleDesc: "描述"}
      ],
      // 需求信息页签下的业务规则表格列
      businessRuleColumnAtDemand: [
        {
          prop: "ruleNm",
          label: "规则名称",
          minWidth: "35%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "ruleType",
          label: "规则类型",
          minWidth: "25%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "ruleDesc",
          label: "规则描述",
          minWidth: "20%",
          type: "text",
          align: "center",
          tooltip: true,
        }
      ],
      //服务资产基本信息数据
      formData: {
        servNm: "", // 名称
        servNo: "", // 编号
        servDescr: "", // 描述
        versNo: "1.0.0", // 版本号
        versDescr: "", // 版本描述
        bizTypeId: "", // 业务类型
        funcKeyword: "", // 功能关键字
        sourceBusinessId: ""
      },
      // 控制设置页签下的输入参数列表显示或隐藏
      inputParamsVisibleAtSetting: true,
      // 控制设置页签下的输出参数列表显示或隐藏
      outputParamsVisibleAtSetting: true,
      // 控制规则详情对话框显示或隐藏
      ruleVisible: false,
      currentR4b: ""
    };
  },
  computed: {
    // d4b信息页签下的输入参数表格列
    inputParamsColumnAtD4bInfo() {
      if (this.showType == "service") {
        return [
          {
            prop: "paramKey",
            label: "参数名称",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
          {
            prop: "paramNm",
            label: "参数中文名称",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
          {
            prop: "required",
            label: "是否必输",
            minWidth: "20%",
            type: "text",
            align: "center",
            tooltip: true,
          },
        ]
      }
    },
    // d4b信息页签下的输出参数表格列
    outputParamsColumnAtD4bInfo() {
      if (this.showType == "service") {
        return [
          {
            prop: "paramKey",
            label: "参数名称",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
          {
            prop: "paramNm",
            label: "参数中文名称",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
          {
            prop: "required",
            label: "是否必输",
            minWidth: "20%",
            type: "text",
            align: "center",
            tooltip: true,
          },
        ]
      }
    },
    // 需求信息信息页签下的输入参数表格列
    inputParamsColumnAtDemand() {
      if (this.showType == "service") {
        return [
          {
            prop: "paramKey",
            label: "参数名称",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
          {
            prop: "paramNm",
            label: "参数中文名称",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
          {
            prop: "required",
            label: "是否必输",
            minWidth: "20%",
            type: "text",
            align: "center",
            tooltip: true,
          },
        ]
      }
    },
    // 需求信息信息页签下的输出参数表格列
    outputParamsColumnAtDemand() {
      if (this.showType == "service") {
        return [
          {
            prop: "paramKey",
            label: "参数名称",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
          {
            prop: "paramNm",
            label: "参数中文名称",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
          {
            prop: "required",
            label: "是否必输",
            minWidth: "20%",
            type: "text",
            align: "center",
            tooltip: true,
          },
        ]
      }
    },
    // 业务规则表格列
    businessRuleColumn() {
      ruleDescType = (this.showType == "service" && this.serviceActive == 'd4b') || (this.showType == "d4bInfo" && this.d4bActive == 'd4b') ? "textClick" : "text"
      return [
        {
          prop: "ruleNm",
          label: "规则名称",
          minWidth: "35%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "ruleType",
          label: "规则类型",
          minWidth: "25%",
          type: "text",
          align: "center",
          tooltip: true,
        },
        {
          prop: "ruleDesc",
          label: "规则描述",
          minWidth: "20%",
          type: ruleDescType,
          operate: "showRuleInfo",
          align: "center",
          tooltip: true,
        }
      ]
    },
  },
  created() {},
  methods: {
    init(data) {
      this.r4bSvcList = data.demandOptions
      this.currentR4b = data.r4bSvcId
    },
    getData() {
      
    },
    // 获取参数
    getAttr(e) {
      this.currentObj = e;
      if (e.paramList) {
        this.sData = setSerialNumber((array2nested(
          e.paramList.filter((item) => item.paraPosition == "0"), "paraPareId", "children"
        )));
        this.rData = setSerialNumber((array2nested(
          e.paramList.filter((item) => item.paraPosition == "1"), "paraPareId", "children"
        )));
        if (e.actionType == "executeFlowAction" || e.actionType == "newAction") {
          this.$emit("updateRecordFlow", e)
        }
      }
      if (e.actionType == "setErrorMsgAction") {
        this.setErrorMsgData = this.getAction(e.conf);
        this.setErrorMsgList = this.getErrorMsg(this.setErrorMsgData);
        this.showType = "setErrorMsgAction";
      } else if (e.actionType == "ruleAction") {
        this.showType = "ruleAction"
      } else {
        this.showType = "attr";
      }
    },
    // conf转换
    getAction(e) {
      let data = {};
      for (let i in e) {
        data[e[i].name] = e[i].value;
      }
      return data;
    },
    // ErrorMsg转换
    getErrorMsg(e) {
      let data = [];
      if(e.errorCodeFieldName == "" || !e.errorCodeFieldName || !e.errorCodeMappingFieldName || !e.errorMsgFieldName) return data
      let sppa = e.errorCodeFieldName.split("||") || [];
      let spsource = e.errorCodeMappingFieldName.split("||") || []
      let spdesc =  e.errorMsgFieldName.split("||") || [];
      for (let i in sppa) {
        let n = { errorCodeFieldName: sppa[i], errorCodeMappingFieldName: spsource[i], errorMsgFieldName: spdesc[i] }
        data.push(n)
      }
      return data;
    },
    // 保存动作
    saveAction() {
      console.log("saveAction")
      // if (this.showType == "setErrorMsgAction") {
      //   let s = this.setErrorMsgList.map(item => {
      //     return item.errorCodeFieldName
      //   })
      //   let m = this.setErrorMsgList.map(item => {
      //     return item.errorCodeMappingFieldName
      //   })
      //   let t = this.setErrorMsgList.map(item => {
      //     return item.errorMsgFieldName
      //   })
      //   this.setErrorMsgData.errorCodeFieldName = s.join("||")
      //   this.setErrorMsgData.errorCodeMappingFieldName = m.join("||")
      //   this.setErrorMsgData.errorMsgFieldName = t.join("||")
      //   this.updateDataParams(this.setErrorMsgData);
      // }
    },
    // 更新action
    updateDataParams(e) {
      for (let i in this.currentObj.conf) {
        this.currentObj.conf[i].value = e[this.currentObj.conf[i].name];
      }
      this.$emit("updateDataParams", this.currentObj);
    },
    // 获取条件
    getCondition(e, lineList) {
      const sameSourceLines = lineList.filter(item => item.sourceId == e.sourceId)
      // 已经选择了的优先级
      const cache = sameSourceLines.map(item => item.condition.condPrit)
      const condLevel = []
      for (let i = 0; i < sameSourceLines.length; i++) {
        condLevel[i] = { value: i + "", label: i + "" }
      }
      this.condLevel = condLevel
      this.currentLineObj = e;
      this.lineForm = this.currentLineObj.condition;
      if (!this.lineForm.condList) {
        this.lineForm.condList = [];
      }
      this.condList = this.lineForm.condList || [];
      this.showType = "line";
    },
    generateLineCondPrit(lineObj, lineList) {
      const sameSourceLines = lineList.filter(item => lineObj.sourceId == item.sourceId)
      lineObj.condition.condPrit = sameSourceLines.length - 1 + ""
      this.currentLineObj = lineObj
      this.$nextTick(() => {
        this.upDateCondition()
      })
    },
    // 获取资产参数
    getFlowParams(e) {
      this.currentObj = e;
      this.sData = e.paramList.filter((item) => item.paraPosition == "0");
      this.rData = e.paramList.filter((item) => item.paraPosition == "1");
      this.showType = "service";
      this.serviceActive = "setting";
    },
    //点击编辑条件配置按钮
    showLine() {
      console.log("this.condList", this.condList);
      this.changeList = JSON.parse(JSON.stringify(this.condList || []));
      if (this.changeList.length == 1 && this.changeList[0].sorcParaTyp == "") {
        this.changeList[0].sorcParaTyp = "00"
      }
      this.lineVisible = true;
    },
    //保存编辑条件配置
    saveLine(flag = true) { // flag：是否进行填写项校验
      if (flag) {
        let i 
        this.changeList.forEach((item, index) => {
          if(!((item.mtchMode || index == 0) && item.sorcParaVal && item.condTyp && item.trgtParaTyp && item.trgtParaVal)) {
            i = true
          } else {
            i = false
          }
        })
        if(i) return this.$message.error("条件填写有误")
      }
      this.condList = JSON.parse(JSON.stringify(this.changeList));
      this.lineForm.condList = this.condList;
      this.currentLineObj.condition = this.lineForm;
      this.upDateCondition();
      this.lineVisible = false;
    },
    //取消编辑条件配置
    cancelLine() {
      this.lineVisible = false;
    },
    //删除添加的条件
    innerDelLine(e) {
      this.changeList.splice(e, 1);
    },
    //在左侧面板删除已配置的条件
    delLine(e) {
      console.log("删除", this.e);
      this.condList.splice(e, 1);
      this.upDateCondition();
    },
    //点击增加条件按钮
    addLine() {
      const d = {
        mtchMode: "AND",
        sorcParaTyp: "00",
        sorcParaVal: "",
        condTyp: "==",
        trgtParaTyp: "01",
        trgtParaVal: "",
      };
      this.changeList.push(d);
    },
    //输入框的值发生改变
    handleConditionInput(e, i) {
      if (i == "s") {
        e.sorcParaNm = e.sorcParaVal;
      } else {
        e.trgtParaNm = e.trgtParaVal;
      }
      this.$forceUpdate();
    },
    //下拉框的值发生改变
    handleConditionSelect(e, i) {
      if (i == "s") {
        e.sorcParaNm = this.dicArray.filter(
          (item) => item.paraNo == e.sorcParaVal
        )[0].paraNm;
      } else {
        e.trgtParaNm = this.dicArray.filter(
          (item) => item.paraNo == e.trgtParaVal
        )[0].paraNm;
      }
      this.$forceUpdate();
    },
    //更新数据 并向父组件返回当前对象
    upDateCondition() {
      this.$emit("updateConditionEvent", this.currentLineObj);
    },
    // 更新资产参数
    upDateFlowParams() {
      this.currentObj.input = this.sData;
      this.currentObj.output = this.rData;
      const d = this.sData.concat(this.rData);

      this.currentObj.paramList = d;
      this.$emit("upDateFlowParams", this.currentObj);
    },
    //返回两个值或者是参数之间的条件判断类型
    condType(e) {
      return filters.condType(e);
    },
    //返回当前条件的类型 为 并且 还是 或
    condAndOr(e) {
      return filters.condAndOr(e);
    },
    // 错误信息添加参数
    addsetErrorMsg() {
      this.setErrorMsgVisible = true;
      this.setErrorMsgform.errorCodeFieldName = "";
      this.setErrorMsgform.errorCodeMappingFieldName = "";
      this.setErrorMsgform.errorMsgFieldName = "";
    },
    setErrorMsgcloseDialog() {
      this.setErrorMsgVisible = false;
    },
    // 错误信息确认参数
    setErrorMsgconfirm() {
      this.$refs.setErrorMsgformRef.validate(valid => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        this.setErrorMsgList.push(JSON.parse(JSON.stringify(this.setErrorMsgform)));
        this.saveAction()
        this.setErrorMsgcloseDialog();
      })
    },
    // 点击错误信息列表的操作列按钮
    setErrorMsgoperate(e, data) {
      this.setErrorMsgList = this.setErrorMsgList.filter(item => (item.errorCodeFieldName != data.errorCodeFieldName || item.errorMsgFieldName != data.errorMsgFieldName))
      this.saveAction()
    },
    // 获取线的条件配置描述
    getConditionDesc() {
      return this.condList.reduce((pre, item, index) => {
        return `${pre}${index != 0 ? this.mtchModeFilter(item.mtchMode) : ""}${item.sorcParaNm}${item.condTyp}${item.trgtParaNm}`     
      }, "")
    },
    mtchModeFilter(value) {
      switch (value) {
        case "AND":
          return "&&"
        case "or":
          return "||"
        default:
          return value
      }
    },
    handleTrgtParaTypChange(data) {
      data.trgtParaVal = ""
    },
    // 线条的优先级下拉框改变值时
    handleCondPritChange(lineObj, e) {
      this.$emit("handleCondPritChange", e, this.handleCondPritChange.oldCondPrit, lineObj)
      this.handleCondPritChange.oldCondPrit = e
      this.$forceUpdate()
    },
    handleCondPritFocus(e) {
      this.handleCondPritChange.oldCondPrit = e.target.value
    },
    // 切换表格的显示模式（是否完整显示）
    switchTableMode(e) {
      if (e == "input") this.showAllInputParams = !this.showAllInputParams
      if (e == "output") this.showAllOutputParams = !this.showAllOutputParams
    },
    // 获取部分输入参数的表格列
    getPartInputParamsColumn(data) {
      return data.filter((item, index) => {
         return index == 1 || index == 3
      })
    },
    // 获取部分输出参数的表格列
    getPartOutputParamsColumn(data) {
      return data.filter((item, index) => {
         return index == 1 || index == 3
      })
    },
    // 关闭规则详情弹窗
    ruleMsgCloseDialog() {
      this.ruleVisible = false;
    },
    // 点击业务规则列表的操作列按钮
    businessRuleOperate(operation, data) {
      console.log("businessRuleOperate", operation, data)
      this.ruleVisible = true
    },
    // 切换设置页签下的输入参数列表的显示
    changeInputParamsVisible() {
      this.inputParamsVisibleAtSetting = !this.inputParamsVisibleAtSetting
    },
    // 切换设置页签下的输出参数列表的显示
    changeOutputParamsVisible() {
      this.outputParamsVisibleAtSetting = !this.outputParamsVisibleAtSetting
    },
    selectChange(row, prop) {
      if (prop == "paramSource") {
        if (row.paramSource == "输入参数" || row.paramSource == "临时变量") {
          row.paramSourceValue = row.paramNm
        }
      }
    }
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dictionary_process_attr {
  position: relative;
  overflow: hidden;
  .attr_main {
    height: 100%;
    ::v-deep .el-table__cell {
      padding: 2px 0;
      .cell {
        span {
          font-size: 12px;
        }
      }
    }
    ::v-deep tr {
      .cell {
        font-size: 12px;
        padding: 0 ;
      }
    }
  }
  .attr_title {
    padding: 8px 10px;
    font-family: $font_medium;
    &.flex {
      display: flex;
      justify-content: space-between;
      .right_btn {
        color: $theme_color;
        cursor: pointer;
      }
    }
  }
  .attr_pre_title {
    // padding: 8px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .el-icon-arrow-down {
      cursor: pointer;
      &.hidden {
        transform: rotate(180deg);
      }
    }
    .attr_pre_title_b {
      color: $reg_ft_color;
    }
  }
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 102px;
  }
  .attr_show {
    padding: 8px 10px;
    overflow: hidden;
    .attr_show_item {
      margin-bottom: 10px;
      overflow: hidden;
      position: relative;
      font-size: 14px;
      &.flex {
        display: flex;
        .item_title {
          width: 80px;
          padding-right: 4px;
          padding-top: 4px;
          text-align: right;
          font-size: 12px;
          font-weight: $font_weight_600;
          &.required_fields {
            &::before {
              content: "*";
              color: $sec_danger_color;
              margin-right: 2px;
            }
          }
          &.w96 {
            width: 96px;
          }
        }
        .item_value {
          flex: 1;
          ::v-deep .el-textarea__inner {
            height: 80px;
          }
          &.select {
            ::v-deep .el-input--suffix {
              font-size: 12px;
            }
          }
          &.text {
            font-size: 12px;
            padding-top: 4px;
          }
        }
      }
      &.mb20 {
        margin-bottom: 20px;
      }
      .attr_show_item_t {
        width: 100%;
        margin-right: 10px;
        margin-bottom: 10px;
        font-weight: $font_weight_600;
        &.flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            width: 64px;
          }
          .content {
            flex: 1;
          }
          .right_btn {
            color: $theme_color;
            cursor: pointer;
          }
        }
      }
      .attr_show_item_c {
        width: 100%;
      }
      .attr_show_item_b {
        position: absolute;
        right: 0;
        top: 0;
        ::v-deep .el-button {
          @include mini_button_common;
          height: 20px;
          &.el-button--default.is-plain {
            border-color: $sec_ft_color;
            color: $sec_ft_color;
            &:hover,
            &:focus {
              color: $sec_ft_color;
            }
          }
          &.el-button--danger.is-plain {
            border-color: $danger_color;
            &:hover,
            &:focus {
              color: $danger_color;
            }
          }
          &.el-button--primary {
            background-color: $theme_color;
            border-color: $theme_color;
          }
          &.is-plain {
            background-color: $base_white;
            &:hover,
            &:focus {
              color: $theme_color;
            }
          }
        }
        .el-icon-more {
          cursor: pointer;
        }
      }
    }
  }
  .attr_send {
    padding: 8px 10px;
  }
  .attr_recive {
    padding: 8px 10px;
  }
  .underLine {
    border-bottom: 1px solid $pri_br_color;
  }
  .attr_set_f {
    width: 68px;
    margin-right: 10px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ::v-deep .el-input--mini .el-input__inner {
      height: 24px;
    }
  }
  .attr_set_s {
    width: 116px;
    margin-right: 5px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .attr_set_ad {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    width: 16px;
    float: right;
    color: $reg_ft_color;
    cursor: pointer;
  }
  .attr_set_t {
    width: 16px;
    float: right;
    .key_action {
      font-size: 16px;
      height: 24px;
      line-height: 24px;
    }
    i {
      cursor: pointer;
    }
  }
  .attr_set_l {
    width: 186px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .key_title {
    padding: 0px 0px 8px;
    overflow: hidden;
    color: $sec_ft_color;
    display: flex;
    justify-content: space-between;
  }
  .key_list {
    overflow: hidden;
    .key_item {
      margin-bottom: 5px;
      overflow: hidden;
      .attr_set_f_ml {
        margin-left: 10px;
      }
      ::v-deep .el-input__inner {
        line-height: 28px;
        border: 1px solid $pri_br_color;
        border-radius: $theme_radius;
        height: 28px;
        color: $reg_ft_color;
        padding: 0 5px;
      }
    }
  }

  ::v-deep .el-input__inner {
    line-height: 32px;
    border: 1px solid $pri_br_color;
    border-radius: $theme_radius;
    height: 32px;
    color: $reg_ft_color;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  ::v-deep .el-table thead tr th {
    background-color: $base_bg_color;
  }
  .line_dialog_conf {
    .add_conf {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      display: flex;
      align-items: center;
      .add_conf_s {
        width: 90px;
      }
      .add_conf_t {
        width: 90px;
      }
      .add_conf_btn {
        // float: right;
        margin-left: auto;
      }
    }
    .add_condition {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      .add_condition_k {
        width: 110px;
        margin-right: 2px;
      }
      .add_condition_btn {
        cursor: pointer;
      }
      .hidden {
        visibility: hidden;
      }
    }
    .add_content {
      padding: 15px 20px;
      .add_content_t {
        margin-bottom: 15px;
        font-family: $font_medium;
      }
      .add_content_l {
        padding: 15px;
        background-color: $base_bg_color;
      }
    }
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
  .attr_tabs {
    display: flex;
    // justify-content: center;
    background-color: $base_white;
    width: 100%;
    border-bottom: 2px solid #dcdfe6;
    box-shadow: 0 1px 10px 0 #e7e7e7;
    // ::v-deep .el-tabs__active-bar {
    //   width: 50px !important;
    // }
    ::v-deep .el-tabs__nav-wrap::after {
      background-color: $base_white;
    }
    ::v-deep .el-tabs__header {
      margin: 0;
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        padding: 0 15px;
        font-family: $font_medium;
        letter-spacing: 0;
        min-width: 78px;
        text-align: center;
        &.is-active {
          font-weight: $font_weight_600;
        }
      }
    }
    ::v-deep .el-tabs__content {
      display: none;
    }
  }
  .form {
    width: 70%;
    margin: 24px auto;
  }
  .attr_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    width: calc(100% - 10px);
    padding-bottom: 10px;
    background: $base_white;
    z-index: 10;
    ::v-deep .el-button {
      @include normal_button_common;
      width: 112px;
      color: $reg_ft_color;
      background: $base_white;
      border: 1px solid $pri_br_color;
      &.el-button--primary {
        @include primary_button;
      }
    }
  }
  .service_edit_form {
    ::v-deep .el-form-item__label {
      font-size: 12px;
    }
  }
  .service_edit_form_info {
    margin-bottom: 16px;
    .el-form-item {
      margin-bottom: 8px;
    }
  }
  .rule_dialog {
    padding: 15px 24px;
    .rule_dialog_item {
      margin-bottom: 10px;
    }
  }
}
</style>