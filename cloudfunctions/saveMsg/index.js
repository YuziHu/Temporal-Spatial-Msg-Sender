// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return await db.collection("queue").add({
        data: {
            openid: event.openid,
            date: event.date,
            message: event.msg,
            sended: false
        }
    })

}