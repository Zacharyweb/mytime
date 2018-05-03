Page({
  data: {
    summaryType: 0, // 0：按活动汇总 1：按备注汇总 
    isInSummaryStatus:false, // 是否展示汇总
    start:'',
    end:''
  },
  onLoad: function (options) {
    this.setData({
      start: options.start,
      end:options.end
    });
  },
  onShow: function () {

  },
  // 更换汇总状态
  changeSummaryType(e) {
    var index = e.currentTarget.dataset.idx;
    if (this.data.summaryType == index) {
      return;
    };
    this.setData({
      summaryType: index
    });
  },

  // 更换展示状态方式（明细跟汇总状态间切换）
  changeRankStatus() {
    this.setData({
      isInSummaryStatus: !this.data.isInSummaryStatus,
      summaryType:0
    });
  }
})