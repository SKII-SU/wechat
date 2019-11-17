# 大纲

## 反馈问题

- 生命周期
  - 生命周期指的是小程序应用本身或者页面的运行过程（这个过程的各个阶段会触发特定的一些函数）
- 导航组件（路由）
  - 小程序也是单页应用
  - Tab页面
  - 非Tab页面
  - navigator组件
    - open-type
      - navigate （默认跳转到非Tab页面，并且又返回按钮，并且这个返回按钮只能返回上一级页面）
      - switchTab （如果要从子级页面中直接跳回到某一个Tab页面，那么必须指定该值）
      - redirect（重定向，相当于打开第一个页面，此时没有返回按钮，这时就需要在当前页面添加navigator组件指定如何调回）




## WXML模板语法详解
- 常用内置组件
- 模板用法
- 数据绑定
- 条件渲染
- 列表渲染
- 事件处理

### 数据绑定
- 基本数据绑定
- 组件属性绑定：插值表达式的信息可以插入到属性中
- 插值表达式内部支持计算
- 对象操作：访问对象中的属性值（对象名称.属性名称）

### 条件渲染 
- wx:if 
- wx:elif
- wx:else
- block标签用法
  - block标签不会渲染到页面中
- hidden属性和wx:if的区别
  - 类似于vue中的中v-if和v-show的区别
    - 内置组件都有一个hidden属性：如果值为false就显示，为true就不显示
    - 通过hidden控制标签渲染的话，无论是否显示内容，实际上都进行了渲染，类似于vue中的v-show
    - 如果要频繁的控制组件的显示或者隐藏，那么推荐使用hidden

### 列表渲染 
- wx:for 
- wx:key 
- wx:for-index 给索引起一个别名
- wx:for-item 给数据项起一个别名
- wx:key 的作用：保证兄弟节点被唯一区分，主要用于提高性能
- 对象数组的遍历

### 模板用法 

> 应用场景：重复性的内容可以抽取到模板中

- 定义模板：数据是使用模板的时候传递过来的，而不是直接从js文件中传递过来的
  - 需要提供name属性

```
<template name='fruitList'>
  <view>水果列表</view>
  <view wx:key='{{item.id}}' wx:for='{{fruits}}'>
    {{index}}----{{item.ename}}---{{item.cname}}
  </view>
</template>
```

- 使用模板：这里的data数据来自于页面js文件中data数据
  - 需要通过is属性去关联定义模板时的name属性值

```
<template is='fruitList' data='{{...listData}}'></template>
```

### 事件处理 

> 事件的绑定方式：bind:【事件名称】、事件函数如何处理:需要在js文件中进行定义

- 绑定事件方式
    + bind 事件绑定不会阻止冒泡事件向上冒泡
    + catch 事件绑定可以阻止冒泡事件向上冒泡
- 如何控制事件捕获
    - capture-bind 不阻止捕获事件向内部传递
    - capture-catch 阻止捕获事件向内部传递
- 事件对象：可以通过事件函数获取
  - currentTarget和target的区别：
    - 如果是事件源的话，currentTarget和target相同
    - 需要区分事件源和冒泡发生的事件行为
    - target表示事件源，就是实际触发事件的组件
    - currentTarget表示当前触发事件的组件，有可能是冒泡触发的事件
    - 如果要获取触发组件的data-数据，要使用event.target.dataset获取属性的数据

## 表单操作
- form
- input 
- checkbox
- radio
- textarea 
- 表单提交数据的方式：
  - 表单项目需要提供name属性
  - 提交按钮需要提供属性form-type='submit'
  - form组件需要提供属性bindsubmit=事件处理函数



## 总结

- WXML模板语法
  - 内置组件
  - 数据绑定
  - 条件渲染
  - 列表渲染
  - 模板用法template
  - 事件处理
    - 基本事件绑定
    - 事件的冒泡和捕获
    - 处理事件对象
      - 获取事件源对象
      - 获取当前触发事件的对象
      - 获取自定义属性dataset
      - 标准事件名称：参见官网
  - 表单基本操作：触发提交动作时获取表单数据



## JS交互逻辑详解
- js和wxml交互流程分析
    - js与模板是如何交互的？
- App() 该函数是微信小程序api的一部分，App名称是固定的
    + getApp() 作用：在子页面中使用全局实例对象中的数据和方法
      + 不可以显示的调用全局生命周期函数
      + 但是可以直接操作自定义的数据或者函数
    + 这app.js中通过this的方式获取小程序实例
- Page() 该函数是微信小程序api的一部分，Page名称是固定的
    + 页面数据 data
    + 生命周期函数
    + 事件处理函数
    + setData 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。
      + data数据变更时同步的：就是调用完成setData之后，可以直接在后面获取到最新值
      + 视图层更新是异步的：调用完成setData之后，页面有可能还没有更新，必须setData回调函数触发的时候才更新。
- 模块化js（CommonJS规范）
    - 模块成员导出 
        - module.expors 
        - exports
        - 组好两者不要结合使用
    - 模块成员导入 require()
- ES6的模块化
    - 导出export
    - 导入import





## 微信API详解
> 小程序开发框架提供丰富的微信原生 API，可以方便的调起微信提供的能力，如获取用户信息，本地存储，支付功能等。

- 根据api的名称大体可以分为如下三类
    + 事件监听 API
    + 同步 API 
    + 异步 API 
- 常用API
    + 加载提示
    + 调用后台接口

---





