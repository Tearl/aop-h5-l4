<template>
    <div class="aop_tradecode_comps_design_attr_simulant_select" :style="style">
        <template>
            <el-select
                v-if="flag"
                ref="elSelectRef"
                class="select_container"
                :class="{ tree_select_container: columnLabel == '来源值' }"
                v-model="selectValue"
                placeholder="请选择"
                @change="change"
                :popper-append-to-body="false"
            >
                <div v-if="columnLabel == '来源'">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        @click.native="clickOption(item.value)"
                        >{{ getOptionsName(item) }}</el-option
                    >
                </div>
                <div
                    v-else-if="columnLabel == '来源值'"
                    class="aop_tradecode_comps_design_attr_simulant_select_tree_option_container"
                >
                    <div class="search_area">
                        <el-input
                            v-if="!isEnumColumn"
                            v-model="formData.paramCName"
                            placeholder="请输入参数名"
                            size="small"
                            clearable
                            @input="handleInput"
                        ></el-input>
                    </div>
                    <el-option class="select_tree_option" disabled>
                        <el-tree
                            v-if="!isEnumColumn"
                            ref="paramCNameTreeRef"
                            :highlight-current="true"
                            :data="paramCNameTree"
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
                                    :class="data.disabled ? 'disabled' : ''"
                                    @click.stop="
                                        handleNodeClick(
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
                        <el-tree
                            v-else
                            ref="paramCNameTreeRefEnum"
                            :highlight-current="true"
                            :data="enumList"
                            :props="defaultProps"
                            :load="loadEnumNode"
                            lazy
                            @node-click="handleEnumNodeClick"
                        >
                        </el-tree>
                    </el-option>
                </div>
            </el-select>
        </template>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import {
    packageParamKey,
    getParamParent,
    mixList,
    getAllChildByParamObj,
    reList,
    getRelativeParamList,
} from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource } from "@m/utils/normalData";
import { unduplicated } from "@m/utils/array";

export default {
    mixins: [mixin],
    components: {},
    props: {
        currentServObj: {
            type: Object,
            default: () => ({}),
        },
        currentObj: {
            type: Object,
            default: () => ({}),
        },
        currentParentCpnInfo: {
            type: Object,
            default: () => ({}),
        },
        fourRAttrFlag: {
            type: Boolean,
            default: () => false,
        },
        disabledData: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            enumList: [],
            selectValue: "",
            currentScope: {},
            currentEvent: {},
            currentPosition: {},
            compositeIdMapToParamList: {},
            transId: "",
            flag: true,
            defaultProps: {
                label: "label",
                children: "children",
                isLeaf: "leaf",
                // disabled(data, node) {
                //   return node.parent.data.paramType == "List";
                // },
            },
            defaultExpanded: [], // 树形展示序号组,
            currentKey: "",
            resolve: "",
            appId: "",
            formData: {
                paramCName: "", // 参数中文名
            },
            projectId: "",
        };
    },
    watch: {
        "formData.paramCName"() {
            console.log(this.selectValue, "selectValue");
            this.$emit("update", this.currentScope);
        },
        isEnumColumn() {
            this.$nextTick(async () => {
                if (this.isEnumColumn) {
                    // 查枚举
                    const { enumClassInfoList } =
                    await this.rpc.d4.queryEnumClassPageList({
                        blgObjId: this.currentServObj.transAppId,
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
                            leaf: false,
                        };
                    });
                } else {
                    this.enumList = [];
                }
            });
        },
    },
    computed: {
        style() {
            return {
                top: `${this.currentPosition.y || 0}px`,
                left: `${this.currentPosition.x || 0}px`,
            };
        },
        options() {
            const { label } = this.currentScope.column || {};
            const { row } = this.currentScope;
            if (label == "来源") {
                console.log(this.currentParentCpnInfo, this.currentObj, "ssss");

                const _prev = ["List", "Object"].includes(row.paramType)
                    ? [
                          { label: "无", value: "", svcId: "" },
                          {
                              label: "当前4b交易",
                              value: this.currentServObj?.svcId,
                              svcId: this.currentServObj?.svcId,
                          },
                      ]
                    : [
                          { label: "无", value: "", svcId: "" },
                          {
                              label: "枚举值",
                              value: "constantValue",
                              svcId: "",
                          },
                          {
                              label: "固定值",
                              value: "fixedValue",
                              svcId: "",
                          },
                          {
                              label: "当前4b交易",
                              value: this.currentServObj?.svcId,
                              svcId: this.currentServObj?.svcId,
                          },
                      ];
                if (
                    (row.paramType === "Object" || row.paramType === "List") &&
                    this.currentObj.actionType !== "assignAction"
                ) {
                    _prev.push({
                        label: "复合来源",
                        svcId: "",
                        value: "complex",
                        actionSeq: "",
                        actionType: "complex",
                    });
                }
                if (this.currentParentCpnInfo?.actionType == "loopAction") {
                    _prev.push({
                        label: "当前循环组件",
                        svcId: this.currentParentCpnInfo?.actionOwnId,
                        value: this.currentParentCpnInfo?.compositeId,
                        actionType: this.currentParentCpnInfo?.actionType,
                        actionSeq: this.currentParentCpnInfo?.conf.find(
                            (item) => item.name == "actionSeq"
                        )?.value,
                    });
                }
                _prev.push({
                    svcId: "getSessionInfo",
                    value: "获取会话组件",
                    label: "获取会话组件",
                });
                const res = this.getDataList().reduce((prev, data) => {
                    if (
                        data.actionType === "cacheSessionAction" ||
                        data.actionType === "setCacheAction"
                    ) {
                        return prev;
                    }
                    if (
                        sourceActionType.includes(data.actionType) &&
                        data.compositeId &&
                        data.compositeId != this.currentObj.compositeId
                    ) {
                        prev.push({
                            label: data.actionName,
                            svcId: data.actionOwnId,
                            value: data.compositeId,
                            actionType: data.actionType,
                            actionSeq: data.conf.find(
                                (item) => item.name == "actionSeq"
                            )?.value,
                        });
                    }
                    return prev;
                }, _prev);
                console.log("options", res);
                return res;
            } else if (label == "来源值") {
                const { row } = this.currentScope;
                const dataList = this.getDataList();
                if (this.currentParentCpnInfo?.actionType == "loopAction") {
                    dataList.push(...this.currentParentCpnInfo.dataList);
                }
                const item = dataList.find(
                    (data) =>
                        data.compositeId && data.compositeId == row.actionId
                );
                if (item || row.actionId == this.currentServObj?.svcId) {
                    // 在循环组件的子流程内选择了来源为当前循环组件时
                    if (row.actionId == this.currentParentCpnInfo.compositeId) {
                        const loopListSource =
                            this.currentParentCpnInfo?.conf?.find(
                                (item) => item.name == "loopListSource"
                            ).value;
                        const loopList = this.currentParentCpnInfo?.conf?.find(
                            (item) => item.name == "loopList"
                        ).value;
                        let paramList = [];
                        if (!loopListSource && loopList) {
                            // 循环集合来自当前4B
                            paramList = JSON.parse(
                                JSON.stringify(
                                    this.compositeIdMapToParamList[
                                        this.currentServObj?.svcId
                                    ]?.paramList || []
                                )
                            );
                            const loopListParamObj = paramList.find(
                                (param) =>
                                    param.paramDirection == "0" &&
                                    packageParamKey(param, paramList) ==
                                        loopList
                            );
                            if (loopListParamObj) {
                                // const loopListParamList = mixList([loopListParamObj], "children")
                                const loopListParamList = [
                                    loopListParamObj,
                                    ...getAllChildByParamObj(
                                        loopListParamObj,
                                        paramList
                                    ),
                                ];
                                return this.filterParamListByRowParamType(
                                    loopListParamList,
                                    row
                                ).map((param) => {
                                    param.label = param.paramCName;
                                    param.value = packageParamKey(
                                        param,
                                        paramList
                                    );
                                    return param;
                                });
                            }
                        } else if (loopListSource && loopList) {
                            paramList = JSON.parse(
                                JSON.stringify(
                                    this.compositeIdMapToParamList[
                                        loopListSource
                                    ]?.paramList || []
                                )
                            );
                            const loopListParamObj = paramList.find(
                                (param) =>
                                    param.paramDirection == "1" &&
                                    packageParamKey(param, paramList) ==
                                        loopList
                            );
                            if (loopListParamObj) {
                                const loopListParamList = [
                                    loopListParamObj,
                                    ...getAllChildByParamObj(
                                        loopListParamObj,
                                        paramList
                                    ),
                                ];
                                return this.filterParamListByRowParamType(
                                    loopListParamList,
                                    row
                                ).map((param) => {
                                    param.label = param.paramCName;
                                    param.value = packageParamKey(
                                        param,
                                        paramList
                                    );
                                    return param;
                                });
                            }
                        }
                    } else {
                        let paramList = JSON.parse(
                            JSON.stringify(
                                this.compositeIdMapToParamList[row.actionId]
                                    ?.paramList || []
                            )
                        );
                        console.log(row, "rowrow");
                        const paramDirection = row.apSource == "00" ? "0" : "1";
                        // const paramParent = getParamParent(row, paramList)
                        // const paramType = row.paramType
                        if (!["50", "60"].includes(row.apSource)) {
                            // 来源不是设置会话组件和获取会话组件时，需要根据来源类型筛选输入或者输出参数
                            paramList = paramList.filter(
                                (param) =>
                                    param.paramDirection == paramDirection
                            );
                        }
                        return this.filterParamListByRowParamType(
                            paramList,
                            row
                        ).map((param) => {
                            param.label = param.paramCName;
                            param.value = packageParamKey(param, paramList);
                            return param;
                        });
                    }
                } else {
                    return [];
                }
            } else {
                return [];
            }
        },
        columnLabel() {
            return this.currentScope.column?.label;
        },
        isEnumColumn() {
            return this.currentScope.row?.actionId == "constantValue" || this.currentScope.row?.value == "10";
        },
        paramCNameTree() {
            const { row } = this.currentScope;
            console.log(row, "row");
            const dataList = this.getDataList();
            let paramId = "";
            if (row.tree) {
                paramId = row.tree;
            }
            if (this.currentParentCpnInfo?.actionType == "loopAction") {
                dataList.push(...this.currentParentCpnInfo.dataList);
            }
            if (row.actionId === "获取会话组件") {
                let paramList2 =
                    this.compositeIdMapToParamList["获取会话组件"].paramList;
                this.setParamListDisabledByRowParamType2(paramList2, row);
                console.log("====>\n", paramList2);

                return paramList2;
            }

            // 来源值
            if (row.actionName === "拼接组件") {
                // console.log(this.compositeIdMapToParamList, "row")
                let list = [
                    {
                        label: "拼接结果",
                        value: "strResult",
                        paramType: "String",
                        paramCName: "拼接结果",
                        paramMappingKey: "strResult",
                        leaf: true,
                    },
                ];
                this.setParamListDisabledByRowParamType2(list, row);
                list[0].value = "strResult";
                return list;
                // let paramList2 = this.compositeIdMapToParamList['获取会话组件'].paramList
            }
            const item = dataList.find(
                (data) => data.compositeId && data.compositeId == row.actionId
            );
            if (item || row.actionId == this.currentServObj?.svcId) {
                // 在循环组件的子流程内选择了来源为当前循环组件时
                if (row.actionId == this.currentParentCpnInfo.compositeId) {
                    const loopListSource =
                        this.currentParentCpnInfo?.conf?.find(
                            (item) => item.name == "loopListSource"
                        ).value;
                    const loopList = this.currentParentCpnInfo?.conf?.find(
                        (item) => item.name == "loopList"
                    ).value;
                    let paramList = [];
                    console.log("ppppppppppppp");
                    if (!loopListSource && loopList) {
                        // 循环集合来自当前4B
                        paramList = JSON.parse(
                            JSON.stringify(
                                this.compositeIdMapToParamList[
                                    this.currentServObj?.svcId
                                ]?.paramList || []
                            )
                        );
                        const loopListParamObj = paramList.find(
                            (param) =>
                                param.paramDirection == "0" &&
                                packageParamKey(param, paramList) == loopList
                        );
                        if (loopListParamObj) {
                            let paramList2 =
                                this.currentParentCpnInfo.paramList.filter(
                                    (item) => {
                                        return item.paramDirection === "0";
                                    }
                                );
                            loopListParamObj.paramParentId = "";
                            const loopListParamList = [
                                loopListParamObj,
                                ...getAllChildByParamObj(
                                    loopListParamObj,
                                    paramList
                                ),
                            ];
                            this.setParamListDisabledByRowParamType(
                                loopListParamList,
                                row
                            );
                            let paramListWithFilter = loopListParamList
                                .map((param) => {
                                    param.label = param.paramCName;
                                    param.value = packageParamKey(
                                        param,
                                        paramList
                                    );
                                    param.leaf = !(param?.children?.length > 0);
                                    return param;
                                })
                                .filter((param) =>
                                    param.paramCName.includes(
                                        this.formData.paramCName
                                    )
                                );
                            this.setParamListDisabledByRowParamType(
                                paramList2,
                                row
                            );
                            paramList2 = paramList2.map((item) => {
                                item.label = item.paramCName;
                                item.value = packageParamKey(
                                    item,
                                    this.currentParentCpnInfo.paramList
                                );
                                item.leaf = !(item?.children?.length > 0);
                                return item;
                            });
                            paramListWithFilter = unduplicated(
                                [...paramList2],
                                "paramOrder"
                            );
                            let res = reList(paramListWithFilter);

                            if (paramId) {
                                res = [this.findParamList(res, paramId)];
                            }
                            return res;
                        }
                    } else if (loopListSource && loopList) {
                        // 循环集合来自L5服务
                        paramList = JSON.parse(
                            JSON.stringify(
                                this.compositeIdMapToParamList[loopListSource]
                                    ?.paramList || []
                            )
                        );
                        let paramList2 =
                            this.currentParentCpnInfo.paramList.filter(
                                (item) => {
                                    return item.paramDirection === "0";
                                }
                            );
                        const loopListParamObj = paramList.find(
                            (param) =>
                                param.paramDirection == "1" &&
                                packageParamKey(param, paramList) == loopList
                        );
                        if (loopListParamObj) {
                            loopListParamObj.paramParentId = "";
                            const loopListParamList = [
                                loopListParamObj,
                                ...getAllChildByParamObj(
                                    loopListParamObj,
                                    paramList
                                ),
                            ];
                            this.setParamListDisabledByRowParamType(
                                loopListParamList,
                                row
                            );
                            let paramListWithFilter = loopListParamList
                                .map((param) => {
                                    param.label = param.paramCName;
                                    param.value = packageParamKey(
                                        param,
                                        paramList
                                    );
                                    param.leaf = !(param?.children?.length > 0);
                                    return param;
                                })
                                .filter((param) =>
                                    param.paramCName.includes(
                                        this.formData.paramCName
                                    )
                                );
                            this.setParamListDisabledByRowParamType(
                                paramList2,
                                row
                            );
                            paramList2 = paramList2.map((item) => {
                                item.label = item.paramCName;
                                item.value = packageParamKey(
                                    item,
                                    this.currentParentCpnInfo.paramList
                                );
                                item.leaf = !(item?.children?.length > 0);
                                return item;
                            });
                            paramListWithFilter = unduplicated(
                                [...paramList2],
                                "paramOrder"
                            );
                            let res = reList(paramListWithFilter);
                            if (paramId) {
                                res = [this.findParamList(res, paramId)];
                            }
                            return res;
                        }
                    }
                } else {
                    let paramList = JSON.parse(
                        JSON.stringify(
                            this.compositeIdMapToParamList[row.actionId]
                                ?.paramList || []
                        )
                    );
                    const paramDirection =
                        row.apSource == "00" || row.apSource === "139"
                            ? "0"
                            : "1";
                    console.log(paramList, "paramList");
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
                    if (this.disabledData) {
                        paramListWithFilter = paramList.filter((param) => {
                            const paramOrder = param.paramOrder;
                            const arr = paramOrder.split(".");
                            const paramParentOrder = arr[0] + "." + arr[1];
                            const paramParent = paramList.find((item) => {
                                return (
                                    item.paramOrder === paramParentOrder &&
                                    item.paramDirection == paramDirection
                                );
                            });
                            if (
                                paramParent &&
                                paramParent.paramType !== "List" &&
                                paramParent.paramType !== "Object" &&
                                param.paramDirection == paramDirection
                            ) {
                                return param;
                            }
                        });
                    }
                    paramListWithFilter = unduplicated(
                        getRelativeParamList(paramListWithFilter, paramList),
                        "paramOrder"
                    );

                    let res = reList(paramListWithFilter);
                    if (paramId) {
                        res = [this.findParamList(res, paramId)];
                    }

                    return res;
                }
            } else {
                return [];
            }
        },
    },
    inject: ["getDataList", "setCurrentActionId"],
    methods: {
        async handleEnumNodeClick(data, node,element) {
            console.log('handleEnumNodeClick', data, node, element)
            if (node.level == 2) {
                const { row } = this.currentScope;
                row.paramMappingKey = data.value;
                row.paraMapgNm = data.label;
                this.flag = false;
                this.$emit("updateTableData");
                this.$emit("updateEnumData", this.currentScope.row, data, node.parent.data);
            }
        },
        handleNodeClick(data, node, type) {
            if (node.data?.disabled) return;
            if (type == "paramCName") {
                const { row, column } = this.currentScope;
                this.currentKey = data.paramOrder;
                row.paramMappingKey = node?.data?.value;
                row.paraMapgNm = node?.data?.label;
                this.flag = false;
                for (let i = 0; i < row.children?.length; i++) {
                    const item = row.children[i];
                    item.tree = data.value;
                }
                row?.children?.forEach((item1) => {
                    item1.disabled3 = false;
                });
                if (row?.chidlren && row?.children.length) {
                    this.$emit("updateTableData");
                }
            }
            this.$emit("update", this.currentScope.row, node.data);
            // console.log("row===>",this.currentScope)
        },
        async loadEnumNode(node, resolve) {
          if (node.level === 0) {
            return resolve(this.enumList);
          } else {
            console.log('node', node);
            if (node.data.value) {
              const { enumInfoList } = await this.rpc.d4.queryEnumClassInfo({
                enumCalssId: node.data.enumCalssId,
              });
              return resolve(enumInfoList.map(item => {
                return {
                  label: item.enumDesc,
                  value: item.enumEngAbbr,
                  leaf: true,
                }
              }));
            } else {
              return resolve([]);
            }
          }
        },
        findParamList(children, paramId) {
            let children1 = [];
            for (let i = 0; i < children?.length; i++) {
                const item = children[i];
                if (item.value === paramId) {
                    return item;
                } else {
                    children1 = [...children1, ...item?.children];
                }
            }
            if (children1.length) {
                return this.findParamList(children1, paramId);
            }
            return null;
        },
        handleChange(e) {
            console.log(e, "change");
        },
        setDisabled(list, status) {
            for (let i = 0; i < list.length; i++) {
                const item1 = list[i];
                item1.disabled2 = status;
                item1.disabled3 = status;
                if (!status) {
                    item1.tree = null;
                }
                if (item1.children) {
                    this.setDisabled(item1.children, status);
                }
            }
        },
        setParamList(children) {
            for (let i = 0; i < children.length; i++) {
                const row = children[i];
                row.paraMapgNm =
                    row.paramMappingKey =
                    row.actionId =
                    row.actionName =
                    row.apSource =
                        "";
                if (row.children) {
                    this.setParamList(row.children);
                }
            }
        },
        setFixdParams(row, item, e) {
            for (let i = 0; i < row?.children?.length; i++) {
                const child = row.children[i];
                child.paraMapgNm = child.paramMappingKey = "";
                child.actionId = row.actionId;
                child.actionName = row.actionName;
                if (e == this.currentServObj?.svcId) {
                    child.apSource = "00";
                } else {
                    child.apSource = actionTypeToApSource[item?.actionType];
                }
                if (child.children?.length) {
                    this.setFixdParams(child, item, e);
                }
                console.log(i, "iiii");
            }
        },
        clickOption(e) {
            if (e == 'constantValue') {
                this.$emit("changeEnumOption");
            }
        },
        handleChangeData(e) {
            const { row, column } = this.currentScope;
            console.log(this.currentScope, e, 'handleChangeData')
            const children = row?.children;
            if (e === "complex" || !e) {
                console.log(children, "children");
                if (children && children.length) {
                    for (let i = 0; i < children.length; i++) {
                        let item1 = children[i];
                        item1.disabled2 = false;
                        item1.disabled3 = false;
                        item1.tree = null;
                        if (item1.children) {
                            this.setDisabled(item1.children, false);
                        }
                    }
                }
            } else {
                if (children && children.length) {
                    for (let i = 0; i < children.length; i++) {
                        let item1 = children[i];
                        item1.disabled2 = true;
                        item1.disabled3 = true;
                        if (item1.children) {
                            this.setDisabled(item1.children, true);
                        }
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
                if (row.children) {
                    this.setParamList(row.children, "");
                }
            } else if (e == "constantValue") {
                row.paraMapgNm = row.paramMappingKey = "";
                row.actionId = e;
                row.actionName = "枚举值";
                row.apSource = actionTypeToApSource[e];
            } else if (e == "fixedValue") {
                row.paraMapgNm = row.paramMappingKey = "";
                row.actionId = e;
                row.actionName = "固定值";
                row.apSource = actionTypeToApSource[e];
            } else if (e == "complex") {
                row.paraMapgNm = row.paramMappingKey = "";
                row.actionId = e;
                row.actionName = "复合来源";
                row.apSource = actionTypeToApSource[e];
            } else {
                row.paraMapgNm = row.paramMappingKey = "";
                const item = this.options.find((item) => item.value == e);
                row.actionId = item?.value || e;
                row.actionName = item?.label;
                this.setFixdParams(row, item, e);
                if (e == this.currentServObj?.svcId) {
                    row.apSource = "00";
                } else {
                    row.apSource = actionTypeToApSource[item?.actionType];
                }
                // await this.updateCompositeIdMapToParamList()
            }
            this.$emit("updateTableData");
        },
        async change(e) {
            const { row, column } = this.currentScope;
            if (column.label == "来源") {
                if (
                    (row.paramType === "List" || row.paramType === "Object") &&
                    this.currentObj.actionType !== "assignAction"
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
                            this.handleChangeData(e);
                        })
                        .catch(() => {});
                } else {
                    this.handleChangeData(e);
                }
            } else if (column.label == "来源值") {
                const item = this.options.find((item) => item.value == e);
                row.paramMappingKey = item?.value || e;
                row.paraMapgNm = item?.label;
            }
        },
        async updateCompositeIdMapToParamList() {
            const { row } = this.currentScope;
            const compositeId = row.actionId;
            const item = this.compositeIdMapToParamList[compositeId];
            const apiId = item?.svcId;
            const target = this.compositeIdMapToParamList[row?.actionName];
            if (target) {
                return;
            }
            if (compositeId && item && !item?.paramList?.length) {
                if (
                    apiId &&
                    ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(
                        item.actionType
                    )
                ) {
                    const res =
                        await this.rpc.d4.queryL5ParamAndRuleDefinitions({
                            d4StusCd: "1",
                            blngtoTyp: "10",
                            apiId: apiId,
                            d4bApiId:
                                this.currentServObj?.svcId ||
                                this.currentServObj.apiId,
                            bizDomainNo: this.currentServObj.bizLineId,
                        });
                    item.paramList = res.paramList;
                } else if (item.actionType == "loopAction") {
                    if (this.currentParentCpnInfo?.actionType == "loopAction") {
                        // 在循环组件的子流程内，选择了来源为当前循环组件时
                        const loopListSource =
                            this.currentParentCpnInfo?.conf?.find(
                                (item) => item.name == "loopListSource"
                            ).value;
                        const loopList = this.currentParentCpnInfo?.conf?.find(
                            (item) => item.name == "loopList"
                        ).value;
                        const _item =
                            this.compositeIdMapToParamList[loopListSource];
                        const _apiId = _item?.svcId;
                        if (loopListSource && !_item?.paramList?.length) {
                            if (
                                _apiId &&
                                [
                                    "D4bAction",
                                    "D5SelfAction",
                                    "D5LinkAction",
                                ].includes(_item.actionType)
                            ) {
                                const _res =
                                    await this.rpc.d4.queryL5ParamAndRuleDefinitions(
                                        {
                                            d4StusCd: "1",
                                            blngtoTyp: "10",
                                            apiId: _apiId,
                                            d4bApiId:
                                                this.currentServObj?.svcId ||
                                                this.currentServObj.apiId,
                                            bizDomainNo:
                                                this.currentServObj.bizLineId,
                                        }
                                    );
                                _item.paramList = _res.paramList;
                            }
                        }
                    } else {
                        // 在主流程，选择了来源为某个循环组件时
                        const res = await this.rpc.d4.getServiceCpnParams({
                            d4StusCd: "1",
                            blngtoTyp: "11",
                            compositeId: compositeId,
                        });
                        item.paramList = res.paramList;
                    }
                } else if (
                    [
                        "cacheSessionAction",
                        "getSessionAction",
                        "updateSessionAction",
                    ].includes(item.actionType)
                ) {
                    const res = await this.rpc.newEditor.querySessionParam({
                        appId: this.currentServObj.transAppId,
                        paramCateg: "1",
                    });
                    item.paramList = mixList(res.pubDataList, "children").map(
                        (item) => {
                            item.paramCName = item.paramName;
                            item.paramKey = item.paramCode;
                            item.paramParentId = item.paramParentOrder;
                            return item;
                        }
                    );
                } else if (
                    [
                        "uploadAction",
                        "getCacheAction",
                        "setCacheAction",
                        "assignAction",
                        "updateCacheAction",
                        "autoAction",
                        "setHeaderAction",
                        "keyMapAction",
                        "listAction",
                        "timeAction",
                        "transferStateAction",
                        "listSetValAction",
                        "captchaAction",
                        "desensitizationAction",
                        "getDesensitizationAction",
                        "getFlowNumAction",
                    ].includes(item.actionType)
                ) {
                    const res = await this.rpc.d4.getServiceCpnParams({
                        d4StusCd: "1",
                        blngtoTyp: "11",
                        compositeId: compositeId,
                    });
                    item.paramList = res.paramList;
                }
            }
        },
        getOptionsName(item) {
            const { property } = this.currentScope.column;
            if (property == "actionId") {
                return item.svcId == this.currentServObj?.svcId ||
                    [
                        "无",
                        "当前循环组件",
                        "枚举值",
                        "固定值",
                        "获取会话组件",
                        "复合来源",
                    ].includes(item.label)
                    ? item.label
                    : `${item.label}(${item.actionSeq})`;
            } else {
                return item.label;
            }
        },
        filterParamListByRowParamType(paramList, row) {
            // console.log("filterParamListByRowParamType", paramList, row)
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
        setParamListDisabledByRowParamType2(paramList, row) {
            const { paramType } = row;
            if (["List", "Object", "Date"].includes(paramType)) {
                paramList.forEach((param) => {
                    param.disabled = param.paramType != paramType;
                    param.label = param.paramCName;
                    param.value = param.paramKey;
                    param.leaf = !(param?.children?.length > 0);
                    this.setParamListDisabledByRowParamType2(
                        param.children || [],
                        row
                    );
                });
            } else {
                paramList.forEach((param) => {
                    param.disabled = ["List", "Object"].includes(
                        param.paramType
                    );
                    param.label = param.paramCName;
                    param.value = param.paramKey;
                    param.leaf = !(param?.children?.length > 0);
                    this.setParamListDisabledByRowParamType2(
                        param.children || [],
                        row
                    );
                });
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
        handleInput(e) {
            this.defaultExpanded = this.getDefaultExpanded(this.paramCNameTree);
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
        async init(scope, event) {
            this.currentScope = scope;
            console.log('currentScope======>', this.currentScope);
            
            this.currentEvent = event;
            this.currentPosition = event.target.getBoundingClientRect();
            const { property } = scope.column;
            if (property == "paraMapgNm") {
                this.selectValue = scope.row.paramMappingKey;
            } else {
                this.selectValue = scope.row[property];
            }
            this.formData = {
                paramCName: "", // 参数中文名
            };
            this.flag = false;
            await this.updateCompositeIdMapToParamList();
            this.flag = true;
            // setTimeout(() => {
            //   this.$refs.elSelectRef.toggleMenu();
            // }, 150)
            this.$nextTick(() => {
                this.$refs.elSelectRef.toggleMenu();
                if (this.columnLabel == "来源值") {
                    console.log("???????");

                    const { row } = this.currentScope;
                    let paramList = JSON.parse(
                        JSON.stringify(
                            this.compositeIdMapToParamList[row.actionId]
                                ?.paramList || []
                        )
                    );
                    const paramParent = getParamParent(row, paramList);
                    if (paramParent) {
                        if (
                            ["bodyData", "bodyOutData"].includes(
                                paramParent.paramKey
                            )
                        ) {
                            // 默认展开body
                            // console.log("默认展开body")
                            const items = this.paramCNameTree.filter(
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
                            const items = this.paramCNameTree.filter(
                                (param) =>
                                    !param.paramParentId &&
                                    (["resHeaderData"].includes(
                                        param.paramKey
                                    ) ||
                                        param.paramKey == paramParent.paramKey)
                            );
                            if (items?.length) {
                                this.defaultExpanded = items.map(
                                    (item) => item.paramOrder
                                );
                            }
                        }
                    }
                }
            });
        },
        getSourerDataHandle(data) {
            data.map((item) => {
                item.paramCName = item.paramName;
                item.paramKey = item.paramCode;
                item.paramParentId = item.paramParentOrder;
                if (item?.children?.length > 0) {
                    this.getSourerDataHandle(item.children);
                }
            });
        },
        deepChildren(children, parent = null) {
            for (let i = 0; i < children.length; i++) {
                const item = children[i];
                item.paramCName = item.paramName;
                if (parent) {
                    item.paramKey = parent.paramKey + "." + item.paramCode;
                } else {
                    item.paramKey = item.paramCode;
                }
                item.paramParentId = item.paramParentOrder;
                if (item.children && item.children.length) {
                    this.deepChildren(item.children, item);
                } else {
                    item.children = [];
                }
            }
        },
    },
    async created() {
        // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
        this.appId = this.$route.query.appId;
        this.projectId = this.$route.query.projectId;
        const dataList = this.getDataList();
        if (this.currentParentCpnInfo?.actionType == "loopAction") {
            dataList.push(...this.currentParentCpnInfo.dataList);
        }
        const { apiName, puApiParams } = this.currentServObj;
        this.compositeIdMapToParamList = dataList.reduce(
            (prev, data) => {
                if (
                    sourceActionType.includes(data.actionType) &&
                    data.compositeId
                ) {
                    // const svcId = data.conf.find(item => item.name == "svcId").value
                    const compositeId = data.compositeId;
                    if (!this.compositeIdMapToParamList[compositeId]) {
                        prev[compositeId] = {
                            svcId: data.actionOwnId,
                            svcNm: data.actionName,
                            actionType: data.actionType,
                            paramList: [],
                        };
                    }
                }
                return prev;
            },
            {
                [this.currentServObj?.svcId]: {
                    svcNm: apiName,
                    svcId: this.currentServObj?.svcId,
                    paramList: puApiParams,
                },
            }
        );
        let item = {
            svcNm: "获取会话组件",
            paramList: [],
            svcId: "获取会话组件",
        };
        const res = await this.rpc.newEditor.querySessionParam({
            appId: this.currentServObj.transAppId,
            paramCateg: "1",
        });
        this.deepChildren(res.pubDataList);
        item.paramList = res.pubDataList;
        this.compositeIdMapToParamList["获取会话组件"] = item;
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_simulant_select {
    position: fixed;
    .select_container {
        width: 0px;
        overflow: hidden;
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
        .search_area {
            padding: 0 10px 8px;
        }
    }
    .tree_select_container {
        ::v-deep .el-scrollbar {
            .el-scrollbar__bar {
                &.is-vertical {
                    display: none;
                }
            }
        }
    }
    .container {
        padding: 16px;
    }
    .edit_form {
        margin-top: 10px;
        @include form;
    }
    .table_style ::v-deep .el-table__header-wrapper .el-checkbox {
        display: none;
    }
}
</style>
