// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const taskQueue = []

    const r = 6371

    // extract current location from parameters passed in
    let lat1= event.latitude
    let lon1 = event.longitude

    // get the first 100 messages from spatial message queue
    let taskRes = await db.collection('SpatialQueue').limit(100).get()
    let tasks = taskRes.data
    // extract latitude and longitude of target location
    try{
        for(let i=0; i<tasks.length; i++){
            let task = tasks[i]
            let targetLoc = task.targetLocation
            let lat2 = targetLoc.latitude
            let lon2 = targetLoc.longitude
            // calculate the distance between two points
            let dLat = (lat2 - lat1) * Math.PI / 180
            let dLon = (lon2 - lon1) * Math.PI / 180
            let a =
                0.5 - Math.cos(dLat) / 2 +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                (1 - Math.cos(dLon)) / 2
            let d = r * 2 * Math.asin(Math.sqrt(a))

            // set sent to false if user leaves the area
            if (d > 2 && tasks[i].sent) {
                try {
                    await db.collection('SpatialQueue').doc(task._id).update({
                        data: {
                            sent: false
                        }
                    })
                } catch (e) {
                    console.error(e)
                }
            }

            // check if conditions were met (default 2km)
            if(d < 2 && !task.sent){
                taskQueue.push(tasks[i])
                try {
                    await db.collection('SpatialQueue').doc(task._id).update({
                        data: {
                            sent: true
                        }
                    })
                } catch (e) {
                    console.error(e)
                }
                // await db.collection('SpatialQueue').doc(tasks[i]._id).remove()
            }
        }
    } catch(err){
        console.log(err)
    }
    for (let i = 0; i < taskQueue.length; i++) {
        try {
            let title = taskQueue[i].title.toString()
            console.log(`thing1: ${taskQueue[i].title}`)
            console.log(`thing2: ${taskQueue[i].message}`)
            const result = await cloud.openapi.subscribeMessage.send({
                touser: taskQueue[i].openid,
                page: 'pages/index/index',
                data: {
                    thing1: {
                        value: title
                    },
                    thing2: {
                        value: taskQueue[i].message
                    }
                },
                templateId: '1x06cU9u9SIMV0Ot-XZIaM6uTiosa13C2Ry3R8hv9iM'
            })
            console.log("send msg success", result)
        } catch (err) {
            console.log("send msg error", err)
            return err
        }
    }
}