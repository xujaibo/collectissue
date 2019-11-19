import { User } from "../../models/user"


// pages/authorization/authorization.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      loadingFlag:true,
        headerData: {
            topTitle: "欢迎来到",
            bottomTitle: "问题反馈收集小程序"
        },
        password: '',
        termsChecked: true
    },
  onReady() {
  
  },
  async onLoad(options){
    //判断是否为空对象（是否是点其他回到输入授权码的页面）
    if (Object.keys(options).length > 0) {
      console.log("options有值")
       this.setData({
         loadingFlag: false
       })
    }
    else{
      console.log("options无值")
      //判断用户是否使用过授权码（true:已授权）
      const authStatus = User.getAuthStatus()
      if (!authStatus) {
        User.setAuthStatus(false)
      }
      const hasUserInfo = User.hasUserInfo()
      if (hasUserInfo && User.getAuthStatus()) {
        console.log("这里的auth和userinfo都为true")
        wx.redirectTo({
          url: '../select-project/select-project',
        })
      }
      else {
        console.log("这里的auth和userinfo不都为true")
        this.setData({
          loadingFlag: false
        })
      }
    }
  },
    onShow() {
        this.passwordBox = this.selectComponent('#passwordBox') // 获取密码框组件，用来操作组件内部的方法
    },
    onChange() {
        this.setData({
            termsChecked: !this.data.termsChecked
        })
    },
    // 设置密码
    setupPasswordComplete(event) {
        this.setData({ password: event.detail })
    },
    // 清除密码
    clearPassword() {
        this.passwordBox.clearCurrentValue() // 调用组件内部的清除方法，清空输入的值
    },
    async next() {
      const hasUserInfo = User.hasUserInfo()
      if (hasUserInfo){
        const bindStatus = await User.bindUser(this.data.password)
        if (!bindStatus) {
          wx.showToast({
            icon: 'none',
            title: User.AUTH_ERROR_MSG
          })
          return
        }
        User.setAuthStatus(true)
        wx.redirectTo({
          url: '../select-project/select-project',
        })
      }
      else{
        wx.showModal({
          title: '提示',
          content: '问题收集小程序需要获取您的个人信息，以便为您提供更好的服务',
          success(res){
            if (res.confirm) {
              wx.navigateTo({
                url: '../index/index',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
})