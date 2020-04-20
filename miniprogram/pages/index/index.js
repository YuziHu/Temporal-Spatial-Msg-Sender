//index.js
//获取应用实例
const app = getApp()

Page({

  temporal() {
    wx.navigateTo({
      url: "/pages/temporal/temporal"
    })
    wx.showLoading({
      title: 'Loading...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  spatial() {
    wx.navigateTo({
      url: "/pages/spatial/spatial"
    })
    wx.showLoading({
      title: 'Loading...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  }
})
