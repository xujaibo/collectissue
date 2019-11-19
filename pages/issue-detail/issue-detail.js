// pages/issue-detail/issue-detail.js
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
    loadingFlag:true,//loading状态
    issueId: '', //反馈问题的id
    Project: '',
    Content: '',
    imgarry: [],
    videoarry: [],
    Created: '',
    Result: '',
    logs: [],
    topTitle: "问题详情",
    active: 2,
    level: null,
    // steps: [
    //   {
    //     text: '2019-10-22 13:43:33',
    //     desc: '已申请',
    //   },
    //   {
    //     text: '2019-10-22 13:43:33',
    //     desc: '处理中'
    //   },
    //   {
    //     text: '2019-10-22 13:43:33',
    //     desc: '完成'
    //   },
    //   {
    //     text: '2019-10-22 13:43:33',
    //     desc: '评价',
    //   }
    // ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      issueId: options.id,
      level: options.level
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.fetchListDetail(this.data.issueId)
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
   * 获取列表详情信息
   */
  async fetchListDetail(id) {
    const listDetail = await Work.getListDetail(id)
    console.log(listDetail)
    listDetail.imgarry = []
    listDetail.videoarry = []
    for (let i in listDetail.Files) {
      if (listDetail.Files[i].FileType === '.mp4') {
        listDetail.videoarry.push(listDetail.Files[i].Url)
      } else {
        listDetail.imgarry.push(listDetail.Files[i].Url)
      }
    }
    const Project = listDetail.Project
    const Content = listDetail.Content
    const Files = listDetail.Files
    const videoarry = listDetail.videoarry
    const imgarry = listDetail.imgarry
    const Created = listDetail.Created
    const Result = listDetail.Result
    const logs = listDetail.logs
    for (let i = 0; i < logs.length; i++) {
      // console.log(logs[i].Created)
      // console.log(logs[i].Level) 
      logs[i].desc = logs[i].Created
      logs[i].memo = logs[i].Memo
      if (logs[i].Level === 0) {
        logs[i].text = '申请'
      }
      if (logs[i].Level === 1) {
        logs[i].text = '处理中'
      }
      if (logs[i].Level === 10) {
        logs[i].text = '完成'
      }
      if (logs[i].Level === 11) {
        logs[i].text = '评价'
      }
    }
    if (Files !== null) { //没有图片的情况，不加判断会报错
      for (let p = 0; p < imgarry.length; p++) {
        imgarry[p] = app.globalData.apiBaseUrl + imgarry[p]
      }
      for (let q = 0; q < videoarry.length; q++) {
        videoarry[q] = app.globalData.apiBaseUrl + videoarry[q]
      }
    }
    const active = logs.length - 1
    this.setData({
      loadingFlag:false,
      Project: Project,
      Content: Content,
      videoarry: videoarry,
      imgarry: imgarry,
      Created: Created,
      Result: Result,
      logs: logs,
      active: active
    })
  },
  /**
   * 图片放大预览
   */
  previewImg: function(e) {
    console.log(e)
    let that = this
    var index = e.currentTarget.dataset.index;
    var imgarry = this.data.imgarry;
    wx.previewImage({
      current: imgarry[index], //当前图片地址
      urls: imgarry, //所有要预览的图片的地址集合 数组形式
    })
  },
  /**
   * 去评价
   */
  goEvaluate() {
    wx.navigateTo({
      url: `../rate/rate?level=${this.data.level}&id=${this.data.issueId}`,
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
   * 获取评价
   */
  checkEvaluate() {
    wx.navigateTo({
      url: `../rate/rate?level=${this.data.level}&id=${this.data.issueId}`,
    })
  }
})