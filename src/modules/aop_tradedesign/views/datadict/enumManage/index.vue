<template>
    <div class="datadict_root_manage">
        <div class="table_content">
            <!-- 表格查询 -->
            <div class="search">
                <div class="form">
                    <el-form
                        size="small"
                        :model="formData"
                        inline="true"
                        ref="form"
                    >
                        <el-form-item label="枚举名称：">
                            <el-input v-model="formData.enumCodeOrNm" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btn">
                    <el-button type="primary" size="small" @click="search"
                        >查询</el-button
                    >
                    <el-button size="small" plain @click="reset"
                        >重置</el-button
                    >
                </div>
            </div>

            <div class="table_box">
                <div class="table_box_operate">
                    <el-button @click="doOperate('add')" size="medium" icon="el-icon-plus" type="primary">新建枚举字典</el-button>
                </div>
            </div>
            <div class="table">
                <el-table
                    :data="list"
                    :height="scrollHeight">
                    <el-table-column
                        prop="enumName"
                        label="枚举名称">
                    </el-table-column>
                     <el-table-column
                        prop="enumCode"
                        label="枚举编码">
                    </el-table-column>
                     <el-table-column
                        prop="gmtCreate"
                        label="创建时间"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作" width="240px">
                        <template slot-scope="scope">
                            <span class="link" @click="doOperate('look', scope.row)">查看</span>
                            <el-divider direction="vertical"></el-divider>
                            <span class="link" @click="doOperate('edit', scope.row)">编辑</span>
                            <el-divider direction="vertical"></el-divider>
                            <span class="link color-red" @click="doOperate('del', scope.row)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="footer" v-if="list.length">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="turnPageShowNum"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="turnPageTotalNum"
                >
                </el-pagination>
            </div>
        </div>
        <!-- <rootDetailDrawer
            v-if="rootDetailDrawerVisible"
            v-model="rootDetailDrawerVisible"
            :rootId="rootId"
        /> -->
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
// import handleWordRoots from "@m/views/datadict/components/manageControl/handleWordRoots"
// import rootDetailDrawer from "./components/RootDetailDrawer"
import { rootTypeOption,rootTypeThresholdOption } from "@m/utils/commonData";
export default {
    mixins: [mixin],
    components: {
    },
    data() {
        return {
            formData: {
                enumCodeOrNm: ''
            },
            list: [],
            currentPage: 1,
            turnPageShowNum: 10,
            turnPageTotalNum: 0,
            // 词根类别
            rootTypeOption: [],
            rootTypeMaps: {
                '01': '基本词',
                '02': '类词'
            },
            // 类别阈值
            rootTypeThresholdOption: [],
            rootTypeThresholdMaps: {
                '01': '编码类', '02': '数值类', '03': '文本类', '04': '比例类', '05': '代码类', '06': '金额类', '07': '日期类', '08': '标志类'
            },
            rootId: '',
            rootDetailDrawerVisible: false,
            scrollHeight: ''
        }
    },
    mounted() {
        this.rootTypeOption = rootTypeOption
        this.salcTableHeight()
        this.listQr()
    },
    methods: {
        /**
         * 计算表格滚动高度
         */
        salcTableHeight() {
            let clientHeight = window.document.documentElement.clientHeight
            let scrollHeight = clientHeight - 304
            this.scrollHeight = scrollHeight
        },
        async listQr() {
            const { enumCodeOrNm } = this.formData
            const { infoList, totalNum } = await this.rpc.datadict.qryEnumDictionaryList({
                enumCodeOrNm,
                currentPage: this.currentPage,
                turnPageShowNum: this.turnPageShowNum
            })
            this.list = infoList || []
            this.turnPageTotalNum = totalNum
        },

        // 切换每页条数
        handleSizeChange(val) {
            this.turnPageShowNum = val;
            this.currentPage = 1;
            this.listQr();
        },

        // 切换页码
        handleCurrentChange(val) {
            this.currentPage = val;
            this.listQr();
        },

        output() {
            this.listQr()
        },
        search() {
            this.turnPageShowNum = 10;
            this.currentPage = 1;
            this.listQr()
        },
        reset() {
            this.formData = {
                rootName: '',
                rootType: ''
            }
            this.listQr()
        },
        doOperate(operate, scope) {
            switch(operate)
            {
                case 'add':
                    this.$router.push({ path: '/aop_tradedesign/datadict/neumEdit', query: {
                        action: 'add',
                        queryType: '1'
                    } })
                break
                case 'edit':
                    this.$router.push({ path: '/aop_tradedesign/datadict/neumEdit', query: {
                        action: 'edit',
                        queryType: '2',
                        enumCode: scope.enumCode
                    } })
                break
                case 'look':
                    this.$router.push({ path: '/aop_tradedesign/datadict/neumEdit', query: {
                        action: 'look',
                        queryType: '3',
                        enumCode: scope.enumCode
                    } })
                break
                case 'del':
                    this.$confirm('此操作将永久删除该枚举字典, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        await this.rpc.datadict.deleteEnumDictByCode({
                            enumCode: scope.enumCode
                        })
                        this.$notify({
                            title: "成功",
                            message: "删除成功",
                            type: "success",
                        })
                        this.listQr()
                    })
                    
                break
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.datadict_root_manage {
    padding: 12px;
    height: 100%;
    // overflow: hidden;
}
.search {
    padding: 16px 20px 4px 20px;
    background-color: #fff;
    display: flex;
    margin-bottom: 12px;
}
.form {
    flex: 1;
    flex-wrap: wrap;
    ::v-deep .el-input,
    ::v-deep .el-select {
      width: 180px;
    }

    ::v-deep .el-form-item__label {
      color: #000;
      font-family: PingFangSC-Regular;
    }

    ::v-deep .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
}
.table_box {
    background: #FFFFFF;
    margin-top: 12px;
    padding: 14px 24px;
}
.table {
    
    /deep/.el-table .el-table__body tr{
        cursor: pointer;
    }

    /deep/.el-table th{
        background: #FAFAFC;
        font-size: 14px;
        color: #333333;
    }

    /deep/.el-table th .cell{
        padding-left: 24px;
        line-height: 23px;
    }

    /deep/.el-table td{
        padding: 11px 0;
        font-size: 14px;
        color: #666666;
        position: relative;
    }

    /deep/.el-table td .cell{
        padding-left: 24px;
        line-height: 23px;
    }
    .link {
        cursor: pointer;
        font-size: 14px;
        color: #358AFF;
    }
    .color-red {
        color: #e62c0c;
    }
}
.footer {
    text-align: right;
    padding-top: 20px;
    background: #ffffff;
}
</style>