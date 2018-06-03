Date.prototype.Format = function (fmt) { //author: meizz   
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  var o = {
    "M+": this.getMonth() + 1,                 //月份   
    "d+": this.getDate(),                    //日   
    "H+": this.getHours(),                   //小时   
    "m+": this.getMinutes(),                 //分   
    "s+": this.getSeconds(),                 //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
Date.prototype.getUTCDateTime = function () {
  var now = this;
  return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
}

Number.prototype.FormatTime = function (fmt) {
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  if (this === null) return this;
  if (this <= 0) return '';
  var a = new Date(this);
  var d = a.Format(fmt);
  return d;
}

module.exports = {

}
