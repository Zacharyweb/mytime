var date = new Date()
var years = []
var months = []
var days = []
for (let i = 2012; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i);
}

var bigMonth = [1,3,5,7,8,10,12];
var smallMonth = [4,6,9,11];
Page({
  data: {
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [9999, 0, 0],
  },
  getDaysNum(num){
    var days = [];
    
    for (let i = 1; i <= num; i++) {
      days.push(i);
    };
    console.log(days);
    this.setData({
      days: days      
    })
  },
  bindChange: function (e) {
    const val = e.detail.value;
    if (bigMonth.indexOf(val[1]) >= 0){
      this.getDaysNum(31);
    } else if (smallMonth.indexOf(val[1]) >= 0){
      this.getDaysNum(30);
    }
    // this.setData({
    //   year: this.data.years[val[0]],
    //   month: this.data.months[val[1]],
    //   day: this.data.days[val[2]]
    // });
  }
})
