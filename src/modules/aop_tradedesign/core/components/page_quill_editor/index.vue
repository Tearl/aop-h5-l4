<template>
    <div class="vue-quill-editor">
        <el-upload
            class="upload-col"
            v-show="false"
            :key="randomId(3)"
            :id="randomId(3)"
            ref="quill-upload1"
            :action="serverUrl"
            name="uploadFile"
            multiple
            list-type="picture"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-error="uploadError"
            :on-success="handleExceed1"
        >
            <el-button size="small" type="primary"></el-button>
            <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
            </div>
        </el-upload>
        <el-row v-loading="uillUpdateImg">
            <quill-editor
                ref="myQuillEditor1"
                @change="onEditorChange($event)"
                v-model="value"
                :options="editorOption"
            />
        </el-row>
    </div>
</template>
<script>
import { quillEditor, Quill } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// import mixin from "@m/core/mixin";

// import resizeImage from 'quill-image-resize-module' // 图片缩放组件引用
// import { ImageDrop } from 'quill-image-drop-module'; // 图片拖动组件引用
// Quill.register('modules/imageDrop', ImageDrop); // 注册
// Quill.register('modules/resizeImage ', resizeImage ) // 注册

// 设置字体大小
const fontSizeStyle = Quill.import("attributors/style/size"); // 引入这个后会把样式写在style上
fontSizeStyle.whitelist = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
];
Quill.register(fontSizeStyle, true);
// 设置字体样式
const Font = Quill.import("attributors/style/font"); // 引入这个后会把样式写在style上
const fonts = ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong"];
Font.whitelist = fonts; // 将字体加入到白名单
Quill.register(Font, true);
// 工具栏
const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    [{ align: [] }], // 对齐方式-----[{ align: [] }]
    [{ size: fontSizeStyle.whitelist }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    [{ font: fonts }], // 字体种类-----[{ font: [] }]
    [{ header: [1, 2, 3, 4, 5, false] }], // 标题
    // [{ direction: "ltl" }], // 文本方向-----[{'direction': 'rtl'}]
    // [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
    [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
    // ["link", "image"], // 链接、图片、视频-----['link', 'image', 'video']
    ["clean"], // 清除文本格式-----['clean']
];

export default {
    components: {
        quillEditor,
    },
    data() {
        return {
            uillUpdateImg: false, //根据图片上传状态来确定是否显示loading动画
            editorOption: {
                placeholder: this.placeholder || '请输入',
                modules: {
                    // imageDrop: true,      //图片拖拽
                    // imageResize: {          //放大缩小
                    //   displayStyles: {
                    //     backgroundColor: "black",
                    //     border: "none",
                    //     color: "white"
                    //   },
                    //   modules: ["Resize", "DisplaySize", "Toolbar"]
                    // },
                    toolbar: {
                        container: toolbarOptions,
                        handlers: {
                            image: (value) => {
                                if (value) {
                                    document
                                        .querySelectorAll(".upload-col input")
                                        [this.quillIndex].click();
                                    // 给个点击触发Element-ui，input框选择图片文件
                                    // document.querySelector("#quill-upload1 input").click();
                                } else {
                                    this.quill.format("image", false);
                                }
                            },
                        },
                    },
                },
            },
            serverUrl: "", //上传的图片服务器地址
            // 特色优势
            value: "", //富文本特色值
            //特色上传的图片
            specialfileList: [],
        };
    },
    props: {
        /* 编辑器的索引 */
        quillIndex: {
            type: Number,
            default: 0,
        },
        data: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "",
        }
    },
    watch: {
        data: {
            handler(val) {
                this.value = val;
            },
            immediate: true,
        },
    },
    created() {
    },
    mounted() {},

    methods: {
        randomId(len) {
            var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
            var tempLen = chars.length,
                tempStr = "";
            for (var i = 0; i < len; ++i) {
                tempStr += chars.charAt(Math.floor(Math.random() * tempLen));
            }
            return tempStr;
        },
        // 富文本编辑器上传图片
        onEditorChange({ quill, html, text }) {
            //富文本编辑器内容发生改变的时候
            this.value = html;
            this.$emit("update:data", html);
            this.$emit("textChange", html); //将富文本编辑器输入的文本发送给父组件，父组件涉及提交添加或者更改
        },
        beforeUpload() {
            //上传图片之前开启loading
            this.uillUpdateImg = true;
        },
        uploadError() {
            //图片上传失败,关闭loading
            this.uillUpdateImg = false;
            this.$message.error("图片插入失败");
        },
        handleExceed1(response, file, fileList) {
            //图片添加成功
            let quill = this.$refs.myQuillEditor1.quill;
            // console.log(quill.getSelection(), "quill1===>",quill);
            if (response.header.errorCode == "0") {
                let length = quill.getSelection().index;
                // 插入图片  response.data.url为服务器返回的图片地址
                quill.insertEmbed(
                    length,
                    "image",
                    this.$replaceUrl(response.body.path)
                );
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                this.$message.error("图片插入失败");
            }
            this.specialfileList = fileList;
            this.uillUpdateImg = false;
        },
        getvalue() {
            return this.value;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "./quill_editor.css";
.quill-editor {
    /deep/ .ql-toolbar {
        line-height: 24px;
    }
    /deep/ .ql-container {
        min-height: 290px;
    }
}
.ql-container {
    min-height: 300px;
}
em {
    font-style: italic; /* 解决斜体失效问题 */
}
.vue-quill-editor {
    .quill-editor {
        line-height: normal;
        .ql-container.ql-snow {
            line-height: normal !important;
            height: 250px !important;
            font-size: 14px;
        }
        .ql-snow {
            .ql-tooltip[data-mode="link"]::before {
                content: "请输入链接地址:";
            }
            .ql-tooltip.ql-editing a.ql-action::after {
                border-right: 0px;
                content: "保存";
                padding-right: 0px;
            }
            .ql-tooltip[data-mode="video"]::before {
                content: "请输入视频地址:";
            }
            .ql-picker.ql-size {
                .ql-picker-label[data-value="12px"]::before,
                .ql-picker-item[data-value="12px"]::before {
                    content: "12px";
                }
                .ql-picker-label[data-value="14px"]::before,
                .ql-picker-item[data-value="14px"]::before {
                    content: "14px";
                }
                .ql-picker-label[data-value="16px"]::before,
                .ql-picker-item[data-value="16px"]::before {
                    content: "16px";
                }
                .ql-picker-label[data-value="18px"]::before,
                .ql-picker-item[data-value="18px"]::before {
                    content: "18px";
                }
                .ql-picker-label[data-value="20px"]::before,
                .ql-picker-item[data-value="20px"]::before {
                    content: "20px";
                }
                .ql-picker-label[data-value="24px"]::before,
                .ql-picker-item[data-value="24px"]::before {
                    content: "24px";
                }
                .ql-picker-label[data-value="28px"]::before,
                .ql-picker-item[data-value="28px"]::before {
                    content: "28px";
                }
                .ql-picker-label[data-value="32px"]::before,
                .ql-picker-item[data-value="32px"]::before {
                    content: "32px";
                }
                .ql-picker-label[data-value="36px"]::before,
                .ql-picker-item[data-value="36px"]::before {
                    content: "36px";
                }
            }
            .ql-picker.ql-header {
                .ql-picker-label::before,
                .ql-picker-item::before {
                    content: "文本";
                }
                .ql-picker-label[data-value="1"]::before,
                .ql-picker-item[data-value="1"]::before {
                    content: "标题1";
                }
                .ql-picker-label[data-value="2"]::before,
                .ql-picker-item[data-value="2"]::before {
                    content: "标题2";
                }
                .ql-picker-label[data-value="3"]::before,
                .ql-picker-item[data-value="3"]::before {
                    content: "标题3";
                }
                .ql-picker-label[data-value="4"]::before,
                .ql-picker-item[data-value="4"]::before {
                    content: "标题4";
                }
                .ql-picker-label[data-value="5"]::before,
                .ql-picker-item[data-value="5"]::before {
                    content: "标题5";
                }
                .ql-picker-label[data-value="6"]::before,
                .ql-picker-item[data-value="6"]::before {
                    content: "标题6";
                }
            }
            .ql-picker.ql-font {
                .ql-picker-label[data-value="SimSun"]::before,
                .ql-picker-item[data-value="SimSun"]::before {
                    content: "宋体";
                    font-family: "SimSun" !important;
                }
                .ql-picker-label[data-value="SimHei"]::before,
                .ql-picker-item[data-value="SimHei"]::before {
                    content: "黑体";
                    font-family: "SimHei";
                }
                .ql-picker-label[data-value="Microsoft-YaHei"]::before,
                .ql-picker-item[data-value="Microsoft-YaHei"]::before {
                    content: "微软雅黑";
                    font-family: "Microsoft YaHei";
                }
                .ql-picker-label[data-value="KaiTi"]::before,
                .ql-picker-item[data-value="KaiTi"]::before {
                    content: "楷体";
                    font-family: "KaiTi" !important;
                }
                .ql-picker-label[data-value="FangSong"]::before,
                .ql-picker-item[data-value="FangSong"]::before {
                    content: "仿宋";
                    font-family: "FangSong";
                }
            }
        }
        .ql-align-center {
            text-align: center;
        }
        .ql-align-right {
            text-align: right;
        }
        .ql-align-left {
            text-align: left;
        }
    }
    .ql-snow .ql-picker.ql-size {
        width: 58px;
    }
    .ql-snow .ql-picker.ql-font {
        width: 80px;
    }
    .ql-snow .ql-picker.ql-header {
        width: 58px;
    }
    .ql-snow .ql-picker {
        font-size: 13px;
    }
}
</style>
