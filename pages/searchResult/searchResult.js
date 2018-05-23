var app = getApp();
var userApi = require("../../utils/data/user.js");
Page({
  data: {
    lang: app.globalData.lang,
    summaryType: 2, // 0：按活动汇总 1：按备注汇总 2：按时间排序
    summarySubType: 0, // 0：显示备注/显示活动 1：隐藏备注/隐藏活动

    start: '',
    end: '',
    pageMainColor: '#c5c3c6'
  },
  onLoad: function (options) {
    this.setData({
      start: options.start,
      end: options.end
    });
    wx.getStorage({
      key: 'bgColor',
      success: res => {
        this.setData({
          pageMainColor: res.data || '#c5c3c6'
        })
      }
    });
    userApi.getPeopleActivityHistory({ beginDate: this.data.start, endDate: this.data.end }).then(res => {
      this.setData({
        history: res.result
      })
    });
  },
  onShow: function () {
    var txt = this.data.lang == 'en' ? 'Search Result' : '搜索结果';
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
  // 更换汇总状态
  changeSummaryType(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      summaryType: index
    });
  },

  // 更换显示/隐藏 备注/活动
  changeSummarySubType(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      summarySubType: index
    });
  }
})