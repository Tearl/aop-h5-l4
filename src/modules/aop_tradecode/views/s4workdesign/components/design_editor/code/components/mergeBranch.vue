<template>
  <div class="aop_workbench_merge_branch">
    <div class="aop_workbench_merge_branch_top">
      <div class="aop_workbench_merge_branch_item">
        <div class="aop_workbench_merge_branch_bg">Source branch</div>
        <div class="aop_workbench_merge_branch_name">
          {{ branchData.name }}
        </div>
        <div class="aop_workbench_merge_branch_list">
          <div class="aop_workbench_merge_branch_list_middle">
            <div class="detail">
              {{ sourceData.message }}
            </div>
            <div class="name">
              {{ sourceData.authorName }} {{ sourceData.date }}
            </div>
          </div>
          <div class="aop_workbench_merge_branch_list_right">
            <div class="hash">{{ sourceData.id }}</div>
            <i
              class="el-icon-copy-document"
              @click="copyHash(sourceData.id)"
            ></i>
          </div>
        </div>
      </div>

      <!-- <div class="aop_workbench_merge_branch_list_left">
                        <img src="" alt="">
                    </div> -->
      <div class="aop_workbench_merge_branch_item">
        <div class="aop_workbench_merge_branch_bg">Target branch</div>
        <div class="aop_workbench_merge_branch_name">dev</div>
        <div class="aop_workbench_merge_branch_list">
          <div class="aop_workbench_merge_branch_list_middle">
            <div class="detail">
              {{ devData.message }}
            </div>
            <div class="name">{{ devData.authorName }} {{ devData.date }}</div>
          </div>
          <div class="aop_workbench_merge_branch_list_right">
            <div class="hash">{{ devData.id }}</div>
            <i class="el-icon-copy-document" @click="copyHash(devData.id)"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="add-more">
            <div>
                加载更多
            </div>
            <div>
                加载更多
            </div>
        </div> -->
    <div class="submit-merge">
      <el-button @click="handleCancle">取消</el-button>

      <el-button @click="mergeBranch" type="primary">确认合并</el-button>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  props: {
    proId: {
      default: "",
      type: String,
    },
    branchData: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
      editor: null,
      sourceData: {},
      devData: {},
      authFnctJobInfoId: this.$route.query.authFnctJobInfoId,
    };
  },
  created() {
    console.log(this.rpc, "this.rpc");
    this.commitsList();
    this.commitsListDev();
  },

  mounted() {},

  watch: {},

  methods: {
    handleCancle() {
      this.$emit("cancle");
    },
    async commitsList() {
      const res = await this.rpc.newEditor.commitsList({
        proId: this.proId,
        brhRef: this.branchData.name,
        authFnctJobInfoId: this.authFnctJobInfoId,
      });
      if (res.loginAgainFlag) {
        this.$emit("loginAgainFlag");
        return;
      }
      this.sourceData = res.commitList[0] || {};
      this.sourceData.date = this.sourceData.committedDate.split(".")[0];
    },
    async commitsListDev() {
      const res = await this.rpc.newEditor.commitsList({
        proId: this.proId,
        brhRef: "dev",
        authFnctJobInfoId: this.authFnctJobInfoId,
      });
      this.devData = res.commitList[0] || {};
      this.devData.date = this.devData.committedDate.split(".")[0];
      console.log(res, "dddd");
    },
    copyHash(value) {
      // const value = '11111'
      if (window.clipboardData) {
        window.clipboardData.setData("Text", "hello world");
      } else {
        (function (data) {
          document.oncopy = function (e) {
            e.clipboardData.setData("text", data);
            e.preventDefault();
            document.oncopy = null;
          };
        })(value);
        document.execCommand("Copy");
      }
      this.$notify({
        title: "成功",
        message: "复制成功",
        duration: 1000,
        type: "success",
      });
    },
    async mergeBranch() {
      // proId
      // sourceBranch
      // targetBranch
      // title
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const res = await this.rpc.newEditor.merge({
        proId: this.proId,
        sourceBranch: this.branchData.name,
        targetBranch: "dev",
        title: "合并分支",
        authFnctJobInfoId: this.authFnctJobInfoId,
      });
      if (res.loginAgainFlag) {
        this.$emit("loginAgainFlag");
        return;
      }
      const id = res.iid;
      setTimeout(async () => {
        const res2 = await this.rpc.newEditor.mergePut({
          iid: id,
          proId: this.proId,
          authFnctJobInfoId: this.authFnctJobInfoId,
        });
        if (!res2.hasConflicts) {
          this.$notify({
            title: "成功",
            message: "合并成功",
            duration: 1000,
            type: "success",
          });
          this.$emit("success");
        } else {
          if (res.repeatMerge) {
            this.$notify({
              title: "提示",
              message: "需要解决之前的冲突才可以再次合并",
              duration: 2000,
              type: "error",
            });
          }
          this.$emit("conflict", {
            id: id,
            targetBranchName: "dev",
          });
        }
        this.rpc.s4design.addFuntionJobCommitFlow({
          fnctId: this.$route.query.fnctId,
          jobTpCd: 'C4',
        })
        loading.close();
      }, 2000);
      //     }
      // }
      // }
      // loading.close()
      // return
      // this.$notify({
      //     title: "提示",
      //     message: "没有变更",
      //     duration: 1000,
      //     type: "warn",
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.aop_workbench_merge_branch {
  background: #fff;
  height: calc(100vh - 100px);

  .aop_workbench_merge_branch_top {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    // height: calc(100vh - 100px);
    background: #fff;
  }
  .aop_workbench_merge_branch_item {
    width: 40%;
    // height: 30vh;
    border-radius: 10px;
    border: 1px solid #eee;
    margin-right: 20px;
    margin-left: 20px;
  }
  .aop_workbench_merge_branch_bg {
    font-family: PingFangSC-Semibold;
    height: 32px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    font-weight: 600;
    font-size: 14px;
    color: #111111;
    letter-spacing: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    background: #eee;
  }
  .aop_workbench_merge_branch_name {
    font-family: PingFangSC;
    font-weight: 600;
    font-size: 14px;
    color: #111111;
    letter-spacing: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .aop_workbench_merge_branch_name {
    font-family: PingFangSC;
    height: 42px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    font-weight: 600;
    font-size: 14px;
    color: #111111;
    letter-spacing: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .aop_workbench_merge_branch_list {
    font-family: PingFangSC;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 15px;
    font-weight: 600;
    font-size: 14px;
    color: #111111;
    letter-spacing: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    background: #eee;
    border-bottom: 1px solid #ccc;
  }
  .aop_workbench_merge_branch_list_left {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: red;
  }
  .detail {
    letter-spacing: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100px;
  }
  .aop_workbench_merge_branch_list_middle {
    flex: 1;
    // margin-left: 10px;
  }
  .aop_workbench_merge_branch_list_right {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid;
    border-color: #f0f0f0;
    background: #fff;
    border: 1px solid #ccc;
    padding: 0 5px;
    margin-right: 10px;
    i {
      cursor: pointer;
      padding-left: 5px;
    }
    .hash {
      border-right: 1px solid #ddd;
      padding-right: 5px;
      letter-spacing: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 60px;
    }
    div {
      border-right: 1px solid #ddd;
      padding-right: 5px;
      letter-spacing: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .submit-merge {
    display: block;
    display: flex;
    padding-top: 100px;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    bottom: 10px;
    left: 50%;
    margin-top: 100px;
  }
  .add-more {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    div {
      width: 40%;
      margin-left: 20px;
      margin-right: 20px;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>