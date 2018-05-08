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
  globalData: {
    userInfo: null,
    gateway: "https://mytime.yuelinshe.com/",
    lang: 'cn'
  }
})