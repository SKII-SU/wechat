# 大纲

## 反馈

- 计算属性
  - 用于对data中的数据进行加工处理，形成新的数据
  - 计算属性是基于data中的数据进行处理的
  - 计算属性可以对处理过的数据进行缓存，所有可以提高性能
  - 数据加工常用方法
    - map
    - filter
    - slice
    - splice
    - some
- input事件和change事件
  - input事件如何触发？只要有值发生变化就触发
  - change事件如何触发？失去焦点时
  - v-model 双向数据绑定

- 滚动条

```
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
```

- 右侧模板渲染


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

### 限制触发频率（函数防抖和函数节流）

- 防止发送请求的频率（防抖）

```
// 函数防抖（固定时间内没有触发条件，就执行一次）
async inputHandle () {
  clearTimeout(this.timer)
  this.timer = setTimeout(async () => {
    let res = await request('goods/qsearch', 'get', {
      query: this.keyword
    })
    this.searchResult = res.data.message
  }, 1000)
}
```

- 防止发送请求的频率（节流）

```
// 函数节流（固定时间内无论触发几次，仅执行一次）
keywordSearch () {
  if (this.isLoading) {
    // 终止后续代码的执行，终止请求
    return
  }
  this.isLoading = true
  setTimeout(async () => {
    let res = await request('goods/qsearch', 'get', {
      query: this.keyword
    })
    this.searchResult = res.data.message
    // 重新打开发送请求的开关
    this.isLoading = false
  }, 1000)
}
```

- 函数防抖与函数节流
  - 概念（作用相同：限制任务触发的频率）
    - 函数防抖：在特定的时间内，没有触发特定条件，就执行一次任务
    - 函数节流：在特定的时间内，无论触发多次条件，仅执行一次任务
  - 两者的区别：
    - 函数防抖有可能在很长时间内一次任务都不执行，只有最后一次延时时间达到之后执行一次
    - 函数节流在特定时间内会固定触发一次任务，并且是规律的
  - 应用场景
    - 关键字搜索，限制接口调用频率
    - 表单验证，验证邮箱的格式，停止输入时再做验证
    - onresize  onscroll   onmousemove
      - 对于高频事件一般要做触发频率的显示

### 关键字历史存储

- 按回车键时保存关键字到本地存储
  - wx.setStorageSync(key, value);
  - wx.getStorageSync(key);
- 更新页面数据
  - 数组去重可以使用ES6的 Set 数据类型
  - Set存储结构类似于数组，但是不允许数据重复
  - Map 存储结构是 【键值对】

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
onLoad (param) {
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

## 商品详情

### 获取商品ID

- 通过小程序生命周期函数获取路径参数

```
onLoad (param) {
  // 获取路径中的参数
  this.goodsId = param.goods_id
}
```

### 加载商品详情数据

- 调用接口获取商品详情数据
  - 路径：goods/detail

```
async loadData () {
  // 根据商品的id查询详细信息
  let res = await request('goods/detail', 'get', {
    goods_id: this.goodsId
  })
  const {message} = res.data
  this.detail = message
}
```

### 轮播图布局

- 通过小程序swiper实现轮播图效果

```
<swiper indicator-dots>
  <block v-for="(item, index) in detail.pics" :key="index">
    <swiper-item>
      <image :src="item.pics_big_url" class="slide-image" mode="aspectFill"/>
    </swiper-item>
  </block>
</swiper>
```

### 商品详情布局

- 商品的基本信息
- 商品的详细信息
- 底部菜单

### 加入购物车

- 将商品信息添加到本地存储

```
addCart () {
  // 添加购物车实际上是把商品的信息填充到本地存储中
  let cart = mpvue.getStorageSync('mycart') || {}
  // 把商品的数量默认设置成1
  this.detail.num = 1
  // 把商品存入购物车：（商品的id：商品的详情）
  cart[this.detail.goods_id] = this.detail
  // 添加完成购物车之后，从新把最新的数据再次覆盖原来的数据
  mpvue.setStorageSync('mycart', cart)
  // 添加完成之后，最好给一个提示
  mpvue.showToast({
    title: '添加成功',
    icon: 'success'
  })
}
```

### 立即购买

- 添加购物车并跳转到购物车页面

```
toBuy () {
  // 直接购买：添加购物车；跳转到购物车
  this.addCart()
  // switchTab跳转到菜单指定的路径
  // navigateTo跳转非菜单指定的路径
  mpvue.switchTab({
    url: '/pages/cart/main'
  })
}
```

