var api = require("../restapi.js");
var utils = require("../util.js");
module.exports = {
  startActivity: (data) => {
    return api.post("/api/services/app/People/StartActivity", null, data);
  },
  stopActivity: (data) => {
    return api.post("/api/services/app/People/StopActivity", null, data);
  },
  getCurrentActivity: () => {
    return api.get("/api/services/app/People/GetCurrentActivity");
  },
  getPeopleActivityHistory: (data) => {
    var now = new Date();
    switch (parseInt(data.dateType)) {
      case 0:
        data.beginDate = data.endDate = now.Format("yyyy-MM-dd");
        break;
      case 1:
        now.setDate(now.getDate() - 1);
        data.beginDate = data.beginDate = data.endDate = now.Format("yyyy-MM-dd");
        break;
      case 2:
        now.setDate(now.getDate() - (now.getDay() == 0 ? 6 : (now.getDay() - 1)));
        data.beginDate = now.Format("yyyy-MM-dd");
        now.setDate(now.getDate() + 6);
        data.endDate = now.Format("yyyy-MM-dd");
        break;
    }
    if (data.beginDate) data.beginDate = new Date(data.beginDate + " 00:00:00").getUTCDateTime().Format();
    if (data.endDate) data.endDate = new Date(data.endDate + " 23:59:59").getUTCDateTime().Format();
    return api.get("/api/services/app/People/GetPeopleActivityHistory", data).then(res => {
      res.result.forEach((item) => {
        item.beginTime = item.beginTime.FormatTime('MM.dd HH:mm:ss');
        item.endTime = item.endTime ? item.endTime.FormatTime('HH:mm:ss') : item.endTime;
      })
      return res;
    });
  },
  addActivity: (data) => {
    return api.post("/api/services/app/People/AddActivity", null, data);
  },
  deleteActivity: (id) => {
    return api.delete("/api/services/app/People/DeleteActivity", { activityId: id });
  },
  changeActivityName: (data) => {
    return api.post("/api/services/app/People/ChangeActivityName", null, data);
  },
  getUsedActivities: () => {
    return api.get("/api/services/app/People/GetUsedActivities").then(res => {
      return res.result.map(item => {
        item = { ...item, remark1: '', remark2: '' };
        return item;
      })
    });
  },
  getSystemActivities: () => {
    return api.get("/api/services/app/People/GetSystemActivities");
  },
  setLabel: (data) => {
    return api.post("/api/services/app/People/SetLabel", null, data);
  },
  deleteLabel: (id) => {
    return api.delete("/api/services/app/People/DeleteLabel", { labelId: id });
  },
  setLabelCategoryName: (data) => {
    return api.post("/api/services/app/People/SetLabelCategoryName", null, data);
  },
  getLabelCategories: () => {
    return api.get("/api/services/app/People/GetLabelCategories");
  }
}