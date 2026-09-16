<template>
    <div class="aop_workgate_comps_page_big_data">
        <div
            :ref="type == '' ? 'dataRef' : ''"
            class="big_data_wrapper"
            :class="type == '' ? parentClass : ''"
        >
            <el-row type="flex" v-if="type == ''" class="grid_no_re">
                <el-col :span="2"
                    ><div class="grid_header">参数Key</div></el-col
                >
                <el-col :span="2"
                    ><div class="grid_header">参数名称</div></el-col
                >
                <el-col :span="paramsType =='output'?1:2"
                    ><div class="grid_header">参数值类型</div></el-col
                >
                <el-col :span="paramsType =='output'?1:2"
                    ><div class="grid_header">参数长度</div></el-col
                >
                <el-col
                    :span="2"
                    v-show="paramsType == 'output'"
                    ><div class="grid_header">来源</div></el-col
                >
                <el-col
                    :span="2"
                    v-show="paramsType == 'output'"
                    ><div class="grid_header">来源值</div></el-col
                >
                <el-col
                    :span="2"
                    v-show="
                        paramsType == 'input' && detailInfo.isSignature == '1'
                    "
                    ><div class="grid_header">签名验签</div></el-col
                >
                <el-col
                    :span="2"
                    v-show="
                        paramsType == 'output' &&
                        detailInfo.isDesensitization == '1'
                    "
                    ><div class="grid_header">脱敏类型</div></el-col
                >
                <el-col
                    :span="2"
                    v-show="paramsType == 'input' && detailInfo.isEncode == '1'"
                    ><div class="grid_header">解密类型</div></el-col
                >
                <el-col
                    :span="2"
                    v-show="
                        paramsType == 'output' && detailInfo.isEncode == '1'
                    "
                    ><div class="grid_header">加密类型</div></el-col
                >
                <el-col :span="paramsType =='output'?1:2"
                    ><div class="grid_header">是否必输</div></el-col
                >
                <el-col :span="paramsType =='output'?1:2"
                    ><div class="grid_header">默认值</div></el-col
                >
                <el-col :span="2"
                    ><div class="grid_header">参数描述</div></el-col
                >
                <el-col :span="2"
                    ><div class="grid_header">枚举值</div></el-col
                >
                 <el-col :span="2"
                    ><div class="grid_header">类所在包名</div></el-col
                >
                <el-col :span="2"
                    ><div class="grid_header">参数类英文名称</div></el-col
                >
                <el-col :span="2"
                    ><div class="grid_header">参数类中文名称</div></el-col
                >
                <el-col :span="2"
                    ><div class="grid_header">参数KEY索引</div></el-col
                >
                <div class="grid_header_operation">
                    <div class="grid_header">操作</div>
                </div>
            </el-row>
            <el-row v-if="data.length > 0" class="grid_no_re">
                <div
                    class="grid_item"
                    v-for="(item, index) in data"
                    :key="index"
                >
                    <!-- 参数Key -->
                    <el-col :span="2"
                        ><div
                            class="grid_content gird_name"
                            :style="{ paddingLeft: level * 20 + 'px' }"
                        >
                            <i
                                v-if="item.children && item.children.length > 0"
                                class="grid_icon"
                                :class="
                                    item.showChild
                                        ? 'el-icon-caret-bottom'
                                        : 'el-icon-caret-right'
                                "
                                @click="handleChildShow(item)"
                            ></i>
                            <el-input
                                v-model="item.paramKey"
                                size="small"
                                clearable
                                placeholder=""
                                :disabled="
                                    item.disabled || item.disabledDefault
                                "
                                maxlength="50"
                                @blur="paramKeyBlur(item)"
                            >
                            </el-input></div
                    ></el-col>
                    <!-- 参数名称 -->
                    <el-col :span="2"
                        ><div class="grid_content">
                            <!-- {{item}} -->
                            <el-input
                                v-model="item.paramCName"
                                size="small"
                                clearable
                                placeholder=""
                                :disabled="
                                    item.disabled || item.disabledDefault
                                "
                                maxlength="50"
                            >
                            </el-input></div
                    ></el-col>
                    <!-- 参数值类型 -->
                    <el-col :span="paramsType =='output'?1:2"
                        ><div class="grid_content">
                            <template
                                v-if="!item.paramValueType.includes('List')"
                            >
                                <el-select
                                    v-model="item.paramValueType"
                                    size="small"
                                    @change="handleValueType(item)"
                                    :disabled="item.disabled || true"
                                >
                                    <el-option
                                        v-for="(nItem, nI) in item.typeList"
                                        :value="nItem.value"
                                        :key="nI"
                                        :label="nItem.type"
                                        >{{ nItem.type }}</el-option
                                    >
                                </el-select>
                            </template>
                            <template v-else>
                                <el-cascader
                                    @change="handleChange(item)"
                                    v-model="item.paramValueTypeList"
                                    :options="TYPE_LIST"
                                    :props="{ checkStrictly: true }"
                                ></el-cascader>
                            </template>
                        </div>
                    </el-col>
                    <!-- 参数长度 -->
                    <el-col :span="paramsType =='output'?1:2"
                        ><div class="grid_content">
                            <el-input
                                v-model="item.paramLength"
                                size="small"
                                clearable
                                placeholder=""
                                maxlength="10"
                                :disabled="
                                    item.disabled || item.valueDisabled || true
                                "
                            >
                            </el-input></div
                    ></el-col>
                    <!-- 来源 -->
                    <el-col
                        :span="2"
                        v-show="paramsType == 'output'"
                        ><div class="grid_content">
                            <el-select
                                v-model="item.actionId"
                                size="small"
                                :disabled="
                                    (item.disabled &&
                                        item.sourceFlag &&
                                        pageType !== 'paramsSet' &&
                                        item.apSource != '120') ||
                                    item.disabled2
                                "
                                @change="
                                    handleSelectChange(
                                        'actionId',
                                        $event,
                                        item,
                                        'selectRef' + index
                                    )
                                "
                                clearable
                            >
                                <el-option
                                    v-for="(nItem, nI) in getSourceList(
                                        item,
                                        true
                                    )"
                                    :value="nItem.value"
                                    :key="nI"
                                    :label="getOptionsName('actionName', nItem)"
                                ></el-option>
                            </el-select></div
                    ></el-col>
                    <!-- 来源值 -->
                    <el-col
                        :span="2"
                        v-show="paramsType == 'output'"
                        ><div class="grid_content">
                            <el-select
                                class="tree_select_container"
                                popper-class="aop_h5_l4_comps_page_big_data_tree_select_container"
                                :ref="`${item.paramDirection}-${item.paramOrder}`"
                                v-model="item.paraMapgNm"
                                size="small"
                                :disabled="
                                    getRowDisabled('paraMapgNm', item) ||
                                    item.disabled3
                                "
                                @change="
                                    handleSelectChange(
                                        'paraMapgNm',
                                        $event,
                                        item
                                    )
                                "
                                @focus="handleSelectFocus(item)"
                                clearable
                            >
                                <div class="search_area">
                                    <el-input
                                        v-if="item.actionId != 'constantValue'"
                                        v-model="formData.paramCName"
                                        placeholder="请输入参数名"
                                        size="small"
                                        clearable
                                        @input="handleInput(item, $event)"
                                    ></el-input>
                                </div>
                                <el-option class="select_tree_option" disabled>
                                    <el-tree
                                        v-if="item.actionId != 'constantValue'"
                                        ref="paramCNameTreeRef"
                                        :highlight-current="true"
                                        :data="getParamCNameTree(item)"
                                        :props="defaultProps"
                                        :default-expanded-keys="defaultExpanded"
                                        :current-node-key="currentKey"
                                        :load="loadNode"
                                        lazy
                                        node-key="paramOrder"
                                        :expand-on-click-node="false"
                                    >
                                        <div
                                            class="custom_tree_node"
                                            slot-scope="{ node, data }"
                                        >
                                            <div
                                                :class="
                                                    data.disabled
                                                        ? 'disabled'
                                                        : ''
                                                "
                                                @click.stop="
                                                    handleNodeClick(
                                                        item,
                                                        data,
                                                        node,
                                                        'paramCName'
                                                    )
                                                "
                                            >
                                                {{ data.paramCName }}
                                            </div>
                                        </div>
                                    </el-tree>

                                        <!-- :data="enumList" -->
                                    <el-tree
                                        v-show="item.actionId == 'constantValue'"
                                        ref="paramCNameTreeRefEnum"
                                        :data="enumList"
                                        :highlight-current="true"
                                        :props="defaultProps"
                                        :load="loadEnumNode"
                                        lazy
                                    >
                                    <div
                                            class="custom_tree_node"
                                            slot-scope="{ node, data }"
                                        >
                                            <div
                                                @click.stop="
                                                    handleNodeClick(
                                                        item,
                                                        data,
                                                        node,
                                                        'paramCName'
                                                    )
                                                "
                                            >
                                                {{ data.label }}
                                            </div>
                                        </div>
                                    </el-tree>
                                </el-option>
                            </el-select>
                        </div></el-col
                    >
                    <!-- 解密类型 -->
                    <el-col
                        :span="2"
                        v-show="
                            paramsType == 'input' &&
                            detailInfo.isSignature == '1'
                        "
                        ><div class="grid_content">
                            <el-select
                                v-model="item.signatureType"
                                size="small"
                                :disabled="item.disabled"
                            >
                                <el-option
                                    v-for="(nItem, nI) in signatureList"
                                    :value="nItem.value"
                                    :key="nI"
                                    :label="nItem.type"
                                    >{{ nItem.type }}</el-option
                                >
                            </el-select>
                        </div></el-col
                    >
                    <!-- 脱敏类型 -->
                    <el-col
                        :span="2"
                        v-show="
                            paramsType == 'output' &&
                            detailInfo.isDesensitization == '1'
                        "
                        ><div class="grid_content">
                            <el-cascader
                                v-model="item.desensitizationTypeList"
                                @change="
                                    handleClickParent(
                                        item,
                                        'cascader' + item.paramId
                                    )
                                "
                                :emitPath="false"
                                :class="'cascader' + item.paramId"
                                :show-all-levels="false"
                                @visible-change="
                                    handleClickParent(
                                        item,
                                        'cascader' + item.paramId
                                    )
                                "
                                class="aop_workgate_comps_page_big_data_cascader"
                                :options="item.isFilterList"
                                :props="{ checkStrictly: true }"
                            >
                                <template slot-scope="{ data }">
                                    <div @click="handleClickChange(data, item)">
                                        <span v-if="data.type !== 'input'">{{
                                            data.text
                                        }}</span>
                                        <div v-if="data.type === 'input'">
                                            <div>
                                                开始位置：<el-input
                                                    v-model="start"
                                                    style="width: 80px"
                                                    @input="
                                                        handleChangeInput(
                                                            $event,
                                                            item,
                                                            'start'
                                                        )
                                                    "
                                                    size="small"
                                                ></el-input>
                                            </div>
                                        </div>
                                        <div v-if="data.type === 'input'">
                                            <div>
                                                结束位置：<el-input
                                                    v-model="end"
                                                    style="width: 80px"
                                                    @input="
                                                        handleChangeInput(
                                                            $event,
                                                            item,
                                                            'end'
                                                        )
                                                    "
                                                    size="small"
                                                ></el-input>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </el-cascader></div
                    ></el-col>
                    <!-- 解密类型 -->
                    <el-col
                        :span="2"
                        v-show="
                            paramsType == 'input' && detailInfo.isEncode == '1'
                        "
                        ><div class="grid_content">
                            <el-select
                                v-model="item.apEncryType"
                                size="small"
                                :disabled="item.disabled"
                            >
                                <el-option
                                    v-for="(nItem, nI) in apEncryTypeList"
                                    :value="nItem.value"
                                    :key="nI"
                                    :label="nItem.type"
                                    >{{ nItem.type }}</el-option
                                >
                            </el-select>
                        </div></el-col
                    >
                    <!-- 加密类型 -->
                    <el-col
                        :span="2"
                        v-show="
                            paramsType == 'output' && detailInfo.isEncode == '1'
                        "
                        ><div class="grid_content">
                            <el-select
                                v-model="item.apEncryType"
                                size="small"
                                :disabled="item.disabled"
                            >
                                <el-option
                                    v-for="(nItem, nI) in apEncryTypeList"
                                    :value="nItem.value"
                                    :key="nI"
                                    :label="nItem.type"
                                    >{{ nItem.type }}</el-option
                                >
                            </el-select>
                        </div></el-col
                    >
                    <!-- 是否必输 -->
                    <el-col :span="paramsType =='output'?1:2"
                        ><div class="grid_content">
                            <el-select
                                v-model="item.isNeed"
                                size="small"
                                :disabled="item.disabled"
                            >
                                <el-option
                                    v-for="(nItem, nI) in isNeedList"
                                    :value="nItem.value"
                                    :key="nI"
                                    :label="nItem.type"
                                    >{{ nItem.type }}</el-option
                                >
                            </el-select>
                        </div></el-col
                    >
                    <!-- 默认值 -->
                    <el-col :span="paramsType =='output'?1:2"
                        ><div class="grid_content">
                            <el-input
                                v-model="item.paramValue"
                                size="small"
                                clearable
                                placeholder=""
                                :disabled="item.disabled"
                                maxlength="500"
                            >
                            </el-input></div
                    ></el-col>

                    <!-- 参数描述 -->
                    <el-col :span="2"
                        ><div class="grid_content">
                            <el-input
                                v-model="item.paramDesc"
                                size="small"
                                clearable
                                placeholder=""
                                :disabled="
                                    item.disabled || item.disabledDefault
                                "
                                maxlength="500"
                            >
                            </el-input></div
                    ></el-col>
                    <!-- 枚举值 -->
                    <el-col :span="2"
                        ><div class="grid_content">
                            <el-input
                                v-model="item.apEnum"
                                size="small"
                                clearable
                                placeholder=""
                                :disabled="
                                    item.disabled || item.disabledDefault
                                "
                                maxlength="500"
                            >
                            </el-input></div
                    ></el-col>
                        <!-- 类所在包名 -->
                    <el-col :span="2"
                        ><div class="grid_content">
                            <el-input
                                v-model="item.packageName"
                                size="small"
                                clearable
                                placeholder=""
                                :disabled="
                                    item.disabled 
                                "
                                maxlength="500"
                            >
                            </el-input></div
                    ></el-col>
                     <!-- 参数类英文名称 -->
                    <el-col :span="2"
                        ><div class="grid_content">
                            <el-input
                                v-model="item.classEnName"
                                size="small"
                                clearable
                                placeholder=""
                                :disabled="
                                    item.disabled 
                                "
                                maxlength="500"
                            >
                            </el-input></div
                    ></el-col>
                     <!-- 参数类中文名称 -->
                    <el-col :span="2"
                        ><div class="grid_content">
                            <el-input
                                v-model="item.classCnName"
                                size="small"
                                clearable
                                placeholder=""
                                :disabled="
                                    item.disabled 
                                "
                                maxlength="500"
                            >
                            </el-input></div
                    ></el-col>
                     <!-- 参数KEY索引 -->
                    <el-col :span="2"
                        ><div class="grid_content">
                            <el-input
                                v-model="item.paramKeyIndex"
                                size="small"
                                clearable
                                placeholder=""
                                :disabled="
                                    item.disabled 
                                "
                                maxlength="500"
                            >
                            </el-input></div
                    ></el-col>
                    <div
                        class="grid_content_operation"
                        :style="{
                            left:
                                type == ''
                                    ? opereationLeft + 'px'
                                    : chilLeft + 'px',
                        }"
                    >
                        <el-button
                            type="text"
                            size="small"
                            class="add_btn"
                            @click="add(item)"
                            v-if="
                                item.paramValueType === 'List' ||
                                item.paramValueType == 'Object'
                            "
                            :disabled="
                                (item.disabled &&
                                    item.paramKey != 'bodyData' &&
                                    item.paramKey != 'bodyOutData') ||
                                item.childTier >= 4
                            "
                            >添加</el-button
                        >
                        <el-button
                            type="text"
                            size="small"
                            v-if="
                                item.paramValueType != 'List' &&
                                item.paramValueType != 'Object'
                            "
                            :class="getDeleteBtn(item)"
                            @click.native="del(item)"
                            :disabled="item.disabled"
                            >删除</el-button
                        >
                        <el-dropdown
                            v-show="
                                detailInfo.isSignature == '1' ||
                                item.paramValueType == 'List' ||
                                item.paramValueType == 'Object'
                            "
                        >
                            <span
                                class="operation_link"
                                :class="
                                    item.disabled && item.paramPosition != '0'
                                        ? 'more_unClick'
                                        : ''
                                "
                            >
                                更多<i
                                    class="el-icon-arrow-down el-icon--right"
                                ></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    v-show="detailInfo.isSignature == '1'"
                                    @click.native="moveData(item, index, -1)"
                                    class="del_style"
                                    :disabled="
                                        index === 0 ||
                                        item.paramKey === 'bodyData' ||
                                        item.paramKey === 'bodyOutData'
                                    "
                                    >上移</el-dropdown-item
                                >
                                <el-dropdown-item
                                    v-show="detailInfo.isSignature == '1'"
                                    @click.native="moveData(item, index, 1)"
                                    class="del_style"
                                    :disabled="
                                        index === data.length - 1 ||
                                        item.paramKey === 'bodyData' ||
                                        item.paramKey === 'bodyOutData'
                                    "
                                    >下移</el-dropdown-item
                                >
                                <el-dropdown-item
                                    :disabled="
                                        item.paramValueType !== 'List' &&
                                        item.paramValueType !== 'Object'
                                    "
                                    @click.native="addByDic(item)"
                                    >从服务添加</el-dropdown-item
                                >
                                <el-dropdown-item
                                    :disabled="
                                        !(
                                            item.paramValueType === 'List' ||
                                            item.paramValueType === 'Object'
                                        )
                                    "
                                    @click.native="addObj(item)"
                                    >添加对象</el-dropdown-item
                                >
                                <el-dropdown-item
                                    :disabled="
                                        !(
                                            item.paramValueType === 'List' ||
                                            item.paramValueType === 'Object'
                                        )
                                    "
                                    @click.native="addList(item)"
                                    >添加列表</el-dropdown-item
                                >
                                <el-dropdown-item
                                    :disabled="
                                        getRowDisabled('deleteSubParams', item)
                                    "
                                    @click.native="deleteSubParams(item)"
                                    >清空子参数</el-dropdown-item
                                >
                                <el-dropdown-item
                                    v-if="
                                        !(
                                            item.paramValueType != 'List' &&
                                            item.paramValueType != 'Object'
                                        )
                                    "
                                    @click.native="del(item)"
                                    class="del_style"
                                    :disabled="item.disabled"
                                    >删除</el-dropdown-item
                                >
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <PageBigData
                        v-if="
                            item.children &&
                            item.children.length > 0 &&
                            item.showChild
                        "
                        :pageType="pageType"
                        :data="item.children"
                        :isCascader="isCascader"
                        :paramsType="paramsType"
                        type="child"
                        :level="level + 1"
                        class="grid_child"
                        :chilLeft="type == '' ? opereationLeft : chilLeft"
                        :sourceList="sourceList"
                        :compositeIdMapToParamList="compositeIdMapToParamList"
                        :detailInfo="detailInfo"
                        :isFilterList="isFilterList"
                        :signatureList="signatureList"
                        :apEncryTypeList="apEncryTypeList"
                        v-bind="$attrs"
                        @addList="addList"
                        @addObj="addObj"
                        @add="add"
                        @del="del"
                        @addByDic="addByDic"
                        @paramKeyBlur="paramKeyBlur"
                        @setLengthDisabled="setLengthDisabled"
                        @inputClick="inputClick"
                        @updateCompositeIdMapToParamList="
                            updateCompositeIdMapToParamList
                        "
                    ></PageBigData>
                </div>
            </el-row>
            <div v-else class="grid_empty">
                <p>暂无数据</p>
                <div class="grid_empty_pos"></div>
            </div>
        </div>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import {
    packageParamKey,
    getParamParent,
    mixList,
    reList,
    getRelativeParamList,
} from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource } from "@m/utils/normalData";
import { unduplicated } from "@m/utils/array";

export default {
    name: "PageBigData",
    components: {},
    mixins: [mixin],
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: () => "",
        },
        level: {
            type: Number,
            default: () => 0,
        },
        chilLeft: {
            type: Number,
            default: () => 0,
        },
        // 滚动条元素的类名
        parentClass: {
            type: String,
            default: () => "big_data_wrapper",
        },
        paramsType: {
            type: String,
            default: () => "input",
        },
        sourceList: {
            type: Array,
            default: () => [],
        },
        bodyData: {
            type: Array,
            default: () => [],
        },
        typeList: {
            type: Array,
            default: () => [
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
                { type: "LocalDate", value: "LocalDate" },
                { type: "LocalDateTime", value: "LocalDateTime" },
            ],
        },
        isCascader: {
            type: Boolean,
            default: false,
        },
        detailInfo: {
            type: Object,
            default: () => ({}),
        },
        compositeIdMapToParamList: {
            type: Object,
            default: () => ({}),
        },
        pageType: {
            type: String,
            default: () => "",
        },
        isFilterList: {
            type: Object,
            default: () => [],
        },
        apEncryTypeList: {
            type: Object,
            default: () => [],
        },
        signatureList: {
            type: Object,
            default: () => [],
        },
    },

    data() {
        return {
            enumList: [],
            TYPE_LIST: [
                {
                    value: "List",
                    type: "List",
                    label: "List",
                    children: [
                        {
                            value: "String",
                            label: "String",
                            parent: "List",
                        },
                        {
                            value: "Character",
                            label: "Character",
                            parent: "List",
                        },
                        {
                            value: "Integer",
                            label: "Integer",
                            parent: "List",
                        },
                        {
                            value: "Byte",
                            label: "Byte",
                            parent: "List",
                        },
                        {
                            value: "Short",
                            label: "Short",
                            parent: "List",
                        },
                        {
                            value: "Long",
                            label: "Long",
                            parent: "List",
                        },
                        {
                            value: "Float",
                            label: "Float",
                            parent: "List",
                        },
                        {
                            value: "Double",
                            label: "Double",
                            parent: "List",
                        },
                        {
                            value: "Date",
                            label: "Date",
                            parent: "List",
                        },
                    ],
                },
            ],
            isNeedList: [
                { type: "否", value: "0" },
                { type: "是", value: "1" },
            ],
            opereationLeft: 0,
            rsObserver: "",
            isObserver: "",
            speciTypeList: [
                { type: "List", value: "List" },
                { type: "Object", value: "Object" },
            ],
            sourceValList: [],
            defaultProps: {
                label: "label",
                children: "children",
                isLeaf: "leaf",
            },
            defaultExpanded: [], // 树形展示序号组,
            currentKey: "",
            resolve: "",
            formData: {
                paramCName: "", // 参数中文名
            },
            options: [
                {
                    value: "String",
                    label: "String",
                },
                {
                    value: "File",
                    label: "File",
                },
                {
                    value: "List",
                    label: "List",
                    children: [
                        { value: "Character", label: "Character" },
                        { value: "Integer", label: "Integer" },
                        { value: "Byte", label: "Byte" },
                        { value: "Short", label: "Short" },
                        { value: "Long", label: "Long" },
                        { value: "Float", label: "Float" },
                        { value: "Double", label: "Double" },
                        { value: "Object", label: "Object" },
                        { value: "Date", label: "Date" },
                    ],
                },
                {
                    value: "boolean",
                    label: "boolean",
                },
                {
                    value: "char",
                    label: "char",
                },
                {
                    value: "int",
                    label: "int",
                },
                {
                    value: "byte",
                    label: "byte",
                },
                {
                    value: "short",
                    label: "short",
                },
                {
                    value: "long",
                    label: "long",
                },
                {
                    value: "float",
                    label: "float",
                },
                {
                    value: "double",
                    label: "double",
                },
                { value: "Boolean", label: "Boolean" },
                { value: "Character", label: "Character" },
                { value: "Integer", label: "Integer" },
                { value: "Byte", label: "Byte" },
                { value: "Short", label: "Short" },
                { value: "Long", label: "Long" },
                { value: "Float", label: "Float" },
                { value: "Double", label: "Double" },
                { type: "Object", value: "Object" },
                { type: "Date", value: "Date" },
            ],
            start: "",
            end: "",
        };
    },
    inject: ["updateCompositeIdMapToParamList"],
    methods: {
        async handleEnumNodeClick(data, node, element) {
            console.log("handleEnumNodeClick", data, node, element);
            if (node.level == 2) {
                // const { row } = this.currentScope;
                // row.paramMappingKey = data.value;
                // row.paraMapgNm = data.label;
                // this.flag = false;
                // this.$emit("updateTableData");
                // this.$emit("updateEnumData", this.currentScope.row, data, node.parent.data);
            }
        },
        handleNodeClick(row, data, node, type) {
            console.log("handleNodeClick", row, data, node, type);
            if (node.data?.disabled) return;
            if (type == "paramCName") {
                this.currentKey = data.paramOrder;

                if (row.actionId != 'constantValue') {
                  row.paramMappingKey = data?.value;
                  row.paraMapgNm = data?.label;
                } else {

                    if (node.level == 2) {
                        row.paramMappingKey = node.parent.data.value + '.' + data.value
                        row.paraMapgNm = `${node.parent.data.label}.${data.label}`
                    } else {
                        return;
                    }
                  
                }

                if (
                    ["List", "Object"].includes(row?.paramType) &&
                    row.children?.length
                ) {
                    const sourceOption = this.getSourceList(row).find(
                        (item) => item.value == row.actionId
                    );
                    this.setSubParamsSourceAndSourceValue(
                        row,
                        data,
                        sourceOption
                    );
                }
                const selectDom =
                    this.$refs[`${row.paramDirection}-${row.paramOrder}`][0];
                selectDom?.blur();
                for (let i = 0; i < row.children?.length; i++) {
                    const item = row.children[i];
                    item.tree = data.value;
                    console.log(data, "data");
                }
                row?.children?.forEach((item1) => {
                    item1.disabled3 = false;
                });
                console.log(row.children, "row.children");
                if (row?.chidlren && row?.children.length) {
                    this.$emit("updateTableData");
                }
            }
        },
        async loadEnumNode(node, resolve) {
            console.log("node======>", node); 
            if (node.level === 0) {
                return resolve(this.enumList);
            } else {
                if (node.data.value) {
                    const { enumInfoList } =
                        await this.rpc.d4.queryEnumClassInfo({
                            enumCalssId: node.data.enumCalssId,
                        });
                    return resolve(
                        enumInfoList.map((item) => {
                            return {
                                label: item.enumDesc,
                                value: item.enumEngAbbr,
                                leaf: true,
                            };
                        })
                    );
                } else {
                    return resolve([]);
                }
            }
        },
        getDeleteBtn(item) {
            if (!item.disabled) {
                if (this.detailInfo.isSignature == "1") {
                    return "del_btn";
                }

                return "del_btn_auto";
            }
        },
        moveData(item, index, value) {
            this.data[index] = this.data[index + value];
            this.data[index + value] = item;
            this.data = [...this.data];
            this.$emit("updateTableData");
        },
        handleClickSelect(data, item) {
            item.paramValueTypeList = [data.value];
            if (data.parent) {
                item.paramValueTypeList = [data.parent, data.value];
            }
            item.paramValueType = item.paramValueTypeList[0];
            if (item.paramValueTypeList[0] === "Array") {
                item.paramValueType = item.paramValueTypeList[1] + "[]";
            } else if (item.paramValueTypeList[1]) {
                item.paramValueType =
                    item.paramValueType + `<${item.paramValueTypeList[1]}>`;
            }
            item.paramType = item.paramValueType;
            this.$emit("updateTableData");
        },
        handleClickChange(data, item) {
            item.paramType = item.paramValueType;
            item.desensitizationTypeList = [data.value];
            item.desensitizationType = data.value;
            if (data.parent) {
                item.desensitizationTypeList = [data.parent, data.value];
            }
        },
        handleClickParent(item, refsName) {
            this.start = item.start;
            this.end = item.end;
            const input = document
                .querySelector("." + refsName)
                .querySelector("input");
            console.log(input);
            // this.$nextTick(() => {
            console.log(this.start, this.end, this.start > this.end);
            if (Number(this.start) > Number(this.end)) {
                item.start = "";
                // item.end = ''
                return this.$message.error("开始位置不能大于结束位置");
            }
            console.log(item.desensitizationTypeList, "desenitizationType");
            if (item.desensitizationTypeList[0] === "CUSTOMER") {
                input.value = `自定义#${item.start}#${item.end}`;
                item.desensitizationType = `CUSTOMER#${item.start}#${item.end}`;
            } else {
                item.desensitizationType = item.desensitizationTypeList[0];
            }
        },
        handleChangeInput(value, data, key) {
            console.log(value, "value");
            data[key] = value;
            this.$emit("updateTableData");
        },
        handleChange(item) {
            item.paramValueType = item.paramValueTypeList[0];
            if (item.paramValueTypeList[0] === "Array") {
                item.paramValueType = item.paramValueTypeList[1] + "[]";
            } else if (item.paramValueTypeList[1]) {
                item.paramValueType =
                    item.paramValueType + `<${item.paramValueTypeList[1]}>`;
            }
            item.paramType = item.paramValueType;
            this.$emit("updateTableData");
        },
        handleChildShow(e) {
            console.log(e);
            e.showChild = !e.showChild;
            this.$forceUpdate();
        },
        handleValueType(e) {
            console.log("WCCCCCCC+++++++++++++++++++++++", e);

            e.actionId =
                e.actionName =
                e.apSource =
                e.paramMappingKey =
                e.paraMapgNm =
                    "";
            e.paramType = e.paramValueType;
            if (e.paramValueType !== "List" || e.paramValueType !== "Object") {
                e.children = [];
                delete e.children;
                delete e.showChild;
            }
            if (
                e.paramKey &&
                (e.paramValueType == "List" || e.paramValueType == "Object")
            ) {
                this.$emit("paramKeyBlur", e);
            }
            this.$emit("updateTableData");
            this.setLengthDisabled(e);
        },
        //计算位置
        leftCount() {
            if (this.type == "") {
                // 横向滚动
                const scrollLeft = this.$refs.dataRef.scrollLeft; // scrollX
                const w = this.$refs.dataRef.offsetWidth;
                this.opereationLeft = w - 100 + scrollLeft;
                console.log(1, this.opereationLeft);
            } else {
                this.opereationLeft = this.chilLeft;
            }
        },
        //窗口宽度改变
        handleResize() {
            console.log("handle resize");
            this.leftCount();
        },
        //滚动改变
        handleScroll() {
            console.log("handle scroll");
            this.leftCount();
        },
        add(e) {
            this.$emit("add", e);
            this.$forceUpdate();
        },
        del(e) {
            this.$emit("del", e);
            this.$forceUpdate();
        },
        addByDic(e) {
            this.$emit("addByDic", e);
        },
        addObj(e) {
            this.$emit("addObj", e);
        },
        addList(e) {
            this.$emit("addList", e);
        },
        paramKeyBlur(e) {
            this.$emit("paramKeyBlur", e);
        },
        setLengthDisabled(e) {
            this.$emit("setLengthDisabled", e);
        },
        chooseVal(e) {
            this.$emit("chooseVal", e);
        },
        focusChange(e) {
            this.$emit("focusChange", e);
        },
        selectChange(e, data) {
            data.paramMappingKey = e.value;
            data.paraMapgNm = e.type;
        },
        sourceChange(e, data) {
            data.actionId = e.value;
            data.actionName = e.label;
            if (data.actionId == this.detailInfo?.apiId) {
                data.apSource = "00";
            } else {
                data.apSource = "20";
            }
            this.$set(data, "paraMapgNm", "");
            this.$emit("sourceChange", e, data);
        },
        inputClick(scope, e, type) {
            this.$emit("inputClick", scope, e, type);
        },
        async handleChangeData(e, row, index = 0) {
            const children = row.children;
            if (e === "complex" && index === 0) {
                if (children && children.length && index === 0) {
                    for (let i = 0; i < children.length; i++) {
                        let item1 = children[i];
                        item1.disabled2 = false;
                        item1.disabled3 = false;
                        item1.tree = null;
                    }
                }
            } else if (index === 0) {
                if (children && children.length && index === 0) {
                    for (let i = 0; i < children.length; i++) {
                        let item1 = children[i];
                        item1.disabled2 = true;
                        item1.disabled3 = true;
                    }
                }
            }
            if (!e) {
                row.paraMapgNm =
                    row.paramMappingKey =
                    row.actionId =
                    row.actionName =
                    row.apSource =
                        "";
            } else if (e == "system") {
                const { puApiParams } = this.detailInfo;
                row.paraMapgNm = row.paramCName;
                row.paramMappingKey = packageParamKey(row, puApiParams);
                const item = this.getSourceList(row).find(
                    (item) => item.value == e
                );
                row.actionId = item?.value || e;
                row.actionId1 = row.actionId;
                row.actionName = item?.label;
                row.apSource = actionTypeToApSource[item?.actionType];
            } else if (e == "constantValue") {
                row.paraMapgNm = row.paramMappingKey = "";
                row.actionId = e;
                row.actionId1 = row.actionId;

                row.actionName = "枚举值";
                row.apSource = actionTypeToApSource[e];
            } else if (e === "complex") {
                row.paraMapgNm = "";
                const item = this.getSourceList(row).find(
                    (item) => item.value == e
                );
                row.actionId = item?.value || e;
                row.actionId1 = row.actionId;
                row.actionName = item?.label;
                row.apSource = actionTypeToApSource[item?.actionType];
                this.$emit("updateTableData");
                return;
            } else {
                const transId = this.detailInfo?.svcId;
                row.paraMapgNm = row.paramMappingKey = "";
                const item = this.getSourceList(row).find(
                    (item) => item.value == e
                );
                row.actionId = item?.value || e;
                row.actionName = item?.label;
                row.actionId1 = row.actionId;
                // row.apSource = e == transId ? "00" : "20"
                if (e == transId) {
                    row.apSource = "00";
                } else {
                    row.apSource = actionTypeToApSource[item?.actionType];
                }
            }
            if (children && children.length && e !== "system") {
                for (let i = 0; i < children.length; i++) {
                    let item1 = children[i];
                    this.handleChangeData(e, item1, index + 1);
                }
            }
            if (index === 0) {
                this.$emit("updateTableData");
            }
            await this.updateCompositeIdMapToParamList(row);
        },
        async handleSelectChange(key, e, row, refsName) {
            console.log("key", e, key, row);
            if (!e && row.actionId !== "complex") {
                row?.children?.forEach((item) => {
                    item.disabled3 = true;
                });
                this.$emit("updateTableData");
            }
            if (key == "actionId") {
                if (
                    (row.paramType === "List" || row.paramType === "Object") &&
                    e !== "system" &&
                    e !== "complex"
                ) {
                    this.$confirm(
                        "切换来源将会重置子类来源和来源值",
                        "请确认",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                        }
                    )
                        .then(() => {
                            this.handleChangeData(e, row, 0);
                        })
                        .catch(() => {
                            row.actionId = row.actionId1;
                        });
                } else {
                    this.handleChangeData(e, row, 0);
                }
            } else if (key == "paraMapgNm") {
                const options = this.getSourceValueList(row);
                const item = options.find((item) => item.value == e);
                row.paramMappingKey = item?.value || e;
                row.paraMapgNm = item?.label;
            }
            this.$forceUpdate();
        },
        async handleSelectFocus(row) {
            // console.log("handleSelectFocus", row)
            const compositeId = row.actionId;
            const item = this.compositeIdMapToParamList[compositeId];
            if (compositeId && item && !item?.paramList?.length) {
                const selectDom =
                    this.$refs[`${row.paramDirection}-${row.paramOrder}`][0];
                selectDom.visible = false;
                await this.updateCompositeIdMapToParamList(row);
                selectDom.visible = true;
            }
            let paramList = JSON.parse(
                JSON.stringify(
                    this.compositeIdMapToParamList[row.actionId]?.paramList ||
                        []
                )
            );
            const paramParent = getParamParent(row, paramList);
            const paramCNameTree = this.getParamCNameTree(row);
            if (paramParent) {
                if (
                    ["bodyData", "bodyOutData"].includes(paramParent.paramKey)
                ) {
                    // 默认展开body
                    // console.log("默认展开body")
                    const items = paramCNameTree.filter(
                        (param) =>
                            !param.paramParentId &&
                            (["bodyOutData"].includes(param.paramKey) ||
                                param.paramKey == paramParent.paramKey)
                    );
                    if (items?.length) {
                        this.defaultExpanded = items.map(
                            (item) => item.paramOrder
                        );
                    }
                } else {
                    // 默认展开报文头
                    // console.log("默认展开报文头")
                    const items = paramCNameTree.filter(
                        (param) =>
                            !param.paramParentId &&
                            (["resHeaderData"].includes(param.paramKey) ||
                                param.paramKey == paramParent.paramKey)
                    );
                    if (items?.length) {
                        this.defaultExpanded = items.map(
                            (item) => item.paramOrder
                        );
                    }
                }
            }
        },
        getSourceList(row, status = false) {
            let list = [
                {
                    label: "平台系统",
                    svcId: "",
                    value: "system",
                    actionSeq: "",
                    actionType: "system",
                },
                {
                    label: "枚举值",
                    svcId: "",
                    value: "constantValue",
                    actionSeq: "",
                    actionType: "constantValue",
                },
                {
                    label: "获取会话组件",
                    svcId: "",
                    value: "getSessionAction",
                    actionSeq: "",
                    actionType: "getSessionAction",
                },
            ];
            if (status && row.paramKey !== "resHeaderData") {
                list = [
                    {
                        label: "枚举值",
                        svcId: "",
                        value: "constantValue",
                        actionSeq: "",
                        actionType: "constantValue",
                    },
                    {
                        label: "获取会话组件",
                        svcId: "",
                        value: "getSessionAction",
                        actionSeq: "",
                        actionType: "getSessionAction",
                    },
                ];
            }
            if (!row.disabled) {
                list = list.filter((item) => item.label != "平台系统");
            }
            if (["List", "Object"].includes(row.paramType)) {
                list = list.filter((item) => item.label != "枚举值");
            }
            if (row.paramType === "Object" || row.paramType === "List") {
                list.push({
                    label: "复合来源",
                    svcId: "",
                    value: "complex",
                    actionSeq: "",
                    actionType: "complex",
                });
            }
            const arr = this.sourceList.filter(
                (item) =>
                    item.actionType !== "cacheSessionAction" &&
                    item.actionType !== "setCacheAction" &&
                    item.actionType !== "updateCacheAction" &&
                    item.actionType !== "setHeaderCacheAction" &&
                    item.actionType !== "listAction" &&
                    item.actionType !== "getDesensitizationAction"
            );
            return list.concat(arr);
        },
        getSourceValueList(row) {
            const compositeId = row.actionId;
            let paramList = JSON.parse(
                JSON.stringify(
                    this.compositeIdMapToParamList[compositeId]?.paramList || []
                )
            );
            const paramDirection = row.apSource == "00" ? "0" : "1";
            const paramParent = getParamParent(row, paramList);
            const paramType = row.paramType;
            if (!["50", "60"].includes(row.apSource)) {
                // 来源不是设置会话组件和获取会话组件时，需要根据来源类型筛选输入或者输出参数
                paramList = paramList.filter(
                    (param) => param.paramDirection == paramDirection
                );
            }
            return this.filterParamListByRowParamType(paramList, row).map(
                (param) => {
                    param.label = param.paramCName;
                    param.value = packageParamKey(param, paramList);
                    return param;
                }
            );
        },
        getRowDisabled(key, row) {
            if (key == "paraMapgNm") {
                return (
                    row.disabled &&
                    row.sourceFlag &&
                    this.pageType !== "paramsSet"
                );
            } else if (key == "deleteSubParams") {
                return !row?.children?.length;
            }
        },
        filterParamListByRowParamType(paramList, row) {
            // console.log("filterParamListByRowParamType", paramList, row, row.paramType)
            const { paramType } = row;
            if (["List", "Object", "Date"].includes(paramType)) {
                return paramList.filter(
                    (param) => param.paramType == paramType
                );
            } else if (paramType == "String") {
                return paramList.filter(
                    (param) => !["List", "Object"].includes(param.paramType)
                );
            } else {
                return paramList;
            }
        },
        getOptionsName(key, item) {
            if (key == "actionName") {
                return !item.actionSeq
                    ? item.label
                    : `${item.label}(${item.actionSeq})`;
            }
        },
        getParamCNameTree(row) {
            // console.log("getParamCNameTree", row)
            const compositeId = row.actionId;
            // 来源值
            if (row.actionName === "拼接组件") {
                // console.log(this.compositeIdMapToParamList, "row")
                let list = [
                    {
                        // label = param.paramCName
                        // param.value = packageParamKey(param, paramList)
                        // param.leaf = !(param?.children?.length > 0);
                        // return param
                        label: "拼接结果",
                        value: "strResult",
                        paramType: "String",
                        paramCName: "拼接结果",
                        paramMappingKey: "strResult",
                        leaf: true,
                    },
                ];
                this.setParamListDisabledByRowParamType(list, row);
                list[0].value = "strResult";
                return list;
                // let paramList2 = this.compositeIdMapToParamList['获取会话组件'].paramList
            }
            let paramList = JSON.parse(
                JSON.stringify(
                    this.compositeIdMapToParamList[compositeId]?.paramList || []
                )
            );
            let paramMappingKey = "";
            if (row.tree) {
                paramMappingKey = row.tree;
            }
            const paramDirection = row.apSource == "00" ? "0" : "1";
            if (!["50", "60"].includes(row.apSource)) {
                // 来源不是设置会话组件和获取会话组件时，需要根据来源类型筛选输入或者输出参数
                paramList = paramList.filter(
                    (param) => param.paramDirection == paramDirection
                );
            }
            this.setParamListDisabledByRowParamType(paramList, row);
            let paramListWithFilter = paramList
                .map((param) => {
                    param.label = param.paramCName;
                    param.value = packageParamKey(param, paramList);
                    param.leaf = !(param?.children?.length > 0);
                    return param;
                })
                .filter((param) =>
                    param.paramCName.includes(this.formData.paramCName)
                );
            paramListWithFilter = unduplicated(
                getRelativeParamList(paramListWithFilter, paramList),
                "paramOrder"
            );
            let res = reList(paramListWithFilter);
            if (paramMappingKey && row.disabled2) {
                res = [this.findParamList(res, paramMappingKey)];
            }
            return res;
        },
        findParamList(children, paramMappingKey) {
            let children1 = [];
            for (let i = 0; i < children?.length; i++) {
                const item = children[i];
                if (item.value === paramMappingKey) {
                    return item;
                } else {
                    children1 = [...children1, ...item.children];
                }
            }
            if (children1.length) {
                return this.findParamList(children1, paramMappingKey);
            }
        },
        setParamListDisabledByRowParamType(paramList, row) {
            const { paramType } = row;
            if (["List", "Object", "Date"].includes(paramType)) {
                paramList.forEach((param) => {
                    param.children = paramList.filter(
                        (_param) => _param.paramParentId == param.paramOrder
                    );
                    param.disabled = param.paramType != paramType;
                });
            } else {
                paramList.forEach((param) => {
                    param.children = paramList.filter(
                        (_param) => _param.paramParentId == param.paramOrder
                    );
                    param.disabled = ["List", "Object"].includes(
                        param.paramType
                    );
                });
            }
        },
        //获取子级
        async loadNode(node, resolve) {
            // console.log("loadNode", node);
            this.resolve = resolve;
            if (node.level === 0) {
                return resolve(node.data);
            }
            if (node.level >= 1) {
                return resolve(node.data.children);
            }
        },
        setDisabled(children, type) {
            for (let i = 0; i < children?.length; i++) {
                const item = children[i];
                item.disabled = true;
                if (["List", "Object"].includes(type)) {
                    console.log(type, item.paramType, "type, item.paramType");
                    if (type === item.paramType) {
                        item.disabled = false;
                    }
                } else if (!["List", "Object"].includes(item.paramType)) {
                    item.disabled = false;
                }
                if (item.children && item.children.length) {
                    this.setDisabled(item.children, type);
                }
                // console.log(item.disabled, item.paramCName)
            }
            return;
        },

        setSubParamsSourceAndSourceValue(row, data, sourceOption) {
            row.children.forEach((param) => {
                const item = data?.children?.find(
                    (child) =>
                        child.paramKey == param.paramKey &&
                        child.paramCName == param.paramCName
                );
                if (item) {
                    // 能从来源值的子参数中匹配到同名的参数
                    param.actionId = sourceOption?.value;
                    param.actionName = sourceOption?.label;
                    param.apSource =
                        actionTypeToApSource[sourceOption?.actionType];
                    param.paramMappingKey = item?.value;
                    param.paraMapgNm = item?.label;
                    if (
                        ["List", "Object"].includes(param?.paramType) &&
                        param.children?.length
                    ) {
                        this.setSubParamsSourceAndSourceValue(
                            param,
                            item,
                            sourceOption
                        );
                    }
                }
            });
        },
        handleInput(row, e) {
            const paramCNameTree = this.getParamCNameTree(row);
            this.defaultExpanded = this.getDefaultExpanded(paramCNameTree);
        },
        getDefaultExpanded(list) {
            return list.reduce((prev, item) => {
                if (["List", "Object"].includes(item.paramType)) {
                    prev.push(item.paramOrder);
                    if (item.children?.length) {
                        prev.push(...this.getDefaultExpanded(item.children));
                        return prev;
                    }
                }
                return prev;
            }, []);
        },
        getElColSpan(key) {
            if (key == "参数Key") {
                return this.paramsType == "output" ? 3 : 4;
            } else if (key == "参数名称") {
                return this.paramsType == "output" ? 2 : 3;
            } else if (key == "参数值类型") {
                return 2;
            } else if (key == "参数长度") {
                return 2;
            } else if (key == "来源") {
                return 2;
            } else if (key == "来源值") {
                return 2;
            } else if (key == "脱敏类型") {
                return 2;
            } else if (key == "解密类型") {
                return 2;
            } else if (key == "加密类型") {
                return 2;
            } else if (key == "是否必输") {
                return 2;
            } else if (key == "默认值") {
                return 2;
            } else if (key == "参数描述") {
                return this.paramsType == "output" &&
                    this.detailInfo?.isDesensitization == "1"
                    ? 2
                    : 3;
            } else if (key == "枚举值") {
                if (this.paramsType == "input") {
                    // const baseSpan = 6;
                    if (
                        this.detailInfo?.isSignature == "1" &&
                        this.detailInfo?.isEncode == "1"
                    ) {
                        return 2;
                    } else if (this.detailInfo?.isSignature == "1") {
                        return 4;
                    } else if (this.detailInfo?.isEncode == "1") {
                        return 4;
                    } else {
                        return 6;
                    }
                } else {
                    const baseSpan = 4;
                    return (
                        baseSpan -
                        (this.detailInfo?.isDesensitization == "1" ? 1 : 0) -
                        (this.detailInfo?.isEncode == "1" ? 2 : 0)
                    );
                }
            } else if (key == "默认值") {
                return 2;
            }
        },
        deleteSubParams(item) {
            item.children = [];
            this.$forceUpdate();
        },
    },
    async mounted() {
        if (this.type === "") {
            this.leftCount();
            const dom = this.$refs.dataRef;
            this.rsObserver = new ResizeObserver(this.handleResize);
            this.rsObserver.observe(dom);
            document
                .querySelector("." + this.parentClass)
                .addEventListener("scroll", this.leftCount);
        }
    },
    async created() {
        if(this.$route.query?.fnctId){
            const { transAppId } =
            await this.rpc.businessRules.queryFunctionRelInfo({
                fnctId: this.$route.query.fnctId,
                examId: this.$route.query.examId,
            });
            const { enumClassInfoList } = await this.rpc.d4.queryEnumClassPageList({
                blgObjId: transAppId,
                blgObjTpCd: "01",
                currentPage: 1,
                enumCalssCdNm: "",
                turnPageShowNum: 999,
            });
            this.enumList = enumClassInfoList.map((item) => {
                return {
                    label: item.enumCalssNm,
                    value: item.enumCalssCd,
                    enumCalssId: item.enumCalssId,
                    leaf: false
                };
            });
        }
    },
    beforeDestroy() {
        this.rsObserver.disconnect();
        try {
            document
                .querySelector("." + this.parentClass)
                .removeEventListener("scroll", this.leftCount);
        } catch (error) {
            console.log(error);
        }
    },
    watch: {
        signatureList() {
            console.log("signatureList");
        },
        data() {
            console.log("11111111111111", this.data);
            for (let i = 0; i < this.data.length; i++) {
                const item = this.data[i];
                if (
                    item.actionId === "system" &&
                    item.paramKey === "bodyOutData"
                ) {
                    item.actionId = "complex";
                    this.handleChangeData("complex", item, 0);
                }
            }
            console.log("9999999999", this.data);
            this.data.forEach((ele) => {
                if (ele.apSource == "120") {
                    //符合来源为复合来源的 不禁用
                    if (ele.children && ele.children.length > 0) {
                        ele.children.forEach((item) => {
                            item.disabled2 = false;
                            item.disabled = false;
                        });
                    }
                }
            });
        },
        chilLeft(val) {},
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_page_big_data {
    clear: both;
    position: relative;
    .big_data_wrapper {
        overflow-x: scroll;
        width: 100%;
        padding-right: 100px;
        border-bottom: 1px solid #ebeef5;
        @include scrollbar;
        .grid_no_re {
            position: static;
            width: calc(230%);
        }
        &::after {
            content: "";
            position: absolute;
            width: 20px;
            top: 0;
            left: calc(100% - 100px);
            right: 0;
            bottom: 10px;
            box-shadow: -5px 2px 10px -5px rgba(0, 0, 0, 0.12);
        }
    }
    .grid_item {
        clear: both;
        position: relative;
        width: 100%;
        &::after {
            content: "";
            display: block;
            clear: both;
        }
    }
    .grid_child {
        position: static;
        .big_data_wrapper {
            width: 100%;
            overflow: visible;
            padding-right: 0;
            border-bottom: 0;
            .grid_no_re {
                width: 100%;
            }
            &::after {
                content: "";
                display: none;
                clear: both;
            }
        }
        .gird_name {
            padding-left: 20px;
        }
    }
    .grid_header {
        background: #fafafc;
        color: #333;
        padding: 4px 10px;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        vertical-align: middle;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #ebeef5;
    }
    .grid_empty {
        width: 130%;
        height: 100%;
        border-bottom: 1px solid #ebeef5;
        p {
            line-height: 60px;
            width: 50%;
            color: #909399;
            margin: 0 auto;
            text-align: center;
        }
    }
    .grid_content {
        display: flex;
        padding: 12px 10px;
        border-bottom: 1px solid #ebeef5;
        height: 57px;
        .grid_icon {
            font-size: 20px;
            margin-top: 10px;
            cursor: pointer;
        }
    }
    .grid_header_operation {
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
    }
    .grid_content_operation {
        position: absolute;
        left: 0;
        top: 0;
        height: 57px;
        width: 100px;
        padding: 12px 10px;
        border-bottom: 1px solid #ebeef5;
        background: #fff;
        overflow: hidden;
        z-index: 999;
        .add_btn {
            position: relative;
        }
        .add_btn::after {
            position: absolute;
            content: "";
            display: block;
            width: 1px;
            height: 16px;
            top: 8px;
            right: -3px;
            background: #e7e7ee;
        }
        .del_btn {
            position: relative;
            color: #fe4758;
        }
        .del_btn_auto {
            color: #fe4758;
            margin: 0 auto;
            display: block;
        }
        .del_btn::after {
            position: absolute;
            content: "";
            display: block;
            width: 1px;
            height: 16px;
            top: 8px;
            right: -3px;
            background: #e7e7ee;
        }
        /deep/ .el-button {
            font-size: 13px;
        }
    }
    .operation_link {
        cursor: pointer;
        color: #358aff;
        font-size: 13px;
    }
    .more_unClick {
        pointer-events: none;
        color: #c0c4cc;
    }
    .del_style {
        color: red;
    }
}
</style>

<style lang="scss">
.aop_h5_l4_comps_page_big_data_tree_select_container {
    .select_tree_option {
        min-width: 150px !important;
        min-height: 200px !important;
        padding: 0 !important;
        margin: 0;
        overflow: auto;
        cursor: default !important;
        .custom_tree_node {
            position: relative;
            width: 100%;
            .disabled {
                color: #ccc;
            }
        }
    }
    .el-scrollbar {
        .el-scrollbar__bar {
            &.is-vertical {
                display: none;
            }
        }
    }
    .search_area {
        padding: 0 10px 8px;
    }
}
</style>
<style lang="scss">
.el-cascader__dropdown {
    .el-cascader-node {
        height: auto !important;
    }
}
</style>
