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
    let now = new Date() / 1000 | 0
    // console.log(`now: ${now}`)

    try {
        for (let i = 0; i < tasks.length; i++) {
            // console.log(tasks[i].date)
            let date = tasks[i].date
            let targetDateTime = new Date(date[0] + 2000, date[1], date[2], date[3], date[4], date[5], 0) / 1000 | 0
            // console.log(`targetDateTime: ${targetDateTime}`)
            // tasks[i].date.localeCompare(now) <= 0
            if (targetDateTime <= now) {
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