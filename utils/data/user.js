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
    if (data.beginDate) data.beginDate = new Date(data.beginDate).getUTCDateTime().Format();
    if (data.endDate) data.endDate = new Date(data.endDate).getUTCDateTime().Format();
    data.clientDateTime = now.getUTCDateTime().Format();
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