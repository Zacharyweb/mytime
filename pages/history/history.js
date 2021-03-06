var app = getApp();
var userApi = require("../../utils/data/user.js");
Page({
  data: {
    lang: app.globalData.lang,
    history: [],
    currentTab: 0,

    summaryType: 2, //2：按时间排序 0：按活动汇总 1：按备注汇总 
    summarySubType: 0, // 0：显示备注/显示活动 1：隐藏备注/隐藏活动


    // isInSummaryStatus: false, // 是否展示汇总


    // 搜索日期相关
    searchPanelShow: false,
    startDate: '',
    endDate: '',
    currenteSelectedDateType: -1,
    datePick1StartDate: '',
    datePick1EndDate: '',
    datePick2StartDate: '',
    datePick2EndDate: '',

    // 今日剩余倒计时
    countTimer: null,
    countH: '00',
    countM: '00',
    countS: '00',
    //进行中的活动
    countingAct: null,
    countTimer2: null,
    countH2: '--',
    countM2: '--',
    countS2: '--',

    pageMainColor: '#c5c3c6'
  },
  onShow: function () {
    var txt = this.data.lang == 'en' ? 'Time Spent' : '我的时间';
    wx.setNavigationBarTitle({
      title: txt
    });

    //this.count();
    this.initDatePickerRange();

    var _this = this;
    wx.getStorage({
      key: 'bgColor',
      success: function (res) {
        _this.setData({
          pageMainColor: res.data || '#c5c3c6'
        })
      }
    });
    this.showHistoryData();
  },
  showHistoryData() {
    return userApi.getPeopleActivityHistory({
      dateType: this.data.currentTab,
      orderBy: this.data.summaryType,
      totalType: this.data.summaryType != 2 ?
        this.data.summaryType == 0 && this.data.summarySubType == 1 ? 0 :
          this.data.summaryType == 1 && this.data.summarySubType == 1 ? 1 : 4
        : null
    }).then(res => {
      this.setData({
        history: res.result
      });
      this.findCountingAct(res.result);
    });
  },
  onHide: function () {
    wx.hideLoading();
    this.stopCount();
  },
  initDatePickerRange() {
    var date = new Date();
    var currentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.setData({
      datePick1EndDate: currentDate,
      datePick2EndDate: currentDate
    })
  },
  // 更换一级tab
  changeCurrentTab(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index,
      history: [],
      countingAct: null
    });
    this.showHistoryData();
  },
  // 更换二级tab
  changeSummaryType(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      summaryType: index,
      summarySubType: 0,
      history: []
    });
    this.showHistoryData();
  },
  // 更换三级tab
  changeSummarySubType(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      summarySubType: index,
      history: []
    });
    this.showHistoryData();
  },
  // 展示搜索面板
  showSearchPanel() {
    this.setData({
      searchPanelShow: true
    });
  },
  // 隐藏搜索面板
  hideSearchPanel() {
    this.setData({
      searchPanelShow: false
    });
  },
  // 提交搜索面板
  submitSearch() {
    if (!this.data.startDate) {
      var txt = this.data.lang == 'en' ? 'Please select the beginning' : '请选择起始时间';
      wx.showToast({ title: txt, icon: 'none' });
      return;
    };
    if (!this.data.endDate) {
      var txt = this.data.lang == 'en' ? 'Please select the end' : '请选择结束时间';
      wx.showToast({ title: txt, icon: 'none' });
      return;
    };
    this.hideSearchPanel();
    wx.showLoading({
      title: ''
    });
    setTimeout(() => {
      wx.navigateTo({
        url: '../searchResult/searchResult?start=' + this.data.startDate + '&end=' + this.data.endDate
      });
    }, 500);
  },
  // 更换展示状态方式（明细跟汇总状态间切换 不做了）
  // changeRankStatus() {
  //   this.setData({
  //     isInSummaryStatus: !this.data.isInSummaryStatus,
  //     summaryType: 0
  //   });
  // },
  // 绑定开始时间选择
  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value,
      datePick2StartDate: e.detail.value,
      currenteSelectedDateType: -1
    })
  },
  // 绑定结束时间选择
  bindEndDateChange: function (e) {
    if (!this.data.startDate) {
      var txt = this.data.lang == 'en' ? 'Please select the beginning' : '请选择起始时间';
      wx.showToast({ title: txt, icon: 'none' });
      return;
    };
    this.setData({
      endDate: e.detail.value,
      currenteSelectedDateType: -1
    })
  },
  // 点击日期输入框
  bindDatePickerTap(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      currenteSelectedDateType: index
    })
  },
  // 取消、关闭日期选择器
  bindDatePickerCancel() {
    this.setData({
      currenteSelectedDateType: -1
    })
  },
  // 清空选择的时间
  resetSelectedDate() {
    this.setData({
      startDate: '',
      endDate: ''
    })
    this.initDatePickerRange();
  },

  // 今日剩余倒计时
  // 加零函数
  addZero(n) {
    n = n * 1 < 10 ? '0' + n : n;
    return n + '';
  },

  // 计时转换函数
  countTime(count) {
    var h = Math.floor(count / 3600);
    var m = Math.floor((count % 3600) / 60);
    var s = count % 60;
    this.setData({
      countH: this.addZero(h),
      countM: this.addZero(m),
      countS: this.addZero(s)
    });
  },
  stopCount() {
    if (this.data.countTimer) clearInterval(this.data.countTimer);
    if (this.data.countTimer2) clearInterval(this.data.countTimer2);
  },
  // 计时函数
  count() {
    if (this.data.countTimer) clearInterval(this.data.countTimer);
    var nowDate = new Date();
    var nowTime = nowDate.getTime();
    var tomorrowDate = new Date(nowTime + 24 * 60 * 60 * 1000);
    var Y = tomorrowDate.getFullYear();
    var M = tomorrowDate.getMonth() + 1;
    var D = tomorrowDate.getDate();
    var todayEndTime = new Date(Y + '/' + M + '/' + D).getTime();

    var interval = Math.ceil((todayEndTime - nowTime) / 1000);

    var countTimer = null;
    countTimer = setInterval(() => {
      interval--;
      if (interval == -1) {
        clearInterval(this.countTimer);
      } else {
        this.countTime(interval);
      }
    }, 1000);

    this.setData({
      countTimer: countTimer
    });
  },


  findCountingAct(list) {
    var flag = -1;
    if (this.data.summaryType == 2)
      for (var i = 0; i < list.length; i++) {
        if (!list[i].endTime) {
          this.setData({
            countingAct: list[i]
          });
          flag = i;
          break;
        }
      };
    if (flag == -1) {
      clearInterval(this.data.countTimer2);
      this.setData({
        countTimer2: null,
        countingAct: null
      });
      return;
    }
    var interval = list[i].totalSeconds;
    if (this.data.countTimer2) clearInterval(this.data.countTimer2);
    var countTimer = null;
    countTimer = setInterval(() => {
      interval++;
      this.countTime2(interval);
    }, 1000);

    this.setData({
      countTimer2: countTimer
    });

  },

  // 计时转换函数
  countTime2(count) {
    var h = Math.floor(count / 3600);
    var m = Math.floor((count % 3600) / 60);
    var s = count % 60;
    this.setData({
      countH2: this.addZero(h),
      countM2: this.addZero(m),
      countS2: this.addZero(s)
    });
  },
})