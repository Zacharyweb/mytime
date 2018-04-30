// pages/editAct/editAct.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    actId:''
  },
  onLoad: function (options) {
    this.setData({
      actId: options.actId
    });
  },
  onShow: function () {
    this.getInitData(this.data.actId);
  },
  

  // 去选择图标
  toIconHouse(){
    wx.navigateTo({
      url: '../iconHouse/iconHouse?actId=' + this.data.actId
    })
  },
  // 获取数据
  getInitData(actId){
    console.log(actId);
  },
  // 去编辑活动名称
  toEditActName(){
    wx.navigateTo({
      url: '../editActName/editActName'
    })
  },
  // 提交活动
  submitEditAct(){
    console.log('提交');
  }
})