// components/view-popup.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    projectName: {
      type: String,
      value: ""
    },
    columnsData: {
      type: Array,
      value: [] 
    },
    popupShow: {
      type: Boolean,
      value: app.globalData.popupStatus
    },
    columnsObject:Array

  },
  //监听数据变化
  observers: {
    'projectName': function (value) {
      if (value) {
        this.setData({
          boderClass: 'no-border',
          titleClass: 'change-title',
          lineClass: 'hov',
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    boderClass: '',
    titleClass: '',
    lineClass: '',
    projectid:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus() {
      this.setData({
        popupShow: true
      })
      this.triggerEvent('selectevent', { flag: !this.data.popupShow });  //根据弹窗状态控制父组件view的显示隐藏
    },

    onConfirm(event) {
      console.log(event)
      const obj = this.data.columnsObject
      for (let i in obj){
        if (event.detail.value === obj[i].Project_Name){
          this.setData({
            projectid: obj[i].Project_Id,
          })
        }
      }
      this.setData({
        popupShow: false,
        projectName: event.detail.value,
        boderClass: 'no-border',
        titleClass: 'change-title',
        lineClass: 'hov',
      })
      this.triggerEvent('selectevent', { flag: !this.data.popupShow, projectName: event.detail.value, projectid: this.data.projectid });
    },

    onCancel() {
      this.setData({
        popupShow: false
      })
      this.triggerEvent('selectevent', { flag: !this.data.popupShow });
    }

  }
})
