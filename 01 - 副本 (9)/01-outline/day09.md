# 大纲

- 函数防抖（debounce）和函数节流（throttle）
  - 作用：限制某一个任务执行的频率
  - 特征：一般都有一个频繁触发的条件
    - input
    - onresize
    - onscroll
    - onmousemove
  - 区别
    - 函数防抖：在特定时间内（1s），如果没有触发条件，那么就执行一次任务；如果连续时间不超过1s触发条件，那么任务始终不会执行。
    - 函数节流：在特定时间内（1s），仅执行一次任务，与触发条件的次数无关（在1s内仅仅产生一个任务，当前任务完成之后，才会产生下一个任务）

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
  - Tab静态布局
  - 控制class动态改变
  - 点击控制切换

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
  <navigator class='goods-item'>
    <img :src="item.goods_small_logo" mode="aspectFill"/>
    <div class="goods-right">
      <h4>
        {{item.goods_name}}
      </h4>
      <div class="price">
        <span>￥</span>{{item.goods_price}}
      </div>
    </div>
  </navigator>
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

###  页面触底监听

- 页面触底时触发

```
onReachBottom () {
  // 滚动条触底的时候触发该方法
  this.loadData()
}
```

### 搜索列表加载更多

- 控制加载更多
  - 控制页码的累加
  - 加载结束的条件控制
  - 没有更多数据时，给一个提示

```
// 如果没有更多数据，就应该禁止发送请求调用接口
if (this.hasMore) {
  return
}

// 判断是否还有更多数据
if (this.list.length >= this.total) {
  // 没有更多数据了
  this.hasMore = true
}

// 加载完成数据之后，让页码加1
this.pagenum = this.pagenum + 1
```

### 控制接口调用频率

- 通过加载标志位控制加载频率
  - 上一个请求结束之后才可以触发下一次请求

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
  this.info.num = 1
  // 把商品存入购物车：（商品的id：商品的详情）
  cart[this.info.goods_id] = this.info
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

## 购物车

### 收货地址

- 基本布局

```
<!-- 地址信息的展示 -->
<div class="cart-top" v-if='address'>
  <div class="receive">
    <div class="name">收货人: 张三</div>
    <div class="phonen-number">122345678901</div>
  </div>
  <div class="address">收货地址: 北京市海淀区</div>
  <img src="../../../static/images/cart_border@2x.png" class="address-bar" mode="aspectFill">
</div>
<!-- 新增收货人信息 -->
<div class="add_addresss" v-else>
  <text>新增收货人</text>
  <span></span>
</div>
```

- 获取收货地址

```
getAddressInfo () {
  // 获取地址信息
  let that = this
  mpvue.chooseAddress({
    success (res) {
      that.address = res
      // 同时存在在本地存储中
      mpvue.setStorageSync('myAddress', res)
    }
  })
}
```

### 商品列表展示

- 商品列表布局

```
<div class="list-title">优购生活馆</div>
<!-- 商品列表信息 -->
<div class="ware-list">
  <div class="ware-item">
    <!-- 左侧按钮checkbox -->
    <div class="choice-button">
      <icon :color="item.checked?'red':'#eee'" type='success' size='18'/>
    </div>
    <!-- 右侧商品信息 -->
    <div class="ware-content">
      <!-- 左侧图片 -->
      <navigator class='ware-image'>
        <img :src='item.goods_small_logo' mode="aspectFill"/>
      </navigator>
      <!-- 右侧商品信息 -->
      <div class="ware-info">
        <!-- 商品名称 -->
        <navigator class='ware-title'>
          {{item.goods_name}}
        </navigator>
        <!-- 商品价格和数量变更 -->
        <div class="ware-info-btm">
          <!-- 商品价格 -->
          <div class="ware-price">
            <span>￥</span>
            {{item.goods_price}}
          </div>
          <!-- 数量变更 -->
          <div class="calculate">
            <div class="rect" >-</div>
            <div class="number">{{item.num}}</div>
            <div class="rect">+</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 底部菜单布局

- 菜单基本布局

```
<div class="cart-total">
  <!-- 左侧CheckBox -->
  <div class="total-button">
    <icon type='success' size='18'/>全选
  </div>
  <!-- 中间的价格 -->
  <div class="total-center">
    <div class="total-price">合计：
      <text class="colorRed">
        <text>￥</text>{{allPrice}}
      </text>
    </div>
    <div class="price-tips">包含运费</div>
  </div>
  <!-- 右侧结算按钮 -->
  <div class="accounts" >
    结算
  </div>
</div>
```

### 控制单件商品的选中与否

- 控制每件商品的选中与否：本质上就是控制每件商品的checked属性值
- 根据id去修改相应商品的checked（保证该值在true和false之家进行切换）

```
changeItemCheckbox (id) {
  let products = [...this.products]
  products.some(item => {
    if (item.goods_id === id) {
      // 表示找到了要选中的商品
      item.checked = !item.checked
      // 终止遍历
      return true
    }
  })
  this.products = products
}
```

### 控制商品是否全选

- 实现思路：把products中所有商品的checked属性全部修改一遍

```
selectAll () {
  // 实现所有商品的全部选中或者全部取消
  // 控制全选按钮的样式
  this.isAll = !this.isAll
  let products = [...this.products]
  // 修改所有的商品的选中状态
  products.forEach(item => {
    item.checked = this.isAll
  })
  this.products = products
}
```

### 控制商品数据加一

-   商品数量加一:根据id查询出products中的对应商品的信息，修改对应的num数量

```
addHandle (id) {
  // console.log('+' + id)
  let products = [...this.products]
  products.some(item => {
    if (item.goods_id === id) {
      // 找到了要修改数量的商品，把对应商品数量加一
      item.num = item.num + 1
      // 终止遍历
      return true
    }
  })
  this.products = products
  // this.updateStorage()
}
```

### 控制商品数量减一

- 如果当前商品的数量是1，那么就删除该商品；如果当前商品的数量大于1，那么就进行减一操作

```
subHandle (id) {
  // 商品数量减一
  // console.log('-' + id)
  let products = [...this.products]
  let currentIndex = -1
  products.some((item, index) => {
    if (item.goods_id === id) {
      if (item.num === 1) {
        // 记录一下当前商品的索引,接下来使用该索引把商品删除即可
        currentIndex = index
      } else {
        // 商品数量减一
        item.num = item.num - 1
      }
      // 终止遍历
      return true
    }
  })
  // 判断是否要删除商品
  if (currentIndex !== -1) {
    // 删除商品
    products.splice(currentIndex, 1)
  }
  this.products = products
}
```



### 计算商品总价

- 通过计算属性计算商品总价

```
calcTotalPrice () {
  // 计算总价
  // 计算商品的总价：单价 * 数量 再相加
  let sum = 0
  // 计算总价
  this.products.forEach(item => {
    // 单价 * 数量 再相加
    sum += item.goods_price * item.num
  })
  return sum
}
```

### 去结算

- 如果没有选择商品，就提示用户选择商品

```
// 判断用户是否选择了要购买的商品
let isSelected = this.orderGoods().length === 0
if (isSelected) {
  // 用户没有选中商品，给一个提示并且终止提交订单
  mpvue.showToast({
    title: '请选择商品',
    icon: 'success'
  })
  return
}
```

- 如果没有登录，就跳转到授权登录页面

```
let token = mpvue.getStorageSync('mytoken')
// 如果没有登录，就跳转到授权页面
if (!token) {
  mpvue.navigateTo({
    url: '/pages/auth/main'
  })
}
```

- 如果已经登录就创建订单

```
let param = {
  // 商品的总价
  order_price: this.calcTotalPrice(),
  // 收货地址
  consignee_addr: this.joinAddress(),
  // 购买的商品清单
  goods: this.orderGoods()
}
request('my/orders/create', 'post', param, {
  Authorization: token
}).then(res => {
  let {message} = res.data
  let orderNumber = message.order_number
  // 把生成的订单号作为参数传递到下一个页面：订单确认页面
  mpvue.navigateTo({
    url: '/pages/order/main?order_num=' + orderNumber
  })
})
```

### 用户授权

- 用户授权基本布局
  - open-type='getUserInfo'
  -  @getuserinfo='getUserInfo'

```
<button open-type='getUserInfo' @getuserinfo='getUserInfo'>授权登录</button>
```

### 获取授权信息

- 调用mpvue.login接口获取授权相关信息

```
 getUserInfo (e) {
   // 获取用户的授权信息,这些信息用于登录我们自己的后台接口
   let {detail} = e.mp
   mpvue.login({
      success (res) {
        if (res.code) {
          // 用户已经授权登录
          let param = {
            code: res.code,
            encryptedData: detail.encryptedData,
            iv: detail.iv,
            rawData: detail.rawData,
            signature: detail.signature
          }
          // 登录后台接口，获取token
        }
      }
   })
 }
```

- 通过微信的授权信息，登录后台接口获取token

```
request('users/wxlogin', 'post', param).then(res => {
  let {message} = res.data
  // 把登录成功后的token存储起来，方便后续需要权限的接口使用
  mpvue.setStorageSync('mytoken', message.token)
  // 重新返回到购物车页面
  mpvue.navigateBack({
    // 跳回到前一个页面
    delta: 1
  })
})
```

