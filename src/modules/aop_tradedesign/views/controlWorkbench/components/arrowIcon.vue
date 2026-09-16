<template>
    <div class="arrow-icon-container" id="arrowIconContainer">
        <div class="custom-divider" v-if="!showFalseIcon">
            <i class="el-icon-arrow-left"></i>
            <el-divider>
                <!-- <span>
                    <img src="../assets/images/success.png" alt="成功图标">
                </span> -->
            </el-divider>
            <i class="el-icon-arrow-right"></i>
        </div>
        <!-- <div class="custom-divider_false" v-if="showFalseIcon">
            <img src="../assets/images/fasle.png" alt="">
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'ArrowIconComponent',
    props: {
        showFalseIcon: {
            type: Boolean,
            default: false
        }
    },
    mounted(){
    }
}
</script>

<style lang="scss" scoped>
.arrow-icon-container {
    // padding: 9px 0;
    height: 33px;
    display: flex;
    align-items: center;

    .custom-divider {
        display: flex;
        align-items: center;
        width: 100%;

        .el-icon-arrow-left,
        .el-icon-arrow-right {
            color: #666;
            font-size: 14px;
        }

        // 让分隔线占据剩余空间
        .el-divider {
            flex: 1;
            background-color: #666;
        }

        .el-icon-arrow-left {
            margin-right: -4px;
        }

        .el-icon-arrow-right {
            margin-left: -4px;
        }

    }

    .custom-divider_false {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ::v-deep .el-divider__text {
        padding: 0 4px;
    }

    ::v-deep .el-divider--horizontal {
        margin: 0;
        height: .5px;
    }

    span {
        display: flex;
        align-items: center;
    }

    img {
        width: 16px;
        height: 16px;
    }
}
</style>
