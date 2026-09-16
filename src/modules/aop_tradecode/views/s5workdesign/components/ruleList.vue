<template>
    <div class="aop_tradecode_s5_comps_page_tabs">
        <el-container style="padding: 12px 12px; background: #f5f5f5">
            <el-main class="preview_main">
                <div class="showTypeBtn">
                    <el-button-group>
                        <el-button :type="showDataType ==1?'primary':''" size="small" @click="changeTableType('1')">图形视图</el-button>
                        <el-button :type="showDataType ==2?'primary':''" size="small" @click="changeTableType('2')">数据视图</el-button>
                    </el-button-group>
                </div>
                <div class="wrap" v-if="showDataType ==1">
                    <div class="left_divs">
                        <div class="tabs_div">
                            <el-tag
                                v-if="s4DesignSt"
                                :type="s4DesignSt=='1'?'success':'danger'"
                                size="small"
                                class="div_tags_top"
                                @click="showtextInfo('input')"
                                effect="dark">
                                {{ s4DesignSt | numberStFilter }}
                            </el-tag>
                            <h3>{{tabsList[0].v}}（{{treeData.length}}）</h3>
                            <ul class="infinite-list" v-if="treeData.length > 0">
                                <li
                                    v-for="(item,index) in treeData"
                                    :key="item.id"
                                    class="infinite-list-item"
                                >
                                    <div
                                        class="page"
                                        @click="keepItem(item,index)"
                                        @mouseenter="mouseenterItem(item,index,'list0')"
                                        @mouseleave="mouseleaveItem(item,index,'list0')"
                                        :style="{
                                            border: item.isClick
                                                ? '1px solid #358AFF'
                                                : '1px solid #dde0e4',
                                        }"
                                    >
                                        <span class="orange">接口</span
                                        >{{ item.funcName }}（{{ item.bizRuleInfoList.length }}）
                                        <img
                                            :src="eyeIcon"
                                            v-if="item.eye4bShow"
                                            @click.stop="goD4bDetail(item)"
                                        />
                                    </div>
                                    <div
                                        class="yuan"
                                        v-show="item.isExpand && item.bizRuleInfoList.length > 0"
                                    ></div>
                                    <div
                                        v-for="(i,idx) in item.bizRuleInfoList"
                                        :key="i.id"
                                        v-show="item.isExpand"
                                        class="ysWrap"
                                    >
                                        <div class="shuleft"></div>
                                        <div class="sanjiao"></div>
                                        <div
                                            class="ys"
                                            @mouseenter="mouseenterItem(i,idx,'list0rule')"
                                            @mouseleave="mouseleaveItem(i,idx,'list0rule')"
                                            :style="{
                                                border: i.isClick
                                                    ? '1px solid #358AFF'
                                                    : '1px solid #dde0e4',
                                            }"
                                        >
                                            <span class="blue">规则</span
                                            >{{ i.ruleNm }}
                                                <img
                                                :src="eyeIcon"
                                                v-if="i.eye4bShow"
                                                @click.stop="goL5RuelDetail(i)"
                                            />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <ul class="infinite-list" v-else>
                                <li class="infinite-list-item2">
                                    <div class="page2">暂无更多数据</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- 左右滑动去分开 -->
                    <div class="right_divs">
                        <div class="tabs_div">
                            <h3>{{tabsList[1].v}}（{{eventList.length}}）</h3>
                            <ul class="infinite-list" v-if="eventList.length > 0">
                                <li
                                    v-for="(item, index) in eventList"
                                    :key="item.apiId"
                                    class="infinite-list-item2"
                                    @click="getSourceList(item, index)"
                                >
                                    <div
                                        class="page2"
                                        :style="{
                                            border: item.isClick
                                                ? '1px solid #358AFF'
                                                : '1px solid #dde0e4',
                                        }"
                                        @mouseenter="mouseenterItem(item,index,'list1')"
                                        @mouseleave="mouseleaveItem(item,index,'list1')"
                                    >
                                        <span
                                            class="red"
                                            >服务</span
                                        >
                                        {{ item.apiName }}
                                        <img
                                            :src="eyeIcon"
                                            v-if="item.eye4bShow"
                                            @click.stop="goL5Detail(item)"
                                        />
                                    </div>
                                </li>
                            </ul>
                            <ul class="infinite-list" v-else>
                                <li class="infinite-list-item2">
                                    <div class="page2">暂无更多数据</div>
                                </li>
                            </ul>
                        </div>
                        <div class="tabs_div">
                            <h3>{{tabsList[2].v}}（{{serviceL5List.length}}）</h3>
                            <ul
                                class="infinite-list"
                                v-if="serviceL5List.length > 0"
                            >
                                <li
                                    v-for="(item, index) in serviceL5List"
                                    :key="item.businessCode"
                                    class="infinite-list-item2"
                                >
                                    <div
                                        class="page2"
                                        style="border: 1px solid #358aff"
                                        @mouseenter="mouseenterItem(item,index,'list2')"
                                        @mouseleave="mouseleaveItem(item,index,'list2')"
                                    >
                                        <div class="ysWrap">
                                            <div class="ys">
                                                <span
                                                    class="blue"
                                                    >规则</span
                                                >{{ item.businessName
                                                }}<img
                                                    :src="eyeIcon"
                                                    v-if="item.eyeL5Show"
                                                    @click.stop="goL5RuelDetail(item)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <ul class="infinite-list" v-else>
                                <li class="infinite-list-item2">
                                    <div class="page2">暂无更多数据</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="wrap" v-if="showDataType==2">
                    <el-table
                        :data="treeData2"
                        :span-method="objectSpanMethod2"
                        :header-cell-style="{ background: '#F5F5F8', color: '#606266' }"
                        border
                        style="width: 100%; margin-top: 20px">
                        <el-table-column
                            prop="ifId"
                            label="接口编号"
                            show-overflow-tooltip="true"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            prop="ifNm"
                            label="接口名称"
                            show-overflow-tooltip="true"
                            min-width="120">
                            <template slot-scope="scope">
                                <span
                                @click="goD4bDetail(scope.row)"
                                style="color:#358aff;cursor: pointer;"
                                >
                                {{ scope.row.ifNm }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="ruleId"
                            label="规则编号"
                            show-overflow-tooltip="true"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            prop="ruleNm"
                            show-overflow-tooltip="true"
                            min-width="120"
                            label="规则名称">
                            <template slot-scope="scope">
                                <span
                                @click="goL5RuelDetail(scope.row)"
                                style="color:#358aff;cursor: pointer;"
                                >
                                {{ scope.row.ruleNm }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="achFlg"
                            show-overflow-tooltip="true"
                            min-width="120"
                            label="是否实现实现">
                            <template slot-scope="scope">
                                <span
                                    v-if="scope.row.achFlg=='1'"
                                    style="color:#3fd6ae;"
                                >
                                {{ '已实现' }}
                                </span>
                                <span
                                    v-if="scope.row.achFlg=='0'"
                                    style="color:red;"
                                >
                                {{ '未实现' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="svcId"
                            label="服务编号"
                            show-overflow-tooltip="true"
                            min-width="150">
                            <template slot-scope="scope">
                                <span
                                    v-if="scope.row.achFlg=='1'"
                                >
                                {{ scope.row.svcId }}
                                </span>
                                <span
                                    v-if="scope.row.achFlg=='0'"
                                    style="color:red;"
                                >
                                {{ '无' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="svcNm"
                            label="服务名称"
                            show-overflow-tooltip="true"
                            min-width="120">
                            <template slot-scope="scope">
                                <span
                                @click="goL5Detail(scope.row)"
                                style="color:#358aff;cursor: pointer;"
                                v-if="scope.row.achFlg=='1'"
                                >
                                {{ scope.row.svcNm }}
                                </span>
                                <span
                                    v-if="scope.row.achFlg=='0'"
                                    style="color:red;"
                                >
                                {{ '无' }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog title="消息提醒设置" width="80%" :visible.sync="dialogFormVisible">
                    <el-form :model="form">
                        <el-form-item label="消息提醒内容：" :label-width="formLabelWidth">
                        <el-input v-model="form.desc"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="showtextInfo">确 定</el-button>
                    </div>
                </el-dialog>

            </el-main>
        </el-container>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";

export default {
    mixins: [mixin],
    components: {
    },
    props: {
        isRead: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            initFinish: false,
            showDataType:1, // 默认图形视图
            s4DesignSt:'', // 状态 默认未完成
            treeData: [],
            treeData2: [],
            eventList: [],
            serviceL5List: [],
            ysList: [],
            abheight: 1,
            eyeIcon: require("@m/assets/images/icon_eyes.png"),
            transId: "",
            tabsList: [
                { v: "接口列表", k: "A" },
                { v: "服务列表", k: "B" },
                { v: "规则列表", k: "C" },
            ],

            // 存放所有的表头 一定要与tableData一致
            colFields: [
                "ifId",
                "ifNm",
                "ruleId",
                "ruleNm",
                "achFlg",
                "svcId",
                "svcNm",
            ],
            spanArr: [], //存储合并单元格的开始位置
            dialogFormVisible: false,
            form: {
                desc: ''
            },
            formLabelWidth: '120px',
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
        breadcrumbs() {
            return [
                {
                    label: '',
                },
            ];
        },
    },
    methods: {
        // 顶部导航栏点击
        labelClick(e) {
            this.$router.go(-1);
        },
        keepItem(row,num) {
            this.treeData.forEach((item,index) => {
                if (index == num) {
                    item.isClick = true;
                    if(!item.isExpand){
                        this.queryInterfaceRuleListS4(row)
                    }
                    item.isExpand = !item.isExpand;
                } else {
                    item.isClick = false;
                    item.isExpand = false;
                }
            });
        },
        mouseenterItem(row,index,type) {
            if(type == 'list0') {
                this.treeData.forEach((item,num) => {
                    if (num == index) {
                        item.eye4bShow = true;
                    } else {
                        item.eye4bShow = false;
                    }
                    item.bizRuleInfoList.forEach((it,inx)=>{
                        it.eye4bShow = false;
                    })
                });
            } else if (type == 'list0rule'){
                this.treeData.forEach((item,num) => {
                    item.eye4bShow = false;
                    item.bizRuleInfoList.forEach((it,inx)=>{
                        if (inx == index) {
                            it.eye4bShow = true;
                        } else {
                            it.eye4bShow = false;
                        }
                    })
                });
            } else if (type == 'list1') {
                this.eventList.forEach((item,num) => {
                    if (num == index) {
                        item.eye4bShow = true;
                    } else {
                        item.eye4bShow = false;
                    }
                });
            } else if (type == 'list2') {
                this.serviceL5List.forEach((item,num) => {
                    if (num == index) {
                        item.eyeL5Show = true;
                    } else {
                        item.eyeL5Show = false;
                    }
                });
            }

        },
        mouseleaveItem(row,index,type) {
            if(type == 'list0'){
                this.treeData.forEach((item) => {
                    item.eye4bShow = false;
                    item.bizRuleInfoList.forEach((it)=>{
                        it.eye4bShow = false;
                    })
                });
            } else if(type == 'list0rule'){
                this.treeData.forEach((item) => {
                    item.eye4bShow = false;
                    item.bizRuleInfoList.forEach((it)=>{
                        it.eye4bShow = false;
                    })
                });
            } else if(type == 'list1'){
                this.eventList.forEach((item) => {
                    item.eye4bShow = false;
                });
            } else if(type == 'list2'){
                this.serviceL5List.forEach((item) => {
                    item.eyeL5Show = false;
                });
            }
        },
        goD4bDetail(row){
            // 查看接口详情
            window.open(
                `/aop-h5-sub/#/aop_tradecode/editorDesign/interfaceDetail?apiId=${row.ifId}&fnctId=${this.$route.query.fnctId}`,
                "_blank"
            );
        },
        goL5RuelDetail(row) {
            // 查看服务详情
            let apiid = row.ruleId?row.ruleId:row.businessCode
            window.open(
                `/aop-h5-sub/#/aop_tradecode/s5Design/interfaceDetail?apiId=${apiid}&fnctId=${this.$route.query.fnctId}`,
                "_blank"
            );
        },
        goL5Detail(row) {
            // 查看服务详情
            let apiid = row.apiId?row.apiId:row.svcId
            window.open(
                `/aop-h5-sub/#/aop_tradedesign/d4workbench/directL5Detail?svcId=${apiid}`,
                "_blank"
            );
        },
        changeTableType(val){
            this.showDataType = val;
            this.initFinish = false;
            this.queryAssetsInfo()
        },
        // 功能下所有接口规则
        async queryAssetsInfo() {
            this.treeData = [];
            this.treeData2 = [];
            if (this.initFinish) return;
            let funcId = this.$route.query.fnctId;
            const layoutsRes = await this.rpc.s4design.queryInterfaceRuleServiceListS5({
                fnctId: funcId,  // 修正功能编号 非活动编号this.formData.fnctNo
            });
            let layouts = layoutsRes.interfacdeRuleServiceInfoList.map((l) => {
                let arrAction = l.bizRuleInfoList.map((el)=>{
                    return {
                        isClick: false,
                        eye4bShow:false,
                        ...el,
                    }
                })
                return {
                    ...l,
                    type: "page",
                    funcName: l.ifNm, // 接口名称
                    layouts: null,
                    isClick: false,
                    isExpand: false,
                    eye4bShow:false,
                    bizRuleInfoList:arrAction,
                };
            });
            let arr2 = []; // 用于处理数据视图
            if(Array.isArray(layoutsRes.interfacdeRuleServiceInfoList) && layoutsRes.interfacdeRuleServiceInfoList.length > 0){
                layoutsRes.interfacdeRuleServiceInfoList.forEach((ele) => {
                    let obj = {};
                    let obj2 = {};
                    let obj3 = {};
                    obj = {
                        ifId: ele.ifId,
                        ifNm: ele.ifNm,
                        // listleng:ele.bizRuleInfoList.length,
                    };
                    // 规则列表提取
                    if(Array.isArray(ele.bizRuleInfoList) && ele.bizRuleInfoList.length > 0){
                        ele.bizRuleInfoList.forEach((el)=>{
                            obj2 = {
                                svcId: '',
                                svcCd: '',
                                svcNm: '',
                                // 以上是三级列表提取
                                ruleSrcCd: el.ruleSrcCd,
                                achFlg: el.achFlg,
                                ruleId: el.ruleId,
                                ifRuleId: `${ele.ifId}_${el.ruleId}`,
                                ruleNm: el.ruleNm,
                                // 以上是二级列表提取
                                ifId: ele.ifId,
                                ifNm: ele.ifNm,
                                listleng:ele.bizRuleInfoList.length,
                            }
                            // 服务列表提取
                            if(Array.isArray(el.s5ServiceInfoList) && el.s5ServiceInfoList.length > 0){
                                el.s5ServiceInfoList.forEach((item)=>{
                                    obj3 = {
                                        svcId: item.svcId,
                                        svcCd: item.svcCd,
                                        svcNm: item.svcNm,
                                        listleng2: el.s5ServiceInfoList.length,
                                        // 以上是三级列表提取
                                        ruleSrcCd: el.ruleSrcCd,
                                        achFlg: el.achFlg,
                                        ruleId: el.ruleId,
                                        ruleNm: el.ruleNm,
                                        // 以上是二级列表提取
                                        ifId: ele.ifId,
                                        ifNm: ele.ifNm,
                                        listleng: ele.bizRuleInfoList.length,
                                    }
                                    arr2.push(obj3)
                                })
                            } else {
                                arr2.push(obj2)
                            }
                        })
                    } else {
                        arr2.push(obj)
                    }
                });
            }
            // console.log(arr2,'列表')
            this.$nextTick(()=>{
                this.treeData2 = arr2 || [];
                this.getSpanArr();
            })
            // 执行带参比较
            if(this.$route.query && this.$route.query.svcId){
                layouts.forEach((item, index) => {
                    item.isClick = false;
                    item.isExpand = false;
                    if(this.$route.query.svcId == item.ifId){
                        item.isClick = true;
                        item.isExpand = true;
                        // 查询L5列表
                        this.queryInterfaceRuleListS4(layouts[index]);
                    }
                });
            } else {
                layouts.forEach((item, index) => {
                    item.isClick = false;
                    item.isExpand = false;
                    if (index == 0) {
                        item.isClick = true;
                        item.isExpand = true;
                        // 查询L5列表
                        this.queryInterfaceRuleListS4(layouts[0]);
                    }
                });
            }
            this.$nextTick(()=>{
                this.treeData = [...new Set(layouts)] || [];
            })
            this.initFinish = true;
        },
        // 查询L5服务列表
        async queryInterfaceRuleListS4(data){
            const params = {
                apiId: data.ifId,
                turnPageShowNum: 999,
            }
            const res = await this.rpc.d4.getAssociatedSelfServiceList(params);
            let list = res.apiInfoList || [];

            if (list.length == 0) {
                return;
            }
            list.forEach((item, index) => {
                if (index == 0) {
                    item.isClick = true;
                    item.eye4bShow = false;
                } else {
                    item.isClick = false;
                    item.eye4bShow = false;
                }
            });
            this.$nextTick(()=>{
                this.eventList = list || [] // 服务列表
                if (this.eventList.length > 0) {
                    this.getSourceList(this.eventList[0], 0);
                }
            })
            // apiId
            // apiName
        },
        // 查询L5服务 关联的规则
        async getSourceList(row, index) {
            this.transId = row.apiId || "";
            this.serviceL5List = [];
            this.eventList.forEach((item,num) => {
                if (index == num) {
                    item.isClick = true;
                    item.eye4bShow = false;
                } else {
                    item.isClick = false;
                    item.eye4bShow = false;
                }
            });
            let arr = [{
                apiId: row.apiId
            }];
            this.abheight = index + 1;
            const params = {
                ownServiceApis: arr,
            };
            const res = await this.rpc.s4design.queryRulesByServicesS5(
                params
            );
            if (!res.ruleBindServiceApiInfos.length) {
                return;
            }
            res.ruleBindServiceApiInfos[0].ownServiceInfos.forEach((item, index) => {
                if (index == 0) {
                    item.isClick = true;
                    item.eyeL5Show = false;
                } else {
                    item.isClick = false;
                    item.eyeL5Show = false;
                }
            });
            this.$nextTick(()=>{
                this.serviceL5List = res.ruleBindServiceApiInfos[0].ownServiceInfos || [];
            })

            // apiId
            // apiName
        },
        objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
            // console.log('当前行rowIndex',rowIndex , row)
            // console.log('当前列columnIndex',columnIndex,column)
            return this.spanArr[rowIndex * this.colFields.length + columnIndex];
        },
        /**
         * 分析每一列，找出相同的
         * @param data
         */
         getSpanArr() {
            for (let i = 0; i < this.treeData2.length; i++) {
                let row = i;
                if (row === 0) {
                    // i 表示行 j表示列
                    for (let j = 0; j < this.colFields.length; j++) {
                        this.spanArr[i * this.colFields.length + j] = {
                            rowspan: 1,
                            colspan: 1,
                        };
                    }
                } else {
                    for (let j = 0; j < this.colFields.length; j++) {
                        let mergeKey = this.colFields[j];
                        let needMerge = false;
                        if (
                            (mergeKey === "ifId" || mergeKey === "ifNm") &&
                            this.treeData2[row].ifId ===
                                this.treeData2[row - 1].ifId
                        ) {
                            needMerge = true;
                        }
                        if (
                            (mergeKey === "ruleId" ||
                                mergeKey === "ruleNm" ||
                                mergeKey === "achFlg") &&
                            this.treeData2[row].ifId ===
                                this.treeData2[row - 1].ifId &&
                            this.treeData2[row].ruleId ===
                                this.treeData2[row - 1].ruleId
                        ) {
                            needMerge = true;
                        }
                        if (needMerge) {
                            let beforeItem =
                                this.spanArr[
                                    (row - 1) * this.colFields.length + j
                                ];
                            this.spanArr[row * this.colFields.length + j] = {
                                rowspan: 1 + beforeItem.rowspan, // 合并几行
                                colspan: 1, // 合并几列,这里只跨行合并,不跨列合并,所以用的1
                            };
                            beforeItem.rowspan = 0;
                            beforeItem.colspan = 0;
                        } else {
                            this.spanArr[row * this.colFields.length + j] = {
                                rowspan: 1,
                                colspan: 1,
                            };
                        }
                    }
                }
            }
            // 对数据进行倒序
            let stack = [];
            for (let i = 0; i < this.colFields.length; i++) {
                for (let j = 0; j < this.treeData2.length; j++) {
                // console.log("i=" + i + " j=" + j);
                // i 表示列 j表示行
                if (j === 0) {
                    if (this.spanArr[j * this.colFields.length + i].rowspan === 0) {
                    stack.push(this.spanArr[j * this.colFields.length + i]);
                    }
                } else {
                    if (this.spanArr[j * this.colFields.length + i].rowspan === 0) {
                    stack.push(this.spanArr[j * this.colFields.length + i]);
                    } else {
                    stack.push(this.spanArr[j * this.colFields.length + i]);
                    while (stack.length > 0) {
                        let pop = stack.pop();
                        let len = stack.length;
                        this.spanArr[(j - len) * this.colFields.length + i] = pop;
                    }
                    }
                }
                }
            }
        },
        async querySystemDesignStatus(){ // 系统设计状态查询
            const params = {
                fnctId: this.$route.query.fnctId || '',
            };
            let res = await this.rpc.s4design.querySystemDesignStatus(params);
            if(res.systemDesignStusRoute){
                this.s4DesignSt = res.systemDesignStusRoute.slice(1,2);
            } else {
                this.s4DesignSt = ''
            }
        },
        /**
         * 输入提醒消息
         */
        async showtextInfo(type){
            if(this.isRead){
                return
            }
            if(type=='input'){
                this.form.desc ='';
                this.dialogFormVisible = true;
                return
            }
            if(this.form.desc==''){
                this.$message({
                    type: "warning",
                    message: "请输入设置消息内容",
                });
                return;
            }
            const params = {
                msgTpCd: '01', // 消息类型代码:01-S4设计提醒
                msgCont: this.form.desc || '',
                fnctId: this.$route.query.fnctId || '',
                recvrId: '',
                recvrNm: '',
            };
            let res = await this.rpc.s4design.addMessageRecord(params);
            // console.log(res,'消息提醒发送成功')
            this.dialogFormVisible = false;
            this.$notify({
                title: "成功",
                message: "成功",
                duration: 2000,
                type: "success",
            });
        },
    },
    created() {},
    mounted(){
        this.querySystemDesignStatus();
        this.queryAssetsInfo();
        this.queryLastMessage();
    },
    beforeDestroy() {
        this.treeData= [];
        this.treeData2= [];
        this.eventList= [];
        this.serviceL5List= [];
        this.ysList= [];
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy();
        next();
    },
    watch: {},
    filters: {
        serviceType(val) {
            if (!val) {
                return "--";
            }
            let text = "";
            if (val.indexOf("自有") > -1) {
                text = "自有";
            } else if (val.indexOf("直连") > -1) {
                text = "直连";
            }
            return text;
        },
        numberStFilter(val){
            if (!val) {
                return "后端接口设计未完成";
            }
            let text = "";
            if (val == 0) {
                text = "后端接口设计未完成";
            } else if (val == 1) {
                text = "后端接口设计已完成";
            }
            return text;
        }
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_s5_comps_page_tabs {
    background-color: $base_white;
    width: 100%;
    h3 {
        font-size: 16px;
        font-family: PingFangSC-Semibold;
        color: #111111;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 600;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
    }
    .preview_main {
        padding: 12px 24px 24px 24px;
        background: #ffffff;
        // max-height: calc(100vh - 120px);
        min-height: calc(100vh - 120px);
        position: relative;
        overflow: hidden;
        .showTypeBtn{
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
        }
        .tabs_div::-webkit-scrollbar {
            display: none;
        }
        .wrap {
            width: 100%;
            background: #ffffff;
            display: flex;
            .li_active {
                background: #ffffff;
                border: 1px solid #358aff;
                cursor: pointer;
            }
        }
        .left_divs::-webkit-scrollbar,.right_divs::-webkit-scrollbar {
            display: none;
        }
        .left_divs{
            width: 32.5%;
            background: #f7f7f9;
            min-height: calc(100vh - 156px);
            position: relative;
            z-index:9;
            .tabs_div {
                width: 100%;
                background: #f7f7f9;
                padding: 24px 24px;
                border-radius: 4px 4px;
                min-height: calc(100vh - 156px);
                max-height: calc(100vh - 156px);
                overflow-y: auto;
                position: relative;
                z-index:9;
                h3 {
                    text-align: center;
                    display: block;
                }
                .div_tags_top{
                    position: absolute;
                    top:0;
                    right:12px;
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                    cursor: pointer;
                }
                .infinite-list {
                    width: 100%;
                    span {
                        padding: 0px 4px;
                        border-radius: 2px 2px;
                        font-size: 12px;
                        line-height: 15px;
                        min-width:34px;
                        height: 16px;
                        display: inline-block;
                        margin-right: 4px;
                        font-family: PingFangSC-Regular;
                    }
                    .green {
                        color: #36d542;
                        background: #e5ffe7;
                        border: 1px solid #36d542;
                    }
                    .blue {
                        color: #358aff;
                        background: #f2f8ff;
                        border: 1px solid #358aff;
                    }
                    .orange {
                        color: #ff9104;
                        background: #fbe2c2;
                        border: 1px solid #ff9104;
                    }
                    .red {
                        color: #fe4758;
                        background: #ffd2d7;
                        border: 1px solid #fe4758;
                    }
                }
                .infinite-list-item,.infinite-list-item2 {
                    margin-bottom: 12px;
                    cursor: pointer;
                    .page {
                        height: 48px;
                        background: #ffffff;
                        border: 1px solid #dde0e4;
                        border-radius: 4px;
                        cursor: pointer;
                        display: flex;
                        justify-content: left;
                        align-items: center;
                        padding-left: 30px;
                        margin-bottom: 2px;
                        width: 100%;
                        margin-left: auto;
                        margin-right: auto;
                        position: relative;
                        img {
                                width: 20px;
                                height: 20px;
                                position: absolute;
                                right: 16px;
                            }
                    }
                    .page2{
                        height: 48px;
                        background: #ffffff;
                        border: 1px solid #dde0e4;
                        border-radius: 4px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .ysWrap {
                        width: 100%;
                        margin-left: auto;
                        margin-right: auto;
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                        .shuleft {
                            width: 10%;
                            height: 64px;
                            border-left: 1px dashed #358aff;
                            border-bottom: 1px dashed #358aff;
                            border-right: 0;
                            border-top: 0;
                            border-bottom-left-radius: 8px;
                            margin-left: 5.6%;
                            margin-top: -62px;
                        }
                        .sanjiao {
                            width: 0;
                            height: 0;
                            margin-bottom: -2px;
                            margin-right: -4px;
                            border-top: 5px solid transparent;
                            border-right: 10px solid transparent;
                            border-left: 10px solid #358aff;
                            border-bottom: 5px solid transparent;
                        }
                        .ys {
                            width: 87%;
                            height: 48px;
                            background: #ffffff;
                            border: 1px solid #dde0e4;
                            border-radius: 4px;
                            cursor: pointer;
                            display: flex;
                            justify-content: left;
                            align-items: center;
                            padding-left: 30px;
                            margin-left: -4px;
                            position: relative;
                            img {
                                width: 20px;
                                height: 20px;
                                position: absolute;
                                right: 16px;
                            }
                        }
                    }
                    .yuan {
                        width: 8px;
                        height: 8px;
                        border: 1px solid #358aff;
                        background: #ffffff;
                        border-radius: 50%;
                        margin-left: 4.7%;
                    }
                }
            }
            .tabs_div:nth-child(1) {
                .infinite-list {
                    .infinite-list-item > :nth-child(3) {
                        .shuleft {
                            width: 10%;
                            height: 24px;
                            border-left: 1px dashed #358aff;
                            border-bottom: 1px dashed #358aff;
                            border-right: 0;
                            border-top: 0;
                            border-bottom-left-radius: 8px;
                            margin-left: 5.6%;
                            margin-top: -22px;
                        }
                        .sanjiao {
                            width: 0;
                            height: 0;
                            margin-bottom: 0px;
                            margin-right: -4px;
                            border-top: 5px solid transparent;
                            border-right: 10px solid transparent;
                            border-left: 10px solid #358aff;
                            border-bottom: 5px solid transparent;
                        }
                    }
                }
            }
        }
        .right_divs{
            width: 67.5%;
            display: flex;
            margin-left: 15px;
            background: #ffffff;
            min-height: calc(100vh - 156px);
            max-height: calc(100vh - 156px);
            overflow-y: auto;
            position: relative;
            z-index:9;
            .tabs_div {
                width: 48.5%;
                background: #f7f7f9;
                padding: 24px 24px;
                border-radius: 4px 4px;
                min-height: calc(100vh - 156px);
                position: relative;
                h3 {
                    text-align: center;
                    display: block;
                }
                .infinite-list {
                    width: 100%;
                    span {
                        padding: 0px 4px;
                        border-radius: 2px 2px;
                        font-size: 12px;
                        line-height: 15px;
                        min-width: 34px;
                        height: 16px;
                        display: inline-block;
                        margin-right: 4px;
                        font-family: PingFangSC-Regular;
                    }
                    .orange {
                        color: #ff9104;
                        background: #fff4e5;
                        border: 1px solid #ff9104;
                    }
                    .blue {
                        color: #358aff;
                        background: #f2f8ff;
                        border: 1px solid #358aff;
                    }
                    .red {
                        color: #fe4758;
                        background: #ffd2d7;
                        border: 1px solid #fe4758;
                    }
                }
                .infinite-list-item2 {
                    margin-bottom: 12px;
                    width: 100%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    z-index: 999;
                    position: relative;
                    .page2 {
                        width: 100%;
                        height: 48px;
                        background: #ffffff;
                        border: 1px solid #dde0e4;
                        border-radius: 4px;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img {
                            width: 20px;
                            height: 20px;
                            position: absolute;
                            right: 16px;
                        }
                    }
                    .ysWrap {
                        width: 100%;
                        height: 48px;
                        display: flex;
                        align-items: center;
                        .shuleft3 {
                            width: 30px;
                            height: 64px;
                            border-top: 0;
                            border-bottom: 1px dashed #ff9102;
                            border-right: 0;
                            border-left: 1px dashed #ff9102;
                            border-bottom-left-radius: 12px;
                            margin-left: -31px;
                            margin-top: 59px;
                        }
                        .shuleft5 {
                            width: 30px;
                            height: 63px;
                            border-top: 0;
                            border-top: 1px dashed #ff9102;
                            border-right: 0;
                            border-left: 0;
                            border-top-left-radius: 12px;
                            margin-left: -32px;
                            margin-top: 63px;
                        }
                        .sanjiao2 {
                            width: 0;
                            height: 0;
                            border-top: 5px solid transparent;
                            border-right: 10px solid transparent;
                            border-left: 10px solid #ff9102;
                            border-bottom: 5px solid transparent;
                            margin-bottom: -2px;
                            margin-left: -8px;
                        }
                        .ys {
                            width: 100%;
                            height: 48px;
                            cursor: pointer;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            img {
                                width: 20px;
                                height: 20px;
                                position: absolute;
                                right: 16px;
                            }
                        }
                    }
                    .rightTip {
                        // position: absolute;
                        float: right;
                        right: -9.6vh;
                        display: flex;
                        align-items: center;
                        z-index: 99;
                        .yuan2 {
                            width: 8px;
                            height: 8px;
                            border: 1px solid #ff9104;
                            background: #ffffff;
                            border-radius: 50%;
                        }
                        .line2 {
                            width: 7vh;
                            height: 1px;
                            border-bottom: 1px dashed #ff9102;
                            margin-right: calc(-7vh - 8px);
                        }
                        .line3 {
                            width: 3vh;
                            height: 1px;
                            border-bottom: 0;
                            margin-right: calc(-7vh - 8px);
                        }
                        .shuleft2 {
                            position: absolute;
                            width: 30px;
                            height: 61px;
                            border-top: 0;
                            border-right: 1px dashed #ff9102;
                            border-left: 0;
                            border-bottom: 0;
                            border-top-right-radius: 12px;
                            margin-left: 3px;
                            margin-top: 63px;
                        }
                        .shuleft4 {
                            position: absolute;
                            width: 22px;
                            height: 61px;
                            border-top: 0;
                            border-right: 1px dashed #ff9102;
                            border-left: 0;
                            border-bottom: 1px dashed #ff9102;
                            border-bottom-right-radius: 12px;
                            margin-left: 10px;
                            margin-top: 63px;
                        }
                    }
                }
            }
            .tabs_div:nth-child(1) {
                margin-right: 15px;
                overflow: visible;
            }
            .tabs_div:nth-child(2) {
                overflow: visible;
                .infinite-list {
                    .infinite-list-item2:nth-of-type(1) {
                        .shuleft3 {
                            width: 30px;
                            height: 61px;
                            border-top: 0;
                            border-bottom: 1px dashed #ff9102;
                            border-right: 0;
                            border-left: 0;
                            border-bottom-left-radius: 12px;
                            margin-left: -32px;
                            margin-top: 63px;
                        }
                        .shuleft5 {
                            width: 30px;
                            height: 61px;
                            border-top: 0;
                            border-top: 1px dashed #ff9102;
                            border-right: 0;
                            border-left: 0;
                            border-top-left-radius: 12px;
                            margin-left: -32px;
                            margin-top: 63px;
                        }
                    }
                }
            }
        }
    }
    ::v-deep .el-dialog {
        border-radius: 8px 8px;
    }
    ::v-deep .el-dialog__footer {
        display: flex;
        justify-content: center;
    }
}
</style>
