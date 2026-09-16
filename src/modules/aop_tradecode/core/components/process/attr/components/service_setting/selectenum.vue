<template>
    <div>
        <el-dialog
            title="选择枚举"
            top="10vh"
            width="600px"
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible.sync="enumVisible"
            custom-class="dialog-content-table_standard_check_detail_list"
            :destroy-on-close="true"
            @close="close"
        >
            <el-tree
                ref="paramCNameTreeRefEnum"
                :highlight-current="true"
                :data="enumList"
                :props="defaultProps"
                :load="loadEnumNode"
                lazy
                @node-click="handleEnumNodeClick"
            >
            </el-tree>
        </el-dialog>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],
    props: {
        enumVisible: {
            type: Boolean,
            default: false,
        },
        appId: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            enumList: [],
            defaultProps: {
                label: "label",
                children: "children",
                isLeaf: "leaf",
            },
            _tar: {}
        };
    },
    computed: {},
    async mounted() {},
    methods: {
        close() {
            this.$emit("close");
        },
        async handleEnumNodeClick(data, node, element) {
            console.log("handleEnumNodeClick", data, node, element);
            if (node.level == 2) {
                const parent = node.parent.data
                this._tar.paramValue = parent.value + '.' + data.value
                this._tar.paramValueType = 'String'
                this._tar.paramValueNm = `${parent.label}.${data.label}`
                this.enumVisible = false
                this.$emit('select', this._tar)
            }
        },
        async loadEnumNode(node, resolve) {
            if (node.level === 0) {
                return resolve(this.enumList);
            } else {
                console.log("node", node);
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
        async showDialog(_tar) {
            console.log("??? tar", _tar);
            this._tar = _tar
            this.enumVisible = true;
            // 查枚举数据
            const { enumClassInfoList } =
                await this.rpc.d4.queryEnumClassPageList({
                    blgObjId: this.appId,
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
        },
    },
};
</script>
<style lang="scss">
.dialog-content-table_standard_check_detail_list {
    border-radius: 8px;
    .el-dialog__header {
        padding: 12px 24px !important;
        background: #fafafc;
        border-radius: 8px 8px 0px 0px;
        .el-dialog__headerbtn {
            top: 14px !important;
        }
    }

    .el-dialog__body {
        border-top: 1px solid #eee;
        padding: 18px !important;
        height: 500px;
        overflow-y: scroll;
    }
    .el-dialog__footer {
        text-align: center;
    }
}
</style>
