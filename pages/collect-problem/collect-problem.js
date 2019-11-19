import {
  User
} from "../../models/user"
import {
  Work
} from "../../models/work"

// pages/collect-problem/collect-problem.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // disabledFlag: true, //联系方式禁用状态
    textareaFlag: true,
    phoneFlag: true, //获取手机号按钮的状态
    feedbackName: '', //子组件传过来的反馈人姓名
    phoneNum: null, //联系方式
    projectName: '', //popup子组件传来的项目名称
    areaMessage: '', //子组件传过来的textarea内容
    arealength: 0, //textarea长度
    showFlag: false, //textarea显示隐藏
    fileIdList: "", //子组件传过来的文件id列表

    upFilesBtn: true, //上传按钮
    upFilesProgress: false, //上传进度
    maxUploadLen: 3, //上传文件最大个数

    columnsData: [],
    columnsObject: [],
    ProjectId: null, //所属项目的id

    popupShow: false, //所属项目弹窗
    headerData: {
      topTitle: "请输入",
      bottomTitle: "您要吐槽的具体问题"
    },
    placeholderData: '请输入您的问题（限200字）',
    nameData: '反馈人',
    telData: '联系方式',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const phoneNumber = Work.getPhoneNumber() //获取缓存的手机号
    const username = Work.getUserName() //获取缓存的用户名
    if (username) {
      this.setData({
        feedbackName: username,
      })
    }
    if (phoneNumber) {
      this.setData({
        phoneNum: phoneNumber,
        phoneFlag: false
      })
    }
    if (Object.keys(options).length > 0) { //判断是否为空对象
      this.setData({
        projectName: options.name,
        ProjectId: options.id
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    const openid = wx.getStorageSync('openid')
    const userInfo = await User.fetchUserInfo(openid) // 'o9MBK5HtpXv7jcknWnSbv5-OoCiE'
    const columnsData = userInfo.Projects
    let arr = []
    for (let i in columnsData) {
      arr.push(columnsData[i].Project_Name)
    }
    this.setData({
      columnsData: arr,
      columnsObject: columnsData
    })
  },

  async getPhoneNumber(e) {
    const status = e.detail.errMsg.split(':')[1]
    if (status !== 'ok') {
      return
    }
    const phoneNum = await User.decryptPhoneNum({
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    })
    this.setData({
      phoneNum
    })
    Work.setPhoneNumber(phoneNum) //存用户手机号
  },

  //input子组件传来的name值
  getName(e) {
    this.setData({
      feedbackName: e.detail.name
    })

  },
  //textarea子组件传来的值
  myInputEvent(e) {
    this.setData({
      arealength: e.detail.length,
      areaMessage: e.detail.content
    })
  },
  //popup子组件传来的值
  mySelectEvent: function(e) {
    console.log(e.detail.projectid)
    this.setData({
      textareaFlag: e.detail.flag,
      projectName: e.detail.projectName,
      ProjectId: e.detail.projectid //子组件传来的选中项目的project_Id
    })
  },
  /**
   * 跳转至我的界面
   */
  toCollect() {
    wx.navigateTo({
      url: '../mine/mine'
    })
  },
  /**
   * 子组件传值（上传的文件id列表）
   */
  getFileIdList(event) {
    this.setData({
      fileIdList: event.detail.fileIdList
    })
  },
  // 接收子组件中的返回值
  async subFormData() {
    if (this.data.projectName === '') {
      wx.showModal({
        title: "提示",
        content: '请选择所属项目',
      })
    }
    if (this.data.areaMessage === '') {
      wx.showModal({
        title: "提示",
        content: '请输入您想反馈的问题',
      })
    }
    if (this.data.phoneNum && this.data.projectName && this.data.areaMessage) {
      //这里是子组件方法的回调方法
      this.selectComponent("#submitFiles").subFormData(res => { 
        this.setData({
          fileIdList: res
        })
        this.subDataList()
      })

    }
  },
  /**
   * 提交问题（电话，所属项目id,问题内容，附件id集合，openid）
   */
  async subDataList() {
    wx.showLoading({
      title: '正在提交中...',
    })
    const feedbackName = this.data.feedbackName
    const phoneNum = this.data.phoneNum
    const projectName = this.data.projectName
    const areaMessage = this.data.areaMessage
    const fileIdList = this.data.fileIdList
    const ProjectId = this.data.ProjectId.toString()
    Work.setUserName(feedbackName) //存用户名
    const submitIssue = await Work.submitWork({
      Name: feedbackName,
      Phone: phoneNum,
      Content: areaMessage,
      FileIds: fileIdList,
      ProjectId: ProjectId
    })

    if (submitIssue.code === 200) {
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        duration: 2000,
        success: function() {
          setTimeout(function() {
            wx.redirectTo({
              url: '../mine/mine',
            })
          }, 1000)
        }
      })
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '提交失败',
      })
    }

  }

})