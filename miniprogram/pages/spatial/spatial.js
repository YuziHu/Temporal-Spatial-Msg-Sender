// pages/map-control/map-control.js
Page({

	/**
   * 页面的初始数据
   */
    data: {
        imgs: {
            rightArrow: 'https://3gimg.qq.com/lightmap/xcx/demoCenter/images/iconArrowRight@3x.png'
        },
        chooseLocation: null,
        location: {
            latitude: 40.040415,
            longitude: 116.273511
        },
        isShowScale: false,
        isShowCompass: false,
        isShowPosition: false,
        showActionSheet: false,
    },


    onLoad: function(options){
        let that = this
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                console.log(res)
                const { latitude, longitude } = res;
                this.setData({
                    location: {
                        latitude,
                        longitude
                    }
                });
            }
        });
        this.setData({
            showPosition: true
        });
        wx.startLocationUpdateBackground({
            success(res) {
                console.log('开启后台定位', res)
            },
            fail(res) {
                console.log('开启后台定位失败', res)
            }
        })
        wx.onLocationChange(function (res) {
            console.log('location change', res)
            that.getCurrentLocation()
            that.sendMsg()
        })
    },

    getCurrentLocation(){
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                console.log(res)
                const { latitude, longitude } = res;
                this.setData({
                    location: {
                        latitude,
                        longitude
                    }
                });
            }
        });
        this.setData({
            showPosition: true
        });
    },

    onChooseLocation() {
        wx.chooseLocation({
            success: (res) => {
                console.log(res)
                this.setData({
                    chooseLocation: res
                });
            }
        });
    },

    getMsg(e) {
        console.log(e.detail.value)
        // msg = e.detail.value
        this.setData({
            msg: e.detail.value
        })
    },


    // save msg to db
    saveMsg() {
        let that = this
        // check if the user chooses a location
        if(this.data.chooseLocation==null){
            wx.showToast({
                title: 'Please choose a location',
                icon: 'none',
                duration: 2000
            })
            return
        }
        // authorize
        wx.requestSubscribeMessage({
            tmplIds: ["1x06cU9u9SIMV0Ot-XZIaM6uTiosa13C2Ry3R8hv9iM"],
            success(res) {
                console.log("authorize success", res)
                // get openid
                wx.cloud.callFunction({
                    name: "getopenId"
                }).then(res => {
                    // openid = res['result']['openid']
                    that.setData({
                        _openid: res['result']['openid']
                    })
                    console.log(that.data.msg)
                    // save msg
                    wx.cloud.callFunction({
                        name: 'saveMsg',
                        data: {
                            openid: that.data._openid,
                            targetLocation: that.data.chooseLocation,
                            message: that.data.msg
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
            }
        })
    },
    sendMsg(){
        let that = this
        wx.cloud.callFunction({
            name: 'sendMsgSpatial',
            data: {
                longitude: that.data.location.longitude,
                latitude: that.data.location.latitude
            }
        }).then(res => {
            console.log('send spatial msg success', res)
        }).catch(err => {
            console.log('send spatial msg fail', err)
        })
    },
    onShareAppMessage: function () {

    }
});