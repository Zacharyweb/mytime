// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actList: [
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2' }
    ],

    countTarget: -1,
    countTimer: null,
    countH: '00',
    countM: '00',
    countS: '00',

    isInEditing: false,
    
    remarkPanelShow: false,
    editRemarkPanelShow: false,
    editRemarkNamePanelShow: false
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
  // 去历史记录页面
  toHistoryPage(){
    wx.navigateTo({
      url: '../history/history'
    })
  },
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
  // 计时函数
  count() {
    var interval = 0;
    var countTimer = null;
    this.setData({
      countH: '00',
      countM: '00',
      countS: '00',
    });

    countTimer = setInterval(() => {
      interval++;
      this.countTime(interval);
    }, 1000);

    this.setData({
      countTimer: countTimer
    });
  },

  // 开始/更换活动
  changeCountTarget(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      remarkPanelShow: false
    });
    if (this.data.isInEditing) {
      this.selectAct(index);
    } else {
      clearInterval(this.data.countTimer);
      if (this.data.countTarget == index) {
        this.setData({
          countTarget: -1
        });
        return;
      };
      this.setData({
        countTarget: index
      });
      this.count();
    }
  },
  // 暂停活动
  endCountTarget(index) {
    clearInterval(this.data.countTimer);
    this.setData({
      countTarget: -1
    });
  },
  // 去新增活动
  addNewAct() {
    wx.navigateTo({
      url: '../iconHouse/iconHouse'
    })
  },

  // 进入编辑活动状态
  editAct() {
    this.setData({
      remarkPanelShow: false,
      isInEditing: !this.data.isInEditing
    });
  },
  // 选择要编辑的活动
  selectAct(index) {
    wx.navigateTo({
      url: '../editAct/editAct'
    })
  },
  // 展示活动项上的备注
  showRemarkPanel() {
    if (this.data.remarkPanelShow) {
      return;
    }
    this.setData({
      remarkPanelShow: true
    });
  },
  // 隐藏活动项上的备注
  hideRemarkPanel() {
    this.setData({
      remarkPanelShow: false
    });
  },
  // 展示修改备注的面板
  showEditRemarkPanel() {
    this.setData({
      editRemarkPanelShow: true
    });
  },
  // 隐藏修改备注的面板
  hideEditRemarkPanel() {
    this.setData({
      editRemarkPanelShow: false
    });
  },
  // 提交修改的备注
  submitActRemark() {
    this.hideEditRemarkPanel();
  },
  // 展示修改备注名称的面板
  showEditRemarkNamePanel() {
    this.setData({
      editRemarkNamePanelShow: true
    });
  },
  // 隐藏修改备注名称的面板
  hideEditRemarkNamePanel() {
    this.setData({
      editRemarkNamePanelShow: false
    });
  },
  submitEditRemarkName(){
    this.hideEditRemarkNamePanel();
  }
})