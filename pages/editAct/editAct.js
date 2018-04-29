// pages/editAct/editAct.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  // 去选择图标
  toIconHouse(){
    wx.navigateTo({
      url: '../iconHouse/iconHouse'
    })
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