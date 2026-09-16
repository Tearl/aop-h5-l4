<template>
    <div class="business-rule-interface-table">
        <el-table
            size="mini"
            :data="interfaceList"
            style="width: 100%"
            :header-cell-style="{
                background: '#F5F5F8',
                color: '#606266',
            }"
            id="interface"
        >
            <el-table-column
                prop="interfaceNo"
                label="接口编号"
                min-width="80"
                show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                prop="interfaceCode"
                label="接口编码"
                min-width="80"
                show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                label="接口名称"
                min-width="100"
                show-overflow-tooltip="true"
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        style="padding-right: 10px"
                        @click="goInterfaceDetail(scope.row.id)"
                        >{{ scope.row.name }}</el-button
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                width="80"
                v-if="!hideOpt"
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="mini"
                        style="color: red"
                        @click="deleteRow(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],
    props: {
        interfaceProps: {
            type: Object,
            default: () => {},
        },
        interfaceList: {
            type: Array,
            default: () => [],
        },
        hideOpt: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // 接口列表
            // interfaceList: [
            //     {
            //         id: "", // 接口id
            //         name: "", // 接口名称
            //         interfaceNo: "", // 接口编号
            //         interfaceCode: "" // 接口编码
            //         relId: ""
            //     }
            // ],
        };
    },
    async mounted() {},
    methods: {
        deleteRow(row) {
            this.$emit("deleteRow", row);
        },
        goInterfaceDetail(id) {
            window.open(
                `/aop-h5-sub/#/aop_tradecode/editorDesign/interfaceDetail?apiId=${id}&fnctId=${this.$route.query.fnctId}`,
                "_blank"
            );
        },
    },
};
</script>
