//index.js
//获取应用实例
const app = getApp()
var dateTimePicker = require('../../Picker/dateTimePicker.js');

let msg = ''
let openid = ''
let date = ''
Page({
  // get user openid
  // getOpenId() {
  //     wx.cloud.callFunction({
  //         name: "getopenId"
  //     }).then(res => {
  //         // console.log("get openid success", res['result']['openid'])
  //         this.setData({
  //             _openid: res['result']['openid']
  //         })
  //     }).catch(err => {
  //         console.log("get openid fail", err)
  //     })
  // },
  // authorize
  // async authorize() {
  //     wx.requestSubscribeMessage({
  //         tmplIds: ["aDFqqiWr-YM6VBW4L6O9b-_7gvtdacntQMO0FTxdLCw"],
  //         success(res) {
  //             console.log("authorize success", res)
  //             return res
  //         },
  //         fail(err) {
  //             console.log("authorize fail", err)
  //             return err
  //         }
  //     })
  // },

  // ================= cql =================
  data: {
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,

    "value": "",   // 文本的内容
    "placeholder": "Enter Your Message Here",
    "maxlength": -1,  // 最大输入长度，设置为 -1 的时候不限制最大长度
    "focus": true,
    "auto-height": true,  // 是否自动增高，设置auto-height时，style.height不生效
    "adjust-position": true, // 键盘弹起时，是否自动上推页面

  },
  onLoad() {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
    console.log(this.data.dateTime)
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  // ================= cql =================
  getMsg(e) {
    console.log(e.detail.value)
    msg = e.detail.value
    this.setData({
      msg: e.detail.value
    })
  },

  // 我把msg用多行输入储存了

  // bind date change
  bindDateChange(e) {
    console.log(e.detail.value)
    date = e.detail.value
    this.setData({
      date: e.detail.value
    })
  },
  // save msg to db
  async saveMsg() {
    let date = this.data.dateTime
    date[1] += 1
    date[2] += 1
    console.log(`date: ${date}`)
    let targetDateTime = new Date(date[0]+2000, date[1], date[2], date[3], date[4], date[5], 0)
    console.log(`targetDateTime: ${targetDateTime}`)
    // authorize
    wx.requestSubscribeMessage({
      tmplIds: ["aDFqqiWr-YM6VBW4L6O9b-_7gvtdacntQMO0FTxdLCw"],
      success(res) {
        console.log("authorize success", res)
        // get openid
        wx.cloud.callFunction({
          name: "getopenId"
        }).then(res => {
          // console.log("get openid success", res['result']['openid'])
          // this.setData({
          //     _openid: res['result']['openid']
          // })
          openid = res['result']['openid']
          // save msg
          wx.cloud.callFunction({
            name: 'saveMsg',
            data: {
              openid: openid,
              date: date,
              msg: msg
            }
          }).then(res => {
            console.log("save msg success", res)
          }).catch(err => {
            console.log("save msg fail", err)
          })
        }).catch(err => {
          console.log("get openid fail", err)
        })
      },
      fail(err) {
        console.log("authorize fail", err)
        // return err
      }
    })
  },
  // send subscription msg to a single user
  // sendMsgSingleUser() {
  //     if (msg == null || msg == '') {
  //         wx.showToast({
  //             icon: 'none',
  //             title: 'please enter msg'
  //         })
  //     }
  //     else {
  //         this.send('o-gen5CF_b1vozM6BanyCcvX0Yo8', msg)
  //     }
  // },

  // send msg
  // send(openid, msg) {
  //     wx.cloud.callFunction({
  //         name: 'sendMsg',
  //         data: {
  //             openid: openid,
  //             msg: msg
  //         }
  //     }).then(res => {
  //         console.log("send msg to single user success", res)
  //     }).catch(err => {
  //         console.log("send msg to single user fail", err)
  //     })
  // }
})
