// components/upload-file/index.js
//获取应用实例
import {
  config
} from "../../config/config";
const app = getApp()
var upFiles = require('../../utils/upFiles.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showFlag: false, //textarea显示隐藏
    upFilesBtn: true, //上传按钮
    upFilesProgress: false, //上传进度
    maxUploadLen: 3, //文件最大上传数

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 预览图片
    previewImg: function (e) {
      let imgsrc = e.currentTarget.dataset.presrc;
      let _this = this;
      let arr = _this.data.upImgArr;
      let preArr = [];
      arr.map(function (v, i) {
        preArr.push(v.path)
      })
      wx.previewImage({
        current: imgsrc,
        urls: preArr
      })
    },
    // 删除上传图片 或者视频
    delFile: function (e) {
      let _this = this;
      wx.showModal({
        title: '提示',
        content: '您确认删除嘛？',
        success: function (res) {
          if (res.confirm) {
            let delNum = e.currentTarget.dataset.index;
            let delType = e.currentTarget.dataset.type;
            let upImgArr = _this.data.upImgArr;
            let upVideoArr = _this.data.upVideoArr;
            if (delType == 'image') {
              upImgArr.splice(delNum, 1)
              _this.setData({
                upImgArr: upImgArr,
              })
            } else if (delType == 'video') {
              upVideoArr.splice(delNum, 1)
              _this.setData({
                upVideoArr: upVideoArr,
              })
            }
            let upFilesArr = upFiles.getPathArr(_this);
            if (upFilesArr.length < _this.data.maxUploadLen) {
              _this.setData({
                upFilesBtn: true,
              })
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })


    },
    // 选择图片或者视频
    uploadFiles: function (e) {
      var _this = this;
      wx.showActionSheet({
        itemList: ['选择图片', '选择视频'],
        success: function (res) {
          let xindex = res.tapIndex;
          if (xindex == 0) {
            upFiles.chooseImage(_this, _this.data.maxUploadLen)
          } else if (xindex == 1) {
            upFiles.chooseVideo(_this, _this.data.maxUploadLen)
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    },
    // 上传文件
    subFormData(callback) {
      let _this = this;
      let upData = {};
      let upImgArr = _this.data.upImgArr;
      let upVideoArr = _this.data.upVideoArr;
      _this.setData({
        upFilesProgress: true,
      })
      let url = '/v1/work/order/file'
      upData['url'] = `${config.apiBaseUrl}${url}`
      //调用upFiles里的upFilesFun实现文件上传
      upFiles.upFilesFun(_this, upData, res => {
        if (res.index < upImgArr.length) {
          upImgArr[res.index]['progress'] = res.progress
          _this.setData({
            upImgArr: upImgArr,
          })
        } else {
          let i = res.index - upImgArr.length;
          upVideoArr[i]['progress'] = res.progress
          _this.setData({
            upVideoArr: upVideoArr,
          })
        }
        // console.log(res)   //小程序将图片二进制化并传入到后端接口的结果
      }, arr => {
        // success
        // console.log(arr.toString()) //上传成功的文件的id列表
        _this.setData({
          fileIdList: arr.toString()
        })
        callback(_this.data.fileIdList)
      })
    },
  }
})