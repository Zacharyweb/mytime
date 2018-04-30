// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    summaryType: 0,
    searchPanelShow: false,
    rankStatus: 1,
    startDate:'',
    endDate: '',
    currenteSelectedDateType:-1,

    datePick1StartDate:'',
    datePick1EndDate: '',
    datePick2StartDate: '',
    datePick2EndDate: '',
  
  },
  onShow: function () {
    this.initDatePickerRange();
  },
  initDatePickerRange(){
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
    if (this.data.currentTab == index) {
      return;
    };
    this.setData({
      currentTab: index,
      summaryType: 0
    });
  },
  // 更换二级tab
  changeSummaryType(e) {
    var index = e.currentTarget.dataset.idx;
    if (this.data.summaryType == index) {
      return;
    };
    this.setData({
      summaryType: index
    });
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
      wx.showToast({ title: '请选择起始时间', icon: 'none' });
      return;
    };
    if (!this.data.endDate) {
      wx.showToast({ title: '请选择结束时间', icon: 'none' });
      return;
    };
    this.hideSearchPanel();
  },
  // 更换排序方式
  changeRankStatus() {
    var index = 0;
    if (this.data.rankStatus == 1){
      index=2;
    }else{
      index = 1;
    };
    this.setData({
      rankStatus: index
    });
  },
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
    if (!this.data.startDate){
      wx.showToast({ title: '请先选择起始时间', icon: 'none' });
      return;
    };
    this.setData({
      endDate: e.detail.value,
      currenteSelectedDateType: -1
    })
  },
  // 点击日期输入框
  bindDatePickerTap(e){
    var index = e.currentTarget.dataset.idx;
    this.setData({
      currenteSelectedDateType:index
    })
  },
  // 取消、关闭日期选择器
  bindDatePickerCancel(){
    this.setData({
      currenteSelectedDateType: -1
    })
  },
  // 清空选择的时间
  resetSelectedDate(){
    this.setData({
      startDate:'',
      endDate:''
    })
    this.initDatePickerRange();
  }
})