//index.js
//获取应用实例
const app = getApp()


let msg = ''
Page({
    // get user openid
    getOpenId() {
        wx.cloud.callFunction({
            name: "getopenId"
        }).then(res => {
            console.log("get openid success", res['result']['openid'])
            this.setData({
                _openid: res['result']['openid']
            })
        }).catch(err => {
            console.log("get openid fail", err)
        })
    },
    // authorize
    authorize() {
        wx.requestSubscribeMessage({
            tmplIds: ["aDFqqiWr-YM6VBW4L6O9b-_7gvtdacntQMO0FTxdLCw"],
            success(res) {
                console.log("authorize success", res)
            },
            fail(err) {
                console.log("authorize fail", err)
            }
        })
    },
    getMsg(e) {
        console.log(e.detail.value)
        msg = e.detail.value
        this.setData({
            msg: e.detail.value
        })
    },
    // bind date change
    bindDateChange(e) {
        console.log(e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
    // save msg to db
    saveMsg() {
        console.log(this.data._openid)
        console.log(this.data.date)
        console.log(this.data.msg)
        wx.cloud.callFunction({
            name: 'saveMsg',
            data: {
                openid: this.data._openid,
                date: this.data.date,
                msg: this.data.msg
            }
        }).then(res => {
            console.log("save msg success", res)
        }).catch(err => {
            console.log("save msg fail", err)
        })
    },
    // send subscription msg to a single user
    sendMsgSingleUser() {
        if (msg == null || msg == '') {
            wx.showToast({
                icon: 'none',
                title: 'please enter msg'
            })
        }
        else {
            this.send('o-gen5CF_b1vozM6BanyCcvX0Yo8', msg)
        }
    },

    // send msg
    send(openid, msg) {
        wx.cloud.callFunction({
            name: 'sendMsg',
            data: {
                openid: openid,
                msg: msg
            }
        }).then(res => {
            console.log("send msg to single user success", res)
        }).catch(err => {
            console.log("send msg to single user fail", err)
        })
    }
})
