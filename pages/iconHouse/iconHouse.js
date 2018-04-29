// pages/iconHouse/iconHouse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconList: [
      { icon: '../../static/img/histrory.png', name: '工作1' },
      { icon: '../../static/img/histrory.png', name: '工作2' },
      { icon: '../../static/img/histrory.png', name: '工作3' },
      { icon: '../../static/img/histrory.png', name: '工作4' },
      { icon: '../../static/img/histrory.png', name: '工作5' },
      { icon: '../../static/img/histrory.png', name: '工作6' },
      { icon: '../../static/img/histrory.png', name: '工作7' },
      { icon: '../../static/img/histrory.png', name: '工作8' },
      { icon: '../../static/img/histrory.png', name: '工作9' },
      { icon: '../../static/img/histrory.png', name: '工作10' }
    ],
    selectedIconIndex: -1,
    editIconNamePanelShow: false
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
  // 选中图标
  selectIcon(e) {
    var index = e.currentTarget.dataset.idx;
    if (this.data.selectedIconIndex == index) {
      return;
    };
    this.setData({
      selectedIconIndex: index
    });
  },
  // 取消选中图标
  cancelSelectIcon() {
    this.setData({
      selectedIconIndex: -1
    });
  },
  // 确认选中的图标
  submitActIcon() {
    if (this.data.selectedIconIndex == -1) {
      return;
    };
    this.cancelSelectIcon();
    wx.navigateBack({
      delta: 1
    });
  },
  // 删除选中的图标
  deleteActIcon() {
    if (this.data.selectedIconIndex == -1) {
      return;
    };
    var newIconList = this.data.iconList;
    newIconList.splice(this.data.selectedIconIndex, 1);
    this.setData({
      iconList: newIconList
    });
    this.cancelSelectIcon();
  },
  uploadActIcon(){
    var _this=this;
    wx.chooseImage({
      count:1,
      sizeType: 'compressed',
      success: function (tempFilePaths){
        console.log(tempFilePaths);
        _this.showEditIconNamePanel();
      }
    });
  },
  //展示上传图标完成后编辑图标名字的面板
  showEditIconNamePanel() {
    this.setData({
      editIconNamePanelShow: true
    });
    this.cancelSelectIcon();
  },
  // 隐藏上传图标完成后编辑图标名字的面板
  hideEditIconNamePanel() {
    this.setData({
      editIconNamePanelShow: false
    });
  },
  // 提交输入的图标名字
  submitActIconName() {
    this.hideEditIconNamePanel();
  }
})