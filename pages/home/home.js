// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actList: [
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2', id: '11' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2', id: '22' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2', id: '33' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2', id: '44' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2', id: '55' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2', id: '66' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2', id: '77' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2', id: '88' },
      { icon: '../../static/img/histrory.png', name: '工作', remark: '备注1，备注2', id: '99' }
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
    selectedRemark1Index:-1,
    selectedRemark2Index: -1,
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
    var id = this.data.actList[index].id
    wx.navigateTo({
      url: '../editAct/editAct?actId=' + id
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
    this.setData({
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
  resetActRemark(){
    this.setData({
      remark1Text:'',
      remark2Text:'',
      selectedRemark1Index: -1,
      selectedRemark2Index: -1
    });
  },
  // 提交修改的备注
  submitActRemark() {
    console.log('备注1：' + this.data.remark1Text);
    console.log('备注2：' + this.data.remark2Text);
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
    if (this.data.selectedRemark1Index != -1){
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
  selectRemark1(e){
    var index = e.currentTarget.dataset.idx;
    this.setData({
      selectedRemark1Index:index,
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
  deleteRemark1(e){
    var index = e.currentTarget.dataset.idx;
    var newRemark1List = this.data.remark1List;
    newRemark1List.splice(index,1);
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
})