import { promisic } from "../utils/util";
import { Http } from "../utils/http";

export class User {

    static AUTH_ERROR_MSG = `授权码验证错误`

    /**
     * 获取code
     */
    static async wxLogin() {
        const res = await promisic(wx.login)()
        return res.code
    }
    /**
     * 获取openID
     * @param {login code} code 
     */
    static async fetchOpenId(code) {
        const res = await Http.request({
            url: "/v1/mina/basic/",
            data: { js_code: code }
        })
        return res.data
    }
    /**
     * 向服务端获取用户信息
     * @param {用户openid} openid 
     */
    static async fetchUserInfo(openid) {
        const res = await Http.request({
            url: `/v1/customer/user/${openid}`
        })
        return res.data
    }

    /**
     * 获取解密手机号
     * @param {加密数据} param0 
     */
    static async decryptPhoneNum({ iv, encryptedData }) {
        const res = await Http.request({
            url: `/v1/mina/basic/decrypt`,
            method: 'POST',
            data: {
                key: User.getSessionKey(),
                iv,
                encryptedData
            }
        })
        return JSON.parse(res.data).phoneNumber
    }

    /**
     * 判断当前是否有用户信息
     */
    static hasUserInfo() {
        const userInfoStr = wx.getStorageSync('userInfo')
        if (userInfoStr) {
            return true
        }
        return false
    }
    /**
     * 获取用户openid
     */
    static getOpenId() {
        if (!wx.getStorageSync('openid')) {
            return
        }
        return wx.getStorageSync('openid')
    }
    static setOpenId(openid) {
        wx.setStorageSync('openid', openid)
    }
    /**
     * 用户session_key
     */
    static getSessionKey() {
        if (!wx.getStorageSync('session_key')) {
            return
        }
        return wx.getStorageSync('session_key')
    }
    static setSessionKey(sessionKey) {
        wx.setStorageSync('session_key', sessionKey)
    }
    /**
     * 获取缓存中的用户信息
     */
    static getUserInfo() {
        if (!wx.getStorageSync('userInfo')) {
            return 
        }
        return JSON.parse(wx.getStorageSync('userInfo'))
    }
    static setUserInfo(userInfo) {
        wx.setStorageSync('userInfo', JSON.stringify(userInfo))
    }
    /**
     * 获取用户是否使用授权码状态
     */
    static getAuthStatus() {
        if (!wx.getStorageSync('auth_status')) {
            return false
        }
        return wx.getStorageSync('auth_status')
    }
    static setAuthStatus(status) {
        wx.setStorageSync('auth_status', status)
    }

    /**
     * 授权码绑定用户
     * @param {授权码} code 
     */
    static async bindUser(code) {
        const userInfo = User.getUserInfo()
        console.log(userInfo,'这是用户信息')
        const openid = User.getOpenId()
        const res = await Http.request({
            url: "/v1/customer/user/",
            data: {
                NickName: userInfo.nickName,
                Name: "",
                Phone: "",
                Address: userInfo.address,
                OpenId: openid,
                Code: code,
                IsAdmin: false
            },
            method: "POST"
        })
        return res.success
    }
}