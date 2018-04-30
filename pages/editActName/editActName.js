// pages/editActName/editActName.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actName:'',
    showDeleteIcon:false
  },
  
  onLoad: function (options) {
  
  },

  onShow: function () {
  
  },
  onHide: function () {
  
  },

  // 同步输入框输入绑定
  bindNameInput(e){
    if (e.detail.value){
      if (!this.data.showDeleteIcon){
        this.setData({
          showDeleteIcon:true
        });
      }
    };
    this.setData({
      actName: e.detail.value
    })
  },
  // 清除文字
  cleanText() {
    this.setData({
      actName: '',
      showDeleteIcon: false
    });
  },
  // 提交文字
  submitName(){
    if(!this.data.actName){
      wx.showToast({title:'活动名称不能为空',icon:'none'});
      return;
    };
    console.log(this.data.actName);
  }
})