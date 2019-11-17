// components/header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 表示该自定义组件有一个menu属性
    menu: {
      type: Array, // 约束组件属性的类型（Number;Boolean;String;Object;Array）
      value: ['头条', '娱乐', '经济']
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    start: '【',
    end: '】'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handle () {
      // console.log('click')
      // 触发事件时，修改data中数据
      this.setData({
        start: '<',
        end: '>'
      });
    }
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  }
})
