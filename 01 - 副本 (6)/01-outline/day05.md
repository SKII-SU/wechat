# 大纲

## 主页功能

### 配置项目菜单

- 应用的全局配置：底部菜单

  - 配置app.json文件中tabBar属性
    - list
      - "text": "首页",
      -  "pagePath": "pages/home/main",
      -  "iconPath": "static/icon/1-1.png",
      -  "selectedIconPath": "static/icon/1-2.png"
  - 配置app.json文件中pages属性

  ```
  [
      "pages/home/main",
      "pages/cate/main",
      "pages/card/main",
      "pages/my/main"
  ]
  ```

  - 创建相关页面

    - 模板文件 index.vue

    ```
    <template>
      <div>
        购物车    
      </div>
    </template>
    <script>
    export default {
      data () {
        return {}
      }
    }
    </script>
    
    ```

    - js文件

    ```
    import Vue from 'vue'
    import App from './index'
    const app = new Vue(App)
    app.$mount()
    ```

    

### 搜索栏

- 基本布局实现
  - 配置顶部底色
  - 实现搜索条布局
- 通用组件抽取

```
// 导入组件
import SearchBar from '../../components/searchbar'
// 配置组件
exports default {
  components: {
    'search-bar': SearchBar
  }
}
// 使用组件
<template>
  <search-bar></search-bar>
</template>
```

### 轮播图

- 基于小程序swiper实现轮播图布局

```
    <swiper :indicator-dots='indicatorFlag'>
      <swiper-item :key='index' v-for="(item, index) in imgUrls">
        <image :src="item" class="slide-image"/>
      </swiper-item>
    </swiper>
```

```
// swiper数据
data: {
  imgUrls: [
    'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
    'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
  ],
  indicatorDots: false, // 显示底部小圆点
  autoplay: false       // 自动播放
}
```

- 对接后台接口轮播图数据：接口地址参见【接口文档】

```
mpvue.request({
  url: 'https://www.zhengzhicheng.cn/api/public/v1/home/swiperdata',
  success: function (res) {
    let {message} = res.data
    // 从对象数组中获取图片地址
    list = list.map(item=>{
      return item.image_src;
    });
    // 更新轮播图数据
    that.imgUrls = message
  }
})
```

### 菜单

- 菜单基本布局
  - display: flex;

  -  justify-content: space-around;
- 对接菜单后台接口数据

```
mpvue.request({
  url: 'https://www.zhengzhicheng.cn/api/public/v1/home/catitems',
  success: function (res) {
    let {message} = res.data
    that.menu = message
  }
})
```

### 接口调用补充分析

- Ajax

```
function queryData(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('get','url');
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      var ret = xhr.responseText;
      callback(ret);
    }
  }
}
queryData(function(ret) {
  console.log(ret);
})
```

- Promise

```
function queryData() {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get','url');
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if(xhr.readyState != 4) {
        return;
      }
      if(xhr.status == 200) {
        resolve(xhr.responseText);
      }else{
        reject('服务器错误');
      }
    }
  });
}
queryData().then(function(ret){
  // 获取结果
  console.log(ret)
});
```

- Async/await

```
// async函数返回值是Promise实例对象
async function getData() {
  let ret = await queryData();
  console.log(ret)
  return ret;
}
// 点击按钮时，触发Ajax请求
var btn = document.getElementById('btn');
// 事件处理函数也可以是async函数
btn.onclick = async function() {
  var ret = await queryData2();
  console.log(ret)
}
```

### 封装通用接口调用模块

```
// 封装一个通用的请求方法
const request = (path, method = 'GET', data = {}, header = {}) => {
  // 把异步的请求放到Promise实例中处理
  let url = `https://www.zhengzhicheng.cn/api/public/v1/${path}`
  let p = new Promise(function (resolve, reject) {
    mpvue.request({
      url,
      method,
      data,
      header,
      success: function (res) {
        resolve(res)
      }
    })
  })
  return p
}
export default request
```

- 重构轮播图和菜单的数据接口调用方式

```

  let swiperRes = await this.queryData('home/swiperdata')
  this.swipers = swiperRes.data.message;
  
```

### 商品列表

- 商品列表布局

```
<div class="floor" >
  <div class="floor-title">
    <img src="" mode="aspectFill">
  </div> 
  <div class="floor-content">
    <div class="left">
      <img src="" mode="aspectFill">
    </div>
    <div class="right">
      <img src="img.image_src" mode="aspectFill">
      <img src="img.image_src" mode="aspectFill">
      <img src="img.image_src" mode="aspectFill">
      <img src="img.image_src" mode="aspectFill">
    </div>
  </div>
</div>
```

```
.floor{
  .floor-title{
    width:100%;
  }
  .floor-content{
    display: flex;
    justify-content: space-between;
    width:100%;
    .left {
      img {
        width:232rpx;
        height:385rpx;
      }
    }
    .right {
      flex:1;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      img {
        width:232rpx;
        height:188rpx;
        border-radius:4px;
      }
    }
  }
}

```

- 对接商品接口数据

```

  let floorRes = await this.queryData('home/floordata')
  this.floors = floorRes.data.message;

```

### 回到顶部

- 按钮样式

```
︿
```

```
.to-top {
  width:100rpx;
  height:100rpx;
  border-radius: 50%;
  background:rgba(255,255,255,0.8);
  position: fixed;
  right:40rpx;
  bottom:40rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

- 回到顶部功能实现

```
toTopHandle () {
  // 控制回到顶部
  mpvue.pageScrollTo({
    scrollTop: 0
  })
}
```

```
onPageScroll (event) {
  // 小程序生命周期函数，监控页面的滚动
  // 如果滚动指定大小，那么就控制显示或隐藏
  this.isShow = event.scrollTop > 50
}
```

### 下拉刷新

- 配置下拉刷新选项
  - enablePullDownRefresh: true
  - backgroundTextStyle: dark
- 实现下拉刷新功能

```
onPullDownRefresh () {
  // 下拉刷新，重新加载页面的数据
  this.initData()
}
```

### 配置sass环境

- 安装相关依赖包

```
npm install node-sass sass-loader -D
```

- 样式标签配置scss

```
<style scoped lang='scss'>
  @import 'main.scss'
</style>
```



## 商品分类

### 顶部搜索条

- 导入公共组件
- 通过components属性配置组件
- 使用组件

```
// 导入组件
import SearchBar from '../../components/searchbar'
// 配置组件
exports default {
  components: {
    'search-bar': SearchBar
  }
}
// 使用组件
<template>
  <search-bar></search-bar>
</template>
```

### 分类数据加载

- 调用后台接口获取分类数据
  - 接口路径：categories

```
async cateData () {
  // 调用接口获取分类数据
  let ret = await request('categories')
  this.cate = ret.data.message
}
```

### 左侧菜单渲染

- 实现左侧菜单布局
- 进行数据填充
- 控制菜单选中高亮

```
<div class="left">
  <div :class='{active: currentIndex === index}' :key='item.cat_id' v-for='(item, index) in cate' class="menu-item">
    {{item.cat_name}}
  </div>
</div>
```

### 右侧商标渲染

- 右侧内容布局
- 右侧数据填充

```
<div class="right">
  <div :key='item1.cat_id' v-for='item1 in getRightData' class="brand-item">
    <div class="brand-title">{{item1.cat_name}}</div>
    <div class="brand-list">
      <div :key='i' v-for='(img, i) in item1.children' class="brand">
        <img :src="img.cat_icon" mode="aspectFill">
        <p>{{img.cat_name}}</p>
      </div>
    </div>
  </div>
</div>
```

### 实现左侧菜单切换

- 左侧菜单绑定事件
- 控制右侧内容变化

```
changeBrand (index) {
  // 切换右侧商标
  this.currentIndex = index
  this.rightData = this.cate[this.currentIndex].children
}
```













