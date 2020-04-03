// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    // extract current location from parameters passed in
    let currentLocation = event.currentLocation
    let {currentLat, currentLong} = currentLocation
}