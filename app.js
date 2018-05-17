//app.js
var app = getApp();
App({
  onLaunch: function () {
    
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
  globalData: {
    authUserInfo: false,
    OpenId: null,
    userInfo: null,
    gateway: "http://localhost:57809",
    lang: 'cn',
    loginUrl: "../login/login",
    loginRoute: "pages/login/login"
  }
})