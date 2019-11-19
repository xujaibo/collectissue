//选择图片
var chooseImage = (t, count) => {
  wx.chooseImage({
    count: count,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      var imgArr = t.data.upImgArr || [];
      let arr = res.tempFiles;
      arr.map(function (v, i) {
        v['progress'] = 0;
        imgArr.push(v)
      })
      t.setData({
        upImgArr: imgArr
      })
      let upFilesArr = getPathArr(t);
      if (upFilesArr.length > count - 1) { //这里是判断上传文件数量
        let imgArr = t.data.upImgArr;
        let newimgArr = imgArr.slice(0, count)
        t.setData({
          upFilesBtn: false,
          upImgArr: newimgArr
        })
      }
    },
  });
}
//选择视频
var chooseVideo = (t, count) => {
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 30,
    compressed: true,
    camera: 'back',
    success: function (res) {
      let videoArr = t.data.upVideoArr || [];
      let videoInfo = {};
      videoInfo['tempFilePath'] = res.tempFilePath;
      videoInfo['size'] = res.size;
      videoInfo['height'] = res.height;
      videoInfo['width'] = res.width;
      videoInfo['thumbTempFilePath'] = res.thumbTempFilePath;
      videoInfo['progress'] = 0;
      videoArr.push(videoInfo)
      t.setData({
        upVideoArr: videoArr
      })
      let upFilesArr = getPathArr(t);
      if (upFilesArr.length > count - 1) {
        t.setData({
          upFilesBtn: false,
        })
      }
      // console.log(res)
    }
  })
}

// 获取 图片数组 和 视频数组 以及合并数组
var getPathArr = t => {
  let imgarr = t.data.upImgArr || [];
  let upVideoArr = t.data.upVideoArr || [];
  let imgPathArr = [];
  let videoPathArr = [];
  imgarr.map(function (v, i) {
    imgPathArr.push(v.path)
  })
  upVideoArr.map(function (v, i) {
    videoPathArr.push(v.tempFilePath)
  })
  let filesPathsArr = imgPathArr.concat(videoPathArr);
  return filesPathsArr;
}

/**
 * upFilesFun(this,object)
 * object:{
 *    url     ************   上传路径 (必传)
 *    filesPathsArr  ******  文件路径数组
 *    name           ******  wx.uploadFile name
 *    formData     ******    其他上传的参数
 *    startIndex     ******  开始上传位置 0
 *    successNumber  ******     成功个数
 *    failNumber     ******     失败个数
 *    completeNumber  ******    完成个数
 * }
 * progress:上传进度
 * success：上传完成之后
 */

var upFilesFun = (t, data, progress, success) => {
  //判断用户不传附件的情况
  if (getPathArr(t).length > 0) {
    wx.showLoading({
      title: '文件上传中...',
    })
    let _this = t;
    let url = data.url;
    let filesPath = data.filesPathsArr ? data.filesPathsArr : getPathArr(t);
    let startIndex = data.startIndex ? data.startIndex : 0;
    let successNumber = data.successNumber ? data.successNumber : 0;
    let failNumber = data.failNumber ? data.failNumber : 0;
    let index1 = filesPath[startIndex].lastIndexOf(".")
    let index2 = filesPath[startIndex].length
    //获取文件后缀名
    let FileType = filesPath[startIndex].substring(index1, index2)
    const uploadTask = wx.uploadFile({
      url: url,
      filePath: filesPath[startIndex],
      name: "orderFile",
      formData: {
        FileType: FileType
      },
      success: function (res) {
        var data = res.data
        successNumber++;

        // 把后台返回的文件id存到一个数组
        let uploaded = t.data.uploadedPathArr || [];
        var da = JSON.parse(res.data);
        // console.log(da)
        if (da.code === 200) {
          wx.hideLoading()
          // ### 此处可能需要修改 以获取图片路径
          uploaded.push(da.data)
          t.setData({
            uploadedPathArr: uploaded
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        failNumber++;
      },
      complete: function (res) {
        wx.hideLoading()
        if (startIndex == filesPath.length - 1) {
          let sucPathArr = t.data.uploadedPathArr;
          success(sucPathArr);
          t.setData({
            uploadedPathArr: []
          })
        } else {
          startIndex++;
          data.startIndex = startIndex;
          data.successNumber = successNumber;
          data.failNumber = failNumber;
          upFilesFun(t, data, progress, success);
        }
      }
    })
    uploadTask.onProgressUpdate((res) => {
      res['index'] = startIndex;
      // console.log(typeof (progress));
      if (typeof (progress) == 'function') {
        progress(res);
      }
      // console.log('上传进度', res.progress)
      // console.log('已经上传的数据长度', res.totalBytesSent)
      // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })
  }
  else{
    success([]);
    return;
  }
}
module.exports = {
  chooseImage,
  chooseVideo,
  upFilesFun,
  getPathArr
}