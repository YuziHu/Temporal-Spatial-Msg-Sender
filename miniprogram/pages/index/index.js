//index.js
//获取应用实例
const app = getApp()

Page({
    temporal(){
        wx.navigateTo({
            url: "/pages/temporal/temporal"
        })
    },
    spatial() {
        wx.navigateTo({
            url: "/pages/spatial/spatial"
        })
    }
})
