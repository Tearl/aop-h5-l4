<template>
  <div class="aop_tradedesign_comps_page_right_nav">
    <div class="nav_right">
      <ul>
        <li
          v-for="(item, index) in itemList"
          :key="index"
          @click="navClick(index)"
          class="nav_right_li"
          :class="navIndex == index ? 'nav_right_li_current' : isFold ? 'nav_right_li_fold' : ''"
        >
          <span class="nav_right_title">{{ item }}</span>
        </li>
        <li
          @click="liClick"
          class="li_fold"
        >
          <i class="el-icon-arrow-down" v-if="isFold"></i>
          <i class="el-icon-arrow-up" v-else></i>
        </li>
      </ul>
    </div>
    <div class="nav_bottom" v-show="navTopShow" @click="navClick('a')" ><span class="nav_bottom_bdt"></span><span class="nav_bottom_bdl"></span><i class="el-icon-arrow-up"></i
      ></div>
  </div>
</template>

<script>
export default {
  props: {
    // 左侧面包屑信息的数组
    itemList: {
      type: Array,
      default: () => [],
    },
    // 滚动条元素的类名
    parentClass: {
      type: String,
      default: () => ".main-home-view",
    },
    // 导航栏元素类名
    navClass: {
      type: String,
      default: () => ".nav_title",
    },
  },
  data() {
    return {
      // 元素距离body位置数组
      locationList: [],
      // 当前位置处于哪个元素的index
      navIndex: "",
      // 回到顶部是否显示
      navTopShow: false,
      // 是否折叠
      isFold: false
    };
  },
  methods: {
    getLocationList() {
      this.locationList = [];
      let a = document.querySelectorAll(this.navClass);
      a.forEach((item) => {
        let top = item.offsetTop;
        this.locationList.push(top);
      });
    },
    navClick(e) {
      this.getLocationList();
      console.log(this.locationList);
      let s = document.querySelector(this.parentClass);
      s.scrollTo({
        top: e == "a" ? 0 : this.locationList[e] - 48 - 48 - 48 - 20,
        behavior: "smooth",
      });
    },
    // 折叠按钮点击
    liClick() {
      this.isFold = !this.isFold
    },
    menu() {
      if (!this.menu.isfirst) {
        this.getLocationList();
      }
      this.menu.isfirst = true;
      let scroll =
        document.querySelector(this.parentClass).scrollTop ||
        document.body.scrollTop;
      this.locationList.forEach((item, index) => {
        if (scroll > item - 70 - 48 - 48) {
          this.navIndex = index;
        } else if (scroll < this.locationList[0]) {
          this.navTopShow = false
          this.navIndex = 0;
        } else if(scroll > this.locationList[0]) {
          this.navTopShow = true
        }
      });
    },
  },
  mounted() {
    document
      .querySelector(this.parentClass)
      .addEventListener("scroll", this.menu);
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_page_right_nav {
  .nav_right {
    // box-shadow: 2px 2px 3px #888888;
    box-shadow: #e7e7e7 0 0 25px;
    border-radius: 5px;
    position: fixed;
    right: 35px;
    top: 22%;
    z-index: 1500;
    &:hover {
      opacity: 1;
    }
    ul {
      padding: 10px 0px 0px 16px;
      background: $base_white;
      font-size: 13px;
      background: rgba(255,255, 255,0.5);
      &:hover {
        background: rgba(255,255, 255,1);
        .nav_right_li {
          opacity: 1;
        }
      }
    }
    .nav_right_li {
      height: 40px;
      line-height: 40px;
      width: 105px;
      padding: 0 10px;
      border-left: 3px solid #ccc;
      font-weight: 600;
      cursor: pointer;
      opacity: 0.4;
      &:hover {
        background: #ebf3ff;
        color: #358aff;
        border-left: 3px solid #358aff;
        .nav_right_title {
          
        }
      }
    }
    .li_fold {
      text-align: center;
      font-size: 18px;
      padding-right: 14px;
      cursor: pointer;
      &:hover {
        // background: #ebf3ff;
        color: #358aff;
      }
    }
    .nav_right_li_current {
      background: #ebf3ff;
      color: #358aff;
      border-left: 3px solid #358aff;
      opacity: 1;
    }
    .nav_right_li_fold {
      display: none;
    }
  }
  .nav_bottom {
    height: 32px;
    width: 41px;
    border: 1px solid #358aff;
    background: $base_white;
    position: fixed;
    right: 35px;
    bottom: 30px;
    border-radius: 2px;
    z-index: 1500;
    cursor: pointer;
    i {
      font-size: 25px;
      line-height: 27px;
      margin-left: 7.5px;
      color: #358aff;
    }
    .nav_bottom_bdt {
      display: block;
      height: 1.5px;
      width: 21px;
      background: #358aff;
      position: absolute;
      top: 6px;
      left: 9.5px;
    }
    .nav_bottom_bdl {
      display: block;
      height: 14px;
      width: 1.5px;
      background: #358aff;
      position: absolute;
      top: 10px;
      left: 19px;
    }
    &:hover {
      background: #358aff;
      i {
        color: #fff;
      }
      .nav_bottom_bdt {
        background: #fff;
      }
      .nav_bottom_bdl {
        background: #fff;
      }
    }
  }
}
</style>
