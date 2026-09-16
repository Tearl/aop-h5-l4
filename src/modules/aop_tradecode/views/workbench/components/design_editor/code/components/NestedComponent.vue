<template>  
  <div class="aop_code_dir_tree">  
    <div class="aop_code_dir_tree_title_container" v-if="data.name" :style="getStyle()" @click="handleClick(data)">
      <img class="file_close" :src="require('@m/assets/images/git/wenjianjia_1.png')" v-if="!isOpen && data.type === 'tree'"></img>
      <img class="file_open" :src="require('@m/assets/images/git/wenjianjia_kai.png')" v-if="isOpen && data.type === 'tree'"></img>
      <span class="aop_code_dir_tree_title" >{{ data.name }}</span>
    </div>
    <ul v-show="isOpen && children && children.length">
      <li v-for="item in children" :key="item.id">
        <NestedComponent :ref="item.id" @openFile="openFile" :hideStatus="status" @hideBg="hideBg" :proId="proId" :webUrl="webUrl" :rpc="rpc" :index="index + 1" :data="item" />  
      </li>
    </ul>
  </div>  
</template>  
<script>
export default {
  name: "NestedComponent",
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
    rpc: {
      type: Object,
      default: {},
    },
    webUrl: {
      type: String,
      default: "",
    },
    proId: {
      type: String,
      default: "",
    },
    hideStatus: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      isOpen: false,
      children: null,
      status: false,
    };
  },
  watch: {
    // hideStatus() {
    //   if (this.hideStatus) {
    //     this.status = false
    //   }
    // },
  },
  mounted() {
    if (!this.data.name) {
      this.handleClick(this.data)
    }
    this.children = this.data.sonDirectoryList;

  },
  methods: {
    hideBg(item) {
      // 父级隐藏后，
      if (item !== this.data) {
        this.status = false
      }
      this.$emit('hideBg', item)
      this.hideChildren(item)
    },
    showBg(item) {
      this.hideChildren(item)
    },
    hideChildren(item) {
      // 父级的子集隐藏
      if (this.children) {
        // console.log(this.children, 'children')
        for (let i = 0; i < this.children?.length; i++) {
          const child = this.children[i];
          // console.log(child.id)
          const list = this.$refs[child.id]
          if (list && list.length) {
            const element = list[0]
            // console.log(this.status)
            // console.log(element)
            if (element) {
              if (child.id === item.id){
                element.status = true
              } else if (child !== item) {
                element.status = false
              } 
              element.hideChildren(item)
            }
          }
        }
      }

    },
    handleClick(item) {
      this.isOpen = !this.isOpen;
      // this.isOpen = true
      this.status = true
      this.getFileList(item);
      const child = this.children[0]
      if (this.children.length === 1 && child.type === 'tree') {
        const list = this.$refs[child.id]
        list[0].handleClick(child)
      }
      if (item.type !== 'tree') {
        // console.log('111')
        this.$emit('hideBg', item)
      }
    },
    getStyle() {
      let num = this.index * 8 + 12;
      if (this.status && this.data.type !== 'tree') {
        return {
          paddingLeft: num + "px",
          color: '#358aff',
          background: '#eaf1ff',
        }
      }
      return {
        paddingLeft: num + "px",
      };
    },
    async getFileList(item) {
      console.log(item, "item")
      if (!this.children && item.type === "tree") {
        this.children = this.data.sonDirectoryList;
      } else {
        this.$emit("openFile", item);
      }
    },
    openFile(item) {
      this.$emit("openFile", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.aop_code_dir_tree {
  // padding-left: 8px;
  position: relative;
  // left: 8px;
  cursor: pointer;

  .aop_code_dir_tree_title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;

    font-family: PingFangSC-Semibold;
    font-size: 14px;
  }
  i {
    margin-right: 5px;
  }
  .aop_code_dir_tree_title_container {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    display: flex;
  }
  .aop_code_dir_tree_title_container:hover {
    color: #358aff;
    background: #eaf1ff;
  }
  .file_close {
    width: 16px;
    margin-right: 5px;
  }
  .file_open {
    width: 16px;
    margin-right: 5px;
  }
}
</style>