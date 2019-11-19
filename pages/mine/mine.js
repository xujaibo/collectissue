// pages/mine/mine.js
import {
  Work
} from "../../models/work"

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTitle: "我的_",
    active: 0,
    tabNameList: [ // tab标题
      {
        title: '待受理',
        level: 1
      },
      {
        title: '处理中',
        level: 2
      },
      {
        title: '待评价',
        level: 3
      },
      {
        title: '已评价',
        level: 4
      },
    ],
    feedbackList: [], //反馈列表
    tabIndex: 0,
    pageSize: 10,
    level: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getFeedbackList(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取反馈列表
   */
  async getFeedbackList(event) {
    wx.showLoading({
      title: '加载中...',
    })
    if (event === 1) { //判断页面一进来时候默认渲染待受理列表情况
      const pageSize = 10
      const feedbackList = await Work.getFeedbackList({
        level: event,
        pageSize
      })
      wx.hideLoading()
      for(let i in feedbackList){
        feedbackList[i].imgarry = []
        feedbackList[i].videoarry = []
        for(let j in feedbackList[i].Files){
          if (feedbackList[i].Files[j].FileType === '.mp4') {
            feedbackList[i].videoarry.push(feedbackList[i].Files[j].Url)
          }
          else {
            feedbackList[i].imgarry.push(feedbackList[i].Files[j].Url)
          }  
        }
      }
      this.setData({
        feedbackList: feedbackList,
        level: event,
        tabIndex: 0
      })
    } else {
      if (this.tabIndex !== event.detail.index) {
        this.setData({
          pageSize: 10
        })
      }
      const level = this.data.tabNameList[event.detail.index].level
      const pageSize = this.data.pageSize
      const feedbackList = await Work.getFeedbackList({
        level,
        pageSize
      })
      wx.hideLoading()
      for (let i in feedbackList) {
        feedbackList[i].imgarry = []
        feedbackList[i].videoarry = []
        for (let j in feedbackList[i].Files) {
          if (feedbackList[i].Files[j].FileType === '.mp4') {
            feedbackList[i].videoarry.push(feedbackList[i].Files[j].Url)
          }
          else {
            feedbackList[i].imgarry.push(feedbackList[i].Files[j].Url)
          }
        }
      }
      this.setData({
        feedbackList: feedbackList,
        level: level,
        tabIndex: event.detail.index
      })
    }

  },
  //去详情页面
  goDetail: function(event) {
    wx.navigateTo({
      url: `../issue-detail/issue-detail?id=${event.currentTarget.dataset.id}&level=${this.data.level}`,
    })
  },
  /**
   * 跳转至问题收集界面
   */
  toCollect() {
    wx.navigateTo({
      url: '../collect-problem/collect-problem'
    })
  },
  /**
   * 去评价界面
   */
  goEvaluate(event) {
    wx.navigateTo({
      url: `../rate/rate?id=${event.currentTarget.dataset.id}&level=${this.data.level}`
    })

  },
  // 页面上拉触底事件
  async onReachBottom() {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      pageSize: this.data.pageSize + 10
    })
    const level = this.data.level
    const pageSize = this.data.pageSize
    const feedbackList = await Work.getFeedbackList({
      level,
      pageSize
    })
    wx.hideLoading()
    for (let i in feedbackList) {
      feedbackList[i].imgarry = []
      feedbackList[i].videoarry = []
      for (let j in feedbackList[i].Files) {
        if (feedbackList[i].Files[j].FileType === '.mp4') {
          feedbackList[i].videoarry.push(feedbackList[i].Files[j].Url)
        }
        else {
          feedbackList[i].imgarry.push(feedbackList[i].Files[j].Url)
        }
      }
    }
    this.setData({
      feedbackList: feedbackList,
    })
  }
})