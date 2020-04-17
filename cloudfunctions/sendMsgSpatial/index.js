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

            // check if conditions were met (default 2km)
            if(d < 2){
                taskQueue.push(tasks[i])
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