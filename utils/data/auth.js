var api = require("../restapi.js");
var app = getApp();

module.exports = {
  validation: function () {
    console.log("登录验证");
    var token = app.getAuthtoken();
    if (!token) {
      console.log("未登录");
    }
  },
  getUserInfo: function () {
    var that = app;
    wx.getSetting({
      success: function (obj) {
        if (!obj.authSetting["scope.userInfo"]) {
          app.showToast('未授权');
          return;
        }
        app.showToast("已授权");
      }
    })
    return new Promise((resolve, reject) => {
      if (that.globalData.userInfo) {
        resolve(that.globalData.userInfo)
      } else {
        console.log("call:getUserInfo");
        //调用登录接口
        wx.login({
          success: function (res) {
            resolve(res);
            console.log(res);
          },
          fail: function (res) {
            reject(res);
            console.log(res);
          }
        })
      }
    }).then(function (res) {
      return api.get("/api/services/app/ExpertWechat/GetToken", { code: res.code });
    }).then(function (res) {
      console.log(res.data);
      wx.navigateTo({
        // url: '../login/login'
      })
    });
  },
  login: function (data) {
    return api.post("/api/user/bindingwechat", null, data);
  },
  sendCode: function (phone, code) {
    return api.get("/api/user/sendTsCode", { phone: phone, code: code });
  },
  logout: function () {
    app.setAuthtoken(null);
  },
  userinfo: function () {
    return api.get("/api/user/userinfo");
  }
}