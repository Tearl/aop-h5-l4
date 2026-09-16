<template>
  <div style="width: 100%; height: calc(100vh - 193px)" ref="editor"></div>
</template>

<script>
export default {
  props: {
    editable: { type: Boolean, default: true },
    language: { type: String, default: "plaintext" },
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
        monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
      // console.log(`model language was changed to ${editor.getModel().getLanguageIdentifier().language}`);
    },
  },

  methods: {
    onChange() {
      const model = this.editor.getModels();
      model.onDidChangeContent((e) => {
        console.log(e);
      });
    },
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
      require(["vs/editor/editor.main"], () => this.toCreate(loading));
    },

    toCreate(loading) {
      loading && loading.close();
      if (!this.editor) {
        this.editor = monaco.editor.create(this.$refs.editor, {
          value: this.value,
          language: this.language,
          //   lineNumbers: "off",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: !this.editable,
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
        this.editor.onDidChangeModelContent((e) => {
          this.$emit("onChange", this.editor.getValue());
        });
        // 注册一个代码合并的命令
        monaco.editor.registerCommand("mergeVersion", (ctx, args) => {
          let { editor, replaceValue, startLine, endLine } = args;


          replaceValue = replaceValue.slice(1)
          replaceValue = replaceValue.replace('\r\n', '')
          let content = editor.getValue();
          let contentSplit = content.split("\n");
          let newContent = "";
          let start = false;
          contentSplit.forEach((line, index) => {
            let currentLine = index + 1;
            if (currentLine === startLine) {
              start = true;
            } else if (currentLine === endLine) {
              start = false;
              newContent = newContent + replaceValue;
              return;
            }
            if (start === false) {
              newContent = newContent + "\n" + line;
            }
          });
          /**
           * 如果需要处理断点的问题，使用以下代码修改内容前先保存一后端饰点
           * oldDecorations = activeEditor.deltaDecorations(oldDecorations, []);
           *
           * 修改内容xxxxx
           *
           * 或者如果需要重设当前鼠标点，可以使用以下内容
           * activeEditor.setSelection(new monaco.Range(0, 0, 0, 0));
           * activeEditor.setPosition(currentPosition);
           *
           * 修改完后重新设置断点
           * oldDecorations = activeEditor.deltaDecorations(oldDecorations, breakPoints);
           *
           * 以下是一个参考的反馈单
           * https://github.com/Microsoft/monaco-editor/issues/299
           */

          //替换某行某列，因为这里是>>>>>>所以这里是默认column为8
          editor.executeEdits("replace", [
            {
              identifier: "insert all",
              range: new monaco.Range(startLine, 1, endLine, 1000),
              text: replaceValue,
              forceMoveMarkers: true,
            },
          ]);
          // this.replaceContent(args.incomingVersionContent,args.startLine,args.endLine);
        });
        //注册一个合并工具提供者
        monaco.languages.registerCodeLensProvider("*", {
          provideCodeLenses: (model, token) => {
            let newCodeLens = [];
            let editor = this.editor;
            if (editor) {
              let content = editor.getValue();
              let contentSplit = content.split("\n");
              let compareDatas = [];

              //当前的所在的状态，start开始状态，split分层状态，end结束状态
              let status = "end";
              //当前版本的内容
              let versionContent = "";
              //冲突块
              let conflitBlock = {};
              let versionContentCount = 0;
              contentSplit.forEach((line, index) => {
                let currentLine = index + 1;
                if (line.startsWith("<<<<<<<")) {
                  conflitBlock = {
                    //信息提示的行号
                    startLine: currentLine,
                    //结束行
                    endLine: -1,
                    //本地版本内容
                    currentVersionContent: "",
                    //当前版本的总行数
                    currentVersionLineCount: -1,
                    //远程版本内容
                    incomingVersionContent: "",
                    //远程版本的总行数
                    incomingVersionLineCount: -1,
                  };
                  status = "start";
                  versionContent = "";
                } else if (line.startsWith(">>>>>>>") && status === "split") {
                  conflitBlock.incomingVersionContent = versionContent;
                  conflitBlock.endLine = currentLine;
                  conflitBlock.incomingVersionLineCount = versionContentCount;
                  versionContent = "";
                  versionContentCount = 0;
                  status = "end";
                  compareDatas.push(conflitBlock);
                } else if (line.startsWith("=======") && status === "start") {
                  conflitBlock.currentVersionContent = versionContent;
                  conflitBlock.currentVersionLineCount = versionContentCount;
                  versionContent = "";
                  versionContentCount = 0;
                  status = "split";
                } else {
                  if (status === "start" || status === "split") {
                    versionContent = versionContent + '\n' + line;
                    versionContentCount = versionContentCount + 1;
                  }
                }
              });
              let codeDecorations = [];
              if (compareDatas.length > 0) {

                for (let compareData of compareDatas) {
                  let {
                    startLine,
                    endLine,
                    currentVersionContent,
                    currentVersionLineCount,
                    incomingVersionContent,
                    incomingVersionLineCount,
                  } = compareData;

                  //使用本地版本触发按钮
                  newCodeLens.push(
                    this.createCodeLen(
                      "currentVersion",
                      "使用本地的版本",
                      startLine,
                      endLine,
                      1,
                      editor,
                      currentVersionContent
                    )
                  );

                  //使用远程版本按钮
                  newCodeLens.push(
                    this.createCodeLen(
                      "incomingVersion",
                      "使用远程版本",
                      startLine,
                      endLine,
                      2,
                      editor,
                      incomingVersionContent
                    )
                  );

                  //合并两个版本按钮
                  newCodeLens.push(
                    this.createCodeLen(
                      "bothVersion",
                      "同时使用两个版本",
                      startLine,
                      endLine,
                      3,
                      editor,
                      currentVersionContent + "\r\n" + incomingVersionContent
                    )
                  );

                  //当前版本的标签
                  codeDecorations.push(
                    this.createMergeDecoration(
                      startLine,
                      startLine,
                      "currentVersionTag"
                    )
                  );
                  //当前版本的代码范围 开始行数 + 当前版本的总行数
                  codeDecorations.push(
                    this.createMergeDecoration(
                      startLine,
                      startLine + currentVersionLineCount,
                      "currentContentTag"
                    )
                  );

                  //远程版本的代码范围 结束行数 - 远程行数的总行数
                  codeDecorations.push(
                    this.createMergeDecoration(
                      endLine - 1,
                      endLine - incomingVersionLineCount,
                      "incomingContentTag"
                    )
                  );
                  //远程版本的标签
                  codeDecorations.push(
                    this.createMergeDecoration(
                      endLine,
                      endLine,
                      "incomingVersionTag"
                    )
                  );
                }
              }

              let oldMergeDecorations = editor.oldMergeDecorations
                ? editor.oldMergeDecorations
                : [];
              // 返回的是一个decotation集，可以对期进行增删处理
              var decorations = editor.deltaDecorations(
                oldMergeDecorations,
                codeDecorations
              );

              editor.oldMergeDecorations = decorations;
            }

            return {
              lenses: newCodeLens,
              dispose: () => {},
            };
          },
          resolveCodeLens: function (model, codeLens, token) {
            alert("condLens");
            return codeLens;
          },
        });
      }
    },

    toCreateScript(src) {
      let head = document.querySelector("head");

      const scripts = document.querySelectorAll("script");
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
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
      head.appendChild(script);
    },
    //创建对比按钮
    createCodeLen(id, title, startLine, endLine, column, editor, replaceValue) {
      return {
        range: {
          startLineNumber: startLine,
          startColumn: column,
          endLineNumber: endLine,
          endColumn: column,
        },
        id,
        command: {
          id: "mergeVersion",
          title,
          arguments: [
            {
              startLine,
              endLine,
              editor,
              replaceValue,
            },
          ],
        },
      };
    },
    //创建
    createMergeDecoration(startLine, endLine, classStyleName) {
      return {
        range: new monaco.Range(startLine, 1, endLine, 1),
        options: {
          isWholeLine: true,
          className: classStyleName,
        },
      };
    },
    updateEditor(content) {
      if (this.editor) {
        if (content != this.editor.getValue()) this.editor.setValue(content);

        this.editor.updateOptions({
          readOnly: !this.editable,
        });
      }
    },
  },
};
</script>
