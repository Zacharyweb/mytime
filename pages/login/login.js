var authApi = require("../../utils/data/auth.js");
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lang: app.globalData.lang,
    pageMainColor: '#c5c3c6',
  },
  onShow: function () {
    var txt = this.data.lang == 'en' ? 'Login' : '登录';
    wx.setNavigationBarTitle({
      title: txt
    });

    var _this = this;
    wx.getStorage({
      key: 'bgColor',
      success: function (res) {
        _this.setData({
          pageMainColor: res.data || '#c5c3c6'
        })
      }
    });
  },
  toLogin: function (res) {
    if (!res.detail.userInfo) {
      wx.showToast({ title: '登录失败，您已拒绝授权', icon: 'none' });
      return;
    }
    app.showLoading('登录中...');
    var data = { ...res.detail.userInfo, openid: app.globalData.OpenId }
    authApi.login(data).then(res => {
      console.log(res);
      app.setAuthtoken(res.result.accessToken);
      wx.navigateBack({
        delta: 1
      })
    })
  }
})