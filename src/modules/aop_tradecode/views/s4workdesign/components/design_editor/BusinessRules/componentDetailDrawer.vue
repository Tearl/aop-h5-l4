<template>
    <div class="business-rule-add-interface-drawer">
        <el-drawer
            :destroy-on-close="true"
            :visible.sync="showComponentDetailDrawer"
            :with-header="false"
            :size="600"
            :before-close="closeDrawer"
        >
            <div class="drawer-header">
                <i
                    class="el-icon-arrow-left"
                    style="font-size: 20px; cursor: pointer; margin-right: 6px"
                    @click="closeDrawer"
                ></i>
                <span>组件详情</span>
            </div>
            <!-- 抽屉内容 -->
            <div class="drawer-content">
                <!-- 基本信息 -->
                <div class="drawer-base-info">
                    <p class="title" style="font-size: 14px">基本信息</p>

                    <p>
                        <span class="label">组件ID:</span>
                        <span class="value">{{ componentInfo.id }}</span>
                    </p>
                    <p>
                        <span class="label">组件名称:</span>
                        <span class="value" style="font-weight: bold">{{
                            componentInfo.name
                        }}</span>
                    </p>
                    <p>
                        <span class="label">组件描述:</span>
                        <span class="value desc">{{
                            componentInfo.desc || "--"
                        }}</span>
                    </p>
                </div>
                <!-- 业务规则 -->
                <div class="drawer-table">
                    <div class="title table-title">
                        <span
                            >业务规则<template v-if="!ruleList.length">
                                （空）
                            </template></span
                        >
                    </div>
                    <div class="table-content" v-if="ruleList.length">
                        <div
                            class="content-item"
                            :class="{
                                'last-item': index == ruleList.length - 1,
                            }"
                            v-for="(item, index) in ruleList"
                            :key="index"
                        >
                            <span class="index">{{ index + 1 }}</span>
                            <div class="rule-desc">
                                <aopCommonDocPreview
                                    :data="item.text"
                                ></aopCommonDocPreview>
                            </div>
                            <el-button
                                v-if="mode == 'edit'"
                                type="text"
                                size="mini"
                                @click="openAddInterfaceDrawer(item)"
                                :disabled="item.id == ''"
                                >添加接口</el-button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
export default {
    props: {
        showComponentDetailDrawer: {
            type: Boolean,
            default: false,
        },
        componentInfo: {
            type: Object,
            default: () => {},
        },
        ruleList: {
            type: Array,
            default: () => [],
        },
        mode: "edit", // edit preview
    },
    data() {
        return {};
    },
    methods: {
        closeDrawer() {
            this.$emit("closeDrawer");
        },
        openAddInterfaceDrawer(item) {
            this.$emit("openInterFaceDrawerByComponent", item);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.drawer-header {
    height: 40px;
    border-bottom: 1px solid #dcdfe6;
    @include flex(row, flex-start, center);
    padding: 0 6px;
    line-height: 20px;
}

.drawer-content {
    width: 100%;
    padding: 14px;
}

.title {
    font-weight: bold;
    @include flex(row, space-between, center);
}
.table-title {
    margin-bottom: 16px;
}
.drawer-base-info {
    padding-bottom: 20px;
    border-bottom: 1px solid #dcdfe6;
    @include flex(column, flex-start, flex-start);
    p {
        font-size: 12px;
        @include flex(row, flex-start, flex-start);
        margin-top: 10px;
        .label {
            width: 70px;
        }
        .value {
            max-width: 440px;
        }
    }
}
.drawer-table {
    margin-top: 16px;
    .table-content {
        width: 100%;
        min-height: 100px;
        background-color: #f6f6f6;
        border-radius: 6px;
        padding: 20px 10px;
        .content-item {
            @include flex(row, flex-start, flex-start);
            margin-bottom: 10px;
            .index {
                width: 20px;
                text-align: right;
                font-size: 12px;
                padding-top: 4px;
                font-weight: bold;
            }
            .rule-desc {
                margin: 0 12px;
                padding: 8px;
                background-color: #fff;
                width: 100%;
                border-radius: 2px;
            }
        }
        .last-item {
            margin-bottom: 0;
        }
    }
}
</style>
