// pages/iconHouse/iconHouse.js
var app = getApp();
var userApi = require("../../utils/data/user.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actId: '',
    iconList: [],
    selectedIconIndex: -1,
    editIconNamePanelShow: false,

    newActIconName: '',
    tempImgUrl: '',

    pageMainColor: '#c5c3c6'
  },
  onLoad: function (options) {
    if (options.actId) {
      this.setData({
        actId: options.actId
      })
    }
    userApi.getSystemActivities().then(res => {
      this.setData({
        iconList: res.result
      })
    })
  },
  onShow: function () {
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
    var idx = this.data.selectedIconIndex;
    this.setData({
      newActIconName: this.data.iconList[idx].name
    });
    //this.cancelSelectIcon();
    this.showEditIconNamePanel();

  },
  // 向后端发送数据
  postSelectedActIconMsg() {
    wx.showLoading({
      title: ''
    });
    if (this.data.actId) {
      setTimeout(function () {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1
        });
      }, 1000)
    } else {
      setTimeout(function () {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1
        });
      }, 1000)
    }
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
  // 上传图标
  uploadActIcon() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      success: function (tempFilePaths) {
        console.log(tempFilePaths.tempFilePaths[0]);
        _this.setData({
          tempImgUrl: tempFilePaths.tempFilePaths[0]
        })
        _this.showEditIconNamePanel();
      }
    });
  },
  //展示上传图标完成后编辑图标名字的面板
  showEditIconNamePanel() {
    this.setData({
      editIconNamePanelShow: true
    });
    //this.cancelSelectIcon();
  },
  // 隐藏上传图标完成后编辑图标名字的面板
  hideEditIconNamePanel() {
    this.setData({
      editIconNamePanelShow: false
    });
  },
  // 绑定活动图标名称输入
  bindNameInput(e) {
    this.setData({
      newActIconName: e.detail.value
    })
  },
  // 提交输入的图标名字
  submitActIconName() {
    if (!this.data.newActIconName) {
      wx.showToast({ title: '请输入活动名称', icon: 'none' });
      return;
    };
    userApi.addActivity({
      activityId: this.data.iconList[this.data.selectedIconIndex].id,
      name: this.data.newActIconName
    }).then(res => {
      this.hideEditIconNamePanel();
      this.postSelectedActIconMsg();
      app.showToast("您已添加新活动");
      app.globalData.event.initHome();
    })

    // var newIconList = this.data.iconList;
    // newIconList.push({
    //   icon: this.data.tempImgUrl, 
    //   name: this.data.newActIconName
    // });
    // this.setData({
    //   iconList: newIconList
    // })
  }
})