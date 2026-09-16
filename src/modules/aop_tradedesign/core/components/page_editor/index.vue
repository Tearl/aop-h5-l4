<template>
  <Editor
    ref="editorRef"
    :initialValue="eValue"
    :options="editorOptions"
    height="300px"
    initialEditType="markdown"
    previewStyle="tab"
    @change="getHtml"
    @load="onEditorLoad"
  />
</template>
<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";

export default {
  props: {
    editorText: {
      type: String,
      default: () => "",
    },
  },
  components: {
    Editor,
  },
  data() {
    return {
      editorOptions: {
        usageStatistics: true,
        hideModeSwitch: true,
      },
      eValue: "",
    };
  },
  methods: {
    init() {},
    getHtml() {
      let html = this.$refs.editorRef.invoke("getHTML");
      this.eValue = html;
    },
    onEditorLoad(e) {},
  },
  created() {
    this.init();
  },
  watch: {
    editorText(n, o) {
      this.$refs.editorRef.invoke("setHTML", n);
      this.eValue = n;
    },
  },
};
</script>