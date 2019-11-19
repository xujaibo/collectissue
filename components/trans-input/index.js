// components/trans-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    nameData:String,
    phoneData:String,
    disabledData:Boolean,
    feedbackName:String
  },
  //监听数据变化
  observers: {
    'phoneData': function (value) {
      if(value){
        this.handleFocus()
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    boderClass: '',
    titleClass: '',
    lineClass: '',
    inputValue: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus() {
      this.setData({
        boderClass: 'no-border',
        titleClass: 'change-title',
        lineClass: 'hov'
      })
    },
    handleBlur() {
      if (!this.data.phoneData) {
        this.setData({
          boderClass: '',
          titleClass: 'title-back',
          lineClass: 'nor'
        })
      }
    },

    bindKeyInput: function (e) {
      this.setData({
        phoneData: e.detail.value
      })
      this.triggerEvent('nameInputevent', { name: e.detail.value });
    },

  }
})
