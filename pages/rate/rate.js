// pages/rate/rate.js
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
    headerData: {
      topTitle: "我的评价",
      bottomTitle: ""
    },
    placeholderData: '请输入您的评价（限200字）',
    level: null, //状态
    id: null, //评价的project的id
    Grade: 5,
    Content: "",
    ResponseSpeedGrade: 5,
    ServiceAttitudeGrade: 5,
    ResultGrade: 5,
    starFlag: false,
    speedFlag: false,
    serviceFlag: false,
    resultFlag: false,
    textareaFlag: false, //输入框禁用状态
  },
  async onLoad(options) {
    console.log(options)
    this.setData({
      level: options.level,
      id: options.id
    })
    if (options.level === "4") {
      const evaluateDetail = await Work.getEvaluateDetail(options.id)
      this.setData({
        starFlag: true,
        speedFlag: true,
        serviceFlag: true,
        resultFlag: true,
        textareaFlag: true,
        Grade: evaluateDetail.Grade,
        Content: evaluateDetail.Content === '' ? '暂无评价' : evaluateDetail.Content,
        ResponseSpeedGrade: evaluateDetail.ResponseSpeedGrade,
        ServiceAttitudeGrade: evaluateDetail.ServiceAttitudeGrade,
        ResultGrade: evaluateDetail.ResultGrade
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
   * 监听评价组件参数变化
   */
  handleStarChange(e) {
    this.setData({
      Grade: e.detail.value
    })

  },
  //响应速度
  handleSpeedChange(e) {
    this.setData({
      ResponseSpeedGrade: e.detail.value
    })
  },
  //服务态度
  handleServiceChange(e) {
    this.setData({
      ServiceAttitudeGrade: e.detail.value
    })
  },
  //处理结果
  handleResultChange(e) {
    this.setData({
      ResultGrade: e.detail.value
    })
  },
  //textarea子组件传来的值
  myInputEvent(e) {
    this.setData({
      Content: e.detail.content
    })
  },

  /**
   * 发表评价
   */
  async submitRate() {
    const submitRateResult = await Work.goEvaluate({
      id: this.data.id,
      Grade: this.data.Grade,
      Content: this.data.Content,
      ResponseSpeedGrade: this.data.ResponseSpeedGrade,
      ServiceAttitudeGrade: this.data.ServiceAttitudeGrade,
      ResultGrade: this.data.ResultGrade,
    })
    console.log(submitRateResult, typeof(submitRateResult))
    if (submitRateResult.code === 200) {
      wx.hideLoading()
      wx.showToast({
        title: '评价成功',
        duration: 2000,
        success: function () {
          wx.redirectTo({
            url: `../mine/mine?level=4`,
          })
        }
      })
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '评价失败',
      })
    }
  }
})