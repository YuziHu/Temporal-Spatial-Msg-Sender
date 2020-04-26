//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('Please use the basic library of 2.2.3 or above to use cloud capabilities')
    } else {
      wx.cloud.init({
// env parameter description:
         // The env parameter determines which cloud environment resources the default cloud development call (wx.cloud.xxx) initiated by the applet will request to
         // Please fill in the environment ID here, the environment ID can open the cloud console to view
         // If not filled, use the default environment (the first environment created)
         // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})
