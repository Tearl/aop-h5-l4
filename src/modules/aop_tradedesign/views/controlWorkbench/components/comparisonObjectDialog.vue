<template>
    <el-dialog
        class="aop_tradedesign_comps_page_dialog"
        :visible.sync="dialogVisiable"
        :width="dialogWidth"
        :modal-append-to-body="modalAppendToBody"
        :before-close="handleClose"
        :append-to-body="apTobody"
        :close-on-click-modal="false"
        :custom-class="customClass"
        center
    >
        <template slot="title">
            <div class="dialog_title">
                <span>提交评审确认</span>
                <div class="tips_box">
                    <img src="../assets/images/gantanhao.svg" alt="提示图标" />
                    <span>点击左侧项，再点击右侧项建立映射关系</span>
                </div>
            </div>
        </template>
        <div class="dialog_box">
            <!-- 顶部对象基本信息 -->
            <div class="box_header">
                <div class="box_l box_wrap">
                    <div class="comparison_box_title">
                        <span>申请对象</span>
                    </div>
                    <div class="info_card">
                        <div class="info_t">
                            <div class="left">
                                {{ basicInfo.objName || "/" }}
                            </div>
                            <div class="right">
                                {{
                                    basicInfo.objType == "00"
                                        ? "实体对象"
                                        : "值对象" || "/"
                                }}
                            </div>
                        </div>
                        <div class="info_t">
                            <div class="left_b">
                                申请人：{{ detailData.aplyUserName || "/" }}
                            </div>
                            <div class="right_b">
                                申请时间: {{ detailData.aplyTime || "/" }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box_r box_wrap">
                    <div class="comparison_box_title">
                        <span>业务对象处理</span>
                        <div class="info_t">
                            <!-- <div class="left_b">{{ cstNo || '/' }}</div> -->
                            <!-- <div class="right_b"> {{ handelType == '0' ? '从业务对象选择' : '新增业务对象' }}</div> -->
                        </div>
                    </div>
                    <div class="info_card">
                        <div class="info_t">
                            <div class="left">
                                {{ selectedItem.objName || "/" }}
                            </div>
                            <div class="right">
                                {{
                                    selectedItem.objType == "00"
                                        ? "实体对象"
                                        : "值对象" || "/"
                                }}
                            </div>
                        </div>
                        <div class="info_t">
                            <div class="left_b">
                                创建人：{{
                                    selectedItem.createUser ||
                                    selectedItem.userName ||
                                    "/"
                                }}
                            </div>
                            <div class="right_b">
                                创建时间：{{ selectedItem.createTime || "/" }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 对象属性对比区域 -->
            <div class="box_center">
                <div class="card_title box_wrap">
                    <span class="d_line"></span>
                    <span class="d_detail">对象属性</span>
                </div>
                <div class="card_title card_title_wrap box_wrap">
                    <div class="title_wrap">
                        <span class="d_line"></span>
                        <span class="d_detail">对象属性</span>
                        <span class="tips" v-if="!isAllMatch('attribute')"
                            >属性不满足</span
                        >
                    </div>
                    <el-button type="primary" size="mini" @click="handleEdit()"
                        >编辑</el-button
                    >
                </div>
            </div>
            <div class="box_bottom">
                <!-- 左侧申请对象属性 -->
                <div class="table-left box_wrap_b">
                    <div class="list_box">
                        <template
                            v-if="
                                getProcessedInfo('left', 'attribute').length > 0
                            "
                        >
                            <div
                                class="list_item"
                                v-for="(item, index) in getProcessedInfo(
                                    'left',
                                    'attribute'
                                )"
                                :key="`attr-left-${index}`"
                                :data-id="item.obaId"
                                :data-type="`attribute-left-${item.obaId}`"
                                @click="
                                    handleLeftItemClick('attribute', item.obaId)
                                "
                                :class="{
                                    selected:
                                        selectedLeftItem.type === 'attribute' &&
                                        selectedLeftItem.id === item.obaId,
                                    mapped: isItemMatch(item, 'attribute'),
                                }"
                            >
                                <span class="title">字段名称</span>
                                <span class="desc desc_title">{{
                                    item.dictryName + "(" + item.dictryNo + ")"
                                }}</span>
                                <!-- 匹配状态图标 -->
                                <span
                                    class="img"
                                    v-if="!isItemMatch(item, 'attribute')"
                                >
                                    <img
                                        src="../assets/images/false.png"
                                        alt="未匹配"
                                    />
                                </span>
                                <span
                                    class="img"
                                    v-if="isItemMatch(item, 'attribute')"
                                >
                                    <img
                                        src="../assets/images/success.png"
                                        alt="已匹配"
                                    />
                                </span>
                            </div>
                        </template>
                        <noData v-else />
                    </div>
                </div>
                <!-- 中间连线区域（SVG容器） -->
                <div
                    class="table-center"
                    ref="attributeConnector"
                    data-type="attribute"
                >
                    <!-- SVG动态生成连线 -->
                    <svg width="100%" height="100%" ref="attributeSvg"></svg>
                </div>
                <!-- 右侧选中对象属性 -->
                <div class="table-right box_wrap_b">
                    <div class="list_box">
                        <template
                            v-if="
                                getProcessedInfo('right', 'attribute').length >
                                0
                            "
                        >
                            <div
                                class="list_item"
                                v-for="(item, index) in getProcessedInfo(
                                    'right',
                                    'attribute'
                                )"
                                :key="`attr-right-${index}`"
                                :data-id="item.obaId"
                                :data-type="`attribute-right-${item.obaId}`"
                                @click="
                                    handleRightItemClick(
                                        'attribute',
                                        item.obaId
                                    )
                                "
                                :class="{
                                    selected: isRightItemSelected(
                                        'attribute',
                                        item.obaId
                                    ),
                                }"
                            >
                                <span class="title">字段名称</span>
                                <span class="desc desc_title">{{
                                    item.dictryName + "(" + item.dictryNo + ")"
                                }}</span>
                            </div>
                        </template>
                        <noData v-else />
                    </div>
                </div>
            </div>

            <!-- 对象行为对比区域 -->
            <div class="box_center">
                <div class="card_title box_wrap">
                    <span class="d_line"></span>
                    <span class="d_detail">对象行为</span>
                </div>
                <div class="card_title box_wrap">
                    <div class="title_wrap">
                        <span class="d_line"></span>
                        <span class="d_detail">对象行为</span>
                        <span class="tips" v-if="!isAllMatch('behavior')"
                            >行为不满足</span
                        >
                    </div>
                </div>
            </div>
            <div class="box_bottom">
                <!-- 左侧申请对象行为 -->
                <div class="table-left box_wrap_b">
                    <div class="list_box">
                        <template
                            v-if="
                                getProcessedInfo('left', 'behavior').length > 0
                            "
                        >
                            <div
                                class="list_item"
                                v-for="(item, index) in getProcessedInfo(
                                    'left',
                                    'behavior'
                                )"
                                :key="`behavior-left-${index}`"
                                :data-id="item.obeId"
                                :data-type="`behavior-left-${item.obeId}`"
                                @click="
                                    handleLeftItemClick('behavior', item.obeId)
                                "
                                :class="{
                                    selected:
                                        selectedLeftItem.type === 'behavior' &&
                                        selectedLeftItem.id === item.obeId,
                                    mapped: isItemMatch(item, 'behavior'),
                                }"
                            >
                                <span class="title">行为名称</span>
                                <span class="desc desc_title">{{
                                    item.obeName + "(" + item.obeNo + ")"
                                }}</span>
                                <!-- 匹配状态图标 -->
                                <span
                                    class="img"
                                    v-if="!isItemMatch(item, 'behavior')"
                                >
                                    <img
                                        src="../assets/images/false.png"
                                        alt="未匹配"
                                    />
                                </span>
                                <span
                                    class="img"
                                    v-if="isItemMatch(item, 'behavior')"
                                >
                                    <img
                                        src="../assets/images/success.png"
                                        alt="已匹配"
                                    />
                                </span>
                            </div>
                        </template>
                        <noData v-else />
                    </div>
                </div>
                <!-- 中间连线区域（SVG容器） -->
                <div
                    class="table-center"
                    ref="behaviorConnector"
                    data-type="behavior"
                >
                    <!-- SVG动态生成连线 -->
                    <svg width="100%" height="100%" ref="behaviorSvg"></svg>
                </div>
                <!-- 右侧选中对象行为 -->
                <div class="table-right box_wrap_b">
                    <div class="list_box">
                        <template
                            v-if="
                                getProcessedInfo('right', 'behavior').length > 0
                            "
                        >
                            <div
                                class="list_item"
                                v-for="(item, index) in getProcessedInfo(
                                    'right',
                                    'behavior'
                                )"
                                :key="`behavior-right-${index}`"
                                :data-id="item.obeId"
                                :data-type="`behavior-right-${item.obeId}`"
                                @click="
                                    handleRightItemClick('behavior', item.obeId)
                                "
                                :class="{
                                    selected: isRightItemSelected(
                                        'behavior',
                                        item.obeId
                                    ),
                                }"
                            >
                                <span class="title">行为名称</span>
                                <span class="desc desc_title">{{
                                    item.obeName + "(" + item.obeNo + ")"
                                }}</span>
                            </div>
                        </template>
                        <noData v-else />
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog_footer" v-show="footerShow">
            <slot name="footer">
                <el-button @click.native="handleClose">取 消</el-button>
                <el-button
                    type="primary"
                    :disabled="
                        !isAllMatch('attribute') || !isAllMatch('behavior')
                    "
                    @click.native="handleSave"
                    >确认提交</el-button
                >
            </slot>
        </span>
    </el-dialog>
</template>

<script>
import arrowIcon from "./arrowIcon.vue";
import noData from "./noData.vue";
import { getLocalStorage } from "@m/utils/localStorage.js";
export default {
    props: {
        dialogVisiable: { type: Boolean, default: false },
        dialogWidth: { type: String, default: "70%" },
        dialogTitle: { type: String, default: "提交评审确认" },
        apTobody: { type: Boolean, default: false },
        modalAppendToBody: { type: Boolean, default: false },
        customClass: { type: String, default: "" },
        footerShow: { type: Boolean, default: true },
        basicInfo: { type: Object, default: () => ({}) }, // 左侧：申请对象
        selectedItem: { type: Object, default: () => ({}) }, // 右侧：选中对象
        handelType: { type: String, default: "0" },
        bussinessItem: { type: Object, default: () => ({}) },
        detailData: { type: Object, default: () => ({}) },
    },
    components: { arrowIcon, noData },
    data() {
        return {
            infoConfig: {
                attribute: {
                    leftKey: "attributeInfos",
                    rightKey: "attributeInfos",
                    leftIdKey: "obaId", // 左侧属性唯一标识
                    rightIdKey: "obaId", // 右侧属性唯一标识
                },
                behavior: {
                    leftKey: "objectBehaviorInfos",
                    rightKey: "objectBehaviorInfos",
                    leftIdKey: "obeId", // 左侧行为唯一标识
                    rightIdKey: "obeId", // 右侧行为唯一标识
                },
            },
            // 手动映射关系：{ 类型: { 左侧ID: 右侧ID数组 } }
            manualMap: {
                attribute: {},
                behavior: {},
            },
            selectedLeftItem: {
                type: null, // attribute/behavior
                id: null, // 左侧项ID
            },
            initialMappedRightIds: {
                attribute: new Set(), // 存储属性类型的初始已映射右侧ID
                behavior: new Set(), // 存储行为类型的初始已映射右侧ID
            },
            cstNo: "",
        };
    },
    // watch: {
    //     // 监听左侧数据变化
    //     'basicInfo.attributeInfos': {
    //         deep: true,
    //         handler() {
    //             this.handleDataChange('attribute');
    //         }
    //     },
    //     'basicInfo.objectBehaviorInfos': {
    //         deep: true,
    //         handler() {
    //             this.handleDataChange('behavior');
    //         }
    //     },
    //     // 监听右侧数据变化
    //     'selectedItem.attributeInfos': {
    //         deep: true,
    //         handler() {
    //             this.handleDataChange('attribute');
    //         }
    //     },
    //     'selectedItem.objectBehaviorInfos': {
    //         deep: true,
    //         handler() {
    //             this.handleDataChange('behavior');
    //         }
    //     }
    // },
    watch: {
        // 监听左侧申请对象的属性/行为变化（删除item会导致数组长度/内容变更）
        basicInfo: {
            deep: true, // 深度监听对象内部数组/属性变化
            handler() {
                this.handleDataChange("attribute"); // 处理属性类型
                this.handleDataChange("behavior"); // 处理行为类型
            },
        },
        // 监听右侧选中对象的属性/行为变化
        selectedItem: {
            deep: true,
            handler() {
                this.handleDataChange("attribute");
                this.handleDataChange("behavior");
            },
        },
    },
    mounted() {
        this.$nextTick(() => {
            console.log(this.basicInfo,this.selectedItem,'//????111');
            this.initDefaultMap("attribute");
            this.initDefaultMap("behavior");
            this.drawAllLines("attribute");
            this.drawAllLines("behavior");
            this.getRoleFn();
            this.$forceUpdate();
        });
    },
    // beforeDestroy() {
    //     window.removeEventListener('scroll', this.handleScroll);
    // },
    methods: {
        handleDataChange(type) {
            const { leftKey, rightKey } = this.infoConfig[type];
            // 记录前后数据长度（用于判断是否需要重置）
            const prevLeftLen = this.basicInfo[leftKey]?.length || 0;
            const prevRightLen = this.selectedItem[rightKey]?.length || 0;
            const newLeftLen = this.basicInfo[leftKey]?.length || 0;
            const newRightLen = this.selectedItem[rightKey]?.length || 0;

            // 只有当左右数据长度变化时，才重置映射（避免意外清空）
            if (prevLeftLen !== newLeftLen || prevRightLen !== newRightLen) {
                this.initialMappedRightIds[type].clear();
                this.manualMap[type] = {}; // 仅在必要时清空
                if (this.selectedLeftItem.type === type) {
                    this.selectedLeftItem = { type: null, id: null };
                }
                this.clearLines(type);
                this.initDefaultMap(type);
                this.drawAllLines(type);
            }
            this.$forceUpdate();
        },

        getRoleFn() {
            //获取角色
            let userInfo = JSON.parse(getLocalStorage("_userInfo"));
            this.cstNo = userInfo.cstName;
        },
        getRawData(side, type) {
            const { leftKey, rightKey } = this.infoConfig[type];
            const source = side === "left" ? this.basicInfo : this.selectedItem;
            return Array.isArray(source[side === "left" ? leftKey : rightKey])
                ? source[side === "left" ? leftKey : rightKey]
                : [];
        },
        handleLeftItemClick(type, leftId) {
            if (
                this.selectedLeftItem.type === type &&
                this.selectedLeftItem.id === leftId
            ) {
                this.selectedLeftItem = { type: null, id: null };
                return;
            }
            this.selectedLeftItem = { type, id: leftId };
        },
        // handleRightItemClick(type, rightId) {
        //     if (!this.selectedLeftItem.type || this.selectedLeftItem.type !== type) return;
        //     const leftId = this.selectedLeftItem.id;
        //     const mapKey = type;
        //     if (this.manualMap[mapKey][leftId]?.includes(rightId)) {
        //         this.manualMap[mapKey][leftId] = this.manualMap[mapKey][leftId].filter(id => id !== rightId);
        //         if (this.manualMap[mapKey][leftId].length === 0) {
        //             delete this.manualMap[mapKey][leftId];
        //         }
        //     } else {
        //         if (!this.manualMap[mapKey][leftId]) {
        //             this.manualMap[mapKey][leftId] = [];
        //         }
        //         this.manualMap[mapKey][leftId].push(rightId);
        //     }
        //     this.clearLines(type);
        //     this.drawAllLines(type);
        //     this.selectedLeftItem = { type: null, id: null };
        // },
        // handleRightItemClick(type, rightId) {
        //     if (
        //         !this.selectedLeftItem.type ||
        //         this.selectedLeftItem.type !== type
        //     )
        //         return;
        //     const currentLeftId = this.selectedLeftItem.id;
        //     let isRightUsed = false;

        //     // 检查右侧项是否被占用
        //     Object.entries(this.manualMap[type]).forEach(
        //         ([leftId, mappedRightIds]) => {
        //             if (
        //                 leftId !== currentLeftId &&
        //                 mappedRightIds.includes(rightId)
        //             ) {
        //                 isRightUsed = true;
        //             }
        //         }
        //     );
        //     if (isRightUsed) {
        //         this.$message.warning(
        //             "该右侧项已被其他左侧项映射，无法重复关联"
        //         );
        //         return;
        //     }

        //     // 关键修复：用this.$set确保响应式更新
        //     if (!this.manualMap[type][currentLeftId]) {
        //         // 新增左侧项的映射数组时，用$set触发响应式
        //         this.$set(this.manualMap[type], currentLeftId, []);
        //     }

        //     // 处理映射关系
        //     const index = this.manualMap[type][currentLeftId].indexOf(rightId);
        //     if (index > -1) {
        //         // 取消映射
        //         this.manualMap[type][currentLeftId].splice(index, 1);
        //         if (this.manualMap[type][currentLeftId].length === 0) {
        //             // 删除空数组时，用$delete确保响应式
        //             this.$delete(this.manualMap[type], currentLeftId);
        //         }
        //     } else {
        //         // 新增映射
        //         this.manualMap[type][currentLeftId].push(rightId);
        //     }

        //     // 重绘连线
        //     this.clearLines(type);
        //     this.drawAllLines(type);
        //     this.selectedLeftItem = { type: null, id: null };
        // },

        handleRightItemClick(type, rightId) {
            if (
                !this.selectedLeftItem.type ||
                this.selectedLeftItem.type !== type
            )
                return;
            const currentLeftId = this.selectedLeftItem.id;

            // ==============================================
            // 需求1：一对一 → 右侧项任何时候都不能被多个左侧绑定
            // ==============================================
            let isRightUsed = false;
            let usedByLeftId = null;

            Object.entries(this.manualMap[type]).forEach(
                ([leftId, mappedRightIds]) => {
                    if (mappedRightIds.includes(rightId)) {
                        isRightUsed = true;
                        usedByLeftId = leftId;
                    }
                }
            );

            // ==============================================
            // 需求3：如果右侧项已被自己绑定 → 取消关联
            // ==============================================
            if (isRightUsed && usedByLeftId === currentLeftId) {
                this.$delete(this.manualMap[type], usedByLeftId);
                this.clearLines(type);
                this.drawAllLines(type);
                this.selectedLeftItem = { type: null, id: null };
                return;
            }

            // ==============================================
            // 需求3：如果右侧被别人绑定 → 不允许
            // ==============================================
            if (isRightUsed && usedByLeftId !== currentLeftId) {
                this.$message.warning("该选项已被关联，请先取消原关联");
                return;
            }

            // ==============================================
            // 需求1：一对一 → 左侧项只能保留一个右侧项
            // 先删除当前左侧已有的关联
            // ==============================================
            if (this.manualMap[type][currentLeftId]) {
                this.$delete(this.manualMap[type], currentLeftId);
            }

            // ==============================================
            // 需求2：保持原有数据结构 → 依然存数组
            // ==============================================
            this.$set(this.manualMap[type], currentLeftId, [rightId]);

            // 重绘
            this.clearLines(type);
            this.drawAllLines(type);
            this.selectedLeftItem = { type: null, id: null };
        },
        isRightItemSelected(type, rightId) {
            if (
                !this.selectedLeftItem.type ||
                this.selectedLeftItem.type !== type
            )
                return false;
            const leftId = this.selectedLeftItem.id;
            return this.manualMap[type][leftId]?.includes(rightId) || false;
        },
        clearLines(type) {
            const svg = this.$refs[`${type}Svg`];
            if (!svg) return;
            // 直接清空SVG内容（比循环删除更彻底）
            svg.innerHTML = "";
        },
        initDefaultMap(type) {
            const { leftKey, rightKey, leftIdKey, rightIdKey } =
                this.infoConfig[type];
            const leftData = this.basicInfo[leftKey] || [];
            const rightData = this.selectedItem[rightKey] || [];
            const tempMappedIds = new Set();

            // 只在manualMap[type]为空时初始化（避免重复添加）
            if (Object.keys(this.manualMap[type]).length === 0) {
                leftData.forEach((leftItem) => {
                    const leftId = leftItem[leftIdKey];
                    const matchedRightIds = rightData
                        .filter((rightItem) => rightItem[rightIdKey] === leftId)
                        .map((rightItem) => rightItem[rightIdKey]);

                    if (matchedRightIds.length > 0) {
                        this.manualMap[type][leftId] = matchedRightIds;
                        matchedRightIds.forEach((id) => tempMappedIds.add(id));
                    }
                });
            }

            this.initialMappedRightIds[type] = tempMappedIds;
        },
        // 绘制指定类型的所有连线
        drawAllLines(type) {
            const { leftIdKey, rightIdKey } = this.infoConfig[type];
            const leftData = this.getRawData("left", type);
            const rightData = this.getRawData("right", type);
            const svg = this.$refs[`${type}Svg`];
            console.log("触发了没");
            if (!svg) return;
            Object.entries(this.manualMap[type]).forEach(
                ([leftId, rightIds]) => {
                    rightIds.forEach((rightId) => {
                        // 找到对应的左右项数据
                        const leftItem = leftData.find(
                            (item) => item[leftIdKey] === leftId
                        );
                        const rightItem = rightData.find(
                            (item) => item[rightIdKey] === rightId
                        );

                        if (leftItem && rightItem) {
                            this.drawSingleLine(type, leftId, rightId);
                        }
                    });
                }
            );
        },

        // 绘制单条连线
        drawSingleLine(type, leftId, rightId) {
            // 获取左右项的DOM元素
            const leftEl = document.querySelector(
                `[data-type="${type}-left-${leftId}"]`
            );
            const rightEl = document.querySelector(
                `[data-type="${type}-right-${rightId}"]`
            );
            const svg = this.$refs[`${type}Svg`];
            const connector = this.$refs[`${type}Connector`];
            if (!leftEl || !rightEl || !svg || !connector) return;
            const connectorRect = connector.getBoundingClientRect();
            const leftRect = leftEl.getBoundingClientRect();
            const rightRect = rightEl.getBoundingClientRect();
            const startX = leftRect.right - connectorRect.left;
            const startY =
                leftRect.top + leftRect.height / 2 - connectorRect.top;
            const endX = rightRect.left - connectorRect.left;
            const endY =
                rightRect.top + rightRect.height / 2 - connectorRect.top;
            const line = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );
            line.setAttribute("x1", startX);
            line.setAttribute("y1", startY);
            line.setAttribute("x2", endX);
            line.setAttribute("y2", endY);
            line.setAttribute("stroke", "#358AFF");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("stroke-dasharray", "5,3");
            line.setAttribute(
                "data-connection",
                `${type}-${leftId}-${rightId}`
            );
            line.addEventListener("click", (e) => {
                e.stopPropagation();
                // 关键：直接操作manualMap，删除对应映射
                if (this.manualMap[type][leftId]) {
                    // 过滤掉当前要取消的rightId
                    this.manualMap[type][leftId] = this.manualMap[type][
                        leftId
                    ].filter((id) => id !== rightId);
                    // 如果数组空了，直接删除该leftId的记录
                    if (this.manualMap[type][leftId].length === 0) {
                        delete this.manualMap[type][leftId];
                    }
                    // 先清除所有旧连线，再基于最新manualMap重绘
                    this.clearLines(type);
                    this.drawAllLines(type);
                }
            });

            svg.appendChild(line);
        },
        getProcessedInfo(side, type) {
            // 从最新的props数据中获取列表（关键修改：避免使用旧数据）
            const leftData =
                this.basicInfo[this.infoConfig[type].leftKey] || [];
            const rightData =
                this.selectedItem[this.infoConfig[type].rightKey] || [];

            if (side === "left") {
                return leftData;
            }

            if (leftData.length === 0 || rightData.length === 0) {
                const { rightIdKey } = this.infoConfig[type];
                return [...rightData].sort(
                    (a, b) => a[rightIdKey] - b[rightIdKey]
                );
            }

            // 基于最新的初始映射状态筛选（避免残留已删除item的映射）
            const { rightIdKey } = this.infoConfig[type];
            const mappedItems = rightData
                .filter((item) =>
                    this.initialMappedRightIds[type].has(item[rightIdKey])
                )
                .sort((a, b) => a[rightIdKey] - b[rightIdKey]);
            const unmatchedItems = rightData
                .filter(
                    (item) =>
                        !this.initialMappedRightIds[type].has(item[rightIdKey])
                )
                .sort((a, b) => a[rightIdKey] - b[rightIdKey]);

            return [...mappedItems, ...unmatchedItems];
        },
        isItemMatch(leftItem, type) {
            const { leftIdKey } = this.infoConfig[type];
            const leftId = leftItem[leftIdKey];
            return !!this.manualMap[type][leftId]?.length;
        },

        isAllMatch(type) {
            const leftData = this.getRawData("left", type);
            const { leftIdKey } = this.infoConfig[type];

            if (leftData.length === 0) return true;

            // 所有左侧项都有至少一个映射
            return leftData.every((item) => {
                const leftId = item[leftIdKey];
                return !!this.manualMap[type][leftId]?.length;
            });
        },

        // 保存提交
        handleSave() {
            const finalMappings = JSON.parse(JSON.stringify(this.manualMap));
            this.$emit("saveForm", {
                basicInfo: this.basicInfo,
                selectedItem: this.selectedItem,
                mappings: finalMappings, // 传递映射关系
            });
        },

        // 关闭对话框
        handleClose() {
            this.$emit("closeDialog");
        },

        // 编辑
        handleEdit() {
            this.$emit("editDialog", this.selectedItem);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.aop_tradedesign_comps_page_dialog {
    ::v-deep .el-dialog {
        border-radius: 8px;
    }

    ::v-deep .el-dialog__header {
        background-color: $base_bg_color;
        text-align: left;
        padding: 0 24px;
        height: 48px;
        line-height: 48px;
        box-shadow: inset 0 -1px 0 0 #e7e7e7;
        border-radius: 8px 8px 0 0;
        font-weight: $font_weight_600;

        .el-dialog__headerbtn {
            top: 12px;
        }

        .el-dialog__title {
            font-family: $font_medium;
            font-size: 16px;
            color: $pri_ft_color;
            letter-spacing: 0;
            line-height: 24px;
        }
    }

    ::v-deep .el-dialog__body {
        max-height: 68vh;
        overflow: auto;
        padding: 16px 24px;
    }

    ::v-deep .el-dialog__footer {
        border-top: 1px solid #e7e7e7;
        padding: 16px 24px;

        button {
            width: 110px;
            height: $btn_large_h;
        }
    }

    .dialog_title {
        display: flex;

        .tips_box {
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-weight: 500;
            color: #e98f36;

            img {
                width: 14px;
                height: 14px;
                margin-right: 4px;
            }
        }
    }

    .dialog_box {
        width: 100%;

        .box_header {
            display: flex;
            justify-content: space-between;

            .info_card {
                background-color: #fff;
                border-radius: 4px;
                padding: 10px;

                .info_t {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .left {
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        color: #333333;
                        font-weight: 500;
                        margin-bottom: 10px;
                    }

                    .right {
                        width: 60%;

                        span {
                            display: inline-block;
                            box-sizing: border-box;
                            border-radius: 2px;
                            padding: 4px;
                            margin: 0 10px 6px 0;
                            background: #f5f5f5;
                            color: rgba(0, 0, 0, 0.65);
                            font-size: 10px;
                            border: 1px solid #d9d9d9;
                        }
                    }

                    .left_b {
                        font-family: PingFangSC-Regular;
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.65);
                        font-weight: 400;
                    }

                    .right_b {
                        width: 60%;
                        font-family: PingFangSC-Regular;
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.65);
                        font-weight: 400;
                    }
                }
            }
        }

        .box_center {
            display: flex;
            justify-content: space-between;

            .card_title {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #333;
                min-height: 30px;

                .d_line {
                    display: inline-block;
                    width: 3px;
                    height: 14px;
                    margin-right: 6px;
                    background: #358aff;
                    flex-shrink: 0;
                }

                .d_detail {
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #333333;
                    letter-spacing: 0;
                    font-weight: 500;
                }

                .tips {
                    margin-left: 20px;
                    color: #fe5161;
                    background: #ffeaec;
                    border-color: #fe5161;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                }
            }
        }

        .box_wrap {
            width: 43%;
            background-color: #f2f2f2;
            padding: 14px;
        }

        .card_title_wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .comparison_box_title {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #333333;
            font-weight: 500;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .info_t {
                display: flex;
                align-items: center;
                // justify-content: space-between;
                // margin-bottom: 10px;

                .left_b {
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.65);
                    font-weight: 400;
                    white-space: nowrap;
                }

                .right_b {
                    margin-left: 10px;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.65);
                    font-weight: 400;
                    white-space: nowrap;
                }
            }
        }

        .box_bottom {
            display: flex;
            margin-bottom: 20px;

            .table-left {
                width: 43%;
                background-color: #f2f2f2;
            }

            .table-center {
                flex: 1;
                position: relative;
                min-height: 100px;
                /* 确保有足够高度显示连线 */
                // padding: 0 10px;
                z-index: 999;
            }

            .table-right {
                width: 43%;
                background-color: #f2f2f2;
            }

            .list_box {
                background-color: #fff;
                width: 100%;
                border: 1px solid #e7e7e7;
            }

            .no_data {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 4px;

                img {
                    width: 60px;
                    height: 60px;
                }
            }

            .list_item {
                font-size: 14px;
                line-height: 32px;
                display: flex;
                cursor: pointer;
                transition: all 0.2s;

                &:last-child {
                    span {
                        border-bottom: 0;
                    }
                }

                .title {
                    background-color: #fafafc;
                    border-right: 1px solid #e7e7e7;
                    width: 30%;
                    text-align: center;
                    border-bottom: 1px solid #e7e7e7;
                }

                .desc {
                    width: 60%;
                    padding-left: 8px;
                    border-bottom: 1px solid #e7e7e7;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .img {
                    width: 10%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-bottom: 1px solid #e7e7e7;

                    img {
                        width: 16px;
                        height: 16px;
                    }
                }

                // 选中状态样式
                &.selected {
                    background-color: rgba(53, 138, 255, 0.1);
                    border-left: 2px solid #358aff;
                }

                // 已映射状态样式
                &.mapped {
                    background-color: rgba(72, 187, 120, 0.05);
                }
            }
        }

        .box_wrap_b {
            width: 43%;
            padding: 14px;
            padding-top: 0;
        }
    }

    // SVG连线样式

    svg {
        overflow: inherit;
    }

    svg line {
        transition: all 0.2s;
    }

    svg line:hover {
        stroke: #fe5161;
        cursor: pointer;
        stroke-width: 2.5;
    }
}
</style>
