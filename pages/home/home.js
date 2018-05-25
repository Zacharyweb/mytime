// pages/home/home.js
var app = getApp();
var authApi = require("../../utils/data/auth.js");
var userApi = require("../../utils/data/user.js");
var timeOutTimer = null;
Page({

  data: {
    lang: app.globalData.lang,
    actList: [],

    remark1List: [],
    remark2List: [],

    countTarget: -1,
    countTimer: null,
    countH: '00',
    countM: '00',
    countS: '00',
    finistTotal: '',
    lastFinishTarget: -1,
    finishPanelShow: false,

    isInEditing: false,

    remarkPanelShow: false,
    editRemarkPanelShow: false,
    editRemarkNamePanelShow: false,

    remark1Name: '',
    remark2Name: '',

    remark1Text: '',
    remark2Text: '',
    remarkNameText: '',

    remarkPlaceholder: '',

    currentEditRemarkNameType: 1,// 1:编辑备注1的名称，2：编辑备注2的名称
    selectedRemark1Index: -1,
    selectedRemark2Index: -1,

    preferAct: { name: '工作', duration: '5' },
    isSelectingPreferAct: false,

    bgColorSelecterShow: false,
    bgColorList: ['#c5c3c6', '#f25f5c', '#fcbf49', '#457b9d', '#e5989b', '#1d8574'],
    pageMainColor: '#c5c3c6',

    contentPanelTouching: false,

    // 用户引导页展示
    isFirstEnter: true,
    guidePageHidePre: false,
    guidePageShow: true


  },
  initHome: function () {
    userApi.getUsedActivities().then(data => {
      console.log(data);
      this.setData({
        actList: data
      })
      return userApi.getCurrentActivity();
    }).then(res => {
      if (!res.result) return;
      var curr = this.data.actList.findIndex(a => a.id === res.result.activityId);
      console.log(res.result);

      this.data.actList[curr].remark1 = res.result.labels[1] || '';
      this.data.actList[curr].remark2 = res.result.labels[2] || '';
      this.data.actList[curr].peopleActivityId = res.result.id;
      this.setData({
        countTarget: curr,
        actList: this.data.actList
      });
      this.count(res.result.totalSeconds);
    }).then(() => {
      this.initLables();
    });
  },
  initLables: function () {
    userApi.getLabelCategories().then(res => {
      var data = res.result;
      this.setData({
        remark1Name: data[0].name,
        remark2Name: data[1].name,
        remark1List: data[0].labeles,
        remark2List: data[1].labeles,
      });
    });
  },
  onLoad: function () {
    var _this = this;
    app.globalData.event.initHome = this.initHome;
    authApi.register();
    wx.getStorage({
      key: 'bgColor',
      success: function (res) {
        _this.setData({
          pageMainColor: res.data || '#c5c3c6'
        })
      }
    });

    // 判断是不是首次登录
    wx.getStorage({
      key: 'firstEnterFlag',
      success: function (res) {
        _this.setData({
          isFirstEnter: false
        })
      }
    });

  },

  onShow: function () {
    var txt = this.data.lang == 'en' ? 'Time Matters' : '我的时间';
    wx.setNavigationBarTitle({
      title: txt
    });

    this.setData({
      remark1Name: this.data.lang == 'en' ? 'Client' : '客户',
      remark2Name: this.data.lang == 'en' ? 'Job' : '业务',
      remarkPlaceholder: this.data.lang == 'en' ? 'You may fill remark or pick from the tags below' : '请输入或从下面标签中选择备注'
    });

    this.initHome();
  },

  onHide: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        isInEditing: false,
        remarkPanelShow: false,
        editRemarkPanelShow: false,
        editRemarkNamePanelShow: false
      });
    }, 500);
  },
  // 点击top区域
  topBlockTap() {
    var _this = this;
    // var actionSheet =[];
    // if (app.globalData.lang == "en"){
    //   actionSheet = ['Change to Chinese','Set BG Color']
    // };
    var actionSheet = ['设置背景颜色', '退出登录']
    if (this.data.lang == "en") {
      actionSheet = ['Set color', 'Log out']
    };
    wx.showActionSheet({
      itemList: actionSheet,
      success: function (res) {

        if (res.tapIndex == 0) {
          _this.setData({
            isInEditing: false
          });
          _this.showBgColorSelecter();
        };
        if (res.tapIndex == 1) {
          app.setAuthtoken(null);
        };
        if (res.tapIndex == 2) {
          _this.setData({
            isSelectingPreferAct: true
          })
        }
      },
      fail: function (res) {
      }
    })
  },

  // 去历史记录页面
  toHistoryPage() {
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
  count(startInterval) {
    if (this.data.countTimer) clearInterval(this.data.countTimer);
    var interval = startInterval || 0;
    var countTimer = null;

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
    var actObj = this.data.actList[index];
    this.setData({
      remarkPanelShow: false
    });
    if (this.data.isInEditing) {
      // 在选择删除活动的状态下
      this.selectDeletedAct(index);
    } else if (this.data.isSelectingPreferAct) {
      // 在选择首选活动的状态下
      this.selectPreferAct(index);
    } else {
      // 更换计时活动
      let lastFinishTarget = this.data.countTarget;
      let finishTotal = this.data.countH + ':' + this.data.countM + ':' + this.data.countS;
      this.setData({
        lastFinishTarget: lastFinishTarget,
        finishTotal: finishTotal,
        finishPanelShow: true,
      });
      clearTimeout(timeOutTimer);
      timeOutTimer = setTimeout(() => {
        this.setData({
          finishPanelShow: false
        });
      }, 2000)

      this.cleanActRemark();

      if (this.data.countTarget == index) {
        this.setData({
          countTarget: -1
        });
        userApi.stopActivity({ peopleActivityId: actObj.peopleActivityId });
        return;
      };
      userApi.startActivity({
        activityId: actObj.id,
        peopleActivityId: this.data.countTarget >= 0 ?
          this.data.actList[this.data.countTarget].peopleActivityId :
          null
      }).then(res => {
        this.data.actList[index].peopleActivityId = res.result.id;
        this.setData({
          countTarget: index,
          countH: '00',
          countM: '00',
          countS: '00'
        });
        this.count();
      })
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
    if (this.data.countTarget != -1) {
      var txt = this.data.lang == 'en' ? 'Please first pause timing the activity' : '请先暂停计时中的活动';
      wx.showToast({ title: txt, icon: 'none' });
      return;
    };
    wx.navigateTo({
      url: '../iconHouse/iconHouse'
    })
  },

  // 进入选择活动删除的状态
  deleteAct() {
    if (this.data.countTarget != -1 && !this.data.isInEditing) {
      var txt = this.data.lang == 'en' ? 'Please first pause timing the activity' : '请先暂停计时中的活动';
      wx.showToast({ title: txt, icon: 'none' });
      return;
    };
    this.setData({
      remarkPanelShow: false,
      isInEditing: !this.data.isInEditing,
      isSelectingPreferAct: false
    });
  },
  // 选择活动删除
  selectDeletedAct(index) {
    // var id = this.data.actList[index].id;
    // this.setData({
    //   isInEditing: false
    // });
    // wx.navigateTo({
    //   url: '../editAct/editAct?actId=' + id
    // });
    var newActList = this.data.actList;
    userApi.deleteActivity(newActList[index].id).then(() => {
      newActList.splice(index, 1);
      this.setData({
        actList: newActList
      });
    });
  },
  // 选择活动设为首选活动
  selectPreferAct(index) {
    var item = this.data.actList[index];
    this.setData({
      preferAct: {
        name: item.name,
        duration: '2'
      },
      isSelectingPreferAct: false
    });
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
    var index = this.data.countTarget;
    var remark1 = this.data.actList[index].remark1;
    var remark2 = this.data.actList[index].remark2;
    this.setData({
      remark1Text: remark1,
      remark2Text: remark2,
      editRemarkPanelShow: true
    });
  },
  // 隐藏修改备注的面板
  hideEditRemarkPanel() {
    this.resetActRemark();
    this.setData({
      editRemarkPanelShow: false
    });
  },
  // 重置修改的备注
  resetActRemark() {
    this.setData({
      remark1Text: '',
      remark2Text: '',
      selectedRemark1Index: -1,
      selectedRemark2Index: -1
    });
  },
  // 提交修改的备注
  submitActRemark() {
    var index = this.data.countTarget;
    var newActList = this.data.actList;
    newActList[index].remark1 = this.data.remark1Text;
    newActList[index].remark2 = this.data.remark2Text;

    var labels = [];
    this.data.remark1Text && labels.push({
      labelCategoryId: 1,
      labelName: this.data.remark1Text
    });
    this.data.remark2Text && labels.push({
      labelCategoryId: 2,
      labelName: this.data.remark2Text
    });
    labels.length && userApi.setLabel({
      peopleActivityId: newActList[index].peopleActivityId,
      labels: labels
    }).then(res => {
      this.setData({
        actList: newActList
      });
      this.initLables();
    })
    this.hideEditRemarkPanel();
  },
  // 清除活动的备注
  cleanActRemark() {
    var index = this.data.countTarget;
    var newActList = this.data.actList;
    if (index == -1) {
      return;
    };
    newActList[index].remark1 = '';
    newActList[index].remark2 = '';
    this.setData({
      actList: newActList
    });
  },
  // 展示修改备注名称的面板
  showEditRemarkNamePanel(e) {
    var index = e.currentTarget.dataset.idx;
    var remarkNameText = '';
    if (index == 1) {
      remarkNameText = this.data.remark1Name;
    } else {
      remarkNameText = this.data.remark2Name;
    }
    this.setData({
      editRemarkNamePanelShow: true,
      remarkNameText: remarkNameText,
      currentEditRemarkNameType: index
    });
  },
  // 隐藏修改备注名称的面板
  hideEditRemarkNamePanel() {
    this.setData({
      editRemarkNamePanelShow: false
    });
  },
  // 提交输入的备注名称
  submitEditRemarkName() {
    if (!this.data.remarkNameText) {
      var txt = this.data.lang == 'en' ? 'please input remark\'s name' : '备注名称不能为空';
      wx.showToast({ title: txt, icon: 'none' });
      return;
    };
    if (this.data.currentEditRemarkNameType == 1) {
      this.setData({
        remark1Name: this.data.remarkNameText
      });
    } else {
      this.setData({
        remark2Name: this.data.remarkNameText
      });
    }
    userApi.setLabelCategoryName({ id: this.data.currentEditRemarkNameType, name: this.data.remarkNameText }).then(() => {
      this.hideEditRemarkNamePanel();
    });
  },
  // 绑定备注1的输入
  bindRemark1Input(e) {
    if (this.data.selectedRemark1Index != -1) {
      this.setData({
        selectedRemark1Index: -1
      });
    };
    this.setData({
      remark1Text: e.detail.value
    });
  },
  // 绑定备注2的输入
  bindRemark2Input(e) {
    if (this.data.selectedRemark2Index != -1) {
      this.setData({
        selectedRemark2Index: -1
      });
    };
    this.setData({
      remark2Text: e.detail.value
    });
  },
  // 绑定备注1的输入
  bindRemarkNameInput(e) {
    this.setData({
      remarkNameText: e.detail.value
    });
  },
  //选择备注1下面的标签项
  selectRemark1(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      selectedRemark1Index: index,
      remark1Text: this.data.remark1List[index].name
    })
  },
  //选择备注2下面的标签项
  selectRemark2(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      selectedRemark2Index: index,
      remark2Text: this.data.remark2List[index].name
    })
  },
  //删除备注1下面的标签项
  deleteRemark1(e) {
    var index = e.currentTarget.dataset.idx;
    var selectedRemark1Index = this.data.selectedRemark1Index;
    if (index == selectedRemark1Index) {
      this.setData({
        remark1Text: ''
      });
      selectedRemark1Index = -1;
    } else if (index < selectedRemark1Index) {
      selectedRemark1Index--;
    };
    userApi.deleteLabel(this.data.remark1List[index].id).then(() => {
      var newRemark1List = this.data.remark1List;
      newRemark1List.splice(index, 1);
      this.setData({
        remark1List: newRemark1List,
        selectedRemark1Index: selectedRemark1Index
      })
    })
  },
  //删除备注2下面的标签项
  deleteRemark2(e) {
    var index = e.currentTarget.dataset.idx;
    var selectedRemark2Index = this.data.selectedRemark2Index;
    if (index == selectedRemark2Index) {
      this.setData({
        remark2Text: ''
      });
      selectedRemark2Index = -1;
    } else if (index < selectedRemark2Index) {
      selectedRemark2Index--;
    };
    userApi.deleteLabel(this.data.remark2List[index].id).then(() => {
      var newRemark2List = this.data.remark2List;
      newRemark2List.splice(index, 1);
      this.setData({
        remark2List: newRemark2List,
        selectedRemark2Index: selectedRemark2Index
      })
    })
  },
  // 展示背景颜色选择器
  showBgColorSelecter() {
    this.setData({
      bgColorSelecterShow: true
    });
  },
  // 隐藏背景颜色选择器
  hideBgColorSelecter() {
    this.setData({
      bgColorSelecterShow: false
    });
  },
  // 选择背景色
  selectBgColor(e) {
    var index = e.currentTarget.dataset.idx;
    var color = this.data.bgColorList[index];
    wx.setStorage({
      key: "bgColor",
      data: color
    });
    this.setData({
      pageMainColor: color
    });
    this.hideBgColorSelecter();
  },
  // 关闭引导页
  closeGuidePage() {
    wx.setStorage({
      key: "firstEnterFlag",
      data: (new Date()).getTime()
    });
    this.setData({
      guidePageHidePre: true
    });
    setTimeout(() => {
      this.setData({
        guidePageShow: false,
        guidePageHidePre: false
      })
    }, 1500);
  },


  onShareAppMessage: function () {
    return {
      title: "我的时间",
      desc: "主页",
      path: '/pages/home/home'
    }
  }
})