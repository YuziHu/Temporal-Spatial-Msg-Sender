// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    if(!event.targetLocation){
        return await db.collection("TemporalQueue").add({
            data: {
                openid: event.openid,
                date: event.date,
                message: event.msg
            }
        })
    }
    return await db.collection("SpatialQueue").add({
        data: {
            openid: event.openid,
            targetLocation: event.targetLocation,
            locationName: event.targetLocation.name,
            message: event.message
        }
    })

}