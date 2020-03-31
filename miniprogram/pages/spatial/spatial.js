// pages/map-control/map-control.js
Page({

	/**
   * 页面的初始数据
   */
    data: {
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
    // 激活定位控件
    onChangeShowPosition(event) {
        const { value } = event.detail;
        if (value) {
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
        }
        this.setData({
            showPosition: value
        });
    },
    onShareAppMessage: function () {

    }
});