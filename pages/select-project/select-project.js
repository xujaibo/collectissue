// pages/select-project/select-project.js
import {
  User
} from "../../models/user"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {
      "Area": {
        "Id": 2,
        "Name": "湖南"
      },
      "Code": "7841",
      "Id": 2,
      "Name": "便民服务"
    },
    headerData: {
      topTitle: "请选择",
      bottomTitle: "您要吐槽的项目名称"
    },
    projectName: "",
    projectId: null,
    projectList: [],
    selectIndex: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const openid = wx.getStorageSync('openid')
    const userInfo = await User.fetchUserInfo(openid) 
    this.setData({
      projectList: userInfo.Projects
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  /**
   * 选择项目事件
   * @param {*} event 
   */
  selectProject(event) {
    const index = event.currentTarget.dataset.index
    this.setData({
      selectIndex: index,
      projectName: event.target.dataset.name,
      projectId: event.target.dataset.id
    })
  },
  /**
   * 确定项目
   */
  submitProject: function() {
    const name = this.data.projectName
    const id = this.data.projectId
    if (name && id) {
      wx.navigateTo({
        url: `../collect-problem/collect-problem?name=${name}&id=${id}`
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请选择一个您要吐槽的项目',
        showCancel: false
      })
    }
  },
  /**
   * 重新调整输入验证码页面
   */
  goOther(){
    wx.redirectTo({
      url: `../authorization/authorization?status=other`,
    })

  }
})