// components/scroll-textarea/scroll-textarea.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholderData:String, //placeholder初始值
    hidden:Boolean,  //根据下拉弹窗是否打开控制此组件显示隐藏
    disabled:Boolean,  //父组件传来的输入框禁用状态
    content: String   //父组件传来的输入框的值
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handleTap: function (e) {
      this.setData({
        content: e.detail,
      })
      const countLength=e.detail.length
      this.triggerEvent('inputevent', { length: countLength,content:e.detail}, e);
    }
  }
})
