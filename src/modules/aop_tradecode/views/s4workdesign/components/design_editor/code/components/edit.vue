<template>
  <div style="width: 100%; height: calc(100vh - 193px);" ref="editor"></div>
</template>

<script>
export default {
  props: {
    editable: { type: Boolean, default: true },
    language: { type: String, default: "" },
    value: { type: String, default: "" },
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

  mounted() {
    this.updateEditor(this.value);
  },

  watch: {
    value: function (val) {
      this.updateEditor(val);
    },
    language() {
        console.log(this.editor, this.language, 'language')
        monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
        // console.log(`model language was changed to ${this.editor.getModel().getLanguageIdentifier().language}`);
    }
  },

  methods: {
    onChange() {
        const model = this.editor.getModels();
        console.log(model, "ssss")
        model.onDidChangeContent(e => {
            console.log(e)
        });
    },
    loader(loading) {
      // 需要使用的是requirejs去加载AMD格式的monaco，而非node的require模块
      // loader.js负责装载window.require，也可以单独使用requirejs而非自带的loader.js去加载
      // 不要修改monaco-editor/min/vs路径，除非改源码，该版本的MonacoEnvironment不起作用，worker.main.js里面自维护的变量取的不是外面的
      console.log('testssss', 'loader')
      const scripts = document.querySelectorAll('script')
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if (script.src.includes('editor.main.js')) {
            this.toCreate(loading)
            return
        }
      }
      
      let require = window.require;
      // CDN引入（链接源自官方demo）
      let vsPath =
        "/package/monaco-editor/0.33.0/min/vs";
      // public 引入
      // let vsPath = "monaco-editor/min/vs"
      require.config({ paths: { vs: vsPath } });
        console.log(this.editor, 'this.edito33r')
      require(["vs/editor/editor.main"], () => this.toCreate(loading));
      
    },

    toCreate(loading) {
      loading && loading.close()
      console.log(this.editor, 'this.editor')
      if (!this.editor) {
        monaco.editor.defineTheme("myTheme", {
          base: "vs",
          inherit: true,
          rules: [{ background: "EDF9FA" }],
          colors: {
            "editor.foreground": "#000000",
            "editor.background": "#EDF9FA",
            "editorCursor.foreground": "#8B0000",
            "editor.lineHighlightBackground": "#0000FF20",
            "editorLineNumber.foreground": "#008800",
            "editor.selectionBackground": "#88000030",
            "editor.inactiveSelectionBackground": "#88000015",
          },
        });
        monaco.editor.setTheme("myTheme");
        this.editor = monaco.editor.create(this.$refs.editor, {
          value: this.value,
          language: this.language,
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

          //小地图
          minimap: {
            enabled: true,
          },
        });
        // monaco.editor.unRegisterCommand("mergeVersion")
        // 注册一个代码合并的命令

        //注册一个合并工具提供者

        this.editor.onDidChangeModelContent((e) => {
          this.$emit("onChange", this.editor.getValue());
        });
        
      }
    },

    toCreateScript(src) {
      let head = document.querySelector("head");

      console.log('hhhhhhh')
      let script = document.createElement("script");
      script.onload = () => this.loader();
      script.onerror = () => {
        head.removeChild(script);
      };
      script.src = src;
    //   console.log(script, "ddd")
      head.appendChild(script);
    },

    updateEditor(content) {
      if (this.editor) {
        if (content != this.editor.getValue()) this.editor.setValue(content);

        this.editor.updateOptions({
          readOnly: true,
        });
      }
    },
  },
};
</script>