// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const taskQueue = []

    let taskRes = await db.collection('TemporalQueue').limit(100).get()
    let tasks = taskRes.data
    // let now = new Date().toJSON().slice(0, 10).replace(/-/g, '-')
    let now = new Date()
    let nowYear = now.getFullYear()
    let nowMonth = now.getMonth()+1
    let nowDay = now.getDate()-1
    let nowHour = now.getHours()+20 // convert to EST
    let nowMin = now.getMinutes()
    console.log(`now: ${nowYear}-${nowMonth}-${nowDay} ${nowHour}:${nowMin}`)

    try {
        for (let i = 0; i < tasks.length; i++) {
            // console.log(tasks[i].date)
            let date = tasks[i].date
            // let targetDateTime = new Date(date[0] + 2000, date[1], date[2], date[3], date[4], date[5], 0)
            // console.log(`targetDateTime: ${targetDateTimeYear}-${targetDateTimeMonth}-${targetDateTimeDay} ${targetDateTimeHour}:${targetDateTimeMin}`)
            // console.log(`targetDateTime: ${targetDateTime}`)
            // tasks[i].date.localeCompare(now) <= 0
            if (nowYear == date[0]+2000 &&
                nowMonth == date[1] && 
                nowDay == date[2] &&
                nowHour == date[3] &&
                nowMin == date[4]) {
                console.log(tasks[i].date)
                taskQueue.push(tasks[i])
                tasks[i].date = `${date[0] + 2000}-${date[1]}-${date[2]} ${date[3]}:${date[4]}:${date[5]}`
                await db.collection('TemporalQueue').doc(tasks[i]._id).remove()
            }
        }
    } catch (err) {
        console.log(err)
    }
    for (let i = 0; i < taskQueue.length; i++) {
        console.log(`taskQueue[i].date: ${taskQueue[i].date}`)
        try {
            const result = await cloud.openapi.subscribeMessage.send({
                touser: taskQueue[i].openid,
                page: 'pages/index/index',
                data: {
                    date2: {
                        value: taskQueue[i].date
                    },
                    thing1: {
                        value: taskQueue[i].message
                    }
                },
                templateId: 'aDFqqiWr-YM6VBW4L6O9b-_7gvtdacntQMO0FTxdLCw'
            })
            console.log("send msg success", result)
        } catch (err) {
            console.log("send msg error", err)
            return err
        }
    }
}