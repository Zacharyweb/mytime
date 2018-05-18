// pages/home/home.js
var app = getApp();
var authApi = require("../../utils/data/auth.js");
var timeOutTimer= null;
Page({

  data: {
    actList: [
      { icon: '../../static/img/icon/icon1.png', name: '小米科技', remark1: '', remark2: '', id: '11' },
      { icon: '../../static/img/icon/icon2.png', name: '团队会', remark1: '', remark2: '', id: '22' },
      { icon: '../../static/img/icon/icon3.jpg', name: '收费工作', remark1: '', remark2: '', id: '33' },
      { icon: '../../static/img/icon/icon4.png', name: '电话会议', remark1: '', remark2: '', id: '44' },
      { icon: '../../static/img/icon/icon5.png', name: 'Allen&Overy', remark1: '', remark2: '', id: '55' },
      { icon: '../../static/img/icon/icon6.png', name: '外出办事', remark1: '', remark2: '', id: '66' },
      { icon: '../../static/img/icon/icon7.png', name: '跑客户', remark1: '', remark2: '', id: '77' },
      { icon: '../../static/img/icon/icon8.png', name: '培训', remark1: '', remark2: '', id: '88' },
      { icon: '../../static/img/icon/icon9.png', name: 'Li&Fung', remark1: '', remark2: '', id: '99' },
      { icon: '../../static/img/icon/icon10.png', name: '西安杨森', remark1: '', remark2: '', id: '1010' },
      { icon: '../../static/img/icon/icon11.png', name: '充电', remark1: '', remark2: '', id: '1111' },
      { icon: '../../static/img/icon/icon12.png', name: '地铁', remark1: '', remark2: '', id: '1212' },
      { icon: '../../static/img/icon/icon13.png', name: '吃饭', remark1: '', remark2: '', id: '1313' },
      { icon: '../../static/img/icon/icon14.png', name: '睡觉', remark1: '', remark2: '', id: '1414' }
    ],

    remark1List: [
      { name: '海尔集团', id: '1' },
      { name: '香港贸发局', id: '2' },
      { name: '腾迅', id: '3' },
      { name: '宝山钢铁', id: '4' },
      { name: '丰田汽车', id: '5' },
      { name: '中国人寿', id: '6' },
      { name: '平安保险', id: '7' },
      { name: '三一重工', id: '8' },
      { name: 'JP Morgan', id: '9' },
      { name: '中信泰富', id: '10' },
      { name: 'Amazon', id: '11' },
      { name: '上海医药', id: '12' },
      { name: '麦肯锡', id: '13' },
      { name: 'IBM', id: '14' },
    ],
    remark2List: [
      { name: '年度审计', id: '1' },
      { name: '收购合并', id: '2' },
      { name: '争议调解', id: '3' },
      { name: '上市重组', id: '4' },
      { name: '常年顾问', id: '5' },
      { name: '技术调研', id: '6' },
      { name: '季度报表', id: '7' },
      { name: '行业情报', id: '8' },
      { name: '尽职调查', id: '9' },
      { name: '投标报价', id: '10' },
      { name: '系统咨询', id: '11' },
      { name: '特殊项目', id: '12' },
      { name: '薪酬激励', id: '13' }
    ],

    countTarget: -1,
    countTimer: null,
    countH: '00',
    countM: '00',
    countS: '00',
    finistTotal:'',
    lastFinishTarget:-1,
    finishPanelShow:false,

    isInEditing: false,

    remarkPanelShow: false,
    editRemarkPanelShow: false,
    editRemarkNamePanelShow: false,

    remark1Name: '客户',
    remark2Name: '业务',

    remark1Text: '',
    remark2Text: '',
    remarkNameText: '',

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
    isFirstEnter:true,
    guidePageHidePre:false,
    guidePageShow:true


  },

  onLoad: function () {
    authApi.register();

    var _this = this;
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
    // if (app.globalData.lang == "cn") {
    //   actionSheet = ['切换到英文', '设置背景颜色']
    // };
    wx.showActionSheet({
      itemList: ['设置背景颜色'],
      success: function (res) {

        if (res.tapIndex == 0) {
          _this.setData({
            isInEditing: false
          });
          _this.showBgColorSelecter();
        };
        if (res.tapIndex == 1) {

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
  setLang() {
    wx.showActionSheet({
      itemList: ['简体中文', 'English'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.showToast({
            title: '中文',
          })
        };
        if (res.tapIndex == 1) {
          wx.showToast({
            title: 'En',
          })
        };
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
      timeOutTimer = setTimeout(()=>{
        this.setData({
          finishPanelShow: false
        });
      },2000)

      clearInterval(this.data.countTimer);
      this.cleanActRemark();

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
    if (this.data.countTarget != -1) {
      wx.showToast({ title: '请先暂停计时中的活动', icon: 'none' });
      return;
    };
    wx.navigateTo({
      url: '../iconHouse/iconHouse'
    })
  },

  // 进入选择活动删除的状态
  deleteAct() {
    if (this.data.countTarget != -1 && !this.data.isInEditing) {
      wx.showToast({ title: '请先暂停计时中的活动', icon: 'none' });
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
    newActList.splice(index, 1);
    this.setData({
      actList: newActList
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
    this.setData({
      actList: newActList
    });
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
      wx.showToast({ title: '备注名称不能为空', icon: 'none' });
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

    this.hideEditRemarkNamePanel();
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
    var newRemark1List = this.data.remark1List;
    newRemark1List.splice(index, 1);
    this.setData({
      remark1List: newRemark1List,
      selectedRemark1Index: selectedRemark1Index
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
    var newRemark2List = this.data.remark2List;
    newRemark2List.splice(index, 1);
    this.setData({
      remark2List: newRemark2List,
      selectedRemark2Index: selectedRemark2Index
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
  closeGuidePage(){
    wx.setStorage({
      key: "firstEnterFlag",
      data: (new Date()).getTime()
    });
    this.setData({
      guidePageHidePre: true
    });
    setTimeout(()=>{
      this.setData({
        guidePageShow: false,
        guidePageHidePre:false
      })
    },1500);
  },


  onShareAppMessage: function () {
    return {
      title: "我的时间",
      desc: "主页",
      path: '/pages/home/home'
    }
  }
})