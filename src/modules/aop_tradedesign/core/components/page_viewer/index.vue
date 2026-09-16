<template>
  <Viewer v-if="viewShow" ref="viewerRef" :initialValue="eValue" height="300px" />
</template>
<script>
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/vue-editor';

export default {
  props: {
    editorText: {
      type: String,
      default: () => "",
    },
  },
  components: {
    Viewer,
  },
  data() {
    return {
      eValue: "",
      viewShow: false
    };
  },
  methods: {
    init() {
    },
  },
  created() {
    this.init();
  },
  watch: {
    editorText(n,o) {
      this.viewShow = false;
      this.eValue = this.editorText;
      this.viewShow = true;
    }
  },
};
</script>