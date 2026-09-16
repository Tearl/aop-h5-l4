<!-- 数据格式提示框 -->
<template>
    <el-popover placement="right" trigger="click" width="500">
        <i class="el-icon-warning warning-tip-btn" slot="reference"></i>
        <div class="warning-tip-text">
            <p>
                <span
                    >数据格式是数据字典项在精度、长度、形态上的定义，包括所允许的最大和/或最小字符长度，数据的标识格式等，表示格式的各种符号含义如下：</span
                >
            </p>
            <p><span>a&nbsp; &nbsp; 字母字符。</span></p>
            <p><span>n&nbsp; &nbsp; 数字字符。</span></p>
            <p><span>an&nbsp; &nbsp; 字母数字字符。</span></p>
            <p><span>anc&nbsp; &nbsp; &nbsp; 字母数字汉字字符。</span></p>
            <p><span>M、N&nbsp;&nbsp; 表示自然数。</span></p>
            <p><span>M!a&nbsp; &nbsp; M位字母字符，定长。</span></p>
            <p><span>M!n&nbsp; &nbsp; M位数字字符，定长。</span></p>
            <p>
                <span>M!an&nbsp; &nbsp;&nbsp; M位字母数字字符，定长。</span>
            </p>
            <p>
                <span
                    >M!anc&nbsp; &nbsp;&nbsp;
                    M位字母数字汉字字符，定长。（汉字字符占2个字节。例如anc..100即varchar（200））</span
                >
            </p>
            <p><span>a..M&nbsp; &nbsp; 最多为M位字母字符。</span></p>
            <p><span>n..M&nbsp; &nbsp; 最多为M位数字字符。</span></p>
            <p><span>an..M&nbsp;&nbsp; 最多为M位字母数字字符。</span></p>
            <p>
                <span
                    >anc..M&nbsp;&nbsp;
                    最多为M位字母数字汉字字符。（汉字字符占2个字节。例如anc..100即varchar（200））</span
                >
            </p>
            <p><span>aM..&nbsp; &nbsp; 最少为M位字母字符。</span></p>
            <p><span>nM..&nbsp; &nbsp; 最少为M位数字字符。</span></p>
            <p><span>anM..&nbsp;&nbsp; 最少为M位字母数字字符。</span></p>
            <p>
                <span>ancM..&nbsp; &nbsp; 最少为M位字母数字汉字字符。</span>
            </p>
            <p>
                <span>aM..N&nbsp;&nbsp; 最少为M位最多为N位字母字符。</span>
            </p>
            <p>
                <span>nM..N&nbsp;&nbsp; 最少为M位最多为N位数字字符。</span>
            </p>
            <p>
                <span>anM..N&nbsp;&nbsp; 最少为M位最多为N位字母数字字符。</span>
            </p>
            <p>
                <span
                    >ancM..N&nbsp;&nbsp;
                    最少为M位最多为N位字母数字汉字字符。（汉字字符占2个字节。例如anc..100即varchar（200））</span
                >
            </p>
            <p>
                <span
                    >M(N)&nbsp;&nbsp;
                    M位数字字符，其中包括小数点和N个小数位（M&gt;N+1）。</span
                >
            </p>
            <p>
                <span
                    >YYYYMMDD&nbsp;
                    日期格式，表示年月日。Y表示时间元素“年”所使用的数字，M表示时间元素“月”所使用的数字，D表示时间元素“日”所使用的数字。</span
                >
            </p>
            <p>
                <span
                    >HHMMSS&nbsp;&nbsp;
                    时间格式（24小时制），表示时分秒。H表示时间元素“小时”所使用的数字，M表示时间元素“分钟”所使用的数字，S表示时间元素“秒”所使用的数字。</span
                >
            </p>
            <p>
                <span
                    >YYYYMMDDTHHMMSS&nbsp;
                    日期时间格式，表示某年某月某日某时某分某秒。T为时间标识符，在日期和日的时间组合表达式中，用以标识该日的时间表示法的开始。</span
                >
            </p>
            <p>
                <span
                    >对于比例类的数据，默认是以“%”作为度量单位，定义长度和精度时是针对“%”前面部分数值进行规范。例如100.00%，因此数据格式为6(2)。通常的百分比数据数据格式采用6(2)，如果是利率类数据格式采用9(5)，表示百分号前的整数有3位，小数有5位，例如2.44593%。</span
                >
            </p>
        </div>
    </el-popover>
</template>
<script>
export default {
    components: {},
    data() {
        return {};
    },
    created() {},
    methods: {},
};
</script>

<style lang="scss" scoped>
.warning-tip-btn {
    cursor: pointer;
    font-size: 14px;
    color: #ff9841;
    margin-left: 4px;
}
.warning-tip-text {
    // width: 500px;
    height: 300px;
    overflow-y: auto;
    p {
        font-size: 14px;
        color: #666;
        line-height: 22px;
        padding: 5px;
    }
}
</style>
