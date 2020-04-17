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
    let currentLocation = event.currentLocation
    let currentLat= event.latitude
    let currentLong = event.longitude

    // get the first 100 messages from spatial message queue
    let taskRes = await db.collection('SpatialQueue').limit(100).get()
    let tasks = taskRes.data
    // extract latitude and longitude of target location
    try{
        for(let i=0; i<tasks.length; i++){
            let task = tasks[i]
            let targetLoc = task.targetLocation
            let targetLat = targetLoc.latitude
            let targetLong = targetLoc.longitude
            // calculate the distance between two points
            let dLat = (targetLat-currentLat) * (Math.PI/180)
            let dLon = (targetLong - currentLong) * (Math.PI / 180)
            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(targetLat*(Math.PI/180)) * Math.cos(currentLat*(Math.PI/180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            let d = r * c // distance in km

            // check if conditions were met
            if(true){
                taskQueue.push(tasks[i])
                await db.collection('SpatialQueue').doc(tasks[i]._id).remove()
            }
        }
    } catch(err){
        console.log(err)
    }
    for (let i = 0; i < taskQueue.length; i++) {
        try {
            const result = await cloud.openapi.subscribeMessage.send({
                touser: taskQueue[i].openid,
                page: 'pages/index/index',
                data: {
                    thing1: {
                        value: taskQueue[i].targetLocation.name
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