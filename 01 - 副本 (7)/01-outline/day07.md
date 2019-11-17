# 大纲

## 商品分类

- promise
- async/await
- foreach 和 map

### 配置sass环境

- 安装相关依赖包

```
npm install node-sass sass-loader -D
npm install less less-loader -D
```

- 样式标签配置scss

```
<style scoped lang='scss'>
  @import 'main.scss'
</style>
```



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
}
```

## 搜索功能

### 搜索页面

- 搜索条效果

```
<div class="search-input">
  <icon type='search' size='16'/>
  <input placeholder="请输入关键字" />
</div>
<button class="cancel">取消</button>
```

- 搜索结果列表

```
<div class="search-modal">
  <div class="search-item">
    商品名称
  </div>
</div>
```

- 清空搜索历史

```
<div class="history">
  <h4>搜索历史</h4>
  <icon type='clear' size='16'/>
</div>
```

- 搜索历史关键字列表

```
<div class="history-list">
  <div class="history-item">
    <navigator :url="'/pages/search_list/main?query=keyword'">
      搜索关键字
    </navigator>
  </div>
</div>
```

### 关键字搜索

- 输入关键字，调用后台接口，获取数据，渲染列表

```
// 事件绑定
// input事件触发的条件：只要有字符变化就触发
// change事件触发的条件：失去焦点时触发
// 如何限制触发频率：函数防抖；函数节流
<input @input='inputHandle' v-model='keyword' placeholder="请输入关键字" />
```

```
// 调用接口
async inputHandle () {
  // 调用接口需要传递参数
  let res = await request('goods/qsearch', 'get', {
    query: this.keyword
  })
  this.searchResult = res.data.message
}
```

### 关键字防抖效果

- 防止发送请求的频率

```
async inputHandle () {
  if (this.isLoading) {
    // 终止后续代码的执行，终止请求
    return
  }
  this.isLoading = true
  this.timer = setTimeout(async () => {
    // 关闭之前的定时任务
    clearTimeout(this.timer)
    let res = await request('goods/qsearch', 'get', {
      query: this.keyword
    })
    this.searchResult = res.data.message
    // 重新打开发送请求的开关
    this.isLoading = false
  }, 1000)
}
```

### 关键字历史存储

- 按回车键时保存关键字到本地存储
- 更新页面数据

```
confirmHandle () {
  // 当回车的时候，记录关键字到本地存储
  this.keywordHistory.unshift(this.keyword)
  // 如何进行数组去重
  let kwh = [...new Set(this.keywordHistory)]
  // 把最新的数据覆盖到本地存储中
  mpvue.setStorageSync('keyword', kwh)
  // 重新更新页面数据
  this.keywordHistory = kwh
}
```

### 历史关键字渲染

- 从本地存储获取历史关键字数据

```
data () {
  return {
    keywordHistory: mpvue.getStorageSync('keyword') || []
  }
}
```

- 填充模板

```
<div class="history-list">
  <div :key='index' v-for='(item, index) in keywordHistory' class="history-item">
      {{item}}
  </div>
</div>
```

### 清空历史关键字

- 清空本地存储

```
clearHistory () {
  // 清空搜索关键字的历史信息
  // 清空的是本地存储的数据（清空本地存储的数据并不会影响data中的数据）
  mpvue.clearStorageSync()
  // 清空的是data中的数据
  this.keywordHistory = []
}
```

### 关键字页面跳转

- 控制跳转

```
// 输入关键字后，回车触发跳转并携带参数
mpvue.navigateTo({
  url: '/pages/search_list/main?query=' + this.keyword
})
```

- 添加商品列表页面
- 商品列表页面获取路径参数

```
async onLoad (param) {
  // 参数query表示路径传递过来的参数
  this.keyword = param.query
}
```

### 搜索历史跳转

- 通过navigator组件实现跳转，并且携带参数

```
<div class="history-list">
  <div :key='index' v-for='(item, index) in keywordHistory' class="history-item">
    <navigator :url="'/pages/search_list/main?query=' + item">
      {{item}}
    </navigator>
  </div>
</div>
```

## 商品列表

### 商品列表布局

- 商品列表页搜索条

```
<div class="search">
  <div class="search-input">
    <icon type="search" size="16" color="#999"/>
    {{keyword}}
  </div>
</div>
```

- 商品列表Tab布局

```
<div class="tabs">
  <div @click='tabHandle(index)' :class='{active: currentIndex === index}' :key='index' v-for='(item, index) in tabNames' class="tab-item">
    {{item}}
  </div>
</div>
```

### 商品列表展示

- 列表基本布局

```
<div class="goods-list">
  <img :src="item.goods_small_logo" mode="aspectFill"/>
  <div class="goods-right">
    <h4>
      {{item.goods_name}}
    </h4>
    <div class="price">
      <span>￥</span>{{item.goods_price}}
    </div>
  </div>
</div>
```

- 列表数据加载

```
// 根据关键字加载匹配的商品列表数据
let res = await request('goods/search', 'get', {
  query: this.keyword,
  pagenum: this.pagenum
})
let {message} = res.data
// 需要把新加载的一页数据添加到list中
let goods = [...this.list, ...message.goods]
this.list = goods
this.pagenum = parseInt(message.pagenum)
this.total = message.total
```

### 搜索列表加载更多

- 控制加载更多

```
// 如果没有更多数据，就应该禁止发送请求调用接口
if (this.hasMore) {
  return
}

// 判断是否还有更多数据
if (this.list.length >= this.total) {
  // 没有更多数据乐
  this.hasMore = true
}

// 加载完成数据之后，让页码加1
this.pagenum = this.pagenum + 1
```

### 控制接口调用频率

- 通过加载标志位控制加载频率

```
// 本次接口调用是否已经加载完成
if (this.isLoading) {
  return
}
// 作用：禁止再次触发接口调用
this.isLoading = true

// 加载数据

// 接口数据返回之后，才允许再次发出请求
this.isLoading = false
```

### 页面滚动到底部触发数据加载

```
onReachBottom () {
  // 滚动条触底的时候触发该方法
  this.loadData()
}
```













