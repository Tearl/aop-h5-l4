<template>
  <div style="width: 100%; height: calc(100vh - 193px)" ref="editor"></div>
</template>

<script>
export default {
  props: {
    editable: { type: Boolean, default: true },
    language: { type: String, default: "plaintext" },
    value: { type: String, default: "" },
    newValue: { type: String, default: "" },
  },
  data() {
    return {
      editor: null,
    };
  },
  created() {
    // CDN引入（链接源自官方demo）
    let src =
      "/package/monaco-editor/0.33.0/min/vs/loader.js";
    // public 引入
    // let src = 'monaco-editor/min/vs/loader.js';
    this.toCreateScript(src);
  },

  mounted() {},

  watch: {
    value(val) {
      this.updateEditor(val);
    },
    newValue(val) {
      this.updateEditor(val);
    },
    language() {
      monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
    },
  },

  methods: {
    onChange() {},
    loader(loading) {
      // 需要使用的是requirejs去加载AMD格式的monaco，而非node的require模块
      // loader.js负责装载window.require，也可以单独使用requirejs而非自带的loader.js去加载
      // 不要修改monaco-editor/min/vs路径，除非改源码，该版本的MonacoEnvironment不起作用，worker.main.js里面自维护的变量取的不是外面的
      const scripts = document.querySelectorAll("script");
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if (script.src.includes("editor.main.js")) {
          this.toCreate(loading);
          return;
        }
      }

      let require = window.require;
      // CDN引入（链接源自官方demo）
      let vsPath =
        "/package/monaco-editor/0.33.0/min/vs";
      // public 引入
      // let vsPath = "monaco-editor/min/vs"
      require.config({ paths: { vs: vsPath } });
      // console.log(this.editor, 'this.edito33r')
      require(["vs/editor/editor.main"], () => this.toCreate(loading));
    },

    toCreate(loading) {
      loading && loading.close();
      // console.log(this.editor, 'this.editor')
      if (!this.editor) {
        this.editor = monaco.editor.createDiffEditor(this.$refs.editor, {
          //   value: this.value,
          //   language: this.language,
          //   lineNumbers: "off",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: true,
          theme: "vs-light",
          automaticLayout: true,

          //   wordWrap: "wordWrapColumn",
          //   wordWrapColumn: 40,

          // Set this to false to not auto word wrap minified files
          wordWrapMinified: true,
          // try "same", "indent" or "none"
          wrappingIndent: "indent",

          scrollbar: {
            // Subtle shadows to the left & top. Defaults to true.
            useShadows: false,

            // Render vertical arrows. Defaults to false.
            verticalHasArrows: false,
            // Render horizontal arrows. Defaults to false.
            horizontalHasArrows: false,

            // Render vertical scrollbar.
            // Accepted values: 'auto', 'visible', 'hidden'.
            // Defaults to 'auto'
            vertical: "auto",
            // Render horizontal scrollbar.
            // Accepted values: 'auto', 'visible', 'hidden'.
            // Defaults to 'auto'
            horizontal: "auto",

            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            arrowSize: 10,
          },
          codeLens: true,
          colorDecorators: true,
          contextmenu: false,
          readOnly: true, //是否只读
          formatOnPaste: true,
          wordWrap: "on", // 换行
          //小地图
          minimap: {
            enabled: true,
          },
        });
        this.updateEditor(this.value);
      }
    },

    toCreateScript(src) {
      let head = document.querySelector("head");

      const scripts = document.querySelectorAll("script");
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        // console.log(script.src, "sss")
        if (script.src === src) {
          script.remove();
          // head.appendChild(script);
          // this.loader();
          // return
        }
      }
      let script = document.createElement("script");
      script.onload = () => this.loader();
      script.onerror = () => {
        head.removeChild(script);
      };
      script.src = src;
      // console.log(script, "ddd")
      head.appendChild(script);
    },

    updateEditor() {
      if (this.editor) {
        // console.log(this.value, this.newValue)
        this.editor.setModel({
          original: monaco.editor.createModel(this.value || '', this.language),
          modified: monaco.editor.createModel(this.newValue || '', this.language),
        });
      }
    },
  },
};
</script>