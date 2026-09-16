<!-- 
表格头部右侧样式优化按钮：隐藏搜索栏,表格斑马纹,隐藏表格栏
<tableOptimize
  :isSearch.sync="isSearch"
  :isStripe.sync="isStripe"
  :operateShow="false"
>
</tableOptimize>
或者：
<tableOptimize
  :isSearch.sync="isSearch"
  :isStripe.sync="isStripe"
  :operateList="operateList"
  :operateChecked.sync="operateChecked"
>
</tableOptimize>
isSearch: true, isStripe: false, 
operateChecked: ["业务专题名称"], 
operateList: [ { label: "业务专题名称", value: "specialTopicName", }, ], -->
<template>
    <div class="operate">
        <el-popover
            v-if="searchShow"
            placement="top-start"
            trigger="hover"
            popper-class="aop-public-tools-popper"
            :content="isSearch ? '隐藏搜索栏' : '显示搜索栏'"
        >
            <div class="search" slot="reference">
                <img
                    :src="require('@m/assets/images/common_search.png')"
                    alt=""
                    @click="searchClick"
                />
            </div>
        </el-popover>
        <el-popover
            v-if="stripeShow"
            placement="top-end"
            trigger="hover"
            popper-class="aop-public-tools-popper"
            content="表格斑马纹"
        >
            <div class="search" slot="reference">
                <img
                    :src="require('@m/assets/images/common_list.png')"
                    alt=""
                    @click="stripeClick"
                />
            </div>
        </el-popover>
        <el-popover
            v-if="operateShow"
            placement="top-end"
            trigger="hover"
            popper-class="aop-public-tools-popper"
            content="隐藏表格栏"
        >
            <div class="search" v-popover:popover slot="reference">
                <img
                    :src="require('@m/assets/images/common_operate.png')"
                    alt=""
                />
            </div>
        </el-popover>
        <el-popover
            ref="popover"
            placement="bottom-end"
            popper-class="aop-public-popper"
            width="120px"
            trigger="click"
        >
            <div>
                <el-checkbox-group
                    v-model="operateChecked"
                    @change="operateChange"
                >
                    <el-checkbox
                        v-for="(item, index) in operateList"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                        >{{ item.label }}</el-checkbox
                    >
                </el-checkbox-group>
            </div>
        </el-popover>
    </div>
</template>

<script>
export default {
    props: {
        searchShow: {
            type: Boolean,
            default: true,
        },
        stripeShow: {
            type: Boolean,
            default: true,
        },
        operateShow: {
            type: Boolean,
            default: true,
        },
        isSearch: {
            type: Boolean,
            default: false,
        },
        isStripe: {
            type: Boolean,
            default: false,
        },
        operateList: {
            type: Array,
            default: () => [],
        },
        operateChecked: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        searchClick() {
            this.$emit("update:isSearch", !this.isSearch);
        },
        stripeClick() {
            this.$emit("update:isStripe", !this.isStripe);
        },
        operateChange(value) {
            console.log("operateChange", value);
            this.$emit("update:operateChecked", value);
        },
    },
};
</script>

<style lang="scss" scoped>
.operate {
    display: flex;
    .search {
        cursor: pointer;
        width: 36px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid rgba(220, 224, 228, 1);
        img {
            width: 20px;
            height: 20px;
        }
    }
    .search:hover {
        border: 1px solid #2271de !important;
    }
}
</style>
<style lang="scss">
.aop-public-tools-popper.el-popover {
    min-width: 75px;
    padding: 5px;
    font-size: 12px;
}
.aop-public-popper.el-popover {
    min-width: 100px;
    padding: 5px 8px;
    font-size: 12px;
}
.aop-public-popper .el-checkbox,
.aop-public-popper .el-checkbox__label {
    display: flex;
    align-items: center;
    color: #333333;
    font-family: PingFangSC-Regular;
    font-size: 12px;
}
</style>
