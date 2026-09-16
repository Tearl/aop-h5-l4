#### 使用方法：

1.在rpc文件夹下的index.js中配置导出的对象名、方法名及请求路径。

```js
export default {
    // 导出对象名:api、方法名:getData、请求路径:/AOP001.do
    api: {
        getData: proxy("/AOP001.do")
    }
}
```

2.在需要使用的组件中引入mixin目录下的index.js文件，并注册mixins对象。

```JS
<script>
// 引入index.js文件
import mixin from "@m/core/mixin/index.js"

export default {
  // 注册mixins对象
  mixins: [mixin]
};
</script>
```

3.在需要调用的地方通过this.rpc.对象名.方法名来调用

```JS
<script>
export default {
  created() {
      // 请求参数:params
      const params = {}
      const res = this.rpc.api.getData(params)
  }
};
</script>
```

