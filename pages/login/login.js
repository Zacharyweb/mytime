var authApi = require("../../utils/data/auth.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  toLogin: function (res) {
    if (!res.detail.userInfo) {
      wx.showToast({ title: '登录失败，您已拒绝授权', icon: 'none' });
      return;
    }
    app.showLoading('登录中...');
    console.log(res.detail.userInfo);
    wx.navigateTo({
      url: '../home/home',
    })
  }
})