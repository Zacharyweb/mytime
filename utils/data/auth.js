var api = require("../restapi.js");
var app = getApp();

module.exports = {
  register: function () {
    if (app.getAuthtoken()) return Promise.resolve();;

    wx.getSetting({
      success: function (res) {
        app.globalData.authUserInfo = res.authSetting["scope.userInfo"];
      }
    })
    return new Promise((resolve, reject) => {
      if (app.globalData.userInfo) {
        resolve(app.globalData.userInfo)
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
      if (!res.openid) {
        app.showToast("登录失败");
        return;
      }
      console.log(res.openid);
      app.globalData.OpenId = res.openid;
      return api.post("/api/TokenAuth/Register", null, { openid: res.openid });
    });
  },
  login: function (data) {
    return api.post("/api/TokenAuth/Authenticate", null, data);
  }
}