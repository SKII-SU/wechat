// pages/demo/demo.js
const app = getApp();
const common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: 'hello'
  },

  calculate () {
    common.add(1, 2);
    let ret = common.sum(100);
    this.setData({
      msg: ret
    });
  },

  handle () {
    // 更新data中的数据
    this.setData({
      msg: 'nihao'
    }, () => {
      // 这个函数触发的时候，表明页面已经发生变化
      console.log('finished');
    });
    // setData数据的变更时同步的
    // 但是页面的更新是异步
    // console.log(this.data.msg);

    // React
    // this.setState({
    //   msg: '123'
    // }, () => {
    //   console.log(msg)
    // });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const foo = app.foo;
    let ret = foo();
    console.log(ret);
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