import {
  User
} from "../../models/user"

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: true
  },
  async onReady() {
    //判断用户是否使用过授权码（true:已授权）
    const authStatus = User.getAuthStatus() 
    if (!authStatus) {
      User.setAuthStatus(false)
    }
    const code = await User.wxLogin()
    const openIdKey = await User.fetchOpenId(code)
    //存用户的openid
    User.setOpenId(openIdKey.openid) 
    //存session_key
    User.setSessionKey(openIdKey.session_key) 
    // // 用于是否展示授权登录按钮  (这里用户获取过信息之后，就会一直显示加载中)
    const hasUserInfo = User.hasUserInfo()
    this.setData({
      hasUserInfo
    })
    //openid获得用户信息
    const userInfo = await User.fetchUserInfo(openIdKey.openid) 
    console.log(userInfo, 'openid获取的用户信息')

    if (!User.getAuthStatus() && this.data.hasUserInfo) {
      wx.redirectTo({
        url: '../authorization/authorization'
      })

    } else if (User.getAuthStatus() && this.data.hasUserInfo) {
      wx.redirectTo({
        url: '../select-project/select-project',
      })
    }
  },
  bindGetUserInfo(e) {
    const res = e.detail.userInfo
    let userInfo = {}
    const nickName = res.nickName
    const address = `${res.country} ${res.province} ${res.city}`
    userInfo = {
      nickName,
      address
    }
    User.setUserInfo(userInfo)
    wx.redirectTo({
      url: '../authorization/authorization'
    })
  }
})