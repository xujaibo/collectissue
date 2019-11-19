import {
  promisic
} from "../utils/util";
import {
  Http
} from "../utils/http";
import {
  User
} from "/user"

export class Work {
  /**
   * 提交工单
   * @param  
   */
  static async submitWork({
    Name,
    Phone,
    Content,
    FileIds,
    ProjectId
  }) {
    const userInfo = User.getUserInfo()
    const openid = User.getOpenId()
    const res = await Http.request({
      url: "/v1/work/order/",
      data: {
        Name,
        Phone,
        Content,
        OpenId: openid,
        ProjectId,
        FileIds
      },
      method: "POST"
    })
    return res
  }
  /**
   * 获取反馈列表
   * @param  {用户openid,页数，每页数量}openid,ps,pageSize
   */
  static async getFeedbackList({
    level,
    pageSize
  }) {
    const openid = User.getOpenId()
    const ps = 1
    const res = await Http.request({
      url: `/v1/work/order/list/${openid}?ps=${ps}&pageSize=${pageSize}&level=${level}`,
    })
    return res.data
  }

  /**
   * 获取反馈列表详情
   * @param  {id}每一项对应得id
   */
  static async getListDetail(id) {
    const res = await Http.request({
      url: `/v1/work/order/${id}`,
    })
    return res.data
  }
  /**
   * 评价
   * @param {id} 每一项对应的id
   */
  static async goEvaluate({
    id,
    Grade,
    Content,
    ResponseSpeedGrade,
    ServiceAttitudeGrade,
    ResultGrade
  }) {
    const res = await Http.request({
      url: `/v1/work/evaluate/${id}`,
      data: {
        Grade,
        Content,
        ResponseSpeedGrade,
        ServiceAttitudeGrade,
        ResultGrade
      },
      method: "POST"
    })
    return res
  }
  /**
   * 获取评价详情
   * @param  {id}每一项对应得id
   */
  static async getEvaluateDetail(id) {
    const res = await Http.request({
      url: `/v1/work/evaluate/${id}`,
    })
    return res.data
    console.log(res.data)
  }
  /**
   * 存用户的姓名
   * 
   */
  static setUserName(username) {
    wx.setStorageSync('username', username)
  }
  /**
   * 获取用户的姓名
   */
  static getUserName() {
    if (!wx.getStorageSync('username')) {
      return
    }
    return wx.getStorageSync('username')
  }
  /**
 * 存用户的手机号
 * 
 */
  static setPhoneNumber(phoneNumber) {
    wx.setStorageSync('phoneNumber', phoneNumber)
  }
  /**
   * 获取用户的手机号
   */
  static getPhoneNumber() {
    if (!wx.getStorageSync('phoneNumber')) {
      return
    }
    return wx.getStorageSync('phoneNumber')
  }
}