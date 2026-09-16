<template>
    <div class="business-rule-service-table">
        <el-table
            size="mini"
            :data="serviceList"
            style="width: 100%"
            :header-cell-style="{
                background: '#F5F5F8',
                color: '#606266',
            }"
            id="service"
        >
            <el-table-column
                prop="apiSeq"
                label="服务编号"
                min-width="100"
                show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                prop="apiCode"
                label="服务编码"
                min-width="100"
                show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                label="服务名称"
                min-width="100"
                show-overflow-tooltip="true"
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="mini"
                        style="padding-right: 10px"
                        @click="goServiceDetail(scope.row.id)"
                        >{{ scope.row.apiName }}</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        serviceList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            // 服务列表
            // serviceList: [
            // {
            //     id: "",
            //     apiSeq: "FM1-DG-4B-10634801",
            //     apiCode: "queryBaseInfo",
            //     apiName: "查询基本信息查询",
            // },
            // ],
        };
    },
    methods: {
        goServiceDetail(id) {
            window.open(
                `/aop-h5-sub/#/aop_tradedesign/d4workbench/directL5Detail?svcId=${id}`,
                "_blank"
            );
        },
    },
};
</script>
