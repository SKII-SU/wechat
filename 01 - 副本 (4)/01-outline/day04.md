# 大纲

- setdata是同步加载的和异步加载
  - 数据的更新是同步的
  - 页面的更新是异步的（为了提高性能：尽量减少页面更新次数）
- wx:if、hidden、block

## 回顾

- 微信小程序开发
  - 页面布局
    - 模板语法
    - 样式处理
  - js交互逻辑
    - app.js
    - page.js
    - util
  - 微信API
    - 界面相关
    - 网络相关
    - 。。。
- wx.canIUse参数说明
  - `${API}.${method}.${param}.${options}`
    - wx.canIUse('request.object.method.GET')
  - `${component}.${attribute}.${option}`
    - wx.canIUse('button.open-type.getUserInfo')
    - wx.canIUse('text.selectable.false')
  - `${method}` 代表调用方式，有效值为return, success, object, callback
    - return 表示返回值，用于同步函数（以Sync结尾的函数）
    - success 表示对象参数中success回调函数
    - object 表示对象形式的参数
    - callback 表示参数为回调函数

- ES6模块化开发
  - 模块成员导出
    - module.exports  一般用于导出成员比较多的的场景
    - exports  一般用于导出成员比较少的场景
    - 两者不要结合使用
  - 模块成员导入
    - require
- 默认案例
  - 首页功能：默认显示按钮，点击按钮后弹出让用户授权，授权之后获取用户信息，然后隐藏按钮并且显示用户信息，点击头像时，跳转到日志页面
    - open-type="getUserInfo" 必须指定该值，点击按钮时才有授权弹窗
    - bindgetuserinfo="getUserInfo"  用户允许后，通过该属性指定的回调函数获取用户信息
  - 日志页面用于从本地缓存获取日期数据并进行遍历，遍历的数据项需要通过util中的格式化日期方法处理
    - CommonJS模块化导入和导出规则
  - 本地缓存操作：保存数据；获取数据
    - setStorageSync() 保存数据
    - getStorageSync() 获取数据
  - 用户信息的获取操作
    - onLaunch 小程序首次打开时获取用户授权信息
    - onLoad  首页加载时获取用户授权信息

## 颜值测试案例

- [腾讯AI](https://ai.qq.com/)

    + 技术引擎->人脸检测与分析
    + 测试接口 https://ai.qq.com/cgi-bin/appdemo_detectface

- 需求分析
  - 页面默认设置一个背景图片
  - 下面有一个按钮，点击后选中图片，选中图片后，上传到AI接口分析颜值
  - AI接口返回数据进行页面显示
  - 实现摄像头拍照功能
  - 实现分享功能

- 基本布局
  - 背景图片
  - 选择图片按钮
  - 结果显示框

- 选择图片（获取选中图片的路径即可）
  - 按钮绑定事件
  - 调用wx.chooseImage选择图片
    - 参数 sourceType（ 图片来源方式：本地相册，拍照）
      - ['album', 'camera']
    - 参数 success （选择图片的回调函数）
      - res.tempFiles[0].path  （选择图片的路径）

  ```
      wx.chooseImage({
        success: function(res) {
          // console.log(res)
          // 获取选中图片的路径
          let path = res.tempFiles[0].path;
          console.log(path);
        }
      });
  ```

  

- 上传文件到AI颜值测试接口
  - 调用wx.uploadFile上传文件
    - 参数 url （图片上传地址）
    - 参数 filePath （本地图片的路径）
    - 参数 name （提供给服务器的图片的获取名称）
    - 参数 success  （上传成功的回调函数）
      - result.data.face[0]  （表示服务器返回数据）

    ```
       wx.uploadFile({
          // 上传的地址（ai地址）
          url: 'https://ai.qq.com/cgi-bin/appdemo_detectface',
          // 要上传的文件的路径
          filePath: path,
          // 该name的值用于提供给服务器获取图片信息（服务器更加该名称获取图片）
          name: 'image_file',
          // 获取接口的返回结果数据
          success: function(res) {
            console.log(typeof res.data);
          }
        })
    ```

    

- 获取结果并更新页面

    ```
    // 把res.data字符串转化为json对象
    let obj = JSON.parse(res.data);
    let info = obj.data.face[0];
    // console.log(info);
    // 更新页面数据必须使用setData
    that.setData({
      gender: info.gender,
      age: info.age,
      beauty: info.beauty,
      glass: info.glass
    });
    ```

    

- 转发功能
  - onShareAppMessage
    - title 标题
    - path 当前页面路径
    - imgUrl 缩略图图片路径

```
  // 点击转发触发该函数，可以定制分享窗口的效果
  onShareAppMessage () {
    return {
      title: '颜值测试',
      path: '/pages/ai/index',
      imageUrl: '/assets/icon.jpg'
    }
  },
```



## 自定义组件

> 小程序提供了丰富的内置组件，但是也有一些业务相关的功能并不能通过单个的内置组件完成，此时，可以把一些通用的功能封装成自定义组件，方便重复使用。

- 创建自定义组件
  - 创建components目录，用于存放所有自定义组件
  - 创建Component页面
    - json文件中配置  

      - "component": true  将该页面声明为自定义组件

    - js文件中配置
      - properties 组件属性
        - 可以通过该属性定义组件的属性

      ```
       properties: {
          // 表示该自定义组件有一个menu属性
          menu: {
            type: Array, // 约束组件属性的类型（Number;Boolean;String;Object;Array）
            value: ['头条', '娱乐', '经济']
          }
        }
      ```

      - data 组件内部数据

      ```
        data: {
          start: '【',
          end: '】'
        },
      ```

      

      - methods 组件内部方法

      ```
        methods: {
          handle () {
            // console.log('click')
            // 触发事件时，修改data中数据
            this.setData({
              start: '<',
              end: '>'
            });
          }
        }
      ```

      

    - wxss 组件样式

    - wxml 组件模板

      - 组件插槽 <slot name="before"></slot>

      - 必须开启插槽功能

        ```
          // options属性与data平级
          options: {
            multipleSlots: true // 在组件定义时的选项中启用多slot支持
          },
        ```

        
  - 实现自定义组件功能

- 使用自定义组件

  - 在页面page.json文件中配置自定义组件名称和路径

    ```
    "usingComponents": {
       "my-header": "/components/header/index"
     }
    ```

  - 在页面中使用组件

    ```
    <my-header></my-header>
    ```

    ```
    // 使用组件时，可以给属性传递数据
    <my-header menu='{{[123,456,789]}}'></my-header>
    ```

    

## 微信尺寸单位rpx

> rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。

| 设备         | rpx换算px (屏幕宽度/750) | px换算rpx (750/屏幕宽度) |
| ------------ | ------------------------ | ------------------------ |
| iPhone5(320)      | 1rpx = 0.42px            | 1px = 2.34rpx            |
| iPhone6(375)      | 1rpx = 0.5px             | 1px = 2rpx               |
| iPhone6 Plus(414) | 1rpx = 0.552px           | 1px = 1.81rpx            |

> 使用的时候，根据rpx总宽度，就可以大体上清楚，rpx具体值所占据的屏幕宽度：比如表示屏幕的一半就是 375rpx


## wxs

> WXS 与 JavaScript 是不同的语言，有自己的语法，并不和 JavaScript 一致。

### wxs基本用法

- 在wxml模板页面可以直接使用wxs

```
<wxs module='m1'>
  // 代码注释
  var n = 123;
  var fn = function() {
    return 'hello';
  }
  // 导出成员
  module.exports = {
    n: n,
    fn: fn
  }
</wxs>
```

```
// 使用wxs模块导出的成员
<view>
  {{m1.n}}
</view>
<view>
  {{m1.fn()}}
</view>
```

### wxs独立文件用法

> 可以将wxs代码放到一个独立的文件中，比如：common.wxs
>
> 页面使用文件时，需要导入 <wxs src='./common.wxs' module='m2'></wxs>

```
var info = 'hello Kitty';
module.exports = {
  info: info
};
```

> common.wxs文件中可以导入别的wxs文件：比如info.wxs

```
var m3 = require('./info.wxs');
var info = 'hello Kitty';
module.exports = {
  info: info,
  m3info: m3.msg
};
```

### wxs使用注意事项

- 每个wxs模块的作用域是私有的
- 成员的导出通过module.exports，不可以直接通过exports导出
- 通过module属性给模块命名
- 使用的时候通过module属性的命名访问导出的成员
- wxs内容可以抽取到独立的文件中，
  - 然后在wxml模板文件中可以引入（wxs标签的src属性），
  - 也可以在wxs文件中引入别的wxs文件（require）


## 项目开发基础

- 项目开发流程
  - 全新的项目
  - 既有的项目
    - 已经上线，需要修改一些bug
    - 已经上线，需要做二期新的需求
    - 已经有的项目需要重构
  - 立项->需求分析->设计->开发->测试->上线->运维
- 项目团队组成
  - 项目经理
  - 产品经理->产品原型Axure->有交互效果的页面（不考虑美观；考虑业务）
  - UI/UE/UED->psd（重点考虑美观）
  - 前端：psd->静态页面（html/css/js）;负责前端代码层面业务开发和后退接口交互
  - 后端：主要提供接口URL（后端的话语权较大）
  - 测试
  - 运维
  - 架构师
  - DBA（大厂）
  - 全栈工程师
  - 移动端开发：IOS；Android
- 项目技术选型
  - 项目负责人负责选型：技术选型时根据项目业务类型来定的
  - 小程序技术选型：原生语法，小程序框架mpvue、wepy

## 小程序开发框架mpvue

> mpvue 是一个使用 Vue.js 开发小程序的前端框架。[【官网】](http://mpvue.com/)

- 主要特性
  - 完整的 `Vue.js` 开发体验
  - 快捷的 `webpack` 构建机制：自定义构建策略、开发阶段 hotReload
  - 支持使用 npm 外部依赖
  - 使用 `Vue.js` 命令行工具 vue-cli 快速初始化项目

### mpvue基本使用

- 安装Node.js(版本号大于v8.9.0)

- 安装vue脚手架
    + npm install --global vue-cli@2.9 
- 初始化项目（最后的项目名称自定义）
    + vue init mpvue/mpvue-quickstart my-project
- 安装依赖包（进入到项目的目录中进行）
    + npm install
- 运行项目
    + npm run dev
- 项目要导入到小程序开发工具中，但是代码通过vscode或者sublime进行开发

### 项目结构概述

- 项目整体结构
  - src 项目源代码
    - pages 小程序的页面
    - components 通用的一些组件
    - utils 中用来放置一些通用的工具方法
    - main.js是入口js文件
    - App.vue是入口的组件文件
    - app.json是全局配置文件
  - dist 项目源代码编译之后生成的小程序代码（其实真正可以运行的代码就是这里的代码）
  - static 提供一些静态资源：比如图片
  - build和config都是webpack配置文件
  - index.html 这是项目唯一的页面

## 项目实战

- 初始化项目
  - 基于mpvue初始化项目
- 配置项目菜单
  - 配置json文件中的菜单选项
- 首页布局
  - 搜索条
  - 轮播图

