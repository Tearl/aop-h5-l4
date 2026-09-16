<template>
    <div class="datadict_thememanage">

        <div class="add_operate">
            <el-button @click="doOperate('add')" size="medium" icon="el-icon-plus" type="primary">新建标准主题</el-button>
        </div>

        <div class="card_box" v-if="list.length">

            <div class="card_box_item" v-for="item in list" :key="item">
                <div class="card_box_item_content">
                    <h1 class="title">{{item.topicName}}</h1>
                    <span class="theme_id">{{item.topicCode}}</span>
                    <span class="theme_desc" v-html="item.topicContent">
                    </span>
                </div>
                <div class="card_box_item_operate">
                    <div class="operate_item" @click="doOperate('edit', item)">
                        <img src="@m/assets/images/edit.png" alt="">
                        <span>编辑</span>
                    </div>
                    <div class="operate_item" @click="doOperate('del', item)">
                        <img src="@m/assets/images/del.png" alt="">
                        <span class="del">删除</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="empty_block" v-else>
            <img src="@m/assets/images/empty.png" alt="">
            <span>暂无标准主题配置</span>
        </div>
        <themeDrawer 
            v-if="themeDrawerVisible"
            v-model="themeDrawerVisible"
            :type="type"
            :formInfo="formInfo"
            @submit="output"
        />
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import themeDrawer from "./components/ThemeDrawer"
export default {
    mixins: [mixin],
    components: {
        themeDrawer
    },
    data() {
        return {
            themeDrawerVisible: false,
            type: 'add',
            formInfo: {},
            list: []
        }
    },
    created() {
        this.listQr()
    },
    methods: {
        async listQr() {
            const { topicInfoList } = await this.rpc.datadict.qryDataDictionaryListTopic()
            this.list = topicInfoList || []
        },
        doOperate(operate, scope) {
            switch(operate)
            {
                case 'add':
                    this.type = operate
                    this.themeDrawerVisible = true
                break
                case 'edit':
                    this.type = operate
                    this.formInfo = scope
                    this.themeDrawerVisible = true
                break
                case 'del':
                    this.$confirm('此操作将永久删除该主题, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        await this.rpc.datadict.delDataDictionaryTopic({
                            topicCode: scope.topicCode
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
        output() {
            this.listQr()
            this.themeDrawerVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
// @import "@m/assets/css/public.scss";
.datadict_thememanage {
    padding: 12px 6px;
}
.add_operate {
    background: #FFFFFF;
    padding: 14px 24px;
    margin: 0 6px;
}
.card_box {
    display: flex;
    flex-wrap: wrap;
    margin-top: 6px;
}
.card_box_item {
    width: 295px;
    height: 182px;
    margin: 6px;
    background: #FFFFFF;
    border: 1px solid rgba(232,232,232,1);
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.09);
    border-radius: 4px;
}
.card_box_item_content {
    padding: 18px;
    height: 134px;

    .title {
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 500;
        margin-bottom: 2px;
    }
    .theme_id {
        display: block;
        font-size: 12px;
        color: #CCCCCC;
        text-align: left;
        line-height: 20px;
        font-weight: 400;
        margin-bottom: 14px;
    }
    .theme_desc {
        font-size: 12px;
        color: #999999;
        text-align: justify;
        line-height: 20px;
        font-weight: 400;
        margin-bottom: 2px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.card_box_item_operate {
    display: flex;
    height: 48px;
    background: #F7F9FA;
    box-shadow: inset 0px 1px 0px 0px rgba(232,232,232,1);
    border-radius: 0px 0px 4px 4px;

    .operate_item {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 50%;
        position: relative;

        img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
        }
        span {
            font-size: 14px;
            color: #358AFF;
            letter-spacing: 0;
            line-height: 16px;
            font-weight: 400;
        }
        .del {
            color: #FE4758;
        }

        &:first-child::after {
            content: "|";
            position: absolute;
            color: #E8E8E8;
            left: 100%;
            top: 25%;
        }
    }
}
.empty_block {
    text-align: center;
    margin-top: 88px;
    img {
        width: 200px;
    }
    span {
        display: block;
        color: #999999;
    }
}
</style>