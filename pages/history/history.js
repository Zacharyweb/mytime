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
    endDate: ''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
    console.log(this.data.startDate, this.data.endDate);
    this.hideSearchPanel();
  },
  // 更换排序方式
  changeRankStatus(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      rankStatus: index
    });
  },

  // bindStartDate1Input(e) {
  //   this.setData({
  //     startDate: e.detail.value
  //   })
  // },

  // bindEndDateInput(e) {
  //   this.setData({
  //     endDate: e.detail.value
  //   })
  // },
  // 绑定开始时间选择
  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  // 绑定结束时间选择
  bindEndDateChange: function (e) {

    this.setData({
      endDate: e.detail.value
    })
  },
})