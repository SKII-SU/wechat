// pages/ai/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImage: '/assets/bg.jpg',
    gender: '',
    age: '',
    beauty: '',
    glass: ''
  },
  // 点击转发触发该函数，可以定制分享窗口的效果
  onShareAppMessage () {
    return {
      title: '颜值测试',
      path: '/pages/ai/index',
      imageUrl: '/assets/icon.jpg'
    }
  },

  // 上传图片给ai接口做颜值检测
  detectImage (path) {
    // 缓存this
    let that = this;
    wx.uploadFile({
      // 上传的地址（ai地址）
      url: 'https://ai.qq.com/cgi-bin/appdemo_detectface',
      // 要上传的文件的路径
      filePath: path,
      // 该name的值用于提供给服务器获取图片信息（服务器更加该名称获取图片）
      name: 'image_file',
      // 获取接口的返回结果数据
      success: function(res) {
        // console.log(typeof res.data);
        // res表示调用ai接口后的响应结果
        // console.log(res)
        // 把ai接口返回的数据res.data字符串转化为json对象
        let obj = JSON.parse(res.data);
        // let info = obj.data.face[0] || {};
        let info = obj.data.face[0];
        if(!info) {
          // 如果后台没有返回有效数据，直接终止程序
          wx.showToast({
            title: '图片无效',
            icon: 'success',
            duration: 2000
          });
          return ;
        }
        // console.log(info);
        // 更新页面数据必须使用setData
        that.setData({
          gender: info? info.gender: '',
          age: info? info.age: '',
          beauty: info? info.beauty: '',
          glass: info? info.glass: ''
        });
      }
    })
  },

  // 选择图片
  selectImage () {
    // 缓存this
    let that = this;
    // console.log('image');
    // 选择图片
    wx.chooseImage({
      // sourceType的作用：控制可以从本地相册或者摄像头获取图片
      sourceType: ['album', 'camera'],
      success: function(res) {
        // console.log(res)
        let path = res.tempFiles[0].path;
        // console.log(path);
        // 这里的this指向不对
        that.detectImage(path);
        // 更新背景图片
        that.setData({
          bgImage: path
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
  
})