//index.js
//获取应用实例
const app = getApp()


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
        date = e.detail.value
        this.setData({
            date: e.detail.value
        })
    },
    // save msg to db
    saveMsg() {
        let that = this
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
                    that.setData({
                        _openid: res['result']['openid']
                    })
                    // console.log(that.data._openid)
                    openid = res['result']['openid']
                    // save msg
                    wx.cloud.callFunction({
                        name: 'saveMsg',
                        data: {
                            openid: that.data._openid,
                            date: that.data.date,
                            msg: that.data.msg
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
