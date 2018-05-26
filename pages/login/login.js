var authApi = require("../../utils/data/auth.js");
var app = getApp();
Page({
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
    this.autoLogin();
  },
  toLogin: function (res) {
    if (!res.detail.userInfo) {
      wx.showToast({ title: '登录失败，您已拒绝授权', icon: 'none' });
      return;
    }
    this.login(res.detail.userInfo);
  },
  login: function (userInfo) {
    app.showLoading('登录中...');
    authApi.register().then(() => {
      var data = { ...userInfo, openid: app.globalData.OpenId };
      return authApi.login(data);
    }).then(res => {
      wx.hideLoading();
      app.setAuthtoken(res.result.accessToken);
      app.globalData.neddBackOnLogin ? app.goBack() : app.redirectTo('../home/home');
      app.globalData.neddBackOnLogin = true;
    });
  },
  autoLogin: function () {
    if (!app.globalData.autoLogin) return;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting["scope.userInfo"]) return;
        wx.getUserInfo({
          success: res => {
            this.login(res.userInfo);
          }
        })
      }
    })
  }
})