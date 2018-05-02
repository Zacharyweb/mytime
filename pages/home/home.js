// pages/home/home.js
var jumpPageTime = 0;
var jumpPageTouchDot = 0;//触摸时的原点
var jumpPageInterval = null;
var jumpPageFlagHd = true;
Page({

  data: {
    actList: [
      { icon: '../../static/img/histrory.png', name: '工作', remark1: '11111', remark2: '2222', id: '11' },
      { icon: '../../static/img/histrory.png', name: '学习', remark1: '11111', remark2: '2222', id: '22' },
      { icon: '../../static/img/histrory.png', name: '睡觉', remark1: '', remark2: '2222', id: '33' },
      // { icon: '../../static/img/histrory.png', name: '工作', remark1: '11111',remark2:'', id: '44' },
      // { icon: '../../static/img/histrory.png', name: '工作', remark1: '',remark2:'', id: '55' },
      // { icon: '../../static/img/histrory.png', name: '工作', remark1: '11111',remark2:'2222', id: '66' },
      // { icon: '../../static/img/histrory.png', name: '工作', remark1: '11111',remark2:'2222', id: '77' },
      // { icon: '../../static/img/histrory.png', name: '工作', remark1: '11111',remark2:'2222', id: '88' },
      // { icon: '../../static/img/histrory.png', name: '工作', remark1: '11111',remark2:'2222', id: '99' }
    ],
    remark1List: [
      { name: '平安保险', id: '1' },
      { name: '中国人寿', id: '2' },
      { name: '阿拉丁', id: '3' },
      { name: '阿里妈妈', id: '4' },
      { name: '阿里巴巴', id: '5' },
      { name: '腾讯', id: '6' },
      { name: '网易', id: '7' }
    ],
    remark2List: [
      { name: '谈判', id: '1' },
      { name: '合作', id: '2' },
      { name: '喝咖啡', id: '3' },
      { name: '吃西瓜', id: '4' },
      { name: '喝酒', id: '5' },
      { name: '慈善晚宴', id: '6' },
      { name: '打游戏', id: '7' }
    ],

    countTarget: -1,
    countTimer: null,
    countH: '00',
    countM: '00',
    countS: '00',

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
    isSelectingPreferAct:false,

    bgColorSelecterShow:false,
    bgColorList: ['#1d8574', '#d53c32', '#f9e1d7', '#feac51', '#83d8c5', '#8fa7f1', '#e5f4d7'],
    pageMainColor:'#1d8574',

    contentPanelTouching:false,
    floatFalsePanelRight:-40,

  },

  onShow: function () {
       console.log('在onShow时读取数据');

       // 初始化左滑切换页面参数
       jumpPageFlagHd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
       clearInterval(jumpPageInterval); // 清除setInterval
       jumpPageTime = 0;
       this.setData({
         floatFalsePanelRight:-80
       })
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
    this.setData({
      isInEditing: false
    });
    wx.showActionSheet({
      itemList: ['设置语言','设置首选活动', '设置背景颜色'],
      success: function (res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 1) {
          _this.setData({
            isSelectingPreferAct: true
          })
        };
        if (res.tapIndex == 1){
          _this.setData({
            isSelectingPreferAct:true
          })
        };
        if (res.tapIndex == 2){
          _this.showBgColorSelecter();
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
    // 如果再选择编辑活动的状态下
    console.log(this.data.isInEditing);
    if (this.data.isInEditing) {
      // 在选择编辑活动的状态下
      this.selectDeletedAct(index);
    } else if (this.data.isSelectingPreferAct){
      // 在选择首选活动的状态下
      this.selectPreferAct(index);
    }else {
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
    if (this.data.countTarget!=-1){
      wx.showToast({ title: '请先暂停计时中的活动', icon: 'none' });
      return;
    };
    wx.navigateTo({
      url: '../iconHouse/iconHouse'
    })
  },

  // 进入选择活动删除的状态
  deleteAct() {
    if (this.data.countTarget != -1 && !this.data.isInEditing){
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
    newActList.splice(index,1);
    this.setData({
      actList: newActList
    });
  },
   // 选择活动设为首选活动
  selectPreferAct(index){
    var item = this.data.actList[index];
    console.log(item.name);
    this.setData({
      preferAct: {
        name: item.name,
        duration:'2'
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
    var newRemark1List = this.data.remark1List;
    newRemark1List.splice(index, 1);
    this.setData({
      remark1List: newRemark1List
    })
  },
  //删除备注1下面的标签项
  deleteRemark2(e) {
    var index = e.currentTarget.dataset.idx;
    var newRemark2List = this.data.remark2List;
    newRemark2List.splice(index, 1);
    this.setData({
      remark2List: newRemark2List
    })
  },
  // 展示背景颜色选择器
  showBgColorSelecter() {
    this.setData({
      bgColorSelecterShow: true
    });
  },
  // 隐藏背景颜色选择器
  hideBgColorSelecter(){
    this.setData({
      bgColorSelecterShow:false
    });
  },
  // 选择背景色
  selectBgColor(e){
    var index = e.currentTarget.dataset.idx;
    var color = this.data.bgColorList[index];
    this.setData({
      pageMainColor: color
    });
    this.hideBgColorSelecter();
  },

  // 触摸开始事件
  contentTouchStart: function (e) {
    this.setData({
      contentPanelTouching:true
    });
    jumpPageTouchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    jumpPageInterval = setInterval(function () {
      jumpPageTime ++;
    }, 100);
  },
   // 触摸移动事件
  contentTouchMove(e){
    var touchMove = e.changedTouches[0].pageX;
    if (touchMove - jumpPageTouchDot >= 0){
      return;
    }
    var right = (jumpPageTouchDot - touchMove) - 40;
    if (right>0){
      return;
    };
    this.setData({
      floatFalsePanelRight: right
    });
  },
  // 触摸结束事件
  contentTouchEnd: function (e) {
    this.setData({
      contentPanelTouching: false,
      floatFalsePanelRight:-40
    });
    var touchMove = e.changedTouches[0].pageX;
    console.log(touchMove - jumpPageTouchDot);
    if (touchMove - jumpPageTouchDot <= -40 && jumpPageTime < 10 && jumpPageFlagHd == true) {
      jumpPageFlagHd = false;
      wx.navigateTo({
        url: '../history/history'
      })
    };
    clearInterval(jumpPageInterval); 
    jumpPageTime = 0;
  }
})