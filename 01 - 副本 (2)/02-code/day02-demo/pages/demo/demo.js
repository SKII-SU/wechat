// pages/demo/demo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    info: 'hello',
    id: 123,
    stu: {
      uname: 'lisi',
      age: 12
    },
    flag: false,
    score: 99,
    isShow: true,
    list: ['apple', 'orange', 'lemo'],
    listData: [{
      id: 1,
      cname: '苹果',
      ename: 'apple'
    }, {
      id: 2,
      cname: '橘子',
      ename: 'orange'
    }],
    userData: {
      info: {
        uname: 'lisi',
        age: 12,
        gender: 'female'
      },
      list: [{
        uname: 'tom',
        age: 12
      }, {
        uname: 'jerry',
        age: 13
      }],
      list1: [{
        uname: 'kitty',
        age: 12
      }, {
        uname: 'jack',
        age: 13
      }]
    },
    userData1: {
      info: {
        uname: '张三',
        age: 13,
        gender: 'male'
      }
    }
    // nickname: app.globalData.userInfo.nickname
  },

  handleForm (e) {
    // console.log('submit');
    console.log(e.detail)
  },

  handleEventObjParent (event) {
    let target = event.target;
    let currentTarget = event.currentTarget;
    // target表示事件源对象
    console.log(target);
    // currentTarget表示当前触发事件的对象（有可能就是事件源，也有可能是通过冒泡触发的事件对象）
    console.log(currentTarget);

    // 获取数据源组件的自定义属性
    // 通过dataset可以得到所有的自定义属性值
    console.log(event.target.dataset);
  },

  handleEventObj (event) {
    // console.log(event)
    // let target = event.target;
    // let currentTarget = event.currentTarget;
    // console.log(target);
    // console.log(currentTarget);
  },

  handleParent () {
    console.log('parent');
  },

  handleChild () {
    console.log('child');
  },

  handleTap: function() {
    // console.log('click');
    // 获取数据要指定data
    // console.log(this.data.info);
    // 对于data中的数据不可以直接修改，必须通过setData方法进行修改
    // this.data.info = 'nihao';
    this.setData({
      info: 'nihao'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let gd = app.globalData.userInfo;
    console.log(gd);
    this.userInfo = gd;
    // this.setData({
    //   userInfo: gd
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})