//app.js
var app = getApp();
App({
  onLaunch: function () {
    this.getUserLang();
  },
  getAuthtoken: function () {
    var token = wx.getStorageSync('token') || '';
    return token;
  },
  setAuthtoken: function (token) {
    wx.setStorageSync('token', token);
  },
  setUser: function (user) {
    this.globalData.userInfo.avatarUrl = user.img;
    this.globalData.userInfo.nickName = user.nickname;
    wx.setStorageSync('user', user);
  },
  getUser: function () {
    var user = wx.getStorageSync('user') || {};
    return user;
  },
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: "none"
    })
  },
  showLoading: function (title = "加载中...") {
    wx.showLoading({
      title: title,
    });
  },
  getUserLang: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.language == 'zh_CN') {
          _this.globalData.lang = 'cn';
        }
        if (res.language == 'en') {
          _this.globalData.lang = 'en';
        }
      }
    })
  },
  goBack: function (delta = 1) {
    wx.navigateBack({
      delta: delta || 1
    })
  },
  redirectTo: function (url) {
    wx.redirectTo({
      url: url
    })
  },
  globalData: {
    event: { initHome: () => { } },
    authUserInfo: false,
    OpenId: null,
    userInfo: null,
    gateway: "https://mytime.yuelinshe.com",
    lang: 'cn',
    loginUrl: "../login/login",
    loginRoute: "pages/login/login",
    neddBackOnLogin: false,
    autoLogin: true
  }
})